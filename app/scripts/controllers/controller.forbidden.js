/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardForbiddenCtrl', ['$scope', 'ngmUser', function ($scope, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// login object
		$scope.forbidden = {

			// parent
			ngm: $scope.$parent.ngm

		}

		// panel height = window height - header - padding
		$scope.forbidden.ngm.style.height = $scope.forbidden.ngm.height - 160 - 10;
		// panel padding = panel height - form height - footer - padding
		$scope.forbidden.ngm.style.paddingHeight = ($scope.forbidden.ngm.style.height - 347 - 60 - 20) < 10 ? 10 : ($scope.forbidden.ngm.style.height - 347 - 60 - 20);
		// get username (if available)
		$scope.forbidden.username = ngmUser.get() ? ' ' + ngmUser.get().username : '';

		// dews dashboard model
		var model = {
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.forbidden.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: 'Forbidden!',
					style: 'color: ' + $scope.forbidden.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'Sorry' + $scope.forbidden.username + ' you are not authorized to access this page, please contact the administrator',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.forbidden.ngm.style.height + 'px;',
						config: {
							style: $scope.forbidden.ngm.style,
							template: 'widgets/ngm-html/template/forbidden.html'
						}
					}]
				}]
			}]
		};

		$scope.name = 'forbidden';
		$scope.model = model;

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard = $scope.model;
		
	}]);