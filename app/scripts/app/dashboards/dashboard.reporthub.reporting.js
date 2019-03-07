/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardReportHubClusterCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardReportHubReportingCtrl', [
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
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, $translate ) {
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
				startDate: '2017-01-01',

				// report end
				endDate: '2017-06-30',

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// set dashboard
				setDashboard: function(){

					// title
					$scope.dashboard.title = 'REPORTHUB | METRICS | BENEFICIARY REPORTING';
					$scope.dashboard.subtitle = 'Results of ReportHub BENEFICIARY reporting since JANUARY 1, 2017';
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
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Projects',
										data: { value: 220 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Project Locations',
										data: { value: 1366 }
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Beneficiary Reports ( Monthly ) Completed',
										data: { value: 595 }
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Reported Services Delivered to Beneficiaries',
										data: { value: 3800075 }
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