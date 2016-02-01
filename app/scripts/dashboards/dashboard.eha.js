/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardEhaCtrl', ['$scope', '$http', '$location', '$route', '$window', '$timeout', 'ngmUser', 'ngmModal', 
		function ($scope, $http, $location, $route, $window, $timeout, ngmUser, ngmModal) {
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
			
			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHH'),

			// data lookup
			data: {
				donor: {
					'chf': { id: 'chf', name: 'CHF' },
					'usaid': { id: 'usaid', name: 'CHF / USAID' },
					'cerf': { id: 'cerf', name: 'CERF' },
					'echo': { id: 'echo', name: 'ECHO' }			
				},
				donorList: {
					'chf': [{ id:'ahds', name: 'AHDS' },
									{ id:'emergency', name: 'Emergency' },
									{ id:'mrca', name: 'MRCA' },
									{ id:'nbb', name: 'National Blood Bank' },
									{ id:'nca', name: 'NCA' },
									{ id:'pphd', name: 'PPHD' },
									{ id:'puami', name: 'PUAMI' },
									{ id:'shrdo', name: 'SHRDO' }],
					'usaid': [{ id:'emergency', name: 'Emergency' },
										{ id:'hpro', name: 'HPRO' }],
					'cerf': [{ id:'imc', name: 'IMC' }],
					'echo': [{ id:'hntpo', name: 'HNTPO' },
									{ id:'mrca', name: 'MRCA' },
									{ id:'nbb', name: 'National Blood Bank' }]
				},
				organization: {
					'ahds': { id:'ahds', name: 'AHDS' },
					'emergency': { id:'emergency', name: 'Emergency' },
					'hntpo': { id:'hntpo', name: 'HNTPO' },
					'hpro': { id:'hpro', name: 'HPRO' },
					'imc': { id:'imc', name: 'IMC' },
					'mrca': { id:'mrca', name: 'MRCA' },
					'nbb': { id:'nbb', name: 'National Blood Bank' },
					'nca': { id:'nca', name: 'NCA' },
					'pphd': { id:'pphd', name: 'PPHD' },
					'puami': { id:'puami', name: 'PUAMI' },
					'shrdo': { id:'shrdo', name: 'SHRDO' }					
				}
			},

			// simple navigation object
			getBreadcrumb: function() {

				// bradcrumb, default home
				var breadcrumb = [{
							title: 'EHA',
							href: '#/who/eha/monitoring'
						}];

				// push donor
				if ($route.current.params.donor) {
					breadcrumb.push({
							title: $scope.dashboard.donor.name,
							href: '#/who/eha/monitoring/' + $route.current.params.donor
						});
				}

				// push organization
				if ($route.current.params.organization) {
					breadcrumb.push({
							title: $scope.dashboard.organization.name,
							href: '#/who/eha/monitoring/' + $route.current.params.donor + '/' + $route.current.params.organization
						});
				}

				// push project
				if ($route.current.params.project) {
					breadcrumb.push({
							title: $route.current.params.project,
							href: '#/who/eha/monitoring/' + $route.current.params.donor + '/' + $route.current.params.organization + '/' + $route.current.params.project
						});
				}				

				// return object
				return breadcrumb;

			},

			getMenu: function(){

				var menu = [{
					'id': 'search-dews-donor',
					'search': false,
					'icon': 'account_circle',
					'title': 'Donor',
					'class': 'teal lighten-1 white-text',
					'rows': $scope.dashboard.getRows('donor')
				}];

				if ($route.current.params.donor) {
					menu.push({
						'id': 'search-dews-organization',
						'icon': 'touch_app',
						'title': 'Organization',
						'class': 'teal lighten-1 white-text',
						'rows': $scope.dashboard.getRows('organization')
					});
				}

				return menu;

			},

			// return rows for DEWS menu
			getRows: function(list) {
				
				// menu rows
				var active,
					rows = [];

				if(list === 'donor'){
					// for each disease
					angular.forEach($scope.dashboard.data.donor, function(d, key){

						//
						rows.push({
							'title': d.name,
							'param': 'donor',
							'active': key,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/who/eha/monitoring/' + key
						});
					});

				} else {
					// for each disease
					angular.forEach($scope.dashboard.data.donorList[$route.current.params.donor], function(d, key){
						
						//
						rows.push({
							'title': d.name,
							'param': 'organization',
							'active': d.id,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/who/eha/monitoring/' + $route.current.params.donor + '/' + d.id
						});
					});
				}

				return rows;
			}
		}

		// set dashboard params
		$scope.dashboard.donor = $route.current.params.donor ? $scope.dashboard.data.donor[$route.current.params.donor] : { id: '*', name: 'EHA' };
		$scope.dashboard.organization = $route.current.params.organization ? $scope.dashboard.data.organization[$route.current.params.organization] : { id: '*', name: 'All' };
		$scope.dashboard.title = 'EHA';
		$scope.dashboard.subtitle = 'Emergency Humanitarian Action NGO projects for Afghanistan';

		// dews dashboard model
		$scope.model = {
			name: 'who_dews_dashboard',
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
					title: $scope.dashboard.subtitle,
				},
				download: {
					'class': 'col s12 m4 l4 hide-on-small-only',
					downloads: [{
						type: 'pdf',
						color: 'blue lighten-1',
						icon: 'picture_as_pdf',
						hover: 'Download EHA Report as PDF',
						request: {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/print',
							data: {
								report: $scope.dashboard.report,
								printUrl: $location.absUrl(),
								downloadUrl: 'http://' + $location.host() + '/report/',
								token: $scope.dashboard.user.token,
								pageLoadTime: 7600
							}
						},						
						metrics: {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'eha',
								format: 'pdf',
								url: $location.$$path
							}
						}
					}]
				}
			},
			navigationMenu:[{
				'icon': 'zoom_in',
				'liClass': 'teal z-depth-2',
				'aClass': 'white-text',
				'iClass': 'medium material-icons',
				'href': '#/who/eha/monitoring',
				'title': 'EHA'
			},{
				'icon': 'info_outline',
				'liClass': 'teal z-depth-2',
				'aClass': 'white-text',
				'iClass': 'medium material-icons',
				'href': '#/who',
				'title': 'DEWS'
			}],			
			menu: $scope.dashboard.getMenu(),
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'breadcrumb',
						'style': 'padding-top: 10px;',
						config: {
							color: $scope.dashboard.ngm.style.darkPrimaryColor,
							list: $scope.dashboard.getBreadcrumb()
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
							title: 'Budget Summary - Spent',
							display: {
								label: true,
								fractionSize: 1,
								subLabelfractionSize: 0,
								postfix: '%',
								subLabelPrefix: '$'
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
										name: 'Budget Summary',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/eha/summary',
											data: {
												metric: 'amount',
												donor: $scope.dashboard.donor.id,
												organization: $scope.dashboard.organization.id
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
						type: 'stats',
						style: 'height:180px; padding-top: 60px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'No. of Projects',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/eha/indicator',
								data: {
									metric: 'projects',
									donor: $scope.dashboard.donor.id,
									organization: $scope.dashboard.organization.id
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						style: 'height:180px; padding-top: 60px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'No. of Provinces',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/eha/indicator',
								data: {
									metric: 'provinces',
									donor: $scope.dashboard.donor.id,
									organization: $scope.dashboard.organization.id
								}
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
						config: {
							templateUrl: '/scripts/widgets/ngm-table/templates/eha.monitoring.html',
							tableOptions:{
								count: 5
							},
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/eha/table',
								data: {
									donor: $scope.dashboard.donor.id,
									organization: $scope.dashboard.organization.id
								}
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
								// zoomToBounds: true
							},
							defaults: {
								zoomToBounds: true
							},
							layers: {
								overlays: {
									eha_monitoring: {
										name: 'Projects',
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
								url: 'http://' + $location.host() + '/api/eha/markers',
								data: {
									layer: 'eha_monitoring',
									donor: $scope.dashboard.donor.id,
									organization: $scope.dashboard.organization.id
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

		// assign to ngm app scope (for menu)
		$scope.dashboard.ngm.dashboard.model = $scope.model;
		
	}]);