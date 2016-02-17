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
				url: 'http://' + $location.host() + '/api/health/project/create',
				data: {
					organization_id: ngmUser.get().organization_id,
					user_id: ngmUser.get().id,
					username: ngmUser.get().username
				}
			}).then(function(data){
				$scope.report.setProject(data);
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
				$scope.report.setProject(data);
			});

		}

		// set the model to create the page
		$scope.report.setProject = function(data){
				
			// assign data
			$scope.report.project = data;

			// 
			$scope.report.title = $scope.report.project.details.project_name ? ngmUser.get().organization + ' | ' + $scope.report.project.details.project_name : ngmUser.get().organization + ' | New Project';
			$scope.report.subtitle = $scope.report.project.details.project_description ? $scope.report.project.details.project_description : 'Complete the project details to register a new project';

			// report dashboard model
			$scope.model = {
				name: 'report_health_detail',
				header: {
					div: {
						'class': 'col s12 m12 l12 report-header',
						'style': 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
					},
					title: {
						'class': 'col s12 m12 l12 report-title',
						'style': 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,						
						'title': $scope.report.title
					},
					subtitle: {
						'class': 'col hide-on-small-only m8 l9 report-subtitle',
						'title': $scope.report.subtitle
					},
					// download: {
					// 	'class': 'col s12 m4 l4 hide-on-small-only',
					// 	downloads: [{
					// 		type: 'pdf',
					// 		color: 'blue lighten-1',
					// 		icon: 'picture_as_pdf',
					// 		hover: 'Download Project as PDF',
					// 		request: {
					// 			method: 'POST',
					// 			url: 'http://' + $location.host() + '/api/print',
					// 			data: {
					// 				report: $location.$$path.replace(/\//g, '_'),
					// 				printUrl: $location.absUrl(),
					// 				downloadUrl: 'http://' + $location.host() + '/report/',
					// 				token: ngmUser.get().token,
					// 				pageLoadTime: 7600
					// 			}
					// 		},						
					// 		metrics: {
					// 			method: 'POST',
					// 			url: 'http://' + $location.host() + '/api/metrics/set',
					// 			data: {
					// 				organization: ngmUser.get().organization,
					// 				username: ngmUser.get().username,
					// 				email: ngmUser.get().email,
					// 				dashboard: 'health_cluster_report',
					// 				theme: $scope.report.title,
					// 				format: 'pdf',
					// 				url: $location.$$path
					// 			}
					// 		}
					// 	}]
					// }
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
								style: $scope.$parent.ngm.style,
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


