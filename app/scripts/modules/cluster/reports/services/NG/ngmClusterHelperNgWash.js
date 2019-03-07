/**
 * @name ngmReportHub.factory:ngmClusterHelperNgWash
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperNgWash', 
			[ '$http',
				'$filter',
				'$timeout',
 				'$injector',
				'ngmAuth',
				'ngmClusterHelperNgWashKeys',
				'ngmClusterHelperNgWashLists',
				'ngmClusterHelperNgWashValidation',
				function( $http, $filter, $timeout, $injector, ngmAuth, ngmClusterHelperNgWashKeys, ngmClusterHelperNgWashLists, ngmClusterHelperNgWashValidation ) {

		// definition
		var ngmClusterHelperNgWash = {
					
			// NG and WASH
			templateUrl: 'beneficiaries/NG/wash/',

			// beneficiaries calculations
			ratios: {

				// defaults
				hhs: 0.1666666666667, // 1/6
				boys: 0.2538,
				girls: 0.2862,
				men: 0.1833,
				women: 0.2067,
				elderly_men: 0.0329,
				elderly_women: 0.0371,
				beneficiaries: 66.6667,

				// beneficiary ratios
				// water
				water:{
					keys: [ 'quantity' ],
					beneficiaries: 66.6667
				},
				taps:{
					keys: [ 'quantity' ],
					beneficiaries: 250
				},
				tablets:{
					keys: [ 'quantity' ],
					beneficiaries: 1.33333333
				},
				// sanitation
				// latrines
				households:{
					keys: [ 'quantity' ],
					beneficiaries: 6
				},
				latrines:{
					keys: [ 'male', 'female', 'male_disabled', 'female_disabled' ],
					beneficiaries: 50
				},
				desludged:{
					keys: [ 'quantity' ],
					beneficiaries: 50
				},
				hand_washing:{
					keys: [ 'quantity' ],
					beneficiaries: 50
				},
				// showers
				showers:{
					keys: [ 'male', 'female', 'male_disabled', 'female_disabled' ],
					beneficiaries: 100
				},
				// Hygiene
				// kit
				kits:{
					keys: [ 'quantity' ],
					beneficiaries: 6
				},
				monitoring:{
					keys: [ 'quantity' ],
					beneficiaries: 1
				},
				// CTP
				// cash
				cash:{
					keys: [ 'households' ],
					beneficiaries: 6
				},
				// accountability
				complaints:{
					keys: [ 'complaints_recieved' ],
					beneficiaries: 1
				}
			},

			
			// TEMPLATES

			// show template
			getTemplate: function( beneficiary ){
				if ( beneficiary && 
							beneficiary.activity_detail_id && 
							ngmClusterHelperNgWashKeys.keys[ beneficiary.activity_detail_id ].template ) {
					return ngmClusterHelperNgWashKeys.keys[ beneficiary.activity_detail_id ].template
				} else {
					return false;
				}
			},


			// UI UPDATES

			// reset form
			init_material_select: function(){
				setTimeout(function(){ 
					$( '.input-field input' ).removeClass( 'invalid' );
					$( '.input-field input' ).removeClass( 'ng-touched' );
					$( '.input-field select' ).material_select(); 
				}, 10 );
			},

			// set input style 
			inputChange: function( label ){
				$("label[for='" + label + "']").css({ 'color': '#26a69a', 'font-weight': 300 });
			},

			// update display name in object on select change
			selectChange: function( d, list, key, name, label ){
				if ( d[ key ] ) {
					var id = d[ key ];
					var obj = {}
					var search_list = ngmClusterHelperNgWashLists.lists[ list ];
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
			addBeneficiary: function ( beneficiaries ) {

				// clone
				var length = beneficiaries.length;

				// inserted
				var inserted = {};
				var sadd = {
					cash_amount: 0,
					households: 0,
					boys: 0,
					girls: 0,
					men: 0,
					women: 0,
					elderly_men: 0,
					elderly_women: 0,
					total_beneficiaries: 0
				};

				// merge
				angular.merge( inserted, sadd );

				// if previous beneficiaries
				if ( length ) {
										
					var b = angular.copy( beneficiaries[ length - 1 ] );
					var keys = ngmClusterHelperNgWashKeys.keys[ b.activity_detail_id ];
					var defaults = ngmClusterHelperNgWashKeys.keys.defaults;

					// associations
					delete b.id;
					inserted = angular.merge( inserted, b, sadd );
					angular.forEach( inserted, function( d, i ){
						if ( Array.isArray( d ) ) {
							// associations
							if ( i === 'water' || 
										i === 'boreholes' ||
										i === 'sanitation' ||
										i === 'hygiene' ||
										i === 'cash' ||
										i === 'accountability') {
								angular.forEach( d, function( e, j ){
									delete e.id;
									delete e.createdAt;
									delete e.updatedAt;
									// to copy
									// e = angular.merge( {}, keys.measurement, defaults );
									angular.merge( e, keys.measurement, defaults );
								});
							}
						}
					});
				}

				// refresh UI
				ngmClusterHelperNgWash.init_material_select();

				// return
				return inserted;

			},

			// add initial object
			detailsChange: function( locations, $location, $beneficiary ){

				// slight timeout to capture UI changes
				$timeout(function(){
					
					// beneficiary
					if ( $beneficiary.activity_detail_id ) {

						// ngmClusterHelperNgWash keys 
						var keys = ngmClusterHelperNgWashKeys.keys[ $beneficiary.activity_detail_id ];
						var defaults = ngmClusterHelperNgWashKeys.keys.defaults;

						// remove all previous entries
						$beneficiary.water = [];
						$beneficiary.boreholes = [];
						$beneficiary.sanitation = [];
						$beneficiary.hygiene = [];
						$beneficiary.cash = [];
						$beneficiary.accountability = [];
						ngmClusterHelperNgWashLists.details = [];

						// add new
						ngmClusterHelperNgWash.addActivity( locations, $location, $beneficiary, keys.association );

					}
				}, 10 );
			},


			// ADD RECORDS

			// add activity ( reticulation, service, maintenance )
			addActivity: function( locations, location, beneficiary, association, btn_id ) {

				// based on association and activity_detail
				var length = beneficiary[ association ] ? beneficiary[ association ].length : 0;
				var keys = ngmClusterHelperNgWashKeys.keys[ beneficiary.activity_detail_id ];
				var defaults = ngmClusterHelperNgWashKeys.keys.defaults;
				
				// create model using ngmClusterHelperNgWash keys ( based on activity_detail )
				var activity = angular.merge( {}, keys.measurement, defaults );

				// in case of boreholes ( only saved ay db level if boreholes )
				activity.borehole_lng = location.site_lng;
				activity.borehole_lat = location.site_lat;

				// set association
				if ( !length ){
					beneficiary[ association ] = [];
				}

				// copy previous
				if ( length ) {
					var a = angular.copy( beneficiary[ association ][ length - 1 ] );
					delete a.id;
					delete a.details;
					delete a.createdAt;
					delete a.updatedAt;
					activity = angular.merge( {}, a, activity );
				}

				// push
				beneficiary[ association ].push( activity );
				ngmClusterHelperNgWash.setActivityBeneficiaries( locations );

				// ensures page does not scroll to 5W activity input form
				if ( btn_id ) { 
					$( '#' + btn_id ).animatescroll();
				}

				// init
				ngmClusterHelperNgWash.init_material_select();

			},

			// add new details
			addDetails: function( d, obj ){
				d.details.push( obj );
				// ngmClusterHelperNgWash.init_material_select();
			},

      // remove kit-details
      removeDetail: function( d, $locationIndex, $beneficiaryIndex, $index ) {
        d.details.splice( $index, 1);
        if ( ngmClusterHelperNgWashLists.details[ $locationIndex ] && ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ] ) {
        	ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ].splice( $index, 1 );
        }
        Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
      },


			// REMOVE RECORDS

			// remove beneficiary nodal
			removeModal: function( project, beneficiary, $index, association, modal ) {
				ngmClusterHelperNgWash.project = project;
				ngmClusterHelperNgWash.beneficiary = beneficiary;
				ngmClusterHelperNgWash.removeIndex = $index;
				ngmClusterHelperNgWash.association = association;
				$( modal ).openModal({ dismissible: false });
			},

			// remove borehole
			remove: function(){
				
				// get id
				var id = ngmClusterHelperNgWash.beneficiary[ ngmClusterHelperNgWash.association ][ ngmClusterHelperNgWash.removeIndex ].id;
				ngmClusterHelperNgWash.beneficiary[ ngmClusterHelperNgWash.association ].splice( ngmClusterHelperNgWash.removeIndex, 1 );

				// calculate location totals
				ngmClusterHelperNgWash.setActivityBeneficiaries( ngmClusterHelperNgWash.project.report.locations );
				
				// update db if id exists (stored in db)
				if ( id ) {
					ngmClusterHelperNgWash.project.save( false, false );
				}			
			},


			// CALCULATIONS

			// get sadd breakdowns
			bSadd: function( b ){
				var ratios = ngmClusterHelperNgWash.ratios;
				// sadd
				b.households = Math.round( b.total_beneficiaries * ratios.hhs );
				b.boys = Math.round( b.total_beneficiaries * ratios.boys );
				b.girls = Math.round( b.total_beneficiaries * ratios.girls );
				b.men = Math.round( b.total_beneficiaries * ratios.men );
				b.women = Math.round( b.total_beneficiaries * ratios.women );
				b.elderly_men = Math.round( b.total_beneficiaries * ratios.elderly_men );
				b.elderly_women = Math.round( b.total_beneficiaries * ratios.elderly_women );
				b.total_beneficiaries = Math.round( b.total_beneficiaries );
			},

			// borehole
			// m3 = yield*hrs*3600secs
			boreholeOutput: function( locations, b ){
				if ( b.borehole_yield_ltrs_second >=0 && 
							b.borehole_pumping_ave_daily_hours >=0 ) {
					// metrics
					b.borehole_m3 = b.borehole_yield_ltrs_second * b.borehole_pumping_ave_daily_hours * 3600;
					b.total_beneficiaries = ( b.borehole_m3 * ngmClusterHelperNgWash.ratios.beneficiaries ) * 0.001;
					// sadd
					ngmClusterHelperNgWash.bSadd( b );
					// calculate location totals
					ngmClusterHelperNgWash.setActivityBeneficiaries( locations );
				}
			},

			// taps * 250
			indicatorOutput: function( locations, b, key ){
				if ( b.quantity >=0 ) {
					// calculate metrics
					b.total_beneficiaries = 0;
					// add each key
					angular.forEach( ngmClusterHelperNgWash.ratios[ key ].keys, function( d, i ){
						b.total_beneficiaries += b[ d ];
					});
					// times ratio
					b.total_beneficiaries *= ngmClusterHelperNgWash.ratios[ key ].beneficiaries;
					// make it sadd
					ngmClusterHelperNgWash.bSadd( b );
					// calculate beneficairy totals
					ngmClusterHelperNgWash.setActivityBeneficiaries( locations ); 
				}
			},

			// TOTAL BENEFICIARIES

			// set total beneficiaries
			setActivityBeneficiaries: function( locations ){
				// set beneficiary populations
				angular.forEach( locations, function( l, i ){
					angular.forEach( l.beneficiaries, function( b, j ){
						if ( 	
									// water - ops and maintenance
									b.activity_detail_id === 'washcoms_establishment_training' ||
									b.activity_detail_id === 'operation_maintenance_monitoring' ||
									b.activity_detail_id === 'maintenance_repair_kits_provision_to_washcoms' ||
									b.activity_detail_id === 'maintenance_repair_replacement_water_systems' ||

									// sanitation - latrines
									b.activity_detail_id === 'latrine_sludge_dumping_site' ||
									b.activity_detail_id === 'latrine_monitoring' ||

									// sanitation - waste management
									b.activity_detail_id === 'cleaning_campaigns' ||
									b.activity_detail_id === 'communal_refuse_pit_excavation_for_incineration_burial' ||
									b.activity_detail_id === 'establishment_training_rotational_waste_management_committee' ||

									// sanitation - committee
									b.activity_detail_id === 'establishment_training_rotational_sanitation_committee' ||

									// hygiene - hygiene_promotion
									b.activity_detail_id === 'leaflet_flyer_distribution' ||
									b.activity_detail_id === 'focus_group_sessions' ||
									b.activity_detail_id === 'mass_campaigns' ||
									b.activity_detail_id === 'speaker_campaigns' ||
									b.activity_detail_id === 'other_campaigns' ||
									b.activity_detail_id === 'hygiene_promotion_volunteers_recruitment_training' ||
									b.activity_detail_id === 'hygiene_promotion_volunteers_kit_distribution' ||
									b.activity_detail_id === 'hygiene_promotion_monitoring_visits' // ||

									// much easier - by description
									// b.activity_description_id === 'community_participation' || 
									// b.activity_description_id === 'transparency' 
								) {
							ngmClusterHelperNgWash.setActivityBeneficiariesBySite( l, b );
						} else {
							ngmClusterHelperNgWash.sumActivityBeneficiaries( b );
						}
					});
				});
			},

			// sum beneficiaries
			setActivityBeneficiariesBySite: function( l, b ) {

				// set beneficiaries
				b.households = l.households;
				b.boys = l.boys;
				b.girls = l.girls;
				b.men = l.men;
				b.women = l.women;
				b.elderly_men = l.elderly_men;
				b.elderly_women = l.elderly_women;
				b.total_beneficiaries = l.site_population;

				// each association
				angular.forEach( b, function( d, k ){
					if ( Array.isArray( d ) ) {
						// associations
						if ( k === 'water' || 
									k === 'boreholes' ||
									k === 'sanitation' ||
									k === 'hygiene' ||
									k === 'accountability') {
							angular.forEach( d, function( activity, l ){
								activity.households = l.households;
								activity.boys = l.boys;
								activity.girls = l.girls;
								activity.men = l.men;
								activity.women = l.women;
								activity.elderly_men = l.elderly_men;
								activity.elderly_women = l.elderly_women;
								activity.total_beneficiaries = l.site_population;
							});
						}
					}
				});
			},

			// sum beneficiaries
			sumActivityBeneficiaries: function( b ) {

				// set beneficiaries
				b.cash_amount = 0;
				b.households = 0;
				b.boys = 0;
				b.girls = 0;
				b.men = 0;
				b.women = 0;
				b.elderly_men = 0;
				b.elderly_women = 0;
				b.total_beneficiaries = 0;
				
				// each association
				angular.forEach( b, function( d, k ){
					if ( Array.isArray( d ) ) {
						// associations
						if ( k === 'water' || 
									k === 'boreholes' ||
									k === 'sanitation' ||
									k === 'hygiene' ||
									k === 'cash' ||
									k === 'accountability') {
							angular.forEach( d, function( activity, l ){
								b.cash_amount += activity.cash_amount ? activity.cash_amount : 0;
								b.households += activity.households ? activity.households : 0;
								b.boys += activity.boys;
								b.girls += activity.girls;
								b.men += activity.men;
								b.women += activity.women;
								b.elderly_men += activity.elderly_men;
								b.elderly_women += activity.elderly_women;
								b.total_beneficiaries += activity.total_beneficiaries;
							});
						}
					}
				});
			}

		}

		// return 
		return ngmClusterHelperNgWash;

	}]);
