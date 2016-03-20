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

			data: {
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
						
				// for each disease
				angular.forEach($scope.dashboard.data.location, function(d, key){
					//
					rows.push({
						'title': d.name,
						'param': 'location',
						'active': key,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/health/4w/' + key + '/' + $route.current.params.project + '/' + $route.current.params.start + '/' + $route.current.params.end
					});
				});

				return rows;
			}			

		}

		// get project_type
		// get beneficiary_type

		// set dashboard params
		$scope.dashboard.location = $scope.dashboard.data.location[$route.current.params.location];
		$scope.dashboard.project = $route.current.params.project
		$scope.dashboard.title = 'Health 4W | ' + $scope.dashboard.location.name;
		$scope.dashboard.subtitle = 'Health Cluster 4W dashboard for ' + $scope.dashboard.project + ' health projects in ' + $scope.dashboard.location.name;

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
			menu: [{
				'id': 'search-health-province',
				'search': true,
				'icon': 'place',
				'title': 'Province',
				'class': 'teal lighten-1 white-text',
				'rows': $scope.dashboard.getRows('province')
			}],			
			rows: [{
				columns: [{
					styleClass: 's12 m12 l6',
					widgets: [{
						type: 'stats',
						style: 'text-align: center;',
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
						style: 'text-align: center;',
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
						style: 'text-align: center;',
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
						style: 'text-align: center;',
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
						style: 'text-align: center;',
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
						type: 'highchart',
						style: 'height: 180px;',
						card: 'card-panel chart-stats-card white grey-text text-darken-2',
						config: {
							title: 'Children (Under 18)',
							display: {
								label: true,
								fractionSize: 1,
								subLabelfractionSize: 0,
								postfix: '%'
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
									name: 'Children (Under 18)',
									size: '100%',
									innerSize: '80%',
									showInLegend:false,
									dataLabels: {
										enabled: false
									},
									data: {
										label: {
											left: {
												label: {
													label: 'M',
													type: 'text'
												},
												subLabel: {
													label: 102000
												}
											},										
											center: {
												label: {
													label: 22,
													postfix: '%'
												},
												subLabel: {
													label: 200036
												}
											},
											right: {
												label: {
													label: 'F',
													type: 'text'
												},
												subLabel: {
													label: 102000
												}
											},
										},										
										data:[{
					            'y': 58.2,
					            'color': '#90caf9',
					            'name': 'Male',
					            'label': 102000,
					          },{
					            'y': 100 - 58.2,
					            'color': '#f48fb1',
					            'name': 'Female',
					            'label': 102000,
					          }]
					        }
								}]
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					// widgets: [{
					// 	type: 'stats',
					// 	card: 'card-panel stats-card white grey-text text-darken-2',
					// 	config: {
					// 		title: 'Adult (18 to 59)',
					// 		request: {
					// 			method: 'POST',
					// 			url: 'http://' + $location.host() + '/api/health/total',
					// 			data: {
					// 				indicator: ['over18male', 'over18female'],
					// 			}
					// 		}
					// 	}
					// }]
					widgets: [{
						type: 'highchart',
						style: 'height: 180px;',
						card: 'card-panel chart-stats-card white grey-text text-darken-2',
						config: {
							title: 'Adult (18 to 59)',
							display: {
								label: true,
								fractionSize: 1,
								subLabelfractionSize: 0,
								postfix: '%'
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
									name: 'Adult (18 to 59)',
									size: '100%',
									innerSize: '80%',
									showInLegend:false,
									dataLabels: {
										enabled: false
									},
									data: {
										label: {
											left: {
												label: {
													label: 'M',
													type: 'text'
												},
												subLabel: {
													label: 102000
												}
											},										
											center: {
												label: {
													label: 22,
													postfix: '%'
												},
												subLabel: {
													label: 200036
												}
											},
											right: {
												label: {
													label: 'F',
													type: 'text'
												},
												subLabel: {
													label: 102000
												}
											},
										},										
										data:[{
					            'y': 58.2,
					            'color': '#90caf9',
					            'name': 'Male',
					            'label': 102000,
					          },{
					            'y': 100 - 58.2,
					            'color': '#f48fb1',
					            'name': 'Female',
					            'label': 102000,
					          }]
					        }
								}]
							}
						}
					}]			
				},{
					styleClass: 's12 m12 l4',
					// widgets: [{
					// 	type: 'stats',
					// 	card: 'card-panel stats-card white grey-text text-darken-2',
					// 	config: {
					// 		title: 'Elderly (Over 59)',
					// 		request: {
					// 			method: 'POST',
					// 			url: 'http://' + $location.host() + '/api/health/total',
					// 			data: {
					// 				indicator: ['over59male', 'over59female'],
					// 			}
					// 		}
					// 	}
					// }]
					widgets: [{
						type: 'highchart',
						style: 'height: 180px;',
						card: 'card-panel chart-stats-card white grey-text text-darken-2',
						config: {
							title: 'Eldery (Over 59)',
							display: {
								label: true,
								fractionSize: 1,
								subLabelfractionSize: 0,
								postfix: '%'
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
									name: 'Eldery (Over 59)',
									size: '100%',
									innerSize: '80%',
									showInLegend:false,
									dataLabels: {
										enabled: false
									},
									data: {
										label: {
											left: {
												label: {
													label: 'M',
													type: 'text'
												},
												subLabel: {
													label: 102000
												}
											},										
											center: {
												label: {
													label: 22,
													postfix: '%'
												},
												subLabel: {
													label: 200036
												}
											},
											right: {
												label: {
													label: 'F',
													type: 'text'
												},
												subLabel: {
													label: 102000
												}
											},
										},										
										data:[{
					            'y': 58.2,
					            'color': '#90caf9',
					            'name': 'Male',
					            'label': 102000,
					          },{
					            'y': 100 - 58.2,
					            'color': '#f48fb1',
					            'name': 'Female',
					            'label': 102000,
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