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

		// assign to ngm app scope
		$scope.model = $scope.$parent.ngm.dashboard.model;
		
		// login object
		$scope.dashboard = {

			// parent
			ngm: $scope.$parent.ngm,

			// current ReportHub user
			user: $scope.$parent.ngm.getUser(),

			// profile username to load
			username: $route.current.params.username,

			// the header navigation settings
			getHeaderHtml: function(){
				var html = '<div class="row hide-on-small-only">'
										+'<div class="col s12 m12 l12">'
											+'<div>'
												+'<a class="btn-flat waves-effect waves-teal" href="#/team">'
													+'<i class="material-icons left">keyboard_return</i>'+$filter('translate')('back_to_team')
												+'</a>'
												+'<span class="right" style="padding-top:8px;">'+$filter('translate')('last_updated')+ ' ' + moment( $scope.dashboard.user.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) +'</span>'
											+'</div>'
										+'</div>'
									+'</div>';

				return html;
			},

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
							title: $filter('translate')('profile')+' | ' + user.username

						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle',
							html: true,
							title: user.admin0name.toUpperCase().substring(0, 3) + ' | ' + user.cluster.toUpperCase() + ' | ' + user.organization + ' | ' + user.username,
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
									html: $scope.dashboard.getHeaderHtml()
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12',
							widgets: [{
								type: 'form.authentication',
								config: {
									style: $scope.dashboard.ngm.style,
									user: user,
						      formDisabled: (function() {
						        var disabled = true;
										if ( user.status === 'active' &&
						        			( $scope.dashboard.username === $scope.dashboard.user.username ||
											( ngmAuth.canDo( 'EDIT_USER', { adminRpcode: user.adminRpcode, 
																			  admin0pcode: user.admin0pcode, 
																			  cluster_id: user.cluster_id, 
																			  organization_tag: user.organization_tag } ) ) ) ) {
						          disabled = false;
						        }
						        return disabled;
						      })(),
						      activateUpdateVisible: (function() {
						        var visible = false;
						        if ( $scope.dashboard.user.username !== $scope.dashboard.username && 
											( ngmAuth.canDo( 'EDIT_USER', { adminRpcode: user.adminRpcode, 
																			  admin0pcode: user.admin0pcode, 
																			  cluster_id: user.cluster_id, 
																			  organization_tag: user.organization_tag } ) ) ) {
						          visible = true;
						        }
						        return visible;
						      })(),
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
