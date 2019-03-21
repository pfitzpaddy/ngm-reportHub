/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmDews', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )	
		
		// app routes with access rights
		$routeProvider
			// LOGIN
			.when( '/who/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})			
			// DEFAULTS
			.when( '/who', {
				redirectTo: '/who/dews/afghanistan/all/2015-03-01/2016-02-29'
			})
			.when( '/who/dews', {
				redirectTo: '/who/dews/afghanistan/all/2015-03-01/2016-02-29'
			})
			.when( '/who/dews/afghanistan', {
				redirectTo: '/who/dews/afghanistan/all/2015-03-01/2016-02-29'
			})
			.when( '/who/dews/upload', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'UpdateDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			// DEWS
			.when( '/who/dews/:location/:disease/:start/:end', {
				reloadOnSearch: false,
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardDewsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// FORBIDDEN
			.when( '/who/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return !ngmAuth.isAuthenticated();
					}],
				}
			})

	}]);
