/**
 * @ngdoc function
 * @name ngmReportHubApp.DashboardEthAssessmentsCtrl
 * @description
 * # DashboardEthAssessmentsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'ImmapProductsCtrl', [ '$scope', '$location', '$route', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', function ( $scope, $location, $route, $timeout, ngmAuth, ngmData, ngmUser ) {
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
					$scope.report.admin0pcode = $scope.report.user.admin0pcode;
					$scope.report.project = $scope.report.user.project;
					$scope.report.email = $scope.report.user.email;
					$scope.report.product_sector_id = $scope.report.user.product_sector_id;

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
					menu_items = [ 'product_type_id' ];
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
				var subtitle = $scope.report.admin0pcode.toUpperCase() + ' product(s) | ' +
												$scope.report.project.toUpperCase() + ' project(s) | ' +
												$scope.report.email.toUpperCase() + ' member(s) | ' +
												$scope.report.product_sector_id.toUpperCase() + ' sector(s) | ' +
												$scope.report.product_type_id.toUpperCase() + ' type(s)'; //+
												// '- hit <span style="font-weight:400;">REFRESH LIST</span> to fetch the latest submissions!'
				return subtitle;

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
							title: 'iMMAP | ' + $scope.report.admin0pcode.toUpperCase() + ' | Products'
						},
						subtitle: {
							'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
							title: $scope.report.getSubTitle()
						},
						datePicker: {
							'class': 'col s12 m4 l3',
							dates: [{
								style: 'float:left;',
								label: 'from',
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
								label: 'to',
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
								hover: 'Download Products List as CSV',
								request: $scope.report.getRequest( 'csv' ),
								metrics: $scope.report.getMetrics( 'immap_products_list', 'csv' )
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
					},{				
						columns: [{
							styleClass: 's12 m3',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Total Products',
									request: $scope.report.getRequest( 'total' )
								}
							}]
						},{
							styleClass: 's12 m3',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'Sectors',
									request: $scope.report.getRequest( 'sectors' )
								}
							}]
						},{
							styleClass: 's12 m3',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'by Sector',
									data: { value: 3 }
								}
							}]
						},{
							styleClass: 's12 m3',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: 'by Product',
									data: { value: 4 }
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
										name: 'Product Submissions'
									},
									options: { itemName: 'Product', start: new Date( $scope.report.start_date ) },
									request: $scope.report.getRequest( 'calendar' )
								}
							}]
						}]
					},{
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
									headerTitle: 'Products List',
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
					}]
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
