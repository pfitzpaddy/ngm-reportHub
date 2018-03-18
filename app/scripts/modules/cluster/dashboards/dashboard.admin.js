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
			'ngmAuth',
			'ngmData',
			'ngmClusterHelper',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmClusterHelper ) {
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
				startDate: moment( $route.current.params.start) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

				// current report
				report_file_name: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// hq / region
				names:{
					'all': 'ALL',
					'hq': 'HQ',
					'emro': 'EMRO',
					'af': 'AFGHANISTAN',
				},

				menu: [{
					'id': 'search-region',
					'icon': 'person_pin',
					'title': 'Region',
					'class': 'teal lighten-1 white-text',
					'rows': [{
						'title': 'HQ',
						'param': 'adminRpcode',
						'active': 'all',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin'
					},{
						'title': 'AFRO',
						'param': 'adminRpcode',
						'active': 'afro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin/afro'
					},{
						'title': 'EMRO',
						'param': 'adminRpcode',
						'active': 'emro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin/emro'
					}]
				},{
					'id': 'search-country',
					'icon': 'location_on',
					'title': 'Country',
					'class': 'teal lighten-1 white-text',
					'rows': [{
						'title': 'Afghanistan',
						'param': 'admin0pcode',
						'active': 'af',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin/emro/af'
					},{
						'title': 'Ethiopia',
						'param': 'admin0pcode',
						'active': 'et',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin/afro/et'
					},{
						'title': 'Somalia',
						'param': 'admin0pcode',
						'active': 'so',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin/emro/so'
					},{
						'title': 'Syria',
						'param': 'admin0pcode',
						'active': 'so',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/admin/emro/sy'
					}]
				}],

				// lists
				lists: {
					clusters: ngmClusterHelper.getClusters( $route.current.params.admin0pcode ),
				},

				// filtered data
				data: {
					cluster: false,
					admin1: false,
					admin2: false,
				},

				// admin
				getPath: function( cluster_id, report_type, organization_tag ){

					var path = '/cluster/admin/' + $scope.dashboard.adminRpcode.toLowerCase() +
												 '/' + $scope.dashboard.admin0pcode.toLowerCase() +
												 '/' + cluster_id +
												 '/' + organization_tag +
												 '/' + report_type +
												 '/' + $scope.dashboard.startDate +
												 '/' + $scope.dashboard.endDate;

					return path;
				},

        // set URL based on user rights
				setUrl: function(){

					// if ADMIN
					var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.report_type, $scope.dashboard.organization_tag );

					// if current location is not equal to path
					if ( path !== $location.$$path ) {
						//
						$location.path( path );
					}

				},

				// request
				getRequest: function( indicator, list ){

					var request = {
						list: list,
						indicator: indicator,
						cluster_id: $scope.dashboard.cluster_id,
						organization_tag: $scope.dashboard.organization_tag,
						adminRpcode: $scope.dashboard.adminRpcode,
						admin0pcode: $scope.dashboard.admin0pcode,
						report_type: $scope.dashboard.report_type,
						start_date: $scope.dashboard.startDate,
						end_date: $scope.dashboard.endDate
					}

					return request;

				},

				// request
				getCsvRequest: function( obj ){
					var request = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/indicator',
						data: {
							adminRpcode: $scope.dashboard.adminRpcode,
							admin0pcode: $scope.dashboard.admin0pcode,
							admin1pcode: 'all',
							admin2pcode: 'all',
							cluster_id: $scope.dashboard.cluster_id,
							organization_tag: $scope.dashboard.organization_tag,
							beneficiaries: ['all'],
							start_date: '2017-01-01',
							end_date: moment().format( 'YYYY-MM-DD' )
						}
					}

					request.data = angular.merge(request.data, obj);

					return request;
				},

				// request
				getProjectsRequest: function( obj ){
					// constructs like sql query
					var request = {
						query: {
							// dinamically construct
						}
					}

					if ( $scope.dashboard.adminRpcode!=='all' ){
						request.query.adminRpcode = $scope.dashboard.adminRpcode;
					};

					if ( $scope.dashboard.admin0pcode!=='all' ){
						request.query.admin0pcode = $scope.dashboard.admin0pcode;
					};

					if ( $route.current.params.cluster_id!=='all' ){
						request.query.cluster_id = $route.current.params.cluster_id;
					}

					if ( $route.current.params.organization_tag!=='all' ){
						request.query.organization_tag = $route.current.params.organization_tag;
					}

					// query depenging on role
					switch ($scope.dashboard.role){
						case 'ADMIN':
							request.query.cluster_id = $scope.dashboard.cluster_id;
							break;
						case 'USER':
							request.query.organization_tag = $scope.dashboard.organization_tag;
					}

					request = angular.merge(request, obj);

					return request;
				},

				// metrics
				getMetrics: function( type, format ) {

					var request = {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'cluster_admin_' + type + '_' + $scope.dashboard.cluster_id,
								theme: 'cluster_admin_' + type + '_' + $scope.dashboard.cluster_id,
								format: format,
								url: $location.$$path
							}
						}

					return request;

				},

				// menu
				setMenu: function( role ){

					// menu rows
					var clusterRows = [],
						orgRows = [],
						request = {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
							// indicator, list
							data: $scope.dashboard.getRequest( 'organizations', true )
						};

					if ( role === 'super' ){
						// clusters
						$scope.dashboard.lists.clusters.unshift({
							cluster_id: 'all',
							cluster: 'ALL',
						});
						angular.forEach( $scope.dashboard.lists.clusters, function(d,i){

							// admin URL
							var path = $scope.dashboard.getPath( d.cluster_id, $scope.dashboard.report_type, $scope.dashboard.organization_tag );

							// menu rows
							clusterRows.push({
								'title': $scope.dashboard.lists.clusters[i].cluster,
								'param': 'cluster_id',
								'active': d.cluster_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#' + path
							})

						});

						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster',
							'icon': 'camera',
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

							// set organization
							if ( $scope.dashboard.organization_tag !== 'all' ) {
								var org = $filter( 'filter' )( organizations, { organization_tag: $scope.dashboard.organization_tag } );
								if ( org.length ) {
									$scope.dashboard.organization = org[0].organization;
									$scope.dashboard.setTitle();
									$scope.dashboard.setSubtitle();
								}
							}

							// for each
							organizations.forEach(function( d, i ){

								// admin URL
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.report_type, d.organization_tag );

								// menu rows
								orgRows.push({
									'title': d.organization,
									'param': 'organization_tag',
									'active': d.organization_tag,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + path
								});

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
					$scope.dashboard.title = '4W';

					// adminR
					if ( $scope.dashboard.adminRpcode === 'all' ) {
						$scope.dashboard.title += ' | HQ ';
					} else {
						$scope.dashboard.title += ' | ' + $scope.dashboard.adminRpcode.toUpperCase();
					}
					// admin0
					if ( $scope.dashboard.admin0pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.admin0pcode.toUpperCase();
					}
					// cluster
					if ( $scope.dashboard.cluster_id !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.cluster.cluster;
					}
					// org
					if ( $scope.dashboard.organization_tag !== 'all' ) {
						var org = $scope.dashboard.organization ? ' | ' + $scope.dashboard.organization : '';
						$scope.dashboard.title += org;
					}
					// admin1
					// if ( $scope.dashboard.admin1pcode !== 'all' ) {
					// 	$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin1.admin1name;
					// }
					// // admin2
					// if ( $scope.dashboard.admin2pcode !== 'all' ) {
					// 	$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin2.admin2name;
					// }
					// update of rendered title
					if ( $scope.model.header && $scope.model.header.title ){
						$scope.model.header.title.title = $scope.dashboard.title;
					}
				},

				// subtitle
				setSubtitle: function(){
					// subtitle
					$scope.dashboard.subtitle = 'ADMIN Dashboard for ' + $scope.dashboard.adminRpcode.toUpperCase();
					// admin0
					if ( $scope.dashboard.admin0pcode !== 'all' ) {
						$scope.dashboard.subtitle += ' | ' + $scope.dashboard.admin0pcode.toUpperCase();
					}
					// cluster
					if ( $scope.dashboard.cluster_id === 'all' ) {
						$scope.dashboard.subtitle += ', ALL clusters';
					}	else {
						$scope.dashboard.subtitle += ' '+ $scope.dashboard.cluster.cluster.toUpperCase() + ' cluster';
					}
					// org
					if ( $scope.dashboard.organization_tag === 'all' ) {
						$scope.dashboard.subtitle += ', ALL organizations';
					} else {
						var org = $scope.dashboard.organization ? $scope.dashboard.organization : '';
						$scope.dashboard.subtitle += ', ' + org + ' organization';
					}
					// admin1
					// if ( $scope.dashboard.admin1pcode === 'all' ) {
					// 	$scope.dashboard.subtitle += ', ALL Provinces';
					// } else {
					// 	$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.admin1.admin1name.toUpperCase() + ' Province';
					// }
					// // admin2
					// if ( $scope.dashboard.admin2pcode !== 'all' ) {
					// 	$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.admin2.admin2name.toUpperCase() + ' District';
					// }
					// update of rendered title
					if ( $scope.model.header && $scope.model.header.subtitle ){
						$scope.model.header.subtitle.title = $scope.dashboard.subtitle;
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
							'href': '/desk/#' + $scope.dashboard.getPath( $scope.dashboard.cluster_id, 'activity', $scope.dashboard.organization_tag )
						},{
							'title': 'STOCK',
							'param': 'report_type',
							'active': 'stock',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '/desk/#' + $scope.dashboard.getPath( $scope.dashboard.cluster_id, 'stock', $scope.dashboard.organization_tag )
						}]
					});

				},

				// set dashboard
				setDashboard: function(){

					// constants (for now)
					$scope.dashboard.adminRpcode = $route.current.params.adminRpcode;
					$scope.dashboard.admin0pcode = $route.current.params.admin0pcode;
					$scope.dashboard.cluster_id = $route.current.params.cluster_id;
					$scope.dashboard.organization_tag = $route.current.params.organization_tag;
					$scope.dashboard.report_type = $route.current.params.report_type;

					// ADMIN
					if ( $scope.dashboard.user.roles && $scope.dashboard.user.roles.indexOf( 'SUPERADMIN' ) === -1 ) {
						$scope.dashboard.cluster_id = $scope.dashboard.user.cluster_id;
						$scope.dashboard.role = 'ADMIN';
					}
					// USER
					if ( $scope.dashboard.user.roles && $scope.dashboard.user.roles.indexOf( 'SUPERADMIN' ) === -1 && $scope.dashboard.user.roles.indexOf( 'ADMIN' ) === -1 ) {
						$scope.dashboard.organization_tag = $scope.dashboard.user.organization_tag;
						$scope.dashboard.organization = $scope.dashboard.user.organization;
						$scope.dashboard.role = 'USER';
					}

					// report name
					$scope.dashboard.report_file_name += moment().format( 'YYYY-MM-DDTHHmm' );

					// set
					$scope.dashboard.setUrl();
					$scope.dashboard.setCluster();
					$scope.dashboard.setTitle();
					$scope.dashboard.setSubtitle();

					// filename cluster needs to be mpc for cvwg
					// TODO refactor/update cvwg
					$scope.dashboard.cluster_id_filename = $scope.dashboard.cluster_id !== 'cvwg' ? $scope.dashboard.cluster_id : 'mpc'

					if ($route.current.params.organization_tag!=='all'){
						$scope.dashboard.cluster_id_filename = $route.current.params.organization_tag + '_' + $scope.dashboard.cluster_id_filename;
					}

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
									min: '2017-01-01',
									max: $scope.dashboard.endDate,
									currentTime: $scope.dashboard.startDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.startDate ) {
											// set new date
											$scope.dashboard.startDate = date;
											// URL
											var path = $scope.dashboard.getPath( $route.current.params.cluster_id, $route.current.params.report_type, $route.current.params.organization_tag );
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
											var path = $scope.dashboard.getPath( $route.current.params.cluster_id, $route.current.params.report_type, $route.current.params.organization_tag );
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
										url: ngmAuth.LOCATION + '/api/print',
										data: {
											report: $scope.dashboard.report_file_name,
											printUrl: $location.absUrl(),
											downloadUrl: ngmAuth.LOCATION + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1400
										}
									},
									metrics: $scope.dashboard.getMetrics( 'print', 'pdf' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment',
									hover: 'Download Project Summaries as CSV',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/project/getProjects',
										data: $scope.dashboard.getProjectsRequest( { report: $scope.dashboard.cluster_id_filename +'_projects' + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ), csv: true } )
									},
									metrics: $scope.dashboard.getMetrics( 'projects_summary', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_late',
									hover: 'Download ' + $scope.dashboard.report_type.charAt(0).toUpperCase() + $scope.dashboard.report_type.slice(1) + ' Reports ToDo',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
										data: angular.merge( $scope.dashboard.getRequest( 'reports_due', true ), { report: $scope.dashboard.cluster_id_filename + '_' + $scope.dashboard.report_type +'_reports_due_' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ), csv: true } )
									},
									metrics: $scope.dashboard.getMetrics( 'reports_due', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_turned_in',
									hover: 'Download ' + $scope.dashboard.report_type.charAt(0).toUpperCase() + $scope.dashboard.report_type.slice(1) + ' Reports Complete',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
										data: angular.merge( $scope.dashboard.getRequest( 'reports_complete', true ), { report: $scope.dashboard.cluster_id_filename + '_' + $scope.dashboard.report_type + '_reports_complete_' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ), csv: true } )
									},
									metrics: $scope.dashboard.getMetrics( 'reports_complete', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'attach_money',
									hover: 'Download Projects Financials as CSV',
									request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'financial_report', report: $scope.dashboard.cluster_id_filename + '_ocha_financial_report-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
									metrics: $scope.dashboard.getMetrics( 'cluster_financial_report', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'group',
									hover: 'Download Beneficiary Data as CSV',
									request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'beneficiaries', report: $scope.dashboard.cluster_id_filename + '_beneficiary_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
									metrics: $scope.dashboard.getMetrics( 'beneficiary_data', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'show_chart',
									hover: 'Download Stock Data as CSV',
									request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'stocks', report: $scope.dashboard.cluster_id_filename + '_stock_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
									metrics: $scope.dashboard.getMetrics( 'stocks', 'csv' )
								}],
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
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
										user: $scope.dashboard.user,
										cluster_id: $scope.dashboard.cluster_id,
										showTitle: $scope.dashboard.report_type === 'activity' ? true : false,
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
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
										user: $scope.dashboard.user,
										cluster_id: $scope.dashboard.cluster_id,
										showTitle: $scope.dashboard.report_type === 'activity' ? true : false,
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
											url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
											// indicator, list
											data: $scope.dashboard.getRequest( 'reports_complete', true )
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
				$scope.model.menu = $scope.dashboard.menu;
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
