/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardHealthProjectsCtrl', ['$scope', '$http', '$location', '$route', '$window', '$timeout', '$filter', 'ngmUser', 'ngmModal', 'ngmData', 
		function ($scope, $http, $location, $route, $window, $timeout, $filter, ngmUser, ngmModal, ngmData) {
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
			startDate: moment($route.current.params.start).format('YYYY-MM-DD'),

			// report end
			endDate: moment($route.current.params.end).format('YYYY-MM-DD'),			
			
			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

			data: {
				project_type: {
					'all': 'All Projects',
					'awareness_campaign': 'Awareness Campaign',
					'health_education': 'Health Education',
					'outbreak_response': 'Outbreak Response',
					'phc_idps': 'PHC IDPs',
					'phc_natural_disaster': 'PHC Natural Disaster',
					'phc_refugees': 'PHC Refugees',
					'phc_conflict_area': 'PHC Conflict Area',
					'phc_white_area': 'PHC White Area',
					'trauma_care': 'Trauma Care'
				},
				beneficiary_category: {
					'all': 'Total Beneficiaries',
					'conflict_displaced': 'Conflict Displaced',
					'health_affected_conflict': 'Health Affected by Conflict', 
					'refugees_returnees': 'Refugees Returnees',
					'natural_disaster_affected': 'Natural Disaster Affected',
					'public_health': 'Public Health'
				},
				province: {
					'afghanistan': { id:'*', name:'Afghanistan'},
					'badakhshan': { id:15, name:'Badakhshan'},
					'badghis': { id:29, name:'Badghis'},
					'baghlan': { id:9, name:'Baghlan'},
					'balkh': { id:18, name:'Balkh'},
					'bamyan': { id:10,"name":'Bamyan'},
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
				}
			},

			// return rows for menu
			getProvinceRows: function() {
				
				// menu rows
				var active,
						rows = [];
						
				// for each province
				angular.forEach($scope.dashboard.data.province, function(d, key){
					//
					rows.push({
						'title': d.name,
						'param': 'location',
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
						'title': d.name,
						'param': 'location',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/health/4w/' + $route.current.params.province + '/' + key + '/' + $route.current.params.project + '/'  + $route.current.params.beneficiaries + '/' + $route.current.params.start + '/' + $route.current.params.end
					});
				});

				return rows;
			},

			// set district list
			setDistrictList: function(list){

				// set $scope districts
				$scope.dashboard.data.district = {}
				// filter districts by province
				var districts = $filter('filter')(list, { prov_code: $scope.dashboard.data.province[$route.current.params.province].id }, true);;
				// format list
				angular.forEach(districts, function(d, i){
					// url key
					var key = d.dist_name.toLowerCase().replace(' ', '-');
					// create object
					$scope.dashboard.data.district[key] = { id: d.dist_code, name: d.dist_name }

				});

			},

			// 
			setDashboard: function(){

				// set dashboard params
				$scope.dashboard.province = $scope.dashboard.data.province[$route.current.params.province];
				$scope.dashboard.district = $route.current.params.district !== 'all' ? $scope.dashboard.data.district[$route.current.params.district] : { id: '*', name: 'All' };
				$scope.dashboard.project_type = $route.current.params.project.split('+');
				$scope.dashboard.beneficiary_category = $route.current.params.beneficiaries.split('+');

				// report
				$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');

				// title
				$scope.dashboard.title = 'Health 4W | ' + $scope.dashboard.province.name;
				$scope.dashboard.title += $scope.dashboard.district.id !== '*' ? ' | ' + $scope.dashboard.district.name : '';
				// $scope.dashboard.subtitle = 'Health Cluster 4W dashboard for ' + $scope.dashboard.project + ' health projects in ' + $scope.dashboard.province.name + ' Province';

				// subtitle
				$scope.dashboard.subtitle = 'Health Cluster 4W dashboard for health projects in ' + $scope.dashboard.province.name;
				$scope.dashboard.subtitle += $route.current.params.province !== 'afghanistan' ? ' Province' : '';
				$scope.dashboard.subtitle += $scope.dashboard.district.id !== '*' ? ', ' + $scope.dashboard.district.name : '';

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
				angular.forEach($scope.dashboard.beneficiary_category, function(d, i){
					// title
					$scope.dashboard.beneficiariesTitle += $scope.dashboard.data.beneficiary_category[d] + ', ';
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
							'class': 'col s12 m8 l8 report-title',
							'style': 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
							'title': $scope.dashboard.title,
						},
						subtitle: {
							'class': 'col hide-on-small-only m8 l9 report-subtitle',
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
									$scope.dashboard.startDate = moment(new Date(this.time)).format('YYYY-MM-DD');

									// check dates
									if ($scope.dashboard.startDate > $scope.dashboard.endDate) {
										Materialize.toast('Please check the dates and try again!', 4000);
									} else {
										// update new date
										// $location.path('/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
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
									$scope.dashboard.endDate = moment(new Date(this.time)).format('YYYY-MM-DD');

									// check dates
									if ($scope.dashboard.startDate > $scope.dashboard.endDate) {
										Materialize.toast('Please check the dates and try again!', 4000);
									} else {
										// update new date
										// $location.path('/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
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
										pageLoadTime: 5400
									}
								},						
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public',
										dashboard: 'health_4w',
										theme: 'health_4w',
										format: 'pdf',
										url: $location.$$path
									}
								}						
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'group',
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
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public',
										dashboard: 'health_4w',
										theme: 'health_contacts',
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download Health 4W by Project as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/indicator',
									data: {
										report: 'projects_' + $scope.dashboard.report,
										details: 'projects',
										start_date: $scope.dashboard.startDate,
										end_date: $scope.dashboard.endDate,
										project_type: $scope.dashboard.project_type,
										beneficiary_category: $scope.dashboard.beneficiary_category,
										prov_code: $scope.dashboard.province.id,
										dist_code: $scope.dashboard.district.id										
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public',
										dashboard: 'health_4w',
										theme: 'health_details',
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'location_on',
								hover: 'Download Health 4W by Location as CSV',
								request: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/health/indicator',
									data: {
										report: 'locations_' + $scope.dashboard.report,
										details: 'locations',
										start_date: $scope.dashboard.startDate,
										end_date: $scope.dashboard.endDate,
										project_type: $scope.dashboard.project_type,
										beneficiary_category: $scope.dashboard.beneficiary_category,
										prov_code: $scope.dashboard.province.id,
										dist_code: $scope.dashboard.district.id
									}
								},
								metrics: {
									method: 'POST',
									url: 'http://' + $location.host() + '/api/metrics/set',
									data: {
										organization: $scope.dashboard.user ? $scope.dashboard.user.organization : 'public',
										username: $scope.dashboard.user ? $scope.dashboard.user.username : 'public',
										email: $scope.dashboard.user ? $scope.dashboard.user.email : 'public',
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
									html: '<a class="waves-effect waves-light btn left" href="#/health/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a><a class="waves-effect waves-light btn right" href="#/health/4w"><i class="material-icons right">cached</i>Reset Dashboard</a>'
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
									title: 'Active Organizations',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'organizations',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id
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
									title: 'Active Projects for (' + $scope.dashboard.projectTitle + ')',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'projects',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_status: 'active',
											project_type: $scope.dashboard.project_type,
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id
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
									title: 'Complete Projects for (' + $scope.dashboard.projectTitle + ')',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'projects',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_status: 'complete',
											project_type: $scope.dashboard.project_type,
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id
										}
									}
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l6',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Locations',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'locations',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id,
											conflict: false
										}
									}
								}
							}]
						},{
							styleClass: 's12 m12 l6',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'in Conflict Districts',
									display: {
										fractionSize: 0,
										simpleTitle: false,
										subTitlePrefix: 'from a Total of ',
										subTitlePostfix: ' conflict districts'
									},
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'locations',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id,
											conflict: true
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
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: $scope.dashboard.beneficiariesTitle,
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											indicator: 'beneficiaries',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											project_type: $scope.dashboard.project_type,
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id
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
								card: 'card-panel chart-stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: 'Children (Under 18)'
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
											name: 'Children (Under 18)',
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
													indicator: 'under18',
													start_date: $scope.dashboard.startDate,
													end_date: $scope.dashboard.endDate,
													project_type: $scope.dashboard.project_type,
													beneficiary_category: $scope.dashboard.beneficiary_category,
													prov_code: $scope.dashboard.province.id,
													dist_code: $scope.dashboard.district.id
												}
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
										text: 'Adult (18 to 59)'
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
											name: 'Adult (18 to 59)',
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
													indicator: 'over18',
													start_date: $scope.dashboard.startDate,
													end_date: $scope.dashboard.endDate,
													project_type: $scope.dashboard.project_type,
													beneficiary_category: $scope.dashboard.beneficiary_category,
													prov_code: $scope.dashboard.province.id,
													dist_code: $scope.dashboard.district.id
												}
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
										text: 'Eldery (Over 59)'
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
											name: 'Eldery (Over 59)',
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
													indicator: 'over59',
													start_date: $scope.dashboard.startDate,
													end_date: $scope.dashboard.endDate,
													project_type: $scope.dashboard.project_type,
													beneficiary_category: $scope.dashboard.beneficiary_category,
													prov_code: $scope.dashboard.province.id,
													dist_code: $scope.dashboard.district.id
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
												url: 'https://b.tiles.mapbox.com/v3/aj.um7z9lus/{z}/{x}/{y}.png?',
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
											beneficiary_category: $scope.dashboard.beneficiary_category,
											prov_code: $scope.dashboard.province.id,
											dist_code: $scope.dashboard.district.id
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
					$scope.model.menu[1] = {
						'search': true,
						'id': 'search-health-district',
						'icon': 'place',
						'title': 'District',
						'class': 'teal lighten-1 white-text',
						'rows': $scope.dashboard.getDistrictRows()
					};
				}

				// assign to ngm app scope (for menu)
				$scope.dashboard.ngm.dashboard.model = $scope.model;						

			}

		}

		// load dashboard!
		if($route.current.params.province === 'afghanistan'){
			
			// dews dashboard model
			$scope.dashboard.setDashboard();

		} else {

			// if in storage
			if( localStorage.getItem('districtList') ){

				// get list from storage
				$scope.dashboard.setDistrictList(angular.fromJson(localStorage.getItem('districtList')));

				// dews dashboard model
				$scope.dashboard.setDashboard();

			} else {

				// request data
				ngmData.get({
					method: 'GET',
					url: 'http://' + $location.host() + '/api/health/getDistrictsList'
				}).then(function(data){

					// set list from storage
					localStorage.setItem('districtList', JSON.stringify(data));

					// get list from storage
					$scope.dashboard.setDistrictList(data);

					// dews dashboard model
					$scope.dashboard.setDashboard();

				});

			}

		}
		
	}]);