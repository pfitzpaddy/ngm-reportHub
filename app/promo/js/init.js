(function($){
  $(function(){

  	// metrics
  	var users = 0,
  			locations = 0,
  			reports = 0,
  			href = window.location.href; // http://reporthub.immap.org

		// materialize components
  	$('.parallax').parallax();

  	// logo
		$('.logo').click(function() {
			$('html, body').animate({
				scrollTop: $('.navbar-fixed').offset().top
			}, 1000);
		});

		// if screen size is >= 600px, animate immediately
		if ( $( window ).height() >= 600 ) {
			setTimeout( function(){
				$( '.dashboard' ).css( 'display', 'block' );	
			}, 400 );
		}

  	// animate dashboard image on scroll
		var dashboard = new Waypoint({
		  element: document.getElementById( 'promo-title' ),
		  handler: function() {
		    $( '.dashboard' ).css( 'display', 'block' );
		  }
		});

		// prezi
		$('iframe').load(function(){

			var myConfObj = {
				iframeMouseOver: false
			}
			// onclick
			$( window ).blur( function(){
			  if(myConfObj.iframeMouseOver){
			  	$('.pointers').css({ 'pointer-events': 'all' });
			  }
			});
			$( '.prezi' ).mouseover( function(){
			   myConfObj.iframeMouseOver = true;
			});
			$( '.prezi' ).mouseout( function(){
			    myConfObj.iframeMouseOver = false;
			});
		});

		// prezi
		// var player = new PreziPlayer( 'prezi-player', { preziId: 'gqskqhfbjm2p', width: '100%', height: 600, explorable: false });

		// // each step
		// player.on(PreziPlayer.EVENT_CURRENT_STEP, function(e) {
		//   console.log( e.value );
		//   console.log( player.getCurrentStep() )
		// });

  	// jQuery requests for metric data
		$.get( href + '/api/metrics/getUsers', function( data ) {
		  users = data.value;
		  $( '.users' ).html( users );
		});
  	// jQuery requests for metric data
		$.get( href + '/api/metrics/getLocations', function( data ) {
		  locations = data.value;
		  $( '.locations' ).html( locations );
		});
  	// jQuery requests for metric data
		$.get( href + '/api/metrics/getReports', function( data ) {
		  reports = data.value;
		  $( '.reports' ).html( reports );
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
})( jQuery ); // end of jQuery name space