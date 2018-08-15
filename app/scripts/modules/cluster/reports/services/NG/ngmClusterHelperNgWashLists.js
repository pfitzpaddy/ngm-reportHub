/**
 * @name ngmReportHub.factory:ngmClusterHelperNgWashLists
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperNgWashLists', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		// definition
		var ngmClusterHelperNgWashLists = {

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
				water_turbidity_ranges: [{
					water_turbidity_range_id: 'ntu_0',
					water_turbidity_range_name: '0 NTU'
				},{
					water_turbidity_range_id: 'ntu_lt_5',
					water_turbidity_range_name: '<5 NTU'
				},{
					water_turbidity_range_id: 'ntu_5_to_20',
					water_turbidity_range_name: '5 to 20 NTU'
				},{
					water_turbidity_range_id: 'ntu_gt_20',
					water_turbidity_range_name: 'Above 20 NTU'
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
				free_residual_chlorine_ranges: [{
					free_residual_chlorine_range_id: '0_mg_ltr',
					free_residual_chlorine_range_name: '0 mg/ltr'
				},{
					free_residual_chlorine_range_id: '0.1_0.2_mg_ltr',
					free_residual_chlorine_range_name: '0.1 to 0.2 mg/ltr'
				},{
					free_residual_chlorine_range_id: '0.21_0.4_mg_ltr',
					free_residual_chlorine_range_name: '0.21 to 0.4 mg/ltr'
				},{
					free_residual_chlorine_range_id: '0.41_0.5_mg_ltr',
					free_residual_chlorine_range_name: '0.41 to 0.5 mg/ltr'
				},{
					free_residual_chlorine_range_id: 'gt_0.5_mg_ltr',
					free_residual_chlorine_range_name: '>0.5 mg/ltr'
				}],
				from_chlorinated_systems: [{
					from_chlorinated_system_id: 'yes',
					from_chlorinated_system_name: 'Yes'
				},{
					from_chlorinated_system_id: 'no',
					from_chlorinated_system_name: 'No'
				}]
			}

		}

		// return 
		return ngmClusterHelperNgWashLists;

	}]);
