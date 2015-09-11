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
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
  	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}])
	.controller('ngmReportHubCrtl', ['$scope', function ($scope) {

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
		}

	}]);
