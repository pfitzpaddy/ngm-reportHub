/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardEthCtcCtrl
 * @description
 * # DashboardEthCtcCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDrrSnapshot', [
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
					$scope.dashboard.title = 'iMMAP Disaster Risk Reduction';
					$scope.dashboard.subTitle = 'Supporting the Humanitarian Community to Prepare for, Respond to and Mitigate the Impact of Natural Disasters';

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
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/drr/areas/emergency_response.png', 'Emergency Response' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/drr/areas/seasonal_planning.png', 'Seasonal Planning' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/drr/areas/situational_anlaysis.png', 'Situational Analysis' )
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="responsive-img circle" width="100%" src="images/snapshots/drr/layers/base.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="responsive-img circle" width="100%" src="images/snapshots/drr/layers/population.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="circle" width="100%" src="images/snapshots/drr/layers/infrastructure.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="responsive-img circle" width="100%" src="images/snapshots/drr/layers/humanitarian_access.png"></img>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="responsive-img circle" width="100%" src="images/snapshots/drr/layers/floods.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="responsive-img circle" width="100%" src="images/snapshots/drr/layers/avalanche.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="circle" width="100%" src="images/snapshots/drr/layers/earthquakes.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: "padding:0px; border-radius: 50% !important; width:200px; height:200px;",
									config: {
										html: '<img class="responsive-img circle" width="100%" src="images/snapshots/drr/layers/accessibility.png"></img>'
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
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/drr/products/static-maps.png', 'Static Maps' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/drr/products/print-map.png', 'Interactive Maps' )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: $scope.dashboard.getHtmlCard( 'images/snapshots/drr/products/print-dashboard.png', 'Dashboard' )
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
										html: '<img width="100%" src="images/snapshots/drr/training/hasibullah.jpg"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/drr/training/girls_gps.jpg"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<img width="100%" src="images/snapshots/drr/training/women_in_control.jpg"></img>'
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
										html: '<img width="100%" src="images/snapshots/drr/contact/contact_card_emlyn.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/drr/contact/contact_card_marisol.png"></img>'
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:10px;',
									config: {
										html: '<img width="100%" src="images/snapshots/drr/contact/contact_card_budi.png"></img>'
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