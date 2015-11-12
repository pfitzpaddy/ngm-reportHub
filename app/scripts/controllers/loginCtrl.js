'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('LoginCtrl', ['$scope', '$location', 'ngmAuth', function ($scope, $location, ngmAuth) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		
		$scope.login = {

			// flag to track what to submit (login or register)
			submitLogin: true,

			// single submit btn/function for login or register
			submit: function() {

				// if login flag is true
				if ($scope.login.submitLogin) {

					// check login object and submit
					if (Object.keys($scope.login.user).length !== 0) {
						
						ngmAuth.login($scope.login.user).success(function(result) {
							$location.path( '/' + $scope.ngm.style.home );
						}).error(function(err) {
							// 
						});
					}

				} else {
					
					// check login object and register
					if (Object.keys($scope.login.register).length !== 0) {

						ngmAuth.register($scope.login.register).success(function(result) {
							$location.path( '/' + $scope.ngm.style.home );
						}).error(function(err) {
							// 
						});
					}

				}

			}
		};
		
	}]);