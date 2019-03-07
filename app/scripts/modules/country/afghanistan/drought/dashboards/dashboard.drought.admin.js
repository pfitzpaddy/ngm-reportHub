/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDroughtCtrl
 * @description
 * # DashboardDroughtCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDroughtCtrl', [
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
		'ngmDroughtHelper',
		function ($scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmDroughtHelper) {
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
				startDate: moment($route.current.params.start).format('YYYY-MM-DD'),

				// report end
				endDate: moment($route.current.params.end).format('YYYY-MM-DD'),

				// last update
				updatedAt: '',

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				setMenu: function (role) {

					ngmData
						.get(ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'organizations', true))
						.then(function (organizations) {
							
							
							// add menu
							$scope.model.menu.push(ngmDroughtHelper.getMenu());
							
							if (role === 'super') {

								// add Cluster based on admin0pcode
								// $scope.model.menu.push(ngmDroughtHelper.getClusterRows($scope.dashboard.user.admin0pcode));

								//add All cluster
								$scope.model.menu.push(ngmDroughtHelper.getClusterRows('all'));
							}
							if (role !== 'user' ) {
								// add organization to menu						
								$scope.model.menu.push(ngmDroughtHelper.getOrganizationRows(organizations));								
								
							}
							
							// add province menu
							$scope.model.menu.push(ngmDroughtHelper.getProvinceRows());
						
							if ($route.current.params.province !== 'all') {
								$scope.model.menu.push(ngmDroughtHelper.getDistrictRows());
								
							}

							
							// add month to menu
							$scope.model.menu.push(ngmDroughtHelper.getMonthRows());

							//add plan to menu
							$scope.model.menu.push(ngmDroughtHelper.getPlanRows());

							
						})

				},

				setRequest: function () {
						 	$scope.beneficiaryStat = ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'total', false);
							$scope.activityStat = ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'activities', false);
							$scope.clusterStat = ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'cluster', false);
							$scope.organizationStat = ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'organizations', false);
							$scope.locationStat = ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'locations', false);					
				},
				setLink:function (){
					link = { 
						reset: '#/response/afghanistan/drought/dashboard/' + $route.current.params.status_plan, 
						currentMonth: '#/response/afghanistan/drought/dashboard/' + $route.current.params.status_plan + '/' + moment().year() + '/all/all/all/all/' + (moment().month()+1)+'/' + moment().startOf('month').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')}
					return link;
				},
				setParams:function () {
					// if ($scope.dashboard.user.roles.indexOf('SUPERADMIN') !== -1) {
					// 	ngmDroughtHelper.setParams({

					// 		url: '#/response/afghanistan/drought/dashboard',
					// 		statusPlan: $route.current.params.status_plan,
					// 		year: $route.current.params.year,
					// 		cluster: $route.current.params.cluster,
					// 		province: $route.current.params.province,
					// 		district: $route.current.params.district,
					// 		organization: $route.current.params.organization,
					// 		month: $route.current.params.month,
					// 		startDate: $scope.dashboard.startDate,
					// 		endDate: $scope.dashboard.endDate,
					// 		user: $scope.dashboard.user
					// 	});
					// } else if ($scope.dashboard.user.roles.indexOf('ADMIN') !== -1) {
					// 	ngmDroughtHelper.setParams({

					// 		url: '#/response/afghanistan/drought/dashboard',
					// 		statusPlan: $route.current.params.status_plan,
					// 		year: $route.current.params.year,
					// 		cluster: $scope.dashboard.user.cluster_id,
					// 		province: $route.current.params.province,
					// 		district: $route.current.params.district,
					// 		organization: $route.current.params.organization,
					// 		month: $route.current.params.month,
					// 		startDate: $scope.dashboard.startDate,
					// 		endDate: $scope.dashboard.endDate,
					// 		user: $scope.dashboard.user
					// 	});
					// } else {
					// 	// USER
					// 	ngmDroughtHelper.setParams({

					// 		url: '#/response/afghanistan/drought/dashboard',
					// 		statusPlan: $route.current.params.status_plan,
					// 		year: $route.current.params.year,
					// 		cluster: $scope.dashboard.user.cluster_id,
					// 		province: $route.current.params.province,
					// 		district: $route.current.params.district,
					// 		organization: $scope.dashboard.user.organization_tag,
					// 		month: $route.current.params.month,
					// 		startDate: $scope.dashboard.startDate,
					// 		endDate: $scope.dashboard.endDate,
					// 		user: $scope.dashboard.user
					// 	});
						
						
						

					// }
					ngmDroughtHelper.setParams({

						url: '#/response/afghanistan/drought/dashboard',
						statusPlan: $route.current.params.status_plan,
						year: $route.current.params.year,
						cluster: $route.current.params.cluster,
						province: $route.current.params.province,
						district: $route.current.params.district,
						organization: $route.current.params.organization,
						month: $route.current.params.month,
						startDate: $scope.dashboard.startDate,
						endDate: $scope.dashboard.endDate,
						user: $scope.dashboard.user
					});
				},
				setDownloadDescription:function(){
					if($route.current.params.month !== 'all'){
						description = {
							report: 'drought_beneficiaries_' + $route.current.params.status_plan + '_' + moment.months(parseInt($route.current.params.month)).format('MMM') + '_' + $scope.dashboard.startDate+'/'+ $scope.dashboard.endDate
						}					
					} else {
						description = {
							report: 'drought_beneficiaries_' + $route.current.params.status_plan +'_all_months'+ '_' + moment().format('YYYY-MM-DD')
						}
					}
					return description
				},
				// set dashboard
				setDashboard: function () {

					// report name
					$scope.dashboard.report += moment().format('YYYY-MM-DDTHHmm');
					// set params for service
					$scope.dashboard.setParams();
					

					// $scope.dashboard.setMenu();
					$scope.dashboard.setRequest();
					// model
					$scope.model = {
						name: 'drought_admin_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m10 l10 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $route.current.params.year + ' ' + 'Drought Response' + ' | ' + ngmDroughtHelper.getTitle(),//+ $scope.dashboard.user.admin0pcode + ' | ' + $scope.dashboard.user.cluster + ' | ' + $scope.dashboard.user.organization,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': 'Afghanistan Drought Response' +' | '+ ngmDroughtHelper.getSubtitle(),
							},
							download: {
								'class': 'col s12 m2 l2 hide-on-small-only',
								downloads: [						
								 {
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'group',
									hover: 'Download Drought Beneficiaries as CSV',
										request: angular.merge({}, ngmDroughtHelper.getRequest('/drought/afghanistan/beneficiaries/data', 'data', false), { data: $scope.dashboard.setDownloadDescription() }),
										metrics: ngmDroughtHelper.getMetrics('drought_beneficiaries', 'csv')
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
										fetchData: function () {

											// disabled btn
											$('#dashboard-fetch-btn').toggleClass('disabled');

											// toast
											$timeout(function () { Materialize.toast('Refreshing data...', 6000, 'note'); });

											// ngmData
											ngmData
												.get({ method: 'GET', url: ngmAuth.LOCATION + '/api/nutrition/afghanistan/getKoboData' })
												.then(function (result) {

													// toast
													$timeout(function () {
														Materialize.toast('Nutrition Reports data updated!', 4000, 'success');
														$('#dashboard-fetch-btn').toggleClass('disabled');
														$timeout(function () {
															$route.reload();
														}, 400);
													}, 600);

												});

										},
										request: ngmDroughtHelper.getLatestUpdate('drought/afghanistan/latestUpdate'),
										// link:$scope.dashboard.setLink(),
										getPreviousMonth: function() {
											// get dates
											var start_date = moment(new Date($scope.dashboard.startDate)).utc().subtract(1, 'M').startOf('M').format('YYYY-MM-DD');
											var end_date = moment(new Date($scope.dashboard.endDate)).utc().subtract(1, 'M').endOf('M').format('YYYY-MM-DD');
											var previousMonth = parseInt(moment().month(moment(start_date).format('MMM')).format("M"))-1;
											if (parseInt(moment(end_date).format("YYYY")) <= parseInt($route.current.params.year)){
												var setYear = moment(end_date).format("YYYY");
											} else{
												var setYear = moment(end_date).format("YYYY");
											}
											var setYear = parseInt(moment(end_date).format("YYYY")) ;	
											
											// set dates
											$scope.dashboard.startDate = start_date;
											$scope.dashboard.endDate = end_date;
											var path = '/response/afghanistan/drought/dashboard/' + $route.current.params.status_plan + '/' + setYear + '/' + $route.current.params.cluster + '/' + $route.current.params.province+'/'+$route.current.params.district+'/'+$route.current.params.organization+'/'+previousMonth+'/'+start_date+'/'+end_date;
											
											//set Path
											$location.path( path );
										},
										reset: '#/response/afghanistan/drought/dashboard/all', //+ $route.current.params.status_plan,
										getCurrentMonth: '#/response/afghanistan/drought/dashboard/' + $route.current.params.status_plan + '/' + moment().year() + '/all/all/all/all/' + (moment().month() - 1) + '/' + moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD') + '/' + moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
										templateUrl: '/scripts/widgets/ngm-html/template/drought.dashboard.html'
									}
								}]
							}]
						}, {
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Beneficiaries',
										request: $scope.beneficiaryStat
									}
								}]
							}]
						}, {
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">ACTIVITY</h2>'
									}
								}]
							}]
						}, {
							columns: [{
								styleClass: 's12 m3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Clusters',
										request: $scope.clusterStat
									}
								}]
							}, {
									styleClass: 's12 m3',
									widgets: [{
										type: 'stats',
										style: 'text-align: center;',
										card: 'card-panel stats-card white grey-text text-darken-2',
										config: {
											title: 'Organizations',
											request: $scope.organizationStat
										}
									}]
							},{
								styleClass: 's12 m3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Locations',
										request: $scope.locationStat
									}
								}]
							},  {
									styleClass: 's12 m3',
									widgets: [{
										type: 'stats',
										style: 'text-align: center;',
										card: 'card-panel stats-card white grey-text text-darken-2',
										config: {
											title: 'Activities',
											request: $scope.activityStat
										}
									}]
							},]
						}, {
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
													layerOptions: {
														continuousWorld: true
													}
												}
											},
											overlays: {
												beneficiaries: {
													name: 'beneficiaries',
													type: 'markercluster',
													visible: true,
													layerOptions: {
														maxClusterRadius: 90
													}
												}
											}
										},
										request: ngmDroughtHelper.getRequest('drought/afghanistan/beneficiaries/indicator', 'markers', false)
									}
								}]
							}]
							}, {
								columns: [{
									styleClass: 's12 m12 l12',
									widgets: [{
										type: 'html',
										card: 'card-panel',
										style: 'padding:0px;',
										config: {
											html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">REPORTS</h2>'
										}
									}]
								}]
						}, {
								columns: [{
									styleClass: 's12 m12 l12',
									widgets: [{
										type: 'calHeatmap',
										card: 'card-panel',
										style: 'padding-top:5px;',
										config: {
											title: {
												style: 'padding-top: 10px;',
												name: 'Reports Timeline'
											},
											templateUrl: '/scripts/modules/country/afghanistan/drought/views/drought.heatmap.html',
											showCount:true,
											options: { itemName: 'Reports(s)', start: new Date($scope.dashboard.startDate) },
											request: ngmDroughtHelper.getRequest('drought/afghanistan/indicator', 'calendar')
										}
									}]
								}]
						}, {
								columns: [{
									styleClass: 's12 m12 l12 remove',
									widgets: [{
										type: 'table',
										card: 'panel',
										style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
										config: {
											user: $scope.dashboard.user,
											cluster_id: $scope.dashboard.user.cluster_id,
											showTitle: $scope.dashboard.report_type === 'activity' ? true : false,
											style: $scope.dashboard.ngm.style,
											headerClass: 'collection-header teal lighten-2',
											headerText: 'white-text',
											headerIcon: 'assignment_turned_in',
											headerTitle: 'Reports Submitted',
											templateUrl: '/scripts/modules/country/afghanistan/drought/views/drought.admin.list.html',
											tableOptions: {
												count: 10
											},
											request: ngmDroughtHelper.getRequest('drought/afghanistan/indicator', 'reports', true)
											
										}
									}]
								}]
						}, {
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

			// SUPERADMIN
			if ($scope.dashboard.user.roles.indexOf('SUPERADMIN') !== -1) {
				// $scope.model.menu = $scope.dashboard.menu;
				$scope.dashboard.setMenu('super');
			} else if ($scope.dashboard.user.roles.indexOf('ADMIN') !== -1) {
				// ADMIN
				$scope.dashboard.setMenu('admin');
			} else {
				// USER
				$scope.dashboard.setMenu('user');
				
			}

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;
			

		}

	]);