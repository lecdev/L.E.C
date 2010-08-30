function(){
  var lec, L = {
    init: function() {
      this.m.hideGracefulElements();
    },
    m: {
      hideGracefulElements: function() {
        $(".graceful").hide();
      }
    }
  };
  $(document).ready(function(){
    L.init();
  });
})();