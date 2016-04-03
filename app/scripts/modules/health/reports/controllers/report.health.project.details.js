/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectDetailsCtrl', ['$scope', '$route', '$location', 'ngmData', 'ngmUser', function ($scope, $route, $location, ngmData, ngmUser) {
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

			// set project details
			setProjectDetails: function(data){

				// assign data
				$scope.report.project = data;

				// report dashboard model
				$scope.model = {
					name: 'report_health_details',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title',
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle',
							'title': $scope.report.project.project_description
						},
						// download: {
						// 	'class': 'col s12 m3 l3 hide-on-small-only',
						// 	downloads: [{
						// 		type: 'pdf',
						// 		color: 'blue lighten-1',
						// 		icon: 'picture_as_pdf',
						// 		hover: 'Download Project Details Form as PDF',
						// 		url: 'http://' + $location.host() + '/static/health/health_project_details.pdf'
						// 	}]
						// }
					},
					menu: [{
						'icon': 'keyboard_return',
						'title': 'Back to Projects',
						'class': 'teal-text',
						'href': '#/health/projects'
						// rows: [{
						// 	'title': 'Back to Projects',
						// 	'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						// 	'param': 'project',
						// 	'active': 'active',
						// 	'href': '#/health/projects'
						// }]
					}],
					rows: [{				
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'project.details',
								config: {
									style: $scope.report.ngm.style,
									project: $scope.report.project
								}
							}]
						}]
					}]
				}

				// set model to null
				if($route.current.params.project === 'new'){
					$scope.report.project.project_title = '';
					$scope.report.project.project_description = '';
				} 

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}			

		}		

		// Run page

		// if 'new' create empty project
		if($route.current.params.project === 'new') {

			// current date
			var d = new Date();

			// create empty project
			var project = {
				organization_id: ngmUser.get().organization_id,
				organization: ngmUser.get().organization,
				username: ngmUser.get().username,
				email: ngmUser.get().email,
				project_status: 'new',
				project_title: 'New Project',
				project_description: 'Complete the project details to register a new project',
				project_start_date: new Date(),
				project_end_date: new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()),
				target_beneficiaries: [],
				prov_code: [],
				dist_code: [],
				beneficiary_category: [],
				locations: []
			}

			// set summary
			$scope.report.setProjectDetails(project);

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
				$scope.report.setProjectDetails(data);
			});

		}
		
	}]);