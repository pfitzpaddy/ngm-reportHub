/**
 * @name ngmReportHubApp.factory:ngmUser
 * @description
 * # ngmAccess
 * Manages browser local storage
 *
 * @name ngmReportHubApp.factory:ngmUser
 * @description
 * # ngmAccess
 * Manages browser local storage
 *
 */
angular.module('ngmReportHub')
	.factory( 'ngmUser', [ '$injector', function( $injector ) {	

		return {

			// get user from storage
			get: function() {
				return localStorage.getObject( 'auth_token' );
			},

			// set user to storage
			set: function( user ) {
				// user last_logged_in & set
				user.last_logged_in = moment();
				user.dashboard_visits = 0;
				localStorage.setObject( 'auth_token', user );
				// set lists
				if ( !user.guest ) {
					$injector.get( 'ngmClusterLists' ).setClusterLists( user );
				}
			},

			// unset user from storage
			unset: function() {
				// remove lists / user
				localStorage.removeItem( 'lists' );
				localStorage.removeItem( 'dutyStations' );
				localStorage.removeItem( 'auth_token' );
			},			

			// check user role
			hasRole: function( role ) {
				// get from storage
				var user = localStorage.getObject( 'auth_token' );
				// if no user
				if ( !user ) return false; 
				// else has role?
				return angular.uppercase( user.roles ).indexOf( angular.uppercase( role ) ) >= 0;
			},

			// match any role
			hasAnyRole: function( roles ) {
				var user = localStorage.getObject( 'auth_token' );
				return !!user.roles.filter(function( role ) {
					return angular.uppercase( roles ).indexOf( angular.uppercase( role ) ) >= 0;
				}).length;
			}

		};
	}])
	.factory( 'ngmAuth', [ '$q', '$route', '$http', '$location', '$timeout', 'ngmUser', function( $q, $route, $http, $location, $timeout, ngmUser ) {

		// auth
		var ngmAuth = {

			OK: 200,
			UNAUTHORIZED: 401,
			FORBIDDEN: 403,
			LOCATION: $location.protocol() + '://' + $location.host() + ':' + $location.port(),
			APP: $location.path().split('/')[1],

			// guest
			GUEST: { 
				adminRpcode: 'HQ', 
				adminRname: 'Global', 
				admin0pcode: 'all', 
				admin0name: 'All', 
				guest: true,
				visits: 1,
				cluster_id: 'all',
				cluster: 'All',
				organization: 'All', 
				organization_tag: 'all',
				username: 'welcome',
				email: 'public@immap.org',
				roles: [ 'USER', 'ADMIN', 'SUPERADMIN' ]
			},

			// register
			register: function( user ) {

				// set the $http object
				var register = $http({
					method: 'POST',
					url: this.LOCATION + '/api/create',
					data: user
				});

				// register success
				register.success( function( result ) {

					if ( !result.err && !result.summary ){
						// unset guest
						ngmUser.unset();
						// set localStorage
						ngmUser.set( result );
						// manage session
						ngmAuth.setSessionTimeout( result );
					}

				}).error(function( err ) {
					// update
					Materialize.toast( 'Error!', 6000, 'error' );
				});

				return register;
			},

			// update user profile
			updateProfile: function( user ) {
				
				// set the $http object
				var update = $http({
					method: 'POST',
					url: this.LOCATION + '/api/profile/update',
					data: user
				});

				// on success store in localStorage
				update.success( function( result ) {
					//  success handles in controller.authentication.js
				}).error(function( err ) {
					// update
					Materialize.toast( 'Error!', 6000, 'error' );
				});

				return update;

			},

			// login
			login: function( user ) {
				
				// set the $http object
				var login = $http({
					method: 'POST',
					url: this.LOCATION + '/api/login',
					data: user
				});

				// on success store in localStorage
				login.success( function( result ) {

					if ( !result.err && !result.summary ){
						// unset guest
						ngmUser.unset();
						// set localStorage
						ngmUser.set( result );
						// manage session
						ngmAuth.setSessionTimeout( result );
					}

				}).error(function( err ) {
					// update
					Materialize.toast( 'Error!', 6000, 'error' );
				});

				return login;
			},

			passwordResetSend: function( user ) {

				var reset = $http({
					method: 'POST',
					url: this.LOCATION + '/api/send-email',
					data: user
				});		

				return reset;
			},

			passwordReset: function(user) {
				
				// set the $http object
				var reset = $http({
					method: 'POST',
					url: this.LOCATION + '/api/password-reset',
					data: user
				});

				// on success store in localStorage
				reset.success( function( result ) {
					if ( !result.err && !result.summary ){
						// unset guest
						ngmUser.unset();
						// set user
						ngmUser.set( result );
					}
				}).error(function( err ) {
					// update
					Materialize.toast( 'Error!', 6000, 'error' );
				});;

				return reset;
			},

			logout: function() {

				// rotate icon
				$('.ngm-profile-icon').toggleClass('rotate');
				// set class
				$('.ngm-profile').toggleClass('active');
				$('.ngm-profile-menu-content').toggleClass('active');
				// toggle menu dropdown
				$('.ngm-profile-menu-content').slideToggle();

				// unset token, backend dosnt care about logouts 
				ngmUser.unset();
				$location.path( '/login' );
				// $location.path( '/' + $location.$$path.split('/')[1] + '/login' );

			},

			// Manages client session timeout
			setSessionTimeout: function( user ) {

				// tmp fix
				if ( !user || !user.last_logged_in ) {
						// unset localStorage
						ngmUser.unset();				
				} else {
					// get minutes since last login
					var minutes = 
								moment.duration( moment().diff( user.last_logged_in ) ).asMinutes();

					// ( 24 * 60 ) = 1440 minutes
					if ( minutes > ( 24 * 60 ) ) {
						
						// unset localStorage
						ngmUser.unset();

						// redirect to login
						$location.path( '/' + ngmAuth.APP + '/login' );

					}
				}

			},

			// setup a public user
			grantPublicAccess: function( role ) {

				var deferred = $q.defer();

				// if no user exists
				if ( !ngmUser.get() ) {
					// set guest to localStorage
					ngmUser.set( ngmAuth.GUEST );
				}

				// resolve ok
				deferred.resolve( ngmAuth.OK );

				return deferred.promise;
			},

			// has role
			hasRole: function( role ) {
				
				var deferred = $q.defer();

				if ( ngmUser.hasRole( role ) ) {
					deferred.resolve(ngmAuth.OK );
				} else if ( ngmUser.get().guest ) {
					deferred.reject( ngmAuth.UNAUTHORIZED );
				} else {
					deferred.reject( ngmAuth.FORBIDDEN );
				}

				return deferred.promise;
			},

			// has any role
			hasAnyRole: function( roles ) {
				
				var deferred = $q.defer();

				if ( ngmUser.hasAnyRole( roles ) ) {
					deferred.resolve( ngmAuth.OK );
				} else if ( ngmUser.get().guest ) {
					deferred.reject( ngmAuth.UNAUTHORIZED );
				} else {
					deferred.reject( ngmAuth.FORBIDDEN );
				}

				return deferred.promise;
			},

			// anonymous
			isAnonymous: function() {
				
				var deferred = $q.defer();

				if ( !ngmUser.get() || ngmUser.get().guest ) {
					deferred.resolve( ngmAuth.OK );
				} else {
					deferred.reject( ngmAuth.FORBIDDEN );
				}

				return deferred.promise;
			},

			// authenticated
			isAuthenticated: function() {
				
				var deferred = $q.defer();

				if ( ngmUser.get() && !ngmUser.get().guest ) {
					deferred.resolve( ngmAuth.OK );
				} else {
					deferred.reject( ngmAuth.UNAUTHORIZED );
				}

				return deferred.promise;
			}

		};

		return ngmAuth;

	}])
	.factory( 'ngmAuthInterceptor', [ '$q', '$injector', function( $q, $injector ) {
			
		// get user
		var ngmUser = $injector.get( 'ngmUser' );

		return {
			request: function( config ) {

				var token;

				// cover external APIs
				if ( ngmUser.get() && !config.externalApi ) {
					token = ngmUser.get().token;
				}
				if (token) {
					config.headers.Authorization = 'Bearer ' + token;
				}

				return config;
			}
		};

	}])
	.config( function( $httpProvider ) {
		$httpProvider.interceptors.push( 'ngmAuthInterceptor' );
	});
