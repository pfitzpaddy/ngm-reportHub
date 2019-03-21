/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardFloodForecastCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardFloodForecastCtrl', ['$scope', '$http', '$route', '$location', '$q', '$filter', '$timeout', 'ngmAuth', 'ngmUser', 'ngmData', function ($scope, $http, $route, $location, $q, $filter, $timeout, ngmAuth, ngmUser, ngmData) {
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

			// province lists
			provinceMenuRequest: {
				method: 'GET',
				url: ngmAuth.LOCATION + '/api/list/getProvinceMenu'
			},

			// province lists
			districtListRequest: {
				method: 'GET',
				url: ngmAuth.LOCATION + '/api/list/getDistrictList'
			},
			
			// tab links
			baselineHref: '/immap/drr/baseline/' + $route.current.params.province,
			floodRiskHref: '/immap/drr/flood-risk/' + $route.current.params.province,
			floodForecastHref: '/immap/drr/flood-forecast/' + $route.current.params.province,

			// pdf print load time
			pdfPrintPageLoadTime: 10200, 

			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

			// center map (default Afg - set from province list)
			center: { lat: 34.5, lng: 66, zoom: 6 },

			// rows for floodRisk menu
			getProvinceRows: function() {
				
				// menu rows
				var rows = [];

				// for each disease
				angular.forEach($scope.dashboard.data, function(d, key){
					rows.push({
						'title': d.prov_name,
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
						'title': d.dist_name,
						'param': 'district',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/immap/drr/flood-forecast/' + $route.current.params.province + '/' + key
					});
				});

				return rows;
			},


			// set districts
			setDistrictList: function( data ) {

				// set $scope districts
				$scope.dashboard.districts = {}
				
				// filter districts by province
				districts = $filter('filter')( data, { prov_code: $scope.dashboard.data[$route.current.params.province].prov_code }, true);
				
				// format data
				angular.forEach( districts, function( d, i ){

					// url key
					var key = d.dist_name.toLowerCase().replace(' ', '-');

					// create object
					$scope.dashboard.districts[key] = { dist_code: d.dist_code, dist_name: d.dist_name, lat:d.lat, lng:d.lng, zoom: d.zoom };

				});

			},

			// getData
			getData: function(){

				// set province menu
				$scope.dashboard.data = angular.fromJson( localStorage.getItem( 'drrprovinceMenu' ) );

				// flag for geonode API
				$scope.dashboard.flag = $scope.dashboard.data[$route.current.params.province].prov_code === 'all' ? 'entireAfg' : 'currentProvince';

				// if province selected, get districts
				if( $scope.dashboard.flag === 'currentProvince' ){

					// districts
					$scope.dashboard.setDistrictList( angular.fromJson( localStorage.getItem( 'drrdistrictList' ) ) );

				}

				// request data
				ngmData.get({
					method: 'POST',
					url: 'http://asdc.immap.org/geoapi/floodrisk/',
					headers: { 'Content-Type': 'application/json' },
					data: {
						spatialfilter: [],
						flag: $scope.dashboard.flag,
						code: $route.current.params.district ? $scope.dashboard.districts[$route.current.params.district].dist_code : $scope.dashboard.data[$route.current.params.province].prov_code
					}
				}).then(function(data){
					// assign data
					$scope.dashboard.setDashboard(data);
					$timeout(function() {
						$('#ngm-report-title').css('font-size', '2.56rem');
					}, 200);
					$('#ngm-loading-modal').closeModal();
				});			

			},

			// set dashboards
			setDashboard: function(data) {

				// report
				$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');

				// title
				var title = 'iMMAP | Flood Forecast | ' + $scope.dashboard.data[$route.current.params.province].prov_name;
				var subtitle = 'Flood Forecast Key Indicators for ' + $scope.dashboard.data[$route.current.params.province].prov_name + ' Province';

				// map center
				$scope.dashboard.center = {
					lat: $scope.dashboard.data[ $route.current.params.province ].lat,
					lng: $scope.dashboard.data[ $route.current.params.province ].lng,
					zoom: $scope.dashboard.data[ $route.current.params.province ].zoom,
				}

				// add district to title
				if ( !$route.current.params.district ) {

					// pdf print load
					if ($route.current.params.province === 'afghanistan') {
						
						// table url
						$scope.dashboard.tableUrl = "http://asdc.immap.org/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&propertyName=prov_code,prov_na_en,flood_forecasted_verylow,flood_forecasted_low,flood_forecasted_med,flood_forecasted_high,flood_forecasted_veryhigh,flood_forecasted_extreme&typeName=geonode:current_flood_forecasted_provinces&maxFeatures=50&outputFormat=application/json";
					} else{
						
						// get table
						$scope.dashboard.tableUrl = "http://asdc.immap.org/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&cql_filter=prov_na_en='" + $scope.dashboard.data[$route.current.params.province].prov_name + "'&propertyName=prov_na_en,dist_code,dist_na_en,flood_forecasted_verylow,flood_forecasted_low,flood_forecasted_med,flood_forecasted_high,flood_forecasted_veryhigh,flood_forecasted_extreme&typeName=geonode:current_flood_forecasted_districts&maxFeatures=50&outputFormat=application/json";
					}

				} else {
					
					// title
					title += ' | ' + $scope.dashboard.districts[$route.current.params.district].dist_name;
					subtitle += ', ' + $scope.dashboard.districts[$route.current.params.district].dist_name;

					// tab href
					$scope.dashboard.baselineHref += '/' + $route.current.params.district;
					$scope.dashboard.floodRiskHref += '/' + $route.current.params.district;
					$scope.dashboard.floodForecastHref += '/' + $route.current.params.district;

						// get table
						$scope.dashboard.tableUrl = "http://asdc.immap.org/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&cql_filter=dist_code='" + $scope.dashboard.districts[$route.current.params.district].dist_code + "'&propertyName=prov_na_en,dist_code,dist_na_en,flood_forecasted_verylow,flood_forecasted_low,flood_forecasted_med,flood_forecasted_high,flood_forecasted_veryhigh,flood_forecasted_extreme&typeName=geonode:current_flood_forecasted_districts&maxFeatures=50&outputFormat=application/json";

					// map center
					$scope.dashboard.center = {
						lat: $scope.dashboard.districts[ $route.current.params.district ].lat,
						lng: $scope.dashboard.districts[ $route.current.params.district ].lng,
						zoom: $scope.dashboard.districts[ $route.current.params.district ].zoom,
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
							'class': 'col s12 m8 l8 report-title truncate',
							title:  title,
							style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
						},
						subtitle: {
							'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
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
									url: ngmAuth.LOCATION + '/api/print',
									data: {
										report: $scope.dashboard.report,
										printUrl: $location.absUrl(),
										downloadUrl: ngmAuth.LOCATION + '/report/',
										user: $scope.dashboard.user,
										pageLoadTime: $scope.dashboard.pdfPrintPageLoadTime,
										viewportWidth: 1390
									}
								},						
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public@gmail.com',
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
							styleClass: 's12 m6',
							widgets: [{
								type: 'highchart',
								style: 'height: 250px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										style: 'padding: 10px 20px 10px 20px;',
										text: 'FLASH FLOOD LIKELYHOOD'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									table: {
										data: [
											{ value: data.flashflood_forecast_extreme_pop, color: '#E2070E', name: 'Extreme' },
											{ value: data.flashflood_forecast_veryhigh_pop, color: '#F96D09', name: 'V. High' },
											{ value: data.flashflood_forecast_high_pop, color: '#FCED15', name: 'High' },
											{ value: data.flashflood_forecast_med_pop, color: '#0FC87B', name: 'Medium' },
											{ value: data.flashflood_forecast_low_pop, color: '#92E7FA', name: 'Low' }
										]										
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
											innerSize: '85%',
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
							styleClass: 's12 m6',
							widgets: [{
								type: 'highchart',
								style: 'height: 250px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										style: 'padding: 10px 20px 10px 20px;',
										text: 'RIVER FLOOD LIKELYHOOD'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									table: {
										data: [													
											{ value: data.riverflood_forecast_extreme_pop, color: '#E2070E', name: 'Extreme' },
											{ value: data.riverflood_forecast_veryhigh_pop, color: '#F96D09', name: 'V. High' },
											{ value: data.riverflood_forecast_high_pop, color: '#FCED15', name: 'High' },
											{ value: data.riverflood_forecast_med_pop, color: '#0FC87B', name: 'Medium' },
											{ value: data.riverflood_forecast_low_pop, color: '#92E7FA', name: 'Low' }
										]										
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
											innerSize: '85%',
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
							styleClass: 's12 m4',
							widgets: [{
								type: 'table',
								'style': 'height: 300px; padding-top: 20px; padding-left:40px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										style: 'padding-top: 10px; padding-bottom:10px;',
										name: 'FLOOD RISK BY CATEGORIES'
									},
									templateUrl: '/scripts/widgets/ngm-table/templates/drr/drr.flood.forecast.html',
									data: [{}],
									flash:[
										{ value: 0 + data.flashflood_forecast_extreme_risk_high_pop + data.flashflood_forecast_veryhigh_risk_high_pop + data.flashflood_forecast_high_risk_high_pop + data.flashflood_forecast_med_risk_high_pop + data.flashflood_forecast_low_risk_high_pop, color: '#ff8a65', name: 'High' },
										{ value: 0 + data.flashflood_forecast_extreme_risk_med_pop + data.flashflood_forecast_veryhigh_risk_med_pop + data.flashflood_forecast_high_risk_med_pop + data.flashflood_forecast_med_risk_med_pop + data.flashflood_forecast_low_risk_med_pop, color: '#ffab91', name: 'Medium' },
										{ value: 0 + data.flashflood_forecast_extreme_risk_low_pop + data.flashflood_forecast_veryhigh_risk_low_pop + data.flashflood_forecast_high_risk_low_pop + data.flashflood_forecast_med_risk_low_pop + data.flashflood_forecast_low_risk_low_pop, color: '#ffccbc', name: 'Low' }
									],
									river:[
										{ value: 0 + data.riverflood_forecast_extreme_risk_high_pop + data.riverflood_forecast_veryhigh_risk_high_pop + data.riverflood_forecast_high_risk_high_pop + data.riverflood_forecast_med_risk_high_pop + data.riverflood_forecast_low_risk_high_pop, color: '#1565c0', name: 'High' },
										{ value: 0 + data.riverflood_forecast_extreme_risk_med_pop + data.riverflood_forecast_veryhigh_risk_med_pop + data.riverflood_forecast_high_risk_med_pop + data.riverflood_forecast_med_risk_med_pop + data.riverflood_forecast_low_risk_med_pop, color: '#64b5f6', name: 'Medium' },
										{ value: 0 + data.riverflood_forecast_extreme_risk_low_pop + data.riverflood_forecast_veryhigh_risk_low_pop + data.riverflood_forecast_high_risk_low_pop + data.riverflood_forecast_med_risk_low_pop + data.riverflood_forecast_low_risk_low_pop, color: '#bbdefb', name: 'Low' }
									]
								}
							}]
						},{
							styleClass: 's12 m8',
							widgets: [{
								type: 'highchart',
								card: 'card-panel',
								style: 'height: 300px;',
								config:{
									title: {
										text: ''
									},
									chartConfig: {
										options: {
											chart: {
												type: 'column',
												height: 240,
												spacing: [40,10,10,10]
											},
											legend: {
												enabled: false
											},
											plotOptions: {
												series: {
													pointWidth: 14
												},
												column: {
													stacking: 'normal'
												}
											}
										},
										title: {
											text: ''
										},
										xAxis: {
											categories: [ 'EXTREME', 'VERY HIGH', 'HIGH', 'MEDIUM', 'LOW' ]
										},
										yAxis: {
											min: 0,
											title: {
												text: 'PPN. AT RISK'
											},
											gridLineColor: '#FFF'
										},
										series: [{
											name: 'HIGH',
											color: '#ff8a65',
											stack: 'flashflood',
											data: [ data.flashflood_forecast_extreme_risk_high_pop, data.flashflood_forecast_veryhigh_risk_high_pop, data.flashflood_forecast_high_risk_high_pop, data.flashflood_forecast_med_risk_high_pop, data.flashflood_forecast_low_risk_high_pop ]
										}, {
											name: 'MEDIUM',
											color: '#ffab91',
											stack: 'flashflood',
											data: [ data.flashflood_forecast_extreme_risk_med_pop, data.flashflood_forecast_veryhigh_risk_med_pop, data.flashflood_forecast_high_risk_med_pop, data.flashflood_forecast_med_risk_med_pop, data.flashflood_forecast_low_risk_med_pop ]
										}, {
											name: 'LOW',
											color: '#ffccbc',
											stack: 'flashflood',
											data: [ data.flashflood_forecast_extreme_risk_low_pop, data.flashflood_forecast_veryhigh_risk_low_pop, data.flashflood_forecast_high_risk_low_pop, data.flashflood_forecast_med_risk_low_pop, data.flashflood_forecast_low_risk_low_pop ]
										},{
											name: 'HIGH',
											color: '#1565c0',
											stack: 'riverflood',
											data: [ data.riverflood_forecast_extreme_risk_high_pop, data.riverflood_forecast_veryhigh_risk_high_pop, data.riverflood_forecast_high_risk_high_pop, data.riverflood_forecast_med_risk_high_pop, data.riverflood_forecast_low_risk_high_pop ]
										}, {
											name: 'MEDIUM',
											color: '#64b5f6',
											stack: 'riverflood',
											data: [ data.riverflood_forecast_extreme_risk_med_pop, data.riverflood_forecast_veryhigh_risk_med_pop, data.riverflood_forecast_high_risk_med_pop, data.riverflood_forecast_med_risk_med_pop, data.riverflood_forecast_low_risk_med_pop ]
										}, {
											name: 'LOW',
											color: '#bbdefb',
											stack: 'riverflood',
											data: [ data.riverflood_forecast_extreme_risk_low_pop, data.riverflood_forecast_veryhigh_risk_low_pop, data.riverflood_forecast_high_risk_low_pop, data.riverflood_forecast_med_risk_low_pop, data.riverflood_forecast_low_risk_low_pop ]
										}]
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'table',
								card: 'card-panel',
								config:{
									province: $scope.dashboard.flag === 'currentProvince' ? false : true,
									title: {
										style: 'padding-top: 10px;',
										name: 'FLOOD FORECAST POPULATION'
									},
									tableOptions:{
										count: 10,
										sorting: { 
											'properties.flood_forecasted_extreme': 'desc',
											'properties.flood_forecasted_veryhigh': 'desc',
											'properties.flood_forecasted_high': 'desc',
											'properties.flood_forecasted_med': 'desc',
											'properties.flood_forecasted_low': 'desc'
										} 
									},
									request: {
										method: 'POST',
										// headers: {
										// 	'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
										// },
										url: ngmAuth.LOCATION + '/api/proxy',
										data: {
											url: $scope.dashboard.tableUrl	
										}
									},
									templateUrl: '/scripts/widgets/ngm-table/templates/drr/drr.flood.forecast.list.html'
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
										zoomToBounds: true,
										center: $scope.dashboard.center
									},
									layers: {
										baselayers: {
											osm: {
												name: 'Mapbox',
												type: 'xyz',
												url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
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
													layers: 'geonode:current_flood_forecasted_villages_basin,geonode:afg_riv,geonode:afg_pplp',
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
		
		// get all lists 
		if ( !localStorage.getItem( 'drrprovinceMenu' ) ) {

			// send request
			$q.all([ $http( $scope.dashboard.provinceMenuRequest ), $http( $scope.dashboard.districtListRequest ) ]).then( function( results ){

				// set lists to local storage
				localStorage.setItem( 'drrprovinceMenu', JSON.stringify( results[0].data ));
				localStorage.setItem( 'drrdistrictList', JSON.stringify( results[1].data ));

				// getData
				$scope.dashboard.getData();

			});

		} else {
			
			// getData
			$scope.dashboard.getData();

		}
		
	}]);