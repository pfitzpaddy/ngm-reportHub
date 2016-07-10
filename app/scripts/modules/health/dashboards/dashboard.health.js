/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardHealthProjectsCtrl', [
			'$scope', 
			'$q', 
			'$http', 
			'$location', 
			'$route', 
			'$window', 
			'$timeout', 
			'$filter', 
			'ngmUser', 
			'ngmData', 
		function ( $scope, $q, $http, $location, $route, $window, $timeout, $filter, ngmUser, ngmData ) {
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

			// report start
			startDate: moment( $route.current.params.start) .format( 'YYYY-MM-DD' ),

			// report end
			endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

			// province lists
			provinceMenuRequest: $http({
				method: 'GET',
				url: 'http://' + $location.host() + '/api/location/getProvinceMenu'
			}),

			// province lists
			districtListRequest: $http({
				method: 'GET',
				url: 'http://' + $location.host() + '/api/location/getDistrictList'
			}),
			
			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

			data: {
				project_type: {
					'all': 'All Projects',
					'capacity_building': 'Capacity Building of Health Staff',
					'cardio_health': 'Cardio Health',
					'community_health': 'Community Health',
					'donation': 'Donation',
					'health_education': 'Health Education',
					'outbreak_response': 'Outbreak Response',
					'phc': 'PHC',
					'physical_rehabilitation': 'Physical Rehabilitation',
					'psycho_social': 'Psycho Social',
					'trauma_care': 'Trauma Care',
					'other': 'Other'
				},
				beneficiary_type: {
					'all': 'All',
					'conflict_displaced': 'Conflict IDPs',
          'health_affected_conflict': 'Health Affected by Conflict',
          'training': 'Health Education',
          'natural_disaster_affected': 'Natural Disaster IDPs',
          'refugees_returnees': 'Refugees & Returnees',
          'white_area_population': 'White Area Population'
				}
			},

			// return rows for menu
			getProvinceRows: function() {
				
				// menu rows
				var active,
						rows = [];
						
				// for each province
				angular.forEach( $scope.dashboard.data.province, function( d, key ){
					//
					rows.push({
						'title': d.prov_name,
						'param': 'province',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/health/4w/' + key + '/all/' + $route.current.params.project + '/'  + $route.current.params.beneficiaries + '/' + $route.current.params.start + '/' + $route.current.params.end
					});
				});

				return rows;
			},

			// return rows for menu
			getDistrictRows: function() {
				
				// menu rows
				var active,
						rows = [];
						
				// for each district
				angular.forEach($scope.dashboard.data.district, function(d, key){
					//
					rows.push({
						'title': d.dist_name,
						'param': 'district',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/health/4w/' + $route.current.params.province + '/' + key + '/' + $route.current.params.project + '/'  + $route.current.params.beneficiaries + '/' + $route.current.params.start + '/' + $route.current.params.end
					});
				});

				return rows;
			},

			// return row of beneficiaries
			getBeneficiariesRows: function() {
				
				// menu rows
				var active,
						rows = [];
						
				// for each district
				angular.forEach($scope.dashboard.data.beneficiary_type, function(d, key){
					//
					rows.push({
						'title': d,
						'param': 'beneficiaries',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/health/4w/' + $route.current.params.province + '/' + $route.current.params.district + '/' + $route.current.params.project + '/'  + key + '/' + $route.current.params.start + '/' + $route.current.params.end
					});
				});

				return rows;				
			},

			// set district list
			setDistrictList: function( data ){

					// set $scope districts
					$scope.dashboard.data.district = {}
					// filter districts by province
					var districts = $filter('filter')( data , { prov_code: $scope.dashboard.data.province[$route.current.params.province].prov_code }, true);;
					// format list
					angular.forEach(districts, function(d, i){
						// url key
						var key = d.dist_name.toLowerCase().replace(' ', '-');

						// create object
						$scope.dashboard.data.district[key] = { dist_code: d.dist_code, dist_name: d.dist_name, lat:d.lat, lng:d.lng, zoom: d.zoom };

					});

			},

			// getData
			getData: function(){

				// set province menu
				$scope.dashboard.data.province = angular.fromJson( localStorage.getItem( 'provinceMenu' ) );

				// if province selected, get districts
				if( $scope.dashboard.data.province[$route.current.params.province].prov_code !== '*' ){
						
					// district
					$scope.dashboard.setDistrictList( angular.fromJson( localStorage.getItem( 'districtList' ) ) );
				}		

			},

			// 
			setDashboard: function(){

				// set dashboard params
				$scope.dashboard.province = $scope.dashboard.data.province[$route.current.params.province];
				$scope.dashboard.district = $route.current.params.district !== 'all' ? $scope.dashboard.data.district[$route.current.params.district] : { id: '*', name: 'All' };
				$scope.dashboard.project_type = $route.current.params.project.split('+');
				$scope.dashboard.beneficiary_type = $route.current.params.beneficiaries.split('+');

				// report
				$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

				// title
				$scope.dashboard.title = 'Health 4W | ' + $scope.dashboard.province.prov_name;
				$scope.dashboard.title += $scope.dashboard.district.id !== '*' ? ' | ' + $scope.dashboard.district.dist_name : '';

				// subtitle
				$scope.dashboard.subtitle = 'Health Cluster 4W dashboard for ' + String( $scope.dashboard.data.beneficiary_type[ $scope.dashboard.beneficiary_type ] ).toUpperCase() + ' BENEFICIARIES in ' + $scope.dashboard.province.prov_name;
				$scope.dashboard.subtitle += $route.current.params.province !== 'afghanistan' ? ' Province' : '';
				$scope.dashboard.subtitle += $scope.dashboard.district.id !== '*' ? ', ' + $scope.dashboard.district.dist_name : '';

				// projects stats title
				$scope.dashboard.projectTitle = '';				
				angular.forEach($scope.dashboard.project_type, function(d, i){
					// title
					$scope.dashboard.projectTitle += $scope.dashboard.data.project_type[d] + ', ';
				});
				// remove last 2 characters
				$scope.dashboard.projectTitle = $scope.dashboard.projectTitle.slice(0, -2);

				// beneficaries stats title
				$scope.dashboard.beneficiariesTitle = '';				
				angular.forEach($scope.dashboard.beneficiary_type, function(d, i){
					// title
					$scope.dashboard.beneficiariesTitle += $scope.dashboard.data.beneficiary_type[d] + ', ';
				});
				// remove last 2 characters
				$scope.dashboard.beneficiariesTitle = $scope.dashboard.beneficiariesTitle.slice(0, -2);

				// set model
				$scope.model = {
					name: 'health_4w_dews_dashboard',
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
							'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
							'title': $scope.dashboard.subtitle,
						},
						datePicker: {
							'class': 'col s12 m4 l3',
							dates: [{
								'class': 'ngm-date',
								style: 'float:left;',
								label: 'from',
								format: 'd mmm, yyyy',
								time: $scope.dashboard.startDate,
								onSelection: function(){

									// set date
									$scope.dashboard.startDate = moment( new Date( this.time ) ).format( 'YYYY-MM-DD' );

									// check dates
									if ($scope.dashboard.startDate > $scope.dashboard.endDate) {
										Materialize.toast('Please check the dates and try again!', 4000);
									} else {
										// update new date
										$location.path( '/health/4w/' + $route.current.params.province + '/' + $route.current.params.district + '/' + $route.current.params.project + '/' + $route.current.params.beneficiaries + '/' +  $scope.dashboard.startDate + '/' + $scope.dashboard.endDate );
									}

								}
							},{
								'class': 'ngm-date',
								style: 'float:right',
								label: 'to',
								format: 'd mmm, yyyy',
								time: $scope.dashboard.endDate,
								onSelection: function(){
									
									// set date
									$scope.dashboard.endDate = moment( new Date( this.time ) ).format( 'YYYY-MM-DD' );

									// check dates
									if ( $scope.dashboard.startDate > $scope.dashboard.endDate ) {
										Materialize.toast('Please check the dates and try again!', 4000);
									} else {
										// update new date
										$location.path( '/health/4w/' + $route.current.params.province + '/' + $route.current.params.district + '/' + $route.current.params.project + '/' + $route.current.params.beneficiaries + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate );
									}

								}
							}]
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
										report: $scope.dashboard.report,
										printUrl: $location.absUrl(),
										downloadUrl: 'http://' + $location.host() + '/report/',
										token: 'public',
										viewportWidth: 1280,
										pageLoadTime: 7200
									}
								},						
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public@gmail.com',
										dashboard: 'health_4w',
										theme: 'health_4w',
										format: 'pdf',
										url: $location.$$path
									}
								}						
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'call',
								hover: 'Download Health Cluster Contact List as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/data/contacts',
									data: {
										report: 'contacts_' + $scope.dashboard.report,
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public@gmail.com',
										dashboard: 'health_4w',
										theme: 'health_contacts',
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment_turned_in',
								hover: 'Download Health Project Progress Report as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/indicator',
									data: {
										report: 'health_projects_progress_' + $scope.dashboard.report,
										details: 'projects',
										start_date: $scope.dashboard.startDate,
										end_date: $scope.dashboard.endDate,
										project_type: $scope.dashboard.project_type,
										beneficiary_type: $scope.dashboard.beneficiary_type,
										prov_code: $scope.dashboard.province.prov_code,
										dist_code: $scope.dashboard.district.dist_code
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public@gmail.com',
										dashboard: 'health_4w',
										theme: 'health_details',
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'attach_money',
								hover: 'Download Health Financial Report CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/indicator',
									data: {
										report: 'health_financial_' + $scope.dashboard.report,
										details: 'financial',
										start_date: $scope.dashboard.startDate,
										end_date: $scope.dashboard.endDate,
										project_type: $scope.dashboard.project_type,
										beneficiary_type: $scope.dashboard.beneficiary_type,
										prov_code: $scope.dashboard.province.prov_code,
										dist_code: $scope.dashboard.district.dist_code
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public@gmail.com',
										dashboard: 'health_4w',
										theme: 'health_financial',
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'location_on',
								hover: 'Download Health Beneficiaries by District as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/indicator',
									data: {
										report: 'health_locations_' + $scope.dashboard.report,
										details: 'locations',
										start_date: $scope.dashboard.startDate,
										end_date: $scope.dashboard.endDate,
										project_type: $scope.dashboard.project_type,
										beneficiary_type: $scope.dashboard.beneficiary_type,
										prov_code: $scope.dashboard.province.prov_code,
										dist_code: $scope.dashboard.district.dist_code
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public@gmail.com',
										dashboard: 'health_4w',
										theme: 'health_locations',
										format: 'csv',
										url: $location.$$path
									}
								}
							}]
						}
					},
					menu: [{
						'id': 'search-health-province',
						'search': true,
						'icon': 'place',
						'title': 'Province',
						'class': 'teal lighten-1 white-text',
						'rows': $scope.dashboard.getProvinceRows()
					}],			
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'margin:15px; padding-bottom:30px;',
								config: {
									id: 'dashboard-btn',
									html: '<a class="waves-effect waves-light btn left hide-on-small-only" href="#/health/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a><a class="waves-effect waves-light btn right" href="#/health/4w"><i class="material-icons right">cached</i>Reset Dashboard</a>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l4',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Total Health Cluster Partners',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'partners',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code
										}
									}
								}
							}]
						},{							
							styleClass: 's12 m12 l4',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Active Health Cluster Partners',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'partners',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_status: 'active',
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code
										}
									}
								}
							}]
						},{
							styleClass: 's12 m12 l4',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Active Projects for ( ' + $scope.dashboard.projectTitle + ' )',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'projects',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_status: 'active',
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code
										}
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l4',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Unique Project Locations',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'locations',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code,
											conflict: false
										}
									}
								}
							}]
						},{
							styleClass: 's12 m12 l4',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Conflict Districts Served',
									display: {
										fractionSize: 0,
										simpleTitle: false,
										subTitlePrefix: 'out of ',
										// subTitlePostfix: ' conflict districts'
									},
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'locations',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code,
											conflict: true
										}
									}
								}
							}]
						},{
							styleClass: 's12 m12 l4',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Beneficiaries ( ' + $scope.dashboard.beneficiariesTitle + ' )',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'beneficiaries',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code
										}
									}
								}
							}]
						// },{
						// 	styleClass: 's12 m12 l4',
						// 	widgets: [{
						// 		type: 'stats',
						// 		style: 'text-align: center;',
						// 		card: 'card-panel stats-card white grey-text text-darken-2',
						// 		config: {
						// 			title: 'Conflict Districts with FATP/HF for Trauma',
						// 			data: {
						// 				value: 92,
						// 				value_total: 388
						// 			},
						// 			display: {
						// 				postfix: '%',
						// 				fractionSize: 0,
						// 				simpleTitle: false
						// 			}
						// 		}
						// 	}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l6',
							widgets: [{
								type: 'highchart',
								style: 'height: 180px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Children ( Under 5 )'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/promo.html',
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
											name: 'Children (Under 5)',
											size: '100%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											request: {
												method: 'POST',
												url: 'http://' + $location.host() + '/api/health/indicator',
												data: {
													indicator: 'under5',
													start_date: $scope.dashboard.startDate,
													end_date: $scope.dashboard.endDate,
													project_type: $scope.dashboard.project_type,
													beneficiary_type: $scope.dashboard.beneficiary_type,
													prov_code: $scope.dashboard.province.prov_code,
													dist_code: $scope.dashboard.district.dist_code
												}
											}
										}]
									}
								}
							}]
						},{
							styleClass: 's12 m12 l6',
							widgets: [{
								type: 'highchart',
								style: 'height: 180px;',
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Adult ( Over 5 )'
									},
									display: {
										label: true,
										fractionSize: 1,
										subLabelfractionSize: 0,
										postfix: '%'
									},
									templateUrl: '/scripts/widgets/ngm-highchart/template/promo.html',
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
											name: 'Adult (Over 5)',
											size: '100%',
											innerSize: '80%',
											showInLegend:false,
											dataLabels: {
												enabled: false
											},
											request: {
												method: 'POST',
												url: 'http://' + $location.host() + '/api/health/indicator',
												data: {
													indicator: 'over5',
													start_date: $scope.dashboard.startDate,
													end_date: $scope.dashboard.endDate,
													project_type: $scope.dashboard.project_type,
													beneficiary_type: $scope.dashboard.beneficiary_type,
													prov_code: $scope.dashboard.province.prov_code,
													dist_code: $scope.dashboard.district.dist_code
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
										zoomToBounds: true,
										// zoomCorrection: -3
									},
									defaults: {
										zoomToBounds: true
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
											health: {
												name: 'Health',
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
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'markers',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type,
											prov_code: $scope.dashboard.province.prov_code,
											dist_code: $scope.dashboard.district.dist_code
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

				// if province selected add district
				if($route.current.params.province !== 'afghanistan'){
					$scope.model.menu.push({
						'search': true,
						'id': 'search-health-district',
						'icon': 'place',
						'title': 'District',
						'class': 'teal lighten-1 white-text',
						'rows': $scope.dashboard.getDistrictRows()
					});
				}

				// add menu for beneficiaries
				$scope.model.menu.push({
					'search': false,
					'icon': 'group',
					'title': 'Beneficiaries',
					'class': 'teal lighten-1 white-text',
					'rows': $scope.dashboard.getBeneficiariesRows()
				});

				// assign to ngm app scope (for menu)
				$scope.dashboard.ngm.dashboard.model = $scope.model;						

			}

		}

		// get all lists 
		if ( !localStorage.getItem( 'provinceMenu' ) ) {

			// send request
			$q.all([ $scope.dashboard.provinceMenuRequest, $scope.dashboard.districtListRequest ]).then( function( results ){

				// set lists to local storage
				localStorage.setItem( 'provinceMenu', JSON.stringify( results[0].data ));
				localStorage.setItem( 'districtList', JSON.stringify( results[1].data ));

				// getData
				$scope.dashboard.getData();
				// set dashboard
				$scope.dashboard.setDashboard();

			});

		} else {
			
			// getData
			$scope.dashboard.getData();
			// set dashboard
			$scope.dashboard.setDashboard();

		}
		
	}]);