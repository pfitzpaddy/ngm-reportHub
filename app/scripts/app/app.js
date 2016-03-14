/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmReportHub', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngTable',
		'ngCsv',
		'ngDropzone',
		'countTo',
		'highcharts-ng',
		'leaflet-directive',
		'ngm',
		'ngm.widget.form.authentication',
		'ngm.widget.calHeatmap',
		'ngm.widget.dropzone',
		'ngm.widget.highchart',
		'ngm.widget.html',
		'ngm.widget.iframe',
		'ngm.widget.leaflet',
		'ngm.widget.list',
		'angularUtils.directives.dirPagination',
		'ngm.widget.project.details',
		'ngm.widget.project.financials',
		'ngm.widget.project.objectives',
		'ngm.widget.stats',
		'ngm.widget.table'
	])
	.config([ '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

		// from http://mysite.com/#/notes/1 to http://mysite.com/notes/1
		// $locationProvider.html5Mode(true);

		// app routes with access rights
		$routeProvider
			.when( '/login', {
				redirectTo: '/who/login'
			})
			.when( '/who', {
				redirectTo: '/who/dews/afghanistan/all/2015-03-01/2016-02-29'
			})
			.when( '/who/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health
			.when( '/health/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health register
			.when( '/health/register', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardRegisterCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health reset
			.when( '/health/find', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardResetCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health reset with token
			.when( '/health/find/:token', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardResetCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})			

			// health project list
			.when( '/health/projects', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project summary
			.when( '/health/projects/summary/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectSummaryCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project details
			.when( '/health/projects/details/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectDetailsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})	
			// health project financials
			.when( '/health/projects/financials/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectFinancialsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project objectives
			.when( '/health/projects/objectives/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectObjectivesCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health dashboard
			.when( '/health/3w', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHealthProjectsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isPublic();
					}],
				}
			})

			// Dews
			.when( '/who/dews/upload', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'UpdateDewsCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			.when( '/who/dews/:location/:disease/:start/:end', {
				reloadOnSearch: false,
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardDewsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isAuthenticated();
					}],
				}
			})

			// forbidden
			.when( '/who/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return !ngmAuth.isAuthenticated();
					}],
				}
			})

			// iMMAP
			.when( '/immap/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})
			// DRR
			.when( '/immap/drr/baseline/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBaselineCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isPublic();
					}],
				}
			})
			.when( '/immap/drr/baseline/:province/:district', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardBaselineCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isPublic();
					}],
				}
			})
			// DRR FLOOD-RISK
			.when( '/immap/drr/flood-risk/:province', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardFloodRiskCtrl',				
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isPublic();
					}],
				}
			})
			.when( '/immap/drr/flood-risk/:province/:district', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardFloodRiskCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) {
						return ngmAuth.isPublic();
					}],
				}
			})			

			// Watchkeeper
			.when( '/immap/watchkeeper/:country/:start/:end', {
				reloadOnSearch: false,
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWatchkeeperCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})				
			.when( '/immap', {
				redirectTo: '/immap/drr/baseline/afghanistan'
			})
			.when( '/immap/watchkeeper', {
				redirectTo: '/immap/watchkeeper/kenya/2015-11-01/2015-11-30'
			})			
			.when( '/immap/drr', {
				redirectTo: '/immap/drr/baseline/afghanistan'
			})
			.when( '/immap/drr/baseline', {
				redirectTo: '/immap/drr/baseline/afghanistan'
			})			

			// forbidden
			.when( '/immap/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			})

			// default
			.otherwise({
				redirectTo: '/health/projects'
			});
	}])
	.run(['$rootScope', '$location', 'ngmAuth', 'ngmUser', function($rootScope, $location, ngmAuth, ngmUser) {

		// check minutes since last login
		if (ngmUser.get()) {
			ngmAuth.setSessionTimeout(ngmUser.get());
		}

		// when error on route update redirect
		$rootScope.$on('$routeChangeError' , function(event, current, previous, rejection) {

			// get app
			var app = current.$$route.originalPath.split('/')[1];
			
			if ( rejection === ngmAuth.UNAUTHORIZED ) {
				$location.path( '/' + app + '/login' );
			} else if ( rejection === ngmAuth.FORBIDDEN ) {
				$location.path( '/' + app + '/forbidden' );
			}

		});

	}])
  .filter('sumByKey', function() {
      return function(data, key) {
          if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
              return 0;
          }

          var sum = 0;
          for (var i = data.length - 1; i >= 0; i--) {
              sum += parseInt(data[i][key]);
          }

          return sum;
      };
  })
  .directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }])
	.controller('ngmReportHubCrtl', ['$scope', '$route', '$location', '$http', '$timeout', 'ngmAuth', 'ngmUser', function ($scope, $route, $location, $http, $timeout, ngmAuth, ngmUser) {

		// ngm object
		$scope.ngm = {

			// app name
			title: 'Welcome',

			// current route
			route: $route,

			// active dashboard placeholder
			dashboard: {
				model: {}
			},

			// top navigation page menu
			navigationMenu: false,

			// left menu
			menu: {
				search: true,
				focused: false,
				query: []
			},

			// page height
			height: $(window).height(),

			// dashboard footer
			footer: false,

			// app style
			style: {
				logo: 'logo-who.png',
				home: '#/who',
				darkPrimaryColor: '#1976D2',
				defaultPrimaryColor: '#2196F3',
				lightPrimaryColor: '#BBDEFB',
				textPrimaryColor: '#FFFFFF',
				accentColor: '#009688',
				primaryTextColor: '#212121',
				secondaryTextColor: '#727272',
				dividerColor: '#B6B6B6'
			},

			// paint application
			setApplication: function(route) {

				// set app colors based on 
				switch(route){
					case 'immap':
						// set style obj
						$scope.ngm.style = {
							logo: 'logo-immap.png',
							home: '#/immap',
							darkPrimaryColor: '#DE696E',
							defaultPrimaryColor: '#EE6E73',
							lightPrimaryColor: '#EF9A9A'
						}
						break;
					case 'who':
						// set style obj
						$scope.ngm.style = {
							logo: 'logo-who.png',
							home: '#/who',
							darkPrimaryColor: '#1976D2',
							defaultPrimaryColor: '#2196F3',
							lightPrimaryColor: '#BBDEFB'
						}
						break;
					case 'health':
						// set style obj
						$scope.ngm.style = {
							logo: 'logo-who.png',
							home: '#/health',
							darkPrimaryColor: '#1976D2',
							defaultPrimaryColor: '#2196F3',
							lightPrimaryColor: '#BBDEFB'
						}
						break;						
					default:
						// default
						$scope.ngm.style = {
							logo: 'logo-ngm.png',
							home: '#/ngm',
							darkPrimaryColor: '#0288D1',
							defaultPrimaryColor: '#03A9F4',
							lightPrimaryColor: '#B3E5FC'
						}
				}

				// body footer
				$scope.ngm.footer = '<div>'
														+	'<div style="background: ' + $scope.ngm.style.lightPrimaryColor + '; height:20px;"></div>'
														+	'<div style="background: ' + $scope.ngm.style.defaultPrimaryColor + '; height:60px;">'
															+	'<p class="ngm-menu-footer-body">Supported by <a class="grey-text" href="http://immap.org"><b>iMMAP</b></a></p>'
															+ '<p id="ngm-contact" style="display: block; float:right; padding-right:20px;"><a class="waves-effect waves-teal btn-flat" style="color:white;" onclick="contact()"><i class="material-icons left" style="color:white;">perm_contact_calendar</i>Contact</a></p>'
															+ '<p id="ngm-report-extracted" style="display: none; color:white; font-weight:100; float:right; padding-right:20px;">' +moment(new Date()).format('DD MMM, YYYY') + '</p>'													
														+	'</div>'
													+	'</div>';

			},

			// user
			getUserName: function() {
				if (ngmUser.get()) {
					return ngmUser.get().username;
				} else {
					return 'welcome';
				}
			},

			// app functions
			logout: function() {
				ngmAuth.logout();
			},

			//
			updateSession: function(){

				// close modal
				$('#ngm-session-modal').closeModal();

				// set the $http object
				var update = $http({
					method: 'POST',
					url: 'http://' + $location.host() + '/api/update',
					data: { user: ngmUser.get() }
				});

				// on success store in localStorage
				update.success(function(user) {
					// update user/session
					ngmUser.set(user);
					ngmAuth.setSessionTimeout(user);

          // user toast msg
          $timeout(function(){
            Materialize.toast('Your session is now updated!', 3000, 'success');
          }, 2000);

				});
			},

			// open contact modal
			contact: function() {
				// open modal
				$('#ngm-contact-modal').openModal({dismissible: false});
			},

			// Detect touch screen and enable scrollbar if necessary
			isTouchDevice: function () {
				try {
					document.createEvent('TouchEvent');
					return true;
				} catch (e) {
					return false;
				}
			},

			// toggle search active
			toggleSearch: function(selector) {
				// toggle search input
				$('#nav-' + selector).slideToggle();
			},

			//
			toggleNavigationMenu: function() {
				// rotate icon
				$('.ngm-profile-icon').toggleClass('rotate');
				// set class
	    	$('.ngm-profile').toggleClass('active');
	    	$('.ngm-profile-menu-content').toggleClass('active');
	    	// toggle menu dropdown
				$('.ngm-profile-menu-content').slideToggle();
			}		

		};

		// nav menu
		if ($scope.ngm.isTouchDevice()) {
			$('#nav-mobile').css({ overflow: 'auto'});
		}

		// profile menu dropdown click
		$('.ngm-profile-icon').click(function(){
			if (ngmUser.get()) {
				// on app load, toggle menu on click
				$scope.ngm.toggleNavigationMenu();
			}

		});

		// paint application
		$scope.$on('$routeChangeStart', function(next, current) {

			// set navigation menu
			if (ngmUser.get()) {
				$scope.ngm.navigationMenu = ngmUser.get().menu;
			} else {
				$scope.ngm.navigationMenu = false;
			}

			// get application
			var route = $location.$$path.split('/')[1];
			// set application
			$scope.ngm.setApplication(route);

		});

		// annoying loading artifacts of left menu
    angular.element(document).ready(function () {
      // give a few seconds to render
      $timeout(function() {
				$('.ngm-navigation-menu').css({ 'display': 'block' });
			}, 1000 );
    });

	}]);
