/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectDetailCtrl', ['$scope', '$location', '$route', 'ngmData', 'ngmUser', function ($scope, $location, $route, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// 
		$scope.model = {
			rows: [{}]			
		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm

		};

		// if 'new' create empty project
		if($route.current.params.project === 'new') {
			
			// create and return empty project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/health/create',
				data: {
					organization_id: ngmUser.get().organization_id
				}
			}).then(function(data){
				$scope.report.setProject(data);
			});

		} else {
			
			// return project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/health/getProject',
				data: {
					id: $route.current.params.project
				}
			}).then(function(data){
				$scope.report.setProject(data);
			});

		}

		// set the model to create the page
		$scope.report.setProject = function(data){
				
			// assign data
			$scope.report.project = data;

			// 
			$scope.report.title = $scope.report.project.project_name ? ngmUser.get().organization + ' | ' + $scope.report.project.project_name : ngmUser.get().organization + ' | New Project';
			$scope.report.subtitle = $scope.report.project.project_description ? $scope.report.project.project_description : 'Complete the project details to register a new project';

			// report dashboard model
			$scope.model = {
				name: 'report_health_detail',
				header: {
					div: {
						'class': 'col s12 m12 l12 report-header',
						style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
					},
					title: {
						'class': 'col s12 m12 l12 report-title',
						title: $scope.report.title,
						style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
					},
					subtitle: {
						'class': 'col s12 m12 l12 report-subtitle',
						title: $scope.report.subtitle
					}
				},
				menu: [{
					'icon': 'location_on',
					'title': 'Projects',
					// 'class': 'teal lighten-1 white-text',
					'class': 'teal-text',
					rows: [{
						'title': 'Project List',
						'id': 'go-to-project-list',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'active': 'active'
					}]
				}],				
				rows: [{
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'project',
							// card: '',
							config: {
								project: $scope.report.project
							}
						}]
					}]
				}]
			}

			// assign to ngm app scope
			$scope.report.ngm.dashboard.model = $scope.model;

		}

		
	}]);


