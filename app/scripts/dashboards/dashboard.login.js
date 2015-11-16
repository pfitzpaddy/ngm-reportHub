'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardLoginCtrl', ['$scope', '$http', '$location', '$route', 'appConfig', 'ngmAuth', 'ngmUser', function ($scope, $http, $location, $route, appConfig, ngmAuth, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// login object
		$scope.login = {

			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			submitLogin: true,

			// single submit btn/function for login or register
			submit: function() {

				console.log('login');

				// if login flag is true
				// if ($scope.login.submitLogin) {

				// 	// check login object and submit
				// 	if (Object.keys($scope.login.user).length !== 0) {
						
				// 		ngmAuth.login($scope.login.user).success(function(result) {
				// 			$location.path( '/' + $scope.ngm.style.home );
				// 		}).error(function(err) {
				// 			// 
				// 		});
				// 	}

				// } else {
					
				// 	// check login object and register
				// 	if (Object.keys($scope.login.register).length !== 0) {

				// 		ngmAuth.register($scope.login.register).success(function(result) {
				// 			$location.path( '/' + $scope.ngm.style.home );
				// 		}).error(function(err) {
				// 			// 
				// 		});
				// 	}
				// }
			}			

		}

		// window height minus header minus footer minus padding
		// $scope.login.height = $scope.login.ngm.height - 160 - 10;

		// dews dashboard model
		var model = {
			header: {
				div: {
					'class': 'report-header',
					style: 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					title: 'Welcome',
					style: 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'report-subtitle',
					title: 'Welcome to Report Hub, please login to continue data entry tasks or navigate to the report pages to view the latest key indicators',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.login.height + 'px;',
						config: {
							style: $scope.login.ngm.style,
							template: 'widgets/ngm-html/template/login.html'
						}
					}]
				}]
			}]
		};

		$scope.name = 'login';
		$scope.model = model;

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard = $scope.model;
		
	}]);