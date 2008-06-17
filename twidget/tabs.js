if (!window.Mongo) { window.Mongo = {}; }

Mongo.Tab = ActiveElement.Base.spawn('tab', {

  afterInitialize: function(){
    this.twits = new Mongo.Twits(this.element);
  },

  activate: function(){
    this.collection.activateTab(this);
  },

  isActive: function(){
    return this.element.hasClassName('active');
  }

});

Mongo.Tabs = ActiveElement.Collection.spawn('tab', {

  extend: {
    findInDocument: function(){
      return new this($('tabs'));
    },
    attach: function(tabs){
      Mongo.tabs = tabs;
    }
  },

  afterInitialize: function(){
    this.activate();
  },
  
  isActive: function(){
    return this.element.hasClassName('active');
  },

  activate: function(){
    if (this.isActive()) { return false; }
    this.element.addClassName('active');
    this._tabList = this.generateList();
    this.element.insert({top:this._tabList});
    this.first().activate();
    return true;
  },
  
  deactivate: function(){
    if (!this.isActive()) { return false; }
    this.element.removeClassName('active');
    this._tabList.remove();
    this.each(function(t){ t.element.removeClassName('active'); });
    return true;
  },

  generateList: function(){
    var ul = new Element('ul', {'class':'tablist'});
    this.each(function(tab){
      var li = new Element('li');
      tab.listItem = li;
      var link = new Element('a', {href:'#'});
      link.update(tab.get('title'));
      li.update(link);
      li.observe('click', function(e){
        e.stop();
        tab.activate();
      });
      ul.insert({bottom:li});
    });
    return ul;
  },

  activateTab: function(tab){
    this.each(function(t){
      [t.element, t.listItem].invoke('removeClassName', 'active');
    });
    [tab.element, tab.listItem].invoke('addClassName', 'active');
  },

  getActive: function(){
    return this.detect(function(t){ return t.isActive(); });
  }

});
