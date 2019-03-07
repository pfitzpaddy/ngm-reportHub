/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardEthCtcCtrl
 * @description
 * # DashboardEthCtcCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardReporthubSnapshot', [
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
					$scope.dashboard.title = 'ReportHub';
					$scope.dashboard.subTitle = 'Humanitarian Decision Support in Real-Time';

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

					// set param
					$scope.dashboard.setParams();
					
					// model
					$scope.model = {
						name: 'immap_drr_dashboard',
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
								styleClass: 's12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/tools/reportHub_monitoring.png"></img>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel blue-grey',
									style: "padding:0px;",
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/monitoring/ReportHub-admin-wash.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel blue-grey',
									style: "padding:0px;",
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/monitoring/ReportHub_health_4w.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel blue-grey',
									style: "padding:0px;",
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/monitoring/ReportHub-ctc-assessment.png"></img>'
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
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/reporthub/exports/csv.png', 'Data Export' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/reporthub/exports/powerbi.png', 'Power Bi Integration' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/reporthub/exports/hpc.tools.png', 'Direct Links to HPC.tools' )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12',
								widgets: [{
									type: 'html',
									card: 'card-panel blue-grey',
									style: "padding:0px;",
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/usage.png"></img>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12',
								widgets: [{
									type: 'html',
									card: 'card-panel blue-grey',
									style: "padding:0px;",
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/usage_2018.png"></img>'
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
										html: '<img width="100%" src="images/snapshots/reporthub/contact/contact_card_pfitzgerald_rh.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/contact/contact_card_timur.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/contact/contact_card_fakhri.png"></img>'
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
										html: '<img width="100%" src="images/snapshots/reporthub/contact/rsennoga.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/contact/contact_card_pfitzgerald_rh_ng.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/reporthub/contact/aadekunle.png"></img>'
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