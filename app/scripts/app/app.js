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
		// vendor
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
		// ngm
		'ngm',
		'ngm.widget.form.authentication',
		'ngm.widget.project.details',
		'ngm.widget.project.reports.list',
		'ngm.widget.project.report',
		// modules
		'ngmCluster',
		'ngmDews',
		'ngmDrr',
    'ngmEpr',
		'ngmWatchkeeper',
		// utils
		'angularUtils.directives.dirPagination',
		// widgets
		'ngm.widget.calHeatmap',
		'ngm.widget.dropzone',
		'ngm.widget.highchart',
		'ngm.widget.html',
		'ngm.widget.leaflet',
		'ngm.widget.list',
		'ngm.widget.modal',
		'ngm.widget.stats',
		'ngm.widget.table'
	])
	.config([ '$routeProvider', '$locationProvider', '$compileProvider', function ( $routeProvider, $locationProvider, $compileProvider ) {

		// from http://mysite.com/#/notes/1 to http://mysite.com/notes/1
		// $locationProvider.html5Mode(true);

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false );

		// all routes prescribed within specific module app.js files
		$routeProvider
			// LOGIN
			.when( '/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})			
			// FORBIDDEN
			.when( '/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return !ngmAuth.isAuthenticated();
					}],
				}
			})

			// achievements
			.when( '/reporthub', {
				redirectTo: '/reporthub/2016'
			})
			// achievements
			.when( '/reporthub/:year', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardReportHubCtrl',
				resolve: {
					access: [ 'ngmAuth', function( ngmAuth ) {
						return ngmAuth.grantPublicAccess();
					}],
				}
			});
			// DEFAULT
			// .otherwise({
			// 	redirectTo: '/cluster/projects'
			// });
	}])
	.run([ '$rootScope', '$location', 'ngmAuth', 'ngmUser', function( $rootScope, $location, ngmAuth, ngmUser ) {

		// check minutes since last login
		if ( ngmUser.get() ) {
			ngmAuth.setSessionTimeout( false, ngmUser.get() );
		}

		// when error on route update redirect
		$rootScope.$on( '$routeChangeError', function( event, current, previous, rejection ) {

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
			height: $( window ).height(),

			// dashboard footer
			footer: false,

			// app style
			// style: {
			// 	logo: 'logo.png',
			// 	home: '#/cluster',
			// 	darkPrimaryColor: '#1976D2',
			// 	defaultPrimaryColor: '#2196F3',
			// 	lightPrimaryColor: '#BBDEFB',
			// 	textPrimaryColor: '#FFFFFF',
			// 	accentColor: '#009688',
			// 	primaryTextColor: '#212121',
			// 	secondaryTextColor: '#727272',
			// 	dividerColor: '#B6B6B6'
			// },

			// paint application
			setApplication: function( app ) {

				// set app colors based on 
				switch( app ){
          case 'reporthub':
            // set style obj
            $scope.ngm.style = {
              logo: 'logo.png',
              home: '#/reporthub',
              darkPrimaryColor: '#1976D2',
              defaultPrimaryColor: '#2196F3',
              lightPrimaryColor: '#BBDEFB'
            }
            break;
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
          case 'epr':
            // set style obj
            $scope.ngm.style = {
              logo: 'logo-health.png',
              home: '#/epr',
              darkPrimaryColor: '#1976D2',
              defaultPrimaryColor: '#2196F3',
              lightPrimaryColor: '#BBDEFB'
            }
            break;
					default:

						// logo
						var logo = ngmUser.get() && ngmUser.get().cluster_id === 'health' ?  'logo-health.png' : 'logo.png';

						// default
						$scope.ngm.style = {
							logo: logo,
							home: '#/cluster',
							darkPrimaryColor: '#1976D2',
							defaultPrimaryColor: '#2196F3',
							lightPrimaryColor: '#BBDEFB'
						}
				}

				// body footer
				$scope.ngm.footer = '<div>'
														+	'<div style="background: ' + $scope.ngm.style.lightPrimaryColor + '; height:20px;"></div>'
														+	'<div style="background: ' + $scope.ngm.style.defaultPrimaryColor + '; height:60px;">'
															+	'<p class="ngm-menu-footer-body" style="font-weight:300;">Supported by <a class="grey-text" href="http://immap.org"><b>iMMAP</b></a></p>'
															+ '<p id="ngm-contact" class="remove" style="display: block; float:right; padding-right:20px;"><a class="waves-effect waves-teal btn-flat" style="color:white;" onclick="contact()"><i class="material-icons left" style="color:white;">perm_contact_calendar</i>Contact</a></p>'
															+ '<p id="ngm-report-extracted" style="display: none; color:white; font-weight:100; float:right; padding-right:20px;">' +moment().format('DD MMM, YYYY @ h:mm a') + '</p>'													
														+	'</div>'
													+	'</div>';

			},

			// user
			getUser: function() {
				if ( ngmUser.get() ) {
					return ngmUser.get();
				} else {
					return 'welcome';
				}
			},

			// username
			getUserName: function() {
				if ( ngmUser.get() ) {
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
			// updateSession: function(){

			// 	// close modal
			// 	$( '#ngm-session-modal' ).closeModal();

			// 	// set the $http object
			// 	var update = $http({
			// 		method: 'POST',
			// 		url: 'http://' + $location.host() + '/api/update',
			// 		data: { user: ngmUser.get() }
			// 	});

			// 	// on success store in localStorage
			// 	update.success( function( user ) {
					
			// 		// update user/session
			// 		ngmUser.set( user );
			// 		ngmAuth.setSessionTimeout( true, user );

   //        // user toast msg
   //        $timeout(function(){
   //          Materialize.toast('Your session is now updated!', 3000, 'success');
   //        }, 2000);

			// 	});
			// },

			// open contact modal
			contact: function() {
				// open modal
				$( '#ngm-contact-modal' ).openModal({dismissible: false});
			},

			// Detect touch screen and enable scrollbar if necessary
			isTouchDevice: function () {
				try {
					document.createEvent( 'TouchEvent' );
					return true;
				} catch (e) {
					return false;
				}
			},

			// toggle search active
			toggleSearch: function(selector) {
				// toggle search input
				$( '#nav-' + selector ).slideToggle();
			},

			//
			toggleNavigationMenu: function() {
				// rotate icon
				$( '.ngm-profile-icon' ).toggleClass( 'rotate' );
				// set class
	    	$( '.ngm-profile' ).toggleClass( 'active' );
	    	$( '.ngm-profile-menu-content' ).toggleClass( 'active' );
	    	// toggle menu dropdown
				$( '.ngm-profile-menu-content' ).slideToggle();
			}		

		};

		// nav menu
		if ($scope.ngm.isTouchDevice()) {
			$('#nav-mobile').css({ overflow: 'auto'});
		}

		// profile menu dropdown click
		$('.ngm-profile-icon').click(function(){
			// if (ngmUser.get()) {
				// on app load, toggle menu on click
				$scope.ngm.toggleNavigationMenu();
			// }

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
			var app = $location.$$path.split('/')[1];
			// set application
			$scope.ngm.setApplication( app );

		});

		// annoying loading artifacts of left menu
    angular.element(document).ready(function () {
      // give a few seconds to render
      $timeout(function() {
				$('.ngm-navigation-menu').css({ 'display': 'block' });
			}, 1000 );
    });

	}]);
