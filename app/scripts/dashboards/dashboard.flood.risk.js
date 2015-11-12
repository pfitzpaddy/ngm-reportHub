'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardFloodRiskCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardFloodRiskCtrl', ['$scope', '$http', '$route', 'appConfig', 'ngmUser', function ($scope, $http, $route, appConfig, ngmUser) {
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
				'afghanistan': {'id':35,'name':'Afghanistan'},
				'nimroz': {'id':34,'name':'Nimroz'},
				'farah': {'id':31,'name':'Farah'},
				'hilmand': {'id':32,'name':'Hilmand'},
				'jawzjan': {'id':27,'name':'Jawzjan'},
				'kandahar': {'id':33,'name':'Kandahar'},
				'ghazni': {'id':11,'name':'Ghazni'},
				'paktika': {'id':25,'name':'Paktika'},
				'paktya': {'id':12,'name':'Paktya'},
				'kunduz': {'id':17,'name':'Kunduz'},
				'logar': {'id':5,'name':'Logar'},
				'hirat': {'id':30,'name':'Hirat'},
				'baghlan': {'id':9,'name':'Baghlan'},
				'kunar': {'id':13,'name':'Kunar'},
				'nangarhar': {'id':6,'name':'Nangarhar'},
				'uruzgan': {'id':23,'name':'Uruzgan'},
				'laghman': {'id':7,'name':'Laghman'},
				'balkh': {'id':18,'name':'Balkh'},
				'khost': {'id':26,'name':'Khost'},
				'kapisa': {'id':2,'name':'Kapisa'},
				'sar-e-pul': {'id':20,'name':'Sar-e-Pul'},
				'takhar': {'id':16,'name':'Takhar'},
				'badghis': {'id':29,'name':'Badghis'},
				'zabul': {'id':24,'name':'Zabul'},
				'wardak': {'id':4,'name':'Wardak'},
				'faryab': {'id':28,'name':'Faryab'},
				'bamyan': {'id':10,"name":'Bamyan'},
				'samangan': {'id':19,'name':'Samangan'},
				'panjsher': {'id':8,'name':'Panjsher'},
				'parwan': {'id':3,'name':'Parwan'},
				'ghor': {'id':21,'name':'Ghor'},
				'daykundi': {'id':22,'name':'Daykundi'},
				'nuristan': {'id':14,'name':'Nuristan'},
				'badakhshan': {'id':15,'name':'Badakhshan'},
				'kabul': {'id':1,'name':'Kabul'},
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
						'href': '#/immap/drr/flood/' + key
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
				title: 'Flood Risk',
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
								// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
								data: {
									indicator: 'total-popn',
									metric: 'popn',
									prov_code: $scope.floodRisk.data[$route.current.params.province].id //,
									//headers: {'Authorization': 'Bearer ' + token}									
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
								// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
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
								fractionSize: 1,
								subLabelfractionSize: 0,
								postFix: '%'
							},
							chartConfig: {
								options: {
									chart: {
										type: 'pie',
										height: 140,
			              margin: [0, 0, 0, 0],
			              spacingTop: 0,
			              spacingBottom: 0,
			              spacingLeft: 0,
			              spacingRight: 0
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
											url: appConfig.host + ':1337/flood/risk/type',
											// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
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
								fractionSize: 1,
								subLabelfractionSize: 0,
								postFix: '%'
							},
							chartConfig: {
								options: {
									chart: {
										type: 'pie',
										height: 140,
			              margin: [0, 0, 0, 0],
			              spacingTop: 0,
			              spacingBottom: 0,
			              spacingLeft: 0,
			              spacingRight: 0
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
											url: appConfig.host + ':1337/flood/risk/type',
											// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
											data: {
												indicator: 'moderate',
												metric: 'popn',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
												name: 'Moderate Flood Risk Population',
												// color: '#ffea00'
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
								fractionSize: 1,
								subLabelfractionSize: 0,
								postFix: '%'
							},	
							chartConfig: {
								options: {
									chart: {
										type: 'pie',
										height: 140,
			              margin: [0, 0, 0, 0],
			              spacingTop: 0,
			              spacingBottom: 0,
			              spacingLeft: 0,
			              spacingRight: 0
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
											url: appConfig.host + ':1337/flood/risk/type',
											// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
											data: {
												indicator: 'high',
												metric: 'popn',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
												name: 'High Flood Risk Population',
												// color: '#dd2c00'
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
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'highchart',
						style: 'height: 380px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Flood Risk by Land Type',
							chartConfig: {
								options: {
									chart: {
										type: 'bar',
										height: 340,
									},
									tooltip: {
										pointFormat: '<b>{point.y:,.0f} km sq</b>'
									},
					        legend: {
					            enabled: false
					        }																	
								},
								title: {
									text: ''
								},
        				xAxis: {
            			type: 'category',
            			labels: {
                		rotation: 0,
                		style: {
                    	fontSize: '12px',
                    	fontFamily: 'Roboto, sans-serif'
                		}
            			}
        				},
				        yAxis: {
				            min: 0,
				            title: {
				                text: 'Area (km sq)'
				            }
				        },
				        series: [{
				            name: 'totalArea',
				            color: '#78909c',
										request: {
											method: 'POST',
											url: appConfig.host + ':1337/flood/risk/area',
											// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
											data: {
												indicator: 'total',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
											}	
										}
				        },{
				            name: 'floodRiskArea',
				            color: '#7cb5ec',
										request: {
											method: 'POST',
											url: appConfig.host + ':1337/flood/risk/area',
											// headers: { 'Authorization': 'Bearer ' + $scope.floodRisk.user.token },
											data: {
												indicator: 'floodRisk',
												prov_code: $scope.floodRisk.data[$route.current.params.province].id,
											}	
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