'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDewsCtrl', ['$scope', '$http', function ($scope, $http) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		var model = {
				title: "DEWS Dashboard",
				rows: [{
					columns: [{
						styleClass: "s12 m12 l6",
						widgets: [{
							type: "stats",
							card: "card-panel stats-card teal lighten-2 teal-text text-lighten-5",
							config: {
								countTo: 1169
							}
						}]
					},{
						styleClass: "s12 m12 l6",
						widgets: [{
							type: "stats",
							card: "card-panel stats-card teal lighten-2 teal-text text-lighten-5",
							config: {
								data: {
									countTo: 1566
								}
							}
						}]
					}]
				}]
			};

		$scope.name = 'DEWS Dashboard';
		$scope.model = model;
		
	}]);