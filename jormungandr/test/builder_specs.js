describe('Builder constructor', {

  'Builder constructor should take elements in any order': function(){
    var b = new Builder('p');
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({});
    expect(b.content).should_be(null);

    b = new Builder('p', 'content');
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({});
    expect(b.content.data).should_be('content');

    b = new Builder('p', {foo:'bar'});
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content).should_be(null);

    b = new Builder('p', {foo:'bar'}, 'content');
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content.data).should_be('content');

    b = new Builder('p', 'content', {foo:'bar'});
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content.data).should_be('content');
  },

  'Builder constructor should accept Builder instances and HTMLElements': function(){
    var b = new Builder('p', document.createElement('span'));
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({});
    expect(b.content instanceof HTMLElement).should_be_true();

    b = new Builder('p', new Builder('span'));
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({});
    expect(b.content instanceof HTMLElement).should_be_true();

    b = new Builder('p', {foo:'bar'}, new Builder('span'));
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content instanceof HTMLElement).should_be_true();

    b = new Builder('p', {foo:'bar'}, document.createElement('span'));
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content instanceof HTMLElement).should_be_true();

    b = new Builder('p', new Builder('span'), {foo:'bar'});
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content instanceof HTMLElement).should_be_true();

    b = new Builder('p', document.createElement('span'), {foo:'bar'});
    expect(b.name).should_be('p');
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content instanceof HTMLElement).should_be_true();
  },

  'Builder constructor should accept an array for content': function(){
    var b = new Builder('p', ['foo', new Builder('span'), document.createElement('span')]);
    expect(b.attributes).should_be({});
    expect(b.content).should_have(3, 'items');
    expect(b.content[0].data).should_be('foo');
    expect(b.content[1] instanceof HTMLElement).should_be_true();
    expect(b.content[2] instanceof HTMLElement).should_be_true();

    var b = new Builder('p', {foo:'bar'}, ['foo', new Builder('span'), document.createElement('span')]);
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content).should_have(3, 'items');
    expect(b.content[0].data).should_be('foo');
    expect(b.content[1] instanceof HTMLElement).should_be_true();
    expect(b.content[2] instanceof HTMLElement).should_be_true();

    var b = new Builder('p', ['foo', new Builder('span'), document.createElement('span')], {foo:'bar'});
    expect(b.attributes).should_be({foo:'bar'});
    expect(b.content).should_have(3, 'items');
    expect(b.content[0].data).should_be('foo');
    expect(b.content[1] instanceof HTMLElement).should_be_true();
    expect(b.content[2] instanceof HTMLElement).should_be_true();
  }

});


(function(){

  var b = new Builder('p', {'class':'foo', id:'bar'}, 'omega 3');
  var bb = new Builder('p', {'class':'foo', id:'bar'}, new Builder('ul', [new Builder('li', 'list item 1'), new Builder('li', 'list item 2')]));

  describe('Builder instances', {

    'toDomElement should return a DOM node of the correct type, with the correct attributes and the correct content': function(){
      var el = b.toDomElement();
      expect(el.nodeName.toLowerCase()).should_be('p');
      expect(el.getAttribute('class')).should_be('foo');
      expect(el.getAttribute('id')).should_be('bar');
      expect(el.childNodes).should_have(1, 'items');
      expect(el.childNodes[0].data).should_be('omega 3');

      el = bb.toDomElement();
      expect(el.childNodes).should_have(1, 'items');
      var ul = el.childNodes[0];
      expect(ul.nodeName.toLowerCase()).should_be('ul');
      expect(ul.childNodes).should_have(2, 'items');
      for (var i=0; i<ul.childNodes.length; i++) {
        expect(ul.childNodes[i].nodeName.toLowerCase()).should_be('li');
        expect(ul.childNodes[i].childNodes).should_have(1, 'items');
        expect(ul.childNodes[i].childNodes[0].data).should_be('list item '+(i+1));
      }
    },

    'toHTML should return a string containing the HTML representeation of the node with all of its attributes and children': function(){
      expect(b.toHTML()).should_be('<p class="foo" id="bar">omega 3</p>');
      expect(bb.toHTML()).should_be('<p class="foo" id="bar"><ul><li>list item 1</li><li>list item 2</li></ul></p>');
    },

    'toWrappedDomElement should return a wrapped DOM node': function(){
      var el = b.toWrappedDomElement();
      expect(el.el.nodeName.toLowerCase()).should_be('p');
      expect(el._wrapped).should_be_true();
    }

  });

})();


describe('Builder helper methods', {

  'Builder.dom should return a DOM node built with the arguments passed to the constructor': function(){
    var node = Builder.dom('p', {id:'bar'}, 'content');
    expect(node.nodeName.toLowerCase()).should_be('p');
    expect(node.getAttribute('id')).should_be('bar');
    expect(node.childNodes[0].data).should_be('content');
  },

  'Builder.wrap should return a wrapped DOM node built with the passed arguments': function(){
    var node = Builder.wrap('p', {id:'bar'}, 'content');
    expect(node._wrapped).should_be_true();
    expect(node.el.nodeName.toLowerCase()).should_be('p');
    expect(node.el.getAttribute('id')).should_be('bar');
    expect(node.el.childNodes[0].data).should_be('content');
  },

  '$B should work like Builder.wrap': function(){
    var node = Builder.wrap('p', {id:'bar'}, 'content');
    expect(node._wrapped).should_be_true();
    expect(node.el.nodeName.toLowerCase()).should_be('p');
    expect(node.el.getAttribute('id')).should_be('bar');
    expect(node.el.childNodes[0].data).should_be('content');
  },

  'Global functions named after HTML tags should return a wrapped DOM node of that type (slow-ish)': function(){
    var node;
    "a abbr acronym address area base bdo blockquote body br button caption cite code col colgroup dd del dfn div dl dt em fieldset form h1 h2 h3 h4 h5 h6 head hr html img input ins kbd label legend li link map meta noscript object ol optgroup option p param pre q rb rbc rp rt rtc ruby samp script select span strong style sub sup table tbody td textarea tfoot th thead title tr tt ul var".split(' ').each(function(name){
      node = window['$'+name].call(window, 'p', {id:'foo'}, 'content');
      expect(node._wrapped).should_be_true();
      expect(node.nodeName.toLowerCase()).should_be(name);
      expect(node.el.getAttribute('id')).should_be('foo');
    });
  },

  '$T should return a text node with the provided string as content': function(){
    expect($T('oagadougou').data).should_be('oagadougou');
  }

});
