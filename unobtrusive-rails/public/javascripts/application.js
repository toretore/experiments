//TODO: Enable disabled forms onunload
//
Rails = {
  confirmables: [],
  remoteForms: [],
  remoteButtons: [],
  remoteLinks: [],
  findConfirmables: function(scope){
    this.Confirmable.find(scope).each(function(c){ this.confirmables.push(c); }, this);
  },
  findRemoteForms: function(scope){
    this.RemoteForm.find(scope).each(function(f){ this.remoteForms.push(f); }, this);
  },
  findRemoteButtons: function(scope){
    this.RemoteButton.find(scope).each(function(b){ this.remoteButtons.push(b) }, this);
  },
  findRemoteLinks: function(scope){
    this.RemoteLink.find(scope).each(function(l){ this.remoteLinks.push(l); }, this);
  },
  findAll: function(scope){
    this.findConfirmables(scope);
    this.findRemoteForms(scope);
    this.findRemoteButtons(scope);
    this.findRemoteLinks(scope);
  },
  findInScope: function(scope, what){
    return scope ? scope.select(what) : $$(what);
  }
};

Rails.ElementWrapper = Class.create({
  initialize: function(element, methods){
    this.element = element;
    if (methods){ Object.extend(this, methods); }
  }
});


Rails.Confirmable = Class.create(Rails.ElementWrapper, {

  initialize: function($super, element, methods){
    $super(element, methods);
    this.observe();
  },
 
  findEventName: function(){
    var map = Rails.Confirmable.eventMap,
        element = this.element;
    return Object.keys(map).find(function(key){
      return map[key].any(function(tag){
        return element.tagName.toLowerCase() == tag;
      });
    });
  },

  observe: function(){
    var eventName = this.findEventName();
    if (eventName){
      this.element.observe(eventName, function(e){
        if (!this.confirm()) {
          e.stop();
        }
      }.bindAsEventListener(this));
    }
  }

});

Object.extend(Rails.Confirmable, {

  eventMap: {
    'click': ['a', 'input', 'button'],
    'submit': ['form']
  },

  Methods: {
    
    confirm: function(){
      if (!this.isConfirmable()) { return true; }
      return confirm('Are you sure?');
    },

    isConfirmable: function(){
      return this.element.hasClassName('confirm');
    }
  
  }

});

Rails.Confirmable.addMethods(Rails.Confirmable.Methods);

Rails.Confirmable.find = function(s){
  return Rails.findInScope(s, '.confirm:not(.remote)').map(function(el){
    return new Rails.Confirmable(el);
  });
};


Rails.Remote = Class.create(Rails.ElementWrapper, {

  initialize: function($super, element, methods){
    $super(element, methods);
  },
  
  extractUpdateValues: function(status){
    var positions = $w('before after top bottom'),
        element = this.element,
        values = {},
        statuses = status ? [status] : ['success', 'failure'];

    statuses.map(function(s){
      return 'update-'+s;
    }).concat('update').each(function(base){
      positions.map(function(p){
        return base + '-' + p;
      }).concat(base).each(function(attr){
        var value = element.readAttribute(attr);
        if (value) {
          values[attr] = value;
        }
      });
    });

    return values;
  },
  
  extractCallbacks: function(){
    var callbacks = {},
        element = this.element;
    $w('Create Complete Failure Success').each(function(st){
      var val = element.readAttribute('on'+st);
      if (val) { callbacks['on'+st] = val; }
    });
    return callbacks;
  },
  
  updateTargets: function(content, status){
    var values = this.extractUpdateValues(status);
    Object.keys(values).each(function(key){
      var el = $(values[key]);
      if (el){
        var pos = key.match(/before$|after$|top$|bottom$/);
        if (pos) {
          var o = {}; o[pos[0]] = content;
          el.insert(o);
        } else {
          el.update(content);
        }
      }
    });
  },
  
  optionsForRequest: function(){
    var options = Rails.Remote.defaultOptions();
    var callbacks = this.extractCallbacks();
    
    //Bind default callbacks and include any user-provided
    //callbacks in the same function
    Object.keys(options).grep(/^on/).each(function(key){
      var defaultCallback = options[key],
          providedCallback = callbacks[key];
      options[key] = function(request){
        defaultCallback.apply(this, arguments);
        typeof providedCallback == 'function' ?
          providedCallback.apply(this, arguments) :
          eval(providedCallback);
      }.bind(this);
    }, this);

    //Bind user-provided callbacks not already included
    //in a default callback function
    Object.keys(callbacks).each(function(key){
      if (!options[key]) {
        var callback = callbacks[key];
        options[key] = function(request){
          typeof callback == 'function' ? callback.apply(this, arguments) : eval(callback);
        }.bind(this);
      }
    }, this);

    return options;
  }

});

Object.extend(Rails.Remote, {

  defaultOptions: function(){
    return {
      onCreate: function(req){
        this.element.addClassName('loading');
      },
      onSuccess: function(req){
        this.updateTargets(req.responseText, 'success');
      },
      onFailure: function(req){
        this.updateTargets(req.responseText, 'failure');
      },
      onComplete: function(req){
        this.element.removeClassName('loading');
      }
    }
  }

});

Rails.Remote.addMethods(Rails.Confirmable.Methods);


Rails.RemoteForm = Class.create(Rails.Remote, {

  initialize: function($super, element, methods){
    $super(element, methods);
    this.hijack();
  },

  hijack: function(){
    this.element.observe('submit', function(e){
      e.stop();
      if (this.confirm()) {
        this.element.request(this.optionsForRequest());
      }
    }.bindAsEventListener(this));
  }

});

Rails.RemoteForm.find = function(s){
  return Rails.findInScope(s, 'form.remote').map(function(form){
    return new Rails.RemoteForm(form);
  });
};


//GIANT HACK IN THE NAME OF HEAVENLY LORD DRY, THE UNCREATED CREATOR OF RE-USE AND OMNIPRESENT WATCHER AND PUNISHER OF THE SIN OF REPETITION
Rails.RemoteButton = Class.create(Rails.RemoteForm, {

  extractUpdateValues: function(){
    var context = {element:this.element.down('input.remote')};
    return this.constructor.superclass.prototype.extractUpdateValues.apply(context, arguments);
  },

  extractCallbacks: function(){
    var context = {element:this.element.down('input.remote')};
    return this.constructor.superclass.prototype.extractCallbacks.apply(context, arguments);
  },

  isConfirmable: function(){
    var context = {element:this.element.down('input.remote')};
    return this.constructor.superclass.prototype.isConfirmable.apply(context, arguments);
  }

});

Rails.RemoteButton.find = function(s){
  return Rails.findInScope(s, 'form.button-to input.remote').map(function(button){
    return new Rails.RemoteButton(button.up('form'));
  });
};


Rails.RemoteLink = Class.create(Rails.Remote, {

  initialize: function($super, element, methods){
    $super(element, methods);
    this.hijack();
  },
  
  optionsForRequest: function($super){
    var options = $super();
    if (!options.method) {
      options.method = this.element.readAttribute('method') || 'get';
    }
    return options;
  },

  hijack: function(){
    this.element.observe('click', function(e){
      e.stop();
      if (this.confirm()){
        new Ajax.Request(this.element.readAttribute('href'), this.optionsForRequest());
      }
    }.bindAsEventListener(this));
  }

});

Rails.RemoteLink.find = function(s){
  return Rails.findInScope(s, 'a.remote').map(function(el){
    return new this(el);
  }, this);
};



document.observe('dom:loaded', function(){
  Rails.findAll(false);
});
