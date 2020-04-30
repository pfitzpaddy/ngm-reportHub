/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStockReportCtrl
 * @description
 * # ClusterOrganizationStockReportCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterOrganizationStockReportCtrl', [
			'$scope',
			'$route',
			'$q',
			'$http',
			'$location',
			'$anchorScroll',
			'$timeout',
			'ngmAuth',
			'ngmData',
			'ngmUser','$translate','$filter', 'ngmClusterLists',
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser, $translate, $filter, ngmClusterLists ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;
		
		// empty Project
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm,

			// placeholder
			organization: {},

			// placeholder
			definition: {},

			// current user
			user: ngmUser.get(),

			// report name placeholder (is updated below)
			report: 'stock_report',

			// get organization
			getOrganization: {
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/getOrganization',
				data: {
					'organization_id': $route.current.params.organization_id
				}
			},

			// get report
			getReport: {
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/stock/getReport',
				data: {
					id: $route.current.params.report_id
				}
			},

			// set project details
			init: function(){

				// set report for downloads
				$scope.report.title = $scope.report.organization.organization + ' | ' + $scope.report.definition.admin0name.toUpperCase().substring(0, 3) + ' | '+$filter('translate')('stock_report');
				$scope.report.report = $scope.report.organization.organization + '_' + moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY');
				// set report for downloads
				$scope.report.filename = $scope.report.definition.organization  + '_' + moment( $scope.report.definition.report_month ).format( 'MMMM' ) + '_Stocks_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );

				// report dashboard model
				$scope.model = {
					name: 'cluster_stock_report',
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
							'class': 'col s12 m12 l12 report-subtitle truncate',
							'title': $filter('translate')('monthly_stock_report_for')+ ' ' + moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY')
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: $filter('translate')('donwload_monthly_stock_report_as_csv'),
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/report/getReportCsv',
									data: {
										report: $scope.report.filename,
										report_type: 'stock',
										report_id: $scope.report.definition.id
									}
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.title,
										theme: 'monthly_stock_report' + $scope.report.user.cluster_id,
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'client',
								color: 'blue lighten-2',
								icon: 'description',
								hover: $filter('translate')('download_stock_lists'),
								request: {
									filename: 'stock_lists' + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) + '.xlsx',
									mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
									function: function () {
										let lists = ngmClusterLists.getStockLists($scope.report.organization.admin0pcode);

										// XLSX processing
										const workbook = new ExcelJS.Workbook();

										let worksheetStockItems = workbook.addWorksheet('Stock Items');
										let worksheetLocations = workbook.addWorksheet('Locations');
										let worksheetUnits = workbook.addWorksheet('Units');
										let worksheetStatus = workbook.addWorksheet('Status');
										let worksheetPurpose = workbook.addWorksheet('Purpose');
										let worksheetPopulationGroups = workbook.addWorksheet('Targeted Groups');

										// xlsx headers
										worksheetStockItems.columns = [
											{ header: 'Cluster', key: 'cluster', width: 10 },
											{ header: 'Stock Type', key: 'stock_item_name', width: 30 },
											{ header: 'Details', key: 'details', width: 30 }
										];

										worksheetLocations.columns = [
											{ header: 'Country', key: 'admin0name', width: 30 },
											{ header: 'Admin1 Pcode', key: 'admin1pcode', width: 30 },
											{ header: 'Admin1 Name', key: 'admin1name', width: 30 },
											{ header: 'Admin2 Pcode', key: 'admin2pcode', width: 30 },
											{ header: 'Admin2 Name', key: 'admin2name', width: 30 },
											{ header: 'Admin3 Pcode', key: 'admin3pcode', width: 30 },
											{ header: 'Admin3 Name', key: 'admin3name', width: 30 },
											{ header: 'Location Name', key: 'site_name', width: 30 }
										];

										worksheetUnits.columns = [
											{ header: 'Units', key: 'unit_type_name', width: 10 }
										];

										worksheetStatus.columns = [
											{ header: 'Type', key: 'stock_type_name', width: 10 },
											{ header: 'Status', key: 'stock_status_name', width: 10 }
										];

										worksheetPurpose.columns = [
											{ header: 'Purpose', key: 'stock_item_purpose_name', width: 10 }
										];

										worksheetPopulationGroups.columns = [
											{ header: 'Targeted Group', key: 'stock_targeted_groups_name', width: 10 }
										];

										// add rows
										worksheetStockItems.addRows(lists.stocks);

										let locations = $scope.report.organization.warehouses	? $scope.report.organization.warehouses : [];

										worksheetLocations.addRows(locations);
										worksheetUnits.addRows(lists.units);
										worksheetStatus.addRows(lists.stock_status);
										worksheetPurpose.addRows(lists.stock_item_purpose);
										worksheetPopulationGroups.addRows(lists.stock_targeted_groups);

										// return buffer
										return workbook.xlsx.writeBuffer();

									},
									metrics: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/metrics/set',
										data: {
											organization: $scope.report.user.organization,
											username: $scope.report.user.username,
											email: $scope.report.user.email,
											dashboard: $scope.report.title,
											theme: 'monthly_stock_report_lists_' + $scope.report.user.cluster_id,
											format: 'xlsx',
											url: $location.$$path
										}
									}
								}
							}]
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'organization.stock',
								config: {
									style: $scope.report.ngm.style,
									organization: $scope.report.organization,
									report: $scope.report.definition
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
				setTimeout(() => {
					$('.fixed-action-btn').floatingActionButton({ direction: 'left' });
				}, 0);

			}

		}

		// send request
		$q.all([ $http( $scope.report.getOrganization ), $http( $scope.report.getReport ) ]).then( function( results ){

			// set
			$scope.report.organization = results[0].data;
			$scope.report.definition = results[1].data;

			// assign
			$scope.report.init();

		});

	}]);
