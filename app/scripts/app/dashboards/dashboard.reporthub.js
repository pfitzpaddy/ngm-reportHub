/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardReportHubCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardReportHubCtrl', [
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

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// agile html graphic
				getAgileHtml: function(){

					return '<div class="row" style="padding:10px;">'
										+'<div class="col s12 m4 center">'
											+'<img src="images/recaptcha.png" width="30%" title="Agile. Feedback. Development. Repeat." />'
										+'</div>'
										+'<div class="col s12 m8 left">'
											+'<div>'
												+'<h4>Agile</h4>'
												+'<h5 style="font-size:1.6rem;">Feedback. Development. Repeat.</h5>'
											+'</div>'
										+'</div>'

									+'</div>'
				},

				// get request from health api
				getHealthRequest: function( indicator ){
					
					return {
						method: 'POST',
						url: 'http://reporthub.immap.org/api/health/indicator',
						data: {
							indicator: indicator,
							start_date: '2016-01-01',
							end_date: moment().format('YYYY-MM-DD'),
							adminRpcode: 'EMRO',
							admin0pcode: 'AF',
							organization_id: 'all',
							admin1pcode: 'all',
							admin2pcode: 'all',
							project_type: ['all'],
							beneficiary_type: ['all']
						}
					}					
				},

				getAdminRequest: function( indicator ) {
					return {
						method: 'POST',
						url: 'http://reporthub.immap.org/api/health/admin/indicator',
						data: {
							indicator: indicator,
							start_date: '2016-01-01',
							end_date: moment().format('YYYY-MM-DD'),
							adminRpcode: 'EMRO',
							admin0pcode: 'AF',
							organization: 'all',
						}
					}
				},
				
				// total reports holder
				totalReports: 240,

				// get total reports
				setTotalReports: function() {
					
					// request
					ngmData
						.get( $scope.dashboard.getAdminRequest( 'reports_total' ) )
						.then( function( response ){
							// set
							$scope.dashboard.totalReports = response.data;
						});
				},

				// set dashboard
				setDashboard: function(){

					// add menu
					$scope.dashboard.menu = [{
						'id': 'epr-admin-year',
						'icon': 'help_outline',
						'title': 'PROBLEM',
						'class': 'red lighten-2 white-text',
						'rows': [{},{},{},{},{},{},{},{},{},{},{}]
					}];

					// title
					$scope.dashboard.title = 'REPORTHUB | ACHIEVEMENTS';
					$scope.dashboard.subtitle = 'ReportHub summary and achievements for 2016';
					// set total reports
					$scope.dashboard.setTotalReports();
					// report name ( export )
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// model
					$scope.model = {
						name: 'reporthub_achievements_dashboard',
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
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download EPR as PDF',
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
									}
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
										html: '<a class="waves-effect waves-light btn right" href="#/epr/admin"><i class="material-icons left">cached</i>Reset Dashboard</a>'
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">EMERGENCY HEALTH OUTBREAKS PIN 2016</h2>'
									}
								}]
							}]
						},{							
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Figure A',
										data: { value: 648332 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Figure B',
										data: { value: 643132 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Figure C',
										data: { value: 693732 }
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">APPROACH</h2>'
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
										html: $scope.dashboard.getAgileHtml()
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">ACHIEVEMENTS</h2>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Months Development',
										data: { value: 2 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Workshops',
										data: { value: 2 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Focus Groups',
										data: { value: 4 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Total Health Cluster Partners',
										request: $scope.dashboard.getHealthRequest( 'partners' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Total Health Cluster Projects',
										request: $scope.dashboard.getHealthRequest( 'projects' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Reports Submitted ( out of ' + $scope.dashboard.totalReports + ' )',
										request: $scope.dashboard.getAdminRequest( 'reports_complete' )
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
										title: 'Total Beneficiaries',
										request: $scope.dashboard.getHealthRequest( 'beneficiaries' )
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">TIMELINE</h2>'
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
										html: '<div style="height:400px;"></div>'
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">LOCATIONS</h2>'
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
											// zoomCorrection: -3
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
													// url: 'https://api.tiles.mapbox.com/v4/fitzpaddy.b207f20f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
													layerOptions: {
														continuousWorld: true
													}
												}
											},								
											overlays: {
												health: {
													name: 'Health',
													type: 'markercluster',
													visible: true,
													layerOptions: {
															maxClusterRadius: 90
													}
												}
											}
										},
										request: $scope.dashboard.getHealthRequest( 'markers' )
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