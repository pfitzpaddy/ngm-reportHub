/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmReportHub', [
		// vendor
	    'pascalprecht.translate',
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngTable',
		'ngCsv',
		'ngDropzone',
		'ngCountTo',
		'ngAria',
		'ngMaterial',
		'highcharts-ng',
		'leaflet-directive',
		'xeditable',
		// ngm
		'ngm',
		'ngm.widget.form.authentication',
		'ngm.widget.project.details',
		'ngm.widget.project.financials',
		// 'ngm.widget.project.reports.list',
		'ngm.widget.project.report',
		'ngm.widget.organization.stocks.list',
		'ngm.widget.organization.stock',
		// modules
		'ngmBangladesh',
		'ngmCluster',
		'ngmEthiopia',
		'ngmDews',
		'ngmDrr',
    'ngmEpr',
    'ngmSbp',
		'ngmiMMAP',
		'ngmNutrition',
		'ngmDrought',
		// utils
		'angularUtils.directives.dirPagination',
		// widgets
		'ngm.widget.calHeatmap',
		'ngm.widget.dropzone',
		'ngm.widget.highchart',
		'ngm.widget.html',
		'ngm.widget.leaflet',
		'ngm.widget.list',
		'ngm.widget.modal',
		'ngm.widget.stats',
		'ngm.widget.table',
		'ngm.materialize.select',
	])
	.config([ '$routeProvider', '$locationProvider', '$compileProvider', '$translateProvider', function ( $routeProvider, $locationProvider, $compileProvider, $translateProvider ) {

		// from http://mysite.com/#/notes/1 to http://mysite.com/notes/1
		// $locationProvider.html5Mode(true);

		// translate staic files
    $translateProvider.useStaticFilesLoader({
      prefix: 'scripts/app/translate/locale-',
      suffix: '.json'
    });


    // get
		$translateProvider.preferredLanguage('en');
		$translateProvider.forceAsyncReload(true);

		// extend localstorage to set an object
		Storage.prototype.setObject = function( key, value ) {
			this.setItem( key, JSON.stringify( value ) );
		} 

		// extend localstorage to get an object
		Storage.prototype.getObject = function( key ) {
			var value = this.getItem( key );
			return value && JSON.parse( value );
		}

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false );

		// all routes prescribed within specific module app.js files
		$routeProvider
			
			// LOGIN
			.when( '/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})			
			// FORBIDDEN
			.when( '/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return !ngmAuth.isAuthenticated();
					}],
				}
			})
			// TEAM
			.when( '/team', {
				redirectTo: '/team/all/all/all/all'
			})
			.when( '/team/:admin0pcode/:organization_tag/:project/:cluster_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardTeamCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// PROFILE
			.when( '/profile', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardProfileCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/profile/:username', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardProfileCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// achievements
			.when( '/reporthub', {
				redirectTo: '/reporthub/2016'
			})
			.when( '/reporthub/login', {
				redirectTo: '/reporthub/2016'
			})
			// achievements
			.when( '/reporthub/:year', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardReportHubCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// DEFAULT
			// .otherwise({
			// 	redirectTo: '/cluster/projects'
			// });
	}])
	.run([ '$rootScope', '$window', '$location', 'ngmAuth', 'ngmUser', function( $rootScope, $window, $location, ngmAuth, ngmUser ) {

		// check session by last login
		ngmAuth.setSessionTimeout( ngmUser.get() );
		
		// new guest page visit
		if ( ngmUser.get() && ngmUser.get().guest ) {
			ngmUser.unset();
		}

		

		// check URL
		if ( $location.$$host.search('dev') > -1 ) {
			// add DEV message if necissary
			$('#print').append('<h4 class="grey-text text-lighten-2" style="position:absolute;top:0;right:0;padding-right:165px;padding-top:35px;">TEST VERSION</h4>');
		}

		// IE checks!!!!!!
		if (/MSIE 10/i.test($window.navigator.userAgent)) {
		   // This is internet explorer 10
		   openIeModal();
		}
		if (/MSIE 9/i.test($window.navigator.userAgent) || /rv:11.0/i.test($window.navigator.userAgent)) {
		    // This is internet explorer 9 or 11
		    openIeModal();
		}
		if (/Edge\/\d./i.test($window.navigator.userAgent)){
		   // This is Microsoft Edge
		   openIeModal();
		}
		// open modal
		function openIeModal() {
			$('#ngm-ie-modal').openModal({dismissible: false});
		}

		// when error on route update redirect
		$rootScope.$on( '$routeChangeError', function( event, current, previous, rejection ) {

			// get app
			var app = current.$$route.originalPath.split('/')[1];
			if ( rejection === ngmAuth.UNAUTHORIZED ) {
				$location.path( '/' + app + '/login' );
			} else if ( rejection === ngmAuth.FORBIDDEN ) {
				$location.path( '/' + app + '/forbidden' );
			}

		});

	}])
	.controller('ngmReportHubCrtl', ['$scope', '$route', '$location', '$http', '$timeout', 'ngmAuth', 'ngmUser','$window','$translate','$filter', function ($scope, $route, $location, $http, $timeout, ngmAuth, ngmUser,$window,$translate,$filter) {
	     

         


		// ngm object
		$scope.ngm = {

			// app name
			title: $filter('translate')('welcome'), 


           // var4wplusrh : 'REPORTHUB',
			// current route
			route: $route,

			// dashboard placeholder
			dashboard: {},

			// top navigation page menu
			navigationMenu: false,

			// left menu
			menu: {
				search: true,
				focused: false,
				query: []
			},

			// page height
			height: $( window ).height(),

			// dashboard footer
			footer: false,

			// change language
			changeFunction : function ($key) {
			   $translate.use($key);
			 },

			// paint application
			setApplication: function( app ) {

				// set app colors based on 
				switch( app ){
					case 'who':
						// set style obj
						if ( $location.$$path.split('/')[2] === 'ethiopia' ) {
							$scope.ngm.style = {
								logo: 'logo-health.png',
								home: '#/who/ethiopia',
								darkPrimaryColor: '#1976D2',
								defaultPrimaryColor: '#2196F3',
								lightPrimaryColor: '#BBDEFB'
							}
						} else {
							$scope.ngm.style = {
								logo: 'logo-who.png',
								home: '#/who',
								darkPrimaryColor: '#1976D2',
								defaultPrimaryColor: '#2196F3',
								lightPrimaryColor: '#BBDEFB'
							}
						}
						break;
					case 'immap':
						// set style obj
						$scope.ngm.style = {
							logo: 'logo-immap.png',
							home: '#/immap',
							darkPrimaryColor: '#DE696E',
							defaultPrimaryColor: '#EE6E73',
							lightPrimaryColor: '#EF9A9A'
						}
						break;
          case 'epr':
            // set style obj
            $scope.ngm.style = {
              logo: 'logo-health.png',
              home: '#/epr',
              darkPrimaryColor: '#1976D2',
              defaultPrimaryColor: '#2196F3',
              lightPrimaryColor: '#BBDEFB'
            }
            break;
          case 'reporthub':
            // set style obj
            $scope.ngm.style = {
              logo: 'logo.png',
              home: '#/reporthub',
              darkPrimaryColor: '#1976D2',
              defaultPrimaryColor: '#2196F3',
              lightPrimaryColor: '#BBDEFB'
            }
            break;
          case 'snapshot':
            // set style obj
            if ( $location.$$path.split('/')[2] === 'immap' ) {
							$scope.ngm.style = {
								logo: 'logo-immap.png',
								home: '#/immap',
								darkPrimaryColor: '#DE696E',
								defaultPrimaryColor: '#EE6E73',
								lightPrimaryColor: '#EF9A9A'
							}
            } else {
							$scope.ngm.style = {
								logo: 'logo-health.png',
								home: '#/who/ethiopia',
								darkPrimaryColor: '#1976D2',
								defaultPrimaryColor: '#2196F3',
								lightPrimaryColor: '#BBDEFB'
							}
            }
            break;
					default:

						// logo
						var logo = 'logo.png';
						if ( ngmUser.get() && ngmUser.get().cluster_id ) {
							logo = 'logo-' + ngmUser.get().cluster_id + '.png';
						}

						// if WHO Ethiopia user!
						if ( ngmUser.get() && ngmUser.get().organization_tag === 'who' 
								&& ngmUser.get().admin0pcode === 'ET' ) {
							$scope.ngm.style = {
								logo: 'logo-health.png',
								home: '#/who/ethiopia',
								darkPrimaryColor: '#1976D2',
								defaultPrimaryColor: '#2196F3',
								lightPrimaryColor: '#BBDEFB'
							}
						} else {
							// default
							$scope.ngm.style = {
								logo: logo,
								home: '#/cluster',
								darkPrimaryColor: '#1976D2',
								defaultPrimaryColor: '#2196F3',
								lightPrimaryColor: '#BBDEFB'
							}
						}
				}

				// body footer
				$scope.ngm.footer = '<div>'
														+	'<div style="background: ' + $scope.ngm.style.lightPrimaryColor + '; height:20px;"></div>'
														+	'<div style="background: ' + $scope.ngm.style.defaultPrimaryColor + '; height:60px;">'
															+	'<p class="ngm-menu-footer-body" style="font-weight:300;">Supported by <a class="grey-text" href="http://immap.org"><b>iMMAP</b></a></p>'
															+ '<p id="ngm-contact" class="remove" style="display: block; float:right; padding-right:20px;"><a class="waves-effect waves-teal btn-flat" style="color:white;" onclick="contact()"><i class="material-icons left" style="color:white;">perm_contact_calendar</i>Contact</a></p>'
															+ '<p id="ngm-report-extracted" style="display: none; color:white; font-weight:100; float:right; padding-right:20px;">' +moment().format('DD MMM, YYYY @ h:mm a') + '</p>'													
														+	'</div>'
													+	'</div>';

				// set default load template
				$scope.ngm.dashboard = 	{
					model: {
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								style: 'border-bottom: 3px ' + $scope.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m9 l9 report-title truncate',
								style: 'font-size: 3.4rem; color: ' + $scope.ngm.style.defaultPrimaryColor,
								title: '',
							},
							subtitle: {
								title: ''
							},
							// download: {
							// 	'class': 'col s12 m3 l3 hide-on-small-only',
							// 	downloads: []
							// }
						},
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px; height: 90px; padding-top:10px;',
									config: {
										html: $scope.ngm.footer
									}
								}]
							}]
						}]
					}
				}
			},

            
			// user
			getUser: function() {
				// ngmUser
				return ngmUser.get();
			},


			// username
			getUserName: function() {
				// ngmUser
				if ( ngmUser.get() ) {
					return ngmUser.get().username;
				} else {
					return 'welcome';
				}
			},

			// language
			setLanguage:function(country){
				var set_language = {
					col:[{ language_id: 'en', language_name: 'English', flag:'en.png'},
							{ language_id: 'es', language_name: 'Español', flag: 'spain.png' }]					
					}
				$scope.ngm.getLanguage = set_language[country] ? set_language[country]:[];
				if ($scope.ngm.getLanguage.length>0){
					$scope.ngm.translate_version = true;
				}else{
					$scope.ngm.translate_version = false;
				}
			},
			getLanguage:[],
			translate_version:false,
			// app functions
			logout: function() {
				ngmAuth.logout();
			},

			// open contact modal
			contact: function() {
				// open modal
				$( '#ngm-contact-modal' ).openModal({ dismissible: false });
			},

			// Detect touch screen and enable scrollbar if necessary
			isTouchDevice: function () {
				try {
					document.createEvent( 'TouchEvent' );
					return true;
				} catch (e) {
					return false;
				}
			},

			// toggle search active
			toggleSearch: function(selector) {
				// toggle search input
				$( '#nav-' + selector ).slideToggle();
			},

			//
			toggleNavigationMenu: function() {
				// rotate icon
				// $( '.ngm-profile-icon' ).toggleClass( 'rotate' );
				$('.ngm-profile-icon').toggleClass('open');
				$('.ngm-profile-icon').toggleClass('rotate-icon');
				// set class
	    	$( '.ngm-profile' ).toggleClass( 'active' );
	    	$( '.ngm-profile-menu-content' ).toggleClass( 'active' );
	    	// toggle menu dropdown
				$( '.ngm-profile-menu-content' ).slideToggle();
			},
			openHome:false,
			openDashboard:false,
			openMinimize:true,
			minimizeToggle:function () {
				$scope.ngm.openMinimize = ! $scope.ngm.openMinimize;
				$('.minimize-menu').toggleClass('open');
				// if ($scope.ngm.openMinimize){
				// 	$('main').css('padding-left','280px');
				// }else{
				// 	$('main').css('padding-left', '0px');
				// }
				// $('.ngm-minimize-flat > a').toggleClass('btn-flat');
				// $('.ngm-minimize-flat').toggleClass('change-position');
				$('.ngm-menu').toggleClass('shrink');
				$('.ngm-menu-footer-left').toggleClass('shrink');
				if ($scope.ngm.openMinimize){
					// $('g[class*="highcharts-series"]').css('transform', 'translate(-25px, 0)');
					$('g[class*="highcharts-series-group"]').css('transform', 'translate(0, 0)');
				}else{
					// $('g[class*="highcharts-series"]').css('transform', 'translate(0, 0)');
					$('g[class*="highcharts-series-group"]').css('transform', 'translate(50px, 0)');
					if(screen.width > 1440){
						$('g[class*="highcharts-series-group"]').css('transform', 'translate(1.5%, 0)');
					}
					// close menu dropdown
					if($('.ngm-profile-icon').hasClass('rotate-icon')){
						$('.ngm-profile-menu-content').slideToggle();
						$('.ngm-profile-icon').toggleClass('rotate-icon'); 
					}
				}
			}

		};

		var var4plusrhafter;

	    // if($location.$$host === '4wplus.org' || $location.$$host === '192.168.33.16' ){ //'35.229.43.63'

	    if($location.$$host === '4wplus.org' ){ //'35.229.43.63'

			$('#title').html("4wPlus");

			var4plusrhafter = '4wPlus';

			metadescription = "4wPlus, Dashboard, Reporte, Indicadores, Colombia";

			//language spanish
			$scope.ngm.changeFunction('es');

			
		}else{
			$('#title').html("ReportHub");
			var4plusrhafter = 'REPORTHUB';

			metadescription = "ReportHub, Dashboard, Reporting, Key Business Indicators";
			$scope.ngm.changeFunction('en');

		};
		$scope.ngm.var4wplusrh = var4plusrhafter;


		document.getElementsByName('description')[0].content = metadescription;

		// nav menu
		if ( $scope.ngm.isTouchDevice() ) {
			$( '#nav-mobile' ).css({ overflow: 'auto'});
		}

		// profile menu dropdown click
		$( '.ngm-profile-icon' ).click( function(){
				// on app load, toggle menu on click
				$scope.ngm.toggleNavigationMenu();
		});


		// paint application
		$scope.$on( '$routeChangeStart', function( next, current ) {

			// get application
			var app = $location.$$path.split('/')[1];
			// set application
			$scope.ngm.setApplication( app );

		});

		// annoying loading artifacts of left menu
    angular.element(document).ready(function () {
      // give a few seconds to render
      $timeout(function() {
				$( '.ngm-navigation-menu' ).css({ 'display': 'block' });
			}, 1000 );
    });

	}])
	// service to store lists
	.factory('ngmLists', function () {

		// storage object
		obj = {};

		// on instantiation get values from local storage
		if (localStorage.length) {
			Object.keys(localStorage).forEach(function (key) {
				obj[key] = localStorage.getObject(key)
			});
		}

		return {
			setObject: function (key, value) {
				obj[key] = value;
			},
			getObject: function (key) {
				return obj[key];
			},
			removeItem: function (key) {
				obj[key] = undefined;
			},
		}
	});
