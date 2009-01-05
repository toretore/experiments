if (!window.Blahger) { window.Blahger = {}; }

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


  Blahger.Twits = ActiveElement.Collection.spawn('twit', {

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
      //Create a temporary global function that can be reached as the
      //callback for the Twitter response
      var callbackName = 'twidget_'+(new Date()).valueOf();
      window[callbackName] = function(json){
        this.setStatuses(json);
        delete window[callbackName];
        this.set('loading', false);
      }.bind(this);

      this.set('loading', true);
      this.loadJSON(this.timelineURL, callbackName);
    },
    
    refreshStatuses: function(json){
      var odd = false;
      this.element.update();
      json.each(function(st){
        var twit = Blahger.Twit.buildFromJSON(st);
        twit.addClassName((odd = !odd) ? 'odd' : 'even');
        this.element.insert({bottom:twit});
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


  Blahger.PublicTwits = Blahger.Twits.spawn('twit', {
    afterInitialize: function(){
      this.activate();
    }
  });


  Blahger.PrivateTwits = Blahger.Twits.spawn('twit', {

    timelineURL: 'http://twitter.com/statuses/friends_timeline.json',

    afterInitialize: function(){
      ActiveElement.messages.subscribe('status update sent', function(){
        this.loadStatuses();
      }, this);
    }

  });

  Blahger.Twit = ActiveElement.Base.spawn('twit', {

    extend: {
      //Builds a "twit" element from the JSON returned by Twitter
      buildFromJSON: function(st){
        var time = new Date(st.created_at);
        return E('div', {'class':'twit',id:'twit_'+st.id},
          E('img', {src:st.user.profile_image_url, 'class':'profile', width:'48', height:'48'}),
          E('h3', {'class':'field username'},
            E('a', {href:'http://twitter.com/'+st.user.screen_name}, st.user.screen_name)
          ),
          E('p', {'class':'meta'},
            'at ',
            E('span', {'class':'field time'}, time.getHours()+':'+time.getMinutes()),
            ' from ',
            E('span', {'class':'field source'}, st.source)
          ),
          E('p', {'class':'field message'}, st.text)
        );
      }
    }

  });



  Blahger.UpdateForm = ActiveElement.Form.spawn('twitter_update', {
  
    extend: {
      findInDocument: function(){
        return new this($('new_twitter_update'));
      },
      attach: function(form){
        Blahger.updateForm = form;
      }
    },

    afterInitialize: function(){
      this.hijack();
      var input = this.getElement('status')
      input.observe('focus', function(){
        if (!input.changed) {
          input.changed = true;
          input.value = '';
        }
      });
    },

    hijack: function(){
      if (!this._onSubmitHandler) {
        this._onSubmitHandler = function(e){
          e.stop();
          this.sendUpdate();
        }.bindAsEventListener(this);
      }
      this.element.observe('submit', this._onSubmitHandler);
    },
    
    //POST the update to Twitter in an iframe
    sendUpdate: function(){
      this.element.insert({bottom: E('script', {src:'http://twitter.com/statuses/update.json?_method=post&status=test'})});
    },

    getActionValue: function(){ return this.element.readAttribute('action'); },
    setActionValue: function(v){ this.element.writeAttribute('action', v); }
  
  });


})();
