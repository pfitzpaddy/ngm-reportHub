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
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

        // set URL based on user rights
				setUrl: function(){

					// if not admin - set organization
					if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
						
						// user URL
						var path = '/cluster/admin/' + $scope.dashboard.user.adminRpcode.toLowerCase() +
																 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() +
																 '/' + $route.current.params.organization_id + 
																 '/' + $scope.dashboard.startDate + 
																 '/' + $scope.dashboard.endDate;
					} else {
						
						// user URL
						var path = '/cluster/admin/' + $scope.dashboard.user.adminRpcode.toLowerCase() +
																 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() +
																 '/' + $scope.dashboard.user.organization_id + 
																 '/' + $scope.dashboard.startDate + 
																 '/' + $scope.dashboard.endDate;
					}
					
					// if current location is not equal to path 
					if ( path !== $location.$$path ) {
						// 
						$location.path( path );
					}

				},

				// set dashboard title
				setTitle: function() {

					// title
					$scope.dashboard.title = $scope.dashboard.user.admin0name.toUpperCase().substring( 0, 3 ) + ' | ';
					$scope.dashboard.title += $scope.dashboard.user.cluster.toUpperCase() + ' | ';

					// default
					if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
						$scope.dashboard.title += 'ADMIN';
					} else {
						$scope.dashboard.title += $scope.dashboard.user.organization;
					}

				},

				// set dashboard title
				setHealthTitle: function() {

					// default
					$scope.dashboard.title = $scope.dashboard.user.adminRname;

					// admin0
					if ( $route.current.params.admin0 !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.user.admin0name.toUpperCase().substring(0, 3);
					}

					// title ( if no admin )
					if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
						$scope.dashboard.title += ' | ADMIN';
					} else {
						$scope.dashboard.title += ' | ' + $scope.dashboard.user.organization;
					}

				},

				// set dashboard title
				setSubtitle: function() {
					
					// default
					$scope.dashboard.subtitle = 'Admin dashboard for ' + $scope.dashboard.user.admin0name + ' ' + $scope.dashboard.user.cluster + ' Cluster';

				},

				setMenu: function(){

					// menu rows
					var rows = [],
							request = {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/cluster/admin/indicator',
								data: {
									cluster_id: $scope.dashboard.user.cluster_id,
									indicator: 'organizations',
									list: true,
									organization: $scope.dashboard.organization, 
									adminRpcode: $scope.dashboard.adminRpcode,
									admin0pcode: $scope.dashboard.admin0pcode,
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
								}
							};

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

							// path
							var path = '#/cluster/admin/' + $scope.dashboard.user.adminRpcode.toLowerCase() +
																			 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() +
																			 '/' + d.organization_id + 
																			 '/' + $scope.dashboard.startDate + 
																			 '/' + $scope.dashboard.endDate;

							// update title to organization
							if ( $route.current.params.organization_id === d.organization_id && d.organization_id !== 'all' ) {
								$scope.model.header.title.title += ' | ' + d.organization;
								$scope.model.header.subtitle.title += ', ' + d.organization + ' organization';
							}

							// menu rows
							rows.push({
								'title': d.organization,
								'param': 'organization_id',
								'active': d.organization_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': path
							})

						});

						// menu
						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster-organization',
							'icon': 'supervisor_account',
							'title': 'Organization',
							'class': 'teal lighten-1 white-text',
							'rows': rows
						});						

					});

				},

				// set dashboard
				setDashboard: function(){

					// variables
					$scope.dashboard.organization = $route.current.params.organization_id;
					$scope.dashboard.adminRpcode = $route.current.params.adminR;
					$scope.dashboard.admin0pcode = $route.current.params.admin0;

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );
				
					// set dashboard URL
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
											var path = '/cluster/admin/' + $route.current.params.adminR + 
																					 '/' + $route.current.params.admin0 +
																					 '/' + $route.current.params.organization_id +
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

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
											var path = '/cluster/admin/' + $route.current.params.adminR + 
																					 '/' + $route.current.params.admin0 +
																					 '/' + $route.current.params.organization_id +
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

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
											report: $scope.dashboard.report,
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
											dashboard: 'cluster_admin',
											theme: 'cluster_admin',
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
								styleClass: 's12 m12 l12 remove',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										id: 'dashboard-btn',
										html: '<a class="waves-effect waves-light btn right" href="#/cluster/admin" title="GoTo Current Reporting Month"><i class="material-icons left">cached</i>Current Reporting Month</a>'
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
											data: {
												cluster_id: $scope.dashboard.user.cluster_id,
												indicator: 'organizations',
												organization: $scope.dashboard.organization,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate
											}
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
											data: {
												cluster_id: $scope.dashboard.user.cluster_id,
												indicator: 'reports_total',
												organization: $scope.dashboard.organization,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate
											}
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
											data: {
												cluster_id: $scope.dashboard.user.cluster_id,
												indicator: 'reports_complete',
												organization: $scope.dashboard.organization,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate
											}
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
											data: {
												cluster_id: $scope.dashboard.user.cluster_id,
												indicator: 'reports_due',
												organization: $scope.dashboard.organization,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate
											}
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
											data: {
												cluster_id: $scope.dashboard.user.cluster_id,
												indicator: 'reports_due',
												list: true,
												organization: $scope.dashboard.organization,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate
											}
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
											data: {
												cluster_id: $scope.dashboard.user.cluster_id,
												indicator: 'reports_complete',
												list: true,
												organization: $scope.dashboard.organization,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate
											}
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

			// set dashboard menu
			// if not admin - set organization
			if ( $scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1 ) {
				$scope.dashboard.setMenu();
			}

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);