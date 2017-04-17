/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardClusterCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardClusterCtrl', [
			'$scope', 
			'$q', 
			'$http', 
			'$location', 
			'$route',
			'$rootScope',
			'$window', 
			'$timeout', 
			'$filter', 
			'ngmUser', 
			'ngmData',
			'ngmClusterHelper',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmData, ngmClusterHelper ) {
			this.awesomeThings = [
				'HTML5 Boilerplate',
				'AngularJS',
				'Karma'
			];

			// empty model
			$scope.model = {
				menu: [],
				rows: []
			};

			// create dews object
			$scope.dashboard = {
				
				// parent
				ngm: $scope.$parent.ngm,
				
				// current user
				user: ngmUser.get(),

				// report start
				startDate: moment( $route.current.params.start ) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

				// last update
				updatedAt: '',

				// current report
				report: $location.$$path.replace(/\//g, '_') + '-extracted-',

				// lists
				lists: {
					clusters: ngmClusterHelper.getClusters(),
					admin1: localStorage.getObject( 'lists' ).admin1List,
					admin2: localStorage.getObject( 'lists' ).admin2List,
				},

				// filtered data
				data: {
					cluster: false,
					admin1: false,
					admin2: false,
				},

				// 
				getRequest: function( obj ){
					var request = {
						method: 'POST',
						url: 'http://' + $location.host() + '/api/cluster/indicator',
						data: {
							cluster_id: $scope.dashboard.cluster_id,
							organization: $scope.dashboard.organization,
							adminRpcode: $scope.dashboard.adminRpcode,
							admin0pcode: $scope.dashboard.admin0pcode,
							admin1pcode: $scope.dashboard.admin1pcode,
							admin2pcode: $scope.dashboard.admin2pcode,
							beneficiaries: $scope.dashboard.beneficiaries,
							start_date: $scope.dashboard.startDate,
							end_date: $scope.dashboard.endDate
						}
					}

					request.data = angular.merge(request.data, obj);

					return request;
				},

				// metrics
				getMetrics: function( theme, format ){
					return {
						method: 'POST',
						url: 'http://' + $location.host() + '/api/metrics/set',
						data: {
							organization: $scope.dashboard.user.organization,
							username: $scope.dashboard.user.username,
							email: $scope.dashboard.user.email,
							dashboard: 'cluster_dashboard',
							theme: theme,
							format: format,
							url: $location.$$path
						}
					}
				},

				// admin
				getPath: function( cluster_id, organization, admin1pcode, admin2pcode ){

					var path = 'cluster/4w/' + cluster_id +
																'/' + organization +
																'/' + $scope.dashboard.adminRpcode +
																'/' + $scope.dashboard.admin0pcode +
																'/' + admin1pcode +
																'/' + admin2pcode +
																'/' + $scope.dashboard.beneficiaries +
																'/' + $scope.dashboard.startDate +
																'/' + $scope.dashboard.endDate;

					return path;
				},

				setCluster: function(){
					$scope.dashboard.cluster = $filter( 'filter' )( $scope.dashboard.lists.clusters, 
														{ cluster_id: $scope.dashboard.cluster_id }, true )[0]
				},

				// filter
				setAdmin1: function(){
					$scope.dashboard.data.admin1 = $filter( 'filter' )( $scope.dashboard.lists.admin1, 
														{ admin0pcode: $scope.dashboard.admin0pcode.toUpperCase(),
															admin1pcode: $scope.dashboard.admin1pcode }, true )[0];
				},

				setAdmin2: function(){
					$scope.dashboard.data.admin2 = $filter( 'filter' )( $scope.dashboard.lists.admin2, 
														{ admin0pcode: $scope.dashboard.admin0pcode.toUpperCase(),
															admin1pcode: $scope.dashboard.admin1pcode,
															admin2pcode: $scope.dashboard.admin2pcode }, true )[0];
				},

				// 
				setTitle: function(){
					// title
					$scope.dashboard.title = '4W | AFG'; // + $scope.dashboard.user.adminRname.toUpperCase();
					// cluster
					if ( $scope.dashboard.cluster_id !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.cluster.cluster;
					}	
					// org
					if ( $scope.dashboard.organization !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.organization;
					}
					// admin1
					if ( $scope.dashboard.admin1pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin1.admin1name;
					}
					// admin2
					if ( $scope.dashboard.admin2pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin2.admin2name;
					}
				},

				// 
				setSubtitle: function(){
					// subtitle
					$scope.dashboard.subtitle = '4W Dashboard for ';
					// cluster
					if ( $scope.dashboard.cluster_id === 'all' ) {
						$scope.dashboard.subtitle += 'ALL clusters';
					}	else {
						$scope.dashboard.subtitle += $scope.dashboard.cluster.cluster.toUpperCase() + ' cluster';
					}
					// org
					if ( $scope.dashboard.organization === 'ALL' ) {
						$scope.dashboard.subtitle += ', ALL organizations';
					} else {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.organization + ' organization';
					}
					// admin1
					if ( $scope.dashboard.admin1pcode === 'all' ) {
						$scope.dashboard.subtitle += ', ALL Provinces';
					} else {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.admin1.admin1name.toUpperCase() + ' Province';
					}
					// admin2
					if ( $scope.dashboard.admin2pcode !== 'all' ) {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.admin2.admin2name.toUpperCase() + ' District';
					}
				},

				// 
				setMenu: function(){

					// rows
					var orgRows = [],
							clusterRows = [],
							provinceRows = [],
							districtRows = [],
							request = $scope.dashboard.getRequest( { list: true, indicator: 'organizations' } );

					ngmData.get( request ).then( function( organizations  ){

						// clusters
						$scope.dashboard.lists.clusters.unshift({
							cluster_id: 'all',
							cluster: 'ALL',
						});
						angular.forEach( $scope.dashboard.lists.clusters, function(d,i){
							var path = $scope.dashboard.getPath( d.cluster_id, $scope.dashboard.organization, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
							clusterRows.push({
								'title': d.cluster,
								'param': 'cluster_id',
								'active': d.cluster_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#/' + path
							});
						});
						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster-cluster',
							'icon': 'person_pin',
							'title': 'Cluster',
							'class': 'teal lighten-1 white-text',
							'rows': clusterRows
						});

						// organizations
						organizations = $filter( 'orderBy' )( organizations, 'organization' );
						// add all
						organizations.unshift({
							organization_id: 'all',
							organization: 'ALL',
						});
						// organizations
						organizations.forEach(function( d, i ){
							var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, d.organization, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
							orgRows.push({
								'title': d.organization,
								'param': 'organization',
								'active': d.organization,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#/' + path
							});
						});
						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster-organization',
							'icon': 'supervisor_account',
							'title': 'Organization',
							'class': 'teal lighten-1 white-text',
							'rows': orgRows
						});

						// if country selected
						if ( $scope.dashboard.admin0pcode !== 'all' ) {

							// admin1
							var admin1List = $filter( 'filter' )( $scope.dashboard.lists.admin1, { admin0pcode: $scope.dashboard.admin0pcode.toUpperCase() }, true );
							// add all
							admin1List.unshift({
								admin1pcode: 'all',
								admin1name: 'ALL',
							});
							angular.forEach( admin1List, function(d,i){
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.organization, d.admin1pcode, 'all' );
								provinceRows.push({
									'title': d.admin1name,
									'param': 'admin1pcode',
									'active': d.admin1pcode,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#/' + path
								});
							});
							var title = $filter( 'filter' )( $scope.dashboard.lists.admin1, { admin0pcode: $scope.dashboard.admin0pcode.toUpperCase() }, true )[0];
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-admin1',
								'icon': 'location_on',
								'title': title.admin1type_name,
								'class': 'teal lighten-1 white-text',
								'rows': provinceRows
							});

						}

						// if country selected
						if ( $scope.dashboard.admin1pcode !== 'all' ) {

							// admin1
							var admin2List = $filter( 'filter' )( $scope.dashboard.lists.admin2, { admin1pcode: $scope.dashboard.admin1pcode.toUpperCase() }, true );
							// add all
							admin2List.unshift({
								admin2pcode: 'all',
								admin2name: 'ALL',
							});
							angular.forEach( admin2List, function(d,i){
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.organization, $scope.dashboard.admin1pcode, d.admin2pcode );
								districtRows.push({
									'title': d.admin2name,
									'param': 'admin2pcode',
									'active': d.admin2pcode,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#/' + path
								});
							});
							var title = $filter( 'filter' )( $scope.dashboard.lists.admin2, { admin1pcode: $scope.dashboard.admin1pcode.toUpperCase() }, true )[0];
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-admin2',
								'icon': 'location_on',
								'title': title.admin2type_name,
								'class': 'teal lighten-1 white-text',
								'rows': districtRows
							});

						}

					});

				},

				// set dashboard
				init: function(){

					// variables
					$scope.dashboard.cluster_id = $route.current.params.cluster_id;
					$scope.dashboard.organization = $route.current.params.organization;
					$scope.dashboard.adminRpcode = $route.current.params.adminRpcode;
					$scope.dashboard.admin0pcode = $route.current.params.admin0pcode;
					$scope.dashboard.admin1pcode = $route.current.params.admin1pcode;
					$scope.dashboard.admin2pcode = $route.current.params.admin2pcode;
					$scope.dashboard.beneficiaries = $route.current.params.beneficiaries.split('+');

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// set
					$scope.dashboard.setCluster();
					$scope.dashboard.setAdmin1();
					$scope.dashboard.setAdmin2();
					$scope.dashboard.setTitle();
					$scope.dashboard.setSubtitle();
					$scope.dashboard.setMenu();
					
					// model
					$scope.model = {
						name: 'cluster_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $scope.dashboard.title,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': $scope.dashboard.subtitle,
							},
							datePicker: {
								'class': 'col s12 m4 l3',
								dates: [{
									style: 'float:left;',
									label: 'from',
									format: 'd mmm, yyyy',
									max: $scope.dashboard.endDate,
									currentTime: $scope.dashboard.startDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.startDate ) {
											// set new date
											$scope.dashboard.startDate = date;
											var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.organization, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
											$location.path( path );
										}
									}
								},{
									style: 'float:right',
									label: 'to',
									format: 'd mmm, yyyy',
									min: $scope.dashboard.startDate,
									currentTime: $scope.dashboard.endDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.endDate ) {
											// set new date
											$scope.dashboard.endDate = date;
											var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.organization, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
											$location.path( path );
										}
									}
								}]
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download Dashboard as PDF',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/print',
										data: {
											report:  $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: 'http://' + $location.host() + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1280
										}
									},
									metrics: $scope.dashboard.getMetrics( 'cluster_dashboard_pdf', 'pdf' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'call',
									hover: 'Download Cluster Contact List as CSV',
									request: $scope.dashboard.getRequest( { csv: true, indicator: 'contacts', report: $scope.dashboard.cluster_id + '_contacts_list-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
									metrics: $scope.dashboard.getMetrics( 'cluster_contact_list', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_turned_in',
									hover: 'Download OCHA HRP Report as CSV',
									request: $scope.dashboard.getRequest( { csv: true, indicator: 'ocha_report', report: $scope.dashboard.cluster_id + '_ocha_hrp_report-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
									metrics: $scope.dashboard.getMetrics( 'cluster_contact_list', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment',
									hover: 'Download Beneficiary Data as CSV',
									request: $scope.dashboard.getRequest( { csv: true, indicator: 'beneficiaries', report: $scope.dashboard.cluster_id + '_beneficiary_data-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
									metrics: $scope.dashboard.getMetrics( 'Beneficiary_data', 'csv' )
								}]
							}							
						},
						menu: [],
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										id: 'dashboard-btn',
										request: { method: 'GET', url: 'http://' + $location.host() + '/api/cluster/latestUpdate' },
										templateUrl: '/scripts/widgets/ngm-html/template/cluster.dashboard.html'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Active Organizations',
										request: $scope.dashboard.getRequest( { indicator: 'organizations' } )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Beneficiaries',
										request: $scope.dashboard.getRequest( { indicator: 'beneficiaries' } )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'leaflet',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										height: '490px',
										display: {
											type: 'marker',
											zoomToBounds: true,
										},
										defaults: {
											zoomToBounds: true
										},
										layers: {
											baselayers: {
												osm: {
													name: 'Mapbox',
													type: 'xyz',
													url: 'https://b.tiles.mapbox.com/v4/aj.um7z9lus/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
													layerOptions: {
														continuousWorld: true
													}
												}
											},								
											overlays: {
												projects: {
													name: 'Projects',
													type: 'markercluster',
													visible: true,
													layerOptions: {
															maxClusterRadius: 90
													}
												}
											}
										},
										request: $scope.dashboard.getRequest( { indicator: 'markers' } )
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
					}

				}

			};

			// if lists
			if ( $scope.dashboard.lists.admin1 ) {
				
				// set dashboard
				$scope.dashboard.init();

			}

			// if none
			if ( !$scope.dashboard.lists.admin1 ) {

				// lists
				var requests = {
					getAdmin1List: { method: 'GET', url: 'http://' + $location.host() + '/api/location/getAdmin1List' },
					getAdmin2List: { method: 'GET', url: 'http://' + $location.host() + '/api/location/getAdmin2List' }
				}

				// send request
				$q.all([ 
					$http( requests.getAdmin1List ),
					$http( requests.getAdmin2List ) ] ).then( function( results ){

						// admin1, admin2, activities object
						var lists = { admin1List: results[0].data, admin2List: results[1].data };

						// storage
						localStorage.setObject( 'lists', lists );

						// set dashboard
						$scope.dashboard.init();

					});
			}

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);