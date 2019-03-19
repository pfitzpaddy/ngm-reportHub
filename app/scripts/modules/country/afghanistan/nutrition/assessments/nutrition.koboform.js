/**
 * @ngdoc function
 * @name ngmReportHubApp.DashboardKoboFormCtrl
 * @description
 * # DashboardKoboFormCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'DashboardNutritionKoboFormCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', '$translate','$filter', function ( $scope, $location, $route, ngmAuth, ngmData, ngmUser,$translate,$filter ) {
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

			// 
			init: function(){

				// report dashboard model
				$scope.model = {
					name: 'nutrition_afghanistan_koboform',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $filter('translate')('nutrition') + ' Afghanistan | ' + $filter('translate')('assessment')+' | '+$filter('translate')('form') + ' | ' + ($route.current.params.mode==='i'||$route.current.params.mode==='x'?$filter('translate')('new_mayus1'):$filer('translate')('edit'))
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: $filter('translate')('please_complete_an_assessment_in_the_form_below')
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
									templateUrl: '/scripts/modules/country/afghanistan/nutrition/views/nutrition.koboform.html',
									src: 'https://ee.humanitarianresponse.info/'+$route.current.params.mode + 
																			 '/'+$route.current.params.id + ( $route.current.params.instance_id && $route.current.params.returnUrl ?
																			 '?instance_id='+$route.current.params.instance_id  : '' ),
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
		
	}]).config(['$sceDelegateProvider', function($sceDelegateProvider) {  
		$sceDelegateProvider.resourceUrlWhitelist([
		  'self',
		  'https://ee.humanitarianresponse.info/**',
		]);
	  }]);;
