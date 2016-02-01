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
		$scope.model = {
			name: 'dews_outbreak_report',
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
			menu: [{
				'icon': 'zoom_in',
				'title': 'DEWS Report',
				'class': 'teal lighten-1 white-text',
				rows: [{
					'title': 'Active Report',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'active',
					'href': '#/who/dews/report/active'
				},{
					'title': 'ToDo',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				},{
					'title': 'Pending',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				},{
					'title': 'Complete',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				}]
			}],			
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'iframe',
						card: '',
						style: 'padding-top: 30px; height: 1825px;',
						config: {
							div: '.paper',
							url: 'http://52.24.183.157:3000/_/#YYYK',
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: 90px; padding-top:10px;',
						config: {
							html: $scope.report.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.report.ngm.dashboard.model = $scope.model;
		
	}]);