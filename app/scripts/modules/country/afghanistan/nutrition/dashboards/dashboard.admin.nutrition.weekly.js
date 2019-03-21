/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardNutritionWeeklyAdminCtrl
 * @description
 * # DashboardNutritionWeeklyAdminCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardNutritionWeeklyAdminCtrl', [
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
			'ngmNutritionHelper','$translate','$filter',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmNutritionHelper, $translate, $filter ) {
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
				startDate: moment( $route.current.params.start ) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

				// last update
				updatedAt: '',

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				setMenu: function(){

					ngmData
						.get( ngmNutritionHelper.getRequest( 'nutrition/afghanistan/beneficiaries/indicator', 'organizations', true ) )
						.then( function( organizations  ){
						// add menu
						$scope.model.menu.push(ngmNutritionHelper.getMenu());
						// add province menu
						$scope.model.menu.push(ngmNutritionHelper.getProvinceRows());

						if ( $route.current.params.province !== 'all' ) {
							$scope.model.menu.push(ngmNutritionHelper.getDistrictRows());
						}

						// add organization to menu						
						$scope.model.menu.push(ngmNutritionHelper.getOrganizationRows(organizations));				
						// add weeks to menu
						$scope.model.menu.push(ngmNutritionHelper.getWeekRows());
						})

				},

				// set dashboard
				setDashboard: function(){

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// set params for service
					ngmNutritionHelper.setParams({
						url: '#/nutrition/afghanistan/admin',
						year: $route.current.params.year,
						province: $route.current.params.province,
						district: $route.current.params.district,
						organization: $route.current.params.organization,
						week: $route.current.params.week,
						startDate: $scope.dashboard.startDate,
						endDate: $scope.dashboard.endDate,
						user: $scope.dashboard.user
					});
					
					$scope.dashboard.setMenu();
					
					// model
					$scope.model = {
						name: 'nutrition_admin_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': ngmNutritionHelper.getTitle(true),
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': ngmNutritionHelper.getSubtitle(true),
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
											$scope.dashboard.startDate = moment(date).add(1, 'day').startOf('isoWeek').subtract(1, 'day').format( 'YYYY-MM-DD' );
											// URL
											var path = '/nutrition/afghanistan/admin/' + $route.current.params.year + 
																					 '/' + $route.current.params.province + 
																					 '/' + $route.current.params.district +
																					 '/' + $route.current.params.organization +
																					 '/' + $route.current.params.week +
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

											// update new date
											$location.path( path ); $route.reload();

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
											$scope.dashboard.endDate = moment(date).add(1, 'day').endOf('isoWeek').format( 'YYYY-MM-DD' );
											// URL
											var path = '/nutrition/afghanistan/admin/' + $route.current.params.year + 
																					 '/' + $route.current.params.province + 
																					 '/' + $route.current.params.district +
																					 '/' + $route.current.params.organization +
																					 '/' + $route.current.params.week +
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

											// update new date
											$location.path( path ); $route.reload();

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
									hover: $filter('translate')('download_dashboard_as_pdf'),
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
									metrics: ngmNutritionHelper.getMetrics( 'nutrition_print', 'pdf' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment',
									hover: $filter('translate')('download_reports_data_as_csv'),
									request: angular.merge({}, ngmNutritionHelper.getRequest( 'nutrition/afghanistan/indicator', 'data', false ), { data: { report: $scope.dashboard.report } } ),
									metrics: ngmNutritionHelper.getMetrics( 'nutrition_reports', 'csv' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'group',
									hover: $filter('translate')('download_beneficiaries_as_csv'),
									request: angular.merge({}, ngmNutritionHelper.getRequest( 'nutrition/afghanistan/beneficiaries/data', 'data', false ), { data: { report: 'beneficiaries_' + $scope.dashboard.report } } ),
									metrics: ngmNutritionHelper.getMetrics( 'nutrition_beneficiaries', 'csv' )
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
										id: 'dashboard-btn',
										fetchData: function() {

											// disabled btn
											$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );

											// toast
											$timeout( function(){ Materialize.toast( 'Refreshing data...' , 6000, 'note' ); });

											// ngmData
											ngmData
												.get( { method: 'GET', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/getKoboData' } )
												.then( function( result  ){

													// toast
													$timeout( function(){ 
														Materialize.toast( 'Nutrition Reports data updated!' , 4000, 'success' );
														$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
														$timeout( function(){
															$route.reload();
														}, 400 );
													}, 600 );
													
												});
											
										},
										request: { method: 'GET', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/latestUpdate' },
										templateUrl: '/scripts/widgets/ngm-html/template/nutrition.admin.html'
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
										title: $filter('translate')('submitted_reports'),
										request: ngmNutritionHelper.getRequest( 'nutrition/afghanistan/beneficiaries/indicator', 'submitted_reports', false )
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('duplicate_reports'),
										request: ngmNutritionHelper.getRequest( 'nutrition/afghanistan/indicator', 'duplicate_reports', false )
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
											name: $filter('translate')('reports_timeline')
										},							
										options: { itemName: 'Reports(s)', start: new Date( $scope.dashboard.startDate ) },
										request: ngmNutritionHelper.getRequest( 'nutrition/afghanistan/indicator', 'calendar' )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'table',
									card: 'panel',
									style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
									config: {
										style: $scope.dashboard.ngm.style,
										headerClass: 'collection-header red lighten-2',
										headerText: 'white-text',
										headerIcon: 'assignment_late',
										headerTitle: $filter('translate')('duplicate_reports'),
										templateUrl: '/scripts/widgets/ngm-table/templates/nutrition/nutrition.list.html',
										tableOptions:{
											count: 10
										},
										request: ngmNutritionHelper.getRequest( 'nutrition/afghanistan/indicator', 'duplicate_reports', true ),
										fetchData: function( pk,dataid ) {

											// disabled btn
											$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
											$( '#nutrition-edit-btn'+dataid ).toggleClass( 'disabled' );
											// toast
											$timeout( function(){ Materialize.toast( 'Please Wait...' , 6000, 'note' ); });

											// ngmData
											ngmData
												.get( { method: 'GET', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/reports/edit/' + pk + '/' + dataid } )
												.then( function( result ){
													
													// toast
													$timeout( function(){ 
														Materialize.toast( 'Opening Report...' , 1000, 'success' );
														$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
														$( '#nutrition-edit-btn'+dataid ).toggleClass( 'disabled' );
														$timeout( function(){
															var parser = document.createElement('a');
															parser.href = result.url;
															var pathname = parser.pathname;
															var search = parser.search;
															var pathname = window.open( '#/nutrition/afghanistan/form' + pathname + search , '_blank');
															// window.open( result.url , '_blank');
															// $route.reload();
														}, 400 );
													}, 600 );
													
												});
											
										},

										modalDelete: function( modal, pk, dataid ){

											this.pk = pk;
											this.dataid = dataid;
											$( '#' + modal ).openModal( { dismissible: false } );

										},

										deleteForm: function( pk, dataid ){
											// disabled btn
											$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
											$( '#nutrition-delete-btn'+dataid ).toggleClass( 'disabled' );

											$timeout( function(){ Materialize.toast( 'Please Wait...' , 6000, 'note' ); });
											// ngmData
											ngmData
												.get( { method: 'DELETE', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/reports/delete/' + pk + '/' + dataid } )
												.then( function( result  ){
													
													// toast
													$timeout( function(){ 
														Materialize.toast( 'Deleting Report...' , 1000, 'success' );
														$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
														$( '#nutrition-delete-btn'+dataid ).toggleClass( 'disabled' );
														$timeout( function(){
															$route.reload();
														}, 400 );
													}, 600 );
													
												});
										},

										setParams: function (pk, dataid){
											this.pk = pk;
											this.dataid = dataid;
										},
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12 remove',
								widgets: [{
									type: 'table',
									card: 'panel',
									style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
									config: {
										style: $scope.dashboard.ngm.style,
										headerClass: 'collection-header teal lighten-2',
										headerText: 'white-text',
										headerIcon: 'assignment_turned_in',
										headerTitle: $filter('translate')('reports_submitted'),
										templateUrl: '/scripts/widgets/ngm-table/templates/nutrition/nutrition.list.html',
										tableOptions:{
											count: 10
										},
										request: ngmNutritionHelper.getRequest( 'nutrition/afghanistan/indicator', 'reports_submitted', true ),
										fetchData: function(pk,dataid) {

											// disabled btn
											$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
											$( '#nutrition-edit-btn'+dataid ).toggleClass( 'disabled' );
											// toast
											$timeout( function(){ Materialize.toast( 'Please Wait...' , 6000, 'note' ); });

											// ngmData
											ngmData
												.get( { method: 'GET', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/reports/edit/' + pk + '/' + dataid } )
												.then( function( result ){
													
													// toast
													$timeout( function(){ 
														Materialize.toast( 'Opening Report...' , 4000, 'success' );
														$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
														$( '#nutrition-edit-btn'+dataid ).toggleClass( 'disabled' );
														$timeout( function(){
															var parser = document.createElement('a');
															parser.href = result.url;
															var pathname = parser.pathname;
															var search = parser.search;
															// window.open( result.url , '_blank');
															var pathname = window.open( '#/nutrition/afghanistan/form' + pathname + search , '_blank');
															// $route.reload();
														}, 400 );
													}, 600 );
													
												});
											
										},

										modalDelete: function( modal, pk, dataid ){

											this.pk = pk;
											this.dataid = dataid;
											$( '#' + modal ).openModal( { dismissible: false } );

										},

										deleteForm: function( pk, dataid ){
											// disabled btn
											$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
											$( '#nutrition-delete-btn'+dataid ).toggleClass( 'disabled' );

											$timeout( function(){ Materialize.toast( 'Please Wait...' , 6000, 'note' ); });
											// ngmData
											ngmData
												.get( { method: 'DELETE', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/reports/delete/' + pk + '/' + dataid } )
												.then( function( result  ){
													
													// toast
													$timeout( function(){ 
														Materialize.toast( 'Deleting Report...' , 4000, 'success' );
														$( '#dashboard-fetch-btn' ).toggleClass( 'disabled' );
														$( '#nutrition-delete-btn'+dataid ).toggleClass( 'disabled' );
														$timeout( function(){
															$route.reload();
														}, 400 );
													}, 600 );
													
												});
										},

										setParams: function (pk, dataid){
											this.pk = pk;
											this.dataid = dataid;
										},

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