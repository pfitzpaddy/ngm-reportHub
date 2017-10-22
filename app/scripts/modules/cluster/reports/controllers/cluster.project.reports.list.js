/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectReportsListCtrl
 * @description
 * # ClusterProjectReportsListCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectReportsListCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', function ($scope, $route, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser) {
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

			// the header navigation settings
			getHeaderHtml: function(){
				var html = '<div class="row">'
										+'<div class="col s12 m12 l12">'
											+'<div style="padding:20px;">'
												+'<a class="btn-flat waves-effect waves-teal" href="#/cluster/projects/summary/' + $scope.report.project.id +'">'
													+'<i class="material-icons left">keyboard_return</i>Back to Project Summary'
												+'</a>'
												+'<span class="right" style="padding-top:8px;">Last Updated: ' + moment( $scope.report.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) +'</span>'
											+'</div>'
										+'</div>'
									+'</div>';

				return html;
			},

			// set project details
			setProjectDetails: function(data){

				// assign data
				$scope.report.project = data;

				// add project code to subtitle?
				var text = 'Actual Monthly Beneficiaries Report for ' + $scope.report.project.project_title
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + text : text;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_report_list',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': subtitle
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
									url: ngmAuth.LOCATION + '/api/health/indicator',
									data: {
										report: 'projects_' + $scope.report.report,
										details: 'projects',
										project_id: $scope.report.project.id
									}
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'cluster_project_report_list',
										format: 'csv',
										url: $location.$$path
									}
								}
							}]
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								config: {
									html: $scope.report.getHeaderHtml()
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
									orderBy: 'reporting_due_date',
									format: true,
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/report/getReportsList',
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
									rightIcon: 'check_circle',
									templateUrl: '/scripts/widgets/ngm-list/template/report.html',
									orderBy: '-reporting_due_date',
									format: true,
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/report/getReportsList',
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
			url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectDetails(data);
		});
		
	}]);