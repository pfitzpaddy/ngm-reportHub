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
			'ngmAuth',
			'ngmData', 
			'$translate',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, $translate ) {
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
										+'<div class="col center s12 m4">'
											+'<img src="images/recaptcha.png" width="128px;" title="Agile. Feedback. Development. Repeat." />'
										+'</div>'
										+'<div class="col left s12 m8">'
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
							cluster_id: 'health',
							indicator: indicator,
							start_date: '2016-01-01',
							end_date: '2016-12-31',
							adminRpcode: 'emro',
							admin0pcode: 'af',
							organization_id: 'all',
							admin1pcode: 'all',
							admin2pcode: 'all',
							activity_type: ['all'],
							beneficiary_type: ['all']
						}
					}					
				},

				getAdminRequest: function( indicator ) {
					return {
						method: 'POST',
						url: 'http://reporthub.immap.org/api/cluster/admin/indicator',
						data: {
							cluster_id: 'health',
							indicator: indicator,
							organization: 'all',
							adminRpcode: 'emro',
							admin0pcode: 'af',
							start_date: '2016-01-01',
							end_date: '2016-12-31',
						}
					}
				},

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
					// $scope.dashboard.menu = [{
					// 	'id': 'epr-admin-year',
					// 	'icon': 'help_outline',
					// 	'title': 'PROBLEM',
					// 	'class': 'red lighten-2 white-text',
					// 	'rows': [{},{},{},{},{},{},{},{},{},{},{}]
					// }];
					$scope.dashboard.menu = [{
						'id': 'epr-admin-year',
						'icon': 'help_outline',
						'title': 'PROBLEM',
						'class': 'red lighten-2 white-text',
						'rows': [{
							'title': '1) 2016 People-In-Need ( PIN ) estimates are required'
						},{
							'title': '2) Several copies of the same data exist, collected in multiple local files from multiple partners'
						},{
							'title': '3) Resulting calculations produce 3 different results across 2 different agencies ( Figures A, B & C )'
						},{
							'title': '<div class="center-align grey-text text-darken-2"><i>No surprise billions of dollars have been poured into Afghanistan by the international community and there is limited visibility of progress!</i>'
						}]
					}];

					// title
					$scope.dashboard.title = 'REPORTHUB | 2016';
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
										url: ngmAuth.LOCATION + '/api/print',
										data: {
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: ngmAuth.LOCATION + '/report/',
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
										html: '<a class="waves-effect waves-light btn right" href="#/epr/admin"><i class="material-icons left">cached</i>'+$filter('translate')('reset')+' Dashboard</a>'
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">EMERGENCY HEALTH OUTBREAKS PIN | 2016</h2>'
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">SOLUTION</h2>'
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">ACHIEVEMENTS | 2016</h2>'
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
										data: { value: 3 }
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
										title: 'Reports Submitted',
										display: {
											fractionSize: 0,
											simpleTitle: false,
											subTitlePrefix: 'out of ',
										},										
										request: $scope.dashboard.getAdminRequest( 'reports_complete_total' )
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
										title: 'Services to Beneficiaries Tracked',
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
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">TIMELINE | 2016</h2>'
									}
								}]
							}]
						},{
							// columns: [{
							// 	styleClass: 's12 m12 l12',
							// 	widgets: [{
							// 		type: 'html',
							// 		card: 'card-panel',
							// 		style: 'padding:0px;',
							// 		config: {
							// 			html: '<div style="height:400px;"></div>'
							// 		}
							// 	}]
							// }]
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'highchart',
									card: 'card-panel',
									style: 'padding:0px; height: 240px;',
									config: {
										title: {
											text: ''
										},
										chartConfig: {
											options: {
												chart: {
													type: 'bubble',
													height: 240,
													zoomType: 'x',
													spacing: [ 0, 40, 20, 40 ]
												},
												legend: {
													enabled: false
												},
												tooltip: {
													useHTML: true,
													headerFormat: '<br/>',
													pointFormatter: function(){
														
														// remove ugly tooltip
														$('svg').find('.highcharts-tooltip').remove();

														// remove inline tooltip style
														$('.highcharts-tooltip').find('span').css({ 'font-family': '"Roboto", sans-serif' });

														return '<div class="row">'
																			+ '<div class="card-panel">'
																			+ '<h4 style="font-weight:100;">' + this.name + '</h4>'
																			+ '<h5 style="font-size:1.1rem;font-weight:100;">' + moment( this.x ).format('MMM, YYYY') + '</h5>'
																			+ '<p>' + this.description + '</p>'
																			+ '</div>'
																		+ '</div>';
														
													}
												},
												plotOptions: {
													series: {
														dataLabels: {
															enabled: true,
															format: '{point.name}'
														}
													}
												}
											},
											title: {
												text: '',
												margin: 0
											},
											xAxis: {
												title: {
													text: false
												},
												labels: {
													formatter: function() {
														return moment( this.value ).format('MMM');
													}
												}
											},
											yAxis: {
												title: {
													text: ''
												}
											},
											series: [{
												data: [
													{ x: Date.UTC( 2016, 0, 1 ), y: 0, z: 0, color: '#009688', name: '2016', description: '2016' },
													{ x: Date.UTC( 2016, 1, 12 ), y: 0, z: 10, color: '#fdd835', name: 'CONCEPT', description: 'Proof of Concept for OCHA HRP Reporting Tool Accepted by WHO EHA Team' },
													{ x: Date.UTC( 2016, 2, 1 ), y: 0, z: 10, color: '#009688', name: 'PILOT', description: 'Pilot Implementation' },
													{ x: Date.UTC( 2016, 2, 27 ), y: 0, z: 10, color: '#0288d1', name: 'WORKSHOP', description: 'Health Cluster Orientation Workshop' },
													{ x: Date.UTC( 2016, 3, 1 ), y: 0, z: 10, color: '#009688', name: 'DEVELOPMENT', description: 'Development Based on Health Partner Feedback' },
													{ x: Date.UTC( 2016, 3, 6 ), y: 0, z: 10, color: '#0288d1', name: 'TRAINING', description: 'Health Cluster Training & Focus Groups' },
													{ x: Date.UTC( 2016, 3, 10 ), y: 0, z: 10, color: '#009688', name: 'DEVELOPMENT', description: 'Development Based on Health Partner User Feedback' },
													{ x: Date.UTC( 2016, 4, 1 ), y: 0, z: 10, color: '#fdd835', name: 'MILESTONE', description: 'ReportHub Endorsed by Health Minister as Health Cluster Reporting Tool After Only <b>2 Months</b> in Development' },
													{ x: Date.UTC( 2016, 6, 1 ), y: 0, z: 10, color: '#fdd835', name: 'MILESTONE', description: 'National IMO Extracts Data for OCHA 2nd Quarter Reporting Independantly' },
													{ x: Date.UTC( 2016, 7, 25 ), y: 0, z: 10, color: '#0288d1', name: 'WORKSHOP', description: 'Health Cluster Workshop Data Reporting Workshop' },
													{ x: Date.UTC( 2016, 8, 1 ), y: 0, z: 10, color: '#009688', name: 'DEVELOPMENT', description: 'Development Based on Health Partner User Feedback' },
													{ x: Date.UTC( 2016, 10, 1 ), y: 0, z: 10, color: '#009688', name: 'DEVELOPMENT', description: 'Enhancements to Enable Capability for Global Deployment' },
													{ x: Date.UTC( 2016, 11, 1 ), y: 0, z: 10, color: '#fdd835', name: 'MILESTONE', description: 'Cluster Coordinators Request ReportHub as Reporting Tool for 2017' },
													{ x: Date.UTC( 2017, 0, 1 ), y: 0, z: 0, color: '#009688', name: '2017', description: '2017' },
												]
											}]
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
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 0px; padding-bottom: 5px; font-size: 1.6rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">LOCATIONS | 2016</h2>'
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