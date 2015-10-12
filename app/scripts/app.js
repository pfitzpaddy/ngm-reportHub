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
		'leaflet-directive',
		'ngm',
		'ngm.widget.stats',
		'ngm.widget.leaflet',
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
			.when( '/dashboard/:disease', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardDewsCtrl',				
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
	
	// toggles accordian classes for 
	.directive('ngmMenu', function() {
		return {
	    
	    // Restrict it to be an attribute in this case
	    restrict: 'A',
	    
	    // responsible for registering DOM listeners as well as updating the DOM
	    link: function(scope, el, attr) {

	    	// set initial menu style
	    	setTimeout(function(){

	    		// For all itmes
	    		$('.side-menu').find('li').each(function(i, d) {

	    			// find the row that is active
	    			if ($(d).attr('class').search('active') > 0) {

	    				// set list header
	    				$(d).closest('.bold').attr('class', 'bold active');
	    				
	    				// set z-depth-1
	    				$(d).closest('.bold').find('a').attr('class', 
	    						$(d).closest('.bold').find('a').attr('class') + ' z-depth-1' );

	    				// slide down list
	    				$(d).closest('.collapsible-body').slideDown();
	    				$(d).closest('.collapsible-body').attr('class',
	    					$(d).closest('.collapsible-body').attr('class') + ' active');
	    			}
	    		});

	    	}, 0);

	    	// on element click
	    	el.bind( 'click', function( $event ) {
	    		
	    		// toggle list 
	    		el.toggleClass('active');
	    		// toggle list 
	    		el.find('.collapsible-header').toggleClass('z-depth-1');

	    		// toggle list rows active
					el.find('.collapsible-body').toggleClass('active');

					// toggle list rows animation
					if (el.find('.collapsible-body').hasClass('active')) {
						el.find('.collapsible-body').slideDown();
					} else {
						el.find('.collapsible-body').slideUp();
					}
	    		
	    	});
	    }
	   };
	 })
	.controller('ngmReportHubCrtl', ['$scope', '$route', 'ngmAuth', 'ngmUser', function ($scope, $route, ngmAuth, ngmUser) {

		// ngm object
		$scope.ngm = {
			
			// app properties
			route: $route,
			title: 'WHO Afghanistan',
			logo: 'logo-who.png',
			dashboard: false,
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
