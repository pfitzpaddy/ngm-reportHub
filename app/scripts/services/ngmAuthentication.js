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
	.factory('ngmAuth', ['$q', '$http', '$location', 'ngmUser', function($q, $http, $location, ngmUser) {

		var ngmAuth = {

			OK: 200,
			UNAUTHORIZED: 401,
			FORBIDDEN: 403,

			login: function(user) {
				
				// set the $http object
				var login = $http({
					method: 'GET',
					url: appConfig.host + '/login?username=' + user.username + '&password=' + user.password
				});

				// on success store in localStorage
				login.success(function(result) {
					ngmUser.set(result);
				});

				return login;
			},

			register: function(user) {

				ngmUser.unset();

				var register = $http({
					method: 'POST',
					url: appConfig.host + '/create',
					data: user
				});

				register.success(function(result) {
					ngmUser.set(result);
				});

				return register;
			},

			logout: function() {

				// ngm?

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
