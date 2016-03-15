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
			ngm: $scope.$parent.ngm

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
						title: ngmUser.get().organization + ' | Expenditure Items'
					},
					subtitle: {
						'class': 'col s12 m12 l12 report-subtitle',
						'title': 'Complete the relevant Expenditure Items for ' + $scope.report.project.details.project_title
					},
					download: {
						'class': 'col s12 m3 l3 hide-on-small-only',
						downloads: [{
							type: 'pdf',
							color: 'blue lighten-1',
							icon: 'picture_as_pdf',
							hover: 'Download Project Financials Form as PDF',
							url: 'http://' + $location.host() + '/static/health/health_project_expenditure.pdf'
						}]
					}
				},
				menu: [{
					'icon': 'location_on',
					'title': 'Projects',
					'class': 'teal-text',
					rows: [{
						'title': 'Project List',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'param': 'project',
						'active': 'active',
						'href': '#/health/projects'
					}]
				}],
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
				}]
			}

			// assign to ngm app scope
			$scope.report.ngm.dashboard.model = $scope.model;

		};
		
	}]);