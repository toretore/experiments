if (!window.Blahger) { window.Blahger = {}; }

Blahger.Tab = ActiveElement.Base.spawn('tab', {

  afterInitialize: function(){
    var twits = this.element.down('.twits');
    var type = twits.getLabel('type');
    if (type == 'public') {
      this.twits = new Blahger.PublicTwits(twits);
    } else if (type == 'private') {
      this.twits = new Blahger.PrivateTwits(twits);
    }
  },

  activate: function(){
    this.collection.activateTab(this);
    if (!this.twits.isActive()) { this.twits.activate(); }
  },

  isActive: function(){
    return this.element.hasClassName('active');
  },

  setTitleValue: function(v){
    this.insertValueInElement(this.getElement('title'), v);
    this.listItem && this.listItemLink.update(v);
  }

});

Blahger.Tabs = ActiveElement.Collection.spawn('tab', {

  extend: {
    findInDocument: function(){
      return new this($('tabs'));
    },
    attach: function(tabs){
      Blahger.tabs = tabs;
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
      var link = tab.listItemLink = new Element('a', {href:'#'});
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
