//Don't run unless this window has been loaded in an iframe
if (window != parent) {

window.onload = function(){


  parent.describe('Querying', {

    '$E should return an array': function(){
      parent.expect($E('#list')).should_be([document.getElementById('list')]);
    },

    '$E should not wrap array': function(){
      parent.expect($E('#list')._wrapped).should_be(undefined);
    },

    '$E should not wrap elements': function(){
      parent.expect($E('#list')[0]._wrapped).should_be(undefined);
    },
    
    '$E should flatten argument list and result': function(){
      var res = $E('#list .one', 'li.two', '.three');
      parent.expect(res).should_have(3, 'items');
    },
    
    '$E should return non-string elements untouched': function(){
      var res = $E('#list', $E('li.one')[0]);
      parent.expect(res).should_have(2, 'items');
      parent.expect(res[0]).should_be(document.getElementById('list'));
      parent.expect(res[1]).should_be(document.getElementById('list_item_1'));
    },

    '$ should return an array': function(){
      var res = $('#list');
      parent.expect(res[0].el).should_be(document.getElementById('list'));
    },

    '$ should wrap array': function(){
      parent.expect($('#list')._wrapped).should_be_true();
    },

    '$ should wrap elements': function(){
      parent.expect($('#list')[0]._wrapped).should_be_true();
    },

    '$ should not wrap already wrapped elements': function(){
      parent.expect($(list)[0].el._wrapped).should_be(undefined);
    }

  });


  (function(){

    var list = $('#list')[0];
    var link = $('#list_item_2_link')[0];

    parent.describe('Simple methods on single element', {

      'hasClass should return true if the element has the class, false if not': function(){
        parent.expect(list.hasClass('list')).should_be_true();
        parent.expect(list.hasClass('numbers')).should_be_true();
        parent.expect(list.hasClass('julebrus')).should_be_false()
      },

      'getX should return a number': function(){
        parent.expect(typeof list.getX()).should_be('number');
      },

      'getY should return a number': function(){
        parent.expect(typeof list.getY()).should_be('number');
      },

      'getXY should return an array with two numbers': function(){
        parent.expect(list.getXY()).should_have(2, 'items');
        parent.expect(typeof list.getXY()[0]).should_be('number');
        parent.expect( typeof list.getXY()[1]).should_be('number');
      },

      'getStyle should return the elements value for the style attribute passed': function(){
        parent.expect(list.getStyle('width')).should_match(/^\d+px$/);
      },

      'inDocument should return true if the element is attached to the document, false if not': function(){
        parent.expect(list.inDocument()).should_be_true();
      },

      'isAncestor should return true depending on if the supplied element is the ancestor of this element or not': function(){
        parent.expect(YAHOO.util.Dom.isAncestor(list.el, link.el)).should_be_true();
        parent.expect(YAHOO.util.Dom.isAncestor(link.el, list.el)).should_be_false();
      },

      'isDescendant should return true depending on if the supplied element is the descendant of this element or not': function(){
        parent.expect(link.isDescendant(list)).should_be_false();
        parent.expect(list.isDescendant(link)).should_be_true();
      },

      'getClassName should return the full value of the elements "class" attribute': function(){
        parent.expect(list.getClassName()).should_be('list numbers');
      },

      'replaceClass should replace a class name (first arg) with another (second arg) or add it (2) if it (1) doesnt exist': function(){
        list.addClass('sausage');
        parent.expect(list.hasClass('sausage')).should_be_true();
        list.replaceClass('sausage', 'wurst');
        parent.expect(list.hasClass('sausage')).should_be_false();
        parent.expect(list.hasClass('wurst')).should_be_true();
        list.removeClass('wurst');
        parent.expect(list.hasClass('wurst')).should_be_false();
        parent.expect(list.getClassName()).should_be('list numbers');
      },

      'toggleClass should add the supplied class name if it is not present or remove it if it is': function(){
        parent.expect(list.hasClass('sausage')).should_be_false();
        list.toggleClass('sausage');
        parent.expect(list.hasClass('sausage')).should_be_true();
        list.toggleClass('sausage');
        parent.expect(list.hasClass('sausage')).should_be_false();
        parent.expect(list.getClassName()).should_be('list numbers');
      },

      'getClassLabel should return "bar" in a class name "foo:bar" when the first argument is "foo", null if not': function(){
        list.addClass('foo:bar');
        parent.expect(list.getClassLabel('foo')).should_be('bar');
        parent.expect(list.getClassLabel('humbaba')).should_be(null);
      }

    });


    parent.describe('Methods that return a single wrapped DOM element', {
    
      'getAncestorByClassName should return the first ancestor element which has the given class name': function(){
        var anc = link.getAncestorByClassName('list');
        parent.expect(anc.id).should_be(list.id);
        parent.expect(anc._wrapped).should_be_true();
        parent.expect(link.getAncestorByClassName('humbaba')).should_be(null);
      },

      'getAncestorByTagName should return the first ancestor element which hash the given tag name': function(){
        var anc = link.getAncestorByTagName('ul');
        parent.expect(anc.id).should_be(list.id);
        parent.expect(anc._wrapped).should_be_true();
        parent.expect(link.getAncestorByTagName('a')).should_be(null);
      },

      'getFirstChild should return first child': function(){
        var child = $('li.two')[0].getFirstChild();
        parent.expect(child.id).should_be(link.id);
        parent.expect(child._wrapped).should_be_true();
        parent.expect($('li.three')[0].getFirstChild()).should_be(null);
      },

      'getLastChild should return last child': function(){
        var child = list.getLastChild();
        parent.expect(child.id).should_be('list_item_4');
        parent.expect(child._wrapped).should_be_true();
        parent.expect(child.getLastChild()).should_be(null);
      },

      'getNextSibling should return next sibling': function(){
        var sibling = $('#list_item_1')[0].getNextSibling();
        parent.expect(sibling.id).should_be('list_item_2');
        parent.expect(sibling._wrapped).should_be_true();
        parent.expect($('#list_item_4')[0].getNextSibling()).should_be(null);
      },

      'getPreviousSibling should return previous sibling': function(){
        var sibling = $('#list_item_3')[0].getPreviousSibling();
        parent.expect(sibling.id).should_be('list_item_2');
        parent.expect(sibling._wrapped).should_be_true();
        parent.expect($('#list_item_1')[0].getPreviousSibling()).should_be(null);
      },

      'getFirstChildBy should get the first child for which the supplied filter function returns true': function(){
        var child = list.getFirstChildBy(function(c){ return c.tagName.toLowerCase() === 'li'; });
        parent.expect(child.id).should_be('list_item_1');
        parent.expect(child._wrapped).should_be_true();
        parent.expect(list.getFirstChildBy(function(c){ return false; })).should_be(null);
      },

      'getLastChildBy should get the last child for which the supplied filter function returns true': function(){
        var child = list.getLastChildBy(function(c){ return c.nodeName.toLowerCase() === 'li'; });
        parent.expect(child.id).should_be('list_item_4');
        parent.expect(child._wrapped).should_be_true();
        parent.expect(list.getLastChildBy(function(c){ return false; })).should_be(null);
      },

      'getNextSiblingBy should get the next sibling for which the supplied filter function returns true': function(){
        var child = list.getFirstChild().getNextSiblingBy(function(c){ return c.nodeName.toLowerCase() === 'li'; });
        parent.expect(child.id).should_be('list_item_2');
        parent.expect(child._wrapped).should_be_true();
        parent.expect(list.getFirstChild().getNextSiblingBy(function(c){ return false; })).should_be(null);
      },

      'getPreviousSiblingBy should get the previous sibling for which the supplied filter function returns true': function(){
        var sibling = link.getParent().getPreviousSiblingBy(function(c){ return c.nodeName.toLowerCase() === 'li'; });
        parent.expect(sibling.id).should_be('list_item_1');
        parent.expect(sibling._wrapped).should_be_true();
        parent.expect(list.getFirstChild().getPreviousSiblingBy(function(){ return true; })).should_be(null);
      },

      'getAncestorBy should return the first ancestor for which the supplied filter function returns true': function(){
        var ancestor = link.getAncestorBy(function(a){ return a.nodeName.toLowerCase() == 'li' });
        parent.expect(ancestor.id).should_be('list_item_2');
        parent.expect(ancestor._wrapped).should_be_true();
        ancestor = link.getAncestorBy(function(a){ return a.nodeName.toLowerCase() == 'ul' });
        parent.expect(ancestor.id).should_be('list');
        ancestor = link.getAncestorBy(function(){ return false; });
        parent.expect(ancestor).should_be(null);
      },

      'getParent should return the parent node and wrap it': function(){
        var p = link.getParent();
        parent.expect(p.id).should_be('list_item_2');
      }
    
    });


    parent.describe('Methods that return a list of wrapped DOM elements', {
    
      'getChildrenBy should return an array of children filtered by the provided function': function(){
        var children = list.getChildrenBy(function(c){ return c.hasClass('odd'); });
        parent.expect(children).should_have(2, 'items');
        parent.expect(children._wrapped).should_be_true();
        parent.expect(children[0].id).should_be('list_item_1');
        parent.expect(children[1].id).should_be('list_item_3');
      },

      'getChildren should return an array of all children': function(){
        var children = list.getChildren();
        parent.expect(children).should_have(4, 'items');
        parent.expect(children._wrapped).should_be_true();
        for (var i=0; i<4; i++) {
          parent.expect(children[i].id).should_be('list_item_'+(i+1));
        }
      },

      'getElements should return an array of all descendants': function(){
        var descendants = list.getElements();
        parent.expect(descendants).should_have(5, 'items');
        parent.expect(descendants._wrapped).should_be_true();
      },

      'getElementsBy should return an array of descendants for which the supplied filter function returns true': function(){
        var descendants = list.getElementsBy(function(e){ return e.nodeName.toLowerCase() === 'li'; });
        parent.expect(descendants).should_have(4, 'items');
        parent.expect(descendants._wrapped).should_be_true();
        for (var i=0; i<4; i++) {
          parent.expect(descendants[i].id).should_be('list_item_'+(i+1));
        }
        var descendants = list.getElementsBy(function(e){ return e.nodeName.toLowerCase() === 'a'; });
        parent.expect(descendants).should_have(1, 'items');
        parent.expect(descendants[0].id).should_be('list_item_2_link');
      },

      'getElementsByTagName should return an array of elements with the supplied tagName': function(){
        var descendants = list.getElementsByTagName('li');
        parent.expect(descendants).should_have(4, 'items');
        parent.expect(descendants._wrapped).should_be_true();
        for (var i=0; i<4; i++) {
          parent.expect(descendants[i].id).should_be('list_item_'+(i+1));
        }
        var descendants = list.getElementsByTagName('a');
        parent.expect(descendants).should_have(1, 'items');
        parent.expect(descendants[0].id).should_be('list_item_2_link');
      },

      'getElementsByClassName should return an array of elements that have the supplied class name': function(){
        var descendants = list.getElementsByClassName('foo');
        parent.expect(descendants).should_have(3, 'items');
        parent.expect(descendants._wrapped).should_be_true();
        parent.expect(descendants[0].id).should_be('list_item_1');
        parent.expect(descendants[1].id).should_be('list_item_2');
        parent.expect(descendants[2].id).should_be('list_item_2_link');
      }
    
    });


    (function(){

      var list = $('#list')[0];

      parent.describe('CSS manipulation methods', {
      
        "hide should set the element's 'display' property to 'none'": function(){
          list.hide();
          parent.expect(list.style.display).should_be('none');
        },

        "show should set the element's 'display' property to ''": function(){
          list.show();
          parent.expect(list.style.display).should_be('');
        },

        'visible should return false or true depending on if the element\'s "display" property is "none" or note': function(){
          list.hide();
          parent.expect(list.visible()).should_be_false();
          list.show();
          parent.expect(list.visible()).should_be_true();
        },

        'toggle should set the elements "display" property to "none" or "" depending on if its visible or not': function(){
          list.hide();
          parent.expect(list.visible()).should_be_false();
          list.toggle();
          parent.expect(list.visible()).should_be_true();
          list.toggle();
          parent.expect(list.visible()).should_be_false();
        },

        'conceal should set the elements "visibility" property to "hidden"': function(){
          list.conceal();
          parent.expect(list.style.visibility).should_be('hidden');
        },

        'reveal should set the elements "visibility" property to ""': function(){
          list.reveal();
          parent.expect(list.style.visibility).should_be('');
        },

        'setStyle should set the elements style with the property name supplied as first argument to the value supplied as second argument': function(){
          list.setStyle('border-left-style', 'dashed');
          parent.expect(list.style.borderLeftStyle).should_be('dashed');
          list.setStyle('borderLeftStyle', 'solid');
          parent.expect(list.style.borderLeftStyle).should_be('solid');
        },

        'setStyles should set the elements styles with the supplied object\'s property names and values': function(){
          list.setStyles({'border-left-style': 'dashed', borderRightStyle: 'dotted'});
          parent.expect(list.style.borderLeftStyle).should_be('dashed');
          parent.expect(list.style.borderRightStyle).should_be('dotted');
        }
      
      });

    })();


    (function(){

      var list = $('#list')[0];
      var listCopy = list.el.cloneNode(true);
    
      parent.describe('DOM manipulation', {

        //restore list
        'before each': function(){
          while (list.el.childNodes.length) { list.el.removeChild(list.el.childNodes[0]); }
          parent.expect(list.el.childNodes.length).should_be(0);
          for (var i=0; i<listCopy.childNodes.length; i++) {
            list.el.appendChild(listCopy.childNodes[i].cloneNode(true));
          }
          parent.expect(list.getChildren()).should_have(4, 'items');
        },
      
        'remove should remove the element from the document': function(){
          parent.expect(list.getChildren()).should_have(4, 'items');
          var li = list.getLastChild();
          li.remove();
          parent.expect(li.parentNode).should_be(null);
          parent.expect(list.getChildren()).should_have(3, 'items');
        },
        
        'removeChildren should remove this elements children': function(){
          list.removeChildren();
          parent.expect(list.childNodes).should_be_empty();
        },
        
        'replaceChildren should remove this elements children, if any, and insert the supplied elements in their place': function(){
          var li1 = document.createElement('li');
          li1.id = 'temp_li_1';
          var li2 = document.createElement('li');
          li2.id = 'temp_li_2';
          list.replaceChildren(li1, li2);
          var children = list.getChildren();
          parent.expect(children).should_have(2, 'items');
          parent.expect(children[0].id).should_be('temp_li_1');
          parent.expect(children[1].id).should_be('temp_li_2');
        },
        
        'appendChild should append the supplied element after all the elements existing children': function(){
          var li = document.createElement('li');
          li.id = 'nebuchadnezzar';
          list.appendChild(li);
          parent.expect(list.getChildren()).should_have(5, 'items');
          parent.expect(list.getLastChild().id).should_be(li.id);
        },
        
        'insertBefore should insert the supplied elements before this element': function(){
          var li1 = document.createElement('li');
          li1.id = 'temp_li_1';
          var li2 = document.createElement('li');
          li2.id = 'temp_li_2';
          var li = list.getFirstChild();
          li.insertBefore(li1, li2);
          var children = list.getChildren();
          parent.expect(children).should_have(6, 'items');
          parent.expect(children[0].id).should_be('temp_li_1');
          parent.expect(children[1].id).should_be('temp_li_2');
          parent.expect(children[2].id).should_be('list_item_1');
        },
        
        'insertAfter should insert the supplied elements after this elements': function(){
          var li1 = document.createElement('li');
          li1.id = 'temp_li_1';
          var li2 = document.createElement('li');
          li2.id = 'temp_li_2';
          var li = list.getFirstChild();
          li.insertAfter(li1, li2);
          var children = list.getChildren();
          parent.expect(children).should_have(6, 'items');
          parent.expect(children[1].id).should_be('temp_li_1');
          parent.expect(children[2].id).should_be('temp_li_2');
          parent.expect(children[0].id).should_be('list_item_1');
        },
        
        'addBefore should add this element before the supplied element': function(){
          var newLi = $(document.createElement('li'))[0];
          newLi.el.id = 'temp_li_1';
          var li = list.getFirstChild();
          newLi.addBefore(li);
          var children = list.getChildren();
          parent.expect(children).should_have(5, 'items');
          parent.expect(children[0].id).should_be('temp_li_1');
          parent.expect(children[1].id).should_be('list_item_1');
        },
        
        'addAfter should add this element after the supplied element': function(){
          var newLi = $(document.createElement('li'))[0];
          newLi.el.id = 'temp_li_1';
          var li = list.getFirstChild();
          newLi.addAfter(li);
          var children = list.getChildren();
          parent.expect(children).should_have(5, 'items');
          parent.expect(children[1].id).should_be('temp_li_1');
          parent.expect(children[0].id).should_be('list_item_1');
        },
        
        'insertTop should insert the supplied elements before any children of this elements': function(){
          var li1 = document.createElement('li');
          li1.id = 'temp_li_1';
          var li2 = document.createElement('li');
          li2.id = 'temp_li_2';
          list.insertTop(li1, li2);
          var children = list.getChildren();
          parent.expect(children).should_have(6, 'items');
          parent.expect(children[0].id).should_be('temp_li_1');
          parent.expect(children[1].id).should_be('temp_li_2');
          //Add items when empty
          list.removeChildren();
          list.insertTop(li1, li2);
          children = list.getChildren();
          parent.expect(children).should_have(2, 'items');
          parent.expect(children[0].id).should_be('temp_li_1');
          parent.expect(children[1].id).should_be('temp_li_2');
        },
        
        'insertBottom should insert the supplied elements after any children of this elements': function(){
          var li1 = document.createElement('li');
          li1.id = 'temp_li_1';
          var li2 = document.createElement('li');
          li2.id = 'temp_li_2';
          list.insertBottom(li1, li2);
          var children = list.getChildren();
          parent.expect(children).should_have(6, 'items');
          parent.expect(children[4].id).should_be('temp_li_1');
          parent.expect(children[5].id).should_be('temp_li_2');
          //Add items when empty
          list.removeChildren();
          list.insertBottom(li1, li2);
          children = list.getChildren();
          parent.expect(children).should_have(2, 'items');
          parent.expect(children[0].id).should_be('temp_li_1');
          parent.expect(children[1].id).should_be('temp_li_2');
        },
        
        'addTop should add this item before any children of the supplied element': function(){
          var newLi = $(document.createElement('li'))[0];
          newLi.el.id = 'temp_li';
          newLi.addTop(list);
          parent.expect(list.getChildren()).should_have(5, 'items');
          parent.expect(list.getChildren()[0].id).should_be('temp_li');
          //when empty
          list.removeChildren();
          newLi.addTop(list);
          parent.expect(list.getChildren()).should_have(1, 'items');
          parent.expect(list.getChildren()[0].id).should_be('temp_li');
        },
        
        'addBottom should add this item before any children of the supplied element': function(){
          var newLi = $(document.createElement('li'))[0];
          newLi.el.id = 'temp_li';
          newLi.addBottom(list);
          parent.expect(list.getChildren()).should_have(5, 'items');
          parent.expect(list.getChildren()[4].id).should_be('temp_li');
          //when empty
          list.removeChildren();
          newLi.addBottom(list);
          parent.expect(list.getChildren()).should_have(1, 'items');
          parent.expect(list.getChildren()[0].id).should_be('temp_li');
        },

        'replace should replace the receiver element with the supplied elements in the same position': function(){
          var li = list.getLastChild();
          //create a replacement li2
          var li2 = document.createElement('li');
          li2.id = 'temp_li_2';
          //replace li with li2
          li.replace(li2);
          parent.expect(list.getChildren()).should_have(4, 'items');
          parent.expect(list.getLastChild().id).should_be('temp_li_2');
          li = list.getLastChild();
          var li3 = document.createElement('li');
          var li4 = document.createElement('li');
          li.replace(li3, li4);//both should be inserted where li was
          parent.expect(li.parentNode).should_be(null);
          parent.expect(li3.parentNode.id).should_be('list');
          parent.expect(li4.parentNode.id).should_be('list');
          parent.expect(list.getChildren()).should_have(5, 'items');
        }
      
      });
    
    })();


  })();


};

}
