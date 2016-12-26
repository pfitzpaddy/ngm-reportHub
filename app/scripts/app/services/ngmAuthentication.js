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
	.factory('ngmUser', function() {	

		return {

			// get user from storage
			get: function() {
				return localStorage.getObject( 'auth_token' );
			},

			// set user to storage
			set: function( val ) {
				// JSON stringify result
				localStorage.setObject( 'auth_token', val );
			},

			// unset user from storage
			unset: function() {
				// remove lists / user
				localStorage.removeItem( 'lists' );
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
	})
	.factory('ngmAuth', ['$q', '$route', '$http', '$location', '$interval', 'ngmUser', function( $q, $route, $http, $location, $interval, ngmUser ) {

		// auth
		var ngmAuth = {

			OK: 200,
			UNAUTHORIZED: 401,
			FORBIDDEN: 403,
			APP: $location.path().split('/')[1],

			// guest
			GUEST: { 
				adminRpcode: 'HQ', 
				adminRname: 'Global', 
				admin0pcode: 'ALL', 
				admin0name: 'All', 
				guest: true,
				visits: 1,
				cluster_id: 'health',
				organization: 'public', 
				username: 'welcome', 
				email: 'public'
			},

			// register
			register: function( user ) {

				// set the $http object
				var register = $http({
					method: 'POST',
					url: 'http://' + $location.host() + '/api/create',
					data: user
				});

				// register success
				register.success( function( result ) {
					
					// unset guest
					ngmUser.unset();
					// set user last_logged_in
					result.last_logged_in = moment();
					// set localStorage
					ngmUser.set( result );

					// manage session
					// ngmAuth.setSessionTimeout( true, result );
					ngmAuth.setSessionTimeout( result );

				});

				return register;
			},

			// login
			login: function(user) {
				
				// set the $http object
				var login = $http({
					method: 'POST',
					url: 'http://' + $location.host() + '/api/login',
					data: user
				});

				// on success store in localStorage
				login.success( function( result ) {
					
					// unset guest
					ngmUser.unset();
					// set user last_logged_in
					result.last_logged_in = moment();
					// set localStorage
					ngmUser.set( result );

					// manage session
					// ngmAuth.setSessionTimeout( true, result );
					ngmAuth.setSessionTimeout( result );

				});

				return login;
			},

			passwordResetSend: function( user ) {

				var reset = $http({
					method: 'POST',
					url: 'http://' + $location.host() + '/api/send-email',
					data: user
				});		

				return reset;
			},

			passwordReset: function(user) {
				
				// set the $http object
				var reset = $http({
					method: 'POST',
					url: 'http://' + $location.host() + '/api/password-reset',
					data: user
				});

				// on success store in localStorage
				reset.success( function( result ) {
					// unset guest
					ngmUser.unset();
					// set user
					ngmUser.set( result );
				});

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
				$location.path( '/' + $location.$$path.split('/')[1] + '/login' );

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
	.factory('ngmAuthInterceptor', ['$q', '$injector', function($q, $injector) {
			
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
