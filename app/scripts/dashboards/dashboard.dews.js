'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDewsCtrl', ['$scope', '$http', '$location', '$route', '$window', '$timeout', 'appConfig', 'ngmUser', 'ngmModal', 
		function ($scope, $http, $location, $route, $window, $timeout, appConfig, ngmUser, ngmModal) {
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
			report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format(),

			// data lookup
			data: {
				disease: {
					'all': { id: '*', name:'All'},
					'awd': { id: 1, name: 'AWD' },
					'avh': { id: 2, name:'AVH'},
					'anthrax': { id: 3, name:'Anthrax'},
					'cchf': { id: 4, name:'CCHF'},
					'chickenpox': { id: 5, name:'Chickenpox'},
					'cholera': { id: 6, name:'Cholera'},
					'conjunctivitis': { id: 7, name:'Conjunctivitis'},
					'rabies': { id: 8, name:'Dog Bites/Rabies'},
					'food-poisoning': { id: 9, name:'Food Poisoning'},
					'leishmaniasis': { id: 10, name:'Leishmaniasis'},
					'malaria': { id: 11, name:'Malaria'},
					'psychogenic': { id: 12, name:'Mass Psychogenic'},
					'measles': { id: 13, name:'Measles'},
					'mumps': { id: 14, name:'Mumps'},
					'pertussis': { id: 15, name:'Pertussis'},
					'pneumonia': { id: 16, name:'Pneumonia'},
					'scabies': { id: 17, name:'Scabies'}
				},
				location: {
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

			// return rows for DEWS menu
			getRows: function(list) {
				
				// menu rows
				var active,
					rows = [];

				if(list === 'disease'){
					// for each disease
					angular.forEach($scope.dashboard.data.disease, function(d, key){
						//
						rows.push({
							'title': d.name,
							'class': 'waves-effect waves-teal',
							'param': 'disease',
							'active': key,
							'href': '#/who/dews/' + $route.current.params.location + '/' + key + '/' + $route.current.params.start + '/' + $route.current.params.end
						});
					});

				} else {
					// for each disease
					angular.forEach($scope.dashboard.data.location, function(d, key){
						//
						rows.push({
							'title': d.name,
							'class': 'waves-effect waves-teal',
							'param': 'location',
							'active': key,
							'href': '#/who/dews/' + key + '/' + $route.current.params.disease + '/' + $route.current.params.start + '/' + $route.current.params.end
						});
					});
				}

				return rows;
			}
		}

		// set dashboard params
		$scope.dashboard.location = $scope.dashboard.data.location[$route.current.params.location];
		$scope.dashboard.disease = $scope.dashboard.data.disease[$route.current.params.disease];
		$scope.dashboard.title = 'WHO | ' + $scope.dashboard.location.name + ' | ' + $scope.dashboard.disease.name;
		$scope.dashboard.subtitle = $scope.dashboard.disease.name + ' Disease Early Warning System Key Indicators ' + $scope.dashboard.location.name;

		// dews dashboard model
		$scope.model = {
			name: 'who_dews_dashboard',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					'style': 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m8 l8 report-title',
					'style': 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
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
						time: $scope.dashboard.startDate,
						onSelection: function(){

							// // set date
							$scope.dashboard.startDate = moment(this.time).format('YYYY-MM-DD');

							// check dates
							if ($scope.dashboard.startDate > $scope.dashboard.endDate) {
								Materialize.toast('Please check the dates and try again!', 4000);
							} else {
								// update path
								$location.path('/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
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
							$scope.dashboard.endDate = moment(this.time).format('YYYY-MM-DD');

							// check dates
							if ($scope.dashboard.startDate > $scope.dashboard.endDate) {
								Materialize.toast('Please check the dates and try again!', 4000);
							} else {
								// update path
								$location.path('/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
							}

						}
					}]
				},
				download: {
					'class': 'col s12 m4 l4 hide-on-small-only',
					downloads: [{
						type: 'csv',
						color: 'blue lighten-1',
						icon: 'library_books',
						hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as CSV',
						request: {
							method: 'POST',
							url: appConfig.host + '/dews/data',
							data: {
								report: $scope.dashboard.report,
								start_date: $scope.dashboard.startDate,
								end_date: $scope.dashboard.endDate,
								disease: $scope.dashboard.disease.id,
								prov_code: $scope.dashboard.location.id
							}
						},
						metrics: {
							method: 'POST',
							url: appConfig.host + '/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'dews',
								theme: $scope.dashboard.disease.name,
								format: 'csv',
								url: $location.$$path
							}
						}						
					},{
						type: 'pdf',
						color: 'blue lighten-1',
						icon: 'picture_as_pdf',
						hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as PDF',
						request: {
							method: 'POST',
							url: appConfig.host + '/print',
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
							url: appConfig.host + '/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'dews',
								theme: $scope.dashboard.disease.name,
								format: 'pdf',
								url: $location.$$path
							}
						}
					}]
				}
			},
			menu: [{
				'title': 'Disease',
				'class': 'collapsible-header waves-effect waves-teal z-depth-1',
				'rows': $scope.dashboard.getRows('disease')
			},{
				'title': 'Province',
				'class': 'collapsible-header waves-effect waves-teal z-depth-1',
				'rows': $scope.dashboard.getRows('province')				
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Outbreaks',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									indicator: '*',
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
							title: 'Individual Cases',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									indicator: 'u5male + u5female + o5male + o5female',
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
							title: 'Deaths',							
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									indicator: 'u5death + o5death',
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
							options: {
								// on click popup
								onClick: function(date, nb) {
									if(nb){
										ngmModal.open({
											type: 'table',
											style: 'top-padding:70px; width:70%;',
											template: "'views/modals/dews.modal.html'",
											date: moment(date).format('DD MMMM, YYYY'),
											loading: true,
											materialize: {
												dismissible: false
											},
											request: {
												method: 'POST',
												url: appConfig.host + '/dews/summary',
												data: {
													date: moment(date).format('YYYY-MM-DD'),
													disease: $scope.dashboard.disease.id,
													prov_code: $scope.dashboard.location.id
												}
											}
										});
									}
								}
							},
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/calendar',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
								overlays: {
									outbreaks: {
										name: 'Outbreaks',
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
								url: appConfig.host + '/dews/markers',
								data: {
									layer: 'outbreaks',
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id,
									message: '<div class="count" style="text-align:center">__{ "value": feature.properties.incidents }__</div> cases in __{ "value": feature.properties.district }__'
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
		$scope.$parent.ngm.dashboard.model = $scope.model;
		
	}]);