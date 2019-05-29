(function($){
  $(function(){

		$('.sidenav').sidenav();

		// set listeners
		$( document ).ready(function () {
			
			// earthquake data
			$( '#get-earthquake-data' ).click(function () {
				tableau.connectionName = 'USGS Earthquake Feed';
				tableau.submit();
			});

			// kobo data
			$( '#get-kobo-data' ).click(function () {
				tableau.connectionName = 'Temperature-controlled storage capacity assessment';
				tableau.submit();
			});

		});

  }); // end of document ready
})(jQuery); // end of jQuery name space
