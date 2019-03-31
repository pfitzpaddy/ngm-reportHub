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
				
				// response body
				'RMRP':{
					'número_de_nna_vacunados': {
						strategic_objective_id: 'a',
						strategic_objective_name: 'a',
						sector_objective_id: 'a',
						sector_objective_name: 'a'
					}
				},
				'HRP':{
					'número_de_nna_vacunados': {
						strategic_objective_id: 'b',
						strategic_objective_name: 'b',
						sector_objective_id: 'b',
						sector_objective_name: 'b'
					}
				}
			},

			updateIndicatorObjective:function( admin0pcode, beneficiary ){

				if (admin0pcode === 'COL'){

				$timeout(function() {

					var key = 'HRP';


				if( beneficiary.beneficiary_type_id === 'refugess_and_asylum_seekers'){

					key = 'RMRP';

				}

				
				beneficiary = angular.merge(beneficiary, ngmClusterHelperColKeys.keys[key][beneficiary.indicator_id]);

				



				}, 100);
				

				

					
				}

			}



		}



		// return 
		return ngmClusterHelperColKeys;

	}]);
