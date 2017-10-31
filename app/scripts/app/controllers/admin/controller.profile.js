/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardProfileCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardProfileCtrl', ['$scope', function ($scope) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// login object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm,

			// user
			user: $scope.$parent.ngm.getUser()

		}

		// 
		$scope.dashboard.ngm.style.paddingHeight = 20;

		// dews dashboard model
		var model = {
			name: 'dashboard_profile',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
					title: 'Profile'
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					html: true,
					title: $scope.dashboard.user.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.dashboard.user.cluster.toUpperCase() + ' | ' + $scope.dashboard.user.organization + ' | ' + $scope.dashboard.user.username,
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l8 offset-l2',
					widgets: [{
						type: 'form.authentication',
						card: 'card-panel z-depth-2',
						style: 'padding:0px;',
						config: {
							style: $scope.dashboard.ngm.style,
							// user: $scope.dashboard.user,
							templateUrl: '/scripts/app/views/authentication/profile.html'
						}
					}]
				}]
			}]
		};

		// assign model to scope
		$scope.model = model;

		// assign to ngm app scope
		$scope.dashboard.ngm.dashboard = $scope.model;
		
	}]);