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

			// activity keys
			keys: {
				
				// WATER
				// boreholes
				'borehole_construction':{
					template: 'borehole.html',
					association: 'boreholes',
					measurement: {
						borehole_yield_ltrs_second: 0,
						borehole_pumping_ave_daily_hours: 0,
						borehole_tanks_storage_ltrs: 0,
						taps_number_connected: 0,
						borehole_taps_ave_flow_rate_ltrs_minute: 0
					}
				},
				'borehole_rehabilitation':{
					template: 'borehole.html',
					association: 'boreholes',
					measurement: {
						borehole_yield_ltrs_second: 0,
						borehole_pumping_ave_daily_hours: 0,
						borehole_tanks_storage_ltrs: 0,
						taps_number_connected: 0,
						borehole_taps_ave_flow_rate_ltrs_minute: 0
					}
				},
				'borehole_upgrade':{
					template: 'borehole.html',
					association: 'boreholes',
					measurement: {
						borehole_yield_ltrs_second: 0,
						borehole_pumping_ave_daily_hours: 0,
						borehole_tanks_storage_ltrs: 0,
						taps_number_connected: 0,
						borehole_taps_ave_flow_rate_ltrs_minute: 0
					}
				},
				
				// reticulation
				'reticulation_construction': { 
					template: 'reticulation.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'taps_connected',
						quantity_measurement_name: 'Taps Connected'
					}
				},
				'reticulation_rehabilitation': { 
					template: 'reticulation.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'taps_connected',
						quantity_measurement_name: 'Taps Connected'
					}
				},
				
				// services
				'water_trucking': { 
					template: 'service.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				'cash_for_water': { 
					template: 'service.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				'distribution_treatment_tablets': {
					template: 'service.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				
				// ops and maintenance
				'fuel_provision_water': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'm3_per_month',
						quantity_measurement_name: 'm3/Per Month'
					}
				},
				'washcoms_establishment_training': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						male: 0,
						female: 0,
						quantity_measurement_id: 'training_sessions',
						quantity_measurement_name: 'Training Sessions',
					}
				},
				'operation_maintenance_monitoring': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						quantity_measurement_id: 'monitoring_visits',
						quantity_measurement_name: 'Monitoring Visits'
					}
				},
				'maintenance_repair_kits_provision_to_washcoms': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						details:[],
						quantity_measurement_id: 'kits_distributed',
						quantity_measurement_name: 'Kits Distributed'
					}
				},
				'maintenance_repair_replacement_water_systems': { 
					template: 'maintenance.html',
					association: 'water',
					measurement: {
						details:[],
						quantity_measurement_id: 'systems_repaired_replaced',
						quantity_measurement_name: 'Systems Repaired / Replaced'
					}
				},

				// SANITATION
				// latrines construction
				'latrine_construction_hh': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'hh_latrines',
						quantity_measurement_name: ' HH Latrines'
					}
				},
				'latrine_construction_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation: 'no',
						lock_installation: 'No',
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_construction_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation: 'no',
						lock_installation: 'No',
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				// latrine rehabilitation
				'latrine_rehabilitation_hh': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'hh_latrines',
						quantity_measurement_name: ' HH Latrines'
					}
				},
				'latrine_rehabilitation_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation: 'no',
						lock_installation: 'No',
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_rehabilitation_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						gender_marking_id: 'no',
						gender_marking_name: 'No',
						lock_installation: 'no',
						lock_installation: 'No',
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				// cleaning and desludging
				'latrine_cleaning_disinfection_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: ' VIP Latrines'
					}
				},
				'latrine_cleaning_disinfection_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				// desludging
				'latrine_desludging_manual': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						stipend_id: 'no',
						stipend_name: 'No',
						stipend_amount: 0,
						quantity_measurement_id: 'manual',
						quantity_measurement_name: 'Manual'
					}
				},
				'latrine_desludging_mechanical': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'mechanical',
						quantity_measurement_name: 'Mechanical'
					}
				},
				'latrine_sludge_dumping_site': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						details: [],
						quantity_measurement_id: 'sites_prepared',
						quantity_measurement_name: 'Sites Prepared'
					}
				},
				'latrine_monitoring': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						details: [],
						quantity_measurement_id: 'monitoring_visits',
						quantity_measurement_name: 'Monitoring Visits'
					}
				},
				// geneder marking / locks
				'latrine_gender_marking_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_gender_marking_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				'latrine_lock_installation_vip': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'vip_latrines',
						quantity_measurement_name: 'VIP Latrines'
					}
				},
				'latrine_lock_installation_emergency': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						male: 0,
						female: 0,
						male_disabled: 0,
						female_disabled: 0,
						quantity_measurement_id: 'emergency_latrines',
						quantity_measurement_name: 'Emergency Latrines'
					}
				},
				'hand_washing_stations_installation': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'installed',
						quantity_measurement_name: 'Installed'
					}
				},
				'hand_washing_stations_refilled': { 
					template: 'latrines.html',
					association: 'sanitation',
					measurement: {
						quantity_measurement_id: 'refilled',
						quantity_measurement_name: 'Refilled'
					}
				},
				defaults: {
					quantity: 0,
					activity_start_date: moment( new Date() ).startOf( 'M' ).format('YYYY-MM-DD'),
					activity_end_date: moment( new Date() ).endOf( 'M' ).format('YYYY-MM-DD')
				}
			},

			// lists
			lists: {
				stipends: [{
					stipend_id: 'no',
					stipend_name: 'No',
				},{
					stipend_id: 'yes',
					stipend_name: 'Yes',
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
					detail_type_label: 'Number (Latrine(s) Pit Level Checked)'
				},{
					detail_type_id: 'latrine_cleanliness',
					detail_type_name: 'Cleanliness of Latrine',
					detail_type_label: 'Number (Latrine(s) Cleanliness Checked)'
				},{
					detail_type_id: 'latrine_functionality',
					detail_type_name: 'Latrine Functionality',
					detail_type_label: 'Number (Latrine(s) Functionality Checked)'
				},{
					detail_type_id: 'sanitation_committee_activeness',
					detail_type_name: "Sanitation Committee Members' Activeness, Training and Complaints/Feedback'",
					detail_type_label: 'Number (Committee Performance(s) / Need(s) Monitored)'
				},{
					detail_type_id: 'elders_access_latrine',
					detail_type_name: 'Accessibility of Latrines for Disabled and Elderly Users',
					detail_type_label: 'Number (Latrine(s) Accessibility Checked)'
				},{
					detail_type_id: 'desludging_records',
					detail_type_name: 'Desludging Records',
					detail_type_label: 'Number (Latrine Desludging Record(s) Checked)'
				},{
					detail_type_id: 'latrine_user_complaints',
					detail_type_name: 'User Complaints on Latrine Functionality',
					detail_type_label: 'Number (User Complaint(s) Checked)'
				}]
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
