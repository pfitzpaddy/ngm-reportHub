/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectReportsListCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmData', 'ngmUser', function ($scope, $route, $location, $anchorScroll, $timeout, ngmData, ngmUser) {
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

			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),			

			// set project details
			setProjectDetails: function(data){

				// assign data
				$scope.report.project = data;

				// report dashboard model
				$scope.model = {
					name: 'report_health_list',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: ngmUser.get().adminRname + ' | ' + ngmUser.get().admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title // + ' | Monthly Reports'
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate',
							'title': 'Actual Monthly Beneficiaries Reports for ' + $scope.report.project.project_title
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download Monthly Reports as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/indicator',
									data: {
										report: 'projects_' + $scope.report.report,
										details: 'projects',
										project_id: $scope.report.project.id
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'health_project_list',
										format: 'csv',
										url: $location.$$path
									}
								}
							}]
						}
					},
					// menu: [{
					// 	'id': 'keyboard_return_menu_option',
					// 	'icon': 'keyboard_return',
					// 	'title': 'Back to Projects',
					// 	'class': 'teal-text',
					// 	'href': '#/health/projects'
					// }],
					rows: [{				
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'project.reports.list',
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
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'alarm_on',
									color: 'blue lighten-4',
									// textColor: 'white-text',
									title: 'Reports ToDo',
									hoverTitle: 'Update',
									icon: 'edit',
									rightIcon: 'watch_later',
									templateUrl: '/scripts/widgets/ngm-list/template/report.html',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/report/getReportsList',
										data: {
											filter: { 
												project_id: $scope.report.project.id,
												report_active: true,
												report_status: 'todo'
											}
										}
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'done_all',
									color: 'blue lighten-4',
									title: 'Reports Complete',
									hoverTitle: 'View',
									icon: 'done',
									rightIcon: 'send',
									templateUrl: '/scripts/widgets/ngm-list/template/report.html',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/report/getReportsList',
										data: {
											filter: { 
												project_id: $scope.report.project.id,
												report_active: true,
												report_status: 'complete'
											}
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
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}			

		}		

		// Run page
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
		
	}]);