'use strict';

/**
 * @name ngmReportHubApp.factory:ngmApiServices
 * @description
 * # ngmAccess
 * Manages browser local storage
 */
angular.module('ngmReportHub')
  .factory('ngmApiServices', ['$q', '$http', '$location', function($q, $http, $location) {

		// json endpoints
		var ngmApiServices = {
			
			// Execute and return a $http request
			getData: function(request){
				var deferred = $q.defer();
				$http(request)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(){
						deferred.reject();
					});

				return deferred.promise;
			}
		}

		return ngmApiServices;

  }]);