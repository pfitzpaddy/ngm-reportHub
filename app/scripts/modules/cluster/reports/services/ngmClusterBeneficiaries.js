/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	// filter activity by active date
	.filter('filterActiveDate', [ '$filter', function ( $filter ) {
		return function (data, list) {
			if (data) {
				let newData = data.filter(function (d) {
					let isActive = list.filter(function (a) {
						return a.cluster_id === d.cluster_id && a.activity_type_id === d.activity_type_id;
					});
					return isActive.length;
				})
				return newData;
			}
		}
	}])
	// filter active type
	.filter('filterActiveTypes', [ '$filter', function ( $filter ) {
		return function( data, beneficiary ) {
			if ( data ) {
				var list = data.filter(function( d ) {
					if ( !beneficiary.id ) {
						return !d.disabled
					} else {
						return true;
					}
				});
				return list;
			}
		}
	}])
	// filter active descriptions
	.filter('filterActiveDescriptions', [ '$filter', function ( $filter ) {
		return function( data, beneficiary ) {
			if ( data ) {
				var list = data.filter(function( d ) {
					if ( !beneficiary.id ) {
						return d.active &&
										d.cluster_id === beneficiary.cluster_id &&
										d.activity_type_id === beneficiary.activity_type_id;
					} else {
						return d.cluster_id === beneficiary.cluster_id &&
										d.activity_type_id === beneficiary.activity_type_id;
					}
				});
				return list;
			}
		}
	}])
	// filter active details
	.filter('filterActiveDetails', [ '$filter', function ( $filter ) {
		return function( data, beneficiary ) {
			if ( data ) {
				var list = data.filter(function( d ) {
					if ( !beneficiary.id ) {
						return d.active &&
										d.cluster_id === beneficiary.cluster_id &&
										d.activity_type_id === beneficiary.activity_type_id &&
										d.activity_description_id === beneficiary.activity_description_id;
					} else {
						return d.cluster_id === beneficiary.cluster_id &&
										d.activity_type_id === beneficiary.activity_type_id &&
										d.activity_description_id === beneficiary.activity_description_id;
					}
				});
				return list;
			}
		}
	}])
	.factory( 'ngmClusterBeneficiaries', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', 'ngmClusterVulnerablePopulations', 'ngmClusterDetails', 'ngmClusterHelperNgWash',
							function( $http, $filter, $timeout, ngmAuth, ngmClusterLists, ngmClusterVulnerablePopulations, ngmClusterDetails, ngmClusterHelperNgWash ) {

		// beneficairies
		var ngmClusterBeneficiaries = {

			// form
			form:[[]],

			merge_keys: [
				'display_activity_detail',
				'display_indicator',
				'indicator_id',
				'indicator_name',
				'strategic_objective_descriptions',
				'strategic_objective_id',
				'strategic_objective_name',
				'strategic_objective_description',
				'sector_objective_id',
				'sector_objective_name',
				'sector_objective_description'
			],

			defaults: {
				form: {},
				ET: {
					esnfi: {
						households:1,
					}
				},
				inputs: {
					units:0,
					sessions:0,
					cash_amount:0,
					households:0,
					families:0,
					boys_0_5:0,
					boys_6_11:0,
					boys_12_17:0,
					boys:0,
					girls:0,
					girls_0_5:0,
					girls_6_11:0,
					girls_12_17:0,
					men:0,
					women:0,
					elderly_men:0,
					elderly_women:0,
					total_male:0,
					total_female:0,
					total_beneficiaries:0
				},
				// activity_description: {
				// 	activity_description_id: '',
				// 	activity_description_name: ''
				// },
				// activity_detail: {
				// 	activity_detail_id: '',
				// 	activity_detail_name: ''
				// },
				// indicator: {
				// 	indicator_id: '',
				// 	indicator_name: ''
				// },
				// beneficiary: {
				// 	beneficiary_type_id: '',
				// 	beneficiary_type_name: ''
				// },
				// cash_package_units: {
				// 	unit_type_id: '',
				// 	unit_type_name: '',
				// 	mpc_delivery_type_id: '',
				// 	mpc_delivery_type_name: '',
				// 	mpc_mechanism_type_id: '',
				// 	mpc_mechanism_type_name: '',
				// 	package_type_id: '',
				// 	package_type_name: '',
				// 	transfer_type_id: '',
				// 	transfer_type_name: ''
				// }
			},


			/* FORM UPDATES */

			// datepicker
			datepicker: {

				// show distribution date
				initActivityDate: function( report, beneficiary ){
					// set values
					if ( !beneficiary.activity_start_date ) {
						beneficiary.activity_status = 'ongoing';
						beneficiary.activity_start_date = moment( report.reporting_period ).startOf( 'M' ).format( 'YYYY-MM-DD' );
						beneficiary.activity_end_date = '';
					}
				},
				//
				startOnClose: function( beneficiary, value ) {
					if (!value) { value =  moment().startOf( 'M' ); }
					beneficiary.activity_start_date = moment( value ).format( 'YYYY-MM-DD' );
				},
				endOnClose: function( beneficiary, value ) {
					if (!value) { value =  moment().endOf( 'M' ); }
					beneficiary.activity_end_date = moment( value ).format( 'YYYY-MM-DD' );
				},
				// activity start date, end date
				activityStartOnClose: function( location, $beneficiaryIndex, $index, value ) {
					location.beneficiaries[ $beneficiaryIndex ].activity_start_date = moment( new Date( value ) ).format( 'YYYY-MM-DD' );
					if ( moment().format( 'YYYY-MM-DD' ) >= moment( location.beneficiaries[ $beneficiaryIndex ].activity_start_date ).format( 'YYYY-MM-DD' ) ) {
						location.beneficiaries[ $beneficiaryIndex ].activity_status = 'ongoing';
					} else {
						location.beneficiaries[ $beneficiaryIndex ].activity_status = 'planned';
					}
				},
				activityEndOnClose: function( location, $beneficiaryIndex, $index, value ) {
					if ( value ) {
						location.beneficiaries[ $beneficiaryIndex ].activity_end_date = moment( new Date ( value ) ).format( 'YYYY-MM-DD' );
						location.beneficiaries[ $beneficiaryIndex ].activity_status = 'complete';
					}
				}
			},

			// set input style
			inputChange: function( label ){
				$("label[for='" + label + "']").removeClass('error').addClass('active');
			},

			// update material_select
			updateSelect: function(){
				$timeout(function() {
					// $( 'select' ).material_select();
					$('select').formSelect();
				}, 400 );
			},

			updateSelectById: function (id) {
				$timeout(function () {
					// $('#' + id + ' select').material_select();
					$('#' + id + ' select').formSelect();
				 }, 10 );
			},

			// sum for totals (age groups)
			updateBeneficiairesBreakdown: function( beneficiary ) {
				// set
				$timeout(function() {
					beneficiary.boys = 0;
					beneficiary.girls = 0;

					// calc
					beneficiary.boys += beneficiary.boys_0_5 +
																beneficiary.boys_6_11 +
																beneficiary.boys_12_17;
					beneficiary.girls += beneficiary.girls_0_5 +
																beneficiary.girls_6_11 +
																beneficiary.girls_12_17;
					// calc totals
					ngmClusterBeneficiaries.updateBeneficiaires( beneficiary );
				}, 100 );
			},

			// sum for totals
			updateBeneficiaires: function( beneficiary ) {
				// set
				$timeout(function() {
					beneficiary.total_male = 0;
					beneficiary.total_female = 0;
					beneficiary.total_beneficiaries = 0;

					// calc
					// beneficiary.total_male += beneficiary.boys +
					// 											beneficiary.men +
					// 											beneficiary.elderly_men;
					// beneficiary.total_female += beneficiary.girls +
					// 											beneficiary.women +
					// 											beneficiary.elderly_women;

					beneficiary.total_male += ((beneficiary.boys === null || beneficiary.boys === undefined || beneficiary.boys === NaN || beneficiary.boys < 0 || beneficiary.boys === '') ? 0 : beneficiary.boys) +
						((beneficiary.men === null || beneficiary.men === undefined || beneficiary.men === NaN || beneficiary.men < 0 || beneficiary.men === '') ? 0 : beneficiary.men) +
						((beneficiary.elderly_men === null || beneficiary.elderly_men === undefined || beneficiary.elderly_men === NaN || beneficiary.elderly_men < 0 || beneficiary.elderly_men === '') ? 0 : beneficiary.elderly_men);

					beneficiary.total_female += ((beneficiary.girls === null || beneficiary.girls === undefined || beneficiary.girls === NaN || beneficiary.girls < 0 || beneficiary.girls === '') ? 0 : beneficiary.girls) +
						((beneficiary.women === null || beneficiary.women === undefined || beneficiary.women === NaN || beneficiary.women < 0 || beneficiary.women === '') ? 0 : beneficiary.women) +
						((beneficiary.elderly_women === null || beneficiary.elderly_women === undefined || beneficiary.elderly_women === NaN || beneficiary.elderly_women < 0 || beneficiary.elderly_women === '') ? 0 : beneficiary.elderly_women);

					beneficiary.total_beneficiaries += beneficiary.total_male + beneficiary.total_female;
				}, 100 );
			},

			// set the name for a selection
			updateName: function( list, key, name, beneficiary ){

				// this approach does NOT break gulp!
				$timeout(function() {
					var obj = {}
					obj[key] = beneficiary[key];
					var select = $filter('filter')( list, obj, true );

					// set name
					if ( select.length ) {
						// name
						beneficiary[ name ] = select[0][name];
					}
					// clear name
					if ( beneficiary[ key ] === null ){
						beneficiary[ name ] = null;
					}
				}, 10 );
			},

			// update display name in object on select change
			selectChange: function( project, d, list, key, name, label ){
				if ( d[ key ] ) {
					$timeout(function() {
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
					}, 100 );
				}
			},

			// show cxb health label
			cxbHealth: function( project ) {
				var display = false;
				if ( project.definition.admin0pcode === 'CB'
							&& project.definition.cluster_id === 'health' ) {
					display = true;
				}
				return display;
			},



			/* BENEFICIARIES */

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

			// add beneficiary
			addBeneficiary: function ( project, beneficiaries ) {

				// inserted
				var inserted = {}
				var context_defaults = {}
				var length = beneficiaries.length;
				var defaults = ngmClusterBeneficiaries.defaults;

				// merge
				angular.merge( inserted, defaults.inputs, context_defaults );

				// clone
				var length = beneficiaries.length;
				if ( length ) {
					var b = angular.copy( beneficiaries[ length - 1 ] );
					delete b.id;
					delete b.remarks;
					delete b.createdAt;
					delete b.updatedAt;
					context_defaults = defaults[ project.definition.admin0pcode ] && defaults[ project.definition.admin0pcode ][ b.cluster_id ] ? defaults[ project.definition.admin0pcode ][ b.cluster_id ] : {}
					angular.merge( inserted, b, defaults.inputs, context_defaults );
				}

				// return new beneficiary
				return inserted;
			},



			/* BENEFICIARIES FORM */

			// display full form
			showFormInputs: function( beneficiary, form ) {
				var display = false;

				// kind of not sure whats going on here
				if ( beneficiary.activity_description_id ) {
					if( !form.display_activity_detail ) {
						display = true;
					}
					if( beneficiary.activity_detail_id && form.display_activity_detail  ) {
						display = true;
					}
				}
				return display;
			},

			// show activity (generic)
			setActivity: function( project, $parent, $index, beneficiary ){

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
						// angular.merge( beneficiary, defaults.inputs, defaults.activity_description, defaults.activity_detail, defaults.indicator, defaults.beneficiary, defaults.cash_package_units );
						// angular.merge( beneficiary, defaults.inputs );

						// defaults
						var defaults = ngmClusterBeneficiaries.defaults;
						var context_defaults = defaults[ project.definition.admin0pcode ] && defaults[ project.definition.admin0pcode ][ beneficiary.cluster_id ] ? defaults[ project.definition.admin0pcode ][ beneficiary.cluster_id ] : {}

						// merge defaults
						angular.merge( beneficiary, defaults.inputs, context_defaults );

						// remove attributes (from previous selections of same record)
						delete beneficiary.activity_description_id;
						delete beneficiary.activity_description_name;
						delete beneficiary.activity_detail_id;
						delete beneficiary.activity_detail_name;
						delete beneficiary.indicator_id;
						delete beneficiary.indicator_name;
						delete beneficiary.beneficiary_type_id;
						delete beneficiary.beneficiary_type_name;
						delete beneficiary.unit_type_id;
						delete beneficiary.unit_type_name;
						delete beneficiary.mpc_delivery_type_id;
						delete beneficiary.mpc_delivery_type_name;
						delete beneficiary.mpc_mechanism_type_id;
						delete beneficiary.mpc_mechanism_type_name;
						delete beneficiary.package_type_id;
						delete beneficiary.package_type_name;
						delete beneficiary.transfer_type_id;
						delete beneficiary.transfer_type_value;
						delete beneficiary.transfer_type_name;

						// set form
						ngmClusterBeneficiaries.setBeneficiariesInputs( project.lists, $parent, $index, beneficiary );
					}
				}

			},

			// set description
			setBeneficiaries: function( project, type, $parent, $index, beneficiary ) {

				// cleaning
				if ( type === 'description' ) {
					delete beneficiary.activity_detail_id;
					delete beneficiary.activity_detail_name;
					delete beneficiary.indicator_id;
					delete beneficiary.indicator_name;
				}
				if ( type === 'detail' ) {
					delete beneficiary.indicator_id;
					delete beneficiary.indicator_name;
				}

				// set form for beneficiary
				ngmClusterBeneficiaries.setBeneficiariesInputs( project.lists, $parent, $index, beneficiary );

				// merge defaults from form (activities.csv)
				angular.forEach( ngmClusterBeneficiaries.merge_keys, function ( key, i ) {
					beneficiary[ key ] = ngmClusterBeneficiaries.form[ $parent ][ $index ][ key ];
				});

				// clear
				if ( beneficiary.vulnerable_populations && beneficiary.vulnerable_populations.length ) {
					beneficiary.vulnerable_populations = [{}];
					ngmClusterVulnerablePopulations.setList( ngmClusterBeneficiaries.form[ $parent ][ $index ].vulnerable_populations, $parent, $index, 0, '', [{}] );
				}

				// clear
				if ( beneficiary.details && beneficiary.details.length ) {
					beneficiary.details = [{}];
					ngmClusterDetails.setList( ngmClusterBeneficiaries.form[ $parent ][ $index ].details, $parent, $index, 0, '', [{}] );
				}


				// clear cash / package / units
				// angular.forEach( defaults.cash_package_units, function ( i, key ) {
				// 	if ( !ngmClusterBeneficiaries.form[ $parent ][ $index ][ key ] && key.indexOf( '_name' ) === -1 ) {
				// 		var key_base = key.slice( 0, -2 );
				// 		delete beneficiary[ key ];
				// 		delete beneficiary[ key_base + 'name' ];
				// 	}
				// });

				// set beneficary category id for AF
				// if (project.definition.admin0pcode === 'AF' && ngmClusterBeneficiaries.form[$parent][$index]['beneficiary_category_type_id'] && !beneficiary.beneficiary_category_id){
				// 	beneficiary.beneficiary_category_id = project.lists.beneficiary_categories[0].beneficiary_category_id;
				// 	beneficiary.beneficiary_category_name = project.lists.beneficiary_categories[0].beneficiary_category_name;
				// }

			},



			/* SHOW AND HIDE FORM INPUTS */

			// for each location ( monhtly report )
			setLocationsForm: function( lists, locations ) {

				// set form
				angular.forEach( locations, function( location, location_index ){
					// for each location
					ngmClusterBeneficiaries.setBeneficiariesForm( lists, location_index, location.beneficiaries );
				});

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

				// DISPLAY
				// display_indicator, display_activity_detail stored from activities.csv

				// beneficiary.display_indicator
				if ( beneficiary.display_indicator && beneficiary.indicator_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = $filter('filter')( lists.activity_indicators, { indicator_id: beneficiary.indicator_id, activity_detail_id: beneficiary.activity_detail_id, activity_description_id: beneficiary.activity_description_id, activity_type_id: beneficiary.activity_type_id, cluster_id: beneficiary.cluster_id }, true )[ 0 ];
				}
				// beneficiary.display_activity_detail
				else if ( beneficiary.display_activity_detail && beneficiary.activity_detail_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = $filter('filter')( lists.activity_details, { activity_detail_id: beneficiary.activity_detail_id, activity_description_id: beneficiary.activity_description_id, activity_type_id: beneficiary.activity_type_id, cluster_id: beneficiary.cluster_id }, true )[ 0 ];
				}
				// beneficiary.activity_description_id
				else if ( beneficiary.activity_description_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = $filter('filter')( lists.activity_descriptions, { activity_description_id: beneficiary.activity_description_id, activity_type_id: beneficiary.activity_type_id, cluster_id: beneficiary.cluster_id }, true )[ 0 ];
				}
				// reset form
				else if ( beneficiary.activity_type_id ) {
					ngmClusterBeneficiaries.form[ $parent ][ $index ] = angular.copy( ngmClusterBeneficiaries.defaults.form );
				}

				// set default form on activity missing
				if ( typeof ngmClusterBeneficiaries.form[$parent][$index] === 'undefined' ) {
					ngmClusterBeneficiaries.form[$parent][$index] = angular.copy( ngmClusterBeneficiaries.defaults.form );
				}

				// set details
				if ( !ngmClusterBeneficiaries.form[ $parent ][ $index ][ 'display_details' ] &&
							ngmClusterBeneficiaries.form[ $parent ][ $index ][ 'details' ] &&
							ngmClusterBeneficiaries.form[ $parent ][ $index ][ 'details' ].length ) {
					// set details from activities.csv
					beneficiary.details = ngmClusterBeneficiaries.form[ $parent ][ $index ].details;
				} else {
					// remove if exists
					if ( beneficiary.details ) {
						beneficiary.details = [];
					}
				}
        
				// set default form on activity missing
				if ( typeof ngmClusterBeneficiaries.form[$parent][$index] === 'undefined' ) {
					ngmClusterBeneficiaries.form[$parent][$index] = angular.copy( ngmClusterBeneficiaries.defaults.form );
				}

				// should form be displayed
				if ( ngmClusterBeneficiaries.form[$parent][$index] ) {
 					ngmClusterBeneficiaries.form[$parent][$index].display = ngmClusterBeneficiaries.showFormInputs( beneficiary, ngmClusterBeneficiaries.form[$parent][$index] );
				}
				// if beneficiary.response exist then check ngmClusterBeneficiaries.form[$parent][$index]['exist']
				if (beneficiary.response && beneficiary.response.length>0){

					if (!ngmClusterBeneficiaries.form[$parent][$index]['response']){
						temp_list = []
					}else{
						var temp_list = ngmClusterBeneficiaries.form[$parent][$index]['response'];
					}
					var count_missing = 0;
					angular.forEach(beneficiary.response,(e) => {
						missing_index = temp_list.findIndex( value => value.response_id === e.response_id);
						// if response_id is not in the temp list then push missing response_id to temp list
						if (missing_index < 0) {
							temp_list.push(e);
							count_missing += 1;
						}
					});
					if (count_missing > 0) {
						// set ngmClusterBeneficiaries.form[$parent][$index]['response'] same as temp list if some of response_id is missing
						ngmClusterBeneficiaries.form[$parent][$index]['response'] = temp_list;
					}
				}

				// should form be displayed
				if ( ngmClusterBeneficiaries.form[$parent][$index] ) {
 					ngmClusterBeneficiaries.form[$parent][$index].display = ngmClusterBeneficiaries.showFormInputs( beneficiary, ngmClusterBeneficiaries.form[$parent][$index] );
				}



			},



			/* REMOVE BENEFICIARIES */

			// remove target_beneficiary from db
			removeTargetBeneficiary: function( id ) {
				$http({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/cluster/project/removeBeneficiary',
					data: { id: id }
				}).success( function( result ) {
					// Materialize.toast( $filter('translate')('target_beneficiary_removed'), 4000, 'success' );
					M.toast({ html: $filter('translate')('target_beneficiary_removed'), displayLength: 4000, classes: 'success' });
				}).error( function( err ) {
					// Materialize.toast( 'Error!', 4000, 'error' );
					M.toast({ html: 'Error!', displayLength: 4000, classes: 'error' });
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
					if ( result.err ) {
						// Materialize.toast( 'Error! Please correct the ROW and try again', 4000, 'error' );
						M.toast({ html: 'Error! Please correct the ROW and try again', displayLength: 4000, classes: 'error' });
					}
					if ( !result.err ) { project.save( false, false ); }
				}).error(function( err ) {
					// Materialize.toast( 'Error!', 4000, 'error' );
					M.toast({ html: 'Error!', displayLength: 4000, classes: 'error' });
				});
			},

			// remove report request
			removeReport: function (project, report_id, cb) {
				// update
				$http({
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/cluster/report/delete',
					data: { id: report_id }
				}).success(function (result) {
					if (result.err) {
						cb(true)
						// Materialize.toast('Error! Something went wrong', 4000, 'error');
						M.toast({ html: 'Error! Something went wrong', displayLength: 4000, classes: 'error' });
					} else {
						cb(null)
						// Materialize.toast($filter('translate')('report_removed'), 4000, 'success');
						M.toast({ html: $filter('translate')('report_removed'), displayLength: 4000, classes: 'success' });
					}
				}).error(function (err) {
					cb(true)
					// Materialize.toast('Error!', 4000, 'error');
					M.toast({ html: 'Error!', displayLength: 4000, classes: 'error' });
				});
			},


			/* RELICS */


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

							if (project.project_hrp_project){
								if (!$data.hrp_beneficiary_type_id){
									disabled = true
								}else{
									disabled = false;
								}

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
							disabled = false;
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
			},
			setSpecific: function(id,beneficiary,list){
				var list_project = list;

				if (!beneficiary.response) {
					beneficiary.response = [];
				}
				if (document.getElementById(id).checked) {
					selected = $filter('filter')(list_project, { response_id: id }, true);
					if(selected.length){
						beneficiary.response.push(selected[0]);
					}

				} else {
					if (beneficiary.response.length > 0) {
						index = beneficiary.response.findIndex(value => value.response_id === id);
						if (index > -1) {
							beneficiary.response.splice(index, 1);
						}
					} else {
						beneficiary.response = [];

					}
				}
			},
			checkSpecific: function (id,beneficiary,list) {
				if (!beneficiary.response) {
					return false
				} else {
					index = beneficiary.response.findIndex(value => value.response_id === id);
					if (index > -1) {
						return true
					} else {
						return false
					}
				}
			},

		};

		// return
		return ngmClusterBeneficiaries;

	}]);
