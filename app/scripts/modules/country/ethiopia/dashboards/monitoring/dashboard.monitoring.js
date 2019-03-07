/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardEthCtcCtrl
 * @description
 * # DashboardEthCtcCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardEthMonitoringCtrl', [
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

				// route params
				region: $route.current.params.region,
				zone: $route.current.params.zone,
				woreda: $route.current.params.woreda,

				// report start
				startDate: moment( $route.current.params.start ) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

				// last update
				updatedAt: '',

				// current report
				report: $location.$$path.replace(/\//g, '_') + '-extracted-',

				// params
				setParams: function() {
					
					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// title
					$scope.dashboard.title = 'CTC'+' '+$filter('translate')('assessment');

					// subtitle
					$scope.dashboard.subTitle = 'CTC'+' '+$filter('translate')('assessment')+' dashboard';

					// menus & title updates
					ngmData
						.get( $scope.dashboard.getRequest( 'menu', 'region' ) )
						.then( function( region_menu  ){
							
							// set menu
							$scope.model.menu.push(region_menu.menu);
							// set next
							if( $scope.dashboard.region !== 'all' ) {
								var region_title = $filter( 'filter' )( region_menu.data, { admin1pcode: $scope.dashboard.region } )[0].admin1name
								$scope.model.header.title.title += ' | ' + region_title;
								
								// menus & title updates
								ngmData
									.get( $scope.dashboard.getRequest( 'menu', 'zone' ) )
									.then( function( zone_menu  ){
										
										// set menu
										$scope.model.menu.push(zone_menu.menu);
										// set next
										if( $scope.dashboard.zone !== 'all' ) {
											$scope.model.header.title.title += ' | ' + $filter( 'filter' )( zone_menu.data, { admin2pcode: $scope.dashboard.zone } )[0].admin2name;
										}

										// menus & title updates
										ngmData
											.get( $scope.dashboard.getRequest( 'menu', 'woreda' ) )
											.then( function( woreda_menu  ){
												
												// set menu
												$scope.model.menu.push(woreda_menu.menu);
												// set next
												if( $scope.dashboard.woreda !== 'all' ) {
													$scope.model.header.title.title = 'CTC'+' '+$filter('translate')('assessment')+' | ' + region_title  + ' | ' + $filter( 'filter' )( woreda_menu.data, { admin3pcode: $scope.dashboard.woreda } )[0].admin3name;
												}
												
											});

									});
							}

						});
				},

				// return requests
      	getRequest: function( url, indicator, report ){
	        return {
	          method: 'POST',
	          url: ngmAuth.LOCATION + '/api/ctc/' + url,
	          data: {
	            indicator: indicator,
	            region: $scope.dashboard.region,
	            zone: $scope.dashboard.zone,
	            woreda: $scope.dashboard.woreda,
	            start_date: $scope.dashboard.startDate,
	            end_date: $scope.dashboard.endDate,
	            report: report + $scope.dashboard.report
	          }
	        }

				},

	      // get http request
	      getMetrics: function( theme, format ){
	        return {
	          method: 'POST',
	          url: ngmAuth.LOCATION + '/api/metrics/set',
	          data: {
	            organization: $scope.dashboard.user.organization,
	            username: $scope.dashboard.user.username,
	            email: $scope.dashboard.user.email,
	            dashboard: 'ctc_dashboard',
	            theme: theme,
	            format: format,
	            url: $location.$$path
	          }
	        }
	      },

				// set dashboard
				setDashboard: function(){

					// set param
					$scope.dashboard.setParams();
					
					// model
					$scope.model = {
						name: 'ctc_admin_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $scope.dashboard.title,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': $scope.dashboard.subTitle,
							},
							datePicker: {
								'class': 'col s12 m4 l3',
								dates: [{
									style: 'float:left;',
									label: $filter('translate')('from'),
									format: 'd mmm, yyyy',
									max: $scope.dashboard.endDate,
									currentTime: $scope.dashboard.startDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.startDate ) {
											// set new date
											$scope.dashboard.startDate = date;
											// URL
											var path = '/who/ethiopia/monitoring/' + $route.current.params.region + 
																					 '/' + $route.current.params.zone + 
																					 '/' + $route.current.params.woreda + 
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

											// update new date
											$location.path( path );

										}
									}
								},{
									style: 'float:right',
									label: $filter('translate')('to'),
									format: 'd mmm, yyyy',
									min: $scope.dashboard.startDate,
									currentTime: $scope.dashboard.endDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.endDate ) {
											// set new date
											$scope.dashboard.endDate = date;
											// URL
											var path = '/who/ethiopia/monitoring/' + $route.current.params.region + 
																					 '/' + $route.current.params.zone + 
																					 '/' + $route.current.params.woreda + 
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

											// update new date
											$location.path( path );

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
									hover: $filter('translate')('download_ctc_assessments_as_pdf'),
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/print',
										data: {
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: ngmAuth.LOCATION + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1280
										}
									},
									metrics: $scope.dashboard.getMetrics( 'ctc_print', 'pdf' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_turned_in',
									hover: $filter('translate')('download_assessments_as_csv'),
									request: $scope.dashboard.getRequest( 'assessments/indicator', 'download', 'ctc_assessments_' ),
									metrics: $scope.dashboard.getMetrics( 'ctc_assessments', 'download' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment',
									hover: $filter('translate')('download_case_management_details_as_csv'),
									request: $scope.dashboard.getRequest( 'case_management/indicator', 'download', 'case_management_' ),
									metrics: $scope.dashboard.getMetrics( 'case_management', 'download' )
								}]
							}							
						},
						menu: [],
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										fetchData: function() {

											// disabled btn
											$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );

											// toast
											$timeout( function(){ Materialize.toast( 'Refreshing data...' , 6000, 'note' ); });

											// ngmData
											ngmData
												.get( { method: 'GET', url: ngmAuth.LOCATION + '/api/ctc/getKoboData' } )
												.then( function( result  ){

													// toast
													$timeout( function(){ 
														Materialize.toast( 'CTC Assessments data updated!' , 4000, 'success' );
														$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
														$timeout( function(){
															$route.reload();
														}, 400 );
													}, 600 );
													
												});
											
										},
										request: { method: 'GET', url: ngmAuth.LOCATION + '/api/ctc/latestUpdate' },
										templateUrl: '/scripts/widgets/ngm-html/template/ctc.dashboard.html'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('assessments'),
										request: $scope.dashboard.getRequest( 'assessments/indicator', 'total' )
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('patients'),
										request: $scope.dashboard.getRequest( 'case_management/indicator', 'patients' )
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('beds'),
										request: $scope.dashboard.getRequest( 'case_management/indicator', 'beds' )
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('doctors'),
										request: $scope.dashboard.getRequest( 'case_management/indicator', 'doctors' )
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
											name: $filter('translate')('2017_assessments_timeline'),
										},							
										options: { itemName: $filter('translate')('assessment(s)'), start: new Date( $scope.dashboard.startDate ) },
										request: $scope.dashboard.getRequest( 'assessments/indicator', 'calendar' )
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
											zoomToBounds: true
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
													layerOptions: {
														continuousWorld: true
													}
												}
											},
											overlays: {
												case_management: {
													name: 'Case Management',
													type: 'markercluster',
													visible: true,
													layerOptions: {
														maxClusterRadius: 90
													}
												}
											}
										},				
										request: $scope.dashboard.getRequest( 'case_management/indicator', 'markers' )
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