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

    afterInitialize: function(){
      this.loadStatuses();
      this.setRefreshInterval();
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
    setRefreshValue: function(v){ this.element.setLabel('refresh', v); this.setRefreshInterval(); }

  });

  Mongo.Twit = ActiveElement.Base.spawn('twit', {

    extend: {
      //Builds a "twit" element from the JSON returned by Twitter
      buildFromJSON: function(st){
        return E('div', {'class':'twit',id:'twit_'+st.id},
          E('h2', {'class':'field username'}, E('a', {href:'http://twitter.com/'+st.user.screen_name}, st.user.screen_name)),
          E('p', {'class':'field message'}, st.text)
        );
      }
    }

  });


})();
