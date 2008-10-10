// Finite state machine - WIP!

var StateMachine = function(initial){
  this.current = this.initial = initial;
  this.scope = this;
};

(function(p){

  p.states = {};
  p.events = {};

  p.addState = function(name, callbacks){
    var s = {};
    for (var p in callbacks) {
      if (p.match(/^on/) && callbacks.hasOwnProperty(p)) {
        s[p] = callbacks[p];
      }
    }
    this.states[name] = s;
  };

  p.addEvent = function(name, from, to){
    this.events[name] = [from,to];
    this[name] = function(){ this.event(name); };
  };

  p.changeState = function(stateName){
    var next = this.states[stateName];
    if (!next) return false;
    var current = this.states[this.current];
    current.onExit && current.onExit.call(this.scope, next);
    next.onEnter && next.onEnter.call(this.scope, current);
    this.current = stateName;
    current.onExited && current.onExited.call(this.scope, next);
    next.onEntered && next.onEntered.call(this.scope, current);
    return this.current;
  };

  p.event = function(name){
    var e = this.events[name];
    if (!e || this.current != e[0]) return false;
    this.changeState(e[1]);
  };

})(StateMachine.prototype);
