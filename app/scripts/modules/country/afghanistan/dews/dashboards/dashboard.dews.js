/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	// modal controller
	.controller('DashboardDewsCtrl', ['$rootScope', '$scope', '$http', '$location', '$route', '$window', '$timeout', 'ngmAuth', 'ngmUser', 
		function ($rootScope, $scope, $http, $location, $route, $window, $timeout, ngmAuth, ngmUser) {
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

			// data lookup
			data: {
				disease: {
					'all': { id: '*', name:'All'},
					'abd': { id: 1, name: 'ABD' },
					'h1n1': { id: 2, name: 'A/H1N1' },
					'ai': { id: 3, name: 'AI' },
					'anthrax': { id: 4, name:'Anthrax'},
					'pneumonia': { id: 5, name:'ARI/Pneumonia'},
					'avh': { id: 6, name:'AVH'},
					'awd': { id: 7, name: 'AWD' },
					'brucellosis': { id: 8, name: 'Brucellosis' },
					'cchf': { id: 9, name:'CCHF'},
					'chickenpox': { id: 10, name:'Chickenpox'},
					'cholera': { id: 11, name:'Cholera'},
					'conjunctivitis': { id: 12, name:'Conjunctivitis'},
					'dengue': { id: 13, name:'Dengue'},
					'dermatitis': { id: 14, name:'Dermatitis'},
					'diphtheria': { id: 15, name:'Diphtheria'},
					'rabies': { id: 16, name:'Dog Bite/Rabies'},
					'encephalopathy': { id: 17, name:'Encephalopathy'},
					'furanclosis': { id: 18, name:'Furanclosis'},
					'leishmaniasis': { id: 19, name:'Leishmaniasis'},
					'malaria': { id: 20, name:'Malaria'},
					'faintings': { id: 21, name:'Mass Faintings'},
					'psychogenic': { id: 22, name:'Mass Psychogenic'},
					'measles': { id: 23, name:'Measles'},
					'meningitis': { id: 24, name:'Meningitis'},
					'mumps': { id: 25, name:'Mumps'},
					'pertussis': { id: 26, name:'Pertussis'},
					'poisoning': { id: 27, name:'Poisoning'},
					'vaccin': { id: 28, name:'Post Vaccin Side Effect'},
					'poultry-death': { id: 29, name:'Poultry Death Report'},
					'scabies': { id: 30, name:'Scabies'},
					'tb': { id: 31, name:'TB'},
					'tinea': { id: 32, name:'Tinea'},
					'typhoid': { id: 33, name:'Typhoid'},
					'unknown': { id: 34, name:'Unknown'},
					'vod': { id: 35, name:'VOD (Gulran Disease)'},
					'xerosis': { id: 36, name:'Xerosis'}
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

			// simple navigation object
			getBreadcrumb: function() {

				// bradcrumb, default home
				var breadcrumb = [{
							title: 'DEWS',
							href: '#/who/dews/afghanistan/all/' + $route.current.params.start + '/' + $route.current.params.end
						},{
							title: 'Afghanistan',
							href: '#/who/dews/afghanistan/' + $route.current.params.disease + '/' + $route.current.params.start + '/' + $route.current.params.end
						}];

				// push location if not Afghanistan
				if ($scope.dashboard.location.id !== '*' ) {
					breadcrumb.push({
							title: $scope.dashboard.location.name,
							href: '#/who/dews/' + $route.current.params.location + '/all/' + $route.current.params.start + '/' + $route.current.params.end
						});
				}

				// push disease
				breadcrumb.push({
						title: $scope.dashboard.disease.name,
						href: '#/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $route.current.params.start + '/' + $route.current.params.end
					});

				// return object
				return breadcrumb;

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
							'param': 'disease',
							'active': key,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/who/dews/' + $route.current.params.location + '/' + key + '/' + $route.current.params.start + '/' + $route.current.params.end
						});
					});

				} else {
					// for each disease
					angular.forEach($scope.dashboard.data.location, function(d, key){
						//
						rows.push({
							'title': d.name,
							'param': 'location',
							'active': key,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/who/dews/' + key + '/' + $route.current.params.disease + '/' + $route.current.params.start + '/' + $route.current.params.end
						});
					});
				}

				return rows;
			}
		}

		// report
		$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');

		// set dashboard params
		$scope.dashboard.location = $scope.dashboard.data.location[$route.current.params.location];
		$scope.dashboard.disease = $scope.dashboard.data.disease[$route.current.params.disease];
		$scope.dashboard.title = 'DEWS | ' + $scope.dashboard.location.name + ' | ' + $scope.dashboard.disease.name;
		$scope.dashboard.subtitle = $scope.dashboard.disease.name + ' Disease Early Warning System Key Indicators ' + $scope.dashboard.location.name;

		// get funky with the calendar heatmap dates
		if ( moment.duration( moment( $scope.dashboard.endDate ).diff( $scope.dashboard.startDate ) ).asMonths() > 11  ) {

			// start date
			var date = moment( $scope.dashboard.startDate );

			// if the end dates differ from storage, 
			if ( localStorage.getItem('dewsEndDate') && localStorage.getItem('dewsEndDate') !== $scope.dashboard.endDate ) {
				date = moment( $scope.dashboard.endDate ).subtract( 11, 'M' );
			}
			
			// manipulate heatmap date
			$scope.dashboard.heatmapStartDate = new Date( date.format('YYYY-MM-DD') );

		} else {
			
			// diff between dates in months
			var month = parseInt( moment.duration( moment( $scope.dashboard.endDate ).diff( $scope.dashboard.startDate ) ).asMonths().toFixed(0) );

			// divide by 12 months
			month = ( month === 1 ) ? 12 / 2 : 12 / month;

			// set start date
			$scope.dashboard.heatmapStartDate = new Date( moment( $scope.dashboard.startDate ).subtract( month+1, 'M' ).format( 'YYYY-MM-DD' ) );

		}

		// store for future use to determine user direction of query
		localStorage.setItem( 'dewsStartDate', $scope.dashboard.startDate );
		localStorage.setItem( 'dewsEndDate', $scope.dashboard.endDate );

		// dews dashboard model
		$scope.model = {
			name: 'who_dews_dashboard',
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
					'class': 'col hide-on-small-only m8 l9 report-subtitle',
					'title': $scope.dashboard.subtitle,
				},
				datePicker: {
					'class': 'col s12 m4 l3',
					dates: [{
						style: 'float:left;',
						label: 'from',
						format: 'd mmm, yyyy',
						max: $scope.dashboard.endDate,
						currentTime: $scope.dashboard.startDate,
						onClose: function(){
							// set date
							var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
							if ( date !== $scope.dashboard.startDate ) {
								// set new date
								$scope.dashboard.startDate = date;
								// update new date
								$location.path('/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
							}

						}
					},{
						style: 'float:right',
						label: 'to',
						format: 'd mmm, yyyy',
						min: $scope.dashboard.startDate,
						currentTime: $scope.dashboard.endDate,
						onClose: function(){
							// set date
							var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
							if ( date !== $scope.dashboard.endDate ) {
								// set new date
								$scope.dashboard.endDate = date;
								// update new date
								$location.path('/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate);
							}

						}
					}]
				},
				download: {
					'class': 'col s12 m4 l4 hide-on-small-only',
					downloads: [{
						type: 'pdf',
						color: 'blue lighten-1',
						icon: 'picture_as_pdf',
						hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as PDF',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/print',
							data: {
								report: $scope.dashboard.report,
								printUrl: $location.absUrl(),
								downloadUrl: ngmAuth.LOCATION + '/report/',
								user: $scope.dashboard.user,
								pageLoadTime: 6400
							}
						},
						metrics: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/metrics/set',
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
					},{
						type: 'csv',
						color: 'blue lighten-1',
						icon: 'library_books',
						hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as CSV',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/dews/data',
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
							url: ngmAuth.LOCATION + '/api/metrics/set',
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
					}]
				}
			},		
			menu: [{
				'id': 'search-dews-disease',
				'search': true,
				'icon': 'group_work',
				'title': 'Disease',
				'class': 'teal lighten-1 white-text',
				'rows': $scope.dashboard.getRows('disease')
			},{
				'id': 'search-dews-province',
				'search': true,
				'icon': 'place',
				'title': 'Province',
				'class': 'teal lighten-1 white-text',
				'rows': $scope.dashboard.getRows('province')
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'modal',
						config: {
							id: 'ngm-dews-modal',
							materialize: {
								dismissible: false
							}
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						'style': 'padding-top: 10px;',
						config: {
							color: $scope.dashboard.ngm.style.darkPrimaryColor,
							templateUrl: '/scripts/widgets/ngm-html/template/breadcrumb.html',
							breadcrumb: $scope.dashboard.getBreadcrumb()
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
							title: 'Outbreaks',
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/dews/indicator',
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
								url: ngmAuth.LOCATION + '/api/dews/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									// indicator: 'u5male + u5female + o5male + o5female + u5death + o5death',
									indicator: 'total_cases + total_deaths',
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
								url: ngmAuth.LOCATION + '/api/dews/indicator',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									// indicator: 'u5death + o5death',
									indicator: 'total_deaths',
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
						type: 'calHeatmap',
						card: 'card-panel',
						style: 'padding-top:5px;',
						config: {
							title: {
								style: 'padding-top: 10px;',
								name: $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name + ' - 1 Year Timeline'
							},							
							options: {
								
								// calendar start date
								start: $scope.dashboard.heatmapStartDate,

								// onclick modal
								onClick: function(date, nb) {

									// broadcast calendar click
									if ( nb ) {

										// params for modal
										var params = {
											date: date,
											request: {
												method: 'POST',
												url: ngmAuth.LOCATION + '/api/dews/summary',
												data: {
													date: moment(date).format('YYYY-MM-DD'),
													disease: $scope.dashboard.disease.id,
													prov_code: $scope.dashboard.location.id
												}
											}											
										}

										// fire modal open event
										$rootScope.$broadcast( 'ngm-dews-modal', params );
									}

								}

							},
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/dews/calendar',
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
						type: 'highchart',
						style: 'height: 160px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: {
								text: 'Outbreaks - Trend',
							},
							chartConfig: {
								options: {
									chart: {
										height: 120,
										width: 794,
										type: 'line',
										zoomType: 'x',
										events: {
											selection: function(event){
												
												// if xaxis udpate
												if(event.xAxis) {

													// calculate date changes
													var start = moment($scope.dashboard.startDate).add( event.xAxis[0].min, 'd' ).format('YYYY-MM-DD');
													var end = moment($scope.dashboard.startDate).add( event.xAxis[0].max, 'd' ).format('YYYY-MM-DD');
													var path = '/who/dews/' + $route.current.params.location + '/' + $route.current.params.disease + '/' + start + '/' + end;

													// toast
													Materialize.toast('Updating Dashboard!', 3000, 'success');
													
													// update
													$timeout(function() {
														$location.path(path);
														$scope.$apply()
													}, 100);

												}
											}
										}
									},
									legend: {
										enabled: false
									},
									plotOptions: {
										series: {
											marker: {
												enabled: false
											}
										}
									}
								},
								title: {
									text: ''
								},
								xAxis: {
									// min: Highcharts.dateFormat('%Y-%m-%d', $scope.dashboard.startDate),
									type: 'category',
									tickInterval: 60
								},
								yAxis: {
									min: 0,
									title: {
										text: ' '
									},
									gridLineColor: '#fff'
								},
								series: [{
									name: 'Incidents',
									color: '#7cb5ec',
									turboThreshold: 0,
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/dews/chart',
										data: {
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											disease: $scope.dashboard.disease.id,
											prov_code: $scope.dashboard.location.id
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
								type: 'marker'
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
								url: ngmAuth.LOCATION + '/api/dews/markers',
								data: {
									layer: 'outbreaks',
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