(function(){

  var global = this;

  Carousel = Class.create({

    initialize: function(el, windowSize){
      this.element = $(el);
      this.windowSize = windowSize || 3;
      this.images = this.findImages();
      this.setActive(0);
      this.observe();
      if (global.Broadcaster) this.b = new Broadcaster();
    },
    
    setActive: function(start, count){
      this.images.invoke('setActive', false);
      if (start < 0) start = 0;
      count = count || this.windowSize;
      this.windowSize = count;
      var end = start + count;
      if (end < this.images.length) {
        this.images.slice(start, end).invoke('setActive', true);
      } else {
        start = this.images.length - count;
        this.images.slice(start).invoke('setActive', true);
      }
      this._start = start;
      this.fire('change', this.getActive());
    },
    
    getActive: function(){
      return this.images.select(function(i){ return i.isActive(); });
    },

    next: function(count){
      count = count || 1;
      this.fire('next', count);
      this.setActive(this._start + count);
    },

    prev: function(count){
      count = count || 1;
      this.fire('prev', count);
      this.setActive(this._start - count);
    },

    findImages: function(){
      return this.element.select('.image').map(function(el){
        return new Carousel.Image(el);
      });
    },

    observe: function(){
      var next = this.element.down('.next'),
          prev = this.element.down('.prev'),
          carousel = this;

      next && next.observe('click', function(e){
        e.stop();
        carousel.next();
      });
      
      prev && prev.observe('click', function(e){
        e.stop();
        carousel.prev();
      });
    },

    fire: function(){
      this.b && this.b.send.apply(this.b, arguments)
    }

  });

  Carousel.instances = [];
  Carousel.locate = function(){
    var i = this.instances;
    $$('.carousel').map(function(e){
      var c = new Carousel(e);
      i.push(c);
      return c;
    });
  };

  Carousel.Image = Class.create({

    initialize: function(el, carousel){
      this.element = $(el);
      this.carousel = carousel;
    },

    setActive: function(b){
      this.element[b ? 'addClassName' : 'removeClassName']('active');
    },

    isActive: function(){
      return this.element.hasClassName('active');
    }

  });


  document.observe('dom:loaded', function(){
    Carousel.locate();
  });

})();
