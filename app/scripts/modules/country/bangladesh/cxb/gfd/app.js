/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmBangladesh', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			// bgd wfp
			.when( '/bgd', {
				redirectTo: '/bgd/cxb/gfa/gfd'
			})
			.when( '/bgd/cxb', {
				redirectTo: '/bgd/cxb/gfa/gfd'
			})
			.when( '/bgd/cxb/gfa', {
				redirectTo: '/bgd/cxb/gfa/gfd'
			})
			.when( '/bgd/cxb/gfa/gfd', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBgdCxbGfdCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/bgd/cxb/gfa/gfd/round/:report_round/distribution/:report_distribution/:reporting_period', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBgdCxbGfdRoundCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/bgd/cxb/gfa/gfd/round/:report_round/distribution/:report_distribution/:reporting_period/plan/:organization_tag/:site_id/:admin3pcode/:admin4pcode/:admin5pcode', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBgdCxbGfdRoundPlanCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/bgd/cxb/gfa/gfd/round/:report_round/distribution/:report_distribution/:reporting_period/daily/:organization_tag/:site_id/:admin3pcode/:admin4pcode/:admin5pcode/:start_date/:end_date', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBgdCxbGfdRoundDailyCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/bgd/cxb/gfa/gfd/round/:report_round/distribution/:report_distribution/:reporting_period/actual/:organization_tag/:site_id/:admin3pcode/:admin4pcode/:admin5pcode/:start_date/:end_date', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBgdCxbGfdRoundActualCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			});

	}]);
