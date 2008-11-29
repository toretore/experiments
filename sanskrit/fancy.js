window.onload = function(){
  var textarea = document.getElementById('fancypants');
  new Sanskrit(textarea, {
    className: 'fancy',
    onSubmit: function(){ alert(this.textilize(this.getContents())); return false },
    toolbar: {
      onStrong: function(){ alert('What a bold move') },
      actions: {'strong': 'B', 'em': 'I', 'ins': 'U', 'del': 'S', 'link': 'Link', 'unlink': 'Unlink', 'textile': 'Textile'}
    }
  });
}