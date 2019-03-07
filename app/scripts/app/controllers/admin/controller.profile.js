/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardProfileCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardProfileCtrl', ['$scope', '$route', 'ngmData', 'ngmAuth','$translate','$filter', function ($scope, $route, ngmData, ngmAuth,$translate,$filter) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// empty model
		$scope.model = {
			menu: [],
			rows: []
		};

		// login object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm,

			// current ReportHub user
			user: $scope.$parent.ngm.getUser(),

			// profile username to load
			username: $route.current.params.username,

			// load dashboard
			init: function( user ){
				
				// add padding to style?
				$scope.dashboard.ngm.style.paddingHeight = 20;		

				// dews dashboard model
				var model = {
					name: 'dashboard_profile',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title report-title',
							style: 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
							title: $filter('translate')('profile')
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle',
							html: true,
							title: user.admin0name.toUpperCase().substring(0, 3) + ' | ' + user.cluster.toUpperCase() + ' | ' + user.organization + ' | ' + user.username,
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12',
							widgets: [{
								type: 'form.authentication',
								config: {
									style: $scope.dashboard.ngm.style,
									user: user,
						      formDisabled: function() {
						        var disabled = true;
										if ( user.status === 'active' &&
						        			( $scope.dashboard.username === $scope.dashboard.user.username ||
						        			( $scope.dashboard.user.roles.indexOf('ORG') !== -1 ||
						        				$scope.dashboard.user.roles.indexOf('SUPERADMIN') !== -1 ) ) ) {
						          disabled = false;
						        }
						        return disabled;
						      },
						      activateUpdateVisible: function() {
						        var visible = false;
						        if ( $scope.dashboard.user.username !== $scope.dashboard.username && 
						        			( $scope.dashboard.user.roles.indexOf('ORG') !== -1 ||
						        				$scope.dashboard.user.roles.indexOf('SUPERADMIN') !== -1 ) ) {
						          visible = true;
						        }
						        return visible;
						      },
									templateUrl: '/scripts/app/views/authentication/profile.html'
								}
							}]
						}]
					}]
				}

				// assign model to scope
				$scope.model = model;

				// assign to ngm app scope
				$scope.dashboard.ngm.dashboard = $scope.model;
			}

		}

		// if not current user 
		if ( $scope.dashboard.username && 
					( $scope.dashboard.username !== $scope.dashboard.user.username ) ) {

			// get use
			ngmData
				.get( { method: 'GET', url: ngmAuth.LOCATION + '/api/getUserByUsername?username=' + $scope.dashboard.username } )
				.then( function( user ){
					// load with user profile
					$scope.dashboard.init( user );
			});

		} else {
			// load with current user profile
			$scope.dashboard.init( $scope.dashboard.user );

		}
		
	}]);
