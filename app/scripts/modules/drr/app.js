/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmDrr', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			// iMMAP
			.when( '/immap/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})
			// DEFAULTS
			// .when( '/immap', {
			// 	redirectTo: '/immap/drr/baseline/afghanistan'
			// })
			// .when( '/immap/drr', {
			// 	redirectTo: '/immap/drr/baseline/afghanistan'
			// })
			.when( '/immap/drr/baseline', {
				redirectTo: '/immap/drr/baseline/afghanistan'
			})
			// DRR
			.when( '/immap/drr/baseline/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBaselineCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when( '/immap/drr/baseline/:province/:district', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBaselineCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// DRR FLOOD-RISK
			.when( '/immap/drr/flood-risk/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardFloodRiskCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when( '/immap/drr/flood-risk/:province/:district', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardFloodRiskCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// DRR FLOOD-FORECAST
			.when( '/immap/drr/flood-forecast/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardFloodForecastCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when( '/immap/drr/flood-forecast/:province/:district', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardFloodForecastCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// FORBIDDEN
			.when( '/immap/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			})	
	}]);
