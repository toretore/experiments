/*
 * yui-ext 0.40
 * Copyright(c) 2006, Jack Slocum.
 *
 * http://www.yui-ext.com/deploy/ext-1.0-alpha3/source/core/DomQuery.js
*/

var Ext={};Ext.DomQuery=function(){var cache={},simpleCache={},valueCache={};var nonSpace=/\S/;var trimRe=/^\s*(.*?)\s*$/;var tplRe=/\{(\d+)\}/g;var modeRe=/^(\s?[\/>]\s?|\s|$)/;var clsRes={};function child(p,index){var i=0;var n=p.firstChild;while(n){if(n.nodeType==1){i++;if(i==index){return n;}}
n=n.nextSibling;}
return null;};function next(d){var n=d.nextSibling;while(n&&n.nodeType!=1){n=n.nextSibling;}
return n;};function prev(d){var n=d.previousSibling;while(n&&n.nodeType!=1){n=n.previousSibling;}
return n;};function clean(d){var n=d.firstChild,ni=-1;while(n){var nx=n.nextSibling;if(n.nodeType==3&&!nonSpace.test(n.nodeValue)){d.removeChild(n);}else{n.nodeIndex=++ni;}
n=nx;}
return this;};function byClassName(c,a,v){if(!v){return c;}
var re=clsRes[v];if(!re){re=new RegExp('(?:^|\\s)(?:'+v+')(?:\\s|$)');clsRes[v]=re;}
var r=[];for(var i=0,ci;ci=c[i];i++){if(re.test(ci.className)){r[r.length]=ci;}}
return r;};function convert(c){if(c.slice){return c;}
var r=[];for(var i=0,l=c.length;i<l;i++){r[r.length]=c[i];}
return r;};function attrValue(n,attr){if(!n.tagName&&typeof n.length!='undefined'){n=n[0];}
if(!n){return null;}
if(attr=='for'){return n.htmlFor;}
if(attr=='class'||attr=='className'){return n.className;}
return n.getAttribute(attr)||n[attr];};function getNodes(ns,mode,tagName){var result=[],cs;if(!ns){return result;}
mode=mode?mode.replace(trimRe,'$1'):'';tagName=tagName||'*';if(ns.tagName||ns==document){ns=[ns];}
if(mode!='/'&&mode!='>'){for(var i=0,ni;ni=ns[i];i++){cs=ni.getElementsByTagName(tagName);result=concat(result,cs);}}else{for(var i=0,ni;ni=ns[i];i++){var cn=ni.getElementsByTagName(tagName);for(var j=0,cj;cj=cn[j];j++){if(cj.parentNode==ni){result[result.length]=cj;}}}}
return result;};function concat(a,b){if(b.slice){return a.concat(b);}
for(var i=0,l=b.length;i<l;i++){a[a.length]=b[i];}
return a;}
function byTag(cs,tagName){if(cs.tagName||cs==document){cs=[cs];}
if(!tagName){return cs;}
var r=[];tagName=tagName.toLowerCase();for(var i=0,ci;ci=cs[i];i++){if(ci.nodeType==1&&ci.tagName.toLowerCase()==tagName){r[r.length]=ci;}}
return r;};function byId(cs,attr,id){if(cs.tagName||cs==document){cs=[cs];}
if(!id){return cs;}
var r=[];for(var i=0,l=cs.length;i<l;i++){var ci=cs[i];if(ci&&ci.id==id){r[r.length]=ci;}}
return r;};function byAttribute(cs,attr,value,op,custom){var r=[],st=custom=='{';var f=Ext.DomQuery.operators[op];for(var i=0,l=cs.length;i<l;i++){var a;if(st){a=Ext.DomQuery.getStyle(cs[i],attr);}
else if(attr=='class'||attr=='className'){a=cs[i].className;}else if(attr=='for'){a=cs[i].htmlFor;}else{a=cs[i].getAttribute(attr);}
if((f&&f(a,value))||(!f&&a)){r[r.length]=cs[i];}}
return r;};function byPseudo(cs,name,value){return Ext.DomQuery.pseudos[name](cs,value);};var isIE=window.ActiveXObject;var addAttr=isIE?function(n,a,v){n.setAttribute(a,v);}:function(n,a,v){n[a]=v;};var getAttr=isIE?function(n,a){return n.getAttribute(a);}:function(n,a){return n[a];};var clearAttr=isIE?function(n,a){n.removeAttribute(a);}:function(n,a,v){delete n[a];};function nodup(cs){if(!cs.length){return cs;}
addAttr(cs[0],'_nodup',true);var r=[cs[0]];for(var i=1,len=cs.length;i<len;i++){var c=cs[i];if(!getAttr(c,'_nodup')){addAttr(c,'_nodup',true);r[r.length]=c;}}
for(var i=0,len=cs.length;i<len;i++){clearAttr(cs[i],'_nodup');}
return r;}
function quickDiff(c1,c2){if(!c1.length){return c2;}
for(var i=0,len=c1.length;i<len;i++){addAttr(c1[i],'_qdiff',true);}
var r=[];for(var i=0,len=c2.length;i<len;i++){if(!getAttr(c2[i],'_qdiff')){r[r.length]=c2[i];}}
for(var i=0,len=c1.length;i<len;i++){clearAttr(c1[i],'_qdiff');}
return r;}
function quickId(ns,mode,root,id){if(ns==root){var d=root.ownerDocument||root;return d.getElementById(id);}
ns=getNodes(ns,mode,'*');return byId(ns,null,id);}
return{getStyle:function(el,name){return YAHOO.util.Dom.getStyle(el,name);},compile:function(path,type){while(path.substr(0,1)=='/'){path=path.substr(1);}
type=type||'select';var fn=['var f = function(root){\n var mode; var n = root || document;\n'];var q=path,mode,lq;var tk=Ext.DomQuery.matchers;var tklen=tk.length;var mm;while(q&&lq!=q){lq=q;var tm=q.match(/^(#)?([\w-\*]+)/);if(type=='select'){if(tm){if(tm[1]=='#'){fn[fn.length]='n = quickId(n, mode, root, "'+tm[2]+'");';}else{fn[fn.length]='n = getNodes(n, mode, "'+tm[2]+'");';}
q=q.replace(tm[0],'');}else{fn[fn.length]='n = getNodes(n, mode, "*");';}}else{if(tm){if(tm[1]=='#'){fn[fn.length]='n = byId(n, null, "'+tm[2]+'");';}else{fn[fn.length]='n = byTag(n, "'+tm[2]+'");';}
q=q.replace(tm[0],'');}}
while(!(mm=q.match(modeRe))){var matched=false;for(var j=0;j<tklen;j++){var t=tk[j];var m=q.match(t.re);if(m){fn[fn.length]=t.select.replace(tplRe,function(x,i){return m[i];});q=q.replace(m[0],'');matched=true;break;}}
if(!matched){throw'Error parsing selector, parsing failed at "'+q+'"';}}
if(mm[1]){fn[fn.length]='mode="'+mm[1]+'";';q=q.replace(mm[1],'');}}
fn[fn.length]='return nodup(n);\n}';eval(fn.join(''));return f;},select:function(path,root,type){if(!root||root==document){root=document;}
if(typeof root=='string'){root=document.getElementById(root);}
var paths=path.split(',');var results=[];for(var i=0,len=paths.length;i<len;i++){var p=paths[i].replace(trimRe,'$1');if(!cache[p]){cache[p]=Ext.DomQuery.compile(p);if(!cache[p]){throw p+' is not a valid selector';}}
var result=cache[p](root);if(result&&result!=document){results=results.concat(result);}}
return results;},selectNode:function(path,root){return Ext.DomQuery.select(path,root)[0];},selectValue:function(path,root,defaultValue){path=path.replace(trimRe,'$1');if(!valueCache[path]){valueCache[path]=Ext.DomQuery.compile(path,'simple');}
var n=valueCache[path](root);n=n[0]?n[0]:n;var v=(n&&n.firstChild?n.firstChild.nodeValue:null);return(v===null?defaultValue:v);},selectNumber:function(path,root,defaultValue){var v=Ext.DomQuery.selectValue(path,root,defaultValue||0);return parseFloat(v);},is:function(el,ss){if(typeof el=='string'){el=document.getElementById(el);}
var isArray=(el instanceof Array);var result=Ext.DomQuery.filter(isArray?el:[el],ss);return isArray?(result.length==el.length):(result.length>0);},filter:function(els,ss,nonMatches){ss=ss.replace(trimRe,'$1');if(!simpleCache[ss]){simpleCache[ss]=Ext.DomQuery.compile(ss,'simple');}
var result=simpleCache[ss](els);return nonMatches?quickDiff(result,els):result;},matchers:[{re:/^\.([\w-]+)/,select:'n = byClassName(n, null, "{1}");'},{re:/^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,select:'n = byPseudo(n, "{1}", "{2}");'},{re:/^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,select:'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'},{re:/^#([\w-]+)/,select:'n = byId(n, null, "{1}");'},{re:/^@([\w-]+)/,select:'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'}],operators:{'=':function(a,v){return a==v;},'!=':function(a,v){return a!=v;},'^=':function(a,v){return a&&a.substr(0,v.length)==v;},'$=':function(a,v){return a&&a.substr(a.length-v.length)==v;},'*=':function(a,v){return a&&a.indexOf(v)!==-1;},'%=':function(a,v){return(a%v)==0;}},pseudos:{'first-child':function(c){var r=[];for(var i=0,l=c.length;i<l;i++){var ci=c[i];if(!prev(ci)){r[r.length]=ci;}}
return r;},'last-child':function(c){var r=[];for(var i=0,l=c.length;i<l;i++){var ci=c[i];if(!next(ci)){r[r.length]=ci;}}
return r;},'nth-child':function(c,a){var r=[];if(a!='odd'&&a!='even'){for(var i=0,ci;ci=c[i];i++){var m=child(ci.parentNode,a);if(m==ci){r[r.length]=m;}}
return r;}
var p;for(var i=0,l=c.length;i<l;i++){var cp=c[i].parentNode;if(cp!=p){clean(cp);p=cp;}}
for(var i=0,l=c.length;i<l;i++){var ci=c[i],m=false;if(a=='odd'){m=((ci.nodeIndex+1)%2==1);}else if(a=='even'){m=((ci.nodeIndex+1)%2==0);}
if(m){r[r.length]=ci;}}
return r;},'only-child':function(c){var r=[];for(var i=0,l=c.length;i<l;i++){var ci=c[i];if(!prev(ci)&&!next(ci)){r[r.length]=ci;}}
return r;},'empty':function(c){var r=[];for(var i=0,l=c.length;i<l;i++){var ci=c[i];if(!ci.firstChild){r[r.length]=ci;}}
return r;},'contains':function(c,v){var r=[];for(var i=0,l=c.length;i<l;i++){var ci=c[i];if(ci.innerHTML.indexOf(v)!==-1){r[r.length]=ci;}}
return r;},'checked':function(c){var r=[];for(var i=0,l=c.length;i<l;++i){if(c[i].checked=='checked'||c[i].checked==true){r[r.length]=c[i];}}
return r;},'not':function(c,ss){return Ext.DomQuery.filter(c,ss,true);},'odd':function(c){return this['nth-child'](c,'odd');},'even':function(c){return this['nth-child'](c,'even');},'nth':function(c,a){return c[a-1];},'first':function(c){return c[0];},'last':function(c){return c[c.length-1];},'has':function(c,ss){var s=Ext.DomQuery.select;var r=[];for(var i=0,ci;ci=c[i];i++){if(s(ss,ci).length>0){r[r.length]=ci;}}
return r;},'next':function(c,ss){var is=Ext.DomQuery.is;var r=[];for(var i=0,ci;ci=c[i];i++){var n=next(ci);if(n&&is(n,ss)){r[r.length]=ci;}}
return r;},'prev':function(c,ss){var is=Ext.DomQuery.is;var r=[];for(var i=0,ci;ci=c[i];i++){var n=prev(ci);if(n&&is(n,ss)){r[r.length]=ci;}}
return r;}}};}();Ext.query=Ext.DomQuery.select;YAHOO.util.Dom.query=Ext.query;



//Array extensions
(function(){
  var w = window;

  var ext = {
    forEach: function(fn,t){
      for (var i=0; i < this.length; i++) {
        if (fn.call(t||w, this[i], i, this) === false) { break; }
      }
    },
    touch: function(fn,t){
      this.each(function(e,i,a){
        return fn.call(t||w,e,i,a);
      });
      return this;
    },
    map: function(fn,t){
      var r=[];
      this.each(function(e,i,a){
        r.push(fn.call(t||w,e,i,a));
      });
      return r;
    },
    find: function(fn,t){
      for (var i=0; i<this.length; i++) {
        if (fn.call(t||w, this[i], i, this)) { return this[i]; }
      }
      return null;
    },
    select: function(fn,t){
      var r=[];
      this.each(function(e,i){
        if (fn.call(t||w,e,i,this)) { r.push(e); }
      });
      return r;
    },
    reject: function(fn,t){
      return this.select(function(e,i,a){
        return !fn.call(t||w,e,i,a);
      });
    },
    deleteIf: function(fn,t){
      var length = this.length;
      var count = 0;
      for (var i=0; i<length; i++) {
        if (fn.call(t||w,this[i-count],i,this)) {
          this.splice(i-count,1);
          count++;
        }
      }
      return this;
    },
    inject: function(acc,fn,t) {
      this.each(function(e,i,a){
        acc = fn.call(t||w,acc,e,i,a);
      });
      return acc;
    },
    reduce: function(fn,acc,t){
      var i=0,
      r = typeof acc === 'undefined' ? this[i++] : acc;
      for (;i<this.length;i++) {
        r = fn.call(t||w,r,this[i],i,this);
      }
      return r;
    },
    include: function(e){
      for (var i=0; i<this.length; i++) {
        if (this[i] === e) { return true; }
      }
      return false;
    },
    indexOf: function(e){
      for (var i=0; i<this.length; i++) {
        if (this[i] === e) { return i; }
      }
      return -1;
    },
    lastIndexOf: function(e){
      for (var i=this.length-1; i>=0; i--) {
        if (this[i] === e) { return i; }
      }
      return -1;
    },
    indicesOf: function(el){
      return this.inject([], function(a,e,i){
        if (el === e) { a.push(i); }
        return a;
      });
    },
    every: function(fn,t){
      for (var i=0; i<this.length; i++) {
        if (!fn.call(t||w,this[i],i,this)) { return false; }
      }
      return true;
    },
    some: function(fn,t){
      for (var i=0; i<this.length; i++) {
        if (fn.call(t||w,this[i],i,this)) { return true; }
      }
      return false;
    },
    flatten: function(){
      var r=[];
      this.each(function(e){
        e instanceof Array ? e.flatten().each(function(ee){ r.push(ee); }) : r.push(e);
      });
      return r;
    },
    pluck: function(p,runFunc){
      return this.map(function(e){
        return (runFunc && typeof e[p] === 'function') ? e[p]() : e[p];
      });
    },
    first: function(){
      return this[0];
    },
    last: function(){
      return this[this.length-1];
    },
    inReverse: function(){
      var rv = [];
      for (var i=this.length-1; i>=0; i--) { rv.push(this[i]); }
      return rv;
    }
  };

  ext.each = ext.forEach;
  ext.tap = ext.touch;
  ext.all = ext.every;
  ext.any = ext.some;
  ext.includes = ext.include;
  ext.filter = ext.select;

  for (var p in ext) {
    if (ext.hasOwnProperty(p) && !Array.prototype[p]) {
      Array.prototype[p] = ext[p];
    }
  }

  Array.from = function(o){ return Array.prototype.slice.call(arguments.length > 1 ? arguments : o); };  
  Array.range = function(f,t){
    var rv=[];
    if (f < t) {
      while (f <= t) { rv.push(f++); }
    } else {
      while (f >= t) { rv.push(f--); }
    }
    return rv;
  };

})();


Function.prototype.create = function(){
  var o = TD.lang.object(this.prototype);
  if (!this.prototype.hasOwnProperty('constructor')) { this.prototype.constructor = this; }
  this.apply(o, arguments);
  return o;
};

Function.prototype.createFromArgs = function(args){
  return this.create.apply(this, args);
};

Function.prototype.bind = function(o){
  var that = this;
  return function(){
    return that.apply(o, arguments);
  };
};



if (!TD) {
  var TD = {
    namespace: function(str){
      return str.split('.').inject(this, function(current,part){
        if (!current[part]) {
          current[part] = {};
        }
        return current[part];
      });
    }
  };
}

(function(lang){

  lang.hasOwnProperty = function(o,p){
    if (typeof o.hasOwnProperty === 'function') {
      return o.hasOwnProperty(p);
    } else {
      return YAHOO.lang.hasOwnProperty(o,p);
    }
  };

  lang.iterate = function(o, fn, t){
    for (var p in o) {
      if (lang.hasOwnProperty(o,p)) {
        fn.call(t || window, p, o[p], o);
      }
    }
  };

  lang.object = function(o){
    function F(){};
    F.prototype = o;
    return new F();
  };

  lang.keys = function(o){
    var keys = [];
    lang.iterate(o, function(k,v){ keys.push(k); });
    return keys;
  };

  lang.merge = function(receiver, supplier, keep){
    var rv = lang.object(receiver);
    lang.iterate(supplier, function(prop, val){
      if (typeof receiver[prop] === 'undefined' || !keep) {
        rv[prop] = val;
      }
    });
    return rv;
  };

  lang.extend = function(receiver, supplier, keep){
    lang.iterate(supplier, function(prop,val){
      if (typeof receiver[prop] === 'undefined' || !keep) {
        receiver[prop] = val;
      }
    });
    return receiver;
  };

})(TD.namespace('lang'));





(function(){

  var document = document;
  var Y = YAHOO;
  var Dom = Y.util.Dom;
  var Event = Y.util.Event;
  var Element = Y.util.Element;
  var Anim = Y.util.Anim;
  var Connect = Y.util.Connect;
  var E = function(e){
    if (typeof e === 'string') {
      return document.getElementById(e);
    } else {
      return e;
    }
  };
  var EL = function(el){
    return typeof el === 'string' ? document.createTextNode(el) : el;
  };
  var UNEL = function(el){
    return el.el || el;
  };

  //Wrap a DOM element in an anonymous object
  function wrapElement(e){
    if (!e) { return e; }
    if (Y.lang.isArray(e)) { return e.map(function(el){ return wrapElement(el); }); }

    if (e._wrapped) {
      return e;
    } else {
      var ne = TD.lang.object(e);
      ne.el = e;
      TD.lang.extend(ne, elementExtensions);
      return ne;
    }
  };

  //Wrapped elements will receive these methods
  var elementExtensions = {
    _wrapped: true,

    hide: function(){
      return this.setStyle('display', 'none');
    },
    show: function(){
      if (!this.visible()) {
        this.setStyle('display', '');
      }
      return this;
    },
    visible: function(){
      return this.getStyle('display') !== 'none';
    },
    toggle: function(){
      this.visible() ? this.hide() : this.show();
      return this;
    },
    conceal: function(){
      return this.setStyle('visibility', 'hidden');
    },
    reveal: function(){
      return this.setStyle('visibility', '');
    },
    getParent: function(){
      return wrapElement(this.parentNode);
    },
    setStyle: function(attr, val){
      attr = attr.replace(/\-(\w)/g, function(match,letter){ return letter.toUpperCase(); });
      Dom.setStyle(this.el, attr, val);
      return this;
    },
    removeStyle: function(s){
      /* TODO: Make cross-browser or remove */
      //this.style.removeProperty(s);
      return this.setStyle(s, null);
    },
    setStyles: function(styles){
      TD.lang.iterate(styles, function(s,v){
        this.setStyle(s,v);
      },this);
      return this;
    },
    resetStyles: function(){
      Array.from(this.style).each(function(s){ this.removeStyle(s); }, this);
      return this;
    },
    getElementsBy: function(fn, tag, apply){
      return $(Dom.getElementsBy(fn, tag, this.el, apply));
    },
    getElementsByClassName: function(className, tag, apply){
      return $(Dom.getElementsByClassName(className, tag, this.el, apply));
    },
    getElementsByTagName: function(tag, fn, apply){
      if (!fn) { fn = function(){ return true; }; }
      return this.getElementsBy(fn, tag, apply);
    },
    getElements: function(){
      return this.getElementsBy(function(){ return true; });
    },
    isAncestor: function(anc){
      return Dom.isAncestor(UNEL(anc), this.el);
    },
    isDescendant: function(desc){
      return Dom.isAncestor(this.el, UNEL(desc));
    },
    appendChild: function(el){
      return this.el.appendChild(UNEL(el));
    },
    insertBefore: function(){
      var els = Array.from(arguments).flatten();
      var that = this;
      els.each(function(el){ Dom.insertBefore(el, UNEL(that)); });
      return els;
    },
    insertAfter: function(){
      var els = Array.from(arguments).flatten().reverse();
      var that = this;
      els.each(function(el){ Dom.insertAfter(UNEL(el), UNEL(that)); });
      return els;
    },
    addBefore: function(el){
      return Dom.insertBefore(UNEL(this), UNEL(el));
    },
    addAfter: function(el){
      return Dom.insertAfter(UNEL(this), UNEL(el));
    },
    insertTop: function(){
      var els = Array.from(arguments).flatten();
      while (els.length) {
        if (this.childNodes.length > 0) {
          this.el.insertBefore(UNEL(els.pop()), this.childNodes[0])
        } else {
          this.el.appendChild(UNEL(els.pop()));
        }
      }
      return this;
    },
    insertBottom: function(){
      var els = Array.from(arguments).flatten();
      while (els.length) { this.appendChild(EL(els.shift())); }
      return this;
    },
    addTop: function(el){
      wrapElement(el).insertTop(this);
      return this;
    },
    addBottom: function(el){
      wrapElement(el).insertBottom(this);
      return this;
    },
    remove: function(){
      this.parentNode.removeChild(this.el);
      return this;
    },
    replace: function(){
      this.insertBefore.apply(this, arguments);
      this.remove();
      return this;
    },
    removeChildren: function(){
      while (this.el.childNodes.length) { this.el.removeChild(this.el.childNodes[0]); }
      return this;
    },
    replaceChildren: function(){
      this.removeChildren();
      this.insertBottom.apply(this, arguments);
      return this;
    },
    perform: function(){
      var args = Array.from(arguments);
      var fn = args.shift();
      if (typeof fn === 'string') {
        fn = this[fn];
      } else {
        args.unshift(this);
      }
      fn.apply(this, args);
      return this;
    },
    getClassName: function(){
      return this.el.getAttribute('class') || this.el.getAttribute('className');
    },
    getClassLabel: function(label){
      var m, expr = new RegExp('(?:^| )'+label+':([^ ]+)');
      if (m = this.getClassName().match(expr)) {
        return m[1];
      } else {
        return null;
      }
    },
    toggleClass: function(name){
      this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
      return this;
    },
    inView: function(){
      var top = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      var vpH = Dom.getViewportHeight();
      var bottom = top+vpH;
      return bottom > this.getY();
    },
    topOutOfView: function(){
      var top = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      return top > this.getY();
    },
    '$': function(s){
      return $(Ext.query(s, this.el));
    }
  };

  //Add methods which return arbitrary values
  ['hasClass','getX','getY','getXY','getRegion','getStyle','inDocument'].each(function(name){
    elementExtensions[name] = function(){
      var args = Array.from(arguments);
      args.unshift(this.el);
      return Dom[name].apply(Dom, args);
    }
  });

  //Add methods which return DOM elements and wrap them
  ['getAncestorByClassName','getAncestorByTagName','getChildren','getFirstChild','getLastChild',
   'getNextSibling','getPreviousSibling'].each(function(name){
    elementExtensions[name] = function(){
      var args = Array.from(arguments);
      args.unshift(this);
      var rv = wrapElement(Dom[name].apply(Dom, args));
      return YAHOO.lang.isArray(rv) ? TD.lang.extend(rv, elementArrayExtensions) : rv;
    }
  });
  
  //Add methods which take a function as an argument. Wrap the function's only argument and its return value.
  ['getChildrenBy','getFirstChildBy','getLastChildBy','getNextSiblingBy','getPreviousSiblingBy',
   'getAncestorBy'].each(function(name){
    elementExtensions[name] = function(fn){
      var rv = wrapElement(
        Dom[name].call(Dom, this, function(el){
          return fn.call(window, wrapElement(el));
        })
      );
      return YAHOO.lang.isArray(rv) ? TD.lang.extend(rv, elementArrayExtensions) : rv;
    };
  });

  //Add methods which should return this
  ['addClass','replaceClass','removeClass','setX','setY','setXY'].each(function(name){
    elementExtensions[name] = function(){
      var args = Array.from(arguments);
      args.unshift(this.el);
      Dom[name].apply(Dom, args);
      return this;
    }
  });


  //Add Event methods if Event is loaded
  if (Y.util.Event) {
    TD.lang.extend(elementExtensions, {
      on: function(e,fn,stop){
        var self = this;
        var checkRelated = false;
        if (e === 'mouseenter') { checkRelated = true; e = 'mouseover' }
        if (e === 'mouseleave') { checkRelated = true; e = 'mouseout' }

        var f = function(ev,el){
          if (stop) { Event.stopEvent(ev); }
          var target = Event.getTarget(ev);
          var relatedTarget = Event.getRelatedTarget(ev);
          if (!checkRelated || (el != relatedTarget && !Dom.isAncestor(el,relatedTarget))) {
            fn.call(self, wrapElement(el), ev, wrapElement(target));
          }
        };

        Event.addListener(this.el,e,f,this.el);
        return f;
      },
      off: function(ev,fn){
        return Event.removeListener(this.el,ev,fn);
      },
      purge: function(){
        return Event.purgeElement.apply(Event, [this.el, Array.from(arguments)].flatten());
      },
      hover: function(inF,outF){
        this.on('mouseenter',inF);
        this.on('mouseleave',outF);
        return this;
      }
    });
  }


  //Add animation methods if Anim is loaded
  //Event is assumed to be loaded if Anim is
  if (Y.util.Anim) {
    TD.lang.extend(elementExtensions, {
      animation: function(a,d,m){
        return new Y.util.ColorAnim(this,a,d,m);
      },
      animate: function(attr,dur,meth){
        this.stopCurrentAnim();
        var onC; if (attr && attr.onComplete) { onC = attr.onComplete; delete attr.onComplete; }
        var onS; if (attr && attr.onStart) { onS = attr.onStart; delete attr.onStart; }
        this.el.currentAnim = new Y.util.ColorAnim(this, attr, dur, meth);
        if (onC) { this.el.currentAnim.onComplete.subscribe(onC,this,true) }
        if (onS) { this.el.currentAnim.onComplete.subscribe(onS,this,true) }
        this.el.currentAnim.animate();
        return this;
      },
      fade: function(dur,conceal,meth){
        return this.animate({
          opacity:{to:0},
          onComplete: function(){
            conceal ? this.conceal() : this.hide();
          }
        }, dur || 0.5, meth || Y.util.Easing.easeIn)
      },
      appear: function(dur,meth){
        this.show();
        this.reveal();
        return this.animate({
          opacity: {to:1}
        }, dur || 0.5, meth || Y.util.Easing.easeOut);
      },
      hoverAnim: function(inArgs,outArgs){
        return this.hover(
          function(){
            this.animate.apply(this, inArgs);
          },
          function(){
            this.animate.apply(this, outArgs);
          }
        );
      },
      stopCurrentAnim: function(){
        if (this.el.currentAnim && this.el.currentAnim.isAnimated()) {
          this.el.currentAnim.onComplete.unsubscribeAll();
          this.el.currentAnim.stop();
        }
      }
    });
  }



  //Extensions for the array returned by query()
  var elementArrayExtensions = {
    _wrapped: true,
    addBefore: function(el){
      wrapElement(el).insertBefore(this);
      return this;
    },
    addAfter: function(el){
      wrapElement(el).insertAfter(this);
      return this;
    },
    addTop: function(){
      wrapElement(el).insertTop(this);
      return this;
    },
    addBottom: function(){
      wrapElement(el).insertBottom(this);
      return this;
    },
    E: function(){
      return this.pluck('el');
    },
    '$': function(s){
      return $(this.map(function(e){ return e.$(s); }));
    },
    wrap: function(fn){
      return TD.lang.extend(fn.apply(this), elementArrayExtensions);
    }
  };

  //Methods that can be proxied to all elements
  ['hide','show','toggle','conceal','reveal','remove','addClass','removeClass','replaceClass',
   'setStyle','setX','setY','setXY', 'removeChildren'].concat(
    Y.util.Event ? ['on','off','purge','hover'] : []
  ).concat(
    Y.util.Anim ? ['animate','fade','appear','hoverAnim'] : []
  ).each(function(name){
    elementArrayExtensions[name] = function(){
      var args = Array.from(arguments);
      this.each(function(el){
        el[name].apply(el, args);
      });
      return this;
    };
  });

  //Methods that work on the first element
  ['getAncestorBy', 'getAncestorByClassName','getAncestorByTagName','hasClass','getX','getY','getXY',
   'get','getRegion','getStyle','inDocument', 'visible','replaceChildren','insertTop','insertBottom'].concat(
   ['Children','FirstChild','LastChild','NextSibling','PreviousSibling'].map(function(s){ return ['get'+s,'get'+s+'By']; }).flatten()
  ).each(function(name){
    elementArrayExtensions[name] = function(){
      if (this[0]) {
        return this[0][name].apply(this[0], arguments);
      }
      return false;
    };
  });



  //Returns elements
  function query () {
    var r = Array.from(arguments).flatten().map(function(arg){
      if (Y.lang.isString(arg)) {
        return Dom.query(arg);
      } else {
        return arg;
      }
    }).flatten();
    return r;
  };

  //Returns wrapped elements
  function queryAndWrap () {
    //return TD.lang.merge(query.apply(this, arguments).map(function(e){ return wrapElement(e); }), elementArrayExtensions);
    var res = query.apply(this, arguments);
    res.each(function(el,i){ res[i] = wrapElement(el); });
    TD.lang.extend(res, elementArrayExtensions);
    return res;
  };

  TD.lang.extend(queryAndWrap, {
    //Not sure how useful this is
    ready: function(fn,obj,scp){
      return Event.onDOMReady(fn,obj,scp);
    }
  });

  window['$'] = queryAndWrap;
  window['$E'] = query;



  if (Y.util.DragDrop) {
  
    Y.util.Sortable = function(listEl, options){
      if (!options){ options = {}; }
      this.listEl = listEl;
    };
  
  }



  if (Y.util.Connect) {
  
    var ajax = TD.namespace('util.Ajax');
    ajax.Request = function(method){
      
    };

    ['get', 'post', 'put', 'delete'].each(function(method){
      ajax[method] = function(){
        var args = Array.from(arguments);
        args.unshift(method);
        //var req = this.Request.createFromArgs(args);
        return Connect.asyncRequest.apply(Connect, args);
      };
    });

  }



})();



function Builder(){
  if (this === window) { return Builder.createFromArgs(arguments); }
  this.name = arguments[0];
  
  if (typeof arguments[1] === 'string') {
    this.content = document.createTextNode(arguments[1]);
  } else if (arguments[1] && arguments[1].toDomElement) {
    this.content = arguments[1].toDomElement();
  } else if (arguments[1] instanceof HTMLElement || YAHOO.lang.isArray(arguments[1])) {
    this.content = arguments[1];
  } else if (typeof arguments[1] === 'object') {
    this.attributes = arguments[1];
  }

  if (!this.content && typeof arguments[2] === 'string') {
    this.content = document.createTextNode(arguments[2]);
  } else if (!this.content && arguments[2] && arguments[2].toDomElement) {
    this.content = arguments[2].toDomElement();
  } else if (!this.content && (arguments[2] instanceof HTMLElement || YAHOO.lang.isArray(arguments[2]))) {
    this.content = arguments[2];
  } else if (!this.attributes && typeof arguments[2] === 'object') {
    this.attributes = arguments[2];
  }

  if (!this.content) { this.content = null; }
  if (!this.attributes) { this.attributes = {}; }

  if (YAHOO.lang.isArray(this.content)) {
    this.content.each(function(c,i,a){
      if (typeof c === 'string') {
        a[i] = document.createTextNode(c);
      } else if (c.toDomElement) {
        a[i] = c.toDomElement();
      }
    });
  }
};

TD.lang.extend(Builder.prototype, {
  toDomElement: function(){
    var e = document.createElement(this.name.toLowerCase());
    TD.lang.iterate(this.attributes, function(p,v){ e.setAttribute(p,v); });
    if (this.content) {
      if (YAHOO.lang.isArray(this.content)) {
        this.content.each(function(c){ e.appendChild(c); });
      } else {
        e.appendChild(this.content);
      }
    }
    return e;
  },

  toHTML: function(){
    var s = '<'+this.name;
    TD.lang.iterate(this.attributes, function(a,v){
      s = s+' '+a+'="'+v+'"'
    });
    this.content && (s = s+'>'+this.toDomElement().innerHTML.replace(/<(.*?)>/g, function(m,t){ return '<'+t.toLowerCase()+'>'; })+'</'+this.name)
    s = s+'>'
    return s;
  },

  toWrappedDomElement: function(){
    return $(this.toDomElement())[0];
  }
});

TD.lang.extend(Builder, {
  dom: function(){
    return this.createFromArgs(arguments).toDomElement();
  },

  wrap: function(){
    return this.createFromArgs(arguments).toWrappedDomElement();
  }
});

var B = Builder.wrap.bind(Builder);
var $B = B;

"a abbr acronym address area base bdo blockquote body br button caption cite code col colgroup dd del dfn div dl dt em fieldset form h1 h2 h3 h4 h5 h6 head hr html img input ins kbd label legend li link map meta noscript object ol optgroup option p param pre q rb rbc rp rt rtc ruby samp script select span strong style sub sup table tbody td textarea tfoot th thead title tr tt ul var".split(' ').each(function(name){
  window['$'+name] = function(){
    var args = Array.from(arguments);
    args.unshift(name);
    return Builder.wrap.apply(Builder, args);
  };
});
window['$T'] = function(s){
  return document.createTextNode(s);
};
