/**
 * @name ngmReportHub.factory:ngmClusterDetails
 * @description
 * # ngmClusterDetails
 * Manages beneficiary detail options
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterDetails', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', 'ngmClusterBeneficiaries',
							function( $http, $filter, $timeout, ngmAuth, ngmClusterLists, ngmClusterBeneficiaries ) {

		// beneficairy details
		var ngmClusterDetails = {

			// add details
			addDetail: function( $locationIndex, $beneficiaryIndex, beneficiary ) {
				// add empty 
				if ( !beneficiary.details ) {
					beneficiary.details = [];	
				}
				beneficiary.details.push({});
				// reset list
				angular.forEach( beneficiary.details, function ( d, i ) {
					ngmClusterDetails.setList( $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details );
				});
			},

			// manages selections (removes selections from detials list for ET ESNFI partial_kits, kit_details)
			setList: function( $locationIndex, $beneficiaryIndex, $index, detail_type_id, d_list ) {

				// list
				var list;

				// each beneficiary
				if ( !ngmClusterLists.details[ $locationIndex ] ) {
					ngmClusterLists.details[ $locationIndex ] = [];
				}
				if ( !ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ] ) {
					ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ] = [];
				}
				if ( !ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
					ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = [];
				}

				// get kit details
				list = ngmClusterBeneficiaries.form[ $locationIndex ][ $beneficiaryIndex ][ 'unit_type_id' ];
				
				// set list at index
				ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = angular.copy( list );

				// remove current selection
				d_list = $filter( 'filter' )( d_list, { unit_type_id: '!' + unit_type_id } );
				
				// filter partial_kits
				angular.forEach( d_list, function ( detail ) {
					if ( detail.unit_type_id ) {
						ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = 
							$filter( 'filter' )( ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ], { unit_type_id: '!' + detail.unit_type_id } );
					}
				});

			}

		};

		// return
		return ngmClusterDetails;

	}]);
