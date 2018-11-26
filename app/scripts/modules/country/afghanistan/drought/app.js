/**
 * @ngdoc overview
 * @name ngmDrought
 * @description
 * # ngmNutrition
 *
 * Main module of the application.
 */
angular
	.module('ngmDrought', [])
	.config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled(false)

		// app routes with access rights
		$routeProvider
			
			// /response page could have cards for each country response
			.when( '/response', {
				redirectTo: '/response/afghanistan/drought'
			})
			.when( '/response/afghanistan', {
				redirectTo: '/response/afghanistan/drought'
			})
			.when('/response/afghanistan/drought', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DroughtMainCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			
			// .when('/response/afghanistan/drought/dashboard/non_displaced', {
			// 	redirectTo: '/response/afghanistan/drought/dashboard/non_displaced/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
			// })
			.when('/response/afghanistan/drought/dashboard/non_displaced', {
				// redirectTo: '/response/afghanistan/drought/dashboard/non_displaced/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
				resolve:{
					access: ['$location', 'ngmUser', function ($location, ngmUser) {
						var user = ngmUser.get();
						if(user.roles.indexOf('SUPERADMIN') !== -1){
							var url = '/response/afghanistan/drought/dashboard/non_displaced/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						} else if (user.roles.indexOf('ADMIN') !== -1){
							var url = '/response/afghanistan/drought/dashboard/non_displaced/' + moment().year() +'/'+ user.cluster_id + '/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						} else {
							var url = '/response/afghanistan/drought/dashboard/non_displaced/' + moment().year() + '/' + user.cluster_id + '/all/all/' + user.organization_tag +'/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						}
						$location.path(url);
					}]
				}
			})
					
			// .when('/response/afghanistan/drought/dashboard/displaced', {
			// 	redirectTo: '/response/afghanistan/drought/dashboard/displaced/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
			// })
			.when('/response/afghanistan/drought/dashboard/displaced', {
				// redirectTo: '/response/afghanistan/drought/dashboard/displaced/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
				resolve: {
					access: ['$location', 'ngmUser', function ($location, ngmUser) {
						var user = ngmUser.get();
						if (user.roles.indexOf('SUPERADMIN') !== -1) {
							var url = '/response/afghanistan/drought/dashboard/displaced/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						} else if (user.roles.indexOf('ADMIN') !== -1) {
							var url = '/response/afghanistan/drought/dashboard/displaced/' + moment().year() + '/' + user.cluster_id + '/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						} else {
							var url = '/response/afghanistan/drought/dashboard/displaced/' + moment().year() + '/' + user.cluster_id + '/all/all/' + user.organization_tag + '/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						}
						$location.path(url);
					}]
				}
			})
			// .when('/response/afghanistan/drought/dashboard/all', {
			// 	redirectTo: '/response/afghanistan/drought/dashboard/all/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
			// })
			.when('/response/afghanistan/drought/dashboard/all', {
				// redirectTo: '/response/afghanistan/drought/dashboard/all/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
				resolve: {
					access: ['$location', 'ngmUser', function ($location, ngmUser) {
						var user = ngmUser.get();
						if (user.roles.indexOf('SUPERADMIN') !== -1) {
							var url = '/response/afghanistan/drought/dashboard/all/' + moment().year() + '/all/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						} else if (user.roles.indexOf('ADMIN') !== -1) {
							var url = '/response/afghanistan/drought/dashboard/all/' + moment().year() + '/' + user.cluster_id + '/all/all/all/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						} else {
							var url = '/response/afghanistan/drought/dashboard/all/' + moment().year() + '/' + user.cluster_id + '/all/all/' + user.organization_tag + '/all/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
						}
						$location.path(url);
					}]
				}
			})


			.when('/response/afghanistan/drought/dashboard/:status_plan/:year/:cluster/:province/:district/:organization/:month/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardDroughtCtrl',
				resolve: {
					access: ['ngmAuth', function (ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			
		
	}]);