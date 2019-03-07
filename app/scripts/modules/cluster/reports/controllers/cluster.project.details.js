/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectDetailsCtrl
 * @description
 * # ClusterProjectDetailsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectDetailsCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper','$translate','$filter', function ( $scope, $route, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser, ngmClusterHelper,$translate,$filter) {
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

				var title = $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ';

				// set model to null
				if( $route.current.params.project === 'new' ){
					title += $filter('translate')('new_project');
				} else {
					title += $scope.report.project.project_title;
				}

				// add project code to subtitle?
				var text = $filter('translate')('actual_monthly_beneficiaries_report_for')+ ' ' + $scope.report.project.project_title;
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + $scope.report.project.project_description : $scope.report.project.project_description;

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
							title: title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
							// 	type: 'pdf',
							// 	color: 'blue',
							// 	icon: 'picture_as_pdf',
							// 	hover: 'Download Project Details as PDF',
							// 	request: {
							// 		method: 'POST',
							// 		url: ngmAuth.LOCATION + '/api/print',
							// 		data: {
							// 			report: $scope.report.report,
							// 			printUrl: $location.absUrl(),
							// 			downloadUrl: ngmAuth.LOCATION + '/report/',
							// 			token: $scope.report.user.token,
							// 			user: $scope.report.user, 
							// 			lists: localStorage.getObject( 'lists' ), 
							// 			viewportWidth: 1480,
							// 			pageLoadTime: 3200
							// 		}
							// 	},
							// 	metrics: {
							// 		method: 'POST',
							// 		url: ngmAuth.LOCATION + '/api/metrics/set',
							// 		data: {
							// 			organization: $scope.report.user.organization,
							// 			username: $scope.report.user.username,
							// 			email: $scope.report.user.email,
							// 			dashboard: $scope.report.project.project_title,
							// 			theme: 'cluster_project_details',
							// 			format: 'pdf',
							// 			url: $location.$$path
							// 		}
							// 	}
							// },{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: $filter('translate')('download')+' ' + $scope.report.project.project_title + ' '+ $filter('translate')('as')+' CSV',
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/project/getProjects',
									data: {
										report:  $scope.report.report,
										details: 'projects',
										query : { project_id : $scope.report.project.id },
										csv : true
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

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}

		}

		// Run page

		// if 'new' create empty project
		if( $route.current.params.project === 'new' ) {

			// get new project
			var project = ngmClusterHelper.getNewProject( ngmUser.get() );

			// set summary
			$scope.report.setProjectDetails( project );

		} else {

			// return project
			ngmData.get({
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}).then( function( data ){
				// assign data
				$scope.report.setProjectDetails( data );
			});

		}

	}]);
