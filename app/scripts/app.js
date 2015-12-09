'use strict';

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
		'appConfig',
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngDropzone',
		'countTo',
		'highcharts-ng',
		'leaflet-directive',
		'ngm',
		'ngm.widget.html',
		'ngm.widget.dropzone',
		'ngm.widget.iframe',
		'ngm.widget.stats',
		'ngm.widget.leaflet',
		'ngm.widget.highchart',
		'ngm.widget.calHeatmap'
	])
	.config([ '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

		// from http://mysite.com/#/notes/1 to http://mysite.com/notes/1
		// $locationProvider.html5Mode(true);

		// app routes with access rights
		$routeProvider
			.when( '/login', {
				redirectTo: '/who/login'
			})		
			.when( '/who/login', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})			
			.when( '/who/dews/report', {
				templateUrl: 'views/dashboard.html',
				controller: 'ReportMenuCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			.when( '/who/dews/report/:active', {
				templateUrl: 'views/dashboard.html',
				controller: 'ReportiFrameCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			.when( '/who/dews/upload', {
				templateUrl: 'views/dashboard.html',
				controller: 'UpdateDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})						
			.when( '/who/dews/:location/:disease', {
				reloadOnSearch: false,
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			// forbidden
			.when( '/who/forbidden', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			})		
			/*** immap */
			.when( '/immap/login', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})			
			.when( '/immap/drr/flood/:province', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardFloodRiskCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/immap/watchkeeper/:country', {
				reloadOnSearch: false,
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardWatchkeeperCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			.when( '/immap/watchkeeper/:country/:county', {
				reloadOnSearch: false,
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardWatchkeeperCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})				
			.when( '/immap', {
				redirectTo: '/immap/watchkeeper/kenya'
			})
			.when( '/immap/watchkeeper', {
				redirectTo: '/immap/watchkeeper/kenya'
			})			
			.when( '/immap/drr', {
				redirectTo: '/immap/drr/flood/afghanistan'
			})
			.when( '/immap/drr/flood', {
				redirectTo: '/immap/drr/flood/afghanistan'
			})
			// forbidden
			.when( '/immap/forbidden', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			})	
			// default
			.otherwise({
				redirectTo: '/who/dews/afghanistan/all'
			});
	}])
	.run(['$rootScope', '$location', '$interval', 'ngmAuth', function($rootScope, $location, $interval, ngmAuth) {

		// 1 hour
		var hour = 1000*60*60;

		// unset local storage
		$interval( function(){
			// logout user after 6 hours
			ngmAuth.logout();
		}, hour * 6);

		// when error on route update redirect
		$rootScope.$on('$routeChangeError' , function(event, current, previous, rejection) {

			// get app
			var app = current.$$route.originalPath.split('/')[1];
			
			if ( rejection === ngmAuth.UNAUTHORIZED ) {
				$location.path( '/' + app + '/login' );
			} else if ( rejection === ngmAuth.FORBIDDEN ) {
				$location.path( '/' + app + '/forbidden' );
			}

		});

	}])
	.controller('ngmReportHubCrtl', ['$scope', '$route', '$location', 'ngmAuth', 'ngmUser', function ($scope, $route, $location, ngmAuth, ngmUser) {

		// paint application
		$scope.$on('$routeChangeStart', function(next, current) { 
			// get application
			var route = $location.$$path.split('/')[1];
			// set application
			$scope.ngm.setApplication(route);

		});

		// ngm object
		$scope.ngm = {

			// app name
			title: 'Welcome',

			// current route
			route: $route,

			// active dashboard placeholder
			dashboard: {
				set: false,
				config: false,
				model: {
					name: 'default'
				}
			},

			// page height
			height: $(window).height(),

			// dashboard footer
			footer: false,

			// left menu
			menu: {
				search: true,
				focused: false,
				query: ''
			},

			style: {
				logo: 'logo-who.png',
				home: '#/who',
				darkPrimaryColor: '#1976D2',
				defaultPrimaryColor: '#2196F3',
				lightPrimaryColor: '#BBDEFB',
				textPrimaryColor: '#FFFFFF',
				accentColor: '#009688',
				primaryTextColor: '#212121',
				secondaryTextColor: '#727272',
				dividerColor: '#B6B6B6'
			},

			// paint application
			setApplication: function(route) {

				// set app colors based on 
				switch(route){
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
					case 'who':
						// set style obj
						$scope.ngm.style = {
							logo: 'logo-who.png',
							home: '#/who',
							darkPrimaryColor: '#1976D2',
							defaultPrimaryColor: '#2196F3',
							lightPrimaryColor: '#BBDEFB'
						}
						break;
					default:
						// default
						$scope.ngm.style = {
							logo: 'logo-ngm.png',
							home: '#/ngm',
							darkPrimaryColor: '#0288D1',
							defaultPrimaryColor: '#03A9F4',
							lightPrimaryColor: '#B3E5FC'
						}
				}

				// create footer
				$scope.ngm.footer = '<div class="footer header" style="background-color: ' + $scope.ngm.style.lightPrimaryColor + ';"></div>'
													+ '<div class="footer body" style="background-color: ' + $scope.ngm.style.defaultPrimaryColor  + ';">'
													+ 	'<p style="color: white;font-weight:100;">Supported by <a class="grey-text" href="http://immap.org"><b>iMMAP</b></a></p>'
													+ '</div>';

			},

			// Detect touch screen and enable scrollbar if necessary
			isTouchDevice: function () {
				try {
					document.createEvent('TouchEvent');
					return true;
				} catch (e) {
					return false;
				}
			},	

			// toggle search active
			toggleSearch: function() {
				$('#search').focus();
				$scope.ngm.searchFocused = $scope.ngm.searchFocused ? false : true;
			},

			// app functions
			logout: function() {
				ngmAuth.logout();
			},

			// user
			getUserName: function() {
				if (ngmUser.get()) {
					return ngmUser.get().username;
				} else {
					return 'welcome';
				}
			},

			// user email
			getUserEmail: function() {
				if (ngmUser.get()) {
					return ngmUser.get().email;
				} else {
					return false;
				}
			}			

		};

		// nav menu
		if ($scope.ngm.isTouchDevice()) {
			$('#nav-mobile').css({ overflow: 'auto'});
		}	

	}]);
