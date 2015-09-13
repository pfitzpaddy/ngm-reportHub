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
	.module( 'ngmReportHub', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
  	])
	.config([ '$routeProvider', function ( $routeProvider ) {

		//
		$routeProvider
			.when( '/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
				resolve: {
					access: [ 'ngmAccess', function( ngmAccess ) { 
						if ( ngmAccess.TOKEN ) {
							return ngmAccess.isAnonymous();
						}
					}],
				}
			})
			.when( '/dashboard', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardCtrl',				
				resolve: {
					access: [ 'ngmAccess', function( ngmAccess ) {
						if ( ngmAccess.TOKEN ) {
							return ngmAccess.isAuthenticated(); 
						}
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
	.run([ '$rootScope', 'ngmAccess', '$location', function( $rootScope, ngmAccess, $location ) {

		//
		$rootScope.$on( '$routeChangeError' , function( event, current, previous, rejection ) {

			// 
			if ( rejection === ngmAccess.UNAUTHORIZED ) {
				$location.path( '/login' );
			} else if (ngmAccess.OK) {
				$location.path( '/dashboard' );
			} else if ( rejection === ngmAccess.FORBIDDEN ) {
				$location.path( '/forbidden' );
			}
		});

	}])	
	.controller( 'ngmReportHubCrtl', [ '$scope', function ( $scope ) {

		// ngm object
		$scope.ngm = {
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
			}
		};

	}]);
