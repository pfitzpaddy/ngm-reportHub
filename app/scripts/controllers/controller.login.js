'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardLoginCtrl', ['$scope', function ($scope) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// login object
		$scope.login = {

			// parent
			ngm: $scope.$parent.ngm

		}

		// 
		$scope.login.ngm.style.paddingHeight = 20;

		// dews dashboard model
		var model = {
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.login.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					style: 'color: ' + $scope.login.ngm.style.defaultPrimaryColor,
					title: 'Welcome'
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'Welcome to Report Hub, please login to continue data entry tasks or navigate to the report pages to view the latest key indicators',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.login.ngm.style.height + 'px;',
						config: {
							style: $scope.login.ngm.style,
							template: 'widgets/ngm-html/template/login.html'
						}
					}]
				}]
			}]
		};

		$scope.name = 'login';
		$scope.model = model;

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard = $scope.model;
		
	}]);