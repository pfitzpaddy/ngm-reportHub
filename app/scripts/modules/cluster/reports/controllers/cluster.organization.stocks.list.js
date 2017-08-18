/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStocksListCtrl
 * @description
 * # ClusterOrganizationStocksListCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterOrganizationStocksListCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', function ($scope, $route, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// org id
		var organization_id = 
				$route.current.params.organization_id ? $route.current.params.organization_id : ngmUser.get().organization_id;

		// init empty model
		$scope.model = {
			rows: [{}]
		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm,
			
			// current user
			user: ngmUser.get(),

			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),

			// get organization
			getOrganization: function( organization_id ){

				// return http
				return {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/getOrganization',
					data: {
						'organization_id': organization_id
					}
				}
			},

			// set project details
			init: function(){

				$scope.report.title = $scope.report.organization.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.organization.cluster.toUpperCase() + ' | ' + $scope.report.organization.organization + ' | Stocks';

				// report dashboard model
				$scope.model = {
					name: 'cluster_organization_stocks',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': 'Stock Reports for ' + $scope.report.organization.organization  + ', ' + $scope.report.organization.admin0name
						}
					},
					rows: [{				
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'organization.stocks.list',
								config: {
									style: $scope.report.ngm.style,
									organization: $scope.report.organization
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'alarm_on',
									color: 'light-blue lighten-4',
									// textColor: 'white-text',
									title: 'Stock Reports ToDo',
									hoverTitle: 'Update',
									icon: 'edit',
									rightIcon: 'watch_later',
									templateUrl: '/scripts/widgets/ngm-list/template/stock.html',
									orderBy: 'reporting_due_date',
									format: true,
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/stock/getReportsList',
										data: {
											filter: { 
												organization_id: $scope.report.organization.id,
												report_active: true,
												report_status: 'todo'
											}
										}
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'done_all',
									color: 'light-blue lighten-4',
									title: 'Stock Reports Complete',
									hoverTitle: 'View',
									icon: 'done',
									rightIcon: 'check_circle',
									templateUrl: '/scripts/widgets/ngm-list/template/stock.html',
									orderBy: '-reporting_due_date',
									format: true,
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/stock/getReportsList',
										data: {
											filter: { 
												organization_id: $scope.report.organization.id,
												report_active: true,
												report_status: 'complete'
											}
										}
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
									html: $scope.report.ngm.footer
								}
							}]
						}]
					}]
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}			

		}

		// run page
		ngmData
			.get( $scope.report.getOrganization( organization_id ) )
			.then( function( organization ){
				
				// set organization
				$scope.report.organization = organization;

				// set page
				$scope.report.init();

			});
		
	}]);