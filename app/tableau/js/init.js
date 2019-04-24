(function($){
  $(function(){

	$('.sidenav').sidenav();

	// set listeners
	$( document ).ready(function () {
		$( '#get-earthquake-data' ).click(function () {
			tableau.connectionName = 'USGS Earthquake Feed';
			tableau.submit();
		});
	});

  }); // end of document ready
})(jQuery); // end of jQuery name space
