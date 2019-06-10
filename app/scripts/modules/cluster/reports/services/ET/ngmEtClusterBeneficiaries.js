/**
 * @name ngmReportHub.factory:ngmEtClusterBeneficiaries
 * @description
 * # ngmEtClusterBeneficiaries
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmEtClusterBeneficiaries', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', 'ngmClusterBeneficiaries',
							function( $http, $filter, $timeout, ngmAuth, ngmClusterLists, ngmClusterBeneficiaries ) {

		// beneficairies
		var ngmEtClusterBeneficiaries = {

			/* ESNFI KITS */

			// show add kit detials
			showPartialKits: function( $locationIndex, $beneficiaryIndex, $index, beneficiary ){
				var display = beneficiary.cluster_id === 'esnfi' && 
												beneficiary.activity_description_id === 'partial_kits';

				// defaults to 1 entry
				if ( display && !beneficiary.partial_kits ) {
					beneficiary.partial_kits = [{}];
				}

				// set kits
				ngmEtClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'partial_kits', ngmClusterLists.getPartialKits() );

				return display;
			},

			// show add kit detials
			showKitDetails: function( $locationIndex, $beneficiaryIndex, $index, beneficiary ){
				var display = beneficiary.cluster_id === 'esnfi' &&
												beneficiary.activity_description_id === 'loose_items';

				// defaults to 1 entry
				if ( display && !beneficiary.kit_details ) {
					beneficiary.kit_details = [{}];
				}

				// set kits
				ngmEtClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'kit_details', ngmClusterLists.getKitDetails() );

				return display;
			},

			// kits
			setKits( $locationIndex, $beneficiaryIndex, $index, key, list ) {
				// first list
				if ( !ngmClusterLists[ key ][ $locationIndex ] ) {
					ngmClusterLists[ key ][ $locationIndex ] = [];
				}
				if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] ) {
					ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] = [];
				}
				if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
					ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = list;
				}
			},

			// ethiopia esnfi onchange
			descriptionChange: function( $locationIndex, $beneficiaryIndex, lists, $beneficiary ) {

				var kits;
				if ( $beneficiary && $beneficiary.activity_type_id ) {

					if ( $beneficiary.activity_type_id === 'hardware_materials_distribution' ) {

						// set
						$timeout(function() {

							if ( $beneficiary.activity_description_id !== 'partial_kits' ) {
								kits = 'kit_details';
							} else {
								kits = 'partial_kits';
							}

							$beneficiary[ kits ] = [{}];
							$beneficiary = ngmEtClusterBeneficiaries.setKitDetails( lists.activity_descriptions, $beneficiary );
							angular.forEach( $beneficiary[ kits ] , function ( d, i ) {
								ngmClusterLists.setDetailList( kits, $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
							});

						}, 100 );

					}
				}
			},

			// set kit details
			setKitDetails: function( list, $beneficiary ){
				var kit = $filter('filter')( list, { activity_description_id: $beneficiary.activity_description_id }, true );
				if ( kit[0].kit_details.length ) {
					$beneficiary.kit_details = kit[0].kit_details;
				}
				return $beneficiary;
			},

			// add kit-detail
			addPartialKits: function ( $locationIndex, $beneficiaryIndex, $beneficiary ) {
				delete $beneficiary.kit_details;
				$beneficiary.partial_kits.push({});
				// reset list
				angular.forEach( $beneficiary.partial_kits, function ( d, i ) {
					ngmClusterLists.setDetailList( 'partial_kits', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.partial_kits );
				});
				if ( $beneficiary.partial_kits.length < 1 ) {
					Materialize.toast( 'Note: Please add at least 1 kit item to submit!' , 6000, 'note' );
				}
			},

			// remove kit-details
			removePartialKit: function( project, $beneficiary, $locationIndex, $beneficiaryIndex, $index ) {
				if ( $beneficiary.partial_kits.length >= 2 ) {
					$beneficiary.partial_kits.splice( $index, 1);
					// reset list
					angular.forEach( $beneficiary.partial_kits, function ( d, i ) {
						ngmClusterLists.setDetailList( 'partial_kits', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.partial_kits );
					});
					Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
				} else {
					Materialize.toast( 'Minimum of 1 Kit Items required!' , 4000, 'note' );
				}
			},
			
			// add kit-detail
			addKitDetail: function ( $locationIndex, $beneficiaryIndex, $beneficiary ) {
				delete $beneficiary.partial_kits;
				$beneficiary.kit_details.push({});
				// reset list
				angular.forEach( $beneficiary.kit_details, function ( d, i ) {
					ngmClusterLists.setDetailList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
				});
				if ( $beneficiary.kit_details.length < 1 ) {
					Materialize.toast( 'Note: Please add at least 1 kit item to submit!' , 4000, 'note' );
				}
			},

			// remove kit-details
			removeKitDetail: function( project, $beneficiary, $locationIndex, $beneficiaryIndex, $index ) {
				if ( $beneficiary.kit_details.length >= 2 ) {
					$beneficiary.kit_details.splice( $index, 1);
					// reset list
					angular.forEach( $beneficiary.kit_details, function ( d, i ) {
						ngmClusterLists.setDetailList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
					});
					Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
				} else {
					Materialize.toast( 'Minimum of 1 Kit Items required!' , 4000, 'note' );
				}
			}

		};

		// return
		return ngmEtClusterBeneficiaries;

	}]);
