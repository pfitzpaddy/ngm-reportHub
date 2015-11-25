'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportiFrameCtrl
 * @description
 * # ReportiFrameCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportiFrameCtrl', ['$scope', function ($scope) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// report object
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm

		}

		// panel height = window height - header - padding
		$scope.report.ngm.style.height = $scope.report.ngm.height - 160 - 10;

		// report dashboard model
		var model = {
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: 'WHO | DEWS | Outbreak Report',
					style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'DEWS outbreak report',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'iframe',
						card: '',
						style: 'padding-top: 30px; height: 800px;',
						config: {
							div: '.paper',
							url: 'http://52.24.183.157:3000/_/#YYYz',
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: 120px;',
						config: {
							html: '<div style="background-color: #FFF; height: 140px;"></div>' + $scope.report.ngm.footer
						}
					}]
				}]
			}]
		};

		$scope.name = 'report_dews';
		$scope.model = model;

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard = $scope.model;
		
	}]);