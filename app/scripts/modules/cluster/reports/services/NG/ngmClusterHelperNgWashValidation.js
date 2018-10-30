/**
 * @name ngmReportHub.factory:ngmClusterHelperNgWashValidation
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperNgWashValidation', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmClusterHelperNgWashKeys',
				'ngmAuth', function( $http, $filter, $timeout, ngmClusterHelperNgWashKeys, ngmAuth ) {

		// definition
		var ngmClusterHelperNgWashValidation = {

			// bb
			bbox: { 'NG':{ xMin:2.66853, yMin:4.27301, xMax:14.6788, yMax:13.8944 } },

			// very crude check that the borehole is in bbox of NG
			// for now this will have to do, bbox of admin3 level would be better but for now out of scope
			boreholeBboxCheck: function( b, label ){

				// its only NG for now
				var id;
				var bb = ngmClusterHelperNgWashValidation.bbox[ 'NG' ];

				// bbox test
				if ( bb.xMin <= b.borehole_lng && b.borehole_lng <= bb.xMax && bb.yMin <= b.borehole_lat && b.borehole_lat <= bb.yMax ) {
					id = $("label[for='" + label + "']");
					id.css({ 'color': '#26a69a', 'font-weight': 300 });
				} else {
					id = $("label[for='" + label + "']");
					id.css({ 'color': '#EE6E73', 'font-weight': 400 });
 					Materialize.toast( 'Borehole location outside Nigeria!' , 6000, 'error' );
				}

			},

			// validate borehole form
			validateBorehole: function( d, i, j, k ){
					
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// boreholes
				if ( !d.borehole_water_facility_type_id && !d.borehole_water_facility_type_name ){ 
					id = "label[for='" + 'ngm-borehole_water_facility_type-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( !d.borehole_water_facility_size_id && !d.borehole_water_facility_size_name ){ 
					id = "label[for='" + 'ngm-borehole_water_facility_size-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( !d.borehole_chlorination_plan_id && !d.borehole_chlorination_plan_name ){ 
					id = "label[for='" + 'ngm-borehole_chlorination_plan-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( !d.free_residual_chlorine_range_id && !d.free_residual_chlorine_range_name ){ 
					id = "label[for='" + 'ngm-free_residual_chlorine_range-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( !d.water_turbidity_range_id && !d.water_turbidity_range_name ){ 
					id = "label[for='" + 'ngm-water_turbidity_range-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.borehole_tanks_storage_ltrs === undefined || d.borehole_tanks_storage_ltrs < 0 ){ 
					id = "label[for='" + 'ngm-borehole_tanks_storage_ltrs-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.taps_number_connected === undefined || d.taps_number_connected < 0 ){ 
					id = "label[for='" + 'ngm-taps_number_connected-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.borehole_taps_ave_flow_rate_ltrs_minute === undefined || d.borehole_taps_ave_flow_rate_ltrs_minute < 0 ){ 
					id = "label[for='" + 'ngm-borehole_taps_ave_flow_rate_ltrs_minute-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.borehole_yield_ltrs_second === undefined || d.borehole_yield_ltrs_second < 0 ){ 
					id = "label[for='" + 'ngm-borehole_yield_ltrs_second-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.borehole_pumping_ave_daily_hours === undefined || d.borehole_pumping_ave_daily_hours < 0 ){ 
					id = "label[for='" + 'ngm-borehole_pumping_ave_daily_hours-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate reticulation form
			validateReticulation: function( d, i, j, k ){
					
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// reticulation
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( !d.from_chlorinated_system_id && !d.from_chlorinated_system_name ){ 
					id = "label[for='" + 'ngm-from_chlorinated_system-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( !d.water_turbidity_range_id && !d.water_turbidity_range_name ){ 
					id = "label[for='" + 'ngm-water_turbidity_range-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate service form
			validateService: function( beneficiary, d, i, j, k ){
					
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// tablets service has no dropdowns
				if ( beneficiary.activity_detail_id !== 'distribution_treatment_tablets' ) {
					if ( !d.free_residual_chlorine_range_id && !d.free_residual_chlorine_range_name ){ 
						id = "label[for='" + 'ngm-free_residual_chlorine_range-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( !d.water_turbidity_range_id && !d.water_turbidity_range_name ){ 
						id = "label[for='" + 'ngm-water_turbidity_range-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate maintenance form
			validateMaintenance: function( beneficiary, d, i, j, k ){
					
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// washcoms_establishment_training has male / female
				if ( beneficiary.activity_detail_id === 'washcoms_establishment_training' ) {
					if ( d.male === null ||  d.male === undefined || d.male < 0 ){ 
						id = "label[for='" + 'ngm-male-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female === null ||  d.female === undefined || d.female < 0 ){ 
						id = "label[for='" + 'ngm-female-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( beneficiary.activity_detail_id === 'maintenance_repair_replacement_water_systems' ) {
						if ( !d.detail_category_id && !d.detail_category_name ){ 
							id = "label[for='" + 'ngm-detail_category-'+i+'-'+j+'-'+k+'-'+l+"']";
							$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
							validation.divs.push( id );
							complete = false;
						}
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate  form
			validateLatrines: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// male, female + disabled
				if ( beneficiary.activity_detail_id === 'latrine_construction_vip' || 
							beneficiary.activity_detail_id === 'latrine_construction_emergency' ||
							beneficiary.activity_detail_id === 'latrine_rehabilitation_vip' ||
							beneficiary.activity_detail_id === 'latrine_rehabilitation_emergency' ||
							beneficiary.activity_detail_id === 'latrine_cleaning_disinfection_vip' ||
							beneficiary.activity_detail_id === 'latrine_cleaning_disinfection_emergency' ||
							beneficiary.activity_detail_id === 'latrine_gender_marking_vip' ||
							beneficiary.activity_detail_id === 'latrine_gender_marking_emergency' ||
							beneficiary.activity_detail_id === 'latrine_lock_installation_vip' ||
							beneficiary.activity_detail_id === 'latrine_lock_installation_emergency' ){
					if ( d.male === null ||  d.male === undefined || d.male < 0 ){
						id = "label[for='" + 'ngm-male-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female === null ||  d.female === undefined || d.female < 0 ){
						id = "label[for='" + 'ngm-female-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.male_disabled === null || d.male_disabled === undefined || d.male_disabled < 0 ){ 
						id = "label[for='" + 'ngm-male_disabled-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female_disabled === null || d.female_disabled === undefined || d.female_disabled < 0 ){ 
						id = "label[for='" + 'ngm-female_disabled-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// contstruction / rehabilitation gender marking
				if ( beneficiary.activity_detail_id === 'latrine_construction_vip' || 
							beneficiary.activity_detail_id === 'latrine_construction_emergency' ||
							beneficiary.activity_detail_id === 'latrine_rehabilitation_vip' ||
							beneficiary.activity_detail_id === 'latrine_rehabilitation_emergency' ){
					if ( !d.gender_marking_id && !d.gender_marking_name ){ 					
						id = "label[for='" + 'ngm-gender_marking-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( !d.lock_installation_id && !d.lock_installation_name ){ 					
						id = "label[for='" + 'ngm-lock_installation-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// gender marking
				if ( beneficiary.activity_detail_id === 'latrine_gender_marking_vip' || 
							beneficiary.activity_detail_id === 'latrine_gender_marking_emergency' ||
							beneficiary.activity_detail_id === 'latrine_lock_installation_vip' ||
							beneficiary.activity_detail_id === 'latrine_lock_installation_emergency' ){
					if ( !d.facility_status_id && !d.facility_status_name ){ 					
						id = "label[for='" + 'ngm-facility_status-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// desludging stipend 
				if ( beneficiary.activity_detail_id === 'latrine_desludging_manual' ){
					if ( !d.stipend_id && !d.stipend_name ){ 					
						id = "label[for='" + 'ngm-stipend-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.stipend_amount === undefined || d.stipend_amount < 0 ){ 
						id = "label[for='" + 'ngm-stipend_amount-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}			

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( beneficiary.activity_detail_id === 'latrine_monitoring' ) {
						if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
							id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k+'-'+l+"']";
							$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
							validation.divs.push( id );
							complete = false;
						}
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateShowers: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// male, female + disabled
				if ( beneficiary.activity_detail_id !== 'shower_cleaning_disinfection_monitoring' ){
					if ( d.male === null || d.male === undefined || d.male < 0 ){ 
						id = "label[for='" + 'ngm-male-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female === null || d.female === undefined || d.female < 0 ){ 
						id = "label[for='" + 'ngm-female-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.male_disabled === null || d.male_disabled === undefined || d.male_disabled < 0 ){ 
						id = "label[for='" + 'ngm-male_disabled-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female_disabled === null || d.female_disabled === undefined || d.female_disabled < 0 ){ 
						id = "label[for='" + 'ngm-female_disabled-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// construction / rehabilitation gender marking
				if ( beneficiary.activity_detail_id === 'shower_construction_emergency' || 
							beneficiary.activity_detail_id === 'shower_construction_mid_term' ||
							beneficiary.activity_detail_id === 'shower_rehabilitation_emergency' ||
							beneficiary.activity_detail_id === 'shower_rehabilitation_mid_term' ){
					if ( !d.gender_marking_id && !d.gender_marking_name ){ 					
						id = "label[for='" + 'ngm-gender_marking-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( !d.lock_installation_id && !d.lock_installation_name ){ 					
						id = "label[for='" + 'ngm-lock_installation-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// gender marking
				if ( beneficiary.activity_detail_id === 'shower_gender_marking_emergency' || 
							beneficiary.activity_detail_id === 'shower_gender_marking_mid_term' ||
							beneficiary.activity_detail_id === 'shower_lock_installation_emergency' ||
							beneficiary.activity_detail_id === 'shower_lock_installation_mid_term' ){
					if ( !d.facility_status_id && !d.facility_status_name ){ 					
						id = "label[for='" + 'ngm-facility_status-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){ 
						id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateWaste: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( beneficiary.activity_detail_id !== 'establishment_training_rotational_waste_management_committee' ) {
					if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
						id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// committee
				if ( beneficiary.activity_detail_id === 'establishment_training_rotational_waste_management_committee' ) {
					validation = ngmClusterHelperNgWashValidation.validateCommittee( beneficiary, d, i, j, k );
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.quantity === undefined || d.quantity < 0 ){ 
						id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateCommittee: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// sanitation_committee_kits_distribution
				if ( beneficiary.activity_detail_id === 'sanitation_committee_kits_distribution' ) {
					validation = ngmClusterHelperNgWashValidation.validateWaste( beneficiary, d, i, j, k );
				}

				// male / female
				if ( d.male === undefined || d.male < 0 ){ 
					id = "label[for='" + 'ngm-male-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.female === undefined || d.female < 0 ){ 
					id = "label[for='" + 'ngm-female-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// rotation
				if ( !d.committee_rotation_id && !d.committee_rotation_name ){ 					
					id = "label[for='" + 'ngm-committee_rotation-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.committee_rotation_per_month === undefined || d.committee_rotation_per_month < 0 ){ 
					id = "label[for='" + 'ngm-committee_rotation_per_month-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// stipend
				if ( !d.stipend_id && !d.stipend_name ){ 					
					id = "label[for='" + 'ngm-stipend-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.stipend_amount === null || d.stipend_amount === undefined || d.stipend_amount < 0 ){ 
					id = "label[for='" + 'ngm-stipend_amount-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateHygiene: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// male / female
				if ( beneficiary.activity_detail_id === 'hygiene_promotion_volunteers_recruitment_training' ){
					if ( d.male === null || d.male === undefined || d.male < 0 ){ 
						id = "label[for='" + 'ngm-male-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female === null || d.female === undefined || d.female < 0 ){ 
						id = "label[for='" + 'ngm-female-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( beneficiary.activity_detail_id !== 'post_distribution_monitoring' &&
								beneficiary.activity_detail_id !== 'hygiene_promotion_monitoring_visits' &&
								beneficiary.activity_detail_id !== 'other_campaigns' &&
								beneficiary.activity_detail_id !== 'hygiene_promotion_volunteers_recruitment_training' ) {
						if ( d.quantity === undefined || d.quantity < 0 ){ 
							id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k+'-'+l+"']";
							$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
							validation.divs.push( id );
							complete = false;
						}
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateCash: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// naira
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){ 
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// households
				if ( d.households === null || d.households === undefined || d.households < 0 ){ 
					id = "label[for='" + 'ngm-households-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateComplaints: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// means to lodge
				if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// recieved
				if ( d.complaints_recieved === undefined || d.complaints_recieved < 0 ){ 
					id = "label[for='" + 'ngm-complaints_recieved-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// addressed
				if ( d.complaints_addressed === undefined || d.complaints_addressed < 0 ){ 
					id = "label[for='" + 'ngm-complaints_addressed-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// closed
				if ( d.complaints_closed === undefined || d.complaints_closed < 0 ){ 
					id = "label[for='" + 'ngm-complaints_closed-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validateParticipation: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// participation
				if ( d.boys === null || d.boys === undefined || d.boys < 0 ){ 
					id = "label[for='" + 'ngm-boys-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.girls === null || d.girls === undefined || d.girls < 0 ){ 
					id = "label[for='" + 'ngm-girls-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.men === null || d.men === undefined || d.men < 0 ){ 
					id = "label[for='" + 'ngm-men-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.women === null || d.women === undefined || d.women < 0 ){ 
					id = "label[for='" + 'ngm-women-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.elderly_men === null || d.elderly_men === undefined || d.elderly_men < 0 ){ 
					id = "label[for='" + 'ngm-elderly_men-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}
				if ( d.elderly_women === null || d.elderly_women === undefined || d.elderly_women < 0 ){ 
					id = "label[for='" + 'ngm-elderly_women-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// for each details
				angular.forEach( d.details, function( d, l ){
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-detail_type-'+i+'-'+j+'-'+k+'-'+l+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// VALIDATION

			// validate wash activities
			validateActivities: function( locations ) {

				// collect error divs
				var elements = [];

				// WATER
				var waterLength = 0;
				var waterRowComplete = 0;

				// SANITATION
				var sanitationLength = 0;
				var sanitationRowComplete = 0;

				// HYGIENE
				var hygieneLength = 0;
				var hygieneRowComplete = 0;

				// CASH
				var cashLength = 0;
				var cashRowComplete = 0;

				// ACCOUNTABILITY
				var accountabilityLength = 0;
				var accountabilityRowComplete = 0;

				// keys to validate correct form
				var keys = ngmClusterHelperNgWashKeys.keys;

				// each location
				angular.forEach( locations, function( l, i ){
					angular.forEach( l.beneficiaries, function( d, j ){

						// water
						if ( d.water && d.water.length ) {
							angular.forEach( d.water, function( water, k ){
								if ( keys[ d.activity_detail_id ].template === 'reticulation.html' ) {
									waterLength ++;
									var result = ngmClusterHelperNgWashValidation.validateReticulation( water, i, j, k );
									angular.merge( elements, result.divs );
									waterRowComplete +=  result.count;
								}
								if ( keys[ d.activity_detail_id ].template === 'service.html' ) {
									waterLength ++;
									var result = ngmClusterHelperNgWashValidation.validateService( d, water, i, j, k );
									angular.merge( elements, result.divs );
									waterRowComplete +=  result.count;
								}
								if ( keys[ d.activity_detail_id ].template === 'maintenance.html' ) {
									waterLength ++;
									var result = ngmClusterHelperNgWashValidation.validateMaintenance( d, water, i, j, k );
									angular.merge( elements, result.divs );
									waterRowComplete +=  result.count;
								}
							});
						}

						// boreholes 
						if ( d.boreholes && d.boreholes.length ) {
							waterLength += d.boreholes.length;
							angular.forEach( d.boreholes, function( borehole, k ){
								var result = ngmClusterHelperNgWashValidation.validateBorehole( borehole, i, j, k );
								angular.merge( elements, result.divs );
								waterRowComplete += result.count;
							});
						}

						// sanitation
						if ( d.sanitation && d.sanitation.length ) {
							angular.forEach( d.sanitation, function( sanitation, k ){
								if ( keys[ d.activity_detail_id ].template === 'latrines.html' ) {
									sanitationLength ++;
									var result = ngmClusterHelperNgWashValidation.validateLatrines( d, sanitation, i, j, k );
									angular.merge( elements, result.divs );
									sanitationRowComplete +=  result.count;
								}
								if ( keys[ d.activity_detail_id ].template === 'showers.html' ) {
									sanitationLength ++;
									var result = ngmClusterHelperNgWashValidation.validateShowers( d, sanitation, i, j, k );
									angular.merge( elements, result.divs );
									sanitationRowComplete +=  result.count;
								}
								if ( keys[ d.activity_detail_id ].template === 'waste.html' ) {
									sanitationLength ++;
									var result = ngmClusterHelperNgWashValidation.validateWaste( d, sanitation, i, j, k );
									angular.merge( elements, result.divs );
									sanitationRowComplete +=  result.count;
								}
								if ( keys[ d.activity_detail_id ].template === 'committee.html' ) {
									sanitationLength ++;
									var result = ngmClusterHelperNgWashValidation.validateCommittee( d, sanitation, i, j, k );
									angular.merge( elements, result.divs );
									sanitationRowComplete +=  result.count;
								}
							});
						}

						// hygiene
						if ( d.hygiene && d.hygiene.length ) {
							angular.forEach( d.hygiene, function( hygiene, k ){
								if ( keys[ d.activity_detail_id ].template === 'promotion.html' ||
											keys[ d.activity_detail_id ].template === 'kits.html' ) {
									hygieneLength ++;
									var result = ngmClusterHelperNgWashValidation.validateHygiene( d, hygiene, i, j, k );
									angular.merge( elements, result.divs );
									hygieneRowComplete +=  result.count;
								}
							});
						}

						// cash
						if ( d.cash && d.cash.length ) {
							angular.forEach( d.cash, function( cash, k ){
								if ( keys[ d.activity_detail_id ].template === 'cash.html' ) {
									hygieneLength ++;
									var result = ngmClusterHelperNgWashValidation.validateCash( d, cash, i, j, k );
									angular.merge( elements, result.divs );
									hygieneRowComplete +=  result.count;
								}
							});
						}

						// accountability
						if ( d.accountability && d.accountability.length ) {
							angular.forEach( d.accountability, function( accountability, k ){
								if ( keys[ d.activity_detail_id ].template === 'complaints.html' ) {
									accountabilityLength ++;
									var result = ngmClusterHelperNgWashValidation.validateComplaints( d, accountability, i, j, k );
									angular.merge( elements, result.divs );
									accountabilityRowComplete +=  result.count;
								}
								if ( keys[ d.activity_detail_id ].template === 'participation.html' ) {
									accountabilityLength ++;
									var result = ngmClusterHelperNgWashValidation.validateParticipation( d, accountability, i, j, k );
									angular.merge( elements, result.divs );
									accountabilityRowComplete +=  result.count;
								}
							});
						}

					});
				});

				// valid
				if ( waterLength !== waterRowComplete ||
							sanitationLength !== sanitationRowComplete ||
							hygieneLength !== hygieneRowComplete ||
							cashLength !== cashRowComplete  ||
							accountabilityLength !== accountabilityRowComplete ) {
					Materialize.toast( 'Form contains errors!' , 6000, 'error' );
					$( elements[0] ).animatescroll();
					return false;
				} else {
					return true;
				}
				
			}

		}

		// return 
		return ngmClusterHelperNgWashValidation;

	}]);
