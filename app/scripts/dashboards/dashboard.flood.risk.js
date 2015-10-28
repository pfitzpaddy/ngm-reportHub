'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardFloodRiskCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardFloodRiskCtrl', ['$scope', '$http', '$location', '$route', 'appConfig', 'ngmUser', function ($scope, $http, $location, $route, appConfig, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// floodRisk object
		$scope.floodRisk = {

			// current user
			user: ngmUser.getUser(),

			// data lookup
			data: {
				'kabul': {'id':1,'name':'Kabul'},
				'kapisa': {'id':2,'name':'Kapisa'},
				'parwan': {'id':3,'name':'Parwan'},
				'wardak': {'id':4,'name':'Wardak'},
				'logar': {'id':5,'name':'Logar'},
				'nangarhar': {'id':6,'name':'Nangarhar'},
				'laghman': {'id':7,'name':'Laghman'},
				'panjsher': {'id':8,'name':'Panjsher'},
				'baghlan': {'id':9,'name':'Baghlan'},
				'bamyan': {'id':10,"name":'Bamyan'},
				'ghazni': {'id':11,'name':'Ghazni'},
				'paktya': {'id':12,'name':'Paktya'},
				'kunar': {'id':13,'name':'Kunar'},
				'nuristan': {'id':14,'name':'Nuristan'},
				'badakhshan': {'id':15,'name':'Badakhshan'},
				'takhar': {'id':16,'name':'Takhar'},
				'kunduz': {'id':17,'name':'Kunduz'},
				'balkh': {'id':18,'name':'Balkh'},
				'samangan': {'id':19,'name':'Samangan'},
				'sar-e-pul': {'id':20,'name':'Sar-e-Pul'},
				'ghor': {'id':21,'name':'Ghor'},
				'daykundi': {'id':22,'name':'Daykundi'},
				'uruzgan': {'id':23,'name':'Uruzgan'},
				'zabul': {'id':24,'name':'Zabul'},
				'paktika': {'id':25,'name':'Paktika'},
				'khost': {'id':26,'name':'Khost'},
				'jawzjan': {'id':27,'name':'Jawzjan'},
				'faryab': {'id':28,'name':'Faryab'},
				'badghis': {'id':29,'name':'Badghis'},
				'hirat': {'id':30,'name':'Hirat'},
				'farah': {'id':31,'name':'Farah'},
				'hilmand': {'id':32,'name':'Hilmand'},
				'kandahar': {'id':33,'name':'Kandahar'},
				'nimroz': {'id':34,'name':'Nimroz'},
				'afghanistan': {'id':35,'name':'Afghanistan'},
			},

			// rows for floodRisk menu
			getRows: function() {
				
				// menu rows
				var rows = [];

				// for each disease
				angular.forEach($scope.floodRisk.data, function(d, key){
					rows.push({
						'title': d.name,
						'class': 'waves-effect waves-teal',
						'param': 'province',
						'active': key,
						'href': '#/drr/flood/' + key
					});
				});

				return rows;
			}
		}

		// FloodRisk dashboard model
		var model = {
			header: {
				div: {
					'class': 'report-header',
					style: 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					title: $scope.floodRisk.data[$route.current.params.province].name,
					style: 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'report-subtitle',
					title: 'Flood Risk Key Indicators for ' + $scope.floodRisk.data[$route.current.params.province].name,
				},
			},
			menu: [{
				title: 'Afghanistan',
				// href: '#/flood-risk/afghanistan',
				class: 'collapsible-header waves-effect waves-teal',
				rows: $scope.floodRisk.getRows()
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l6',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Total Population',
							display: {
								// icon: 'accessibility',
								// iconClass: 'light-blue-text light-blue-lighten-4'
							},
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/flood/risk',
								data: {
									indicator: 'total-popn',
									metric: 'popn',
									prov_code: $scope.floodRisk.data[$route.current.params.province].id
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l6',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white light-blue-text light-blue-lighten-4',
						config: {
							title: 'at Flood Risk',
							display: {
								postFix: '%',
								fractionSize: 2,
								simpleTitle: false
							},
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/flood/risk',
								data: {
									indicator: 'total',
									metric: 'popn',
									prov_code: $scope.floodRisk.data[$route.current.params.province].id
								}
							}
						}
					}]	
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'highchart',
						style: 'height: 180px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Low Flood Risk Population',
							display: {
								label: true,
								x: 106,
								y: 72,
								color:'#616161',
								labelColor: 'silver',
								fontSize: '2.1rem',
								labelSize: '1.2rem'
							},
							chartConfig: {
								options: {
									chart: {
										type: 'pie',
										height: 140
									},
									exporting: {
										enabled: false
									},
									tooltip: {
										enabled: false
									}				
								},
								title: {
										text: '',
										margin: 0
								},
								plotOptions: {
										pie: {
												shadow: false
										}
								},
								series: [{
										name: 'Flood Risk',
										request: {
											method: 'POST',
											url: appConfig.host + ':1337/flood/risk/chart',
											data: {
												indicator: 'low',
												metric: 'popn',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
												name: 'Low Flood Risk Population'
											}											
										},
										size: '100%',
										innerSize: '80%',
										showInLegend:false,
										dataLabels: {
												enabled: false
										}
								}]												
							}
						}
					}]					
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'highchart',
						style: 'height: 180px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Moderate Flood Risk Population',
							display: {
								label: true,
								x: 106,
								y: 72,
								color:'#616161',
								labelColor: 'silver',
								fontSize: '2.1rem',
								labelSize: '1.2rem'
							},						
							chartConfig: {
								options: {
									chart: {
										type: 'pie',
										height: 140
									},
									exporting: {
										enabled: false
									},
									tooltip: {
										enabled: false
									}
								},
								title: {
										text: '',
										margin: 0
								},
								plotOptions: {
										pie: {
												shadow: false
										}
								},								
								series: [{
										name: 'Flood Risk',
										request: {
											method: 'POST',
											url: appConfig.host + ':1337/flood/risk/chart',
											data: {
												indicator: 'moderate',
												metric: 'popn',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
												name: 'Moderate Flood Risk Population',
												color: '#ffea00'
											}											
										},
										size: '100%',
										innerSize: '80%',
										showInLegend:false,
										dataLabels: {
												enabled: false
										}
								}]								
							}							
						}
					}]					
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'highchart',
						style: 'height: 180px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'High Flood Risk Population',
							display: {
								label: true,
								x: 106,
								y: 72,
								color:'#616161',
								labelColor: 'silver',
								fontSize: '2.1rem',
								labelSize: '1.2rem'
							},					
							chartConfig: {
								options: {
									chart: {
										type: 'pie',
										height: 140
									},
									exporting: {
										enabled: false
									},
									tooltip: {
										enabled: false
									}									
								},
								title: {
									text: '',
									margin: 0
								},
								plotOptions: {
										pie: {
												shadow: false
										}
								},							
								series: [{
										name: 'Flood Risk',
										request: {
											method: 'POST',
											url: appConfig.host + ':1337/flood/risk/chart',
											data: {
												indicator: 'high',
												metric: 'popn',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
												name: 'High Flood Risk Population',
												color: '#dd2c00'
											}	
										},
										size: '100%',
										innerSize: '80%',
										showInLegend:false,
										dataLabels: {
												enabled: false
										}
								}]								
							}							
						}
					}]	
				}]
			}]
		};

		$scope.name = 'floodRisk_dashboard';
		$scope.model = model;

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard = $scope.model;
		
	}]);