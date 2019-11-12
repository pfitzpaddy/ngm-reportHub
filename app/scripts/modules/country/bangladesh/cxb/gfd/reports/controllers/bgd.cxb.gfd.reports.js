/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardBgdCxbGfdCtrl
 * @description
 * # ClusterProjectProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller('DashboardBgdCxbGfdCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', '$translate', '$filter', '$rootScope', function ($scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper, $translate, $filter, $rootScope ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// user
			user: ngmUser.get(),

			// title
			title: "WFP | CXB | GFD | Reports",

			// subtitle
			subtitle: "General Food Distribution Reporting, Cox's Bazar, Bangladesh",

			// organization
			getOrganizationHref: function() {
				var href = '#/cluster/organization';
				if ( $route.current.params.organization_id ) { href += '/' + $route.current.params.organization_id }
				return href;
			},

			// init
			init: function() {

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_list',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: $scope.report.subtitle
						}
					},
					menu:[],
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {
									html: '<a class="btn-flat waves-effect waves-teal left hide-on-small-only" href="' + $scope.report.getOrganizationHref() + '"><i class="material-icons left">keyboard_return</i>'+$filter('translate')('back_to_organization')+'</a>'
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
									color: 'orange',
									textColor: 'white-text',
									title: 'Active Distributions',
									icon: 'edit',
									status: '#fff176',
									right_icon: 'watch_later',
									report_url: '#/bgd/cxb/gfa/gfd',
									templateUrl: '/scripts/widgets/ngm-list/template/distribution.html',
									orderBy: 'reporting_due_date',
									toDate: function( date ){
										return moment.utc( date ).format( 'YYYY-MM-DD' );
									},
									reportFormat: function( item ){
										return 'Distribution Report Closing: ' + moment.utc( item.reporting_due_date ).format('DD MMMM, YYYY');
									},
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getDistributionRound',
										data: { report_status: 'active' }
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
									color: 'orange',
									textColor: 'white-text',
									title: 'Complete Distributions',
									icon: 'done',
									status: '#4db6ac',
									right_icon: 'check_circle',
									report_url: '#/bgd/cxb/gfa/gfd',
									templateUrl: '/scripts/widgets/ngm-list/template/distribution.html',
									orderBy: 'reporting_due_date',
									toDate: function( date ){
										return moment.utc( date ).format( 'YYYY-MM-DD' );
									},
									reportFormat: function( item ){
										return 'Distribution Report Completed: ' + moment.utc( item.reporting_due_date ).format('DD MMMM, YYYY');
									},
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/wfp/gfa/gfd/getDistributionRound',
										data: { report_status: 'complete' }
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

			}

		}		
		
		// init
		$scope.report.init();
		
	}]);
