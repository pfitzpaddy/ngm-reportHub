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
			validateBorehole: function( b, i, j, k ){
					
				// valid
				var id;
				var divs = [];
				var complete = true;

				// boreholes
				if ( !b.borehole_water_facility_type_id && !b.borehole_water_facility_type_name ){ 
					id = "label[for='" + 'ngm-borehole_water_facility_type-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( !b.borehole_water_facility_size_id && !b.borehole_water_facility_size_name ){ 
					id = "label[for='" + 'ngm-borehole_water_facility_size-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( !b.borehole_chlorination_plan_id && !b.borehole_chlorination_plan_name ){ 
					id = "label[for='" + 'ngm-borehole_chlorination_plan-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( !b.free_residual_chlorine_range_id && !b.free_residual_chlorine_range_name ){ 
					id = "label[for='" + 'ngm-free_residual_chlorine_range-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( !b.water_turbidity_range_id && !b.water_turbidity_range_name ){ 
					id = "label[for='" + 'ngm-water_turbidity_range-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( b.borehole_tanks_storage_ltrs === undefined || b.borehole_tanks_storage_ltrs < 0 ){ 
					id = "label[for='" + 'ngm-borehole_tanks_storage_ltrs-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( b.taps_number_connected === undefined || b.taps_number_connected < 0 ){ 
					id = "label[for='" + 'ngm-taps_number_connected-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( b.borehole_taps_ave_flow_rate_ltrs_minute === undefined || b.borehole_taps_ave_flow_rate_ltrs_minute < 0 ){ 
					id = "label[for='" + 'ngm-borehole_taps_ave_flow_rate_ltrs_minute-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( b.borehole_yield_ltrs_second === undefined || b.borehole_yield_ltrs_second < 0 ){ 
					id = "label[for='" + 'ngm-borehole_yield_ltrs_second-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( b.borehole_pumping_ave_daily_hours === undefined || b.borehole_pumping_ave_daily_hours < 0 ){ 
					id = "label[for='" + 'ngm-borehole_pumping_ave_daily_hours-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}

				// return 1 for complete, 0 for error
				if ( complete ) {
					return { count: 1, divs: divs };
				} else {
					return { count: 0, divs: divs };
				}

			},

			// validate reticulation form
			validateReticulation: function( r, i, j, k ){
					
				// valid
				var id;
				var divs = [];
				var complete = true;

				// reticulation
				if ( r.quantity === undefined || r.quantity < 0 ){ 
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( !r.from_chlorinated_system_id && !r.from_chlorinated_system_name ){ 
					id = "label[for='" + 'ngm-from_chlorinated_system-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				if ( !r.water_turbidity_range_id && !r.water_turbidity_range_name ){ 
					id = "label[for='" + 'ngm-water_turbidity_range-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}

				// return 1 for complete, 0 for error
				if ( complete ) {
					return { count: 1, divs: divs };
				} else {
					return { count: 0, divs: divs };
				}

			},

			// validate service form
			validateService: function( beneficiary, s, i, j, k ){
					
				// valid
				var id;
				var divs = []
				var complete = true;

				// service
				if ( s.quantity === undefined || s.quantity < 0 ){ 
					id = "label[for='" + 'ngm-quantity-'+i+'-'+j+'-'+k + "']";
					$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
					divs.push( id );
					complete = false;
				}
				// tablets service has no dropdowns
				if ( beneficiary.activity_detail_id !== 'distribution_treatment_tablets' ) {
					if ( !s.free_residual_chlorine_range && !s.free_residual_chlorine_range ){ 
						id = "label[for='" + 'ngm-free_residual_chlorine_range-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						divs.push( id );
						complete = false;
					}
					if ( !s.water_turbidity_range_id && !s.water_turbidity_range_name ){ 
						id = "label[for='" + 'ngm-water_turbidity_range-'+i+'-'+j+'-'+k + "']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						divs.push( id );
						complete = false;
					}
				}

				// return 1 for complete, 0 for error
				if ( complete ) {
					return { count: 1, divs: divs };
				} else {
					return { count: 0, divs: divs };
				}

			},

		}

		// return 
		return ngmClusterHelperNgWashValidation;

	}]);
