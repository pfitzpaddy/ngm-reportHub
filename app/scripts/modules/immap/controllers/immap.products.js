/**
 * @ngdoc function
 * @name ngmReportHubApp.DashboardEthAssessmentsCtrl
 * @description
 * # DashboardEthAssessmentsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'ImmapProductsCtrl', [ '$scope', '$location', '$route', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', '$translate','$filter', function ( $scope, $location, $route, $timeout, ngmAuth, ngmData, ngmUser,$translate,$filter ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		
		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// url admin
			admin0pcode: $route.current.params.admin0pcode,

			// url admin
			project: $route.current.params.project,

			// url email
			email: $route.current.params.email,

			// url sector type
			product_sector_id: $route.current.params.product_sector_id,

			// url product type
			product_type_id: $route.current.params.product_type_id,

			// report start
			start_date: moment( $route.current.params.start_date ) .format( 'YYYY-MM-DD' ),

			// report end
			end_date: moment( $route.current.params.end_date ).format( 'YYYY-MM-DD' ),

			// downlaod filename
			report_filename: 'iMMAP_products_list_',

			// set path based on user
			getPath: function() {

				// if USER
				if ( $scope.report.user.roles.indexOf('ORG') === -1 ||
							$scope.report.user.roles.indexOf('ADMIN') === -1 ) {
					
					// set report variables to USER
					$scope.report.email = $scope.report.user.email;

				}

				// go with URL
				var path = '/immap/products/' + $scope.report.admin0pcode +
																	'/' + $scope.report.project +
																	'/' + $scope.report.product_sector_id +
																	'/' + $scope.report.product_type_id +
																	'/' + $scope.report.email +
																	'/' + $scope.report.start_date +
																	'/' + $scope.report.end_date;
				// return path
				return path;

			},

			// set
			setPath: function( path ) {
				// if current location is not equal to path
				if ( path !== $location.$$path ) {
					$location.path( path );
				}

			},

			// request
			getRequest: function( indicator ){
				return {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/immap/products/indicator',
						data: {
							indicator: indicator,
							admin0pcode: $scope.report.admin0pcode,
							project: $scope.report.project,
							email: $scope.report.email,
							product_sector_id: $scope.report.product_sector_id,
							product_type_id: $scope.report.product_type_id,
							start_date: $scope.report.start_date,
							end_date: $scope.report.end_date,
							// for filename downloads
							report: $scope.report.report_filename
						}
					}
			},

			// metrics
			getMetrics: function( theme, format ){
				return {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/metrics/set',
					data: {
						organization: $scope.report.user.organization,
						username: $scope.report.user.username,
						email: $scope.report.user.email,
						dashboard: 'immap_products',
						theme: theme,
						format: format,
						url: $location.$$path
					}
				}
			},

			// set menu based on URL
			setMenu: function() {

				// menu
				var menu_items = []

				// if USER
				if ( $scope.report.user.roles.indexOf('ORG') === -1 ||
							$scope.report.user.roles.indexOf('ADMIN') === -1 ) {
					menu_items = [ 'admin0pcode', 'project', 'product_sector_id', 'product_type_id' ];
				} else {
					menu_items = [ 'admin0pcode', 'project', 'product_sector_id', 'product_type_id', 'email' ];
				}

				// ngmData
				ngmData
					.get( angular.merge( $scope.report.getRequest( 'menu_items' ), 
								{ data: { menu_items: menu_items }, url: ngmAuth.LOCATION + '/api/immap/products/getProductsMenu' } ) )
					.then( function( menu  ){
						// set menu
						$scope.report.ngm.dashboard.model.menu = menu;
					});

			},

			// format subtitle
			getSubTitle: function() {
				// all params
				var subtitle = $scope.report.admin0pcode.toUpperCase() + ' | ' +
												$scope.report.project.toUpperCase() + ' | ' +
												$scope.report.email.toUpperCase() + ' | ' +
												$scope.report.product_sector_id.toUpperCase() + ' | ' +
												$scope.report.product_type_id.toUpperCase() + ' type(s)'; //+
												// '- hit <span style="font-weight:400;">REFRESH LIST</span> to fetch the latest submissions!'
				return subtitle;

			},

			// get rows based on USER
			getRows: function(){

				// controls
				var rows = [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding-top: 20px;padding-bottom: 46px;',
								config: {

									// fetch immap products
									fetchData: function(){

										// disabled btn
										$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );

										// toast
										$timeout( function(){ Materialize.toast( 'Refreshing data...' , 6000, 'note' ); }, 400 );

										// ngmData
										ngmData
											.get( { method: 'GET', url: ngmAuth.LOCATION + '/api/immap/products/getProductsData' } )
											.then( function( result  ){
												// toast
												$timeout( function(){ 
													Materialize.toast( 'iMMAP Products Updated!' , 6000, 'success' );
													$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
													$timeout( function(){
														$route.reload();
													}, 400 );
												}, 600 );
											});
									},
									request: { method: 'GET', url: ngmAuth.LOCATION + '/api/immap/products/latestUpdate' },
									templateUrl: '/scripts/widgets/ngm-html/template/immap/products/immap.product.controls.html'
								}
							}]
						}]
				}];

				// user heatmap
				var heatmap = {
						columns: [{
							styleClass: 's12',
							widgets: [{
								type: 'calHeatmap',
								card: 'card-panel',
								style: 'padding-top:5px;',
								config: {
									title: {
										style: 'padding-top: 0px;',
										name: $filter('translate')('product_submissions')
									},
									options: { itemName: 'Product', start: new Date( $scope.report.start_date ) },
									request: $scope.report.getRequest( 'calendar' )
								}
							}]
						}]
				};

				// admin widgets
				var adminWidgets = [{	
						columns: [{
							styleClass: 's12 m3',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: $filter('translate')('total_products'),
									request: $scope.report.getRequest( 'products' )
								}
							}]
						},{
							styleClass: 's12 m3',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: $filter('translate')('total_sectors'),
									request: $scope.report.getRequest( 'sectors' )
								}
							}]
						},{
							styleClass: 's12 m6',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: $filter('translate')('team_contributors'),
									request: $scope.report.getRequest( 'team' )
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m3',
							widgets: [{
								type: 'highchart',
								style: 'height: 190px;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: $filter('translate')('by_type'),
									},
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 150,
												spacing: [ 0, 0, 20, 0 ]
											},
											tooltip: {
												pointFormat: '<b>{point.y:,.0f} {series.name}</b>'
											},
											legend: {
													enabled: false
											}																	
										},
				            title: {
				              text: null
				            },
				            yAxis: {
			                title: {
			                	text: null
			                }
				            },
				            plotOptions: {
			                pie: {
			                  shadow: false
			                }
				            },
				            tooltip: {
			                formatter: function() {
			                  return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
			                }
				            },
				            series: [{
			                name: 'Product(s)',
											data: [],
			                request: $scope.report.getRequest( 'products_chart' ),
			                size: '120%',
			                innerSize: '60%',
			                showInLegend:true,
			                dataLabels: {
			                  enabled: false
			                }
				            }]
									}
								}
							}]
						},{
							styleClass: 's12 m3',
							widgets: [{
								type: 'highchart',
								style: 'height: 190px;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: {
										text: $filter('translate')('by_sector')
									},
									chartConfig: {
										options: {
											chart: {
												type: 'pie',
												height: 150,
												spacing: [ 0, 0, 20, 0 ]
											},
											tooltip: {
												pointFormat: '<b>{point.y:,.0f} {series.name}</b>'
											},
											legend: {
													enabled: false
											}																	
										},
				            title: {
				              text: null
				            },
				            yAxis: {
			                title: {
			                	text: null
			                }
				            },
				            plotOptions: {
			                pie: {
			                  shadow: false
			                }
				            },
				            tooltip: {
			                formatter: function() {
			                  return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
			                }
				            },
				            series: [{
			                name: 'Product(s)',
			                data: [],
			                request: $scope.report.getRequest( 'sectors_chart' ),
			                size: '120%',
			                innerSize: '60%',
			                showInLegend:true,
			                dataLabels: {
			                  enabled: false
			                }
				            }]
									}
								}
							}]
						},{
							styleClass: 's12 m6',
							widgets: [{
								type: 'calHeatmap',
								card: 'card-panel',
								style: 'padding-top:5px;',
								config: {
									title: {
										style: 'padding-top: 0px;',
										name: $filter('translate')('product_submissions')
									},
									options: { itemName: $filter('translate')('products_mayus1'), start: new Date( $scope.report.start_date ) },
									request: $scope.report.getRequest( 'calendar' )
								}
							}]
						}]
				}];

				// default widgets
				var defaultWidgets = [{
						columns: [{
							styleClass: 's12',
							widgets: [{
								type: 'table',
								card: 'panel',
								style: 'padding:0px; height: ' + $scope.report.ngm.style.height + 'px;',
								config: {
									style: $scope.report.ngm.style,
									headerClass: 'collection-header lighten-2',
									headerStyle: 'background-color:' + $scope.report.ngm.style.defaultPrimaryColor,
									headerText: 'white-text',
									headerIcon: 'crop_original',
									headerTitle: $filter('translate')('products_list'),
									templateUrl: '/scripts/widgets/ngm-table/templates/immap/products/immap.products.table.html',
									tableOptions:{
										count: 4
									},
									request: $scope.report.getRequest( 'list' )
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding-top: 20px;padding-bottom: 46px;',
								config: {
									style: $scope.report.ngm.style,
									request: $scope.report.getRequest( 'list' ),
									templateUrl: '/scripts/widgets/ngm-html/template/immap/products/immap.products.list.html'
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
									html: $scope.report.ngm.footer
								}
							}]
						}]
				}];

				// if USER
				if ( $scope.report.user.roles.indexOf('ORG') === -1 ||
							$scope.report.user.roles.indexOf('ADMIN') === -1 ) {
					// calendar heatmap
					rows.push( heatmap );

				} else {
					// push admin widgets
					rows.push( adminWidgets[0], adminWidgets[1] );

				}

				// push default widgets
				rows.push( defaultWidgets[0], defaultWidgets[1], defaultWidgets[2] );

				// return rows
				return rows;

			},

			// init()
			init: function(){

				// update filename
				$scope.report.report_filename += $scope.report.start_date + '-to-' + $scope.report.end_date + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' )

				// report dashboard model
				$scope.model = {
					name: 'immap_products',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m8 l8 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: 'iMMAP | ' + $scope.report.admin0pcode.toUpperCase() + ' | '+ $filter('translate')('products_mayus1')
						},
						subtitle: {
							'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
							title: $scope.report.getSubTitle()
						},
						datePicker: {
							'class': 'col s12 m4 l3',
							dates: [{
								style: 'float:left;',
								label: $filter('translate')('from'),
								format: 'd mmm, yyyy',
								min: '2017-01-01',
								max: $scope.report.end_date,
								currentTime: $scope.report.start_date,
								onClose: function(){
									// set date
									var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
									if ( date !== $scope.report.start_date ) {
										// set new date
										$scope.report.start_date = date;
										$scope.report.setPath( $scope.report.getPath() );
									}
								}
							},{
								style: 'float:right',
								label: $filter('translate')('to'),
								format: 'd mmm, yyyy',
								min: $scope.report.start_date,
								currentTime: $scope.report.end_date,
								onClose: function(){
									// set date
									var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
									if ( date !== $scope.report.end_date ) {
										// set new date
										$scope.report.end_date = date;
										$scope.report.setPath( $scope.report.getPath() );
									}
								}
							}]
						},
						download: {
							'class': 'col s12 m4 l4 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment_turned_in',
								hover: $filter('translate')('download_products_list_as_csv'),
								request: $scope.report.getRequest( 'csv' ),
								metrics: $scope.report.getMetrics( 'immap_products_list', 'csv' )
							}]
						}
					},
					menu: [],
					rows: $scope.report.getRows()
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;				
			}

		}

		// set path, menu and init
		$scope.report.setPath( $scope.report.getPath() );
		$scope.report.setMenu();
		$scope.report.init();
		
	}]);
