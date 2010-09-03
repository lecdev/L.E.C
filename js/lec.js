(function(){
  var lec, update_list = $("#updates"), L = {
    init: function() {
      //this.m.hideGracefulElements();
      setTimeout(this.m.load_updates,1000);
    },
    m: {
      hideGracefulElements: function() {
        $(".graceful").hide();
      },
  		load_updates: function() {
  			$.getJSON("/stream", function(updates) {
  				$.each(updates, function() {
  					$("<li>").html(this.text).prependTo(update_list);
  				});
  				L.m.load_updates();
  			});
  		}      
    }
  };
  $(document).ready(function(){
    L.init();
  });
})();