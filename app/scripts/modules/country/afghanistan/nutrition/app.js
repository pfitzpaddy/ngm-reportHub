/**
 * @ngdoc overview
 * @name ngmNutrition
 * @description
 * # ngmNutrition
 *
 * Main module of the application.
 */
angular
	.module('ngmNutrition', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider) {

	

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
        $routeProvider
            // nutrition weekly
			.when( '/nutrition/afghanistan', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardNutritionAssessmentsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// nutrition koboform
			.when( '/nutrition/afghanistan/form/:mode/:id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardNutritionKoboFormCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// nutrition koboform edit
			.when( '/nutrition/afghanistan/form/:mode/:id/:instance_id', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardNutritionKoboFormCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// nutrition weekly dashboard
			.when( '/nutrition/afghanistan/dashboard', {
				redirectTo: '/nutrition/afghanistan/dashboard/2018/all/all/all/all/2018-01-01/' + moment().add(1, 'day').startOf('isoWeek').subtract(1, 'day').add(1, 'week').format('YYYY-MM-DD')
			})
			// nutrition weekly dashboard
			.when( '/nutrition/afghanistan/dashboard/:year/:province/:district/:organization/:week/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardNutritionWeeklyCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// nutrition weekly admin
			.when( '/nutrition/afghanistan/admin', {
				redirectTo: '/nutrition/afghanistan/admin/2018/all/all/all/all/2018-01-01/' + moment().add(1, 'day').startOf('isoWeek').subtract(1, 'day').add(1, 'week').format('YYYY-MM-DD')
			})
			// nutrition weekly admin
			.when( '/nutrition/afghanistan/admin/:year/:province/:district/:organization/:week/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardNutritionWeeklyAdminCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			});

	}]);