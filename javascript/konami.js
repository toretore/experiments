/*
*  KonamiKomando - executes a function when the user presses the "Konami Code",
*  up, up, down, down, left, right, left, right, b, a
*
*  Uses Prototype, but can easily be ported
*
*  Usage: KonamiKomando(function(){ alert('KONAMI'); });
*/
var KonamiKomando = function(fn){

  var keys = $w('UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT').map(function(k){
        return Event['KEY_'+k];
      }).concat([98,97]),
      nextIndex = 0;

  document.observe('dom:loaded', function(){
    document.observe('keypress', function(e){
      var keyCode = e.keyCode || e.charCode;
      if (keyCode == keys[nextIndex]) {
        if (nextIndex == keys.length-1) {
          fn();
          nextIndex = 0;
        } else {
          nextIndex += 1;
        }
      } else {
        nextIndex = 0;
      }
    });
  });

};
