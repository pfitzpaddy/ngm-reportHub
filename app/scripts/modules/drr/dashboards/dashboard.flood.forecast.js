/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardFloodForecastCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardFloodForecastCtrl', ['$scope', '$http', '$route', '$location', '$filter', '$timeout', 'ngmUser', 'ngmData', function ($scope, $http, $route, $location, $filter, $timeout, ngmUser, ngmData) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// loading
		$('#ngm-loading-modal').openModal({dismissible: false});

		// hide left menu options
		$('.ngm-profile').css('display', 'none');
		$('.ngm-profile-btn').css('display', 'none');

		// init empty model
		$scope.model = {
			rows: [{}]
		};

		// flood-forecast object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm,			

			// current user
			user: ngmUser.get(),
			
			// tab links
			baselineHref: '/immap/drr/baseline/' + $route.current.params.province,
			floodRiskHref: '/immap/drr/flood-risk/' + $route.current.params.province,
			floodForecastHref: '/immap/drr/flood-forecast/' + $route.current.params.province,

			// pdf print load time
			pdfPrintPageLoadTime: 6200, 

			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

			// data lookup
			data: {
				'afghanistan': {'id':'*','name':'Afghanistan'},
				'badakhshan': { id:15, name:'Badakhshan'},
				'badghis': { id:29, name:'Badghis'},
				'baghlan': { id:9, name:'Baghlan'},
				'balkh': { id:18, name:'Balkh'},
				'bamyan': { id:10,'name':'Bamyan'},
				'daykundi': { id:22, name:'Daykundi'},
				'farah': { id:31, name:'Farah'},
				'faryab': { id:28, name:'Faryab'},
				'ghazni': { id:11, name:'Ghazni'},
				'ghor': { id:21, name:'Ghor'},
				'hilmand': { id:32, name:'Hilmand'},
				'hirat': { id:30, name:'Hirat'},
				'jawzjan': { id:27, name:'Jawzjan'},
				'kabul': { id:1, name:'Kabul'},
				'kandahar': { id:33, name:'Kandahar'},
				'kapisa': { id:2, name:'Kapisa'},
				'khost': { id:26, name:'Khost'},
				'kunar': { id:13, name:'Kunar'},
				'kunduz': { id:17, name:'Kunduz'},
				'laghman': { id:7, name:'Laghman'},
				'logar': { id:5, name:'Logar'},
				'nangarhar': { id:6, name:'Nangarhar'},
				'nimroz': { id:34, name:'Nimroz'},
				'nuristan': { id:14, name:'Nuristan'},
				'paktika': { id:25, name:'Paktika'},
				'paktya': { id:12, name:'Paktya'},
				'panjsher': { id:8, name:'Panjsher'},
				'parwan': { id:3, name:'Parwan'},
				'samangan': { id:19, name:'Samangan'},
				'sar-e-pul': { id:20, name:'Sar-e-Pul'},
				'takhar': { id:16, name:'Takhar'},
				'uruzgan': { id:23, name:'Uruzgan'},
				'wardak': { id:4, name:'Wardak'},
				'zabul': { id:24, name:'Zabul'}
			},

			// rows for floodRisk menu
			getProvinceRows: function() {
				
				// menu rows
				var rows = [];

				// for each disease
				angular.forEach($scope.dashboard.data, function(d, key){
					rows.push({
						'title': d.name,
						'param': 'province',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/immap/drr/flood-forecast/' + key
					});
				});

				return rows;
			},

			// rows for floodRisk menu
			getDistrictRows: function() {
				
				// menu rows
				var rows = [];

				// for each disease
				angular.forEach($scope.dashboard.districts, function(d, key){
					rows.push({
						'title': d.name,
						'param': 'district',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/immap/drr/flood-forecast/' + $route.current.params.province + '/' + key
					});
				});

				return rows;
			},

			// set dashboards
			setDashboard: function(data) {

				// report
				$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');

				// title
				var title = 'iMMAP | Flood Forecast | ' + $scope.dashboard.data[$route.current.params.province].name;
				var subtitle = 'Flood Forecast Key Indicators for ' + $scope.dashboard.data[$route.current.params.province].name + ' Province';

				// add district to title
				if ($route.current.params.district) {
					
					// title
					title += ' | ' + $scope.dashboard.districts[$route.current.params.district].name;
					subtitle += ', ' + $scope.dashboard.districts[$route.current.params.district].name;

					// tab href
					$scope.dashboard.baselineHref += '/' + $route.current.params.district;
					$scope.dashboard.floodRiskHref += '/' + $route.current.params.district;
					$scope.dashboard.floodForecastHref += '/' + $route.current.params.district;

				} else {
					// pdf print load
					if ($route.current.params.province === 'afghanistan') {
						$scope.dashboard.pdfPrintPageLoadTime = 7200;
					}
				}



				// flash flood river forecast
				$scope.dashboard.flashFloodRiskTotal = 0 +															
																data.flashflood_forecast_extreme_pop + 
																data.flashflood_forecast_veryhigh_pop +
																data.flashflood_forecast_high_pop +
																data.flashflood_forecast_med_pop +
																data.flashflood_forecast_low_pop;

				// river flood
				$scope.dashboard.riverFloodRiskTotal = 0 +
																data.riverflood_forecast_extreme_pop + 
																data.riverflood_forecast_veryhigh_pop +
																data.riverflood_forecast_high_pop +
																data.riverflood_forecast_med_pop +
																data.riverflood_forecast_low_pop;


				// FloodRisk dashboard model
				$scope.model = {
					name: 'drr_flood_forecast_dashboard',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m8 l8 report-title',
							title:  title,
							style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
						},
						subtitle: {
							'class': 'col hide-on-small-only m8 l9 report-subtitle',
							title: subtitle,
						},
						download: {
							'class': 'col s12 m4 l4 hide-on-small-only',
							btnColor: 'blue',
							downloads: [{
								type: 'pdf',
								color: 'blue lighten-2',
								icon: 'picture_as_pdf',
								hover: 'Download ' + $scope.dashboard.data[$route.current.params.province].name + ' Report as PDF',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/print',
									data: {
										report: $scope.dashboard.report,
										printUrl: $location.absUrl(),
										downloadUrl: 'http://' + $location.host() + '/report/',
										token: 'public',
										pageLoadTime: $scope.dashboard.pdfPrintPageLoadTime
									}
								},						
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public',
										dashboard: 'drr',
										theme: 'flood_forecast',
										format: 'pdf',
										url: $location.$$path
									}
								}
							}]
						}						
					},
					menu: [{
						'search': true,
						'id': 'search-flood-forecast-privince',
						'icon': 'place',
						'title': 'Province',
						'class': 'blue white-text',
						'rows': $scope.dashboard.getProvinceRows()
					}],
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								'style': 'padding-top: 10px;',
								config: {
									color: $scope.dashboard.ngm.style.darkPrimaryColor,
									templateUrl: '/scripts/widgets/ngm-html/template/tabs.html',
									tabs: [{
										col: 's12 m4',
										title: 'Baseline',
										href: $scope.dashboard.baselineHref
									},{
										col: 's12 m4',
										title: 'Flood Risk',
										href: $scope.dashboard.floodRiskHref
									},{
										col: 's12 m4',
										title: 'Flood Forecast',
										'class': 'active',
										href: $scope.dashboard.floodForecastHref
									}]
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'table',
								'style': 'height: 200px; padding-top: 10px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										style: 'padding-top: 10px;',
										name: 'FLASH FLOOD FORECAST'
									},
									templateUrl: '/scripts/widgets/ngm-table/templates/drr.flood.forecast.html',
									data: [
										{ value: data.flashflood_forecast_extreme_pop, color: '#E2070E', name: 'Extreme' },
										{ value: data.flashflood_forecast_veryhigh_pop, color: '#F96D09', name: 'Very High' },
										{ value: data.flashflood_forecast_high_pop, color: '#FCED15', name: 'High' },
										{ value: data.flashflood_forecast_med_pop, color: '#0FC87B', name: 'Medium' },
										{ value: data.flashflood_forecast_low_pop, color: '#92E7FA', name: 'Low' }
									]
								}
							}]
						},{
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'highchart',
								style: 'height: 200px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: ''
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/flood-forecast.html',
									style: '"text-align:center; width: 100%; height: 100%; position: absolute; top: 40px; left: 0;"',
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 140,
												margin: [0,0,0,0],
												spacing: [0,0,0,0]
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
											name: 'Flash Flood',
											size: '120%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											data: {
												label: {
													center: { 
														label: {
															label: $scope.dashboard.flashFloodRiskTotal
														},
														subLabel: {
															label: 'TOTAL'
														}
													}
												},
												data:[
													{ y: data.flashflood_forecast_low_pop, color: '#92E7FA', name: 'Low' },
													{ y: data.flashflood_forecast_med_pop, color: '#0FC87B', name: 'Medium' },
													{ y: data.flashflood_forecast_high_pop, color: '#FCED15', name: 'High' },
													{ y: data.flashflood_forecast_veryhigh_pop, color: '#F96D09', name: 'Very High' },
													{ y: data.flashflood_forecast_extreme_pop, color: '#E2070E', name: 'Extreme' }
													
												]
											}
										}]
									}
								}
							}]
						},{
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'table',
								'style': 'height: 200px; padding-top: 10px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										style: 'padding-top: 10px;',
										name: 'RIVER FLOOD FORECAST'
									},
									templateUrl: '/scripts/widgets/ngm-table/templates/drr.flood.forecast.html',
									data: [													
										{ value: data.riverflood_forecast_extreme_pop, color: '#E2070E', name: 'Extreme' },
										{ value: data.riverflood_forecast_veryhigh_pop, color: '#F96D09', name: 'Very High' },
										{ value: data.riverflood_forecast_high_pop, color: '#FCED15', name: 'High' },
										{ value: data.riverflood_forecast_med_pop, color: '#0FC87B', name: 'Medium' },
										{ value: data.riverflood_forecast_low_pop, color: '#92E7FA', name: 'Low' }
									]
								}
							}]
						},{							
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'highchart',
								style: 'height: 200px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: false
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/flood-forecast.html',
									style: '"text-align:center; width: 100%; height: 100%; position: absolute; top: 40px; left: 0;"',
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 140,
												margin: [0,0,0,0],
												spacing: [0,0,0,0]
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
											name: 'River Flood',
											size: '120%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											data: {
												label: {
													center: { 
														label: { 
															label: $scope.dashboard.riverFloodRiskTotal
														},
														subLabel: {
															label: 'TOTAL'
														}
													}
												},
												data:[
													{ y: data.riverflood_forecast_low_pop, color: '#92E7FA', name: 'Low' },
													{ y: data.riverflood_forecast_med_pop, color: '#0FC87B', name: 'Medium' },
													{ y: data.riverflood_forecast_high_pop, color: '#FCED15', name: 'High' },
													{ y: data.riverflood_forecast_veryhigh_pop, color: '#F96D09', name: 'Very High' },
													{ y: data.riverflood_forecast_extreme_pop, color: '#E2070E', name: 'Extreme' }
												]
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
								type: 'html',
								card: '',
								style: 'position:relative;height:0px;top:160px;left:30px;z-index:9; pointer-events:none;',
								config: {
									html: '<p style="font-weight:500;margin-bottom:0px;">Rivers (width in meters)</p><img src="http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=30&height=30&layer=geonode:afg_riv&transparent=true&format=image%2Fpng&legend_options=fontAntiAliasing%3Atrue%3BfontSize%3A11%3BfontName%3AArial&SCALE=8735642.90291195"></img> <br/> <p style="font-weight:500;margin-bottom:0px;">Flood Forecast</p><img src="http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=30&height=30&layer=geonode:current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&legend_options=fontAntiAliasing%3Atrue%3BfontSize%3A11%3BfontName%3AArial&SCALE=8735642.90291195"></img>'
								}
							}]							
						},{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'leaflet',
								card: 'card-panel',
								style: 'padding:0px;',
								config: {
									height: '520px',
									defaults: {
										zoomToBounds: true
									},
									layers: {
										baselayers: {
											osm: {
												name: 'Mapbox',
												type: 'xyz',
												url: 'https://api.tiles.mapbox.com/v4/fitzpaddy.b207f20f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
												layerOptions: {
													continuousWorld: true
												}
											}
										},
                    overlays: {
                      wms: {
                        name: 'Flood Forecast',
                        type: 'wms',
                        visible: true,
                        url: 'http://asdc.immap.org/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&TILED=true&WIDTH=256&HEIGHT=256',
                        layerParams: {
                        	srs: 'epsg:900913',
                        	layers: 'geonode:current_flood_forecasted_villages_basin,geonode:afg_riv',
                          format: 'image/png',
                          transparent: true
                        }
                      }
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

				if ($scope.dashboard.flag === 'currentProvince') {
					$scope.model.menu[1] = {
						'search': true,
						'id': 'search-flood-forecast-district',
						'icon': 'place',
						'title': 'District',
						'class': 'blue white-text',
						'rows': $scope.dashboard.getDistrictRows()
					};
				}

				// assign to ngm app scope
				$scope.dashboard.ngm.dashboard.model = $scope.model;

			}

		};

		// flag for geonode API
		$scope.dashboard.flag = $scope.dashboard.data[$route.current.params.province].id === '*' ? 'entireAfg' : 'currentProvince';

		// if province selected, get districts
		if($scope.dashboard.flag === 'currentProvince'){

			// request data
			ngmData.get({
				method: 'GET',
				url: 'http://' + $location.host() + '/api/health/getDistrictsList'
			}).then(function(data){
				
				// set $scope districts
				$scope.dashboard.districts = {}
				// filter districts by province
				var districts = $filter('filter')(data, { prov_code: $scope.dashboard.data[$route.current.params.province].id }, true);;
				// format data
				angular.forEach(districts, function(d, i){

					// url key
					var key = d.dist_name.toLowerCase().replace(' ', '-');

					// create object
					$scope.dashboard.districts[key] = { id: d.dist_code, name: d.dist_name }

				});
			});

		}

		// http://asdc.immap.org/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&propertyName=prov_code,prov_na_en,flood_forecasted_verylow,flood_forecasted_low,flood_forecasted_med,flood_forecasted_high,flood_forecasted_veryhigh,flood_forecasted_extreme&typeName=geonode:current_flood_forecasted_provinces&maxFeatures=50&outputFormat=application%2Fjson

		// request data
		ngmData.get({
			method: 'POST',
			url: 'http://asdc.immap.org/geoapi/floodrisk/',
			headers: { 'Content-Type': 'application/json' },
			data: {
				spatialfilter: [],
				flag: $scope.dashboard.flag,
				code: $scope.dashboard.data[$route.current.params.province].id
			}
		}).then(function(data){
			// assign data
			$scope.dashboard.setDashboard(data);
			$timeout(function() {
				$('#ngm-report-title').css('font-size', '2.56rem');
			}, 200);
			$('#ngm-loading-modal').closeModal();
		});
		
	}]);