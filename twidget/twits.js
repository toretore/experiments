if (!window.Mongo) { window.Mongo = {}; }

(function(){

  //Creates Elements
  var E = function(){
    var args = $A(arguments);
    var el = new Element(args[0], args[1]);
    var children = args.slice(2);
    if (children.length) {
      children.each(function(c){
        el.insert({bottom:c});
      });
    }
    return el;
  };


  Mongo.Twits = ActiveElement.Collection.spawn('twit', {

    timelineURL: 'http://twitter.com/statuses/public_timeline.json',

    activate: function(){
      if (!this.get('active')) {
        this.loadStatuses();
        this.setRefreshInterval();
        this.set('active', true);
      }
    },
    
    setStatuses: function(json){
      this.statuses = json;
      this.refreshStatuses(json);
    },

    loadStatuses: function(callbackName){
      //Create a temporary function that can be reached as the
      //callback for the Twitter response
      var callbackName = (new Date()).valueOf();
      var that = this;
      window[callbackName] = function(json){
        that.setStatuses(json);
        delete window[callbackName];
        that.set('loading', false);
      };

      this.set('loading', true);
      this.loadJSON(this.timelineURL, 'window["'+callbackName+'"]');
    },
    
    refreshStatuses: function(json){
      this.element.update();
      json.each(function(st){
        this.element.insert({bottom:Mongo.Twit.buildFromJSON(st)});
      }, this);
      this.items = this.findItems();
    },

    loadJSON: function(src, callbackName){
      if (callbackName) { src += '?callback='+callbackName; }
      this.element.insert({
        bottom: new Element('script', {src:src})
      });
    },
    
    setRefreshInterval: function(){
      this.clearRefreshInterval();
      var interval = this.get('refresh'),
          that = this;
      if (interval) {
        this._refreshInterval = setInterval(function(){
          that.loadStatuses();
        }, interval*60000);
      }
    },
    
    clearRefreshInterval: function(){
      clearTimeout(this._refreshInterval);
    },
    
    getLoadingValue: function(){ return this.element.hasClassName('loading'); },
    setLoadingValue: function(b){ this.element[(b ? 'add' : 'remove')+'ClassName']('loading'); },

    getRefreshValue: function(){ return this.element.getLabel('refresh'); },
    setRefreshValue: function(v){ this.element.setLabel('refresh', v); this.setRefreshInterval(); },
    
    getActiveValue: function(){ return this.element.hasClassName('active'); },
    setActiveValue: function(b){ this.element[(b ? 'add' : 'remove')+'ClassName']('active'); },
    isActive: function(){ return this.get('active'); }

  });


  Mongo.PublicTwits = Mongo.Twits.spawn('twit', {
    afterInitialize: function(){
      this.activate();
    }
  });


  Mongo.PrivateTwits = Mongo.Twits.spawn('twit', {

    timelineURL: 'http://twitter.com/statuses/friends_timeline.json',

    afterInitialize: function(){
      ActiveElement.messages.subscribe('status update sent', function(){
        this.loadStatuses();
      }, this);
    }

  });

  Mongo.Twit = ActiveElement.Base.spawn('twit', {

    extend: {
      //Builds a "twit" element from the JSON returned by Twitter
      buildFromJSON: function(st){
        var time = new Date(st.created_at);
        return E('div', {'class':'twit',id:'twit_'+st.id},
          E('h3', {'class':'field username'}, E('a', {href:'http://twitter.com/'+st.user.screen_name}, st.user.screen_name)),
          E('p', {'class':'meta'},
            'At ',
            E('span', {'class':'field time'}, time.getHours()+':'+time.getMinutes()),
            ' from ',
            E('span', {'class':'field source'}, st.source)
          ),
          E('p', {'class':'field message'}, st.text)
        );
      }
    }

  });



  Mongo.UpdateForm = ActiveElement.Form.spawn('twitter_update', {
  
    extend: {
      findInDocument: function(){
        return new this($('new_twitter_update'));
      },
      attach: function(form){
        Mongo.updateForm = form;
      }
    },

    afterInitialize: function(){
      this.hijack();
    },

    hijack: function(){
      this.element.observe('submit', function(e){
        e.stop();
        this.sendUpdate();
      }.bindAsEventListener(this));
    },
    
    //POST the update to Twitter in an iframe
    sendUpdate: function(){
      var name = 'humbaba'+(new Date()).valueOf();//unique name for the iframe
      var iframe = E('iframe', {style:'display:none', name:name});
      this.element.insert({bottom:iframe});

      var previousTarget = this.element.readAttribute('target');
      this.element.writeAttribute('target', name);//Redirect the form to the iframe

      //Watch the iframe until it's loaded (request complete)
      var interval = setInterval(function(){
        var loaded = false;
        try { iframe.contentWindow.src } catch (e) { loaded = true; } //X-domain raises exception
        if (loaded) {
          clearTimeout(interval);
          iframe.remove();
          this.element.writeAttribute('target', previousTarget);
          ActiveElement.messages.fire('status update sent');
        }
      }.bind(this), 100);

      this.element.submit();
    },

    getActionValue: function(){ return this.element.readAttribute('action'); },
    setActionValue: function(v){ this.element.writeAttribute('action', v); }
  
  });


})();
