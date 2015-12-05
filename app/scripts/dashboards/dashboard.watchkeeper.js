'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardWatchkeeperCtrl', ['$scope', '$http', '$location', '$route', 'appConfig', 'ngmUser', function ($scope, $http, $location, $route, appConfig, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		if ($scope.$parent.ngm.dashboard.model 
				&& $scope.$parent.ngm.dashboard.model.name === 'immap_watchkeeper_dashboard') {
			// set dashboard local $scope from $parent
			$scope.dashboard = $scope.$parent.ngm.dashboard.config;
			$scope.model = $scope.$parent.ngm.dashboard.model;
		} else {
			// create dews object
			$scope.dashboard = {

				// parent
				ngm: $scope.$parent.ngm,

				// current user
				user: ngmUser.get(),

				// start date = now - 1 month
				startDate: new Date('1 November, 2015'),
				
				// end date = now
				endDate: new Date('30 November, 2015'),

				// data lookup
				data: {
					country: {
						africa: {'id':'*','name':'Africa'},
						algeria: {'id':'Algeria','name':'Algeria'},
						angola: {'id':'Angola','name':'Angola'},
						benin: {'id':'Benin','name':'Benin'},
						botswana: {'id':'Botswana','name':'Botswana'},
						'burkina-faso': {'id':'Burkina Faso','name':'Burkina Faso'},
						burundi: {'id':'Burundi','name':'Burundi'},
						cameroon: {'id':'Cameroon','name':'Cameroon'},
						car: {'id':'Central African Republic','name':'Central African Republic'},
						chad: {'id':'Chad','name':'Chad'},
						drc: {'id':'Democratic Republic of Congo','name':'Democratic Republic of Congo'},
						djibouti: {'id':'Djibouti','name':'Djibouti'},
						egypt: {'id':'Egypt','name':'Egypt'},
						'equatorial-guinea': {'id':'Equatorial Guinea','name':'Equatorial Guinea'},
						eritrea: {'id':'Eritrea','name':'Eritrea'},
						ethiopia: {'id':'Ethiopia','name':'Ethiopia'},
						gabon: {'id':'Gabon','name':'Gabon'},
						gambia: {'id':'Gambia','name':'Gambia'},
						ghana: {'id':'Ghana','name':'Ghana'},
						guinea: {'id':'Guinea','name':'Guinea'},
						'guinea-bissau': {'id':'Guinea-Bissau','name':'Guinea-Bissau'},
						'ivory-coast': {'id':'Ivory Coast','name':'Ivory Coast'},
						kenya: {'id':'Kenya','name':'Kenya'},
						lesotho: {'id':'Lesotho','name':'Lesotho'},
						liberia: {'id':'Liberia','name':'Liberia'},
						libya: {'id':'Libya','name':'Libya'},
						madagascar: {'id':'Madagascar','name':'Madagascar'},
						malawi: {'id':'Malawi','name':'Malawi'},
						mali: {'id':'Mali','name':'Mali'},
						mauritania: {'id':'Mauritania','name':'Mauritania'},
						morocco: {'id':'Morocco','name':'Morocco'},
						mozambique: {'id':'Mozambique','name':'Mozambique'},
						namibia: {'id':'Namibia','name':'Namibia'},
						niger: {'id':'Niger','name':'Niger'},
						nigeria: {'id':'Nigeria','name':'Nigeria'},
						congo: {'id':'Republic of Congo','name':'Republic of Congo'},
						rwanda: {'id':'Rwanda','name':'Rwanda'},
						senegal: {'id':'Senegal','name':'Senegal'},
						'sierra-leone': {'id':'Sierra Leone','name':'Sierra Leone'},
						somalia: {'id':'Somalia','name':'Somalia'},
						'south-africa': {'id':'South Africa','name':'South Africa'},
						'south-sudan': {'id':'South Sudan','name':'South Sudan'},
						sudan: {'id':'Sudan','name':'Sudan'},
						swaziland: {'id':'Swaziland','name':'Swaziland'},
						tanzania: {'id':'Tanzania','name':'Tanzania'},
						togo: {'id':'Togo','name':'Togo'},
						tunisia: {'id':'Tunisia','name':'Tunisia'},
						uganda: {'id':'Uganda','name':'Uganda'},
						zambia: {'id':'Zambia','name':'Zambia'},
						zimbabwe: {'id':'Zimbabwe','name':'Zimbabwe'}
					}
				}, 

				getMenu: function(){
					var rows = [],
						menu = [{
						'title': 'Location',
						'class': 'collapsible-header waves-effect waves-teal z-depth-1',
						'rows': []
					}];

					//
					angular.forEach($scope.dashboard.data.country, function(d, key){
						//
						rows.push({
							'title': d.name,
							'class': 'waves-effect waves-teal',
							'param': 'country',
							'active': key,
							'href': '#/immap/watchkeeper/' + key
						});
					});

					// assign
					menu[0].rows = rows;			

					return menu;
				}
			}
		}

		// set dashboard params
		$scope.dashboard.country = $scope.dashboard.data.country[$route.current.params.country];
		$scope.dashboard.title = 'iMMAP | ' + $scope.dashboard.country.name;
		$scope.dashboard.subtitle = 'Watchkeeper Security Key Indicators for ' + $scope.dashboard.country.name;

		// calendar heatmap legend (colors) 
		if ($scope.dashboard.country.id === '*') {
			$scope.dashboard.legend = [20,40,60,80,100];
		} else {
			$scope.dashboard.legend = [2,4,6,8,10];
		}

		// dews dashboard model
		$scope.model = {
			name: 'immap_watchkeeper_dashboard',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					'style': 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m8 l8 report-title',
					'style': 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
					'title': $scope.dashboard.title,
				},
				subtitle: {
					'class': 'col hide-on-small-only m8 l9 report-subtitle',
					title: $scope.dashboard.subtitle,
				},
				datePicker: {
					'class': 'col s12 m4 l3',
					dates: [{
						'class': 'ngm-date',
						style: 'float:left;',
						label: 'from',
						format: 'd mmm, yyyy',
						max: $scope.dashboard.endDate,
						time: $scope.dashboard.startDate,
						onSelection: function(){
							
							// for calendar
							var startDateYear;

							// set date
							$scope.dashboard.startDate = new Date(this.time);
							startDateYear = new Date(moment($scope.dashboard.startDate).subtract(1, 'years').format());
							
							// updated config
							var update = { 'broadcast': 'dateChange', 'config' : { 
								'request': { 'data': { 'start_date': $scope.dashboard.startDate } } 
							} };
							var updateYear = { 'broadcast': 'dateChangeYear', 'config' : { 
								'options': { 'start': startDateYear },
								'request': { 'data': { 'start_date': startDateYear } }
							} };

							// update widget
							$scope.model.updateWidgets(update);
							$scope.model.updateWidgets(updateYear);

						}
					},{
						'class': 'ngm-date',
						style: 'float:right',
						label: 'to',
						format: 'd mmm, yyyy',
						min: $scope.dashboard.startDate,
						time: $scope.dashboard.endDate,
						onSelection: function(){
							
							// set date
							$scope.dashboard.endDate = new Date(this.time);

							// updated config
							var update = { 'broadcast': 'dateChange', 'config' : { 'request': { 'data': { 'end_date': $scope.dashboard.endDate } } } };

							// update widget								
							$scope.model.updateWidgets(update);

						}
					}]
				}
			},
			menu: $scope.dashboard.getMenu(),
			rows: [{
				columns: [{
					styleClass: 's12 m12 l3',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Incident Velocity',
							display: {
								postfix: '%',
								fractionSize: 2
							},
							request: {
								method: 'POST',
								url: appConfig.host + '/wk/difference',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									country: $scope.dashboard.country.id
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l3',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Riots / Protests',
							request: {
								method: 'POST',
								url: appConfig.host + '/wk/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									country: $scope.dashboard.country.id,
									indicator: 'Riots/Protests'
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l3',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Other',
							request: {
								method: 'POST',
								url: appConfig.host + '/wk/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									country: $scope.dashboard.country.id,
									indicator: 'other'
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l3',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Deaths',
							request: {
								method: 'POST',
								url: appConfig.host + '/wk/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									country: $scope.dashboard.country.id,
									indicator: 'fatalities'
								}
							}
						}
					}]
				}],
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'calHeatmap',
						card: 'card-panel',
						style: 'padding-top:5px;',
						broadcast: 'dateChangeYear',
						config: {
							style: 'margin-top: -12px;',
							title: {
								style: 'padding-top: 10px;',
								name: $scope.dashboard.country.name + ' - 1 Year Timeline'
							},
							options: {
								start: new Date(moment($scope.dashboard.startDate).subtract(1, 'years').format()),
								itemName: 'incident',
								legend: $scope.dashboard.legend
							},
							request: {
								method: 'POST',
								url: appConfig.host + '/wk/calendar',
								data: {
									start_date: new Date(moment($scope.dashboard.startDate).subtract(1, 'years').format()),
									end_date: $scope.dashboard.endDate,
									country: $scope.dashboard.country.id
								}
							}
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'highchart',
						style: 'height: 190px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Top 5 Incident Locations',
							chartConfig: {
								options: {
									chart: {
										type: 'bar',
										height: 150,
										spacingRight: 100
									},
									tooltip: {
										pointFormat: '<b>{point.y:,.0f} {series.name}</b>'
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
														fontSize: '11px',
														fontFamily: 'Roboto, sans-serif'
												}
										}
								},
								yAxis: {
										min: 0,
										title: {
												text: ' '
										},
										gridLineColor: '#fff',
										minTickInterval: 1
								},
								series: [{																			
										name: 'Deaths',
										color: '#78909c',
										request: {
											method: 'POST',
											url: appConfig.host + '/wk/chart',
											data: {
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												country: $scope.dashboard.country.id,
												indicator: 'death'
											}	
										}
								},{
										name: 'Incidents',
										color: '#7cb5ec',
										request: {
											method: 'POST',
											url: appConfig.host + '/wk/chart',
											data: {
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												country: $scope.dashboard.country.id,
												indicator: 'incident'
											}	
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
						type: 'leaflet',
						card: 'card-panel',
						style: 'padding:0px;',
						broadcast: 'dateChange',
						config: {
							height: '520px',
							display: {
								type: 'marker',
								zoomToBounds: true
							},
							defaults: {
								zoomToBounds: true,
								center: { lat: 0, lng: 20, zoom: 4 },
							},
							layers: {
			          baselayers: {
			            osm: {
			                name: 'Mapbox',
			                type: 'xyz',
			                url: 'https://b.tiles.mapbox.com/v4/aj.um7z9lus/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q',
			                layerOptions: {
			                    continuousWorld: true
			                }
			            }
			          },
								overlays: {
									incidents: {
										name: 'Incidents',
										type: 'markercluster',
										visible: true,
										layerOptions: {
											maxClusterRadius: 90
										}
									}
								}
							},				
							request: {
								method: 'POST',
								url: appConfig.host + '/wk/markers',
								data: {
									layer: 'incidents',
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									country: $scope.dashboard.country.id,
									message: '<div class="count" style="text-align:center">__{ "value": feature.properties.fatalities }__</div> Fatalities <br/>__{ "value": feature.properties.country }__, __{ "value": feature.properties.adm_level_1 }__ <br/> __{ "value": feature.properties.event_date }__ <br/> __{ "value": feature.properties.event_type }__'
								}
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
						style: 'padding:0px; height: 220px;',
						config: {
							html: '<div style="background-color: #FFF; height: 140px;"></div>' + $scope.dashboard.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard.config = $scope.dashboard;
		$scope.$parent.ngm.dashboard.model = $scope.model;
		
	}]);