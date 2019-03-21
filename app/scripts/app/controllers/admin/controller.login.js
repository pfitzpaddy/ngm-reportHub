/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardLoginCtrl', ['$scope','$translate','$filter', function ($scope, $translate,$filter) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];


		// login object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm

		}

		// 
		$scope.dashboard.ngm.style.paddingHeight = 20;

		// dews dashboard model
		var model = {
			name: 'dashboard_login',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
					//title: '{{"Welcome" | translate}}'
					title: $filter('translate')('welcome'),
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					html: true,
					title: $filter('translate')('welcome_to')+' ReportHub<span class="hide-on-med-and-down">, '+$filter('translate')('please_login_or_register_to_continue')+'</span>'
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
							templateUrl: '/scripts/app/views/authentication/login.html'
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