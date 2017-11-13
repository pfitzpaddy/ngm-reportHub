/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmEthiopia', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			// project list
			.when( '/who/ethiopia', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardEthAssessmentsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/who/ethiopia/ctc', {
				redirectTo: '/who/ethiopia/ctc/all/all/all/2017-01-01/' + moment().format('YYYY-MM-DD')
			})
			// epr dashboard
			.when( '/who/ethiopia/ctc/:region/:zone/:woreda/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardEthCtcCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			});

	}]);
