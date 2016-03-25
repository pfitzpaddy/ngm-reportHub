/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardScreenCtrl', ['$scope', 'ngmUser', function ($scope, ngmUser) {
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
			name: 'dashboard_admin',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: 'ReportHub | User Guide | Screencasts',
					style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'View screencasts on how to use the ReportHub',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'form.video',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
						config: {
							style: $scope.dashboard.ngm.style,
							title: 'Registration',
							url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/afg_health_cluster_project_details.mp4'
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'form.video',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
						config: {
							style: $scope.dashboard.ngm.style,
							title: 'Password Reset',
							url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/afg_health_cluster_project_details.mp4'
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