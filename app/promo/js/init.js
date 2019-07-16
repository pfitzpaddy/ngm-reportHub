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
          dashboard5w = "Dashboard de Actividades",
  				loginbuttontitle = "Inicio de Sesión o Registro para Empezar";
  				meta1 = '4wPlus, Dashboard, Reporte, Indicadores, Colombia';
  			    logotitle= '4wPlus';
  			    link5wdashboardhref= '/desk/#/cluster/5w/amer/col';
  			    link5wdashboardtitle = 'Ver el 5W Dashboard';
  			    h1feature='4wPlus';
  			    h2feature= 'Informes de flujo de trabajo. Apoyo a las decisiones en Tiempo real.'
  			    pfeature='4wPlus ofrece un sistema fácil de usar que incluye alertas y notificaciones para un flujo de trabajo diario de informes, adaptado a sus necesidades. Una vez que se ingresa, el motor de análisis procesa los indicadores clave del negocio para que el soporte de decisiones esté disponible mediante paneles interactivos. Todo esto en tiempo real.';
  			    featureimage = "Indicadores de Negocio en Tiempo Real",
  			    imagetoolbox = "4wPlus Toolbox";
  			    h1featureteal = "A MEDIDA DE SUS NECESIDADES";
  			    reportingh5 = "Reportando";
  			    reportingp = "4wPlus permite informes personalizados para capturar los indicadores requeridos";
  			    validationh5 = "Validación";
  			     validationp = "Todos los informes se validan al momento de la entrada y se pueden revisar para garantizar la confiabilidad";
                notificationsh5= "Notificaciones";
                notificationsp= "4wPlus programa alertas y notificaciones para mantenerlo actualizado";
               dataplatformh5= "Plataforma de Datos";
               dataplatformp = "Se puede acceder a todos los datos e indicadores clave a través del motor de análisis para un análisis en profundidad";
               dashboardsp = "4wPlus ofrece un completo motor de visualización de datos y paneles para explorar sus datos";
                globalp = "4wPlus se escala fácilmente con la capacidad de cubrir todos sus requisitos de informes globales";
  		       metricsh1 = "MÉTRICAS";
  		       metricsh2 = "Cumplir con los Requisitos de los Informes Humanitarios";
  		       metricsp = "";
  		       metricsusers = "Usuarios";
  		       metricslocations = "Ubicaciones";
  		       metricsreports = "Reportes";
  		       parallaxh5= "apoyando a la comunidad humanitaria para salvar vidas."


  			}else{
  				$( '.href' ).show();
  				$('.href2').hide();
  				

  				//original
  			title = "ReportHub";
  			humanitariandesicion = "Humanitarian Decision Support in Real-Time";
  			 getstarted ="Get Started";
         dashboard5w = "5W Dashboard",
  			 loginbuttontitle = "Login or Register to Get Started";
  			 meta1='ReportHub, Dashboard, Reporting, Key Business Indicators';
  			 logotitle= 'REPORTHUB';
  			 link5wdashboardhref= '/desk/#/cluster/5w';
  			  link5wdashboardtitle = 'View the 5W Dashboard';
  			  h1feature='ReportHub';
  			  h2feature= 'Reporting Workflow. Decision Support. Real-Time.';
  			  pfeature='ReportHub provides an easy-to-use system that includes alerts and notifications for a daily reporting workflow, tailored to your needs. Once entered, the analytics engine processes key business indicators for decision support made available via interactive dashboards. All of this in real-time.';
             featureimage = "Business Indicators in Real-Time";
             imagetoolbox = "ReportHub Toolbox";
               			    h1featureteal = "TAILORED TO YOUR NEEDS";
               			    reportingh5 = "Reporting";
               			    reportingp = "ReportHub enables customised reports to capture the required business indicators";
             			    validationh5 = "Validation";
             			    validationp = "All reports are validated upon entry and can be reviewed to ensure reliability";
            notificationsh5="Notifications";
            notificationsp = "ReportHub schedules alerts and notifications to keep you up-to-date";
            dataplatformh5= "Data Platform";
            dataplatformp = "All data and key indicators are accessible via the analytics engine for in-depth analysis";
             dashboardsp="ReportHub offers a comprehensive data-visualisation and dashboard engine to explore your data";
            globalp ="ReportHub scales easily with the capability to cover all your global reporting requirements";
            metricsh1 ="METRICS";
            metricsh2 = "Meeting the Requirements of Humanitarian Reporting";
            metricsp="Since its launch in April 2017, ReportHub has significantly contributed to the humanitarian response efforts in Afghanistan by providing decision support in real-time. Initially implemented by the Afghanistan Health Cluster in 2016, ReportHub has since been expanded at the request of the ICCT to cover the reporting needs of all Afghanistan Humanitarian Clusters and Working Groups. In doing so, ReportHub has become the official HRP reporting platform for Afghanistan and is now being expanded into the Horn of Africa. Once partners submit a report, cluster indicators are available in real-time for analysis via RESTful APIs, from the dashboard for decision support and with direct links to UNOCHA's HPC tools for HRP reporting. Currently, ReportHub has <span class='users'>0</span> Users reporting on <span class='locations'>0</span> Locations for which <span class='reports'>0</span> beneficiary Reports have been submitted. ";
  			metricsusers = "Users";
  			metricslocations = "Locations";
  			metricsreports = "Reports";
  			  		       parallaxh5= "supporting the humanitarian community to save lives"

  			};

  		   document.getElementsByName('description')[0].content = meta1;
  		     document.getElementsByName('loginbuttontitle')[0].title = loginbuttontitle;
  		    document.getElementsByName('logo')[0].title = logotitle;
  		   document.getElementsByName('link5wdashboard')[0].title = link5wdashboardtitle;
  		   document.getElementsByName('link5wdashboard')[0].href = link5wdashboardhref;
  		   document.getElementsByName('featureimage')[0].title = featureimage;
  		     		   document.getElementsByName('imagetoolbox')[0].title = imagetoolbox;





  			$('#title').html(title);
  				$('#promo-title').html(title);
  				$('.brand-logo').html(title);
  				$('#humanitariandesicion').html(humanitariandesicion);
  				$('#getstarted').html(getstarted);
          $('#dashboard5w').html(dashboard5w);
  				$('#h1feature').html(h1feature);
  				$('#h2feature').html(h2feature);
  				$('#pfeature').html(pfeature);
  				$('#h1featureteal').html(h1featureteal);
  				$('#reportingh5').html(reportingh5);
  				$('#reportingp').html(reportingp);
  				$('#validationh5').html(validationh5);
  				$('#validationp').html(validationp);
  				$('#notificationsh5').html(notificationsh5);
  				$('#notificationsp').html(notificationsp);
  				$('#dataplatformh5').html(dataplatformh5);
  				$('#dataplatformp').html(dataplatformp);
  				$('#dashboardsp').html(dashboardsp);
  				$('#globalp').html(globalp);
  				$('#metricsh1').html(metricsh1);
  				$('#metricsh2').html(metricsh2);
  				$('#metricsp').html(metricsp);
  				$('#metricsusers').html(metricsusers);
  				$('#metricslocations').html(metricslocations);
  				$('#metricsreports').html(metricsreports);
  				  				$('#parallaxh5').html(parallaxh5);

  				


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

		if(href  === 'https://4wplus.org/' || href ==='http://35.229.43.63/'){

			var hrefrh = 'http://reporthub.immap.org';
			$.get( hrefrh+ '/api/metrics/getUsers' , function( data ) {
			  users = data.value;
			  $( '.users' ).html( users );
			});


			$.get( hrefrh + '/api/metrics/getLocations', function( data ) {
			  locations = data.value;
			  $( '.locations' ).html( locations );
			});
	  	// jQuery requests for metric data
			$.get( hrefrh + '/api/metrics/getReports', function( data ) {
			  reports = data.value;
			  $( '.reports' ).html( reports );
			});



        }else{// jQuery requests for metric data
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

	    }

  	
  	

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