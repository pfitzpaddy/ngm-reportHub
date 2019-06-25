/**
 * @name ngmReportHub.factory:ngmClusterHelperCol
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperCol', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		// definition
		var ngmClusterHelperCol = {

			// update strategic objecgivres 
			updateIndicatorObjective:function( admin0pcode, beneficiary ){

				// if colombia
				if ( admin0pcode === 'COL' ){
					
					// wait for dropdown to process
					$timeout(function() {
						
						// default hrp
						var key = 'hrp';
						
						// if beneficiary_type
						//if( beneficiary.beneficiary_type_id === 'refugess_and_asylum_seekers' ){
						if( beneficiary.beneficiary_type_id === 'migrantes' ){

							key = 'rmrp';
						}
						
						// merge correct strategic objetives by key from activites.csv
						beneficiary = angular.merge( beneficiary, beneficiary.strategic_objective_descriptions[ key ] );

					}, 100 );

				}

			}

		}

		// return 
		return ngmClusterHelperCol;

	}]);
