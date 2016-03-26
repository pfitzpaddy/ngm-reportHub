/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardGuidesScreenCtrl', ['$scope', 'ngmUser', function ($scope, ngmUser) {
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
					title: 'ReportHub | Screencasts',
					style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'View screencasts using ReportHub',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'white grey-text text-darken-2',
						style: 'padding: 20px;',
						config: {
							html: '<a class="waves-effect waves-light btn" href="#/health/guides"><i class="material-icons left">keyboard_return</i>Back to Guides Menu</a>'
						}
					}]
				}]
			},{				
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'ngm.video',
						card: 'card-panel',
						style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
						config: {
							style: $scope.dashboard.ngm.style,
							video:[{
								id: 'registration',
								title: 'Registration',
								description: 'ReportHub registration is easy!',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_registration.mov'
							},{
								id: 'password_reset',
								title: 'Password Reset',
								description: 'Forgot your password?',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_reset_password.mov'
							},{
								id: 'navigation',
								title: 'Navigation',
								description: 'Explore ReportHub using the Navigation Menu',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_navigation.mov'
							},{
								id: 'new_project',
								title: 'New Project',
								description: 'Create a new health project in ReportHub',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_new_project.mov'
							},{
								id: 'project_financials',
								title: 'Project Financials',
								description: 'Track your projects financial items',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_financial_summary.mov'
							},{
								id: 'updated_project',
								title: 'Update Project',
								description: 'Its possible to update your project and include new locations',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_edit_project.mov'
							},{
								id: 'complete_project',
								title: 'Complete Project',
								description: 'Finished your project? Mark it as complete',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_complete_project.mov'
							},{
								id: 'dashboard',
								title: 'Project 4W Dashboard',
								description: 'See the progress of your Health Cluster and filter projects on the 4W dashboard',
								url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/health_cluster_ReportHub_dashboard.mov'
							}]
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