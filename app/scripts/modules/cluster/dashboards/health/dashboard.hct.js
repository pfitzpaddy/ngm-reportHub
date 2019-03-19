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
			'ngmAuth',
			'ngmData',
			'ngmHctHelper',
			'$translate',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmHctHelper ,$translate) {
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

				// data
				data: ngmHctHelper.getData(),

				// province menu
				getMenu: function(){

					var rows = [],
							menu = [];

					// for each admin1, add to menu
					angular.forEach( $scope.dashboard.data, function( d, key ){
						var path = '#/cluster/health/hct/' + d.id;
						rows.push({
							'title': d.title.toUpperCase(),
							'param': 'province',
							'active': d.id,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': path
						});
					});
					// push on to menu
					menu.push({
						'search': true,
						'id': 'search-health-province',
						'icon': 'location_on',
						'title': 'Province',
						'class': 'teal lighten-1 white-text',
						'rows': rows
					});

					return menu;
				},

				// get metrics 
				getMetricsRequest: function( format, indicator ){
					return {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
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

					// set dashboard
					$scope.dashboard.province = $route.current.params.province;
					var data = $scope.dashboard.data[ $scope.dashboard.province ];

					// districts label
					$scope.dashboard.label = $scope.dashboard.province === 'all' ? 'Total Target Districts' : 'Total Province Districts';

					// calc
					data.target_districts =  $scope.dashboard.province === 'all' ? data.wa_idp_districts : ( data.white_area_districts + data.idp_districts ) - data.wa_idp_districts;
					
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
								'title': 'AFG | HEALTH | ' + data.title.toUpperCase(),
							},
							subtitle: {
								'class': 'col hide-on-small-only s12 report-subtitle truncate',
								'title': 'BPHS ( no TCU ) Q4 2016 & Select Health Cluster Services ( FATP, TCU, MCH, Vacc. ) Q1 2017 in Target Districts ( HRP White Areas 2016 / OCHA IDP Districts 2017 )',
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download Health 4W as PDF',
									url: ngmAuth.LOCATION + '/report/health/hct-2017/pdf/ReportHub-hct-indicators-' + data.id + '.pdf',
									metrics: $scope.dashboard.getMetricsRequest( 'pdf', 'health_hct_' + data.id )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_turned_in',
									hover: 'Download Health 4W as CSV',
									url: ngmAuth.LOCATION + '/report/health/hct-2017/csv/ReportHub_indicators_hct_Q1_2017.csv',
									metrics: $scope.dashboard.getMetricsRequest( 'csv', 'health_hct_' + data.id )
								}]
							}
						},
						menu: $scope.dashboard.getMenu(),
						rows: [{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $scope.dashboard.label,
										data: { value: data.districts }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'White Area Districts ( ' + ( ( data.white_area_districts / data.districts ) * 100 ).toFixed( 0 ) +  '% )',
										data: { value: data.white_area_districts }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'IDP Districts ( ' + ( ( data.idp_districts / data.districts ) * 100 ).toFixed( 0 ) +  '% )',
										data: { value: data.idp_districts }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card blue-grey darken-1 white-text',
									config: {
										display:{ 
											subTitleClass: 'white-text'
										},
										title: 'Both White Area & IDP ( ' + ( ( data.target_districts / data.districts ) * 100 ).toFixed( 0 ) +  '% )',
										data: { value: data.target_districts }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card teal lighten-5 grey-text text-darken-2',
									config: {
										title: 'BPHS ( no TCU ) Districts',
										data: { value: data.bphs_districts }
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card teal lighten-5 grey-text text-darken-2',
									config: {
										title: 'BPHS ( no TCU ) Services Provided',
										data: { value: data.bphs_services }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card blue lighten-4 grey-text text-darken-2',
									config: {
										title: 'Health Cluster ( FATP, TCU, MCH, Vacc. ) Districts',
										data: { value: data.hc_districts }
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card blue lighten-4 grey-text text-darken-2',
									config: {
										title: 'Health Cluster ( FATP, TCU, MCH, Vacc. ) Services Provided',
										data: { value: data.hc_services }
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
													categories: data.categories,
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
													data: data.bphs_data
												},{
													name: 'Health Cluster',
													color: '#64b5f6',
													data: data.hc_data
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

					// override download btn
					// $('.btn-floating').click(function(){
					// 	console.log('hello');
					// })

				}

			};

			// set dashboard with guest user
			$scope.dashboard.setDashboard();

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);