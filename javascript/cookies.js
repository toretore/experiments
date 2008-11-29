/*
  Over-engineered cookie getter and setter.
*/

var Cookie = (function(){

  var defaultOptions = {
    domain: window.location.hostname,
    path: '/'
  };

  return function(name, value, options){
    
    for (var p in defaultOptions) {
      if (defaultOptions.hasOwnProperty(p)) {
        this[p] = defaultOptions[p];
      }
    }
    
    if (typeof options === 'object') {
      for (p in options) {
        if (options.hasOwnProperty(p)) {
          this[p] = options[p];
        }
      }
    }
    
    this.name = name;
    this.value = value;
  };
  
})();

Cookie.prototype = {
  
  toCookieString: function(){
    var date = new Date(), expires;
    if (typeof this.expires === 'number') {
      date.setTime(date.getTime() + this.expires*24*60*60*1000);
      expires = '; expires=' + date.toGMTString();
    } else if (this.expires === true) {
      date.setTime(date.getTime() - 1000);
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }
    return this.name + '=' + this.value + expires + '; path=' + this.path;
  },
  
  toString: function(){
    return '<Cookie:' + this.name + ': ' + this.value + '>';
  }
  
};


var Cookies = [];

Cookies.findIndex = function(name){
  var index = -1;
  for (var i = 0; i < this.length; i++) {
    if (this[i].name === name) { index = i; break; }
  }
  return index;
};

Cookies.find = function(name){
  var i = this.findIndex(name);
  return i < 0 ? null : this[i];
};

Cookies.get = function(name){
  var c = this.find(name);
  return c && c.value;
};

Cookies.set = function(name, value, options){
  var c = (name instanceof Cookie) ? name : new Cookie(name, value, options);
  var existingIndex = this.findIndex(c.name);
  if (existingIndex >= 0) { this.splice(existingIndex, 1); }
  document.cookie = c.toCookieString();
  return this.push(c);
};

Cookies.remove = function(name){
  var i = this.findIndex(name);
  if (i > -1) {
    var c = this.splice(i, 1)[0];
    c.expires = true;
    document.cookie = c.toCookieString();
  }
};

Cookies.parse = function(cookieString) {
  var cookies = [],
      strings = cookieString.split(';'),
      i, j, segments, name, value;
      
  for (i = 0; i < strings.length; i++) {
    segments = strings[i].split('=');
    name = segments.shift().replace(/^ +| +$/g, '');
    value = segments.join('=');
    cookies.push(new Cookie(name, value));
  }
  
  return cookies;
};

Cookies.initialize = function(cookieString){
  if (typeof cookieString !== 'string') { cookieString = document.cookie; }
  var i, c;
  while (this.length) { this.pop(); }
  c = Cookies.parse(document.cookie);
  for (i = 0; i < c.length; i++) { this.push(c[i]); }
};

Cookies.initialize();