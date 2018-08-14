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
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		// definition
		var ngmClusterHelperNgWash = {
					
			// NG and WASH
			boreholesUrl: 'beneficiaries/NG/wash/boreholes.html',

			// lists
			lists: {
				borehole_water_facility_types: [{
					borehole_water_facility_type_id:'solar',
					borehole_water_facility_type_name:'Solar'
				},{
					borehole_water_facility_type_id:'motorized',
					borehole_water_facility_type_name:'Motorized'
				},{
					borehole_water_facility_type_id:'hybrid',
					borehole_water_facility_type_name:'Hybrid ( Solar-Generator )'
				},{
					borehole_water_facility_type_id:'hand_pump',
					borehole_water_facility_type_name:'Hand Pump'
				}],
				borehole_water_facility_sizes: [{
					borehole_water_facility_size_id:'big',
					borehole_water_facility_size_name:'Big'
				},{
					borehole_water_facility_size_id:'medium',
					borehole_water_facility_size_name:'Medium'
				},{
					borehole_water_facility_size_id:'small',
					borehole_water_facility_size_name:'Small'
				}],
				borehole_water_turbidity_ranges: [{
					borehole_water_turbidity_range_id: 'ntu_0',
					borehole_water_turbidity_range_name: '0 NTU'
				},{
					borehole_water_turbidity_range_id: 'ntu_lt_5',
					borehole_water_turbidity_range_name: '<5 NTU'
				},{
					borehole_water_turbidity_range_id: 'ntu_5_to_20',
					borehole_water_turbidity_range_name: '5 to 20 NTU'
				},{
					borehole_water_turbidity_range_id: 'ntu_gt_20',
					borehole_water_turbidity_range_name: 'Above 20 NTU'
				}],
				borehole_chlorination_plans: [{
					borehole_chlorination_plan_id: 'none',
					borehole_chlorination_plan_name: 'None'
				},{
					borehole_chlorination_plan_id: 'online_chlorination',
					borehole_chlorination_plan_name: 'Online Chlorination'
				},{
					borehole_chlorination_plan_id: 'tank_chlorination',
					borehole_chlorination_plan_name: 'Chlorination in Tank'
				},{
					borehole_chlorination_plan_id: 'bucket_chlorination',
					borehole_chlorination_plan_name: 'Bucket Chlorination'
				}],
				borehole_free_residual_cholrine_ranges: [{
					borehole_free_residual_cholrine_range_id: '0_mg_ltr',
					borehole_free_residual_cholrine_range_name: '0 mg/ltr',
				},{
					borehole_free_residual_cholrine_range_id: '0.1_0.2_mg_ltr',
					borehole_free_residual_cholrine_range_name: '0.1 to 0.2 mg/ltr',
				},{
					borehole_free_residual_cholrine_range_id: '0.21_0.4_mg_ltr',
					borehole_free_residual_cholrine_range_name: '0.21 to 0.4 mg/ltr',
				},{
					borehole_free_residual_cholrine_range_id: '0.41_0.5_mg_ltr',
					borehole_free_residual_cholrine_range_name: '0.41 to 0.5 mg/ltr',
				},{
					borehole_free_residual_cholrine_range_id: 'gt_0.5_mg_ltr',
					borehole_free_residual_cholrine_range_name: '>0.5 mg/ltr',
				}]
			},

			// add borehole
			addBorehole: function( location, beneficiary ){
					
				// default
				var borehole = {
					borehole_yield_ltrs_second: 0,
					borehole_pumping_ave_daily_hours: 0,
					borehole_tanks_storage_ltrs: 0,
					borehole_taps_number_connected: 0,
					borehole_taps_ave_flow_rate_ltrs_minute: 0,
					borehole_lng: location.site_lng,
					borehole_lat: location.site_lat,
				}

				// existing
				var length = beneficiary.boreholes && beneficiary.boreholes.length;

				// set boreholes
				if ( !length ){
					beneficiary.boreholes = [];
				} else {
          var b = angular.copy( beneficiary.boreholes[ length - 1 ] );
          delete b.id;
          borehole = angular.merge( {}, borehole, b );
        }

        // push
				beneficiary.boreholes.push( borehole );

				// init select
				setTimeout(function(){ $( '.input-field select' ).material_select(); }, 200 );

			},

			// reset form
			init_material_select:function(){
				setTimeout(function(){ 
					$( '.input-field input' ).removeClass( 'invalid' );
					$( '.input-field input' ).removeClass( 'ng-touched' );
					$( '.input-field select' ).material_select(); 
				}, 10 );
			},

      // remove beneficiary nodal
      removeBoreholeModal: function( project, beneficiary, $boreholeIndex ) {
      	ngmClusterHelperNgWash.project = project;
      	ngmClusterHelperNgWash.beneficiary = beneficiary;
        ngmClusterHelperNgWash.$boreholeIndex = $boreholeIndex;
        $( '#borehole-modal' ).openModal({ dismissible: false });
      },

			// remove borehole
			removeBorehole: function(){
				ngmClusterHelperNgWash.beneficiary.boreholes.splice( ngmClusterHelperNgWash.$boreholeIndex, 1 );
				ngmClusterHelperNgWash.project.save( false, false );
			}

			
			// 											lng1 						lat1, 					lng2 						lat2
			// 'NG': ( 'Nigeria', ( 2.69170169436, 4.24059418377, 14.5771777686, 13.8659239771 ) ),


			



		}

		// return 
		return ngmClusterHelperNgWash;

	}]);
