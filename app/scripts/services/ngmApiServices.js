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

		};
		
		// Get running list
		// calculonAPI.getUserCredentials = function(){
		// 	return $http({
		// 		url: 'api/api/UserCredentials/get'
		// 	});
		// };

		return ngmApiServices;

  }]);