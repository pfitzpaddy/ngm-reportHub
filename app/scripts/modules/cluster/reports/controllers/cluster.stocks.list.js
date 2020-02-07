/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStocksListCtrl
 * @description
 * # ClusterOrganizationStocksListCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterOrganizationStocksListCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser','$translate','$filter', function ($scope, $route, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser,$translate,$filter) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// org id
		var organization_id =
				$route.current.params.organization_id ? $route.current.params.organization_id : ngmUser.get().organization_id;
		// year
		var year = $route.current.params.year ? $route.current.params.year : moment().year();

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

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
			setYearMenu: function () {
				startYear = moment($scope.report.organization.createdAt).year();
				var yearRow = [];
				url = $route.current.params.organization_id ? '#/cluster/stocks/organization/' + $route.current.params.organization_id+'/':'#/cluster/stocks/'
				for (year = startYear; year <= moment().year(); year++) {
					year_obj = {
						'title': year,
						'param': 'year',
						'active': year,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + year
					}
					yearRow.push(year_obj)
				}
				$scope.model.menu.push({
					'id': 'search-sector',
					'icon': 'date_range',
					'title': $filter('translate')('year'),
					'class': 'teal lighten-1 white-text',
					'rows':yearRow})
			},
			// set project details
			init: function(){

				// title
				$scope.report.title = $scope.report.organization.organization + ' | ' + $scope.report.organization.admin0name.toUpperCase().substring(0, 3) + ' | Stocks' + ' | ' + year;

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
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': $filter('translate')('stock_reports_for')+ ' ' + $scope.report.organization.organization  + ', ' + $scope.report.organization.admin0name+ ' '+year
						}
					},
					menu: [],
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
									title: $filter('translate')('stock_reports_todo'),
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
												report_status: 'todo',
												report_year: parseInt(year)
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
									title: $filter('translate')('stock_reports_complete'),
									hoverTitle: 'View',
									icon: 'done',
									rightIcon: 'check_circle',
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
												report_status: 'complete',
												report_year: parseInt(year)
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
									// html: $scope.report.ngm.footer
									templateUrl: '/scripts/widgets/ngm-html/template/footer.html',
									lightPrimaryColor: $scope.ngm.style.lightPrimaryColor,
									defaultPrimaryColor: $scope.ngm.style.defaultPrimaryColor,
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
				$scope.report.setYearMenu();
			});

	}]);
