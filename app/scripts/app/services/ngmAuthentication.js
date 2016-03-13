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
	.factory('ngmAuth', ['$q', '$http', '$location', '$interval', 'ngmUser', function($q, $http, $location, $interval, ngmUser) {

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
				register.success(function(result) {
					
					// set localStorage
					ngmUser.set(result);

					// manage session
					ngmAuth.setSessionTimeout(result);

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
				login.success(function(result) {
					
					// set localStorage
					ngmUser.set(result);

					// manage session
					ngmAuth.setSessionTimeout(result);

				});

				return login;
			},

			passwordResetSend: function(user) {

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
				reset.success(function(result) {
					ngmUser.set(result);
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
			setSessionTimeout: function( user ) {

				// 8 hour session with 2 min window to reset
				var session = 1000 * 60 * 60 * 8;

				// compare last_logged_in with now
				var log_in = moment(user.last_logged_in),
						now = moment(new Date()),
						duration = moment.duration(now.diff(log_in)),
						milliSeconds = session - duration.asMilliseconds();

				// session expired
				if (milliSeconds < 0) {
			    
			    // unset localStorage
			    ngmUser.unset();

			    // redirect to login
			    $location.path( '/' + ngmAuth.APP + '/login' );

				} else {
					// interval since last login
				  $interval(function(){

				  	// open session confirm modal
				  	$('#ngm-session-modal').openModal({dismissible: false});

				  	// 2 minutes to reset session
				  	$interval(function(){

					    // unset localStorage
					    ngmUser.unset();

					    // redirect to login
					    $location.path( '/' + ngmAuth.APP + '/login' );

				  	}, 1000 * 60 * 2);

				  }, milliSeconds);
				}		

			},

			isPublic: function( role ) {
				
				var deferred = $q.defer();

				if ( true ) {
					deferred.resolve(ngmAuth.OK );
				} else if ( !ngmUser.get('auth_token') ) {
					deferred.reject( ngmAuth.UNAUTHORIZED );
				} else {
					deferred.reject(ngmAuth.FORBIDDEN);
				}

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

				if (ngmUser.get()) {
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
