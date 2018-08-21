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
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

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
				if ( d.quantity === undefined || d.quantity < 0 ){ 
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
				if ( d.quantity === undefined || d.quantity < 0 ){ 
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
				if ( d.quantity === undefined || d.quantity < 0 ){ 
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// washcoms_establishment_training has male / female
				if ( beneficiary.activity_detail_id === 'washcoms_establishment_training' ) {
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
				if ( d.quantity === undefined || d.quantity < 0 ){ 
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
					if ( d.male_disabled === undefined || d.male_disabled < 0 ){ 
						id = "label[for='" + 'ngm-male_disabled-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female_disabled === undefined || d.female_disabled < 0 ){ 
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
			validateShowers: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === undefined || d.quantity < 0 ){ 
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					validation.divs.push( id );
					complete = false;
				}

				// male, female + disabled
				if ( beneficiary.activity_detail_id !== 'shower_cleaning_disinfection_monitoring' ){
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
					if ( d.male_disabled === undefined || d.male_disabled < 0 ){ 
						id = "label[for='" + 'ngm-male_disabled-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
					if ( d.female_disabled === undefined || d.female_disabled < 0 ){ 
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
			validateWaste: function( beneficiary, d, i, j, k ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// service
				if ( d.quantity === undefined || d.quantity < 0 ){ 
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
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
				if ( d.stipend_amount === undefined || d.stipend_amount < 0 ){ 
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

			}

		}

		// return 
		return ngmClusterHelperNgWashValidation;

	}]);
