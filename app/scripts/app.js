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
			.when( '/who/dews/:disease', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			.when( '/drr/flood/:province', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardFloodRiskCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})			
			.when( '/forbidden', {
				templateUrl: 'views/forbidden.html',
			})			
			.otherwise({
				redirectTo: '/who/dews/avh'
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
	.controller('ngmReportHubCrtl', ['$scope', '$route', 'ngmAuth', 'ngmUser', function ($scope, $route, ngmAuth, ngmUser) {

		// ngm object
		$scope.ngm = {
			
			// app properties
			route: $route,
			title: 'WHO Afghanistan',
			dashboard: false,
			style: {
				logo: 'logo-who.png',
				darkPrimaryColor: '#1976D2', // '#DE696E',
				defaultPrimaryColor: '#2196F3', // '#EE6E73',
				lightPrimaryColor: '#BBDEFB', //'#EF9A9A'
				textPrimaryColor: '#FFFFFF',
				accentColor: '#009688',
				primaryTextColor: '#212121',
				secondaryTextColor: '#727272',
				dividerColor: '#B6B6B6'
			},



			// app functions
			logout: function() {
				ngmAuth.logout();
			},

			// user
			getUserName: function() {
				if (ngmUser.getUser()) {
					return ngmUser.getUser().username;
				} else {
					return 'welcome';
				}
			},

			// user email
			getUserEmail: function() {
				if (ngmUser.getUser()) {
					return ngmUser.getUser().email;
				} else {
					return false;
				}
			}			

		};

	}]);
