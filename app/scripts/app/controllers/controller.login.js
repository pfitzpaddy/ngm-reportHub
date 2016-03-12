/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardLoginCtrl', ['$scope', function ($scope) {
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
					title: 'Welcome'
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					html: true,
					title: 'Welcome to ReportHub<span class="hide-on-small-only">, please login to continue data entry tasks or navigate to the dashboard pages to view the latest key indicators</span>',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
						config: {
							style: $scope.dashboard.ngm.style,
							templateUrl: '/scripts/widgets/ngm-html/template/login.html'
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