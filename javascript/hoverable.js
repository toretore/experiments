/* 
 *  Hoverable - adds a class name to an element after the element has been hovered over
 *  for x seconds.
 */
Hoverable = Class.create({

  initialize: function(el, options){
    this.element = el;
    this.options = options || {};
    this.options.className = this.options.className || 'hover';
    this.options.timeout = this.options.timeout || 1000;
    this.observe();
  },

  activate: function(){
    this.element.addClassName(this.options.className);
  },
  deactivate: function(){
    this.element.removeClassName(this.options.className);
  },
  isActive: function(){
    return this.element.hasClassName(this.options.className);
  },

  enter: function(){
    this._timeout = setTimeout(function(){
      this.activate();
      this._timeout = null;
    }.bind(this), this.options.timeout);
  },
  leave: function(){
    if (this._timeout) { clearTimeout(this._timeout); }
    else { this.deactivate(); }
  },

  observe: function(){
    var that = this, el = this.element,
        isOuter = this.relatedTargetIsOutsideElement;
    el.observe('mouseover', function(e){
      isOuter(e, el) && that.enter();
    });
    el.observe('mouseout', function(e){
      isOuter(e, el) && that.leave();
    });
  },

  //Returns true if the event happened when crossing the
  //"outer border" of the element, i.e. not between child
  //elements.
  relatedTargetIsOutsideElement: function(e, el){
    var parent = e.relatedTarget;
    while (parent && parent != el) {
      try { parent = parent.parentNode; }
      catch (e) { parent = element; }
    }
    return parent != el;
  }

});

//Find all elements with class "hoverable" and make them.. hoverable.
Hoverable.locate = function(){
  this.instances = $$('.hoverable').map(function(el){
    return new Start.Hoverable(el);
  });
};
