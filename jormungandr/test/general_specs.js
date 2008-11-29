function defined (fn) {
  try { fn(); } catch (e) { return false; }
  return true;
};

describe('Everything should be defined', {

  'YAHOO should be defined': function(){
    expect(defined(function(){YAHOO})).should_not_be(false);
  },

  'YAHOO.util.Dom should be defined': function() {
    expect(defined(function(){YAHOO.util.Dom})).should_not_be(false);
  },

  'YAHOO.util.Event should be defined': function() {
    expect(defined(function(){YAHOO.util.Event})).should_not_be(false);
  },

  'YAHOO.util.Element should be defined': function() {
    expect(defined(function(){YAHOO.util.Element})).should_not_be(false);
  },

  'YAHOO.util.Anim should be defined': function() {
    expect(defined(function(){YAHOO.util.Anim})).should_not_be(false);
  },

  'YAHOO.util.Connect should be defined': function() {
    expect(defined(function(){YAHOO.util.Connect})).should_not_be(false);
  },

  'Ext.DomQuery should be defined': function() {
    expect(defined(function(){Ext.DomQuery})).should_not_be(false);
  },

  'TD should be defined': function(){
    expect(defined(function(){TD})).should_not_be(false);
  },

  'TD.lang should be defined': function(){
    expect(defined(function(){TD.lang})).should_not_be(false);
  },

  '$ should be defined': function(){
    expect(defined(function(){$})).should_not_be(false);
  },

  '$E should be defined': function(){
    expect(defined(function(){$E})).should_not_be(false);
  },

  'Builder should be defined': function(){
    expect(defined(function(){Builder})).should_not_be(false);
  },

  '$B should be defined': function(){
    expect(defined(function(){$B})).should_not_be(false);
  }

});


(function(){

  var a = [1,2,3,4,5,6,7,8,9,10];

  describe('Array extensions', {

    'Array.from should convert arguments': function(){
      var a = (function(){ return Array.from(arguments); })(1,2,3);
      expect(a).should_be([1,2,3]);
    },
    
    'Array.from should convert first argument': function(){
      expect(Array.from([1,2,3])).should_be([1,2,3]);
      expect(Array.from((function(){ return arguments; })(1,2,3))).should_be([1,2,3]);
    },

    'Array.range should create an array': function(){
      expect(Array.range(1,3)).should_be([1,2,3]);
      expect(Array.range(9,7)).should_be([9,8,7]);
    },

    'Array#each should iterate the array': function(){
      var b = [];
      a.each(function(e){ b.push(e); });
      expect(b).should_be(a);
    },

    'Array#each should provide index, self': function(){
      a.each(function(el,ind,self){
        expect(el).should_be(a[0]);
        expect(ind).should_be(0);
        expect(self).should_be(a);
        return false;
      });
    },
    
    'Array#each should set this for iterator function': function(){
      var b = {foo: 'bar'};
      a.each(function(){
        expect(this.foo).should_be('bar');
        this.foo = 'baz';
        return false;
      }, b);
      expect(b.foo).should_be('baz');
    },

    'Array#each should break on false': function(){
      var c = 0;
      a.each(function(e){ c = e; return e < 5; })
      expect(c).should_be(5);
    },

    'Array#touch should iterate elements and return self': function(){
      var a = [1,2,3,4,5];
      expect(a.touch(function(e,i){ a[i] = e+1; })).should_be(a);
      expect(a).should_be([2,3,4,5,6]);
    },

    'Array#touch should break on false': function(){
      var c = 0;
      a.touch(function(e){ c = e; return e < 5; });
      expect(c).should_be(5);
    },

    'Array#touch should set this for iterator': function(){
      var b = {foo:'bar'};
      a.touch(function(){
        expect(this.foo).should_be('bar');
        this.foo = 'baz';
        return false;
      },b);
      expect(b.foo).should_be('baz');
    },

    'Array#touch should provide index, self': function(){
      a.touch(function(e,ind,self){
        expect(ind).should_be(0);
        expect(self).should_be(a);
        return false;
      });
    },
    
    'Array#map should work': function(){
      var b = a.map(function(e){ return e+1; });
      expect(b).should_be([2,3,4,5,6,7,8,9,10,11]);
      expect(a).should_be([1,2,3,4,5,6,7,8,9,10]);
    },

    'Array#find should return first element for which the iterator returns true or null if none match': function(){
      expect(a.find(function(e){ return e > 5; })).should_be(6);
      expect(a.find(function(e,i){ return i > 5; })).should_be(7);
      expect(a.find(function(e){ return e > 50; })).should_be(null);
    },

    'Array#select should return a new array with elements for which the iterator returns true': function(){
      expect(a.select(function(e){ return e > 5; })).should_be([6,7,8,9,10]);
      expect(a.select(function(e,i){ return i > 5; })).should_be([7,8,9,10]);
      expect(a.select(function(e){ return e > 50; })).should_be([]);
      expect(a).should_be([1,2,3,4,5,6,7,8,9,10]);
    },

    'Array#reject should return a new array with elements for which the iterator returns false': function(){
      expect(a.reject(function(e){ return e < 5; })).should_be([5,6,7,8,9,10]);
      expect(a.reject(function(e,i){ return i < 5; })).should_be([6,7,8,9,10]);
      expect(a.reject(function(e){ return e < 50; })).should_be([]);
      expect(a).should_be([1,2,3,4,5,6,7,8,9,10]);
    },

    'Array#deleteIf should remove items from self for which the iterator returns true': function(){
      var a = [1,2,3,4,5];
      a.deleteIf(function(e){ return e > 3; });
      expect(a).should_be([1,2,3]);
      a = [1,2,3,4,5];
      a.deleteIf(function(e,i){ return i < 3; });
      expect(a).should_be([4,5]);
      expect([1,2,3,4,5].deleteIf(function(e){ return e > 3; })).should_be([1,2,3]);
    },

    'Array#inject should take an accumulator object, run the iterator function for each element with the accumulator and current element as arguments and return the accumulator': function(){
      expect(a.inject(0, function(sum,n){ return sum + n; })).should_be(55);
      var b = a.inject([], function(a,e){ a.push(e+1); return a; });
      expect(b).should_be([2,3,4,5,6,7,8,9,10,11]);
      expect(a).should_be([1,2,3,4,5,6,7,8,9,10]);
    },

    'Array#reduce should use first element as accumulator if not given': function(){
      expect(a.reduce(function(sum,e){ return sum+e; })).should_be(55);
    },

    'Array#include should return true or false depending on if any element matches the first argument': function(){
      expect(a.include(5)).should_be_true();
      expect(a.include(50)).should_be_false();
    },

    'Array#indexOf should return the index of the first element which matches the first argument, -1 otherwise': function(){
      expect(a.indexOf(5)).should_be(4);
      expect(a.indexOf(50)).should_be(-1);
      expect([1,2,5,3,4,5,6,7,5].indexOf(5)).should_be(2);
    },

    'Array#lastIndexOf should return the index of the first element, starting from the end, which matches the first argument, -1 otherwise': function(){
      expect(a.lastIndexOf(5)).should_be(4);
      expect(a.lastIndexOf(50)).should_be(-1);
      expect([1,2,5,3,4,5,6,7,5].lastIndexOf(5)).should_be(8);
    },

    'Array#indicesOf should return an array of the indexes for the elements that match the first argument': function(){
      expect(a.indicesOf(5)).should_be([4]);
      expect(a.indicesOf(50)).should_be([]);
      expect([1,2,5,3,4,5,6,7,5].indicesOf(5)).should_be([2,5,8]);
    },

    'Array#every should return true if the iterator function returns true for every element as the first argument, false otherwise': function(){
      expect(a.every(function(e){ return e < 20; })).should_be_true();
      expect(a.every(function(e,i){ return i < 20; })).should_be_true();
      expect(a.every(function(e){ return e > 5; })).should_be_false();
    },

    'Array#some should return true if the iterator returns true for any of the elements as the first argument, false otherwise': function(){
      expect(a.some(function(e){ return e < 20; })).should_be_true();
      expect(a.some(function(e,i){ return i < 20; })).should_be_true();
      expect(a.some(function(e){ return e > 5; })).should_be_true();
      expect(a.some(function(e){ return e > 20; })).should_be_false();
    },

    'Array#flatten should return an array in which the elements of all elements that are also arrays, recursively, are added to the parent array': function(){
      expect(a.flatten()).should_be(a);
      expect([[[[[[[[[[[[[1]]]]]]]]]]]]].flatten()).should_be([1]);
      expect([1,[2,[3,[4,[5]]]]].flatten()).should_be([1,2,3,4,5]);
      expect([1,2,[3,4,[5],6,7],8,9].flatten()).should_be([1,2,3,4,5,6,7,8,9]);
    },

    'Array#pluck should return a new array and fill it with the value of each element\'s property with they key given as the first argument': function(){
      var a = [1,2,3].map(function(n){ return {foo:'foo'+n, bar:'bar'+n, baz:function(){ return 'baz'+n; } } });
      expect(a.pluck('foo')).should_be(['foo1', 'foo2', 'foo3']);
      expect(a.pluck('bar')).should_be(['bar1', 'bar2', 'bar3']);
      expect(a.pluck('baz')).should_be([a[0].baz, a[1].baz, a[2].baz]);
      expect(a.pluck('baz', false)).should_be([a[0].baz, a[1].baz, a[2].baz]);
      expect(a.pluck('baz', true)).should_be(['baz1', 'baz2', 'baz3']);
    },

    'Array#inReverse should return a new array with elements added in the opposite order of the elements in  this array': function(){
      expect(a.inReverse()).should_be([10,9,8,7,6,5,4,3,2,1]);
      expect(a).should_be([1,2,3,4,5,6,7,8,9,10]);
    }

  });

})();


describe('Function extensions', {

  'Function#create should create a new object instantiated from this function': function(){
    var f = function(){ this.foo = 'foo'; };
    f.prototype.bar = 'bar';
    f.prototype.baz = function(){ return [this.foo, this.bar]; };
    var o = f.create();
    expect(o.constructor).should_be(f);
    if (o.hasOwnProperty('__proto__')) { expect(o.__proto__).should_be(f.prototype); }
    expect(o.foo).should_be('foo');
    expect(o.bar).should_be('bar');
    expect(o.baz).should_be(f.prototype.baz);
    expect(o.baz()).should_be(['foo', 'bar']);
    expect(o.hasOwnProperty('foo')).should_be_true();
    expect(o.hasOwnProperty('bar')).should_be_false();
  },

  'Function#createFromArgs should create a new object instantiated from this function, passing the array in the first argument as arguments': function(){
    var f = function(foo, bar){ this.foo = foo; this.bar = bar; };
    var o = f.createFromArgs(['oof', 'rab']);
    expect(o.foo).should_be('oof');
    expect(o.bar).should_be('rab');
    var o = (function(){ return f.createFromArgs(arguments); })('FOO', 'BAR');
    expect(o.foo).should_be('FOO');
    expect(o.bar).should_be('BAR');
  },

  'Function#bind should return a closure function which when run runs the original method in the context of the first argument given to bind': function(){
    var o = {foo: 'bar', getFoo: function(){ return this.foo; }};
    expect(o.getFoo()).should_be('bar');
    var getFoo = o.getFoo;
    expect(getFoo()).should_be(undefined);
    getFoo = getFoo.bind(o);
    expect(getFoo()).should_be('bar');
  }

});


(function(){
      
  function F(){ this.bar = 'bar'; };
  F.prototype.foo = 'foo';
  var o = new F();

  describe('Utility functions (TD.lang)', {

    'hasOwnProperty should return true if the object (first argument) has the property with the name given as the second argument defined directly on it': function(){
      expect(TD.lang.hasOwnProperty(o, 'foo')).should_be_false();
      expect(TD.lang.hasOwnProperty(o, 'bar')).should_be_true();
    },

    'iterate should iterate all properties in the passed object that are defined directly on it': function(){
      var res = {};
      TD.lang.iterate(o, function(prop,val){ res[prop] = val; });
      expect(res).should_be({bar:'bar'});
    },

    'object should create a new object that directly inherits the passed object': function(){
      var oo = TD.lang.object(o);
      if (oo.hasOwnProperty('__proto__')) { expect(oo.__proto__).should_be(o); }
      expect(oo.foo).should_be('foo');
      expect(oo.bar).should_be('bar');
    },

    'keys should return an array of the passed in objects directly defined keys': function(){
      expect(TD.lang.keys(o)).should_be(['bar']);
    },

    'merge should return a new object with the properties of the first argument merged with the properties of the second argument': function(){
      expect(TD.lang.merge(o, {baz:'baz'})).should_be({bar:'bar',baz:'baz',foo:'foo'});
      expect(TD.lang.merge(o, {foo:'oof',baz:'baz'})).should_be({bar:'bar',baz:'baz',foo:'oof'});
      expect(o).should_be({foo:'foo',bar:'bar'});
    },

    'merge should not overwrite properties on the receiver when the third argument is true': function(){
      expect(TD.lang.merge(o, {foo:'oof',baz:'baz'}, true)).should_be({bar:'bar',baz:'baz',foo:'foo'});
      expect(o).should_be({foo:'foo',bar:'bar'});
    },

    'extend should add properties from the second argument to the first': function(){
      var o = {foo:'foo', bar:'bar'};
      TD.lang.extend(o, {foo:'FOO',baz:'BAZ'});
      expect(o).should_be({foo:'FOO',bar:'bar',baz:'BAZ'});
    },

    'extend should not overwrite properties on the receiver when the third argument is true': function(){
      var o = {foo:'foo', bar:'bar'};
      TD.lang.extend(o, {foo:'FOO',baz:'BAZ'}, true);
      expect(o).should_be({foo:'foo',bar:'bar',baz:'BAZ'});
    }

  });

})();

  var oldOnload = window.onload;

  window.onload = function(){

    var iframeWrap = document.createElement('div');
    iframeWrap.style.visibility = 'hidden';
    iframeWrap.innerHTML = '<iframe src="mongo.html" onload="oldOnload();"></iframe>';
    document.body.appendChild(iframeWrap);

  };
