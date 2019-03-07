/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardWhoImmapCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardWhoImmapCtrl', [
			'$scope', 
			'$q', 
			'$http', 
			'$location', 
			'$route',
			'$rootScope',
			'$window', 
			'$timeout', 
			'$filter', 
			'ngmUser',
			'ngmAuth',
			'ngmData',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData ) {
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

				// current report
				report: 'who-immap-snapshot',

				getHtmlCard: function( img, title ) {
			    return '<a href="#/cluster">'
							     +'<div class="card small blue-grey darken-1 hoverable">'
							        +'<div class="card-image">'
							          +'<img src="' + img + '">'
							        +'</div>'
							        +'<div class="card-content white-text">'
							          // +'<p class="card-title" style="font-size:2.2rem;">' + title + '</p>'
							          +'<p class="card-title">' + title + '</p>'
							        +'</div>'
							      +'</div>'
							    +'</a>';
  			},

				getServiceHtml: function( img, title ) {
					return '<div class="card-image">'
			        +'<img src="images/' + img + '" height="180px;" width="100%">'
			      +'</div>'
			      +'<div class="card-content white-text" style="padding:14px">'
			      	+'<p class="card-title" style="font-size:1.5rem; font-weight:100;">' + title + '</p>'
			      +'</div>'
			      // +'<div class="card-action">'
			      //   +'<a href="#/cluster/projects/details/{{ panel.project.id }}">Go to Project Details</a>'
			      // +'</div>'
				},

				// set dashboard
				setDashboard: function(){
					
					// model
					$scope.model = {
						name: 'who-immap_admin_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': 'iMMAP WHO Partnership',
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': 'iMMAP supporting WHO build a better, healthier future for people all over the world',
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download Dashboard as PDF',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/print',
										data: {
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: ngmAuth.LOCATION + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1400
										}
									},
									metrics: {
					          method: 'POST',
					          url: ngmAuth.LOCATION + '/api/metrics/set',
					          data: {
					            organization: $scope.dashboard.user.organization,
					            username: $scope.dashboard.user.username,
					            email: $scope.dashboard.user.email,
					            dashboard: 'who-immap_dashboard',
					            theme: 'who-immap_dashboard_print',
					            format: 'pdf',
					            url: $location.$$path
					          }
					        }
								}]
							}
						},
						menu: $scope.dashboard.menu,
						rows: [{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/who-immap/better_data.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/who-immap/better_decisions.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/who-immap/better_outcomes.png"></img>'
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
										title: 'iMMAP Deployments',
										data: { value: 39 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Unique Emergency Locations',
										data: { value: 16 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Sponsored Months of Work Out of 60 (+174% gain)',
										data: { value: 164 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'highchart',
									style: 'height: 290px;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: { text: false },
										chartConfig: {
											options: {
												chart: {
													type: 'area',
													height: 270,
												},
												title: { text: false },
												legend:{ enabled: false },
										    plotOptions: {
										    	linecap: false,
										      series: { pointStart: 2013 }
										    }
											},
											xAxis: { lineColor: 'transparent', lineWidth: 0, tickInterval: 1 },
										  yAxis: {
										  	gridLineWidth: 0.4,
										    title: { text: 'Months of Work (p/a) Provided by iMMAP' }
										  },
									    series: [{
									    	marker: { enabled: false },
									    	data: [ 9, 24, 20, 69, 71 ]
									    },{
									    	// marker: { enabled: false },
									    	type: 'line',
									    	color: '#666',
									    	lineWidth: 1.5,
									    	data: [ 12, 12, 12, 12, 12 ]
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
										height: '420px',
										display: {
											type: 'marker',
											zoomToBounds: true
										},
										defaults: {
											zoomToBounds: true,
											center: { lat: 0, lng: 20, zoom: 4 },
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
												incidents: {
													name: 'Incidents',
													type: 'markercluster',
													visible: true,
													layerOptions: {
														maxClusterRadius: 90
													}
												}
											}
										},
										markers: {
					            maiduguri: {
				                lat: 11.834764,
				                lng: 13.1500359,
				                draggable: false
					            },
					            erbil: {
				                lat: 36.1972753,
				                lng: 43.9384434,
				                draggable: false
					            },
					            sanaa: {
				                lat: 15.3830005,
				                lng: 44.0708489,
				                draggable: false
					            },
					            conarky: {
				                lat: 9.6341969,
				                lng: -13.7197631,
				                draggable: false
					            },
					            gaziantep: {
				                lat: 37.0642902,
				                lng: 37.3639901,
				                draggable: false
					            },
					            freetown: {
				                lat: 8.4553522,
				                lng: -13.294495,
				                draggable: false
					            },
					            kabul: {
				                lat: 34.5219859,
				                lng: 69.113752,
				                draggable: false
					            },
					            manila: {
				                lat: 14.5964957,
				                lng: 120.9444543,
				                draggable: false
					            },
					            juba: {
				                lat: 4.8518363,
				                lng: 31.5647299,
				                draggable: false
					            },
					            damascas: {
				                lat: 33.5074557,
				                lng: 36.2126832,
				                draggable: false
					            },
					            addis: {
				                lat: 8.9987651,
				                lng: 38.7502699,
				                draggable: false
					            },
					            bangui: {
				                lat: 4.378219,
				                lng: 18.5069864,
				                draggable: false
					            },
					            jordan: {
				                lat: 31.8354518,
				                lng: 35.6667483,
				                draggable: false
					            },
					            khartoum: {
												lat: 15.501501,
												lng: 32.4325082,
												draggable: false
					            },
					            kasai:{
												lat: -6.4219501,
												lng: 20.7537309,
												draggable: false
					            },
					            niger: {
												lat: 13.5127591,
												lng: 2.0489916,
												draggable: false
					            }
					          }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card small blue-grey darken-1 hoverable',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getServiceHtml( 'snapshots/who-immap/report3.png', 'Data collection, databases and reporting SYSTEMS')
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card small blue-grey darken-1 hoverable',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getServiceHtml( 'snapshots/who-immap/data_viz.jpg', 'Mapping, analysis, visualization and INFOGRAPHICS')
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card small blue-grey darken-1 hoverable',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getServiceHtml( 'snapshots/who-immap/map.jpg', 'Training, capacity building and change MANAGEMENT')
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/who-immap/contact_jon.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/who-immap/contact_abdon.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/who-immap/contact_bois.png"></img>'
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

			// set dashboard
			$scope.dashboard.setDashboard();

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);