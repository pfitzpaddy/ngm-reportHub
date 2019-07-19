/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmCluster',[])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false );




		this.page = {
			start_date: function() {
				var date;
				if ( moment.utc().date() <= 20 ) {
					date = moment.utc().startOf( 'M' ).subtract( 1, 'M').format( 'YYYY-MM-DD' )
				} else {
					date = moment.utc().startOf( 'M' ).format( 'YYYY-MM-DD' );
				}
				return date;
			},
			end_date: function() {
				var date;
				if ( moment.utc().date() <= 20 ) {
					date = moment.utc().endOf( 'M' ).subtract( 1, 'M').format( 'YYYY-MM-DD' )
				} else {
					date = moment.utc().endOf( 'M' ).format( 'YYYY-MM-DD' );
				}
				return date;
			},
		}

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
			// organization
			.when( '/cluster/organization', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project list by organization
			.when( '/cluster/organization/:organization_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// stock reports
			.when( '/cluster/stocks', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterOrganizationStocksListCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// stock reports list by organization
			.when( '/cluster/stocks/:organization_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterOrganizationStocksListCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// stock report
			.when( '/cluster/stocks/report/:organization_id/:report_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterOrganizationStockReportCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// Syria FSAC Demo
			.when( '/cluster/syria/fsac', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterSyriaDashboard',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// project list
			.when( '/cluster/projects', {
				redirectTo: '/cluster/projects/all'
			})
			// project list
			.when( '/cluster/projects/:cluster_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectProjectsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project organization
			.when( '/cluster/projects/organization/:organization_id', {
				redirectTo: '/cluster/projects/organization/:organization_id/all'
			})
			// project organization
			.when( '/cluster/projects/organization/:organization_id/:cluster_id', {				
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectProjectsCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
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
			// project reports
			.when( '/cluster/projects/report/:project/:report/:location_group', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// project reports groupings
			.when( '/cluster/projects/group/:project/:report', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectReportGroupCtrl',
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
			// project documents
			.when('/cluster/projects/upload/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ClusterProjectDocumentCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// DEFAULT
			.when( '/cluster/admin', {
				redirectTo: '/cluster/admin/all/all/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})

			// HQ SUPERADMIN BY CLUSTER
			.when( '/cluster/admin/all/all/agriculture', {
				redirectTo: '/cluster/admin/all/all/all/agriculture/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/education', {
				redirectTo: '/cluster/admin/all/all/all/education/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/esnfi', {
				redirectTo: '/cluster/admin/all/all/all/esnfi/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/fsac', {
				redirectTo: '/cluster/admin/all/all/all/fsac/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/health', {
				redirectTo: '/cluster/admin/all/all/all/health/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/nutrition', {
				redirectTo: '/cluster/admin/all/all/all/nutrition/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/cvwg', {
				redirectTo: '/cluster/admin/all/all/all/cvwg/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/protection', {
				redirectTo: '/cluster/admin/all/all/all/protection/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/all/all/wash', {
				redirectTo: '/cluster/admin/all/all/all/wash/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			
			// AFRO
			.when( '/cluster/admin/afro', {
				redirectTo: '/cluster/admin/afro/all/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/afro/cd', {
				redirectTo: '/cluster/admin/afro/cd/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/afro/et', {
				redirectTo: '/cluster/admin/afro/et/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/afro/ng', {
				redirectTo: '/cluster/admin/afro/ng/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/afro/ss', {
				redirectTo: '/cluster/admin/afro/ss/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})

			// EMRO
			.when( '/cluster/admin/emro', {
				redirectTo: '/cluster/admin/emro/all/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/emro/af', {
				redirectTo: '/cluster/admin/emro/af/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/emro/so', {
				redirectTo: '/cluster/admin/emro/so/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/emro/sy', {
				redirectTo: '/cluster/admin/emro/sy/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/emro/ur', {
				redirectTo: '/cluster/admin/emro/ur/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/emro/ye', {
				redirectTo: '/cluster/admin/emro/ye/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})

			// EURO
			.when( '/cluster/admin/euro', {
				redirectTo: '/cluster/admin/euro/all/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/euro/ua', {
				redirectTo: '/cluster/admin/euro/ua/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})

			// SEARO
			.when( '/cluster/admin/searo', {
				redirectTo: '/cluster/admin/searo/all/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/searo/bd', {
				redirectTo: '/cluster/admin/searo/bd/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/searo/cb', {
				redirectTo: '/cluster/admin/searo/cb/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/searo/cb/protection/cp', {
				redirectTo: '/cluster/admin/searo/cb/protection/cp/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/searo/cb/protection/gbv', {
				redirectTo: '/cluster/admin/searo/cb/protection/gbv/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when( '/cluster/admin/searo/cb/protection/protection', {
				redirectTo: '/cluster/admin/searo/cb/protection/protection/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})

			//AMER
			.when('/cluster/admin/amer/',{
				redirectTo:'/cluster/admin/amer/all/all/all/all/activity' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when('/cluster/admin/amer/col',{
				redirectTo: '/cluster/admin/amer/col/all/all/all/activity' + this.page.start_date() + '/' + this.page.end_date()
			})

			//AMER
			.when('/cluster/admin/amer',{
				redirectTo:'/cluster/admin/amer/all/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})
			.when('/cluster/admin/amer/col',{
				redirectTo: '/cluster/admin/amer/col/all/all/all/activity/' + this.page.start_date() + '/' + this.page.end_date()
			})

			// ADMIN
			.when( '/cluster/admin/:adminRpcode/:admin0pcode/:cluster_id/:activity_type_id/:organization_tag/:report_type/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardClusterAdminCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// hct dashboard 2017
			.when( '/cluster/health/hct', {
				redirectTo: '/cluster/health/hct/all'
			})
			.when( '/cluster/health/hct/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHctCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})

			// cluster dashboard default
			.when( '/cluster/4w', {
				redirectTo: '/cluster/5w'
			})
			.when( '/cluster/5w/', {
				redirectTo: '/cluster/5w'
			})
			.when( '/cluster/5w//', {
				redirectTo: '/cluster/5w'
			})
			.when( '/cluster/5w', {
				resolve: {
					access: [ '$location', 'ngmUser', 'ngmAuth', function( $location, ngmUser, ngmAuth ) {
						ngmAuth.grantPublicAccess();
						// redirect to user init route
						const userInitRouteParams = ngmAuth.getRouteParams('DASHBOARD');
						const user = ngmUser.get();
						const adminRpcode = userInitRouteParams.includes('adminRpcode') && user && user.adminRpcode ? user.adminRpcode.toLowerCase() : 'hq';
						const admin0pcode = userInitRouteParams.includes('admin0pcode') && user && user.admin0pcode ? user.admin0pcode.toLowerCase() : 'all';
						const cluster_id = userInitRouteParams.includes('cluster_id') && user && user.cluster_id ? user.cluster_id.toLowerCase() : 'all';
						const organization_tag = userInitRouteParams.includes('organization_tag') && user && user.organization_tag ? user.organization_tag.toLowerCase() : 'all';
						const url = '/cluster/5w/' + adminRpcode + '/' + admin0pcode + '/all/all/' + cluster_id + '/all/' + organization_tag + '/all/2018-01-01/' + moment().format('YYYY-MM-DD');
						$location.path( url );
					}]
				},
			})

			// cluster dashboard HQ
			.when( '/cluster/5w/hq', {
				redirectTo: '/cluster/5w/hq/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/hq/all', {
				redirectTo: '/cluster/5w/hq/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			
			// cluster dashboard AFRO
			.when( '/cluster/5w/afro', {
				redirectTo: '/cluster/5w/afro/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/all', {
				redirectTo: '/cluster/5w/afro/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/cd', {
				redirectTo: '/cluster/5w/afro/cd/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/et', {
				redirectTo: '/cluster/5w/afro/et/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/ng', {
				redirectTo: '/cluster/5w/afro/ng/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/afro/ss', {
				redirectTo: '/cluster/5w/afro/ss/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})

			// EURO
			.when( '/cluster/5w/euro', {
				redirectTo: '/cluster/5w/euro/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/euro/all', {
				redirectTo: '/cluster/5w/euro/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/euro/ua', {
				redirectTo: '/cluster/5w/euro/ua/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			
			// cluster dashboard EMRO
			.when( '/cluster/5w/emro', {
				redirectTo: '/cluster/5w/emro/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/all', {
				redirectTo: '/cluster/5w/emro/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/af', {
				redirectTo: '/cluster/5w/emro/af/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/so', {
				redirectTo: '/cluster/5w/emro/so/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/sy', {
				redirectTo: '/cluster/5w/emro/sy/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/ur', {
				redirectTo: '/cluster/5w/emro/ur/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/emro/ye', {
				redirectTo: '/cluster/5w/emro/ye/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})

			// SEARO
			.when( '/cluster/5w/searo', {
				redirectTo: '/cluster/5w/searo/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/searo/all', {
				redirectTo: '/cluster/5w/searo/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/searo/bd', {
				redirectTo: '/cluster/5w/searo/bd/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/5w/searo/cb', {
				redirectTo: '/cluster/5w/searo/cb/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})

			//AMER
			.when('/cluster/5w/amer', {
				redirectTo: '/cluster/5w/amer/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/amer/all', {
				redirectTo: '/cluster/5w/amer/all/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when('/cluster/5w/amer/col',{
				redirectTo: '/cluster/5w/amer/col/all/all/all/all/all/all/2018-01-01/' + moment().format('YYYY-MM-DD')
			})

			// health dashboard
			.when( '/cluster/5w/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:activity_type_id/:organization_tag/:beneficiaries/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardClusterCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})

			// health dashboard
			.when( '/cluster/health', {
				// redirectTo: '/cluster/health/5w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/2016-12-31'
			})
			// health dashboard
			.when( '/cluster/health/4w', {
				// redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/2016-12-31'
			})
			// health dashboard
			.when( '/cluster/health/4w/:adminR/:admin0/:organization_tag/:admin1/:admin2/:project/:beneficiaries/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHealthCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})

			// 4w project plan dashboard


			// health dashboard
				.when( '/cluster/4wprojectplan', {
				// redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/4wprojectplan'
			})
			.when( '/cluster/4wprojectplan/', {
				// redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/4wprojectplan'
			})
			// health dashboard
			.when( '/cluster/4wprojectplan//', {
				// redirectTo: '/cluster/health/4w/hq/all/all/all/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
				redirectTo: '/cluster/4wprojectplan'
			})
			// health dashboard
			.when( '/cluster/4wprojectplan', {
				/*templateUrl: '/views/app/dashboard.html',
				controller: 'Dashboard4wProjectPlanCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}*/
				resolve: {
					access: [ '$location', 'ngmUser', 'ngmAuth', function( $location, ngmUser, ngmAuth ) {
						ngmAuth.grantPublicAccess();
						// redirect to user init route
						const userInitRouteParams = ngmAuth.getRouteParams('DASHBOARD');
						const user = ngmUser.get();
						const adminRpcode = userInitRouteParams.includes('adminRpcode') && user && user.adminRpcode ? user.adminRpcode.toLowerCase() : 'hq';
						const admin0pcode = userInitRouteParams.includes('admin0pcode') && user && user.admin0pcode ? user.admin0pcode.toLowerCase() : 'all';
						const cluster_id = userInitRouteParams.includes('cluster_id') && user && user.cluster_id ? user.cluster_id.toLowerCase() : 'all';
						const organization_tag = userInitRouteParams.includes('organization_tag') && user && user.organization_tag ? user.organization_tag.toLowerCase() : 'all';
						const url = '/cluster/4wprojectplan/' + adminRpcode + '/' + admin0pcode + '/all/all/' + cluster_id + '/' + organization_tag + '/2019-01-01/' + moment().format('YYYY-MM-DD');
						$location.path( url );
					}]
				},
			})
			// cluster dashboard HQ
			.when( '/cluster/4wprojectplan/hq', {
				redirectTo: '/cluster/4wprojectplan/hq/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/hq/all', {
				redirectTo: '/cluster/4wprojectplan/hq/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			
			// 4wdashboardprojectplan AMER
			.when( '/cluster/4wprojectplan/amer', {
				redirectTo: '/cluster/4wprojectplan/amer/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/amer/all', {
				redirectTo: '/cluster/4wprojectplan/amer/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/amer/col', {
				redirectTo: '/cluster/4wprojectplan/amer/col/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})

			//4wdashboardprojectplan AFRO

			.when( '/cluster/4wprojectplan/afro', {
				redirectTo: '/cluster/4wprojectplan/afro/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/all', {
				redirectTo: '/cluster/4wprojectplan/afro/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/cd', {
				redirectTo: '/cluster/4wprojectplan/afro/cd/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/et', {
				redirectTo: '/cluster/4wprojectplan/afro/et/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/ng', {
				redirectTo: '/cluster/4wprojectplan/afro/ng/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/afro/ss', {
				redirectTo: '/cluster/4wprojectplan/afro/ss/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})

			// EURO
			.when( '/cluster/4wprojectplan/euro', {
				redirectTo: '/cluster/4wprojectplan/euro/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/euro/all', {
				redirectTo: '/cluster/4wprojectplan/euro/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/euro/ua', {
				redirectTo: '/cluster/4wprojectplan/euro/ua/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			
			// cluster dashboard EMRO
			.when( '/cluster/4wprojectplan/emro', {
				redirectTo: '/cluster/4wprojectplan/emro/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/all', {
				redirectTo: '/cluster/4wprojectplan/emro/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/af', {
				redirectTo: '/cluster/4wprojectplan/emro/af/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/so', {
				redirectTo: '/cluster/4wprojectplan/emro/so/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/sy', {
				redirectTo: '/cluster/4wprojectplan/emro/sy/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/ur', {
				redirectTo: '/cluster/4wprojectplan/emro/ur/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/emro/ye', {
				redirectTo: '/cluster/4wprojectplan/emro/ye/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})

			// SEARO
			.when( '/cluster/4wprojectplan/searo', {
				redirectTo: '/cluster/4wprojectplan/searo/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/searo/all', {
				redirectTo: '/cluster/4wprojectplan/searo/all/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/searo/bd', {
				redirectTo: '/cluster/4wprojectplan/searo/bd/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})
			.when( '/cluster/4wprojectplan/searo/cb', {
				redirectTo: '/cluster/4wprojectplan/searo/cb/all/all/all/all/2019-01-01/' + moment().format('YYYY-MM-DD')
			})

			// health dashboard
			.when( '/cluster/4wprojectplan/:adminRpcode/:admin0pcode/:admin1pcode/:admin2pcode/:cluster_id/:organization_tag/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'Dashboard4wProjectPlanCtrl',
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
			// CLUSTER HOME
			.when( '/cluster', {
				redirectTo: '/cluster/organization'
			})
			// DEFAULT
			// .otherwise({
			// 	redirectTo: '/cluster/organization'
			// });

	}]);
