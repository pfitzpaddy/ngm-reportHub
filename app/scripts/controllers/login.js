'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'LoginCtrl', ['$scope', '$location', 'ngmUser', function ( $scope, $location, ngmUser ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		
		$scope.login = {

			submit: function() {

				ngmUser.get({
					name: $scope.login.name,
					password: $scope.login.password
				}).$promise.then(function(todo) {
					// success
					$location.path( '/dashboard' );
				}, function(errResponse) {
					// fail
				});
			}

		}
		
	}]);