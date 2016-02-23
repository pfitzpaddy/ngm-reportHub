/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectObjectivesCtrl', ['$scope', '$route', '$location', 'ngmData', 'ngmUser', function ($scope, $route, $location, ngmData, ngmUser) {
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
			url: 'http://' + $location.host() + '/api/health/project/getProjectObjectives',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectObjectives(data);
		});

		// set project details form
		$scope.report.setProjectObjectives = function(data){

			// assign data
			$scope.report.project = data;

			// report dashboard model
			$scope.model = {
				name: 'report_health_objectives',
				header: {
					div: {
						'class': 'col s12 m12 l12 report-header',
						style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
					},
					title: {
						'class': 'col s12 m9 l9 report-title',
						style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
						title: ngmUser.get().organization + ' | Health Objectives'
					},
					subtitle: {
						'class': 'col s12 m12 l12 report-subtitle',
						'title': 'Complete the relevant Health Objectives for ' + $scope.report.project.details.project_name
					},
					download: {
						'class': 'col s12 m3 l3 hide-on-small-only',
						downloads: [{
							type: 'pdf',
							color: 'blue lighten-1',
							icon: 'picture_as_pdf',
							hover: 'Download Project Objectives Form as PDF',
							url: 'http://' + $location.host() + '/report/health_project_objectives.pdf'
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
							type: 'project.objectives',
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