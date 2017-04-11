/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardClusterAdminCtrl
 * @description
 * # DashboardClusterAdminCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardClusterAdminCtrl', [
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
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmData ) {
			this.awesomeThings = [
				'HTML5 Boilerplate',
				'AngularJS',
				'Karma'
			];

			// empty model
			$scope.model = {
				rows: [{}]
			};

			// create dews object
			$scope.dashboard = {
				
				// parent
				ngm: $scope.$parent.ngm,
				
				// current user
				user: ngmUser.get(),

				// report start
				startDate: moment( $route.current.params.start) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),
				
				// current report
				report_file_name: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				clusters: [
					{ cluster_id: 'all', cluster: 'ALL' },
					{ cluster_id: 'eiewg', cluster: 'EiEWG' },
					{ cluster_id: 'esnfi', cluster: 'ESNFI' },
					{ cluster_id: 'fsac', cluster: 'FSAC' },
					{ cluster_id: 'health', cluster: 'Health' },
					{ cluster_id: 'nutrition', cluster: 'Nutrition' },
					{ cluster_id: 'protection', cluster: 'Protection' },
					{ cluster_id: 'rnr_chapter', cluster: 'R&R Chapter' },
					{ cluster_id: 'wash', cluster: 'WASH' }
				],

				names:{
					'all': 'ALL',
					'hq': 'HQ',
					'emro': 'EMRO',
					'af': 'AFGHANISTAN',
				},

				// admin
				getAdminPath: function( cluster_id, report_type, organization ){

					var path = '/cluster/admin/' + $scope.dashboard.adminRpcode.toLowerCase() +
												 '/' + $scope.dashboard.admin0pcode.toLowerCase() +
												 '/' + cluster_id +
												 '/' + report_type +
												 '/' + organization + 
												 '/' + $scope.dashboard.startDate + 
												 '/' + $scope.dashboard.endDate;

					return path;
				},

				// user
				getUserPath: function( cluster_id, organization ){

					var path = '/cluster/admin/' + $scope.dashboard.user.adminRpcode.toLowerCase() +
												 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() +
												 '/' + cluster_id + 
												 '/' + report_type + 
												 '/' + organization + 
												 '/' + $scope.dashboard.startDate + 
												 '/' + $scope.dashboard.endDate;
				},

				// request
				getRequest: function( indicator, list ){

					return {						
						indicator: indicator,
						list: list,
						organization: $scope.dashboard.organization, 
						adminRpcode: $scope.dashboard.adminRpcode,
						admin0pcode: $scope.dashboard.admin0pcode,
						cluster_id: $scope.dashboard.cluster_id,
						report_type: $scope.dashboard.report_type,
						start_date: $scope.dashboard.startDate,
						end_date: $scope.dashboard.endDate,
					}

				},

        		// set URL based on user rights
				setUrl: function(){

					// if ADMIN
					if ( $scope.dashboard.user.roles.indexOf( 'SUPERADMIN' ) !== -1 || $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
						
						// admin URL
						var path = $scope.dashboard.getAdminPath( $scope.dashboard.cluster_id, $scope.dashboard.report_type, $scope.dashboard.organization );

					} else {

						// user URL
						var path = $scope.dashboard.getUserPath( $scope.dashboard.cluster_id, $scope.dashboard.report_type, $scope.dashboard.user.organization_id );
					}
					
					// if current location is not equal to path 
					if ( path !== $location.$$path ) {
						// 
						$location.path( path );
					}

				},

				// set dashboard title
				setTitle: function() {

					var cluster;

					// cluster name
					if ( $scope.dashboard.cluster_id !== 'all' ) {
						var c = $filter( 'filter' )( $scope.dashboard.clusters, { cluster_id: $scope.dashboard.cluster_id } );
						cluster = c[0].cluster;
					} else {
						cluster = 'ALL';
					}

					// title
					$scope.dashboard.title = $scope.dashboard.admin0name.toUpperCase().substring( 0, 3 ) + ' | ';
					$scope.dashboard.title += $scope.dashboard.report_type.toUpperCase() + ' | ';
					$scope.dashboard.title += cluster.toUpperCase() + ' | ';

					// default
					if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
						$scope.dashboard.title += 'ADMIN';
					} else {
						$scope.dashboard.title += $scope.dashboard.organization;
					}

				},

				// set dashboard title
				setSubtitle: function() {
					
					// default
					$scope.dashboard.subtitle = 'Admin dashboard for ' + $scope.dashboard.admin0name + ' ' + $scope.dashboard.cluster_id + ' Cluster';

				},

				setMenu: function( role ){


					// menu rows
					var clusterRows = [],
						orgRows = [],
						request = {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
							// indicator, list
							data: $scope.dashboard.getRequest( 'organizations', true )
						};

					if ( role === 'super' ){
						angular.forEach( $scope.dashboard.clusters, function(d,i){
							
							// admin URL
							var path = $scope.dashboard.getAdminPath( d.cluster_id, $scope.dashboard.report_type, $scope.dashboard.organization );

							// menu rows
							clusterRows.push({
								'title': $scope.dashboard.clusters[i].cluster,
								'param': 'cluster_id',
								'active': d.cluster_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#' + path
							})

						});

						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster',
							'icon': 'person_pin',
							'title': 'Cluster',
							'class': 'teal lighten-1 white-text',
							'rows': clusterRows
						});

					}

					// reports
					$scope.dashboard.setReportMenu();

					// not user
					if( role !== 'user' ){

						// fetch org list
						ngmData.get( request ).then( function( organizations  ){

							// filter
							organizations = $filter( 'orderBy' )( organizations, 'organization' );

							// add all
							organizations.unshift({
								organization_id: 'all',
								organization: 'ALL',
							})

							// for each
							organizations.forEach(function( d, i ){

								// admin URL
								var path = $scope.dashboard.getAdminPath( $scope.dashboard.cluster_id, $scope.dashboard.report_type, d.organization_id );

								// update title to organization
								// if ( $route.current.params.organization_id === d.organization_id && d.organization_id !== 'all' ) {
								// 	$scope.model.header.title.title += ' | ' + d.organization;
								// 	$scope.model.header.subtitle.title += ', ' + d.organization + ' organization';
								// }

								// menu rows
								orgRows.push({
									'title': d.organization,
									'param': 'organization_id',
									'active': d.organization_id,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + path
								})

							});

							// menu
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-organization',
								'icon': 'supervisor_account',
								'title': 'Organization',
								'class': 'teal lighten-1 white-text',
								'rows': orgRows
							});

						});

					}

				},

				setReportMenu: function(){

					// menu
					$scope.model.menu.push({
						'search': false,
						'id': 'search-cluster-report',
						'icon': 'assignment_turned_in',
						'title': 'REPORT',
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'ACTIVITY',
							'param': 'report_type',
							'active': 'activity',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#' + $scope.dashboard.getAdminPath( $scope.dashboard.cluster_id, 'activity', $scope.dashboard.organization )
						},{
							'title': 'STOCKS',
							'param': 'report_type',
							'active': 'stock',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#' + $scope.dashboard.getAdminPath( $scope.dashboard.cluster_id, 'stock', $scope.dashboard.organization )
						}]
					});
					
				},

				// set dashboard
				setDashboard: function(){

					// set cluster
					$scope.dashboard.cluster_id = $scope.dashboard.user.cluster_id;

					// constants (for now)
					if ( $scope.dashboard.user.roles.indexOf( 'SUPERADMIN' ) !== -1 ) {

						// SUPER (later to be eniterly from url)
						$scope.dashboard.adminRpcode = $scope.dashboard.user.adminRpcode;
						$scope.dashboard.adminRname = $scope.dashboard.user.adminRname;
						$scope.dashboard.admin0pcode = $scope.dashboard.user.admin0pcode;
						$scope.dashboard.admin0name = $scope.dashboard.user.admin0name;

						// CLUSTER ID
						$scope.dashboard.cluster_id = $route.current.params.cluster_id;

					} else if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {

						// ADMIN
						$scope.dashboard.adminRpcode = $scope.dashboard.user.adminRpcode;
						$scope.dashboard.adminRname = $scope.dashboard.user.adminRname;
						$scope.dashboard.admin0pcode = $scope.dashboard.user.admin0pcode;
						$scope.dashboard.admin0name = $scope.dashboard.user.admin0name;
					}

					// variables
					$scope.dashboard.report_type = $route.current.params.report_type;
					$scope.dashboard.organization = $route.current.params.organization_id;

					// report name
					$scope.dashboard.report_file_name += moment().format( 'YYYY-MM-DDTHHmm' );
				
					// // set dashboard URL
					$scope.dashboard.setUrl();

					//  set title
					$scope.dashboard.setTitle();

					//  set subtitle
					$scope.dashboard.setSubtitle();
					
					// model
					$scope.model = {
						name: 'cluster_admin_dashboard',
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
											// URL
											var path = $scope.dashboard.getAdminPath( $route.current.params.cluster_id, $route.current.params.report_type, $route.current.params.organization_id ) 

											// '/cluster/admin/' + $route.current.params.adminR + 
											// 										 '/' + $route.current.params.admin0 +
											// 										 '/' + $route.current.params.organization_id +
											// 										 '/' + $scope.dashboard.startDate + 
											// 										 '/' + $scope.dashboard.endDate;

											// update new date
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
											// URL
											var path = $scope.dashboard.getAdminPath( $route.current.params.cluster_id, $route.current.params.report_type, $route.current.params.organization_id );

											// update new date
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
									hover: 'Download Admin as PDF',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/print',
										data: {
											report: $scope.dashboard.report_file_name,
											printUrl: $location.absUrl(),
											downloadUrl: 'http://' + $location.host() + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1400
										}
									},						
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'cluster_admin_' + $scope.dashboard.cluster_id,
											theme: 'cluster_admin_' + $scope.dashboard.cluster_id,
											format: 'pdf',
											url: $location.$$path
										}
									}
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
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											data: $scope.dashboard.getRequest( 'latest', false ),
										},
										templateUrl: '/scripts/widgets/ngm-html/template/cluster.dashboard.admin.html'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Organizations',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'organizations', false )
										}
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Total Reports',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'reports_total', false )
										}
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Reports Completed',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'reports_complete', false )
										}
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Reports Due',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'reports_due', false )
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'table',
									card: 'panel',
									style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
									config: {
										cluster_id: $scope.dashboard.cluster_id,
										style: $scope.dashboard.ngm.style,
										headerClass: 'collection-header red lighten-2',
										headerText: 'white-text',
										headerIcon: 'assignment_late',
										headerTitle: 'Reports Due',
										templateUrl: '/scripts/widgets/ngm-table/templates/cluster/admin.project.list.html',
										tableOptions:{
											count: 10
										},
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'reports_due', true )
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12 remove',
								widgets: [{
									type: 'table',
									card: 'panel',
									style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
									config: {
										cluster_id: $scope.dashboard.cluster_id,
										style: $scope.dashboard.ngm.style,
										headerClass: 'collection-header teal lighten-2',
										headerText: 'white-text',
										headerIcon: 'assignment_turned_in',
										headerTitle: 'Reports Completed',
										templateUrl: '/scripts/widgets/ngm-table/templates/cluster/admin.project.list.html',
										tableOptions:{
											count: 10
										},
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'reports_complete', true )
										}
									}
								}]
							}]
						// },{
						// 	columns: [{
						// 		styleClass: 's12 m12 l12 remove',
						// 		widgets: [{
						// 			type: 'table',
						// 			card: 'panel',
						// 			style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
						// 			config: {
						// 				style: $scope.dashboard.ngm.style,
						// 				headerClass: 'collection-header blue lighten-4',
						// 				headerText: 'grey-text text-darken-2',
						// 				headerIcon: 'assignment',
						// 				headerTitle: 'All Reports',
						// 				templateUrl: '/scripts/widgets/ngm-table/templates/admin.project.list.html',
						// 				tableOptions:{
						// 					count: 10
						// 				},
						// 				request: {
						// 					method: 'POST',
						// 					url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
						// 					data: {
						// 						list: true,
						// 						indicator: 'reports_total',
						// 						organization: $scope.dashboard.organization,
						// 						adminRpcode: $scope.dashboard.adminRpcode,
						// 						admin0pcode: $scope.dashboard.admin0pcode,
						// 						start_date: $scope.dashboard.startDate,
						// 						end_date: $scope.dashboard.endDate
						// 					}
						// 				}
						// 			}
						// 		}]
						// 	}]
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

			// set dashboard
			$scope.dashboard.setDashboard();

			// SUPERADMIN
			if ( $scope.dashboard.user.roles.indexOf( 'SUPERADMIN' ) !== -1 ) {
				$scope.dashboard.setMenu( 'super' );
			} else if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
				// ADMIN
				$scope.dashboard.setMenu( 'admin' );
			} else {
				// USER
				$scope.dashboard.setMenu( 'user' );
			}

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);