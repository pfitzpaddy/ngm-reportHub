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

			// 
			details: [],

			// lists
			lists: {
				stipends: [{
					stipend_id: 'no',
					stipend_name: 'No',
				},{
					stipend_id: 'yes',
					stipend_name: 'Yes',
				}],
				committee_rotations:[{
					committee_rotation_id: 'no',
					committee_rotation_name: 'No'
				},{
					committee_rotation_id: 'yes',
					committee_rotation_name: 'Yes'
				}],
				gender_markings: [{
					gender_marking_id: 'no',
					gender_marking_name: 'No',
				},{
					gender_marking_id: 'yes',
					gender_marking_name: 'Yes',
				}],
				lock_installations: [{
					lock_installation_id: 'no',
					lock_installation_name: 'No',
				},{
					lock_installation_id: 'yes',
					lock_installation_name: 'Yes',
				}],
				contractor_ratings: [
					{ rating_id: 1, rating_name: 1 },
					{ rating_id: 2, rating_name: 2 },
					{ rating_id: 3, rating_name: 3 },
					{ rating_id: 4, rating_name: 4 },
					{ rating_id: 5, rating_name: 5 }
				],
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
				}],
				washcom_details:[{
					detail_type_id: 'heavy_duty_vice',
					detail_type_name: 'Heavy Duty Vice'
				},{
					detail_type_id:'rod_vice',
					detail_type_name:'Rod Vice'
				},{
					detail_type_id:'ppipe',
					detail_type_name:'Heavy Duty Pipe Spanner'
				},{
					detail_type_id:'spanner_ring',
					detail_type_name:'Spanner (19- 17) Ring'
				},{
					detail_type_id:'spanner_plate',
					detail_type_name:'5. Spanner (19- 17) Plate'
				},{
					detail_type_id:'screw_driver',
					detail_type_name:'Screw Driver'
				},{
					detail_type_id:'plunger',
					detail_type_name:'Plunger'
				},{
					detail_type_id:'dice',
					detail_type_name:'Dice'
				},{
					detail_type_id:'grease',
					detail_type_name:'Grease'
				},{
					detail_type_id:'pile',
					detail_type_name:'Pile'
				},{
					detail_type_id:'hacksaw',
					detail_type_name:'Hacksaw'
				}],
				ops_maintenance_details:[{
					// handpump
					detail_category_id: 'handpump',
					detail_category_name: 'Handpump', 
					detail_type_id: 'plunger_pump',
					detail_type_name: 'Plunger Pump' 
				},{
					detail_category_id: 'handpump',
					detail_category_name: 'Handpump', 
					detail_type_id: 'handle',
					detail_type_name: 'Handle' 
				},{
					detail_category_id: 'handpump',
					detail_category_name: 'Handpump', 
					detail_type_id: 'axe',
					detail_type_name: 'Axe' 
				},{
					detail_category_id: 'handpump',
					detail_category_name: 'Handpump', 
					detail_type_id: 'riser_pipe',
					detail_type_name: 'Riser Pipe' 
				},{
					detail_category_id: 'handpump',
					detail_category_name: 'Handpump', 
					detail_type_id: 'standing_leg',
					detail_type_name: 'Standing Leg of the Handle' 
				},{
					detail_category_id: 'handpump',
					detail_category_name: 'Handpump', 
					detail_type_id: 'tank',
					detail_type_name: 'Tank' 
				},{
					// solar system
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'solar_pump_cable',
					detail_type_name:'Solar Pump Cable'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'rp_disconnector',
					detail_type_name:'RP Disconnector'					
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'lightening_arrestor',
					detail_type_name:'Lightening Arrestor'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'riser_pipe_solar',
					detail_type_name:'Riser Pipe Solar'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'float_switch',
					detail_type_name:'Float Switch'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'dry_running_protector',
					detail_type_name:'Dry Running Protector'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'electro_cable',
					detail_type_name:'Electro Cable'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'panel_stand_construction',
					detail_type_name:'Panel Stand Construction'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'solar_plate',
					detail_type_name:'Solar Plate'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'solar_pump',
					detail_type_name:'Solar Pump'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'solar_converter',
					detail_type_name:'Solar Converter'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'solar_battery',
					detail_type_name:'Solar Battery'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'control_terminal',
					detail_type_name:'Control Terminal'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'solar_module_connection',
					detail_type_name:'Solar Module Connection'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'pump_head',
					detail_type_name:'Pump Head'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'by_pass_foot_valve',
					detail_type_name:'By Pass Foot Valve'
				},{
					detail_category_id: 'solar_system',
					detail_category_name: 'Solar Systems',
					detail_type_id:'plastic_reducer_blasting',
					detail_type_name:'Plastic Reducer Blasting'	
				},{
					// generator systems
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id: 'case_engine',
					detail_type_name: 'Case Engine'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'sleave',
					detail_type_name:'Sleave'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'top_cylinder',
					detail_type_name:'Top Cylinder'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'valve_cover',
					detail_type_name:'Valve Cover'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'crankcase_breather',
					detail_type_name:'Crankcase Breather'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fuel_filter',
					detail_type_name:'Fuel Filter'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fuel_injection_pump',
					detail_type_name:'Fuel_Injection_Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'engine_oil_filter',
					detail_type_name:'Engine_Oil_Filter'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'crankcase_pulley',
					detail_type_name:'Crankcase Pulley'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'water_pump',
					detail_type_name:'Water Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fan_pulley',
					detail_type_name:'Fan Pulley'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'water_temperature',
					detail_type_name:'Water Temperature'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'oil_filter_cap',
					detail_type_name:'Oil_Filter_Cap'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'exhaust_manifold',
					detail_type_name:'Exhaust Manifold'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'alternator',
					detail_type_name:'Alternator'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'turbo_charger',
					detail_type_name:'Turbo Charger'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'starter_motor',
					detail_type_name:'Starter Motor'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fly_wheel_oil_seals',
					detail_type_name:'Fly Wheel Oil Seals'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'turbo_charger_oil_supply',
					detail_type_name:'Turbo Charger Oil Supply'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'turbo_charger_oil_drain',
					detail_type_name:'Turbo Charger Oil Drain'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fuel_transfer_pump',
					detail_type_name:'Fuel Transfer Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'clip_stick',
					detail_type_name:'Clip Stick'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'oil_pan',
					detail_type_name:'Oil Pan'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'water_pump',
					detail_type_name:'Water Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'water_temperature_regulator',
					detail_type_name:'Water Temperature Regulator'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'valve_set',
					detail_type_name:'Valve Set'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'spreen_valve',
					detail_type_name:'Spreen Valve'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'valve_cover',
					detail_type_name:'Valve Cover'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'main_bearing',
					detail_type_name:'Main Bearing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'can_rod_bearing',
					detail_type_name:'Can Rod Bearing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'piston_bushing',
					detail_type_name:'Piston Bushing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'piston_rings',
					detail_type_name:'Piston Rings'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'returner',
					detail_type_name:'Returner'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'rotor',
					detail_type_name:'Rotor'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'nozzle',
					detail_type_name:'Nozzle'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'injector',
					detail_type_name:'Injector'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'injector_element',
					detail_type_name:'Injector Element'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'trost_washer',
					detail_type_name:'Trost Washer'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'crank_shaft',
					detail_type_name:'Crank Shaft'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'cam_shaft',
					detail_type_name:'Cam Shaft'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'crank_shaft_oil_seals',
					detail_type_name:'Crank Shaft Oil Seals'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'cop_can_shaft',
					detail_type_name:'Cop Can Shaft'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'push_rod',
					detail_type_name:'Push Rod'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'push_rod_cups',
					detail_type_name:'Push Rod Cups'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'roker_arm',
					detail_type_name:'Roker Arm'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'con_rod',
					detail_type_name:'Con Rod'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'con_rod_bushing',
					detail_type_name:'Con Rod Bushing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'housing',
					detail_type_name:'Housing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'housing_bearing',
					detail_type_name:'Housing Bearing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'housing_oil_seals',
					detail_type_name:'Housing Oil Seals'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'nut_fity_wheel',
					detail_type_name:'Nut Fity Wheel'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'spring_washes',
					detail_type_name:'Spring Washes'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'nozzle_housing',
					detail_type_name:'Nozzle Housing'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'turbo_charger_kits',
					detail_type_name:'Turbo Charger Kits'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'solenoid',
					detail_type_name:'Solenoid'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'kick_starter',
					detail_type_name:'Kick Starter'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'battery_cable',
					detail_type_name:'Battery Cable'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fan_belt',
					detail_type_name:'Fan Belt'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'pulley',
					detail_type_name:'Pulley'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'crank_shaft_pulley',
					detail_type_name:'Crank Shaft Pulley'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'roderator',
					detail_type_name:'Roderator'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'roderator_cover',
					detail_type_name:'Roderator Cover'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'roderator_setting',
					detail_type_name:'Roderator Setting'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'roderator_hose',
					detail_type_name:'Roderator Hose'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fuel_pipe',
					detail_type_name:'Fuel Pipe'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'electric_fuel_pump',
					detail_type_name:'Electric Fuel Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'fuel_pump',
					detail_type_name:'Fuel Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'engine_setting',
					detail_type_name:'Engine Setting'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'complete_gasket_set',
					detail_type_name:'Complete Gasket Set'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'water_pump_kits',
					detail_type_name:'Water Pump Kits'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'air_cleaner_element',
					detail_type_name:'Air Cleaner Element'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'bolt_and_nuts',
					detail_type_name:'Bolt And Nuts'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'brass_washer',
					detail_type_name:'Brass Washer'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'bushing_can_rods',
					detail_type_name:'Bushing Can Rods'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'breather_pipe',
					detail_type_name:'Breather Pipe'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'avr',
					detail_type_name:'AVR'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'battery_60ah',
					detail_type_name:'Battery 60Ah'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'battery_75ah',
					detail_type_name:'Battery 75Ah'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'battery_100ah',
					detail_type_name:'Battery 100Ah'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'battery_150ah',
					detail_type_name:'Battery 150Ah'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'top_gasket',
					detail_type_name:'Top Gasket'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'wtr_pump',
					detail_type_name:'Water Pump'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'bttry_cble',
					detail_type_name:'Battery Cable'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'key_swtch',
					detail_type_name:'Key Switch'
				},{
					detail_category_id: 'generator_systems',
					detail_category_name: 'Generator Systems',
					detail_type_id:'ovrhaul',
					detail_type_name:'Complete Overhauling'
				},{
					// electric pumps
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'electric_pump_motor',
					detail_type_name:'Electric Pump Motor'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'pump_head_mechanical',
					detail_type_name:'Pump Head Mechanical'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'pump_shaft',
					detail_type_name:'Shaft'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'pump_impellers',
					detail_type_name:'Impellers'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'pump_cable',
					detail_type_name:'Cable'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'cable_joint',
					detail_type_name:'Joint'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'electrical_starter',
					detail_type_name:'Starter'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'control_switch',
					detail_type_name:'Switch'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'circuit_breaker',
					detail_type_name:'Breaker'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'diode_male_female',
					detail_type_name:'Diode Male/Female'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'armature_coil',
					detail_type_name:'Coil'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'stator_vinding',
					detail_type_name:'Vinding'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'selenoid_switch',
					detail_type_name:'Switch'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'switch_module',
					detail_type_name:'Module'
				},{
					detail_category_id: 'electronic_pumps',
					detail_category_name: 'Electronic Pumps',
					detail_type_id:'sub_pump_replacement',
					detail_type_name:'Submersible Pump Replacement'
				}],
				sludge_dumping_site_details:[{
					detail_type_id: 'site_excavation',
					detail_type_name: 'Site Excavation'
				},{
					detail_type_id: 'compaction',
					detail_type_name: 'Compaction'
				},{
					detail_type_id: 'disinfection',
					detail_type_name: 'Disinfection'
				},{
					detail_type_id: 'fencing',
					detail_type_name: 'Fencing'
				}],
				latrine_monitoring_details:[{
					detail_type_id: 'pit_level',
					detail_type_name: 'Level Pit Contents',
					detail_type_label: 'No. (Latrine(s) Pit Level Checked)'
				},{
					detail_type_id: 'latrine_cleanliness',
					detail_type_name: 'Cleanliness of Latrine',
					detail_type_label: 'No. (Latrine(s) Cleanliness Checked)'
				},{
					detail_type_id: 'latrine_functionality',
					detail_type_name: 'Latrine Functionality',
					detail_type_label: 'No. (Latrine(s) Functionality Checked)'
				},{
					detail_type_id: 'sanitation_committee_activeness',
					detail_type_name: "Sanitation Committee Members Activeness, Training and Complaints/Feedback'",
					detail_type_label: 'No. (Committee Indicator(s) Monitored)'
				},{
					detail_type_id: 'elders_access_latrine',
					detail_type_name: 'Accessibility of Latrines for Disabled and Elderly Users',
					detail_type_label: 'No. (Latrine(s) Accessibility Checked)'
				},{
					detail_type_id: 'desludging_records',
					detail_type_name: 'Desludging Records',
					detail_type_label: 'No. (Latrine Desludging Record(s) Checked)'
				},{
					detail_type_id: 'latrine_user_complaints',
					detail_type_name: 'User Complaints on Latrine Functionality',
					detail_type_label: 'No. (Latrine Complaint(s) Checked)'
				}],
				shower_monitoring_details:[{
					detail_type_id: 'shwrs_cleanliness',
					detail_type_name: 'Cleanliness of Showers',
					detail_type_label: 'No. (Showers(s) Cleanliness Checked)'
				},{
					detail_type_id: 'shwrs_functionality',
					detail_type_name: "Showers Functionality",
					detail_type_label: 'No. (Showers(s) Functionality Checked)'
				},{
					detail_type_id: 'shwrs_access_dibld_eldrly',
					detail_type_name: 'Accessibility of Showers for Disabled/Elderly',
					detail_type_label: 'No. (Showers(s) Accessibility Checked)'
				},{
					detail_type_id: 'shwr_lighting',
					detail_type_name: 'Lighting of Showers at Night',
					detail_type_label: 'No. (Showers(s) Lighting Checked)'
				},{
					detail_type_id: 'shwrs_user_complaints',
					detail_type_name: 'User Complaints on Shower Functionality',
					detail_type_label: 'No. (Showers(s) Complaints Checked)'
				}],
				facility_status:[{
					facility_status_id: 'newly_constructed',
					facility_status_name: 'Newly Constructed',
				},{
					facility_status_id: 'existing_rehabilitated',
					facility_status_name: 'Existing / Rehabilitated',
				}],
				solid_waste_committee_kits:[{
					detail_type_id: 'mask',
					detail_type_name: 'Respirator Mask'
				},{
					detail_type_id: 'broom',
					detail_type_name: 'Rubber Broom with Stick Handle'
				},{
					detail_type_id: 'gloves',
					detail_type_name: 'Heavy Duty Gloves (Pair)'
				},{
					detail_type_id: 'wastebin',
					detail_type_name: 'Solid Waste Bin (120 L)'
				},{
					detail_type_id: 'shovel',
					detail_type_name: 'Shovel'
				},{
					detail_type_id: 'rake',
					detail_type_name: 'Rake'
				},{
					detail_type_id: 'axe',
					detail_type_name: 'Pick Axe'
				},{
					detail_type_id: 'wheelbarrow',
					detail_type_name: 'Wheelbarrow'
				}],
				waste_management_committee_duties:[{
					detail_type_id: 'wst_cmmttee_area_assgnd',
					detail_type_name: 'Informed of the Part of Camp Responsible For'
				},{
					detail_type_id: 'wst_cmmttee_infrmd_daily_clning',
					detail_type_name: 'Informed they are Responsible for Daily Emptying of Communal Waste Bins'
				},{
					detail_type_id: 'wst_cmmttee_infrmd_rtatn',
					detail_type_name: 'Informed of Rotation Schedule (for Rotational Committees)'
				}],
				sanitation_committee_duties:[{
					detail_type_id: 'snt_cmmttee_ltrn_assgnd',
					detail_type_name: 'Informed of the Latrines/Showers Responsible For'
				},{
					detail_type_id: 'snt_cmmttee_infrmd_daily_clning',
					detail_type_name: 'Informed they are Responsible for Daily Cleaning of Internal Latrine Superstructure in Camps'
				},{
					detail_type_id: 'snt_cmmttee_infrmd_outside_clning',
					detail_type_name: 'Informed they are Responsible to Ensure Excrement Outside of Latrine is Cleared'
				},{
					detail_type_id: 'snt_cmmttee_infrmd_rtatn',
					detail_type_name: 'Informed of Rotation Schedule (for Rotational Committees)'					
				}],
				sanitation_committee_kits:[{
					detail_type_id: 'lqd_dtrgnt',
					detail_type_name: 'Liquid Detergent'
				},{
					detail_type_id: 'pwdrd_dtrgnt',
					detail_type_name: 'Powdered Deterhgent (60-100g)'
				},{
					detail_type_id: 'brush',
					detail_type_name: 'Hard Toilet Brush with Stick '
				},{
					detail_type_id: 'broom',
					detail_type_name: 'Rubber Broom with Stick Handle'
				},{
					detail_type_id: 'gloves',
					detail_type_name: 'Rubber Gloves'
				},{
					detail_type_id: 'bucket',
					detail_type_name: 'HDPE 20L Bucket with Lid'
				},{
					detail_type_id: 'rainboots',
					detail_type_name: 'Rubber Rainboots'
				},{
					detail_type_id: 'dustpan',
					detail_type_name: 'Plastic Dust Pan'
				},{
					detail_type_id: 'shovel',
					detail_type_name: 'Shovel'
				},{
					detail_type_id: 'rake',
					detail_type_name: 'Rake'
				},{
					detail_type_id: 'hoe',
					detail_type_name: 'Hoe with Wooden Handle'
				},{
					detail_type_id: 'wheelbarrow',
					detail_type_name: 'Wheel Barrow'
				},{
					detail_type_id: 'metalic_bucket',
					detail_type_name: 'Metallic Bucket with Handle'
				}],
				other_campaigns: [{
					detail_type_id:'theatre',
					detail_type_name:'Theater'
				},{
					detail_type_id:'shows',
					detail_type_name:'Shows'
				},{
					detail_type_id:'ghwd',
					detail_type_name:'Global Hand Washing Day'
				},{
					detail_type_id:'cleanup_cmpgn',
					detail_type_name:'Cleanup Campaign'
				},{
					detail_type_id:'hndwshing_hr',
					detail_type_name:'Handwashing Hour'
				},{
					detail_type_id:'jerrycan_clnng_cmpgn',
					detail_type_name:'Jerry Can Cleaning Campaign'
				},{
					detail_type_id:'child_child_ssn',
					detail_type_name:'Child-to-Child Session'
				},{
					detail_type_id:'not_listed',
					detail_type_name:'Not Listed'
				}],
				hygiene_promotion_volunteers_recruitment_training: [{
					detail_type_id:'cmmty_engagment',
					detail_type_name:'Community Engagement/Mobilization, Dialogue and Interaction (Activities Related to Customs, Taboos, Norms, Culture)'
				},{
					detail_type_id:'info_knwldge_sharing',
					detail_type_name:'Information and Knowledge Sharing'
				},{
					detail_type_id:'use_of_wash_facilities',
					detail_type_name:'Ensuring Access and Use of WASH facilities and Services (Promoting the Use of WASH Facilities and Services Including Water Points, Latrines, Showers, Handwashing Stations)'
				},{
					detail_type_id:'use_of_wash_materials',
					detail_type_name:'Ensuring Access and Use of Materials (pPromoting the use of WASH Facilities and Services Including Hygiene Kits, Aquatabs)'
				},{
					detail_type_id:'pub_health_risk',
					detail_type_name:'Training on the Key Activities to Mitigate pPublic Health Risks (Promoting Handwashing at Key Times, Safe Water)'
				},{
					detail_type_id:'wrking_children_young_elderly',
					detail_type_name:'Basic Principles on Working with Children, Young, Elderly and Disabled People '
				},{
					detail_type_id:'gender_issues',
					detail_type_name:'Gender Issues (Importance of Gender Sensitivity, SGBV, SGM)'
				},{
					detail_type_id:'mhm',
					detail_type_name:'Menstrual Hygiene Management (MHM) and Incontinence'
				},{
					detail_type_id:'muac',
					detail_type_name:'Understanding of MUAC Readings'
				},{
					detail_type_id:'hp_in_edu',
					detail_type_name:'Principles of Hygiene Promotion for Schools, Safe Spaces and Learning Centres'
				},{
					detail_type_id:'accountability',
					detail_type_name:'Accountability to Affected Population (Training on Feedback and Complaint Mechanism)'
				}],
				hygiene_promotion_monitoring_visits: [{
					detail_type_id:'hp_knw_pou',
					detail_type_name:'Hygiene Promoters Understanding of Correct Dosage for Any POU Chlorine Products'
				},{
					detail_type_id:'hp_knw_ors',
					detail_type_name:'Hygiene Promoters Knowledge of ORS Preparation'
				},{
					detail_type_id:'hp_knw_nfi',
					detail_type_name:'Hygiene Promoters Understanding of Purpose of All NFIs'
				},{
					detail_type_id:'hp_knw_key_cholera_msgs',
					detail_type_name:'Hygiene Promoters Knowledge of Key Cholera and Hygiene Messages'
				},{
					detail_type_id:'hp_hh_logs',
					detail_type_name:'Hygiene Promoter Household Visit Logs'
				}],
				initial_hygiene_kit_distribution:[{
					detail_type_id:'jerrycan_25l',
					detail_type_name:'Jerrycan, 25 L, Non-Collapsible'
				},{
					detail_type_id:'jerrycan_10l',
					detail_type_name:'Jerrycan, 10 L, Non-Collapsible'
				},{
					detail_type_id:'bucket',
					detail_type_name:'Bucket with lid, HDPE, 20 L'
				},{
					detail_type_id:'kettle',
					detail_type_name:'Kettle with Lid, Plastic, Sanitary Cleansing, 2L'
				},{
					detail_type_id:'torch',
					detail_type_name:'Torch light, Rechargeable'
				},{
					detail_type_id:'potty',
					detail_type_name:'Child Potty with Lid'
				},{
					detail_type_id:'bath_soap',
					detail_type_name:'Bathing Soap, 250 Grams'
				},{
					detail_type_id:'laundry_soap',
					detail_type_name:'Laundry Soap, 200 Grams'
				},{
					detail_type_id:'rope',
					detail_type_name:'Rope'
				},{
					detail_type_id:'clothepins',
					detail_type_name:'Clothes Pins'
				},{
					detail_type_id:'female_underwear',
					detail_type_name:'Female Undergarments, Medium Size'
				},{
					detail_type_id:'reusable_sanit_pad',
					detail_type_name:'Reusable Sanitary Pad Set (2 Holders, 3 Winged Pads, 2 Straight Pads)'
				}],
				replenishment_hygiene_kit_distribution:[{
					detail_type_id:'bath_soap',
					detail_type_name:'Bathing soap, 250 Grams'
				},{
					detail_type_id:'laundry_soap',
					detail_type_name:'Laundry soap, 200 Grams'
				}],
				cholera_kit_distribution:[{
					detail_type_id:'ors',
					detail_type_name:'ORS Packet'
				},{
					detail_type_id:'wtr_guard',
					detail_type_name:'Water Guard Solution, 1.25% Sodium Hypochlorite (NaOCl) Solution, 250 mL (250ml Bottle)'
				},{
					detail_type_id:'aquatab',
					detail_type_name:'Aquatab or Oasis, Sodium Dichloroisocyanurate (NaDCC) 67 mg Tablets (Pack of 50 Tablets)'
				},{
					detail_type_id:'bath_soap',
					detail_type_name:'Bathing Soap, 250 Grams'
				}],
				hygiene_promotion_volunteers_kit_distribution:[{
					detail_type_id:'hwshing_poster_eng',
					detail_type_name:'Hand Washing Poster (English)'
				},{
					detail_type_id:'hwshing_poster_knri',
					detail_type_name:'Hand Washing Poster (Kanuri)'
				},{
					detail_type_id:'hwshing_poster_hsa',
					detail_type_name:'Hand Washing Poster (Hausa)'
				},{
					detail_type_id:'hwshing_hndbills_hsa_eng',
					detail_type_name:'Hand Washing Handbills (Hausa, English)'
				},{
					detail_type_id:'chlr_prev_pstr',
					detail_type_name:'Cholera Prevention Poster'
				},{
					detail_type_id:'chlr_flip_chrt',
					detail_type_name:'Cholera Flip Chart'
				},{
					detail_type_id:'hep_e_pstr_hndbills',
					detail_type_name:'Hepatitis E Prevention Posters and Hand Bills'
				}],
				post_distribution_monitoring:[{
					detail_type_id:'hk_cultural_good',
					detail_type_name:'Cultural Appropriateness'
				},{
					detail_type_id:'hk_usefulness',
					detail_type_name:'Usefulness of Items to Households'
				},{
					detail_type_id:'hk_sufficienccy',
					detail_type_name:'Sufficient Quantities'
				},{
					detail_type_id:'hk_issues',
					detail_type_name:'Issues or Dislikes of Materials'
				},{
					detail_type_id:'hk_purpose_use',
					detail_type_name:'Users Understanding of Purpose and Use'
				},{
					detail_type_id:'hk_missing',
					detail_type_name:'Missing Items in Kits '
				},{
					detail_type_id:'hk_availability_hhs',
					detail_type_name:'Availability of Materials to All Households'
				},{
					detail_type_id:'hk_transparency',
					detail_type_name:'Transparency of the Selection Process'
				},{
					detail_type_id:'hk_access_dsbld_elder',
					detail_type_name:'Access to Materials by Disabled and Elderly '
				},{
					detail_type_id:'hk_queuing',
					detail_type_name:'Queuing/Waiting Time of Beneficiaries Recieving Materials'
				},{
					detail_type_id:'hk_security',
					detail_type_name:'Security Concerns for Women and Children During Distribution'
				}],
				cash_based_items:[{
					detail_type_id:'water_vendor',
					detail_type_name:'Water, Water Vendor Fee, 20L jerrycan'
				},{
					detail_type_id:'jerrycan_25l',
					detail_type_name:'Jerrycan, 25 L, Non-collapsible'
				},{
					detail_type_id:'jerrycan_10l',
					detail_type_name:'Jerrycan, 10 L, Non-collapsible'
				},{
					detail_type_id:'bucket',
					detail_type_name:'Bucket with Lid, HDPE, 20 L'
				},{
					detail_type_id:'aquatabs',
					detail_type_name:'Aqua tabs, Strip of 10x67mg tablets'
				},{
					detail_type_id:'kettle',
					detail_type_name:'Kettle with Lid, Plastic, sanitary cleansing, 2 L'
				},{
					detail_type_id:'child_potty',
					detail_type_name:'Child Potty with Lid'
				},{
					detail_type_id:'bathing_soap',
					detail_type_name:'Bathing Soap, 250 Grams'
				},{
					detail_type_id:'laundry_soap',
					detail_type_name:'Laundry Soap, 200 Grams'
				},{
					detail_type_id:'rope',
					detail_type_name:'Rope, 4m'
				},{
					detail_type_id:'clothes_pin',
					detail_type_name:'Clothes Pins, Pack of 5'
				},{
					detail_type_id:'sanit_pads',
					detail_type_name:'Sanitary Pads, Reusable Packs'
				},{
					detail_type_id:'female_undergament',
					detail_type_name:'Female Undergarments, Medium Size'
				},{
					detail_type_id:'torchlight',
					detail_type_name:'Torch Light, Rechargeable'
				},{
					detail_type_id:'other',
					detail_type_name:'Others'
				}],
				information_community_languages:[{
					detail_type_id:'arabiyye',
					detail_type_name:'Arabiyye'
				},{
					detail_type_id:'babur',
					detail_type_name:'Babur'
				},{					
					detail_type_id:'bacama',
					detail_type_name:'Bacama/Bachama'
				},{
					detail_type_id:'bade',
					detail_type_name:'Bade'
				},{
					detail_type_id:'baggara',
					detail_type_name:'Baggara'
				},{
					detail_type_id:'bata',
					detail_type_name:'Bata'
				},{
					detail_type_id:'bena',
					detail_type_name:'Bena'
				},{
					detail_type_id:'bile',
					detail_type_name:'Bile'
				},{
					detail_type_id:'bole',
					detail_type_name:'Bole'
				},{
					detail_type_id:'bura',
					detail_type_name:'Bura'
				},{
					detail_type_id:'chamba_leko',
					detail_type_name:'Chamba Leko'
				},{
					detail_type_id:'chibuk',
					detail_type_name:'Chibuk'
				},{
					detail_type_id:'cibak',
					detail_type_name:'Cibak'
				},{
					detail_type_id:'dadiya',
					detail_type_name:'Dadiya'
				},{
					detail_type_id:'dehoxde',
					detail_type_name:'Dehoxde'
				},{
					detail_type_id:'dera',
					detail_type_name:'Dera'
				},{
					detail_type_id:'dghweɗe',
					detail_type_name:'Dghweɗe'
				},{
					detail_type_id:'ebina',
					detail_type_name:'Ebina'
				},{
					detail_type_id:'fali',
					detail_type_name:'Fali'
				},{
					detail_type_id:'fula',
					detail_type_name:'Fula/Fulani'
				},{
					detail_type_id:'fulfulde',
					detail_type_name:'Fulfulde'
				},{
					detail_type_id:'galavda',
					detail_type_name:'Galavda'
				},{
					detail_type_id:'gamargu',
					detail_type_name:'Gamargu'
				},{
					detail_type_id:'gbinna',
					detail_type_name:'Gbinna'
				},{
					detail_type_id:'gelebda',
					detail_type_name:'Gelebda'
				},{
					detail_type_id:'glanda',
					detail_type_name:'Glanda'
				},{
					detail_type_id:'glavda',
					detail_type_name:'Glavda'
				},{
					detail_type_id:'guɗe',
					detail_type_name:'Guɗe'
				},{
					detail_type_id:'guduf',
					detail_type_name:'Guduf'
				},{
					detail_type_id:'gvoko',
					detail_type_name:'Gvoko'
				},{
					detail_type_id:'hausa',
					detail_type_name:'Hausa'
				},{
					detail_type_id:'hona',
					detail_type_name:'Hona'
				},{
					detail_type_id:'hude',
					detail_type_name:'Hude'
				},{
					detail_type_id:'hwana',
					detail_type_name:'Hwana'
				},{
					detail_type_id:'hwona',
					detail_type_name:'Hwona'
				},{
					detail_type_id:'jeng',
					detail_type_name:'Jeng'
				},{
					detail_type_id:'johode',
					detail_type_name:'Johode'
				},{
					detail_type_id:'kamwe',
					detail_type_name:'Kamwe'
				},{
					detail_type_id:'kanakuru',
					detail_type_name:'Kanakuru'
				},{
					detail_type_id:'kanuri',
					detail_type_name:'Kanuri'
				},{
					detail_type_id:'karekare',
					detail_type_name:'Karekare'
				},{
					detail_type_id:'kibaku',
					detail_type_name:'Kibaku'
				},{
					detail_type_id:'kwaa_bwaare',
					detail_type_name:'Kwaa-Bwaare'
				},{
					detail_type_id:'lamang',
					detail_type_name:'Lamang'
				},{
					detail_type_id:'leko',
					detail_type_name:'Leko'
				},{
					detail_type_id:'longuda',
					detail_type_name:'Longuda'
				},{
					detail_type_id:'malgwa',
					detail_type_name:'Malgwa'
				},{
					detail_type_id:'mandara',
					detail_type_name:'Mandara'
				},{
					detail_type_id:'marghi',
					detail_type_name:'Marghi'
				},{
					detail_type_id:'mbula',
					detail_type_name:'Mbula'
				},{
					detail_type_id:'mom_jango',
					detail_type_name:'Mom Jango'
				},{
					detail_type_id:'momi',
					detail_type_name:'Momi'
				},{
					detail_type_id:'mumuye',
					detail_type_name:'Mumuye'
				},{
					detail_type_id:'ngizim',
					detail_type_name:'Ngizim'
				},{
					detail_type_id:'njai',
					detail_type_name:'Njai'
				},{
					detail_type_id:'njegn',
					detail_type_name:'Njegn'
				},{
					detail_type_id:'nzangi',
					detail_type_name:'nzanyi Nzangi/Nzanyi'
				},{
					detail_type_id:'sama',
					detail_type_name:'Sama'
				},{
					detail_type_id:'samba_leko',
					detail_type_name:'Samba Leko'
				},{
					detail_type_id:'shuwa_arabic',
					detail_type_name:'Shuwa Arabic'
				},{
					detail_type_id:'suntai',
					detail_type_name:'Suntai'
				},{
					detail_type_id:'tangale',
					detail_type_name:'Tangale'
				},{
					detail_type_id:'tera',
					detail_type_name:'Tera'
				},{
					detail_type_id:'tghuade',
					detail_type_name:'Tghuade'
				},{
					detail_type_id:'toghwede',
					detail_type_name:'Toghwede'
				},{
					detail_type_id:'traude',
					detail_type_name:'Traude'
				},{
					detail_type_id:'tula',
					detail_type_name:'Tula'
				},{
					detail_type_id:'turawa',
					detail_type_name:'Turawa'
				},{
					detail_type_id:'waha',
					detail_type_name:'Waha'
				},{
					detail_type_id:'wiyaa',
					detail_type_name:'Wiyaa'
				},{
					detail_type_id:'yangur',
					detail_type_name:'yungur Yangur/Yungur'
				},{
					detail_type_id:'yii_kitule',
					detail_type_name:'yii Kitule'
				}]
			},

      // manages selections (removes selections from detials list for ET ESNFI partial_kits, kit_details)
      getDetailList: function( list, $locationIndex, $beneficiaryIndex, $index, detail_type_id, b_detail_list ) {

        // each beneficiary
        if ( !ngmClusterHelperNgWashLists.details[ $locationIndex ] ) {
          ngmClusterHelperNgWashLists.details[ $locationIndex ] = [];
        }
        if ( !ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ] ) {
          ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ] = [];
        }
        
        // set list at index
        if ( !ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] ) {
          ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = angular.copy( list );
        }

        // remove current selection
        b_detail_list = $filter( 'filter' )( b_detail_list, { detail_type_id: '!' + detail_type_id } );
        
        // filter partial_kits
        angular.forEach( b_detail_list, function ( detail ) {
          if ( detail.detail_type_id ) {
            ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = $filter( 'filter' )( ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ], { detail_type_id: '!' + detail.detail_type_id } );
          }
        });

        // return
        return ngmClusterHelperNgWashLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ];

      },

			// remove duplicates in item ( json array ) based on value ( filterOn )
			filterDuplicates: function( list, keyname ){
      	
      	var keys = [];
      	var output = [];

      	// for each
				angular.forEach( list, function( item ) {
					// we check to see whether our object exists
					var key = item[ keyname ];
					// if it's not already part of our keys array
					if( keys.indexOf( key ) === -1 ) {
						// add it to our keys array
						keys.push( key ); 
						// push this item to our final output array
						output.push( item );
					}
				});
				

				// duplicates filtered
				return output;
			}

		}

		// return 
		return ngmClusterHelperNgWashLists;

	}]);
