/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterAppCtrl
 * @description
 * # ClusterAppCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'ClusterAppCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper','$translate','$filter', function ( $scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper,$translate,$filter ) {
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
		};

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// org id
			organization_id: organization_id,			

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

			// 
			init: function(){

				// set model titles
				$scope.report.title = $scope.report.organization.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.organization.cluster.toUpperCase() + ' | ' + $scope.report.organization.organization;
				$scope.report.subtitle = $scope.report.organization.organization + ' ' + $filter('translate')('overview_for')+' '+ $scope.report.organization.admin0name;

				// report dashboard model
				$scope.model = {
					name: 'cluster_organization',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: $scope.report.subtitle
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									user: $scope.report.user,
									organization: $scope.report.organization,
									// get project href
									getProjectsHref: function() {
										var href = '#/cluster/projects';
										if ( $route.current.params.organization_id ) { href += '/' + $route.current.params.organization_id }
										return href;
									},
									// get project href
									getStocksHref: function() {
										var href = '#/cluster/stocks';
										if ( $route.current.params.organization_id ) { href += '/' + $route.current.params.organization_id }
										return href;
									},
									report_date: moment().subtract( 1, 'M').endOf( 'M' ).format('YYYY-MM-DD'),
									templateUrl: '/scripts/modules/cluster/views/cluster.organization.html',
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

		// get data
		ngmData
			.get( $scope.report.getOrganization( organization_id ) )
			.then( function( organization ){
				
				// set organization
				$scope.report.organization = organization;

				// set page
				$scope.report.init();

			});
		
	}]);
