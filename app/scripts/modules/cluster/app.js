/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmCluster', [])
	.run( [ '$location', '$q', '$http', 'ngmUser', 'ngmClusterHelper', function ( $location, $q, $http, ngmUser, ngmClusterHelper ) { 

		// get lists
		ngmClusterHelper.setClusterLists( ngmUser.get().admin0pcode );

	}])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			// login
			.when( '/cluster/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// register
			.when( '/cluster/register', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardRegisterCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// reset with token
			.when( '/cluster/find/:token', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardResetCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// forbidden
			.when( '/cluster/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			})
			// guides
			.when( '/cluster/guides', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesMenuCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})		
			// feedback
			.when( '/cluster/guides/feedback', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesFeedbackCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// screencasts
			.when( '/cluster/guides/screens', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesScreenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})			
			// project list
			.when( '/cluster/projects', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project list by organization
			.when( '/cluster/projects/:organization_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.hasRole( 'ADMIN' );
					}],
				}
			})			
			// project summary
			.when( '/cluster/projects/summary/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectSummaryCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project details
			.when( '/cluster/projects/details/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectDetailsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports
			.when( '/cluster/projects/report/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportsListCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports
			.when( '/cluster/projects/report/:project/:report', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})			
			// project financials
			.when( '/cluster/projects/financials/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectFinancialsCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// admin
			.when( '/cluster/admin', {
				redirectTo: '/cluster/admin/hq/all/all/' + moment().subtract( 1, 'M').startOf( 'M' ).format( 'YYYY-MM-DD' ) + '/' + moment().subtract( 1, 'M').endOf( 'M' ).format('YYYY-MM-DD')
			})
			// admin
			.when( '/cluster/admin/:adminR/:admin0/:organization_id/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardClusterAdminCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						// return ngmAuth.hasRole( 'ADMIN' );
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// health dashboard
			.when( '/cluster/health', {
				redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
			})
			// health dashboard
			.when( '/cluster/health/4w', {
				redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
			})
			// health dashboard
			.when( '/cluster/health/4w/:adminR/:admin0/:organization_id/:admin1/:admin2/:project/:beneficiaries/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHealthCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// FORBIDDEN
			.when( '/cluster/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return !ngmAuth.isAuthenticated();
					}],
				}
			})
			// DEFAULT
			.otherwise({
				redirectTo: '/cluster/projects'
			});

	}]);
