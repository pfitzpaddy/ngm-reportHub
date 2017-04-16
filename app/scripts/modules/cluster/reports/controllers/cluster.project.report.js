/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectReportCtrl
 * @description
 * # ClusterProjectReportCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectReportCtrl', [
			'$scope', 
			'$route', 
			'$q', 
			'$http', 
			'$location', 
			'$anchorScroll',
			'$timeout', 
			'ngmData',
			'ngmUser', 

	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmData, ngmUser ) {
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

			// placeholder
			project: {},

			// placeholder
			definition: {},
			
			// current user
			user: ngmUser.get(),

			// report name placeholder (is updated below)
			report: 'monthly_report',

			// get project
			getProject: $http({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/cluster/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}),

			// get report
			getReport: $http({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/cluster/report/getReport',
				data: {
					id: $route.current.params.report
				}
			}),

			// set project details
			setProjectDetails: function( data ){

				// project
				$scope.report.project = data[0].data;

				// report
				$scope.report.definition = data[1].data;

				// set report for downloads
				$scope.report.report = $scope.report.project.organization + '_' + $scope.report.project.cluster + '_' + $scope.report.definition.project_title.replace(/\ /g, '_') + '_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );

				// add project code to subtitle?
				var text = 'Actual Monthly Beneficiaries Report for ' + moment( $scope.report.definition.reporting_period ).format('MMMM, YYYY');
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + text : text;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_report',
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
							'title': subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download Monthly Acvitiy Report as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/cluster/report/getReportCsv',
									data: {
										report: $scope.report.report,
										report_type: 'activity',
										report_id: $scope.report.definition.id
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
										theme: 'cluster_project_report_' + $scope.report.user.cluster_id,
										format: 'csv',
										url: $location.$$path
									}
								}
							}]
						}
						// download: {
						// 	'class': 'col s12 m3 l3 hide-on-small-only',
						// 	downloads: [{
						// 		type: 'pdf',
						// 		color: 'blue',
						// 		icon: 'picture_as_pdf',
						// 		hover: 'Download Health 4W as PDF',
						// 		request: {
						// 			method: 'POST',
						// 			url: 'http://' + $location.host() + '/api/print',
						// 			data: {
						// 				cluster_id: $scope.report.definition.cluster_id,
						// 				report: $scope.report.report,
						// 				printUrl: $location.absUrl(),
						// 				downloadUrl: 'http://' + $location.host() + '/report/',
						// 				user: ngmUser.get(),
						// 				viewportWidth: 1390,
						// 				pageLoadTime: 7200
						// 			}
						// 		},
						// 		metrics: {
						// 			method: 'POST',
						// 			url: 'http://' + $location.host() + '/api/metrics/set',
						// 			data: {
						// 				organization: $scope.report.user.organization,
						// 				username: $scope.report.user.username,
						// 				email: $scope.report.user.email,
						// 				dashboard: $scope.report.project.project_title,
						// 				theme: 'cluster_project_report',
						// 				format: 'pdf',
						// 				url: $location.$$path
						// 			}
						// 		}
						// 	}]
						// }
					},
					rows: [{		
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'project.report',
								config: {
									style: $scope.report.ngm.style,
									project: $scope.report.project,
									report: $scope.report.definition
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

		// send request
		$q.all([ $scope.report.getProject, $scope.report.getReport ]).then( function( results ){

			// assign
			$scope.report.setProjectDetails( results );

		});
		
	}]);