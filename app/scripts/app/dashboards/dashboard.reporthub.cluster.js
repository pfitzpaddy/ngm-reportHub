/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardReportHubClusterCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardReportHubClusterCtrl', [
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
			'$translate',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData,$translate ) {
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
				startDate: '2017-04-01',

				// report end
				endDate: '2017-06-30',

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// quoite one
				getQuoteOne: function() {

					return '<div class="row" style="padding:10px;">'
										+'<div class="col center s12 m1">'
											+'<img src="images/quote2.png" width="64px;" title="Agile. Feedback. Development. Repeat." />'
										+'</div>'
										+'<div class="col left s12 m10">'
											+'<div>'
												+'<h5 style="font-size:1.4rem;"><i>In Afghanistan this year, humanitarian reporting has been completed 2 months ahead of the same time last year.</i></h5>'
											+'</div>'
										+'</div>'
										+'<div class="col left s12 m1">'
											+'<div>'
												+'<img src="images/quote1.png" width="64px;" title="Agile. Feedback. Development. Repeat." />'
											+'</div>'
										+'</div>'
									+'</div>'
									+'<div class="row" style="padding:10px;">'
										+'<h5 style="font-size:1.6rem;">Kate Carey | Humanitarian Affairs Officer | OCHA | Kabul, Afghanistan</h5>'
									+'</div>';
				},

				// quoite two
				getQuoteTwo: function() {

					return '<div class="row" style="padding:10px;">'
										+'<div class="col center s12 m1">'
											+'<img src="images/quote2.png" width="64px;" title="Agile. Feedback. Development. Repeat." />'
										+'</div>'
										+'<div class="col left s12 m10">'
											+'<div>'
												+'<h5 style="font-size:1.4rem;"><i>ReportHub is required in Afghanistan next year and potentially the following while Global Clusters work on the rollout of partner reporting systems to support the implementation of HPC.tools.</i></h5>'
											+'</div>'
										+'</div>'
										+'<div class="col left s12 m1">'
											+'<div>'
												+'<img src="images/quote1.png" width="64px;" title="Agile. Feedback. Development. Repeat." />'
											+'</div>'
										+'</div>'
									+'</div>'
									+'<div class="row" style="padding:10px;">'
										+'<h5 style="font-size:1.6rem;">Nick Imboden | Head of HPC Information Services Unit | OCHA | Geneva, Switzerland</h5>'
									+'</div>';
				},

				// set dashboard
				setDashboard: function(){

					// title
					$scope.dashboard.title = 'REPORTHUB | METRICS | USAGE';
					$scope.dashboard.subtitle = 'Results of ReportHub implementation since APRIL 1, 2017';
					// report name ( export )
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// model
					$scope.model = {
						name: 'reporthub_cluster_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'height: 130px; border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 1.8rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $scope.dashboard.title,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': $scope.dashboard.subtitle,
							},
							datePicker: {
								'class': 'col s12 m4 l3',
								dates: [{
									style: 'float:left;',
									label: 'from',
									format: 'd mmm, yyyy',
									min: '2017-01-01',
									max: $scope.dashboard.endDate,
									currentTime: $scope.dashboard.startDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.startDate ) {
											// set new date
											$scope.dashboard.startDate = date;
										}
									}
								},{
									style: 'float:right',
									label: 'to',
									format: 'd mmm, yyyy',
									min: $scope.dashboard.startDate,
									currentTime: $scope.dashboard.endDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.endDate ) {
											// set new date
											$scope.dashboard.endDate = date;
										}
									}
								}]
							},
							// download: {
							// 	'class': 'col s12 m4 l4 hide-on-small-only',
							// 	downloads: [{
							// 		type: 'pdf',
							// 		color: 'blue',
							// 		icon: 'picture_as_pdf',
							// 		hover: 'Download EPR as PDF',
							// 		request: {
							// 			method: 'POST',
							// 			url: 'http://' + $location.host() + '/api/print',
							// 			data: {
							// 				report: $scope.dashboard.report,
							// 				printUrl: $location.absUrl(),
							// 				downloadUrl: 'http://' + $location.host() + '/report/',
							// 				user: $scope.dashboard.user,
							// 				pageLoadTime: 6200,
							// 				viewportWidth: 1400
							// 			}
							// 		}
							// 	}]
							// }
						},
						menu: $scope.dashboard.menu,
						rows: [{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Registered Users Since April',
										data: { value: 254 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Organizations Since April',
										data: { value: 82 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Logins Since April',
										data: { value: 2910 }
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Data Downloads Since April',
										data: { value: 1085 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									config: {
										html: $scope.dashboard.getQuoteOne()
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									config: {
										html: $scope.dashboard.getQuoteTwo()
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