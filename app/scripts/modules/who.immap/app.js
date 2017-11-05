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
			// epr
			// .when( '/sbp', {
			// 	redirectTo: '/epr/2017/all/all/all/2017-01-01/' + moment().format('YYYY-MM-DD')
			// })
			// epr dashboard
			.when( '/who-immap', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWhoImmapCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})

	}]);
