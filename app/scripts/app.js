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
		'countTo',
		'highcharts-ng',
		'leaflet-directive',
		'ngm',
		'ngm.widget.html',
		'ngm.widget.stats',
		'ngm.widget.leaflet',
		'ngm.widget.highchart',
		'ngm.widget.calHeatmap'
  ])
	.config([ '$routeProvider', function ($routeProvider) {

		// app routes with access rights
		$routeProvider
			.when( '/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})
			.when( '/who/dews/:location/:disease', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
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
			// immap
			.when( '/immap', {
				redirectTo: '/immap/drr/flood/afghanistan'
			})
			.when( '/immap/drr', {
				redirectTo: '/immap/drr/flood/afghanistan'
			})
			.when( '/immap/drr/flood', {
				redirectTo: '/immap/drr/flood/afghanistan'
			})
			// forbidden
			.when( '/forbidden', {
				templateUrl: 'views/forbidden.html',
			})
			// default
			.otherwise({
				redirectTo: '/who/dews/afghanistan/all'
			});
	}])
	.run(['$rootScope', '$location', 'ngmAuth', function($rootScope, $location, ngmAuth) {

		// when error on route update redirect
		$rootScope.$on('$routeChangeError' , function(event, current, previous, rejection) {
			
			if ( rejection === ngmAuth.UNAUTHORIZED ) {
				$location.path( '/login' );
			} else if ( rejection === ngmAuth.FORBIDDEN ) {
				$location.path( '/forbidden' );
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
			
			// app properties
			route: $route,
			title: 'WHO Afghanistan',
			dashboard: false,
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

					default:
						// default
						$scope.ngm.style = {
							logo: 'logo-who.png',
							home: '#/who',
							darkPrimaryColor: '#1976D2',
							defaultPrimaryColor: '#2196F3',
							lightPrimaryColor: '#BBDEFB'
						}
				}
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
