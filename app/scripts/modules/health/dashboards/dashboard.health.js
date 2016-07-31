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

			// empty model
			$scope.model = {
				rows: [{}]
			};		

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
				
				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// dashboard data
				data: {
					// admin regions
					admin_region: {
	          'AF': { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'AF', admin0name: 'Afghanistan', admin1type_name: 'Province', admin2type_name: 'District' },
	          'ET': { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'ET', admin0name: 'Ethiopia' },
	          'IQ': { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'IQ', admin0name: 'Iraq' },
	          'KE': { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'KE', admin0name: 'Kenya' },
	        },
	        // project					
					project_type: {
						'all': 'All PROJECTS',
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
					// beneficiary
					beneficiary_type: {
						'all': 'All BENEFICIARIES',
						'conflict_displaced': 'Conflict IDPs',
	          'health_affected_conflict': 'Health Affected by Conflict',
	          'training': 'Health Education',
	          'natural_disaster_affected': 'Natural Disaster IDPs',
	          'refugees_returnees': 'Refugees & Returnees',
	          'white_area_population': 'White Area Population'
					}
				},

        // set URL based on user rights
				setUrl: function(){

					// user URL
					var path = '/health/4w/' + $scope.dashboard.user.adminRpcode.toLowerCase() + 
															 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() + 
															 '/' + $route.current.params.admin1 + 
															 '/' + $route.current.params.admin2 + 
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;
					
					// if current location is not equal to user 
					if ( path !== $location.$$path ) {
						// 
						$location.path( path );
					}

				},

				// set dashboard title
				setTitle: function() {
					
					// default
					$scope.dashboard.title = 'Health 4W | ' + $scope.dashboard.user.adminRname;

					// admin0
					if ( $scope.dashboard.user.admin0pcode !== 'ALL' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.user.admin0name;
					}

					// admin1
					if ( $route.current.params.admin1 !== 'all' ) {
						$scope.dashboard.title += ' | ' + $route.current.params.admin1;
					}

					// admin2
					if ( $route.current.params.admin2 !== 'all' ) {
						$scope.dashboard.title += ' | ' + $route.current.params.admin2;
					}

				},

				// set dashboard title
				setSubtitle: function() {
					
					// default
					$scope.dashboard.subtitle = 'Health Cluster 4W dashboard for ' + String( $scope.dashboard.data.beneficiary_type[ $scope.dashboard.beneficiary_type ] ).toUpperCase();

					// admin0
					if ( $scope.dashboard.user.admin0pcode !== 'ALL' ) {
						$scope.dashboard.subtitle += ' in ' + $scope.dashboard.user.admin0name;
					}

					// admin1
					if ( $route.current.params.admin1 !== 'all' ) {
						$scope.dashboard.subtitle += ', ' + $route.current.params.admin1 + ' ' + $scope.dashboard.user.admin1type_name;
					}

					// admin2
					if ( $route.current.params.admin2 !== 'all' ) {
						$scope.dashboard.subtitle += ' ' + $route.current.params.admin2  + ' ' + $scope.dashboard.user.admin2type_name;;
					}

				},

				// set project title by project type
				setProjectsTitle: function() {
					
					// projects stats title
					$scope.dashboard.projectTitle = '';

					// foreach type
					angular.forEach($scope.dashboard.project_type, function(d, i){
						$scope.dashboard.projectTitle += $scope.dashboard.data.project_type[d] + ', ';
					});

					// remove last 2 characters
					$scope.dashboard.projectTitle = $scope.dashboard.projectTitle.slice(0, -2);
				},

				// set project title by project type
				setBeneficiariesTitle: function() {
					
					// beneficaries stats title
					$scope.dashboard.beneficiariesTitle = '';

					// foreach type		
					angular.forEach($scope.dashboard.beneficiary_type, function(d, i){
						$scope.dashboard.beneficiariesTitle += $scope.dashboard.data.beneficiary_type[d] + ', ';
					});

					// remove last 2 characters
					$scope.dashboard.beneficiariesTitle = $scope.dashboard.beneficiariesTitle.slice(0, -2);			

				},	

				// set dashboard
				setDashboard: function(){

					// variables
					$scope.dashboard.adminRpcode = $route.current.params.adminR;
					$scope.dashboard.admin0pcode = $route.current.params.admin0;
					$scope.dashboard.admin1pcode = $route.current.params.admin1;
					$scope.dashboard.admin2pcode = $route.current.params.admin2;
					$scope.dashboard.project_type = $route.current.params.project.split('+');
					$scope.dashboard.beneficiary_type = $route.current.params.beneficiaries.split('+');					
				
					// set dashboard URL
					$scope.dashboard.setUrl();

					//  set title
					$scope.dashboard.setTitle();

					//  set subtitle
					$scope.dashboard.setSubtitle();

					//  set project type title
					$scope.dashboard.setProjectsTitle();

					//  set beneficiaries type title
					$scope.dashboard.setBeneficiariesTitle();
					
					// model
					$scope.model = {
						name: 'health_4w_dashboard',
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
										var date = moment( new Date( this.time ) ).format( 'YYYY-MM-DD' );

										// if not valid
										if ( date > $scope.dashboard.endDate ) {
											Materialize.toast('Please check the dates and try again!', 4000);

										// if updated
										} else if ( $scope.dashboard.startDate !== date ) {

											// start date
											$scope.dashboard.startDate = date;

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
										var date = moment( new Date( this.time ) ).format( 'YYYY-MM-DD' );

										// if not valid
										if ( $scope.dashboard.startDate > date ) {
											Materialize.toast('Please check the dates and try again!', 4000);

										// if updated
										} else if ( $scope.dashboard.endDate !== date ) {

											// start date
											$scope.dashboard.endDate = date;

											// update new date
											$location.path( '/health/4w/' + $route.current.params.province + '/' + $route.current.params.district + '/' + $route.current.params.project + '/' + $route.current.params.beneficiaries + '/' +  $scope.dashboard.startDate + '/' + $scope.dashboard.endDate );
										}								

									}
								}]
							}
						},
						menu: [{}],
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										id: 'dashboard-btn',
										html: '<a class="waves-effect waves-light btn left hide-on-small-only" href="#/health/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a><a class="waves-effect waves-light btn right" href="#/health/4w"><i class="material-icons left">cached</i>Reset Dashboard</a>'
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_status: 'active',
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_status: 'active',
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												conflict: false,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												conflict: true,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
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
														adminRpcode: $scope.dashboard.adminRpcode,
														admin0pcode: $scope.dashboard.admin0pcode,
														admin1pcode: $scope.dashboard.admin1pcode,
														admin2pcode: $scope.dashboard.admin2pcode,
														project_type: $scope.dashboard.project_type,
														beneficiary_type: $scope.dashboard.beneficiary_type
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
														adminRpcode: $scope.dashboard.adminRpcode,
														admin0pcode: $scope.dashboard.admin0pcode,
														admin1pcode: $scope.dashboard.admin1pcode,
														admin2pcode: $scope.dashboard.admin2pcode,
														project_type: $scope.dashboard.project_type,
														beneficiary_type: $scope.dashboard.beneficiary_type
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
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
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
					}

				}

			};

			// if user
			if ( $scope.dashboard.user ) {

				// set dashboard
				$scope.dashboard.setDashboard();

			} else {
				
				// get location
				ngmData.get({
					method: 'GET',
					url: 'http://ip-api.com/json'
				}).then( function( results ){

					// default is global
					$scope.dashboard.user = { adminRpcode: 'HQ', adminRname: 'Global', admin0pcode: 'ALL', admin0name: 'All' },

					// set guest location
					$scope.dashboard.user = $scope.dashboard.data.admin_region[ results.countryCode ];

					// set dashboard with guest user
					$scope.dashboard.setDashboard();

				});

			}

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);