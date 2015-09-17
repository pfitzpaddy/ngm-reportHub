'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'DashboardDewsCtrl', ['$scope', '$http', function ( $scope, $http ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		
	}]);