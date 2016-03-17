/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardHealthProjectsCtrl', ['$scope', '$http', '$location', '$route', '$window', '$timeout', 'ngmUser', 'ngmModal', 
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

			// report start
			startDate: moment($route.current.params.start).format('YYYY-MM-DD'),

			// report end
			endDate: moment($route.current.params.end).format('YYYY-MM-DD'),			
			
			// current report
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),

		}

		// set dashboard params
		$scope.dashboard.title = 'Health Cluster 4W';
		$scope.dashboard.subtitle = 'Health Cluster 4W dashboard for all health projects in Afghanistan';

		// dews dashboard model
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
								pageLoadTime: 4800
							}
						},						
						metrics: {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user ? $scope.dashboard.organization : 'public',
								username: $scope.dashboard.user ? $scope.dashboard.username : 'public',
								email: $scope.dashboard.user ? $scope.dashboard.email : 'public',
								dashboard: 'health_4w',
								theme: 'health_4w',
								format: 'pdf',
								url: $location.$$path
							}
						}						
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'assignment',
						hover: 'Download Health 4W Project Details as CSV',
						request: {
							method: 'GET',
							url: 'http://' + $location.host() + '/api/health/data/details',
							data: {
								report: 'details_' + $scope.dashboard.report
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
						hover: 'Download Health 4W Project Locations as CSV',
						request: {
							method: 'GET',
							url: 'http://' + $location.host() + '/api/health/data/locations',
							data: {
								report: 'locations_' + $scope.dashboard.report
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
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'account_circle',
						hover: 'Download Health 4W Project Beneficiaries as CSV',
						request: {
							method: 'GET',
							url: 'http://' + $location.host() + '/api/health/data/beneficiaries',
							data: {
								report: 'beneficiaries_' + $scope.dashboard.report
							}
						},
						metrics: {
							method: 'POST',
							url: 'http://' + $location.host() + '/api/metrics/set',
							data: {
								organization: $scope.dashboard.user ? $scope.dashboard.organization : 'public',
								username: $scope.dashboard.user ? $scope.dashboard.username : 'public',
								email: $scope.dashboard.user ? $scope.dashboard.email : 'public',
								dashboard: 'health_4w',
								theme: 'health_beneficiaries',
								format: 'csv',
								url: $location.$$path
							}
						}
					}]
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l6',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Organizations',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: 'organizations',
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l6',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Projects',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: 'projects',
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
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Locations',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: 'locations',
									conflict: false
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l6',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Conflict Locations',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: 'locations',
									conflict: true
								}
							}
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Total Beneficiaries',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: 'beneficiaries',
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
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Children (Under 18)',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: ['under18male', 'under18female'],
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Adult (18 to 59)',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: ['over18male', 'over18female'],
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Elderly (Over 59)',
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/total',
								data: {
									indicator: ['over59male', 'over59female'],
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
								url: 'http://' + $location.host() + '/api/health/markers',
								data: {}
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