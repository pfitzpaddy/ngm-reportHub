/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectListCtrl', ['$scope', '$location', 'ngmData', 'ngmUser', function ($scope, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// form to add new project
			newProjectUrl: '#/health/projects/details/new'

		}

		// report dashboard model
		$scope.model = {
			name: 'report_health_list',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: ngmUser.get().organization + ' | Health Projects',
					style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'Health projects for ' + ngmUser.get().organization,
				}
			},
			menu: [{
				'icon': 'location_on',
				'title': 'Projects',
				'class': 'teal-text',
				rows: [{
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
						type: 'html',
						card: 'card-panel white grey-text text-darken-2',
						config: {
							html: '<a class="waves-effect waves-light btn" href="' + $scope.report.newProjectUrl + '"><i class="material-icons left">add_circle_outline</i>Add New Project</a>'
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel white grey-text text-darken-2',
						config: {
							title: 'Active',
							icon: 'edit',
							newProjectUrl: $scope.report.newProjectUrl,
							templateUrl: '/scripts/widgets/ngm-html/template/health/health.project.list.html',							
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/project/getProjectList',
								data: {
									organization_id: ngmUser.get().organization_id,
									project_status: 'active'
								}
							}
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel white grey-text text-darken-2',
						style: 'padding-bottom: 50px;',
						config: {
							title: 'Complete',
							icon: 'done',
							// page: true,
							newProjectUrl: $scope.report.newProjectUrl,
							templateUrl: '/scripts/widgets/ngm-html/template/health/health.project.list.html',							
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/project/getProjectList',
								data: {
									organization_id: ngmUser.get().organization_id,
									project_status: 'complete'
								}
							}
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