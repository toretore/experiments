Rails = {
  confirmables: [],
  remoteForms: [],
  findConfirmables: function(){
    this.Confirmable.find().each(function(c){ this.confirmables.push(c); }, this);
  },
  findRemoteForms: function(){
    this.RemoteForm.find().each(function(c){ this.remoteForms.push(c); }, this);
  }
};


Rails.Confirmable = Class.create({

  initialize: function(element){
    this.element = element;
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

Rails.Confirmable.find = function(){
  return $$('.confirm:not(.remote)').map(function(el){
    return new Rails.Confirmable(el);
  });
};


Rails.Remote = Class.create({

  updateAttributes: (function(){
    var attributes = $w('update update-success update-failure');
    var ac = attributes.clone();
    $w('after before top bottom').each(function(mod){
      ac.each(function(a){ attributes.push(a+'-'+mod); });
    });
    return attributes;
  })(),

  initialize: function(element){
    this.element = element;
    this.options = {
      update: { success: {}, failure: {} }
    };
    this.extractOptions();
  },
  
  extractOptions: function(){
    var val, expr = /update$|success$|failure$/;
    this.updateAttributes.each(function(attr){
      if (val = this.element.readAttribute(attr)) {
        if (attr.match(expr)) { attr += '-all'; }
        this.addOptionForUpdate.apply(this, attr.split('-').slice(1).concat(val));
      }
    }, this);
    $w('Complete Failure Success').each(function(st){
      if (val = this.element.readAttribute('on'+st)) {
        this.options['on'+st] = val;
      }
    }, this);
  },
  
  addOptionForUpdate: function(){
    var args = $A(arguments);
    var o = args.length == 3 ? this.options.update[args[0]] : this.options.update;
    o[args.slice(-2)[0]] = args.slice(-1)[0];
  },
  
  updateTargets: function(content, status){
    [this.options.update, this.options.update[status]].each(function(u){
      if (typeof u.all == 'string') { $(u.all).update(content); }
      $w('after before top bottom').each(function(pos){
        if (typeof u[pos] == 'string') {
          var o = {}; o[pos] = content;
          $(u[pos]).insert(o);
        }
      });
    });
  },
  
  optionsForRequest: function(){
    var options = {
      onLoading: function(request){
        this.element.addClassName('loading');
      },
      onSuccess: function(request){
        this.updateTargets(request.responseText, 'success');
      },
      onFailure: function(request){
        this.updateTargets(request.responseText, 'failure');
      },
      onComplete: function(request){
        this.element.removeClassName('loading');
      }
    };

    var remoteForm = this;
    Object.keys(this.options).each(function(key){
      if (key.match(/^on/)){
        var val = remoteForm.options[key];
        var fn = options[key] || Prototype.K;
        options[key] = function(request){
          fn.apply(remoteForm, arguments);
          typeof val == 'string' ? eval(val) : val();
        };
      }
    });

    return options;
  }

});

Rails.Remote.addMethods(Rails.Confirmable.Methods);


Rails.RemoteForm = Class.create(Rails.Remote, {

  initialize: function($super, element){
    $super(element);
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

Rails.RemoteForm.find = function(){
  return $$('form.remote').map(function(form){
    return new Rails.RemoteForm(form);
  });
};



document.observe('dom:loaded', function(){
  Rails.findConfirmables();
  Rails.findRemoteForms();
});
