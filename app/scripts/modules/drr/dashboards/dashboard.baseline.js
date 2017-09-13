/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardFloodRiskCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardBaselineCtrl', ['$scope', '$http', '$route', '$location', '$q', '$filter', '$timeout', 'ngmAuth', 'ngmUser', 'ngmData', function ($scope, $http, $route, $location, $q, $filter, $timeout, ngmAuth, ngmUser, ngmData) {
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

		// baseline object
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
						'href': '#/immap/drr/baseline/' + key
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
						'href': '#/immap/drr/baseline/' + $route.current.params.province + '/' + key
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

				// ngmData.get({
				// 	method: 'POST',
				// 	url: 'http://asdc.immap.org/account/ajax_login',
				// 	data: {
				// 		username: 'pfitzgerald',
				// 		password: 'P@trick7'
				// 	}
				// }).then( function( data ){

					// console.log( data );

					// request data
					ngmData.get({
						method: 'POST',
						url: 'http://asdc.immap.org/geoapi/floodrisk/',
						headers: { 
							'Content-Type': 'application/json',
							csrftoken: 'WEeSAr3v6NCl6zAinb2tdMrSkR86NTub'
						},
						data: {
							spatialfilter: [],
							flag: $scope.dashboard.flag,
							code: $route.current.params.district ? $scope.dashboard.districts[$route.current.params.district].dist_code : $scope.dashboard.data[$route.current.params.province].prov_code
						}
					}).then(function(data){
						// assign data
						$scope.dashboard.setDashboard(data);
						$('#ngm-loading-modal').closeModal();
					});	

				// });

			},		

			// set dashboards
			setDashboard: function(data) {

				// report
				$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');				

				// title
				var title = 'iMMAP | Baseline | ' + $scope.dashboard.data[$route.current.params.province].prov_name;
				var subtitle = 'Baseline Key Indicators for ' + $scope.dashboard.data[$route.current.params.province].prov_name;

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

				// baseline dashboard model
				$scope.model = {
					name: 'drr_baseline_dashboard',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m8 l8 report-title truncate',
							style: 'font-size: 2.56rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
							title:  title,
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
								hover: 'Download ' + $scope.dashboard.data[$route.current.params.province].prov_name + ' Report as PDF',
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
										theme: 'baseline',
										format: 'pdf',
										url: $location.$$path
									}
								}
							}]
						}						
					},
					menu: [{
						'search': true,
						'id': 'search-baseline-privince',
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
										'class': 'active',
										href: $scope.dashboard.baselineHref
									},{
										col: 's12 m4',
										title: 'Flood Risk',
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
							styleClass: 's12 m12 l3',
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
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'stats',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Settlements',
									data: { value: data.settlements },
									display: { 
										fractionSize: 0
									}
								}
							}]
						},{
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'stats',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Health Facilities',
									data: { 
										value: data.total_health_base 
									},
									display: { 
										fractionSize: 0
									}
								}
							}]
						},{
							styleClass: 's12 m12 l3',
							widgets: [{
								type: 'stats',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Road (KM)',
									data: { value: data.total_road_base },
									display: { 
										fractionSize: 0
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
									title: 'Population by Land Type',
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
												data.barren_land_pop,
											  data.built_up_pop,
											  data.forest_pop,
											  data.fruit_trees_pop,
											  data.irrigated_agricultural_land_pop,
											  data.permanent_snow_pop,
											  data.rainfed_agricultural_land_pop,
											  data.rangeland_pop,
											  data.sandcover_pop,
											  data.vineyards_pop,
											  data.water_body_pop
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
									title: 'Area (sqKm) by Land Type',
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
												data.barren_land_area,
											  data.built_up_area,
											  data.forest_area,
											  data.fruit_trees_area,
											  data.irrigated_agricultural_land_area,
											  data.permanent_snow_area,
											  data.rainfed_agricultural_land_area,
											  data.rangeland_area,
											  data.sandcover_area,
											  data.vineyards_area,
											  data.water_body_area
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
						'id': 'search-baseline-district',
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