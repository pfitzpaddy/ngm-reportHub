(function($){
  $(function(){

  	// metrics
  	var users = 0,
  			locations = 0,
  			reports = 0;

		// materialize components
  	$('.parallax').parallax();

  	// jQuery requests for metric data
		$.get( 'http://192.168.33.16/api/metrics/getUsers', function( data ) {
		  users = data.value;
		  $( '.users' ).html( users );
		});
  	// jQuery requests for metric data
		$.get( 'http://192.168.33.16/api/metrics/getLocations', function( data ) {
		  locations = data.value;
		  $( '.locations' ).html( locations );
		});
  	// jQuery requests for metric data
		$.get( 'http://192.168.33.16/api/metrics/getReports', function( data ) {
		  reports = data.value;
		  $( '.reports' ).html( reports );
		});

  	// animate dashboard image on scroll
		var dashboard = new Waypoint({
		  element: document.getElementById('promo-title'),
		  handler: function() {
		    $('.dashboard').css( 'display', 'block' );
		  }
		});

  	// animate metrics on scroll
  	var animate = true;
		var dashboard = new Waypoint({
		  element: document.getElementById('feature-row-1'),
		  handler: function() {
		  	if ( animate ) {
			    $('#users').animateNumber({ 
			    	number: users,
			    	numberStep: $.animateNumber.numberStepFactories.separator(',')
			    }, 4000 );
			    $('#locations').animateNumber({ 
			    	number: locations,
			    	numberStep: $.animateNumber.numberStepFactories.separator(',') 
			    }, 4000 );
			    $('#reports').animateNumber({ 
			    	number: reports,
			    	numberStep: $.animateNumber.numberStepFactories.separator(',') 
			    }, 4000 );
			    animate = false;
			  }
		  }
		});

  }); // end of document ready
})(jQuery); // end of jQuery name space