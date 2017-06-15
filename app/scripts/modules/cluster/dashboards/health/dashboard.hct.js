/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'DashboardHctCtrl', [
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

				// get metrics 
				getMetricsRequest: function( format, indicator ){
					return {
						method: 'POST',
						url: 'http://' + $location.host() + '/api/metrics/set',
						data: {
							cluster_id: 'health',
							organization: $scope.dashboard.user.organization,
							username: $scope.dashboard.user.username,
							email: $scope.dashboard.user.email,
							dashboard: 'health_hct',
							theme: indicator,
							format: format,
							url: $location.$$path
						}
					}
				},

				// set dashboard
				setDashboard: function(){
					
					// model
					$scope.model = {
						name: 'health_4w_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': 'AFG | HEALTH | NANGARHAR',
							},
							subtitle: {
								'class': 'col hide-on-small-only s12 report-subtitle truncate',
								'title': 'BPHS ( no TCU ) & Select Health Cluster services ( FATP, TCU, MCH, Vacc. ) in Target Districts ( HRP White Areas 2016 / OCHA IDP Districts 2017 ) of Nangarhar',
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download Health 4W as PDF',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/print',
										data: {
											cluster_id: 'health',
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: 'http://' + $location.host() + '/report/',
											user: $scope.dashboard.user,
											viewportWidth: 1490,
											pageLoadTime: 4000
										}
									},
									metrics: $scope.dashboard.getMetricsRequest( 'pdf', 'health_4w' )
								}]
							}
						},
						menu: [],
						rows: [{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Districts',
										data: { value: 22 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'White Area Districts ( 36% )',
										data: { value: 8 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'IDP Districts ( 36% )',
										data: { value: 8 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Target Districts ( 63% )',
										data: { value: 14 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'BPHS ( no TCU ) Districts',
										data: { value: 13 }
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'BPHS ( no TCU ) Services Provided',
										data: { value: 1353 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Health Cluster ( FATP, TCU, MCH, Vacc. ) Districts',
										data: { value: 6 }
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Health Cluster ( FATP, TCU, MCH, Vacc. ) Services Provided',
										data: { value: 8269 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'highchart',
									card: 'card-panel',
									style: 'padding:10px; height: 340px;',
									config: {
										title: {
											text: ''
										},
										chartConfig: {
											options: {
												chart: {
														type: 'bar',
														height: 330
												},										    
												legend: {
													layout: 'vertical',
													align: 'right',
													verticalAlign: 'top',
													x: -40,
													y: 40,
													floating: true,
													borderWidth: 0,
													backgroundColor: ( (Highcharts.theme && Highcharts.theme.legendBackgroundColor ) || '#FFFFFF'),
													shadow: true
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
																			+ '<h4 style="font-weight:100;">' + this.category + '</h4>'
																			+ '<h5 style="font-weight:100;">' + this.series.name + '</h5>'
																			+ '<h5 style="font-weight:100;">' + this.y.toLocaleString() + ' Services</h5>'
																			+ '</div>'
																		+ '</div>';
														
													}
												}
											 },
												title: {
													text: '',
													margin: 10
												},
												xAxis: {
													gridLineWidth:0,
													categories: [
														'Bat-e-Kot',
														'Behsud',
														'Deh Bala',
														'Hesarak',
														'Jalalabad',
														'Mohmand Darah',
														'Pacheer Wagaam',
														'Rodat',
														'Shinwar',
														'Shirzad'     
													],
													title: {
															text: null
													}
												},
												yAxis: {
													gridLineWidth:0,
													min: 0,
													title: {
															text: 'Services Provided',
															align: 'high'
													},
													labels: {
															overflow: 'justify'
													}
												},
												series: [{
													name: 'BPHS',
													color: '#80cbc4',
													data: [ 1, 0, 12, 23, 1056, 3, 42, 8, 193, 15 ]
												},{
													name: 'Health Cluster',
													color: '#64b5f6',
													data: [ 290, 109, 0, 0, 7335, 107, 0, 291, 137, 0 ]
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

			// set dashboard with guest user
			$scope.dashboard.setDashboard();

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);