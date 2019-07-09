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

			// set form on load
			// setForm: function( locations, timer ) {
			// 	// small delay to spare the UI
			// 	$timeout(function() {
			// 		// for each location
			// 		angular.forEach( locations, function( l, $locationIndex ){
			// 			// for each location
			// 			angular.forEach( l.beneficiaries, function( b, $beneficiaryIndex ){
			// 				if ( b.kit_details ) {
			// 					// set kit_details
			// 					angular.forEach( b.kit_details, function ( d, i ) {
			// 						ngmEtClusterBeneficiaries.setList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, b.kit_details );
			// 					});
			// 				}
			// 				if ( b.partial_kits ) {
			// 					// set partial_kits
			// 					angular.forEach( b.partial_kits, function ( d, i ) {
			// 						ngmEtClusterBeneficiaries.setList( 'partial_kits', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, b.partial_kits );
			// 					});
			// 				}
			// 			});
			// 		});
			// 	}, timer );
			// },

			// show add kit detials
			// showKits: function( key, $locationIndex, $beneficiaryIndex, beneficiary ){
				
			// 	// display
			// 	var display = false;
				
			// 	// kit_details
			// 	if ( key === 'kit_details' ) {
			// 		display = beneficiary.cluster_id === 'esnfi' && beneficiary.activity_description_id === 'loose_items';
			// 	}
				
			// 	// partial_kits
			// 	if ( key === 'partial_kits' ) {
			// 		display = beneficiary.cluster_id === 'esnfi' && beneficiary.activity_description_id === 'partial_kits';
			// 	}
				
			// 	// defaults to 1 entry
			// 	if ( display && !beneficiary[ key ] ) {
			// 		beneficiary[ key ] = [{}];
			// 		// set kits
			// 		ngmEtClusterBeneficiaries.setList( key, $locationIndex, $beneficiaryIndex, 0, '', beneficiary[ key ] );
			// 	}

			// 	return display;
			// },

			// add kit-detail
			// addKits: function ( key, $locationIndex, $beneficiaryIndex, beneficiary ) {
				
			// 	// delete kit_details ( if any )
			// 	if ( key === 'kit_details' ) {
			// 		delete beneficiary.partial_kits;
			// 	}
			// 	// delete kit_details ( if any )
			// 	if ( key === 'partial_kits' ) {
			// 		delete beneficiary.kit_details;
			// 	}
				
			// 	// add empty 
			// 	beneficiary[ key ].push({});
				
			// 	// reset list
			// 	angular.forEach( beneficiary[ key ], function ( d, i ) {
			// 		ngmEtClusterBeneficiaries.setList( key, $locationIndex, $beneficiaryIndex, i, d.detail_type_id, beneficiary[ key ] );
			// 	});
			// 	if ( beneficiary[ key ].length < 1 ) {
			// 		Materialize.toast( 'Note: Please add at least 1 kit item to submit!' , 4000, 'note' );
			// 	}

			// },

      // manages selections (removes selections from detials list for ET ESNFI partial_kits, kit_details)
    //   setList: function( key, $locationIndex, $beneficiaryIndex, $index, detail_type_id, b_list ) {

    //     // list
    //     var list;

    //     // each beneficiary
    //     if ( !ngmClusterLists[ key ][ $locationIndex ] ) {
    //       ngmClusterLists[ key ][ $locationIndex ] = [];
    //     }
    //     if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] ) {
    //       ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] = [];
    //     }
				// if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
				// 	ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = [];
				// }

    //     // get kit details
    //     switch( key ) {
    //       case 'partial_kits':
    //         list = ngmClusterLists.getPartialKits();
    //         break;
    //       default:
    //         list = ngmClusterLists.getKitDetails();
    //     }
        
    //     // set list at index
    //     ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = angular.copy( list );

    //     // remove current selection
    //     b_list = $filter( 'filter' )( b_list, { detail_type_id: '!' + detail_type_id } );
        
    //     // filter partial_kits
    //     angular.forEach( b_list, function ( detail ) {
    //       if ( detail.detail_type_id ) {
    //         ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = $filter( 'filter' )( ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ], { detail_type_id: '!' + detail.detail_type_id } );
    //       }
    //     });

    //   },

			// remove kit-details
			// removeKit: function( key, project, $locationIndex, $beneficiaryIndex, $index, beneficiary ) {
			// 	if ( beneficiary[ key ].length >= 2 ) {
			// 		beneficiary[ key ].splice( $index, 1);
			// 		// reset list
			// 		angular.forEach( beneficiary[ key ], function ( d, i ) {
			// 			ngmEtClusterBeneficiaries.setList( key, $locationIndex, $beneficiaryIndex, i, d.detail_type_id, beneficiary[ key ] );
			// 		});
			// 		Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
			// 	} else {
			// 		Materialize.toast( 'Minimum of 1 Kit Items required!' , 4000, 'note' );
			// 	}
			// },


























      // kits
			// setKits( $locationIndex, $beneficiaryIndex, $index, key, list ) {
			// 	// first list
			// 	if ( !ngmClusterLists[ key ][ $locationIndex ] ) {
			// 		ngmClusterLists[ key ][ $locationIndex ] = [];
			// 	}
			// 	if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] ) {
			// 		ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] = [];
			// 	}
			// 	if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
			// 		ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = list;
			// 	}
			// },











			// show add kit detials
			// showKitDetails: function( $locationIndex, $beneficiaryIndex, beneficiary ){
			// 	var display = beneficiary.cluster_id === 'esnfi' &&
			// 									beneficiary.activity_description_id === 'loose_items';
			// 	// defaults to 1 entry
			// 	if ( display && !beneficiary.kit_details ) {
			// 		beneficiary.kit_details = [{}];
			// 	}
			// 	// set kits
			// 	// ngmEtClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'kit_details', ngmClusterLists.getKitDetails() );
			// 	return display;
			// },

			// kits
			// setKits( $locationIndex, $beneficiaryIndex, $index, key, list ) {
			// 	// first list
			// 	if ( !ngmClusterLists[ key ][ $locationIndex ] ) {
			// 		ngmClusterLists[ key ][ $locationIndex ] = [];
			// 	}
			// 	if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] ) {
			// 		ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] = [];
			// 	}
			// 	if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
			// 		ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = list;
			// 	}
			// },

			// ethiopia esnfi onchange
			// descriptionChange: function( $locationIndex, $beneficiaryIndex, lists, $beneficiary ) {

			// 	var kits;
			// 	if ( $beneficiary && $beneficiary.activity_type_id ) {

			// 		if ( $beneficiary.activity_type_id === 'hardware_materials_distribution' ) {

			// 			// set
			// 			$timeout(function() {

			// 				if ( $beneficiary.activity_description_id !== 'partial_kits' ) {
			// 					kits = 'kit_details';
			// 				} else {
			// 					kits = 'partial_kits';
			// 				}

			// 				$beneficiary[ kits ] = [{}];
			// 				$beneficiary = ngmEtClusterBeneficiaries.setKitDetails( lists.activity_descriptions, $beneficiary );
			// 				angular.forEach( $beneficiary[ kits ] , function ( d, i ) {
			// 					ngmClusterLists.setDetailList( kits, $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
			// 				});

			// 			}, 100 );

			// 		}
			// 	}
			// },

			// set kit details
			// setKitDetails: function( list, $beneficiary ){
			// 	var kit = $filter('filter')( list, { activity_description_id: $beneficiary.activity_description_id }, true );
			// 	if ( kit[0].kit_details.length ) {
			// 		$beneficiary.kit_details = kit[0].kit_details;
			// 	}
			// 	return $beneficiary;
			// },
			
			// add kit-detail
			// addKitDetail: function ( $locationIndex, $beneficiaryIndex, $beneficiary ) {
			// 	delete $beneficiary.partial_kits;
			// 	$beneficiary.kit_details.push({});
			// 	// reset list
			// 	angular.forEach( $beneficiary.kit_details, function ( d, i ) {
			// 		ngmClusterLists.setDetailList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
			// 	});
			// 	if ( $beneficiary.kit_details.length < 1 ) {
			// 		Materialize.toast( 'Note: Please add at least 1 kit item to submit!' , 4000, 'note' );
			// 	}
			// },

			// remove kit-details
			// removeKitDetail: function( project, $beneficiary, $locationIndex, $beneficiaryIndex, $index ) {
			// 	if ( $beneficiary.kit_details.length >= 2 ) {
			// 		$beneficiary.kit_details.splice( $index, 1);
			// 		// reset list
			// 		angular.forEach( $beneficiary.kit_details, function ( d, i ) {
			// 			ngmClusterLists.setDetailList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
			// 		});
			// 		Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
			// 	} else {
			// 		Materialize.toast( 'Minimum of 1 Kit Items required!' , 4000, 'note' );
			// 	}
			// }

		};

		// return
		return ngmEtClusterBeneficiaries;

	}]);
