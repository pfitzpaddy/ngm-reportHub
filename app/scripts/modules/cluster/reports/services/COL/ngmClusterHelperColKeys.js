/**
 * @name ngmReportHub.factory:ngmClusterHelperColKeys
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperColKeys', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		// definition
		var ngmClusterHelperColKeys = {

			// activity keys
			keys: {
				
				// WATER
				// boreholes
				'RMRP':{
					'indicator': {
						strategic_objective_id: '',
						strategic_objective_name: '',
						sector_objective_id: '',
						sector_objective_name: ''
					}
				},
				'HRP':{
					'indicator': {
						strategic_objective_id: '',
						strategic_objective_name: '',
						sector_objective_id: '',
						sector_objective_name: ''
					}
				}
			}
		}

		// return 
		return ngmClusterHelperColKeys;

	}]);
