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

			get: function() {
				return angular.fromJson(localStorage.auth_token);
			},

			set: function(val) {
				// JSON stringify result
				return localStorage.setItem('auth_token', JSON.stringify(val));
			},

			unset: function() {
				return localStorage.removeItem('auth_token');
			},			

			hasRole: function(role) {
				var user = angular.fromJson(localStorage.auth_token);
				return angular.uppercase(user.roles).indexOf(angular.uppercase(role)) >= 0;
			},

			hasAnyRole: function( roles ) {
				var user = angular.fromJson(localStorage.auth_token);
				return !!user.roles.filter(function( role ) {
					return angular.uppercase(roles).indexOf( angular.uppercase(role) ) >= 0;
				}).length;
			}

		};
	})
	.factory('ngmAuth', ['$q', '$route', '$http', '$location', '$interval', 'ngmUser', function($q, $route, $http, $location, $interval, ngmUser) {

		var ngmAuth = {

			OK: 200,
			UNAUTHORIZED: 401,
			FORBIDDEN: 403,
			APP: $location.path().split('/')[1],

			// register
			register: function(user) {

				// set the $http object
				var register = $http({
					method: 'POST',
					url: 'http://' + $location.host() + '/api/create',
					data: user
				});

				// register success
				register.success( function( result ) {
					
					// set localStorage
					ngmUser.set( result );

					// manage session
					ngmAuth.setSessionTimeout( true, result );

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
					
					// set localStorage
					ngmUser.set( result );

					// manage session
					ngmAuth.setSessionTimeout( true, result );

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
				ngmUser.unset('auth_token');
				$location.path( '/' + $location.$$path.split('/')[1] + '/login' );

			},

			// Manages client session timeout
			setSessionTimeout: function( newSession, user ) {

				// compare last login with now
				var log_in = moment( user.updatedAt ),
						now = moment( new Date() ),
						duration = moment.duration( now.diff( log_in ) );

				// new session
				var minutes = newSession ? 0 : duration.asMinutes();
				
				// 24 hours * 60 minutes ( 1440 )
				if ( minutes > ( 24 * 60 ) ){
					
					// unset localStorage
					ngmUser.unset();

					// redirect to login
					$location.path( '/' + ngmAuth.APP + '/login' );

				}

				// // 8 hour session
				// var session = 1000 * 60 * 60 * 8;
				
				// // compare last login with now
				// var log_in = moment( user.updatedAt ),
				// 		now = moment( new Date() ),
				// 		duration = moment.duration( now.diff( log_in ) );
				
				// // set timeout
				// var milliSeconds = newSession ? session : session - duration.asMilliseconds();

				//
				// console.log( 'newSession: ' + newSession );
				// console.log( 'log_in: ' + log_in );
				// console.log( 'now: ' + log_in );
				// console.log( 'duration: ' + duration );
				// console.log( 'milliSeconds: ' + milliSeconds );

				// session expired
				// if ( milliSeconds < 0 ) {
					
				// 	// unset localStorage
				// 	ngmUser.unset();

				// 	// redirect to login
				// 	$location.path( '/' + ngmAuth.APP + '/login' );

				// } else {
					
				// 	// interval since last login
				// 	$interval(function(){

				// 		// open session confirm modal
				// 		$('#ngm-session-modal').openModal( { dismissible: false } );

				// 		// 2 minutes to reset session
				// 		$interval(function(){

				// 			// close modal
				// 			$('#ngm-session-modal').closeModal();

				// 			// unset localStorage
				// 			ngmUser.unset();

				// 			// re-direct
				// 			$location.path( '/' + ngmAuth.APP + '/login' );

				// 		}, 1000 * 60 * 2);

				// 	}, milliSeconds);
				// }

			},

			grantPublicAccess: function( role ) {
				
				var deferred = $q.defer();

				// make public
				deferred.resolve( ngmAuth.OK );

				// return 200 OK
				return deferred.promise;
			},

			hasRole: function( role ) {
				
				var deferred = $q.defer();

				if ( ngmUser.hasRole( role ) ) {
					deferred.resolve(ngmAuth.OK );
				} else if ( !ngmUser.get('auth_token') ) {
					deferred.reject( ngmAuth.UNAUTHORIZED );
				} else {
					deferred.reject(ngmAuth.FORBIDDEN);
				}

				return deferred.promise;
			},

			hasAnyRole: function( roles ) {
				
				var deferred = $q.defer();

				if ( ngmUser.hasAnyRole( roles ) ) {
					deferred.resolve( ngmAuth.OK );
				} else if ( !ngmUser.get('auth_token') ) {
					deferred.reject( ngmAuth.UNAUTHORIZED );
				} else {
					deferred.reject( ngmAuth.FORBIDDEN );
				}

				return deferred.promise;
			},

			isAnonymous: function() {
				
				var deferred = $q.defer();

				if ( !ngmUser.get('auth_token') ) {
					deferred.resolve( ngmAuth.OK );
				} else {
					deferred.reject( ngmAuth.FORBIDDEN );
				}

				return deferred.promise;
			},

			isAuthenticated: function() {
				
				var deferred = $q.defer();

				if ( ngmUser.get('auth_token') ) {
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
		var ngmUser = $injector.get('ngmUser');

		return {
			request: function(config) {

				var token;

				// cover external APIs
				if (ngmUser.get() && !config.externalApi ) {
					token = ngmUser.get().token;
				}
				if (token) {
					config.headers.Authorization = 'Bearer ' + token;
				}

				return config;
			}
		};

	}])
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('ngmAuthInterceptor');
	});
