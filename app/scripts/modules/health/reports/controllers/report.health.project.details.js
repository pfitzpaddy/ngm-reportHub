/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectDetailsCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmData', 'ngmUser', function ($scope, $route, $location, $anchorScroll, $timeout, ngmData, ngmUser) {
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
					name: 'report_health_details',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: ngmUser.get().admin0name + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate',
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
										theme: 'health_project_details',
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
										theme: 'health_project_details',
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
						// rows: [{
						// 	'title': 'Back to Projects',
						// 	'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						// 	'param': 'project',
						// 	'active': 'active',
						// 	'href': '#/health/projects'
						// }]
					// },{
					// 	'id': 'project_details_menu_option',
					// 	'icon': 'playlist_add',
					// 	'title': 'Project Details',
					// 	'class': 'blue-grey darken-1 white-text',
					// },{
					// 	'id': 'project_beneficiaries_menu_option',
					// 	'icon': 'group',
					// 	'title': 'Beneficiaries',
					// 	'class': 'light-blue lighten-4 grey-text text-darken-2',
					// },{
					// 	'id': 'project_locations_menu_option',
					// 	'icon': 'location_on',
					// 	'title': 'Locations',
					// 	'class': 'teal lighten-4 grey-text text-darken-2',
					// }],
					// }],
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
				
				// // add click events
				// $timeout(function() {

				// 	// back to projects
				// 	$( '#keyboard_return_menu_option' ).click(function(){
				// 		$location.path( '/health/projects' );
				// 	});
				// 	$( '#li-keyboard_return_menu_option' ).click(function(){
				// 		$location.path( '/health/projects' );
				// 	});

				// 	// scroll to details
				// 	$( '#li-project_details_menu_option' ).click(function(){
				// 		// div item
				// 		$location.hash('project_details_form');
				// 		// call $anchorScroll()
				// 		$anchorScroll();
				// 	});

				// 	$( '#li-project_beneficiaries_menu_option' ).click(function(){
				// 		// div item
				// 		$location.hash( 'project_beneficiaries_form' );
				// 		// call $anchorScroll()
				// 		$anchorScroll();
				// 	});

				// }, 1000);

			}			

		}		

		// Run page

		// if 'new' create empty project
		if( $route.current.params.project === 'new' ) {

			// current date
			var d = new Date();

			// create empty project
			var project = {
    		adminRpcode: ngmUser.get().adminRpcode,
    		adminRname: ngmUser.get().adminRname,
    		admin0pcode: ngmUser.get().admin0pcode,
    		admin0name: ngmUser.get().admin0name,
				organization_id: ngmUser.get().organization_id,
				organization: ngmUser.get().organization,
				username: ngmUser.get().username,
				email: ngmUser.get().email,
				project_status: 'new',
				project_title: 'New Project',
				project_description: 'Complete the project details to register a new project',
				project_start_date: new Date(),
				project_end_date: new Date(d.getFullYear(), d.getMonth() + 6, d.getDate()),
				target_beneficiaries: [],
				beneficiary_type: [],
				target_locations: [],
				prov_code: [],
				dist_code: []
			}

			// set summary
			$scope.report.setProjectDetails( project );

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