/**
 * @ngdoc function
 * @name ngmReportHubApp.DashboardEthAssessmentsCtrl
 * @description
 * # DashboardEthAssessmentsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'ImmapProductsNewCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', function ( $scope, $location, $route, ngmAuth, ngmData, ngmUser ) {
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
					name: 'immap_products_new',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: 'iMMAP | Add New Product'
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: 'Register a new product'
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {
									html: '<a class="btn-flat waves-effect waves-teal left hide-on-small-only" href="#/immap/products"><i class="material-icons left">keyboard_return</i>Back</a>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									src: 'https://goo.gl/forms/NmyQ5aKsUdaIZrP73',
									templateUrl: '/scripts/modules/immap/views/products/immap.products.google.form.html'
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
