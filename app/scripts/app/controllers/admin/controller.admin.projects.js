/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardLoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardAdminProjectsCtrl', ['$scope', '$location', 'ngmUser', function ( $scope, $location, ngmUser ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// login object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// report start
			startDate: '1990-01-01', //moment($route.current.params.start).format('YYYY-MM-DD'),

			// report end
			endDate: '2018-12-31', //moment($route.current.params.end).format('YYYY-MM-DD'),
			
			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-'

		}

		// report
		$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');		

		// dews dashboard model
		var model = {
			name: 'dashboard_admin_projects',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m8 l8 report-title',
					title: 'Admin Console - Projects',
					style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'All health projects for Afghanistan',
				},
				download: {
					'class': 'col s12 m4 l4 hide-on-small-only',
					downloads: [{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'assignment',
						hover: 'Download Health 4W by Project as CSV',
						request: {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/health/indicator',
							data: {
								report: 'projects_' + $scope.dashboard.report,
								details: 'projects',
								start_date: $scope.dashboard.startDate,
								end_date: $scope.dashboard.endDate,
								project_type: [ 'all' ], // $scope.dashboard.project_type,
								beneficiary_category: [ 'all' ], // $scope.dashboard.beneficiary_category,
								prov_code: '*', // $scope.dashboard.province.id,
								dist_code: '*' // $scope.dashboard.district.id										
							}
						},
						metrics: {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
								username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
								email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public',
								dashboard: 'admin_projects',
								theme: 'health_projects_admin',
								format: 'csv',
								url: $location.$$path
							}
						}
					}]
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'table',
						card: 'panel',
						style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
						config: {
							style: $scope.dashboard.ngm.style,
							templateUrl: '/scripts/widgets/ngm-table/templates/admin.project.list.html',
							tableOptions:{
								count: 10
							},
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/project/getProjectsList',
								data: {
									filter: {}
								}
							}
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