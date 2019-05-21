(function($){
  $(function(){

  	// metrics
  	var users = 0,
  			locations = 0,
  			reports = 0,
  			href = window.location.href; // http://reporthub.immap.org
            
            

  			if(href  === 'https://4wplus.org/' || href ==='http://35.229.43.63/' ){ //https://4wplus.org/
  				$( '.href' ).hide();
  				$('.href2').show();
  				title = "4wPlus";
  				humanitariandesicion = "Apoyo a Decisiones Humanitarias en Tiempo-Real";
  				getstarted ="Comenzar";
  				loginbuttontitle = "Inicio de Sesión o Registro para Empezar";
  			
  				



  			}else{
  				$( '.href' ).show();
  				$('.href2').hide();
  				

  				//original
  			title = "ReportHub";
  			humanitariandesicion = "Humanitarian Decision Support in Real-Time";
  			 getstarted ="Get Started";
  			 loginbuttontitle = "Login or Register to Get Started";



  			};

  			$('#title').html(title);
  				$('#promo-title').html(title);
  				$('.brand-logo').html(title);
  				$('#humanitariandesicion').html(humanitariandesicion);
  				$('#getstarted').html(getstarted);
  				//$('login-button').html(loginbuttontitle);
 


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