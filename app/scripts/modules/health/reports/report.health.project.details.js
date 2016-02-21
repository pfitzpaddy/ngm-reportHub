/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectDetailsCtrl', ['$scope', '$location', 'ngmData', 'ngmUser', function ($scope, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// if 'new' create empty project
		if($route.current.params.project === 'new') {
			
			// create and return empty project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/health/project/create',
				data: {
					organization_id: ngmUser.get().organization_id,
					user_id: ngmUser.get().id,
					username: ngmUser.get().username
				}
			}).then(function(data){
				// assign data
				$scope.report.project = data;
			});

		} else {
			
			// return project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/health/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}).then(function(data){
				// assign data
				$scope.report.project = data;
			});

		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm

		};

		// title/subtitle
		$scope.report.title = $scope.report.project.details.project_name ? ngmUser.get().organization + ' | ' + $scope.report.project.details.project_name : ngmUser.get().organization + ' | New Project';
		$scope.report.subtitle = $scope.report.project.details.project_description ? $scope.report.project.details.project_description : 'Complete the project details to register a new project';

		// report dashboard model
		$scope.model = {
			name: 'report_health_summary',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
					title: $scope.report.title
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					'title': $scope.report.subtitle
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
				},{
					'title': 'Create New Project',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'param': 'project',
					'active': 'active',
					'href': $scope.report.newProjectUrl
				}]
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'project.details',
						card: 'card-panel white grey-text text-darken-2',
						config: {
							project: $scope.report.project
						}
					}]
				}]
			}]
		}

		// assign to ngm app scope
		$scope.report.ngm.dashboard.model = $scope.model;
		
	}]);