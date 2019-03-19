/**
 * @ngdoc overview
 * @name app.js
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmSbp', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			// epr dashboard
			.when( '/snapshot', {
				redirectTo: '/snapshot/who/immap'
			})
			.when( '/snapshot/who/immap', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWhoImmapCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// drr snapshot
			.when( '/snapshot/immap/', {
				redirectTo: '/snapshot/immap/drr'
			})
			.when( '/snapshot/immap/drr', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardDrrSnapshot',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// reporthub snapshot
			.when( '/snapshot/who/', {
				redirectTo: '/snapshot/who/reporthub'
			})
			.when( '/snapshot/who/reporthub', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardReporthubSnapshot',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// cdc monthly reports
			.when( '/snapshot/who/cdc/', {
				redirectTo: '/snapshot/who/cdc/report/2017/10'
			})
			.when( '/snapshot/who/cdc/report/2017/10', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWhoCdc201710Ctrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when( '/snapshot/who/cdc/report/2017/11', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWhoCdc201711Ctrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when( '/snapshot/who/cdc/report/2017/12', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWhoCdc201712Ctrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			.when( '/snapshot/who/cdc/report/2018/01', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWhoCdc201801Ctrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			});

	}]);
