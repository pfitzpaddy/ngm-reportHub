/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectFinancialsCtrl', ['$scope', '$route', '$location', 'ngmData', 'ngmUser', function ($scope, $route, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = {
			rows: [{}]
		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			//
			report: 'financials',

		}		

		// return project
		ngmData.get({
			method: 'POST',
			url: 'http://' + $location.host() + '/api/health/project/getProjectFinancials',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectFinancials(data);
		});

		// set project details form
		$scope.report.setProjectFinancials = function(data){

			// assign data
			$scope.report.project = data;

			// report file name
			$scope.report.report = data.project_title.replace(/\//g, '_') + '_financials_extracted-' + moment().format('YYYY-MM-DDTHHmm');

			// report dashboard model
			$scope.model = {
				name: 'report_health_financials',
				header: {
					div: {
						'class': 'col s12 m12 l12 report-header',
						style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
					},
					title: {
						'class': 'col s12 m9 l9 report-title',
						style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
						title: $scope.report.project.organization + ' | Financial Items'
					},
					subtitle: {
						'class': 'col s12 m12 l12 report-subtitle',
						'title': 'Complete the relevant Financial Items for ' + $scope.report.project.project_title
					},
					download: {
						'class': 'col s12 m3 l3 hide-on-small-only',
						downloads: [{		
							type: 'csv',
							color: 'blue lighten-2',
							icon: 'attach_money',
							hover: 'Download Financial Summary as CSV',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/data/financials',
								data: {
									report: 'projects_' + $scope.report.report,
									project: $scope.report.project
								}
							},
							metrics: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/metrics/set',
								data: {
									organization: $scope.report.user ? $scope.report.user.organization : 'public',
									username: $scope.report.user ? $scope.report.user.username : 'public',
									email: $scope.report.user ? $scope.report.user.email : 'public',
									dashboard: 'health_4w',
									theme: 'health_financials',
									format: 'csv',
									url: $location.$$path
								}
							}
						}]
					}
				},
				// menu: [{
				// 	'icon': 'location_on',
				// 	'title': 'Projects',
				// 	'class': 'teal-text',
				// 	rows: [{
				// 		'title': 'Project List',
				// 		'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
				// 		'param': 'project',
				// 		'active': 'active',
				// 		'href': '#/health/projects'
				// 	}]
				// }],
				rows: [{		
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'project.financials',
							config: {
								style: $scope.report.ngm.style,
								project: $scope.report.project
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
			}

			// assign to ngm app scope
			$scope.report.ngm.dashboard.model = $scope.model;

		};
		
	}]);