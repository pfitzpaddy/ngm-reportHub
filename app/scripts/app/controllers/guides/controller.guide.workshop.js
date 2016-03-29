/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardWorkshopCtrl', ['$scope', '$location', 'ngmUser', function ($scope, $location, ngmUser) {
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

		// username
		$scope.dashboard.username = ngmUser.get() ? ' ' + ngmUser.get().username : '';

		// dews dashboard model
		var model = {
			name: 'dashboard_guide_workshop',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: 'ReportHub | Workshop',
					style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'Register for a ReportHub workshop below. If there are no suitable options please contact <a href="mailto:ngmreporthub@gmail.com">ngmReportHub@gmail.com</a>',
				}
			},
			rows: [{	
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'ngm.workshop',
						config: {
							style: $scope.dashboard.ngm.style,
							templateUrl: '/views/app/guides/workshop.html',
							request: {
								method: 'GET',
								url: 'http://' + $location.host() + '/api/health/workshop/get'
							}
						}
					}]
				}]
			},{			
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: 90px; padding-top:10px;',
						config: {
							html: $scope.dashboard.ngm.footer
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