/**
 * @ngdoc function
 * @name ngmReportHubApp.DashboardEthAssessmentsCtrl
 * @description
 * # DashboardEthAssessmentsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'ImmapHomeCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', function ( $scope, $location, $route, ngmAuth, ngmData, ngmUser ) {
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

			// init()
			init: function(){

				// report dashboard model
				$scope.model = {
					name: 'immap_home',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: 'iMMAP | ' + $scope.report.user.admin0name
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: 'Please select from the options below'
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									user: $scope.report.user,
									templateUrl: '/scripts/modules/immap/views/immap.home.html',
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

		// set page
		$scope.report.init();
		
	}]);
