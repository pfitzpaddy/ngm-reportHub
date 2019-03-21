/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardEthCtcCtrl
 * @description
 * # DashboardEthCtcCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardWhoCdc201712Ctrl', [
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
					$scope.dashboard.title = 'iMMAP Team Report | December 2017';
					$scope.dashboard.subTitle = 'Information Management support to improve rapid response to public health emergencies';

				},
				
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

				// set dashboard
				setDashboard: function(){

					// set param
					$scope.dashboard.setParams();
					
					// model
					$scope.model = {
						name: 'cdc_monthly_2017_12',
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
										title: 'IM Products Dec',
										data: { value: 8 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'IM Training Sessions Dec',
										data: { value: 2 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Organizations Trained Dec',
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
										title: 'Personnel Trained Dec',
										data: { value: 7 }
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
										data: { value: 25 }
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
										data: { value: 14 }
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
										data: { value: 21 }
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
										data: { value: 47 }
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
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/cdc/201712/ReportHub_immap_dec.png', 'Health Cluster Reporting' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/cdc/201712/immap_powerbi_dec_dashboard.png', 'Health Cluster Dashboard' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/cdc/201712/immap_powerbi_dec_meetings.png', 'Health Cluster Meetings' )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/cdc/201712/ReportHub_immap_dec.png', 'Health Cluster Reporting' )
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/cdc/201712/immap_powerbi_dec_meetings.png', 'Health Cluster Contacts' )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel blue-grey darken-1',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/cdc/201712/ocha_3w.png"></img>'
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