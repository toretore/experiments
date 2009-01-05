
ActiveElement = new JS.Class({

  extend: {
  
    camelize: function(str){
      var camelized = str.dasherize().camelize();
      return camelized.slice(0,1).toUpperCase()+camelized.slice(1);
    },
    
    pluralize: function(str){
      return str+'s';
    },
    
    singularize: function(str){
      return str.slice(0,-1);
    },

    ElementExtensions: {
      getID: function(el, label){
        var id = el.readAttribute('id');
        if (label){
          var match = id.match(new RegExp('^'+label+'_(.+)'));
          return match ? match[1] : null;
        } else {
          return id;
        }
      },
      setID: function(el, id, label){
        el.writeAttribute('id', label ? label+'_'+id : id);
      },
      getLabel: function(el, label, separator){
        separator = separator || ':';
        var m = el.readAttribute('class').match(new RegExp(label+separator+'([^ ]+)'));
        return m ? m[1] : null;
      },
      setLabel: function(el, label, value, separator){
        separator = separator || ':';
        var className = el.readAttribute('class');
        var re = new RegExp('('+label+separator+')([^ ]*)( |$)');
        if (className.match(re)) {//Exists already
          el.writeAttribute('class', className.replace(re, label+separator+value+'$3'));
        } else {
          el.addClassName(label+separator+value);
        }
      }
    },

    //getName shouldn't work when ActiveElement (or an instance of it) is used directly
    getName: function(){ throw('getName not implemented for this class/object'); },
    getPluralName: function(){ return ActiveElement.pluralize(this.getName()); },
    getIdentifier: function(){ return this.getName(); },

    findAndAttachAllClasses: function(){
      this.Collection.getDescendants().each(function(k){ k.findAndAttach(); });
      this.Base.getDescendants().each(function(k){ k.findAndAttach(); });
    },

    getDescendants: function(){
      return this.subclasses.concat(this.subclasses.invoke('getDescendants').flatten());
    },
    
    fetch: function(identifier){
      return this.getDescendants().find(function(k){ return k.getIdentifier() == identifier; }) || null;
    },
  
    fetchOrCreate: function(name){
      return this.fetch(name) || this.spawn(name);
    },

    spawn: function(name, props){
      if (!props) { props = {}; }
      if (!props.extend) { props.extend = {}; }
      if (!props.extend.getName) { props.extend.getName = function(){ return name; }; }
      return new JS.Class(this, props);
    },

    findAndAttach: function(){
      if (Object.isFunction(this.findInDocument)) {
        this.attach(this.findInDocument());
      }
    }

  },

  initialize: function(element){
    this.element = $(element);
    this.states.initial && this.changeState(this.states.initial);
  },
  
  getName: function(){ return this.klass.getName(); },
  getPluralName: function(){ return this.klass.getPluralName(); },

  //Returns the name of the class used to denote a data field
  getAttributeNameClass: function(){
    return 'field';
  },
  
  //Returns an array of names of fields available in this element
  //Field name == the class name directly after attributeNameClass
  getAttributeNames: function(){
    var attributeNameClass = this.getAttributeNameClass();
    if (!attributeNameClass) { return []; }//No attributeNameClass, no way to get attributeNames

    return this.element.select('.'+attributeNameClass).inject([], function(arr ,el){
      var match = el.readAttribute('class').match(new RegExp(attributeNameClass+' ([^ ]+)'));
      if (match) { arr.push(match[1]); }
      return arr;
    });
  },
  
  //Returns an object consisting of attributes names and values,
  //i.e. {title:'First post', content:'Please read my blag'}
  getAttributes: function(){
    var attributes = this.getAttributeNames(),
        args = $A(arguments);

    if (args.length) {
      attributes = attributes.select(function(k){
        return args.include(k);
      });
    }
    
    return attributes.inject({}, function(o,p){
      o[p] = this.get(p);
      return o;
    }, this);
  },
  
  //Returns the same as getAttributes, but wraps the key names as "<getName>[<key>]",
  //i.e. "user[name]" = "Bobby-Bob Bobson"
  //Takes 1 or 2 arguments
  //When given a single argument, it can be either a string used as a scope name, or an
  //array with key names that are passed to getAttributes as parameters
  //When given 2 arguments, the first is the string and the second is the array
  getScopedAttributes: function(){
    var args = $A(arguments);
    var name = Object.isString(args[0]) ? args[0] : this.getName();
    var attributes = this.getAttributes.apply(this, args.find(function(e){ return Object.isArray(e); }) || []);

    return Object.keys(attributes).inject({}, function(o,p){
      o[name+'['+p+']'] = attributes[p];
      return o;
    });
  },

  //Returns a CSS selector for +name+ that can be used with element.down() to return
  //the descendant element which has the field +name+
  getFieldSelector: function(name){
    var attributeNameClass = this.getAttributeNameClass();
    attributeNameClass = attributeNameClass ? '.'+attributeNameClass : ''
    return attributeNameClass+'.'+name;
  },

  //Returns the element for the field name +name+
  getElement: function(name){
    return this.getElementFromFunction(name) || this.getElementFromSelector(name);
  },
  
  //Returns the object (element) from a custom function named +getNameElement+
  //where "Name" if the camelized field name passed into this function
  //If the function doesn't exist, false is returned
  //Example: getElementFromFunction('author_name') will try to call getAuthorNameElement
  getElementFromFunction: function(name){
    var fnName = 'get'+ActiveElement.camelize(name)+'Element';
    return Object.isFunction(this[fnName]) && this[fnName](name);
  },

  //Returns the first descendant element that matches the selector
  //returned by getFieldSelector(name)
  getElementFromSelector: function(name){
    return this.element.down(this.getFieldSelector(name));
  },

  //Returns the value of the field with the name +name+
  get: function(name){
    try {
      return this.getValueFromFunction(name)
    } catch (e) {
      if (e == 'nofunction') {
        return this.getValueFromElement(name);
      } else {
        throw(e);
      }
    }
  },
  
  //Returns the value of +getName+ where Name is the name of
  //the field, camelized. Returns false if getName doesn't exist.
  //This is called by +get+
  //Example: get('title') will try to call getTitle
  getValueFromFunction: function(name){
    var fnName = 'get'+ActiveElement.camelize(name)+'Value';
    if (Object.isFunction(this[fnName])){
      return this[fnName](name);
    } else {
      //We don't want to use true/false for this because the method could
      //be designed to return a boolean
      throw('nofunction');
    }
  },
  
  //Returns the value of an element, looking up the element with
  //getElement and passing it to extractValueFromElement
  getValueFromElement: function(name){
    return this.extractValueFromElement(this.getElement(name));
  },

  //Returns the value based on an element
  //Default implementation is to use innerHTML, but this could
  //be changed to for example element.value for form elements
  extractValueFromElement: function(element){
    return element && element.innerHTML;
  },

  //Sets the value of the field with the name +name+
  set: function(name, value){
    this.setValueWithFunction(name, value) || this.setValueWithSelector(name, value);
    return this.get(name);
  },

  //Uses +setName+ to set the value of the field with the name +name+
  //Returns false if setName doesn't exist. This is called by +set+
  //Example: set('title') will try to call setTitle(value)
  setValueWithFunction: function(name, value){
    var fnName = 'set'+ActiveElement.camelize(name)+'Value';
    if (Object.isFunction(this[fnName])) {
      this[fnName](value);
      return true;
    } else {
      return false;
    }
  },

  //Gets the element identified by +name+ using getElement(name)
  //and sets its value with insertValueInElement
  setValueWithSelector: function(name, value){
    this.insertValueInElement(this.getElement(name), value);
  },

  //Sets the value of an element. Default implementation is to use
  //element.update(value), but could be change to e.g. element.value = value
  insertValueInElement: function(element, value){
    element.update(value);
  },

  remove: function(){
    this.element.remove();
  },


  /*****
   * FSM
   ************/

  states: {},

  changeState: function(state){
    var next = this.states[state];
    if (next) {
      var current = this.states[this.state];
      current && current.onExit && current.onExit.call(this, state);
      next.onEnter && next.onEnter.call(this, this.state);
      this.state = state;
    }
  },

  action: function(name){
    var state = this.states[this.state];
    state && state[name] && state[name].call(this);
  }

});

Element.addMethods(ActiveElement.ElementExtensions);


//Very simple messaging system
ActiveElement.extend({

  messages: {

    subscriptions: {},

    subscribe: function(message, callback, scope){
      if (!this.subscriptions[message]) { this.subscriptions[message] = []; }
      this.subscriptions[message].push({callback: callback, scope: scope});
    },
    
    unsubscribe: function(message, callback){
      var s = this.subscriptions;
      if (s[message]) {
        s[message].each(function(o, i){
          if (o.callback == callback) { s[message].splice(i,1); }
        });
      }
    },

    fire: function(message){
      if (this.subscriptions[message]) {
        var args = $A(arguments).slice(1);
        this.subscriptions[message].each(function(o){
          o.callback.apply(o.scope || window, args)
        });
      }
    }

  }

});




/****
 * Base
 ****************/


ActiveElement.Base = new JS.Class(ActiveElement, {

  extend: {

    getName: function(){ return 'item'; },

    attach: function(something){
      ActiveElement[this.getIdentifier()] = something;
    },

    find: function(id){
      var el = $(this.getName()+'_'+id);
      return el ? new this(el) : null;
    },

    //This will probably cause more problems than it solves
    findBy: function(property, value){
      var el = $$('.'+this.getPluralName()+' .'+this.getName()).detect(function(e){
        var f = e.down('.'+property);
        return f && f.innerHTML == value;
      });
      return el && new this(el);
    }

  },

  initialize: function(){
    this.callSuper();
    Object.isFunction(this.afterInitialize) && this.afterInitialize();
  },
  
  getID: function(label){
    return this.element.getID(label || this.getName());
  },

  setID: function(id, label){
    this.element.setID(id, label || this.getName());
    return this.getID(label);
  },
  
  //So you can do get/set('id')
  getIdValue: function(){ return this.getID(); },
  setIdValue: function(id){ this.setID(id); },
  
  toParam: function(){
    return this.getID();
  },

  //Will rewrite itself to use the available method
  generateURL: function(){
    this.generateURL = window.Routes ? this.generateURLFromRoutes : this.generateURLFromNothing;
    return this.generateURL.apply(this, arguments);
  },

  //Will use Routes [http://tore.darell.no/pages/javascript_routes]
  //to create a URL for this element
  generateURLFromRoutes: function(){
    var params = arguments[0] || {};
    var options = arguments[1] || {};
    if (typeof params.id === 'undefined') { params.id = this.toParam(); }
    return Routes[this.getName()].call(Routes, params, options);
  },

  //Will create a RESTful URL based on the plural name of this
  //element and its ID (or toParam)
  generateURLFromNothing: function(){
    return '/'+this.getPluralName()+'/'+this.toParam();
  },

  update: function(){
    var url, options;
    if (Object.isString(arguments[0])) {
      url = arguments[0];
      options = arguments[1] || {};
    } else {
      url = this.generateURL();
      options = arguments[0] || {};
    }

    options = Object.extend({
      method: 'put',
      parameters: this.getScopedAttributes()
    }, options);

    return new Ajax.Request(url, options);
  },

  removeFromCollection: function(){
    if (this.collection){
      this.collection.removeItem(this);
    }
  },

  remove: function(){
    this.removeFromCollection();
    this.callSuper();
  }

});





/*****
 * Collection
 *****************/


ActiveElement.Collection = new JS.Class(ActiveElement, {

  include: Enumerable,

  //Class methods/properties
  extend: {
  
    getName: function(){ return 'item'; },

    fetchBaseClass: function(){
      return ActiveElement.Base.fetchOrCreate(this.getIdentifier());
    },

    attach: function(something){
      ActiveElement[this.getPluralName()] = something;
    },
    
    findInDocument: function(){
      var el = $(this.getPluralName());
      return el ? new this(el) : null;
    }

  },


  initialize: function(){
    this.callSuper();
    this.items = this.findItems();
    Object.isFunction(this.afterInitialize) && this.afterInitialize();
  },

  findElements: function(){
    return this.element.select('.'+this.getName());
  },

  findItems: function(){
    var baseClass = this.klass.fetchBaseClass();
    return this.findElements().map(function(e){
      var item = new baseClass(e);
      item.collection = this;
      return item;
    }.bind(this));
  },
  
  findBy: function(property, value){
    return this.detect(function(item){
      return item.get(property) == value;
    });
  },
  
  find: function(){
    var args = $A(arguments);
    args.unshift('id');
    return this.findBy.apply(this, args);
  },

  _each: function(fn){
    return this.items.each(fn);
  },

  at: function(index){
    return this.items[index];
  },

  removeItem: function(item){
    this.items.splice(this.items.indexOf(item), 1);
  }

});

//Delegate some methods (that aren't in Enumerable) to the items array
ActiveElement.Collection.include(
  ['first', 'last'].inject({}, function(o,m){
    o[m] = function(){ return this.items[m].apply(this.items, arguments); };
    return o;
  })
);



/****
 * Form
 **************/


ActiveElement.Form = new JS.Class(ActiveElement.Base, {

  isNewRecord: function(){
    return this.element.hasClassName('new_'+this.getName());
  },

  getID: function(){
    return this.element.getID('edit_'+this.getName());
  },

  setID: function(id){
    this.element.setID(id, 'edit_'+this.getName());
    //If ID gets set, record is no longer new. If ID gets "unset", it's new again
    this.element[id ? 'removeClassName' : 'addClassName']('new_'+this.getName());
    this.element[id ? 'addClassName' : 'removeClassName']('edit_'+this.getName());
  },

  getFieldSelector: function(name){
    return '#'+this.getName()+'_'+name;
  },
  
  getAttributeNames: function(){
    return this.element.getElements().inject([], function(arr,el){
      var id = el.readAttribute('id');
      var match = id && id.match(new RegExp(this.getName()+'_(.+)'));
      if (match) { arr.push(match[1]); }
      return arr;
    }, this);
  },

  extractValueFromElement: function(element){
    return element.getValue();
  },

  insertValueInElement: function(element, value){
    element.value = value;
  },

  generateURLFromNothing: function(){
    return this.isNewRecord() ? '/'+this.getPluralName() : this.callSuper();
  },

  generateURLFromRoutes: function(){
    return this.isNewRecord() ? Routes[this.getPluralName()]() : Routes[this.getName()](this.getID());
  },

  reset: function(){
    this.element.reset();
  }

});



//IE seems to have problems with document.observe('dom:loaded')
Event.observe(window, 'load', function(){
  ActiveElement.findAndAttachAllClasses();
});
