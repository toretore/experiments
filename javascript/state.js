var StateMachine = function(initial){
  this.current = this.initial = initial;
  this.scope = this;
};

(function(p){

  p.states = {};
  p.events = [];

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

})(StateMachine.prototype);
