YUI.add('builder', function(Y){

  function Builder(){
    this.name = arguments[0];

    if (typeof arguments[1] === 'string') {
      this.content = document.createTextNode(arguments[1]);
    } else if (arguments[1] && arguments[1].toDomElement) {
      this.content = arguments[1].toDomElement();
    } else if (arguments[1] instanceof HTMLElement || Y.Lang.isArray(arguments[1])) {
      this.content = arguments[1];
    } else if (typeof arguments[1] === 'object') {
      this.attributes = arguments[1];
    }

    if (!this.content && typeof arguments[2] === 'string') {
      this.content = document.createTextNode(arguments[2]);
    } else if (!this.content && arguments[2] && arguments[2].toDomElement) {
      this.content = arguments[2].toDomElement();
    } else if (!this.content && (arguments[2] instanceof HTMLElement || Y.Lang.isArray(arguments[2]))) {
      this.content = arguments[2];
    } else if (!this.attributes && typeof arguments[2] === 'object') {
      this.attributes = arguments[2];
    }

    if (!this.content) { this.content = null; }
    if (!this.attributes) { this.attributes = {}; }

    if (Y.Lang.isArray(this.content)) {
      Y.each(this.content, function(c, i){
        if (typeof c === 'string') {
          this.content[i] = document.createTextNode(c);
        } else if (c.toDomElement) {
          this.content[i] = c.toDomElement();
        }
      });
    }
  };

  Builder.prototype.toDomElement = function(){
    var e = document.createElement(this.name.toLowerCase());
    Y.each(this.attributes, function(v,p){ e.setAttribute(p,v); });
    if (this.content) {
      if (Y.Lang.isArray(this.content)) {
        Y.each(this.content, function(c){ e.appendChild(c); });
      } else {
        e.appendChild(this.content);
      }
    }
    return e;
  };

  Builder.prototype.toHTML = function(){
    var s = '<'+this.name;
    Y.each(this.attributes, function(v,a){
      s = s+' '+a+'="'+v+'"'
    });
    this.content && (s = s+'>'+this.toDomElement().innerHTML.replace(/<(.*?)>/g, function(m,t){ return '<'+t.toLowerCase()+'>'; })+'</'+this.name)
    s = s+'>'
    return s;
  };

  Builder.prototype.toWrappedDomElement = function(){
    return Y.get(this.toDomElement());
  };

  Builder.create = function(){
    function F(){};
    F.prototype = this.prototype;
    var o = new F();
    this.apply(o, arguments);
    return o;
  };

  Builder.dom = function(){
    return this.create.apply(this, arguments).toDomElement();
  };

  Builder.wrap = function(){
    return this.create.apply(this, arguments).toWrappedDomElement();
  };

  Y.Builder = Builder;

}, '3.0.0pr2', {requires:['yui', 'oop']});
