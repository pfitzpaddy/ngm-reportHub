/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardFloodRiskCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardFloodRiskCtrl', ['$scope', '$http', '$route', '$location', '$q', '$filter', '$timeout', 'ngmAuth', 'ngmUser', 'ngmData', function ($scope, $http, $route, $location, $q, $filter, $timeout, ngmAuth, ngmUser, ngmData) {
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

		// flood-risk object
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
						'href': '#/immap/drr/flood-risk/' + key
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
						'href': '#/immap/drr/flood-risk/' + $route.current.params.province + '/' + key
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
				if($scope.dashboard.flag === 'currentProvince'){

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
				var title = 'iMMAP | Baseline | ' + $scope.dashboard.data[$route.current.params.province].prov_name;
				var subtitle = 'Flood Risk Key Indicators for ' + $scope.dashboard.data[$route.current.params.province].prov_name;

				// add district to title
				if ($route.current.params.district) {
					
					// title
					title += ' | ' + $scope.dashboard.districts[$route.current.params.district].dist_name;
					subtitle += ', ' + $scope.dashboard.districts[$route.current.params.district].dist_name;

					// tab href
					$scope.dashboard.baselineHref += '/' + $route.current.params.district;
					$scope.dashboard.floodRiskHref += '/' + $route.current.params.district;
					$scope.dashboard.floodForecastHref += '/' + $route.current.params.district;

				}

				// FloodRisk dashboard model
				$scope.model = {
					name: 'drr_flood_risk_dashboard',
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
										pageLoadTime: $scope.dashboard.pdfPrintPageLoadTime
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
										theme: 'flood_risk',
										format: 'pdf',
										url: $location.$$path
									}
								}
							}]
						}						
					},
					menu: [{
						'search': true,
						'id': 'search-flood-risk-privince',
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
										'class': 'active',
										href: $scope.dashboard.floodRiskHref
									},{
										col: 's12 m4',
										title: 'Flood Forecast',
										href: $scope.dashboard.floodForecastHref
									}]
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l6',
							widgets: [{
								type: 'stats',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Total Population',
									data: { value: data.Population },
									display: { 
										fractionSize: 0
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
									data: {
										value: data.percent_total_risk_population,
										value_total: data.total_risk_population
									},
									display: {
										postfix: '%',
										fractionSize: 0,
										simpleTitle: false
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
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Low Flood Risk Popn'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/center.html',
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 140,
												margin: [0, 0, 0, 0],
												spacing: [0, 0, 0, 0]
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
											name: 'Low Flood Risk Popn',
											size: '100%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											data: {
												label: {
													center: {
														label: {
															label: data.percent_low_risk_population,
															postfix: '%'
														},
														subLabel: {
															label: data.low_risk_population
														}
													}
												},
												data: [{
													'y': data.percent_low_risk_population,
													'color': '#7cb5ec',
													'name': 'Low Flood Risk Popn',
													'label': data.low_risk_population,
												},{
													'y': 100 - data.percent_low_risk_population,
													'color': 'rgba(0,0,0,0.05)',
													'name': 'Flood Risk Popn',
													'label': data.low_risk_population,
												}]
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
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Moderate Flood Risk Popn'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/center.html',
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 140,
												margin: [0, 0, 0, 0],
												spacing: [0, 0, 0, 0]
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
											name: 'Moderate Flood Risk Popn',
											size: '100%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											data: {
												label: {
													center: {
														label: {
															label: data.percent_med_risk_population,
															postfix: '%'
														},
														subLabel: {
															label: data.med_risk_population
														}
													}
												},
												data: [{
													'y': data.percent_med_risk_population,
													'color': '#7cb5ec',
													'name': 'Moderate Flood Risk Popn',
													'label': data.med_risk_population,
												},{
													'y': 100 - data.percent_med_risk_population,
													'color': 'rgba(0,0,0,0.05)',
													'name': 'Moderate Risk Popn',
													'label': data.med_risk_population,
												}]
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
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'High Flood Risk Popn'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/center.html',
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 140,
												margin: [0, 0, 0, 0],
												spacing: [0, 0, 0, 0]
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
											name: 'High Flood Risk Popn',
											size: '100%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											data: {
												label: {
													center: {
														label: {
															label: data.percent_high_risk_population,
															postfix: '%'
														},
														subLabel: {
															label: data.high_risk_population
														}
													}
												},
												data: [{
													'y': data.percent_high_risk_population,
													'color': '#7cb5ec',
													'name': 'High Flood Risk Popn',
													'label': data.high_risk_population,
												},{
													'y': 100 - data.percent_high_risk_population,
													'color': 'rgba(0,0,0,0.05)',
													'name': 'High Risk Popn',
													'label': data.high_risk_population,
												}]
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
								style: 'height: 310px;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Population At Flood Risk by Land Type'
									},
									chartConfig: {
										options: {
											chart: {
												type: 'bar',
												height: 260,
											},
											tooltip: {
												pointFormat: '<b>{point.y:,.0f}</b>'
											},
											legend: {
												enabled: false
											}																	
										},
										title: {
											text: ''
										},
										xAxis: {
											categories: [
												'Barren Land', 
												'Built-Up', 
												'Forest & Shrubs',
												'Fruit Trees',
												'Irrigated Agg Land',
												'Permanent Snow',
												'Rainfeld Agg Land',
												'Rangeland',
												'Sand Cover',
												'Vineyards',
												'Water Body & Marshland'
											],
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
												text: 'Population'
											}
										},
										series: [{
											name: 'Population',
											color: '#7cb5ec',
											data: [ 
												data.barren_land_pop_risk,
												data.built_up_pop_risk,
												data.forest_pop_risk,
												data.fruit_trees_pop_risk,
												data.irrigated_agricultural_land_pop_risk,
												data.permanent_snow_pop_risk,
												data.rainfed_agricultural_land_pop_risk,
												data.rangeland_pop_risk,
												data.sandcover_pop_risk,
												data.vineyards_pop_risk,
												data.water_body_pop_risk
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
								type: 'highchart',
								style: 'height: 310px;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Area (sqKm) At Flood Risk by Land Type'
									},
									chartConfig: {
										options: {
											chart: {
												type: 'bar',
												height: 260,
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
											categories: [
												'Barren Land', 
												'Built-Up', 
												'Forest & Shrubs',
												'Fruit Trees',
												'Irrigated Agg Land',
												'Permanent Snow',
												'Rainfeld Agg Land',
												'Rangeland',
												'Sand Cover',
												'Vineyards',
												'Water Body & Marshland'
											],
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
												text: 'Area (sqKm)'
											}
										},
										series: [{
											name: 'Population',
											color: '#78909c',
											data: [ 
												data.barren_land_area_risk,
												data.built_up_area_risk,
												data.forest_area_risk,
												data.fruit_trees_area_risk,
												data.irrigated_agricultural_land_area_risk,
												data.permanent_snow_area_risk,
												data.rainfed_agricultural_land_area_risk,
												data.rangeland_area_risk,
												data.sandcover_area_risk,
												data.vineyards_area_risk,
												data.water_body_area_risk
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
						'id': 'search-flood-risk-district',
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