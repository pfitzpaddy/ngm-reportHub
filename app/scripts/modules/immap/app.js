/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmiMMAP', [
])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider) {



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
			// project list
			.when( '/immap', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ImmapHomeCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// TEAM
			.when( '/immap/team', {
				redirectTo: '/immap/team/all/all/all/all'
			})
			.when( '/immap/team/:admin0pcode/:organization_tag/:project/:cluster_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardTeamCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/immap/profile', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardProfileCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			.when( '/immap/profile/:username', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardProfileCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// Products
			.when( '/immap/products', {
				redirectTo: '/immap/products/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/immap/products/:admin0pcode/:project/:product_sector_id/:product_type_id/:email/:start_date/:end_date', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ImmapProductsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			// Products
			.when( '/immap/products/new', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ImmapProductsNewCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			// Watchkeeper
			.when( '/immap/watchkeeper', {
				redirectTo: '/immap/watchkeeper/kenya/2015-11-01/2015-11-30'
			})
			.when( '/immap/watchkeeper/:country/:start/:end', {
				reloadOnSearch: false,
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWatchkeeperCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						// return ngmAuth.isAuthenticated(); 
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
			});
	}]);
