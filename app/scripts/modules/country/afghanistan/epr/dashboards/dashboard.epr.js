/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardEprCtrl', [
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
			'ngmEprHelper',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmEprHelper ) {
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
				startDate: moment( $route.current.params.start ) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

				// last update
				updatedAt: '',

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// set dashboard
				setDashboard: function(){

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// set params for service
					ngmEprHelper.setParams({
						url: '#/epr',
						year: $route.current.params.year,
						region: $route.current.params.region,
						province: $route.current.params.province,
						week: $route.current.params.week,
						startDate: $scope.dashboard.startDate,
						endDate: $scope.dashboard.endDate,
						user: $scope.dashboard.user
					});

					// add menu
					$scope.dashboard.menu = ngmEprHelper.getMenu();
					// add province menu
					if ( $route.current.params.region !== 'all' ) {
						$scope.dashboard.menu.push(ngmEprHelper.getProvinceRows());
					}
					// add weeks to menu
					$scope.dashboard.menu.push(ngmEprHelper.getWeekRows());
					
					// model
					$scope.model = {
						name: 'epr_admin_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': ngmEprHelper.getTitle(),
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': ngmEprHelper.getSubtitle(),
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
											var path = '/epr/' + $route.current.params.year + 
																					 '/' + $route.current.params.region + 
																					 '/' + $route.current.params.province + 
																					 '/all' +
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
											var path = '/epr/' + $route.current.params.year + 
																					 '/' + $route.current.params.region + 
																					 '/' + $route.current.params.province + 
																					 '/all' +
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
									hover: 'Download EPR as PDF',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/print',
										data: {
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: ngmAuth.LOCATION + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1280
										}
									},
									metrics: ngmEprHelper.getMetrics( 'epr_print', 'pdf' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment',
									hover: 'Download EPR Data as CSV',
									request: angular.merge({}, ngmEprHelper.getRequest( 'epr/indicator', 'data', false ), { data: { report: $scope.dashboard.report } } ),
									metrics: ngmEprHelper.getMetrics( 'epr_data', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_late',
									hover: 'Download Alerts as CSV',
									request: angular.merge({}, ngmEprHelper.getRequest( 'epr/alerts/data', 'data', false ), { data: { report: 'alerts_' + $scope.dashboard.report } } ),
									metrics: ngmEprHelper.getMetrics( 'epr_alerts', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'new_releases',
									hover: 'Download Incidents as CSV',
									request: angular.merge({}, ngmEprHelper.getRequest( 'epr/disasters/data', 'data', false ), { data: { report: 'disasters_' + $scope.dashboard.report } } ),
									metrics: ngmEprHelper.getMetrics( 'epr_disasters', 'csv' )
								}]
							}							
						},
						menu: $scope.dashboard.menu,
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										id: 'dashboard-btn',
										request: { method: 'GET', url: ngmAuth.LOCATION + '/api/epr/latestUpdate' },
										templateUrl: '/scripts/widgets/ngm-html/template/epr.dashboard.html'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'EPR Reports',
										request: ngmEprHelper.getRequest( 'epr/indicator', 'submitted_reports', false )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">ALERTS</h2>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Alerts',
										request: ngmEprHelper.getRequest( 'epr/alerts/indicator', 'total', false )
									}
								}]
							},{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Cases',
										request: ngmEprHelper.getRequest( 'epr/alerts/indicator', 'cases', false )
									}
								}]
							},{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Deaths',
										request: ngmEprHelper.getRequest( 'epr/alerts/indicator', 'deaths', false )
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
										height: '520px',
										display: {
											type: 'marker'
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
												alerts: {
													name: 'alerts',
													type: 'markercluster',
													visible: true,
													layerOptions: {
															maxClusterRadius: 90
													}
												}
											}
										},				
										request: ngmEprHelper.getRequest( 'epr/alerts/indicator', 'markers', false )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">INCIDENTS</h2>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Incidents',
										request: ngmEprHelper.getRequest( 'epr/disasters/indicator', 'total', false )
									}
								}]
							},{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Casualties',
										request: ngmEprHelper.getRequest( 'epr/disasters/indicator', 'casualties', false )
									}
								}]
							},{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Deaths',
										request: ngmEprHelper.getRequest( 'epr/disasters/indicator', 'deaths', false )
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
										height: '520px',
										display: {
											type: 'marker'
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
												disasters: {
													name: 'disasters',
													type: 'markercluster',
													visible: true,
													layerOptions: {
															maxClusterRadius: 90
													}
												}
											}
										},				
										request: ngmEprHelper.getRequest( 'epr/disasters/indicator', 'markers', false )
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

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);