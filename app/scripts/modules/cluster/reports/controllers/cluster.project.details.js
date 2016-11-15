/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectDetailsCtrl
 * @description
 * # ClusterProjectDetailsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectDetailsCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmData', 'ngmUser', function ($scope, $route, $location, $anchorScroll, $timeout, ngmData, ngmUser) {
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
					name: 'cluster_project_details',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: ngmUser.get().admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': $scope.report.project.project_description
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'pdf',
								color: 'blue',
								icon: 'picture_as_pdf',
								hover: 'Download Project Details as PDF',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/print',
									data: {
										report: $scope.report.report,
										printUrl: $location.absUrl(),
										downloadUrl: 'http://' + $location.host() + '/report/',
										token: $scope.report.user.token,
										viewportWidth: 1480,
										pageLoadTime: 3200
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
										theme: 'cluster_project_details',
										format: 'pdf',
										url: $location.$$path
									}
								}						
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download ' + $scope.report.project.project_title + ' as CSV',
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
										theme: 'cluster_project_details',
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
								type: 'project.details',
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
		if( $route.current.params.project === 'new' ) {

			// current date
			var d = new Date();

			// create empty project
			var project = {
				project_status: 'new',
				project_title: 'New Project',
				project_description: 'Complete the project details to register a new project',
				project_start_date: new Date(),
				project_end_date: new Date(d.getFullYear(), d.getMonth() + 6, d.getDate()),
				target_beneficiaries: [],
				beneficiary_type: [],
				target_locations: []
			}

			// extend defaults with ngmUser details
			project = angular.merge( {}, ngmUser.get(), project );
			
			// remove id of ngmUser to avoid conflict with new project
			delete project.id;

			// set summary
			$scope.report.setProjectDetails( project );

		} else {

			// return project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/cluster/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}).then( function( data ){
				// assign data
				$scope.report.setProjectDetails( data );
			});

		}
		
	}]);