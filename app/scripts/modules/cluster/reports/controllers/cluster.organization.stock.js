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
			'ngmData',
			'ngmUser', 
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmData, ngmUser ) {
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
				url: 'http://' + $location.host() + '/api/getOrganization',
				data: {
					'organization_id': $route.current.params.organization_id
				}
			},

			// get report
			getReport: {
				method: 'POST',
				url: 'http://' + $location.host() + '/api/cluster/stock/getReport',
				data: {
					id: $route.current.params.report_id
				}
			},

			// set project details
			init: function(){

				// set report for downloads
				$scope.report.report = $scope.report.organization.organization + '_' + moment( $scope.report.definition.reporting_period ).format('MMMM, YYYY');

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
							title: ngmUser.get().admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.organization.cluster.toUpperCase() + ' | ' + $scope.report.organization.organization + ' | Stock Report'
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': 'Monthly Stock Report for ' + moment( $scope.report.definition.reporting_period ).format('MMMM, YYYY')
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