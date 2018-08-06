/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardWatchkeeperCtrl', ['$scope', '$http', '$location', '$route', 'ngmAuth', 'ngmUser', function ($scope, $http, $location, $route, ngmAuth, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// create dews object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// used in print report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

			// start date = now - 1 month
			startDate: moment($route.current.params.start).format('YYYY-MM-DD'),
			
			// end date = now
			endDate: moment($route.current.params.end).format('YYYY-MM-DD'),

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
				var menu = [{
					'id': 'search-wk-location',
					'search': true,
					'icon': 'place',
					'title': 'Location',
					'class': 'teal lighten-1 white-text',
					'rows': []
				}];

				//
				angular.forEach($scope.dashboard.data.country, function(d, key){
					//
					menu[0].rows.push({
						'title': d.name,
						'param': 'country',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/immap/watchkeeper/' + key + '/' + $route.current.params.start + '/' + $route.current.params.end
					});
				});		

				return menu;
			}
		}

		// report
		$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');

		// set dashboard params
		$scope.dashboard.country = $scope.dashboard.data.country[$route.current.params.country];
		$scope.dashboard.title = 'iMMAP | ' + $scope.dashboard.country.name;
		$scope.dashboard.subtitle = 'Watchkeeper Security Key Indicators for ' + $scope.dashboard.country.name + ' using ACLED datasource - <a target="_blank" href="https://www.acleddata.com/">https://www.acleddata.com/</a>';

		// calendar heatmap legend (colors) 
		if ($scope.dashboard.country.id === '*') {
			$scope.dashboard.legend = [20,40,60,80,100];
		} else if ($scope.dashboard.country.id === 'somalia') {
			$scope.dashboard.legend = [4,8,12,16,20];
		} else {
			$scope.dashboard.legend = [2,4,6,8,10];
		}

		// dews dashboard model
		$scope.model = {
			name: 'immap_watchkeeper_dashboard',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m8 l8 report-title truncate',
					'style': 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
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
						currentTime: $scope.dashboard.startDate,
						onClose: function(){
							// set date
							var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
							if ( date !== $scope.dashboard.startDate ) {
								// set new date
								$scope.dashboard.startDate = date;
								// update new date
								$location.path('/immap/watchkeeper/' + $route.current.params.country + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
							}
						}
					},{
						'class': 'ngm-date',
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
								// update new date
								$location.path('/immap/watchkeeper/' + $route.current.params.country + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
							}
						}
					}]
				},
				download: {
					'class': 'col s12 m4 l4 hide-on-small-only',
					downloads: [{
						type: 'pdf',
						color: 'blue lighten-1',
						icon: 'picture_as_pdf',
						hover: 'Download ' + $scope.dashboard.country.name + ' Report as PDF',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/print',
							data: {
								report: $scope.dashboard.report,
								printUrl: $location.absUrl(),
								downloadUrl: ngmAuth.LOCATION + '/report/',
								user: $scope.dashboard.user,
								pageLoadTime: 7600
							}
						},						
						metrics: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'dews',
								theme: $scope.dashboard.country.name,
								format: 'pdf',
								url: $location.$$path
							}
						}
					},{
						type: 'csv',
						color: 'blue lighten-1',
						icon: 'library_books',
						hover: 'Download ' + $scope.dashboard.country.name + ' Report as CSV',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/wk/data',
							data: {
								report: $scope.dashboard.report,
								start_date: $scope.dashboard.startDate,
								end_date: $scope.dashboard.endDate,
								country: $scope.dashboard.country.id
							}
						},
						metrics: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'watchkeeper',
								theme: $scope.dashboard.country.name,
								format: 'csv',
								url: $location.$$path
							}
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
						config: {
							title: 'Incident Difference',
							display: {
								postfix: '%',
								fractionSize: 2
							},
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/wk/difference',
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
						config: {
							title: 'Riots / Protests',
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/wk/indicator',
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
						config: {
							title: 'Other',
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/wk/indicator',
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
						config: {
							title: 'Deaths',
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/wk/indicator',
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
						config: {
							style: 'margin-top: -12px;',
							title: {
								style: 'padding-top: 10px;',
								name: $scope.dashboard.country.name + ' - 1 Year Timeline'
							},
							options: {
								start: new Date(moment($scope.dashboard.endDate).subtract(11, 'M').format()),
								itemName: 'incident',
								legend: $scope.dashboard.legend
							},
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/wk/calendar',
								data: {
									start_date: new Date(moment($scope.dashboard.endDate).subtract(11, 'M').format()),
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
							title: {
								text: 'Top 5 Incident Locations'
							},
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
										url: ngmAuth.LOCATION + '/api/wk/chart',
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
										url: ngmAuth.LOCATION + '/api/wk/chart',
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
										url: 'https://b.tiles.mapbox.com/v4/aj.um7z9lus/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
										// url: 'https://api.tiles.mapbox.com/v4/fitzpaddy.b207f20f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
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
								url: ngmAuth.LOCATION + '/api/wk/markers',
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
						style: 'padding:0px; height: 90px; padding-top:10px;',
						config: {
							html: $scope.dashboard.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.dashboard.ngm.dashboard.model = $scope.model;
		
	}]);