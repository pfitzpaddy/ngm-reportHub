/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectReportGroupCtrl
 * @description
 * # ClusterProjectReportGroupCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectReportGroupCtrl', ['$scope', '$route', '$http', '$q', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser','$translate','$filter', 'ngmClusterBeneficiaries', function ($scope, $route, $http, $q, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser, $translate, $filter, ngmClusterBeneficiaries) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm,
			
			// current user
			user: ngmUser.get(),

			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),

			// get project
			getProject: $http({
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}),

			// get report
			getReport: $http({
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/report/getReportDetailsById',
				data: {
					id: $route.current.params.report
				}
			}),

			// the header navigation settings
			getHeaderHtml: function(){
				var html = '<div class="row">'
										+'<div class="col s12 m12 l12">'
											+'<div style="padding:20px;">'
												+'<a class="btn-flat waves-effect waves-teal" href="#/cluster/projects/report/' + $scope.report.project.id +'">'
													+'<i class="material-icons left">keyboard_return</i>'+$filter('translate')('back_to_project_reports')
												+'</a>'
												+'<span class="right" style="padding-top:8px;">'+$filter('translate')('last_updated')+': ' + moment( $scope.report.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) +'</span>'
											+'</div>'
										+'</div>'
									+'</div>';

				return html;
			},

			// set project details
			setProjectDetails: function(data){

				// project
				$scope.report.project = data[0].data;

				// report
				$scope.report.definition = data[1].data;

				// add project code to subtitle?
				var text = $filter('translate')('actual_monthly_beneficiaries_report_for')+' ' + $scope.report.project.project_title
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + text : text;
				var nonProjectDates = moment.utc($scope.report.project.project_start_date).startOf('month') > moment.utc($scope.report.definition.reporting_period).startOf('month')
													 		|| moment.utc($scope.report.project.project_end_date).endOf('month')	< moment.utc($scope.report.definition.reporting_period).startOf('month');
				var monthlyTitleFormat =  moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY');
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
							title: $scope.report.project.organization + ' | ' + $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.project_title
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
								hover: $filter('translate')('download_monthly_reports_as_csv'),
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
								type: 'html',
								config: {
									project: $scope.report.project,
									report: $scope.report.definition,
									nonProjectDates: nonProjectDates,
									monthlyTitleFormat: monthlyTitleFormat,
									// submit
									submit_update:function( obj, redirect ){

										// materialize
										$timeout(function(){ Materialize.toast( 'Processing...', 6000, 'note' ); }, 400 );

										// Run page get project
										ngmData.get({
											method: 'POST',
											url: ngmAuth.LOCATION + '/api/cluster/report/updateReportStatus',
											data: {
												report_id: $route.current.params.report,
												update: obj
											}
										}).then(function(data){
											
              				// user msg
			              	var msg = $filter('translate')('project_report_for')+'  ' + moment.utc( $scope.report.definition.reporting_period ).format('MMMM, YYYY') + ' ';
			                 		msg += redirect ? $filter('translate')('submitted')+'!' : $filter('translate')('saved_mayus1')+'!';
											$timeout(function(){ Materialize.toast( msg, 6000, 'success' ); }, 400 );
											if ( redirect ) {
												$location.path( '/cluster/projects/report/' + $route.current.params.project );
											}

										});
									},

									// remove report modal
									removeReportModal: function () {
										$('#remove-report-modal').openModal({ dismissible: false });
									},

									// remove report
									removeReport: function () {
										ngmClusterBeneficiaries.removeReport($scope.report.project, $scope.report.definition.id, function (err) {
											if (!err) {
												$timeout(function () {
													$location.path('/cluster/projects/report/' + $scope.report.project.id);
												}, 400);
											}
										});
									},

									templatesUrl: '/scripts/modules/cluster/views/forms/report/',
									notesUrl: 'notes.html',
									uploadUrl: 'report-upload.html',
									templateUrl: '/scripts/modules/cluster/views/forms/report/report.group.html',
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

		// assign to ngm app scope
		$scope.report.ngm.dashboard.model = $scope.model;

		// taost for user
		$timeout( function() { Materialize.toast( 'Loading Monthly Groups...', 6000, 'success' ); }, 400 );

		// send request
		$q.all([ $scope.report.getProject, $scope.report.getReport ]).then( function( results ){

			// assign
			$scope.report.setProjectDetails( results );

		});
		
	}]);