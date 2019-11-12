/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardBgdCxbGfdRoundCtrl
 * @description
 * # ClusterProjectProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller('DashboardBgdCxbGfdRoundCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', '$translate', '$filter', '$rootScope', function ($scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper, $translate, $filter, $rootScope ) {
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

			// report round
			report_round: $route.current.params.report_round,

			// report distribution
			report_distribution: $route.current.params.report_distribution,

			// reporting_period
			reporting_period: $route.current.params.reporting_period,

			// title
			title: "WFP | CXB | GFD | Report | Round " + $route.current.params.report_round + " | D" + $route.current.params.report_distribution,

			// subtitle
			subtitle: "General Food Distribution Reporting for Cox's Bazar, Bangladesh, Round " + $route.current.params.report_round + ", Distribution " + $route.current.params.report_distribution,

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
									html: '<a class="btn-flat waves-effect waves-teal left hide-on-small-only" href="#/bgd/cxb/gfa/gfd"><i class="material-icons left">keyboard_return</i>Back to Distribution Rounds</a>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									data: {
										user: $scope.report.user,
										today: moment.utc().format( 'YYYY-MM-DD' ),
										end_date: moment.utc( $scope.report.reporting_period ).endOf( 'month' ).format( 'YYYY-MM-DD' ),
										report_round: $scope.report.report_round,
										report_distribution: $scope.report.report_distribution,
										reporting_period: moment.utc( $scope.report.reporting_period ).format( 'YYYY-MM-DD' )
									},
									templateUrl: '/scripts/modules/country/bangladesh/cxb/gfd/views/bgd.cxb.wfp.gfa.reports.home.page.html',
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
