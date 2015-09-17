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
		'ngm',
		'ngm.widget.stats',
		'countTo'
  	])
	.config([ '$routeProvider', function ( $routeProvider ) {

		// app routes with access rights
		$routeProvider
			.when( '/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})
			.when( '/dashboard', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			.when( '/forbidden', {
				templateUrl: 'views/forbidden.html',
			})			
			.otherwise({
				redirectTo: '/dashboard'
			});
	}])
	.run(['$rootScope', 'ngmAuth', '$location', function($rootScope, ngmAuth, $location) {

		// when error on route update redirect
		$rootScope.$on('$routeChangeError' , function(event, current, previous, rejection) {
			if ( rejection === ngmAuth.UNAUTHORIZED ) {
				$location.path( '/login' );
			} else if ( rejection === ngmAuth.FORBIDDEN ) {
				$location.path( '/forbidden' );
			}
		});

	}])	
	.controller('ngmReportHubCrtl', ['$scope', 'ngmAuth', 'ngmUser', function ($scope, ngmAuth, ngmUser) {

		// ngm object
		$scope.ngm = {
			
			// app properties
			title: 'WHO Afghanistan',
			logo: 'logo-who.png',
			style: {
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
					return false;
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
