Ryanair = {
  calendars: [],
  b: new Broadcaster()
};

Ryanair.Calendar = ActiveElement.Base.spawn('calendar', {

  extend: {
    findInDocument: function(){
      return $$('table.calendar').map(function(t){
        return new Ryanair.Calendar(t);
      });
    },
    attach: function(cals){
      cals.each(function(cal){
        Ryanair.calendars.push(cal);
        if (cal.get('type')) { Ryanair.calendars[cal.get('type')] = cal; }
      });
    }
  },
  
  afterInitialize: function(){
    this.days = this.findDays();
    this.observe();
  },

  getTypeValue: function(){
    return this.element.getLabel('type');
  },

  findDays: function(){
    return this.element.select('tbody .day').map(function(d){
      return new Ryanair.Calendar.Day(d);
    });
  },
  
  activateDay: function(day){
    this.days.invoke('inactivate');
    day.activate();
  },

  observe: function(){
    this.element.observe('click', function(e){
      var el = e.element();
      el = el.hasClassName('day') ? el : el.up('.day');
      var day = el && this.days.find(function(d){ return d.element == el; });
      if (day && !day.isDisabled()) {
        this.activateDay(day);
      }
    }.bindAsEventListener(this));
  }

});


Ryanair.Calendar.Day = ActiveElement.Base.spawn('day', {

  afterInitialize: function(){
    this.isSelected() ? this.activate() : this.inactivate();
    this.element.addClassName('enhanced');
  },

  getDayValue: function(){
    return this.element.down('input').getLabel('day', '_');
  },
  
  isDisabled: function(){
    return this.element.hasClassName('disabled');
  },
  
  isSelected: function(){
    return !this.isDisabled() && this.element.down('input').checked;
  },

  activate: function(){
    if (!this.isDisabled()) {
      this.element.removeClassName('inactive');
      this.element.addClassName('active');
    }
  },

  inactivate: function(){
    if (!this.isDisabled()) {
      this.element.removeClassName('active');
      this.element.addClassName('inactive');
    }
  }

});


Ryanair.Map = Class.create({

  initialize: function(el){
    this.element = el;
    this.cities = this.findCities();
    this.insertCities();
    this.observe();
  },
  
  getFromSelect: function(){
    return this.element.down('#from');
  },
  
  getDestinationSelect: function(){
    return  this.element.down('#destination');
  },
  
  getFromCity: function(){
    var select = this.getFromSelect();
    var option = select.options[select.selectedIndex];
    return option && this.cities.find(function(c){
      return c.code == option.value;
    });
  },
  
  getDestinationCity: function(){
    var select = this.getDestinationSelect();
    var option = select.options[select.selectedIndex];
    return option && this.cities.find(function(c){
      return c.code == option.value;
    });
  },
  
  setFromCity: function(city){
    var index,
        select = this.getFromSelect();
    select.select('option.city').each(function(o,i){
      if (o.value == city.code) {
        index = i;
        return;
      }
    });
    if (index) select.selectedIndex = index;
  },

  setDestinationCity: function(city){
    var index,
        select = this.getDestinationSelect();
    select.select('option').each(function(o,i){
      if (o.value == city.code) {
        index = i;
        return;
      }
    });
    if (index) select.selectedIndex = index;
  },

  findCities: function(){
    return this.getFromSelect().select('option.city').map(function(opt){
      return new Ryanair.Map.City(opt.value, opt.innerHTML);
    });
  },

  insertCities: function(){
    var map = this;
    this.cities.each(function(city){
      map.element.down('#image').insert({bottom:city.toElement()});
    });
  },

  observe: function(){
    Ryanair.b.listen('city selected', function(city){
      if (this.getFromCity()) {
        this.setDestinationCity(city);
      } else {
        this.setFromCity(city);
      }
    }, this);
  }

});

Ryanair.Map.locate = function(){
  Ryanair.map = new this($('map'));
};

Ryanair.Map.City = Class.create({

  initialize: function(code, name){
    this.code = code;
    this.name = name
    this.listen();
  },

  toElement: function(){
    var city = this;
    var a = new Element('a', {'class':'city '+this.code, href:'#'})
    a.update('<span class="bullet">●</span><span class="name">'+this.name+'</span>');
    a.observe('click', function(e){
      e.stop();
      Ryanair.b.send('city selected', city);
    });
    this.element = a;
    return a;
  },

  select: function(){
    this.element.addClassName('selected');
  },

  deselect: function(){
    this.element.removeClassName('selected');
  },

  listen: function(){
    Ryanair.b.listen('city selected', function(city){
      this[city == this ? 'select' : 'deselect']();
    }, this);
  }

});


document.observe('dom:loaded', function(){
  Ryanair.Map.locate();
});
