/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardEthCtcCtrl
 * @description
 * # DashboardEthCtcCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardWhoCdc201711Ctrl', [
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

				// last update
				updatedAt: '',

				// current report
				report: $location.$$path.replace(/\//g, '_') + '-extracted-',

				// params
				setParams: function() {

					// title
					$scope.dashboard.title = 'iMMAP Team Report | November 2017';
					$scope.dashboard.subTitle = 'Information Management support to improve rapid response to public health emergencies';

				},

				// set dashboard
				setDashboard: function(){

					// set param
					$scope.dashboard.setParams();
					
					// model
					$scope.model = {
						name: 'cdc_monthly_2017_11',
						header: {
							div: {
								'class': 'col s12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $scope.dashboard.title,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': $scope.dashboard.subTitle,
							},			
						},
						menu: [],
						rows: [{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/better_data.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/better_decisions.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/better_outcomes.png"></img>'
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
										title: 'IM Products Nov',
										data: { value: 10 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'IM Training Sessions Nov',
										data: { value: 6 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Organizations Trained Nov',
										data: { value: 17 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Personnel Trained Nov',
										data: { value: 36 }
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
										title: 'IM Products Total',
										data: { value: 17 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'IM Training Sessions Total',
										data: { value: 12 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Organizations Trained Total',
										data: { value: 19 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Personnel Trained Total',
										data: { value: 43 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/201711/20171115_171935.jpg"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/201711/20171117_174407.jpg"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/201711/20171117_100308.jpg"></img>'
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
										html: '<img width="100%" src="images/snapshots/cdc/contact/contact_christophe_bois.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/contact/contact_patrick_fitzgerald.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/contact/contact_olivier_cheminat.png"></img>'
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
										html: '<img width="100%" src="images/snapshots/cdc/contact/contact_haroun_habib.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/contact/contact_olivier_papadakis.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/contact/contact_beatrice_muraguri.png"></img>'
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