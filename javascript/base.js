/* Base: Simple base class with getter/setter and event-ish functionality
 *
 * var o = new Base();
 * o.b.listen('foo changed', function(ov, nv){ log('Foo was changed from "'+ov+'" to "'+nv+'"'); });
 * o.set('foo', 'bar'); //Logs 'Foo was changed from "" to "bar"'
 * o.get('foo');
 * o.b.listen('touch', function(){ alert("Can't touch this"); });
 * o.b.fire('touch'); // Alerts */
Base = Class.create({

  initialize: function(){
    this.b = this.broadcaster = new Broadcaster();
    this.b.defaultScope = this;
    this.values = {}; //for getValue/setValue
    this.afterInitialize && this.afterInitialize();
  },
  
  listen: function(){
    return this.b.listen.apply(this.b, arguments);
  },
  fire: function(){
    return this.b.fire.apply(this.b, arguments);
  },

  //Forward all messages to another broadcaster. Will insert this object
  //as the first parameter to upstream listeners. If a namespace is provided,
  //messages will be altered to include this.
  //
  //a.bubble(b);
  //b.listen('foo', function('foo', a, *args){});
  //a.bubble(c, 'a'); //Namespaced
  //c.listen('foo', function('a:foo', a, *args){});
  bubble: function(broadcaster, namespace){
    if (broadcaster.broadcaster) broadcaster = broadcaster.broadcaster; //...yeah
    var source = this;
    this.listen('*', function(/* message, *args */){
      var args = $A(arguments);
      if (namespace) args[0] = namespace + ':' + args[0];
      args.splice(1, 0, source);
      broadcaster.fire.apply(broadcaster, args);
    });
  },

  //Get an attribute. Will use getValueByFunction if a function
  //exists, otherwise will use getValue. If both methods return undefined,
  //attributeNotFound(name) is called and its value is returned.
  get: function(name){
    var value = this.getValueByFunction(name);
    if (typeof value == 'undefined') value = this.getValue(name);
    return typeof value == 'undefined' ? this.attributeNotFound(name) : value;
  },

  //Set an attribute. Will use setValueByFunction if a function
  //exists, otherwise will use setValue. Returns the new value as it's returned
  //by get(name).
  //
  //Fires a "value changed" message, passing the new and old
  //value as parameters.
  //
  //Given a name "foo", fires a "foo value changed" message, passing new and
  //old values.
  set: function(name, value){
    var oldValue = this.get(name);
    this.setValueByFunction(name, value) || this.setValue(name, value);
    var newValue = this.get(name);
    this.b.fire('value changed', name, newValue, oldValue);
    this.b.fire(name+' value changed', newValue, oldValue);
    return newValue;
  },

  //Get a value stored in the internal(-ish) value store
  getValue: function(name){
    return this.values[name];
  },
  //Store or change a value in the internal value store
  setValue: function(name, value){
    this.values[name] = value;
  },

  //This method is called when get('foo') fails to yield a value other than
  //undefined. The default implementation of attributeNotFound is to simply
  //return undefined.
  attributeNotFound: function(name){
    return undefined;
  },

  //Given a name "foo_bar_baz", will look for a method named
  //getFooBarBazValue and return whatever that returns. If the method
  //doesn't exist, undefined is returned.
  getValueByFunction: function(name){
    var fn = this['get'+Base.camelize(name)+'Value'];
    return fn && fn.call(this);
  },
  //Given a name "foo_bar_baz", will look for a method named
  //setFooBarBazValue and call that with value as the only argument.
  //Returns true if the method exists and false otherwise.
  setValueByFunction: function(name, value){
    var fn = this['set'+Base.camelize(name)+'Value'];
    if (fn) { fn.call(this, value); return true; }
    else { return false; }
  }

});



Object.extend(Base, {

  camelize: function(str){
    str = str.dasherize().camelize();
    return str.slice(0,1).toUpperCase() + str.slice(1);
  }

});



/* ElementBase: A simple DOM element wrapper which inherits Base and extends
 * its attribute getter/setter functionality to be able to fetch values
 * from inside the element based on class names. */
ElementBase = Class.create(Base, {

  initialize: function($super, element){
    this.element = element;
    $super();
  },

  //Override getValue to use getValueByElement if possible
  getValue: function($super, name){
    return this.getValueByElement(name) || $super(name);
  },
  //Override to use setValueByElement if possible
  setValue: function($super, name, value){
    this.setValueByElement(name, value) || $super(name, value);
  },

  //Get a value from inside the wrapped element. Returns undefined if no container
  //element is found.
  getValueByElement: function(name){
    var el = this.getElement(name);
    return el && this.extractValueFromElement(el, name);
  },
  //Set the value inside the wrapped element. Returns true if the container
  //element is found, false otherwise.
  setValueByElement: function(name, value){
    var el = this.getElement(name);
    if(el) { this.insertValueInElement(el, value); return true; }
    else { return false; }
  },

  //Find a container element matching the provided name.
  getElement: function(name){
    return this.getElementFromFunction(name) || this.getElementFromSelector(name);
  },
  //Given a name "foo_bar_baz", looks for a method named getFooBarBazElement
  //and returns whatever that returns; otherwise returns undefined.
  getElementFromFunction: function(name){
    var fn = this['get'+Base.camelize(name)+'Element'];
    return fn && fn.call(this);
  },
  //Look up a container element from the supplied name. The default
  //implementation is to look for a child of the wrapped element that
  //matches the selector "."+name. E.g. ".foo_bar_baz". Returns undefined
  //if no element is found.
  getElementFromSelector: function(name){
    return this.element.down('.'+name);
  },

  //Extracts the value from a container element. Default implementation
  //is to use innerHTML.
  extractValueFromElement: function(el){
    return el.innerHTML;
  },
  //Inserts value into a container element. Default implementation is to
  //use innerHTML.
  insertValueInElement: function(el, value){
    el.innerHTML = value;
  },

  //Remove the wrapped element from the DOM and fire a "removed" message.
  remove: function(){
    this.element.remove();
    this.b.fire('removed');
  }

});
