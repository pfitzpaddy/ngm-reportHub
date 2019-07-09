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

			// update display name in object on select change
			selectChange: function( d, search_list, key, name, label, input_label ){
				if ( d[ key ] ) {
					$timeout(function() {
						var id = d[ key ];
						var obj = {}
						// this approach does NOT break gulp!
						obj[key] = id;
						var filter = $filter('filter')( search_list, obj, true );
						// set name
						d[ name ] = filter[0][ name ];
						d[ label ] = filter[0][ label ];
						// update form
						ngmClusterBeneficiaries.inputChange( input_label );
						ngmClusterBeneficiaries.updateSelectById( input_label );
					}, 100 );
				}
			},

			// set form on load
			setForm: function( locations, timer ) {
				// small delay to spare the UI
				$timeout(function() {
					// for each location
					angular.forEach( locations, function( l, $locationIndex ){
						// for each location
						angular.forEach( l.beneficiaries, function( b, $beneficiaryIndex ){
							if ( b.details ) {
								// set details form
								angular.forEach( b.details, function ( d, i ) {
									ngmClusterDetails.setList( $locationIndex, $beneficiaryIndex, i, d.unit_type_id, b.details );
								});
							}
						});
					});
				}, timer );
			},			

			// manages selections (removes selections from detials list for ET ESNFI partial_kits, kit_details)
			setList: function( $locationIndex, $beneficiaryIndex, $index, unit_type_id, d_list ) {
				
				// list
				var list;

				// each beneficiary
				if ( !ngmClusterLists.details ) {
					ngmClusterLists.details = [];
				}
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
				list = ngmClusterBeneficiaries.form[ $locationIndex ][ $beneficiaryIndex ][ 'details' ];
				
				// set list at index
				ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = angular.copy( list );

				// remove current row from list filter
				d_list = $filter( 'filter' )( d_list, { unit_type_id: '!' + unit_type_id } );
				
				// filter partial_kits
				angular.forEach( d_list, function ( detail ) {
					if ( detail.unit_type_id ) {
						ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = 
							$filter( 'filter' )( ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ], { unit_type_id: '!' + detail.unit_type_id } );
					}
				});

				// update select by id
				ngmClusterBeneficiaries.updateSelect();

			},

			// add details
			addDetail: function( $locationIndex, $beneficiaryIndex, beneficiary ) {
				// add empty 
				if ( !beneficiary.details ) {
					beneficiary.details = [];	
				}
				beneficiary.details.push({ unit_type_quantity:0 });
				// reset list
				angular.forEach( beneficiary.details, function ( d, i ) {
					ngmClusterDetails.setList( $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details );
				});
			},

			removeDetail: function( $locationIndex, $beneficiaryIndex, $index, beneficiary ) {
				if ( beneficiary.details.length >= 1 ) {
					beneficiary.details.splice( $index, 1 );
					// set details form
					angular.forEach( beneficiary.details, function ( d, i ) {
						ngmClusterDetails.setList( $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details );
					});
					Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
				}
			},

		};

		// return
		return ngmClusterDetails;

	}]);
