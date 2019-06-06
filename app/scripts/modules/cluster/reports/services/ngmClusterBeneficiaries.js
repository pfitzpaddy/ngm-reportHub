/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterBeneficiaries', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', 'ngmClusterHelperNgWash',
							function( $http, $filter, $timeout, ngmAuth, ngmClusterLists, ngmClusterHelperNgWash ) {

		// beneficairies
		var ngmClusterBeneficiaries = {

			// form
			form:[[]],

			merge_keys: [ 
				'indicator_id',
				'indicator_name',
				'strategic_objective_id',
				'strategic_objective_name',
				'strategic_objective_description',
				'sector_objective_id',
				'sector_objective_name',
				'sector_objective_description'
			],

			defaults: {
				form: {
					boys:1,
					girls:1,
					men:1,
					women:1
				},
				units: {
					units:0,
					sessions:0,
					cash_amount:0,
					households:0,
					families:0,
					boys:0,
					girls:0,
					men:0,
					women:0,
					elderly_men:0,
					elderly_women:0,
					total_beneficiaries:0
				},
				activity_description: {
					activity_description_id: '',
					activity_description_name: ''
				},
				activity_detail: {
					activity_detail_id: '',
					activity_detail_name: ''
				},
				indicator: {
					indicator_id: '',
					indicator_name: ''
				},
				beneficiary: {
					beneficiary_type_id: '',
					beneficiary_type_name: ''
				},
				cash_package_units: {
					unit_type_id: '',
					unit_type_name: '',
					mpc_delivery_type_id: '',
					mpc_delivery_type_name: '',
					mpc_mechanism_type_id: '',
					mpc_mechanism_type_name: '',
					package_type_id: '',
					package_type_name: '',
					transfer_type_id: '',
					transfer_type_name: ''
				}
			},
			






			// datepicker ( NG )
			datepicker: {
				startOnClose: function( beneficiary, value ) {
					if (!value) { value =  moment( new Date() ).startOf( 'M' ); }
					beneficiary.activity_start_date = moment.utc( value ).format( 'YYYY-MM-DD' );
				},
				endOnClose: function( beneficiary, value ) {
					if (!value) { value =  moment( new Date() ).endOf( 'M' ); }
					beneficiary.activity_end_date = moment.utc( value ).format( 'YYYY-MM-DD' );
				},
				distributionStartOnClose: function( location, $beneficiaryIndex, $index, value ) {
					location.beneficiaries[ $beneficiaryIndex ].distribution_start_date = moment.utc( value ).format( 'YYYY-MM-DD' );
				},
				distributionEndOnClose: function( location, $beneficiaryIndex, $index, value ) {
					location.beneficiaries[ $beneficiaryIndex ].distribution_end_date = moment.utc( value ).format( 'YYYY-MM-DD' );
					location.beneficiaries[ $beneficiaryIndex ].distribution_status = 'complete';
				},        
			},
















			// update material_select
			updateSelect: function(){
				$timeout(function() { $( 'select' ).material_select(); }, 10 );
			},

			// set the name for a selection
			updateName: function( list, key, name, beneficiary ){
				// this approach does NOT break gulp!
				var obj = {}
				obj[key] = beneficiary[key];
				var select = $filter('filter')( list, obj, true );
				// set name
				beneficiary[ name ] = select[0][ name ];
				// update materialize select
				ngmClusterBeneficiaries.updateSelect();
			},

			// update display name in object on select change
			selectChange: function( project, d, list, key, name, label ){
				if ( d[ key ] ) {
					var id = d[ key ];
					var obj = {}
					var search_list = project.lists[ list ];
					// this approach does NOT break gulp!
					obj[key] = id;
					var filter = $filter('filter')( search_list, obj, true );
					// set name
					d[ name ] = filter[0][ name ];
					$("label[for='" + label + "']").css({ 'color': '#26a69a', 'font-weight': 300 });
					ngmClusterHelperNgWash.init_material_select();
				}
			},

			// add beneficiary
			addBeneficiary: function ( beneficiaries, form_defaults ) {

				// inserted
				var inserted = {}
				var defaults = ngmClusterBeneficiaries.defaults;

				// merge
				angular.merge( inserted, defaults.units, form_defaults );

				// clone
				var length = beneficiaries.length;
				if ( length ) {
					var b = angular.copy( beneficiaries[ length - 1 ] );
					delete b.id;
					delete b.remarks;
					angular.merge( inserted, b, defaults.units, form_defaults );
				}

				// return new beneficiary
				return inserted;
			},

			// show activity (generic)
			setActivity: function( project, beneficiary ){
				
				// set activity
				var selected = [];
				var defaults = ngmClusterBeneficiaries.defaults;
				if( beneficiary.activity_type_id && project.definition.activity_type.length ) {
					selected = $filter('filter')( project.definition.activity_type, { activity_type_id: beneficiary.activity_type_id }, true );
					if( selected && selected.length ) {
						// set activity_type_name
						beneficiary.cluster_id = selected[0].cluster_id;
						beneficiary.cluster = selected[0].cluster;
						beneficiary.activity_type_id = selected[0].activity_type_id;
						beneficiary.activity_type_name = selected[0].activity_type_name; 
						// merge defaults
						angular.merge( beneficiary, defaults.units, defaults.activity_description, defaults.activity_detail, defaults.indicator, defaults.beneficiary, defaults.cash_package_units );
						// set form
						ngmClusterBeneficiaries.setBeneficiariesInputs( project.lists, 0, project.definition.target_beneficiaries.length-1, beneficiary );
					}
				}

			},

			// set description
			setBeneficiaries: function( lists, type, $parent, $index, beneficiary ) {

				// defaults
				var defaults = ngmClusterBeneficiaries.defaults;

				// merge defaults
				if ( type === 'description' ) {
					angular.merge( beneficiary, defaults.units, defaults.activity_detail, defaults.indicator );
				}
				if ( type === 'detail' ) {
					angular.merge( beneficiary, defaults.units, defaults.indicator );
				}
				if ( type === 'indicator' ) {
					angular.merge( beneficiary, defaults.units );
				}

				// set form for beneficiary
				ngmClusterBeneficiaries.setBeneficiariesInputs( lists, 0, $index, beneficiary );		

				// merge defaults from form (activities.csv)
				angular.forEach( ngmClusterBeneficiaries.merge_keys, function ( key, i ) {
					beneficiary[ key ] = ngmClusterBeneficiaries.form[ $parent ][ $index ][ key ];
				});

				// clear cash / package / units
				angular.forEach( defaults.cash_package_units, function ( i, key ) {
					if ( !ngmClusterBeneficiaries.form[ $parent ][ $index ][ key ] && key.indexOf( '_name' ) === -1 ) {
						var key_base = key.slice( 0, -2 );
						delete beneficiary[ key ];
						delete beneficiary[ key_base + 'name' ];
					}
				});
					
				// console.log
				console.log( 'setBeneficiaries' );
				console.log( beneficiary );

			},


			/* SHOW AND HIDE TARGETS */

			// for each location ( monhtly report )
			setLocationsForm: function( lists, locations ) {
				
				// set form
				angular.forEach( locations, function( location, location_index ){
					// for each location
					ngmClusterBeneficiaries.setBeneficiariesForm( lists, location_index, location.beneficiaries );
				});

				// select element to load
				$( 'select' ).ready(function() { setTimeout( function(){ $( 'select' ).material_select(); }, 600 ); });

				// last element to load
				// var el = '#ngm-activity_type_id-' + locations.length-1 + '-' + locations[ locations.length-1 ].beneficiaries.length-1;
				// $( el ).ready(function() {
				// 	setTimeout( function(){ $( 'select' ).material_select(); }, 1000 );
				// });

			},

			// for each location beneficiaries
			setBeneficiariesForm: function ( lists, $parent, beneficiaries ) {

				// beneficiaries
				if( beneficiaries && beneficiaries.length ) {
					// for each beneficiary
					angular.forEach( beneficiaries, function( beneficiary, $index ){
						ngmClusterBeneficiaries.setBeneficiariesInputs( lists, $parent, $index, beneficiary );
					});
				}

			},

			// show form inputs
			setBeneficiariesInputs: function ( lists, $parent, $index, beneficiary ) {

				// add form holder
				if ( !ngmClusterBeneficiaries.form[ $parent ] ) {
					ngmClusterBeneficiaries.form[ $parent ] = [];
				}
				// beneficiary.indicator_id
				if ( beneficiary.indicator_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = $filter('filter')( lists.activity_indicators, { indicator_id: beneficiary.indicator_id }, true )[ 0 ];
				}
				// beneficiary.activity_detail_id
				else if ( beneficiary.activity_detail_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = $filter('filter')( lists.activity_details, { activity_detail_id: beneficiary.activity_detail_id }, true )[ 0 ];
				}
				// beneficiary.activity_description_id
				else if ( beneficiary.activity_description_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = $filter('filter')( lists.activity_descriptions, { activity_description_id: beneficiary.activity_description_id }, true )[ 0 ];
				}
				// reset form
				else if ( beneficiary.activity_type_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = ngmClusterBeneficiaries.defaults.form;
				}

			},

			










































			/* ESNFI KITS */

			// show distribution date
			initDistributionDate: function( beneficiary ){
				// set values
				if ( !beneficiary.distribution_start_date ) {
					beneficiary.distribution_start_date = moment.utc( new Date() ).format( 'YYYY-MM-DD' );
					beneficiary.distribution_status = 'ongoing';
				}
			},

			// show add kit detials
			showPartialKits: function( $locationIndex, $beneficiaryIndex, $index, beneficiary ){
				var display = beneficiary.cluster_id === 'esnfi' && 
												beneficiary.activity_description_id === 'partial_kits';

				// defaults to 1 entry
				if ( display && !beneficiary.partial_kits ) {
					beneficiary.partial_kits = [{}];
				}

				// set kits
				ngmClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'partial_kits', ngmClusterLists.getPartialKits() );

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
				ngmClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'kit_details', ngmClusterLists.getKitDetails() );

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
							$beneficiary = ngmClusterBeneficiaries.setKitDetails( lists.activity_descriptions, $beneficiary );
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
			},

			// remove target_beneficiary from db
			removeTargetBeneficiary: function( id ) {
				$http({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/cluster/project/removeBeneficiary',
					data: { id: id }
				}).success( function( result ) {
					Materialize.toast( 'People in Need Removed!' , 4000, 'success' );
				}).error( function( err ) {
					Materialize.toast( 'Error!', 4000, 'error' );
				});
			},

			// remove beneficiary
			removeBeneficiary: function( project, id ) {
				// update
				$http({
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/report/removeBeneficiary',
						data: { id: id }
				}).success( function( result ){
					if ( result.err ) { Materialize.toast( 'Error! Please correct the ROW and try again', 4000, 'error' ); }
					if ( !result.err ) { project.save( false, false ); }
				}).error(function( err ) {
					Materialize.toast( 'Error!', 4000, 'error' );
				});
			},


			















			/* BENEFICIARIES FORM */ 

			// show cxb health label
			cxbHealth: function( project ) {
				var display = false;
				if ( project.definition.admin0pcode === 'CB' 
							&& project.definition.cluster_id === 'health' ) {
					display = true;
				}
				return display;
			},

			// show activity (generic)
			displayActivity: function( project, $data, $beneficiary ){
				var selected = [];
				$beneficiary.activity_type_id = $data;
				if( $beneficiary.activity_type_id && project.activity_type.length ) {
					selected = $filter('filter')( project.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);
					if( selected && selected.length ) {
						// set activity_type_name
						$beneficiary.cluster_id = selected[0].cluster_id;
						$beneficiary.cluster = selected[0].cluster;
						$beneficiary.activity_type_name = selected[0].activity_type_name;
					}
				}
				return selected.length ? selected[0].activity_type_name : '-';
			},

			// show descipriton (generic)
			displayDescription: function( lists, $data, $beneficiary, row ){
				var selected = [];
				$beneficiary.activity_description_id = $data;
				if( $beneficiary.activity_description_id ) {
					selected = $filter('filter')( lists.activity_descriptions, { 
																						cluster_id: $beneficiary.cluster_id,
																						activity_description_id: $beneficiary.activity_description_id }, true );
					if( selected && selected.length ) {
						
						// set activity_description_name
						$beneficiary.activity_description_name = selected[0].activity_description_name;

						// add indicator ( if exists and no dropdown )
						if ( row && !row.indicator && row.indicator_id ) {
							$beneficiary.strategic_objective_descriptions = selected[0].strategic_objective_descriptions;
							$beneficiary.indicator_id = selected[0].indicator_id;
							$beneficiary.indicator_name = selected[0].indicator_name;
						}

					}
				}
				return selected.length ? selected[0].activity_description_name : '-';
			},

			// display category
			displayDetails: function( lists, $data, $beneficiary, row ) {
				var selected = [];
				$beneficiary.activity_detail_id = $data;
				if( $beneficiary.activity_detail_id ) {
					selected = $filter('filter')( lists.activity_details, { 
																						cluster_id: $beneficiary.cluster_id, 
																						activity_description_id: $beneficiary.activity_description_id,
																						activity_detail_id: $beneficiary.activity_detail_id }, true );
					if( selected.length ) {
						
						// set activity_detail_name
						$beneficiary.activity_detail_name = selected[0].activity_detail_name;
						
						// add indicator ( if exists and no dropdown )
						if ( row && !row.indicator && row.indicator_id ) {
							$beneficiary.strategic_objective_descriptions = selected[0].strategic_objective_descriptions;
							$beneficiary.indicator_id = selected[0].indicator_id;
							$beneficiary.indicator_name = selected[0].indicator_name;
						}

					}
				}
				return selected.length ? selected[0].activity_detail_name : '-';
			},

			// display category
			displayIndicator: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.indicator_id = $data;
				if( $beneficiary.indicator_id ) {
					selected = $filter('filter')( lists.activity_indicators, { indicator_id: $beneficiary.indicator_id }, true);
					if( selected && selected.length ) {
						$beneficiary.strategic_objective_descriptions = selected[0].strategic_objective_descriptions;
						// $beneficiary.indicator_id = selected[0].indicator_id;
						$beneficiary.indicator_name = selected[0].indicator_name;
					}
				}
				return selected.length ? selected[0].indicator_name : '-';
			},
			
			// cholera response
			displayCholera: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.activity_cholera_response_id = $data;
				if( $beneficiary.activity_cholera_response_id ) {
					selected = $filter('filter')( lists.activity_cholera_response, { activity_cholera_response_id: $beneficiary.activity_cholera_response_id }, true);
					if( selected && selected.length ) {
						$beneficiary.activity_cholera_response_name = selected[0].activity_cholera_response_name;
					}
				}
				return selected.length ? selected[0].activity_cholera_response_name : '-';
			},

			// display beneficiary
			displayBeneficiary: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.beneficiary_type_id = $data;
				if( $beneficiary.beneficiary_type_id ) {
					selected = $filter('filter')( lists.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id, cluster_id: $beneficiary.cluster_id }, true);
				}
				if( selected && selected.length ) {
					$beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
				}
				return selected.length ? selected[0].beneficiary_type_name : '-';
			},

			displayBeneficiaryCategories:function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.beneficiary_category_id = $data;
				if( $beneficiary.beneficiary_category_id ) {
					selected = $filter('filter')( lists.beneficiary_categories, { beneficiary_category_id: $beneficiary.beneficiary_category_id }, true);
				}
				if( selected && selected.length ) {
					$beneficiary.beneficiary_category_name = selected[0].beneficiary_category_name;
				}
				return selected.length ? selected[0].beneficiary_category_name : '-';
			},

			// display delivery
			displayDelivery: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.delivery_type_id = $data;
				if( $beneficiary.delivery_type_id ) {
					selected = $filter('filter')( lists.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
					$beneficiary.delivery_type_name = selected[0].delivery_type_name;
				}
				return selected.length ? selected[0].delivery_type_name : '-';
			},

			// unit types
			displayUnitTypes: function( lists, $data, $beneficiary ){
				var selected = [];
				$beneficiary.unit_type_id = $data;
				if( $beneficiary.unit_type_id ) {
					if ( lists && lists.units && lists.units.length  ) {
						selected = $filter('filter')( lists.units, { unit_type_id: $beneficiary.unit_type_id }, true);
					}
					if( selected && selected.length ) {
						$beneficiary.unit_type_name = selected[0].unit_type_name;
					}
				}
				// if only unit
				if( !$beneficiary.unit_type_id && lists.units && lists.units.length === 1 ){
					// set beneficiary
					$beneficiary.unit_type_id = lists.units[0].unit_type_id;
					$beneficiary.unit_type_name = lists.units[0].unit_type_name;
					// set selected
					selected = [{
						unit_type_id: $beneficiary.unit_type_id,
						unit_type_name: $beneficiary.unit_type_name
					}];
				}
				return selected.length ? selected[0].unit_type_name : '-';
			},

			// display delivery ( cash )
			displayCashDelivery: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.mpc_delivery_type_id = $data;
				if( $beneficiary.mpc_delivery_type_id ) {
					// selection
					selected = $filter('filter')( lists.mpc_delivery_types, { mpc_delivery_type_id: $beneficiary.mpc_delivery_type_id }, true );
					if( selected && selected.length ) {
						$beneficiary.mpc_delivery_type_name = selected[0].mpc_delivery_type_name;
					}
				}
				return selected.length ? selected[0].mpc_delivery_type_name : '-';
			},

			// display mechanism ( cash )
			displayCashMechanism: function ( lists, $data, $beneficiary ){
				var selected = [];
				$beneficiary.mpc_mechanism_type_id = $data;
				if ($beneficiary.mpc_mechanism_type_id) {
					// selection
					selected = $filter('filter')( lists.mpc_mechanism_type, { mpc_mechanism_type_id: $beneficiary.mpc_mechanism_type_id }, true);
					if( selected && selected.length ) {
						$beneficiary.mpc_mechanism_type_name = selected[0].mpc_mechanism_type_name;
					}
				}
				return selected.length ? selected[0].mpc_mechanism_type_name : '-';
			},

			// display package
			displayPackageTypes: function( $data, $beneficiary ) {
				var selected = [];
				$beneficiary.package_type_id = $data;
				if( $beneficiary.package_type_id ) {
					// selection
					selected = $filter('filter')( [{
						'package_type_id': 'standard',
						'package_type_name': 'Standard'
					}, {
						'package_type_id': 'non-standard',
						'package_type_name': 'Non-standard'
					}], { package_type_id: $beneficiary.package_type_id }, true );
					if( selected && selected.length ) {
						$beneficiary.package_type_name = selected[0].package_type_name;
					}
				}
				return selected.length ? selected[0].package_type_name : '-';
			},

			// display category
			displayCategory: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.category_type_id = $data;
				if($beneficiary.category_type_id) {
					selected = $filter('filter')( lists.category_types, { category_type_id: $beneficiary.category_type_id }, true);
					if( selected && selected.length ) {
						$beneficiary.category_type_name = selected[0].category_type_name;
					}
				}
				return selected.length ? selected[0].category_type_name : '-';
			},

			// transfer_type_id
			displayTransferTypes: function( lists, $data, $beneficiary ) {
				var selected = [];
				$beneficiary.transfer_type_id = $data;
				if($beneficiary.transfer_type_id) {
					selected = $filter('filter')( lists.transfers, { transfer_type_id: $beneficiary.transfer_type_id }, true);
					if( selected && selected.length ) {
						$beneficiary.transfer_type_value = selected[0].transfer_type_value;
					}
				}else{
					$beneficiary.transfer_type_id = 0;
					$beneficiary.transfer_type_value = 0;
				}
				return selected.length ? selected[0].transfer_type_value : 0;
			},





















			/* VALIDATION */

			// ennsure all locations contain at least one complete beneficiaries
			beneficiaryFormComplete: function( project, locations ) {
				var beneficiaries = 0;
				var rowComplete = 0;
				angular.forEach( locations, function( l ){
					if( l.beneficiaries ) {
						beneficiaries += l.beneficiaries.length;
						if ( l.beneficiaries.length ) {
							angular.forEach( l.beneficiaries, function( b ){
								if ( !ngmClusterBeneficiaries.rowSaveDisabled( project, b ) ) {
									rowComplete++;
								}
							});
						}
					}
				});
				// return
				if( rowComplete >= beneficiaries ){ return true; } else { return false; }
			},

			// disable save form
			rowSaveDisabled: function( project, $data ){
				var disabled = true;
				switch ( project.admin0pcode ) {

					case 'AF':
						if ( $data.activity_type_id && 
									$data.activity_description_id &&
									$data.beneficiary_type_id &&
									$data.units >= 0 &&
									$data.sessions >= 0 &&
									$data.households >= 0 &&
									$data.families >= 0 &&
									$data.boys >= 0 &&
									$data.girls >= 0 &&
									$data.men >= 0 &&
									$data.women >= 0 &&
									$data.elderly_men >= 0 &&
									$data.elderly_women >= 0 ) {
							
							// if report form
							if ( $data.hasOwnProperty('delivery_type_id') ) {
								if ( $data.delivery_type_id ) {
									disabled = false;
								}
							} else {
								// if project form
								disabled = false;
							}
						}

						break;

					case 'ET':
						if ( $data.activity_type_id && 
									$data.activity_description_id &&
									$data.beneficiary_type_id &&
									$data.units >= 0 &&
									$data.sessions >= 0 &&
									$data.households >= 0 &&
									$data.families >= 0 &&
									$data.boys >= 0 &&
									$data.girls >= 0 &&
									$data.men >= 0 &&
									$data.women >= 0 &&
									$data.elderly_men >= 0 &&
									$data.elderly_women >= 0 ) {

							if ( $data.cluster_id === 'esnfi' ) {
								if ( $data.activity_description_id === 'loose_items' ) {
									if ( $data.partial_kits && $data.partial_kits.length >= 1 && $data.households >= 1 ) {
										disabled = false;
									}
									if ( $data.kit_details && $data.kit_details.length >= 1 && $data.households >= 1 ) {
										disabled = false;
									}
								} else if ( $data.households >= 1 ) {
									disabled = false;
								}
							} else {
								disabled = false;
							}
						}
						break;

					case 'NG':
						if ( $data.activity_type_id && 
									$data.activity_description_id &&
									$data.beneficiary_type_id ) {
							disabled = false;
						}
						break;

					default:
						if ( $data.activity_type_id && 
									$data.activity_description_id &&
									$data.beneficiary_type_id &&
									$data.units >= 0 &&
									$data.sessions >= 0 &&
									$data.households >= 0 &&
									$data.families >= 0 &&
									$data.boys >= 0 &&
									$data.girls >= 0 &&
									$data.men >= 0 &&
									$data.women >= 0 &&
									$data.elderly_men >= 0 &&
									$data.elderly_women >= 0 ) {
								disabled = false;
						}
				}
				// return
				return disabled;
			},
			setAssessmentAtribute:function (b) {
				var b_copy =angular.copy(b);
				if(!b_copy.id && !b_copy.hh_surveyed){
					b_copy.hh_surveyed = 0;
					b_copy.hh_acceptable = 0;
					b_copy.hh_acceptable_pmd = 0;
					b_copy.hh_borderline = 0;
					b_copy.hh_borderline = 0;
					b_copy.hh_borderline_pmd = 0;
					b_copy.hh_poor = 0;
					b_copy.hh_poor_pmd = 0;
				}

				return b_copy
			},


			/**** STOCKS? ****/

			// stocks?
			rowSessionsDisabled: function( $beneficiary ){
				var disabled = true;
				if( ( $beneficiary.cluster_id !== 'eiewg' )
							&& ( $beneficiary.activity_description_id )
							&& ( $beneficiary.activity_description_id.indexOf( 'education' ) !== -1 || $beneficiary.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
					disabled = false
				}
				return disabled;
			}

		};

		// return
		return ngmClusterBeneficiaries;

	}]);
