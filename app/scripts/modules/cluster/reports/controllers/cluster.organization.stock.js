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
			'ngmUser',
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = {
			rows: [{}]
		}

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
				$scope.report.title = $scope.report.definition.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.organization.cluster.toUpperCase() + ' | ' + $scope.report.organization.organization + ' | Stock Report';
				$scope.report.report = $scope.report.organization.organization + '_' + moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY');
				// set report for downloads
				$scope.report.filename = $scope.report.definition.organization + '_' + $scope.report.definition.cluster + '_' + moment( $scope.report.definition.report_month ).format( 'MMMM' ) + '_Stocks_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );

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
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': 'Monthly Stock Report for ' + moment.utc( [ $scope.report.definition.report_year, $scope.report.definition.report_month, 1 ] ).format('MMMM, YYYY')
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download Monthly Stock Report as CSV',
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

		// send request
		$q.all([ $http( $scope.report.getOrganization ), $http( $scope.report.getReport ) ]).then( function( results ){

			// set
			$scope.report.organization = results[0].data;
			$scope.report.definition = results[1].data;

			// assign
			$scope.report.init();

		});

	}]);
