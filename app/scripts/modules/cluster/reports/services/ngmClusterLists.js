/**
 * @name ngmReportHub.factory:ngmClusterLists
 * @description
 * # ngmClusterLists
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterLists', 
      [ '$q',
        '$http',
        '$filter',
        '$timeout',
        'ngmAuth','$location', 'ngmLists',
    function( $q, $http, $filter, $timeout, ngmAuth,$location, ngmLists ) {


		var ngmClusterLists = {

      // comphrensive list of all sectors - ever
      all_sectors: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','health','logistics','smsd','nutrition','protection','rnr_chapter','wash' ],
      all_sectors_minus_smsd: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','health','logistics','nutrition','protection','rnr_chapter','wash' ],
      all_sectors_minus_health: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','logistics','smsd','nutrition','protection','rnr_chapter','wash' ],
      all_sectors_minus_health_smsd: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','logistics','nutrition','protection','rnr_chapter','wash' ],
      all_sectors_minus_wash: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','health','logistics','smsd','nutrition','protection','rnr_chapter' ],
      all_sectors_minus_wash_health: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','logistics','smsd','nutrition','protection','rnr_chapter' ],
      all_sectors_minus_wash_health_smsd: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','education','eiewg','emergency_telecommunications','esnfi','fsac','fss','logistics','nutrition','protection','rnr_chapter' ],
      all_sectors_minus_wash_education: [ 'cvwg','agriculture','cccm_esnfi','cwcwg','coordination','eiewg','emergency_telecommunications','esnfi','fsac','fss','health','logistics','smsd','nutrition','protection','rnr_chapter' ],
      all_sectors_col: ['smsd','education','alojamientos_asentamientos','san','health','recuperacion_temprana','protection','wash','ningún_cluster','coordinación_información'],

       
      // lists ( project, mpc transfers )
      setLists: function( project, transfers ) {

        return {
 
          // lists
					units: ngmClusterLists.getUnits( project.admin0pcode ),
          indicators: ngmClusterLists.getIndicators( true ),
          delivery_types: ngmClusterLists.getDeliveryTypes( project.admin0pcode ),
          mpc_purpose: ngmClusterLists.getMpcPurpose(),

          // mpc_delivery_type: ngmClusterLists.getMpcDeliveryTypes(project.admin0pcode),
          mpc_mechanism_type: ngmClusterLists.getMpcMechanismTypes(project.admin0pcode),
          transfers: ngmClusterLists.getTransfers( transfers ),
          clusters: ngmClusterLists.getClusters( project.admin0pcode ).filter(cluster=>cluster.project!==false),
          projectsclasifications: ngmClusterLists.getProjectClasifications(project.admin0pcode),
          activity_types: ngmClusterLists.getActivities( project, true, 'activity_type_id' ),
          activity_descriptions: ngmClusterLists.getActivities( project, true, 'activity_description_id' ),
          activity_details: ngmClusterLists.getActivities( project, true, 'activity_detail_id' ),
          activity_indicators: ngmClusterLists.getActivities( project, true, 'indicator_id' ),
          projectActivityTypes: ngmClusterLists.getProjectActivityTypes( project ),
          strategic_objectives: ngmClusterLists.getStrategicObjectives( project.admin0pcode, moment( project.project_start_date ).year(), moment( project.project_end_date ).year() ),
          category_types: ngmClusterLists.getCategoryTypes(),
          beneficiary_types: ngmClusterLists.getBeneficiaries( moment( project.project_end_date ).year(), project.admin0pcode, project.cluster_id ),
          beneficiary_categories: ngmClusterLists.getBeneficiariesCategories(),
          // location_groups: ngmClusterLists.getLocationGroups(),
          currencies: ngmClusterLists.getCurrencies( project.admin0pcode ),
          donors: ngmClusterLists.getDonors( project.admin0pcode, project.cluster_id ),
          organizations: ngmClusterLists.getOrganizations(project.admin0pcode),
					
          
          // keys to ignore when summing beneficiaries in template ( 2016 )
          skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ], 

          // NG cholera
          activity_cholera_response: [{ activity_cholera_response_id: 'yes', activity_cholera_response_name: 'Yes' },
                              { activity_cholera_response_id: 'no', activity_cholera_response_name: 'No' }],

          // training
          trainee_affiliations: [{ trainee_affiliation_id: 'community', trainee_affiliation_name: 'Community' },
                                    { trainee_affiliation_id: 'moh', trainee_affiliation_name: 'MoH' },
                                    { trainee_affiliation_id: 'private', trainee_affiliation_name: 'Private' },
                                    { trainee_affiliation_id: 'local_ngo', trainee_affiliation_name: 'Local NGO' },
                                    { trainee_affiliation_id: 'international_ngo', trainee_affiliation_name: 'International NGO' }],
          trainee_health_workers: [{ trainee_health_worker_id: 'doctors', trainee_health_worker_name: 'Doctors' },
                                    { trainee_health_worker_id: 'nurses', trainee_health_worker_name: 'Nurses' },
                                    { trainee_health_worker_id: 'midwives', trainee_health_worker_name: 'Midwives' },
                                    { trainee_health_worker_id: 'pharmacists', trainee_health_worker_name: 'Pharmacists' },
                                    { trainee_health_worker_id: 'health_officers', trainee_health_worker_name: 'Health Officers' },
                                    { trainee_health_worker_id: 'laboratory_technologists_technicians', trainee_health_worker_name: 'Laboratory Technologists / Technicians' },
                                    { trainee_health_worker_id: 'community_health_workers', trainee_health_worker_name: 'Community Health Workers' },
                                    { trainee_health_worker_id: 'community_health_volunteers', trainee_health_worker_name: 'Community Health Volunteers' },
                                    { trainee_health_worker_id: 'health_extension_workers', trainee_health_worker_name: 'Health Extension Workers' },
                                    { trainee_health_worker_id: 'environmental_health_workers', trainee_health_worker_name: 'Environmental Health Workers' }],
          
          // lists on load
          admin1: ngmLists.getObject( 'lists' ).admin1List,
          admin2: ngmLists.getObject( 'lists' ).admin2List,
          admin3: ngmLists.getObject( 'lists' ).admin3List,
          admin4: ngmLists.getObject( 'lists' ).admin4List,
          admin5: ngmLists.getObject( 'lists' ).admin5List,
          adminSites: ngmLists.getObject( 'lists' ).adminSites ? ngmLists.getObject( 'lists' ).adminSites : [], // fetched on admin1 change
         
          // row by row filters
          admin1Select: [],
          admin2Select: [],
          admin3Select: [],
          admin4Select: [],
          admin5Select: [],
          adminSitesSelect: [],

          // sites
          site_implementation: ngmClusterLists.getSiteImplementation( project.admin0pcode, project.cluster_id ),
          site_type: ngmClusterLists.getSiteTypes( project.cluster_id, project.admin0pcode ),
          site_list_select: [{ site_list_select_id: 'yes', site_list_select_name: 'Yes'},{ site_list_select_id: 'no', site_list_select_name: 'No'}],

          // eiewg
          schools:[],
          hub_schools: [],
          hub_sites: [],
          new_site: [{ new_site_id: 'yes', new_site_name: 'Yes' },{ new_site_id: 'no', new_site_name: 'No' }]

        }
      },

      // get lists for cluster reporting
      setClusterLists: function( user ) {

        // requests
        var requests = {

          // admin1 lists
          getAdmin1List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin1List?admin0pcode=' + user.admin0pcode
          },

          // admin2 lists
          getAdmin2List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin2List?admin0pcode=' + user.admin0pcode
          },

          // admin3 lists
          getAdmin3List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin3List?admin0pcode=' + user.admin0pcode
          },
          
          // admin4 lists (determine if country has admin4 list!)
          getAdmin4List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin4List?admin0pcode=' + user.admin0pcode
          },

          // admin5 lists (determine if country has admin5 list!)
          getAdmin5List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin5List?admin0pcode=' + user.admin0pcode
          },

          // get sites ( for select countries with limited sites )
          getAdminSites: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdminSites?admin0pcode=' + user.admin0pcode
          },

          // activities list
          getActivities: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/activities?admin0pcode=' + user.admin0pcode
          },

          // donors list
          getDonors: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/donors'
          },

          // indicators list
          getIndicators: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/indicators'
          },

          // indicators list
          getStockItems: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/stockitems'
          },


          //organizations
          getOrganizations:{
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/organizations'
          }

        }

        // get all lists
        if ( !localStorage.getObject( 'lists' ) ) {

          // admin1, admin2, activities holders
          var lists = {
            admin1List: [],
            admin2List: [],
            admin3List: [],
            admin4List: [],
            admin5List: [],
            adminSites: [],
            activitiesList: [],
            donorsList: [],
            indicatorsList: [],
            stockItemsList: [],
            organizationsList: []
          };

          // storage
          localStorage.setObject( 'lists', lists );
          ngmLists.setObject( 'lists', lists );
					
					// for ROLE REGIONAL above
					if (user.roles.length > 1) {
						const USER = ngmAuth.userPermissions();
						var max_role = USER.reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })['ROLE'];

						if (max_role === 'HQ' || max_role === 'HQ_ORG' || max_role === 'REGION_ORG' || max_role === 'REGION' || max_role === 'SUPERADMIN') {
							var region = max_role.indexOf('REGION') > -1 ? user.adminRpcode : 'HQ';
							var getActivitiesBasedOnRole = {
								method: 'GET',
								url: ngmAuth.LOCATION + '/api/cluster/list/activities?adminRpcode=' + region
							}
							requests.getActivities = getActivitiesBasedOnRole;
						}
					}
          // send request
          $q.all([
            $http( requests.getAdmin1List ),
            $http( requests.getAdmin2List ),
            $http( requests.getAdmin3List ),
            $http( requests.getAdmin4List ),
            $http( requests.getAdmin5List ),
            $http( requests.getAdminSites ),
            $http( requests.getActivities ),
            $http( requests.getDonors ),
            $http( requests.getIndicators ),
            $http( requests.getStockItems ),
            $http( requests.getOrganizations),
           
             ] ).then( function( results ){

              // admin1, admin2, activities object
              var lists = {
                admin1List: results[0].data,
                admin2List: results[1].data,
                admin3List: results[2].data,
                admin4List: results[3].data,
                admin5List: results[4].data,
                adminSites: results[5].data,
                activitiesList: results[6].data,
                donorsList: results[7].data,
                indicatorsList: results[8].data,
                stockItemsList: results[9].data,
                organizationsList: results[10].data,
            
              };

              // storage
              localStorage.setObject( 'lists', lists );
              ngmLists.setObject( 'lists', lists );

            });
        }

      },

        // set org users for a project
      setOrganizationUsersList: function( lists, project ) {
        // set org
        $http({
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/getOrganizationUsers',
          data: {
            admin0pcode: project.admin0pcode,
            cluster_id: project.cluster_id,
            organization: project.organization,
            status: 'active'
          }
        }).success( function( users ) {
          // return
          lists.users = users;
        }).error( function( err ) {
          //
        });
      },

    

      // monthly report indicators
      getIndicators: function( target ) {

        // if project target, return subset (2016)
        if ( target ) {
          var indicators = {
            // households: 0,
            // families: 0,
            boys: 0,
            girls: 0,
            men: 0,
            women: 0,
            elderly_men: 0,
            elderly_women: 0
          }
        } else {
          // get indicatorsList
          var indicators = ngmLists.getObject( 'lists' ).indicatorsList;
          angular.merge( indicators, { training_total_trainees: 0 } );
        }

        // reutrn
        return indicators;

      },

      // delivery
      getDeliveryTypes: function( admin0pcode ) {

        var delivery = [];

        if ( admin0pcode === 'AF' ) {
          delivery = [{
            delivery_type_id: 'population',
            delivery_type_name: 'New Beneficiaries'
          },{
            delivery_type_id: 'service',
            delivery_type_name: 'Existing Beneficiaries'
          }];
        } else if ( admin0pcode === 'CB' ) {

          delivery = [{
            delivery_type_id: 'population',
            delivery_type_name: 'New Beneficiaries'
          },{
            delivery_type_id: 'service',
            delivery_type_name: 'Reccurent Beneficiaries'
          },{
            delivery_type_id: 'service_existing',
            delivery_type_name: 'Existing Beneficiaries'
          },{
            delivery_type_id: 'population_schools_enrolment',
            delivery_type_name: 'Enrolment'
          },{
            delivery_type_id: 'service_schools_attendance',
            delivery_type_name: 'Attendance'
          },{
            delivery_type_id: 'contingency',
            delivery_type_name: 'Contingency'
          }];

        } else if ( admin0pcode === 'COL' ) {

          delivery = [{
            delivery_type_id: 'nuevos_beneficiarios',
            delivery_type_name: 'Nuevos Beneficiarios'
          },{
            delivery_type_id: 'beneficiarios_existentes',
            delivery_type_name: 'Beneficiarios Existentes'
          },
          {
            delivery_type_id: 'beneficiarios_indirectos',
            delivery_type_name: 'Beneficiarios Indirectos'
          }];

        } else if ( admin0pcode === 'NG' ) {

          delivery = [{
            delivery_type_id: 'completed',
            delivery_type_name: 'Completed'
          },{
            delivery_type_id: 'planned',
            delivery_type_name: 'Planned'
          }];

        } else {

          delivery = [{
            delivery_type_id: 'population',
            delivery_type_name: 'New Beneficiaries'
          },{
            delivery_type_id: 'service',
            delivery_type_name: 'Existing Beneficiaries'
          }];

        }

        return delivery;
      },

      // mpc purpose
      getMpcPurpose: function () {
        return [
            { cluster_id: 'eiewg', cluster: 'EiEWG', mpc_purpose_type_id: 'education', mpc_purpose_type_name: 'Education' },
            { cluster_id: 'fsac', cluster: 'FSAC', mpc_purpose_type_id: 'food', mpc_purpose_type_name: 'Food' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'fuel_electricity', mpc_purpose_type_name: 'Fuel / Electricity' },
            { cluster_id: 'health', cluster: 'Health', mpc_purpose_type_id: 'mpc_health', mpc_purpose_type_name: 'Health' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'rent', mpc_purpose_type_name: 'Rent' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'shelter', mpc_purpose_type_name: 'Shelter Construction' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'transport', mpc_purpose_type_name: 'Transport' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'nfi', mpc_purpose_type_name: 'NFI' },
            { cluster_id: 'wash', cluster: 'WASH', mpc_purpose_type_id: 'wash', mpc_purpose_type_name: 'WASH' }
          ];
      },


      //MPC DELIVERY TYPES
        // lists defined in activities.csv

			
      // delivery mechanism types
			getMpcMechanismTypes: function(admin0pcode){

        // COL
        if(admin0pcode === 'COL'){

          var types = [
            {
              mpc_delivery_type_id: 'efectivo',
              mpc_mechanism_type_id: 'cuenta_bancaria',
              mpc_mechanism_type_name: 'Cuenta Bancaria'
            },
            {
              mpc_delivery_type_id: 'efectivo',
              mpc_mechanism_type_id: 'dinero_entregado',
              mpc_mechanism_type_name: 'Dinero Entregado'
            },
            {
              mpc_delivery_type_id: 'efectivo',
              mpc_mechanism_type_id: 'tarjeta_prepago',
              mpc_mechanism_type_name: 'Tarjeta Pre-pago'
            },
            //bonos
            {
              mpc_delivery_type_id: 'bonos',
              mpc_mechanism_type_id: 'e_voucher',
              mpc_mechanism_type_name: 'E - Voucher'
            },
            
            {
              mpc_delivery_type_id: 'bonos',
              mpc_mechanism_type_id: 'tarjeta_electronica',
              mpc_mechanism_type_name: 'Tarjeta electrónica'
            },
            {
              mpc_delivery_type_id: 'bonos',
              mpc_mechanism_type_id: 'transferencia_electrónica',
              mpc_mechanism_type_name: 'Transferencia electrónica'
            },
            //tecnica
            {
              mpc_delivery_type_id: 'tecnica',
              mpc_mechanism_type_id: 'tecnica',
              mpc_mechanism_type_name: 'Técnica'
            },
            // en especie
            {
              mpc_delivery_type_id: 'en_especie',
              mpc_mechanism_type_id: 'en_especie',
              mpc_mechanism_type_name: 'En Especie'
            }];

        } else {

          // DEFAULT
  				var types = [{
  						mpc_delivery_type_id: 'cash',
              mpc_mechanism_type_id: 'hawala',
              mpc_mechanism_type_name: 'Hawala'
            },{
  						mpc_delivery_type_id: 'cash',
  						mpc_mechanism_type_id: 'cash_in_envelope',
              mpc_mechanism_type_name: 'Cash in Envelope'
            },{
  						mpc_delivery_type_id: 'cash',
  						mpc_mechanism_type_id: 'bank',
              mpc_mechanism_type_name: 'Bank'
            },{
  						mpc_delivery_type_id: 'cash',
  						mpc_mechanism_type_id: 'mobile_cash',
              mpc_mechanism_type_name: 'Mobile Cash'
            },{
  						mpc_delivery_type_id: 'cash',
  						mpc_mechanism_type_id: 'e_cash',
              mpc_mechanism_type_name: 'Electronic Card - Cash'
            },{
  						mpc_delivery_type_id: 'voucher',
              mpc_mechanism_type_id: 'paper_vouchers',
              mpc_mechanism_type_name: 'Paper Vouchers'
            },{
  						mpc_delivery_type_id: 'voucher',
              mpc_mechanism_type_id: 'mobile_vouchers',
              mpc_mechanism_type_name: 'Mobile Vouchers'
            },{
  						mpc_delivery_type_id: 'voucher',
              mpc_mechanism_type_id: 'e_vouchers',
              mpc_mechanism_type_name: 'Electronic Card - Vouchers'
            },{
  						mpc_delivery_type_id: 'distribution',
              mpc_mechanism_type_id: 'distribution',
              mpc_mechanism_type_name: 'Distribution'
  					}
  				];
        };

        return types

			},

      // get list
      getTransfers: function( length ){
        var trasnfers = [];
        for( var i=1; i<=length; i++ ){
          trasnfers.push({
            transfer_type_id: i,
            transfer_type_value: i
          })
        }
        return trasnfers;
      },



      // clusters
      getClusters: function( admin0pcode ){
        var clusters = [];

        if( admin0pcode.toLowerCase() === 'all' ){

          clusters = [{
            cluster_id: 'acbar',
            cluster: 'ACBAR',
            registration: false
          },{
            cluster_id: 'agriculture',
            cluster: 'Agriculture'
          },{
            cluster_id: 'education',
            cluster: 'Education'
          },{
            cluster_id: 'eiewg',
            cluster: 'EiEWG'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'cvwg',
            cluster: 'Multi-Purpose Cash'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        } else if ( admin0pcode.toLowerCase() === 'af' ) {
          clusters = [{
            cluster_id: 'acbar',
            cluster: 'ACBAR',
            registration: false,
            project: false
          },{
            cluster_id: 'eiewg',
            cluster: 'EiEWG'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'cvwg',
            cluster: 'Multi-Purpose Cash'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            registration: false,
            filter: false,
            project: false
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        } else if ( admin0pcode.toLowerCase() === 'cb' ) {
          clusters = [{
            cluster_id: 'cwcwg',
            cluster: 'CwCWG'
          },{
            cluster_id: 'education',
            cluster: 'Education'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fss',
            cluster: 'Food Security'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'smsd',
            cluster: 'Site Management, Site Development and DRR'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          // },{
          //   cluster_id: 'gbv',
          //   cluster: 'GBV'
          // },{
          //   cluster_id: 'child_protection',
          //   cluster: 'Child Protection'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        } else if ( admin0pcode.toLowerCase() === 'ng' ) {
          clusters = [{
            cluster_id: 'agriculture',
            cluster: 'Agriculture'
          },{
            cluster_id: 'education',
            cluster: 'Education'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        }
        else if ( admin0pcode.toLowerCase() === 'col' ) {
          clusters = [{
            cluster_id: 'smsd',
            cluster: 'Site Management and Site development'
          },{
            cluster_id: 'education',
            cluster: 'Educación en Emergencias (EeE)'
          },{
            cluster_id: 'alojamientos_asentamientos',
            cluster: 'Alojamientos/Asentamientos'
          },{
            cluster_id:'san',
            cluster: 'Seguridad Alimentaria y Nutrición (SAN)'
          },{
            cluster_id: 'health',
            cluster: 'Salud'
          },{
            cluster_id: 'recuperacion_temprana',
            cluster: 'Recuperación Temprana'
          },{
            cluster_id: 'protection',
            cluster: 'Protección'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          },/*,
          {
            cluster_id:'n_a',
            cluster: 'N/A'
          },*/
          {
            cluster_id:'ningún_cluster',
            cluster: 'Ningún Cluster'
          },
          {
            cluster_id: 'coordinación_información',
            cluster: 'Coordinación/Información'
          }
          ];
        } else {
          clusters = [{
            cluster_id: 'agriculture',
            cluster: 'Agriculture'
          },{
            cluster_id: 'education',
            cluster: 'Education'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'cvwg',
            cluster: 'Multi-Purpose Cash'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        }


          return clusters;
      },

      // return activity type by cluster
      getActivities: function( project, filterInterCluster, filterDuplicates ){

        // get activities list from storage
        var activities = [],
            activitiesList = angular.copy( ngmLists.getObject( 'lists' ).activitiesList );

        // no intercluster
        if ( !filterInterCluster ) {
          activities = activitiesList;
        }

        // intercluster filters
        if ( filterInterCluster ) {
          activities = $filter( 'filter' )( activitiesList, { cluster_id: project.cluster_id } );
          angular.forEach( project.inter_cluster_activities, function( d, i ){
            activities = activities.concat( $filter( 'filter' )( activitiesList, { cluster_id: d.cluster_id } ) );
          });
        }

        // filter duplications by tag
        if ( filterDuplicates ) {
          activities = ngmClusterLists.filterDuplicates( activitiesList, filterDuplicates );
        }

        // return
        return activities;

      },

      // get activities
      getProjectActivityTypes: function( project ){
        var activity_types = [];
        if ( project && project.activity_type && project.activity_type.length ) {
          activity_types = project.activity_type;
        }
        return activity_types;
      },


      getOrganizations: function(admin0pcode){




        var organizations;

        if(admin0pcode === 'COL' ){

         organizations = $filter('filter')(ngmLists.getObject( 'lists' ).organizationsList,
                 {admin0pcode: 'COL'} , {admin0pcode: 'ALL, COL'},true );

        }else{
          organizations = ngmLists.getObject( 'lists' ).organizationsList
      }



          return organizations;


      },

      getProjectClasifications: function (admin0pcode){

        var projectsclasifications = [];

        if(admin0pcode === 'COL'){

          projectsclasifications = [
          {
            'project_clasification_id':'undaf_desarrollo_paz',
            'project_clasification_name':'UNDAF - Desarrollo y Paz',
            'sidi_id':'4', 
            'children':[
                {
                 'sidi_id':'177',
                 'name_tag':'Transformación de conflictos y cultura de paz',
                 'description':'Colombia ha avanzado hacia la paz reduciendo la violencia, aumentando la resolución pacífica de conflictos y garantizando el derecho a  la justicia',
                 'code':''
                 },
                 {
                   'sidi_id':'178',
                 'name_tag':'Democracia de base local para la garantía de derechos',
                 'description':'Colombia habrá avanzado hacia la paz gracias a la consolidación del Estado Social de Derecho y la gobernabilidad inclusiva, mediante el fortalecimiento de la participación ciudadana, la eficacia de los gobiernos locales y la garantía de los derechos humanos en todo el territorio nacional',
                 'code':''
                 },
                 {
                   'sidi_id':'179',
                 'name_tag':'Transición hacia la paz',
                 'description':'Colombia habrá implementado los acuerdos de fin del conflicto armado  en los ámbitos nacional y territorial',
                 'code':''
                 },
                 {
                   'sidi_id':'180',
                 'name_tag':'Derechos de las víctimas',
                 'description':'Colombia habrá avanzado hacia el restablecimiento sostenible de los derechos de las víctimas del conflicto armado',
                 'code':''
                 },
                 {
                   'sidi_id':'171',
                 'name_tag':'Equidad y movilidad social',
                 'description':'Colombia habrá logrado mayor equidad mediante el avance en los ODS y la reducción sostenible de brechas económicas, sociales y de género',
                 'code':''
                 },
                 {
                   'sidi_id':'172',
                 'name_tag':'Equidad de género',
                 'description':'Colombia habrá avanzado en la disminución de las brechas de género',
                 'code':''
                 },
                  {
                   'sidi_id':'173',
                 'name_tag':'Inclusión y bienestar rural',
                 'description':'Colombia habrá logrado mayor equidad mediante la inclusión social y económica de la población rural',
                 'code':''
                 },
                 {
                   'sidi_id':'174',
                 'name_tag':'Sostenibilidad ambiental',
                 'description':'Colombia habrá logrado mayor resiliencia y sostenibilidad socio-ambiental para hacer frente a los efectos del cambio climático, aprovechar sosteniblemente los recursos naturales y gestionar eficazmente los riesgos de desastre',
                 'code':''
                 },
                 

             ]
          },
          {
            'project_clasification_id':'acuerdos_de_paz',
            'project_clasification_name':'Acuerdos de Paz',
            'sidi_id':'5',
            'children':[

              {
                 'sidi_id':'198',
                 'name_tag':'Fondo de Tierras',
                 'description':'',
                 'code':'1.1.1'
                 },
                 {
                 'sidi_id':'199',
                 'name_tag':'Créditos y subsidios para promover el acceso a la tierra',
                 'description':'',
                 'code':'1.1.2'
                 },
                 {
                 'sidi_id':'200',
                 'name_tag':'Formalización masiva de pequeñas y medianas propiedades rurales',
                 'description':'',
                 'code':'1.1.3'
                 },
                 

            ]
          },
          {
            'project_clasification_id':'dac_oecd_development_assistance_committee',
            'project_clasification_name':'DAC - OECD Development Assistance Committee',
            'sidi_id':'6',
            'children':[
                 {
                 'sidi_id':'240',
                 'name_tag':'Seguridad Alimentaria y Nutrición',
                 'description':'',
                 'code':'1.2.2009'
                 },
                 {
                 'sidi_id':'241',
                 'name_tag':'EDUCACIÓN/Educación, nivel no especificado',
                 'description':'',
                 'code':'1111'
                 },
                {
                 'sidi_id':'242',
                 'name_tag':'EDUCACIÓN/Educación, nivel no especificado/Política educativa y gestión administrativa',
                 'description':'',
                 'code':'11110'
                 },

                  {
                 'sidi_id':'243',
                 'name_tag':'EDUCACIÓN/Educación, nivel no especificado/Servicios e instalaciones educativos y formación',
                 'description':'',
                 'code':'11120'
                 },
                  {
                 'sidi_id':'244',
                 'name_tag':'EDUCACIÓN/Educación, nivel no especificado/Formación de profesores',
                 'description':'',
                 'code':'11130'
                 },
                 {
                 'sidi_id':'245',
                 'name_tag':'EDUCACIÓN/Educación, nivel no especificado/Investigación educativa',
                 'description':'',
                 'code':'11182'
                 },
                 {
                 'sidi_id':'246',
                 'name_tag':'EDUCACIÓN/Educación básica',
                 'description':'',
                 'code':'112'
                 },
                  {
                 'sidi_id':'247',
                 'name_tag':'EDUCACIÓN/Educación básica/Educación primaria',
                 'description':'',
                 'code':'11220'
                 },
                 {
                 'sidi_id':'248',
                 'name_tag':'EDUCACIÓN/Educación básica/Capacitación básica de jóvenes y adultos',
                 'description':'',
                 'code':'11230'
                 },
                 {
                 'sidi_id':'249',
                 'name_tag':'EDUCACIÓN/Educación básica/Capacitación básica de jóvenes y adultos/Habilidades básicas para la vida',
                 'description':'',
                 'code':'11231'
                 },
                 {
                 'sidi_id':'250',
                 'name_tag':'EDUCACIÓN/Educación básica/Capacitación básica de jóvenes/Educación equivalente para adultos',
                 'description':'',
                 'code':'11232'
                 },
                 {
                 'sidi_id':'251',
                 'name_tag':'EDUCACIÓN/Educación básica/Educación primera infancia',
                 'description':'',
                 'code':'11240'
                 },
                 {
                 'sidi_id':'252',
                 'name_tag':'EDUCACIÓN/Educación secundaria',
                 'description':'',
                 'code':'113'
                 },
                 {
                 'sidi_id':'253',
                 'name_tag':'EDUCACIÓN/Educación secundaria/Educación secundaria',
                 'description':'',
                 'code':'11320'
                 },
                 {
                 'sidi_id':'254',
                 'name_tag':'EDUCACIÓN/Educación secundaria/Educación secundaria/Educación secundaria inferior',
                 'description':'',
                 'code':'11321'
                 },
                 {
                 'sidi_id':'255',
                 'name_tag':'EDUCACIÓN/Educación secundaria/Educación secundaria/Educación secundaria superior',
                 'description':'',
                 'code':'11322'
                 },
                 {
                 'sidi_id':'256',
                 'name_tag':'EDUCACIÓN/Educación secundaria/Formación vocacional',
                 'description':'',
                 'code':'11330'
                 },
                 {
                 'sidi_id':'257',
                 'name_tag':'EDUCACIÓN/Educación secundaria/Formación vocacional',
                 'description':'',
                 'code':'114'
                 },
                 {
                 'sidi_id':'258',
                 'name_tag':'EDUCACIÓN/Educación post-secundaria/Educación universitaria',
                 'description':'',
                 'code':'11420'
                 },
                 {
                 'sidi_id':'259',
                 'name_tag':'EDUCACIÓN/Educación post-secundaria/Formación superior técnica y de dirección.',
                 'description':'',
                 'code':'11430'
                 },
                 {
                 'sidi_id':'260',
                 'name_tag':'SALUD/Salud general',
                 'description':'',
                 'code':'121'
                 },
                 {
                 'sidi_id':'261',
                 'name_tag':'SALUD/Salud general/Política sanitaria y gestión administrativa.',
                 'description':'',
                 'code':'12110'
                 },
                 {
                 'sidi_id':'262',
                 'name_tag':'SALUD/Salud general/Enseñanza formación médicas.',
                 'description':'',
                 'code':'12181'
                 },
                  {
                 'sidi_id':'263',
                 'name_tag':'SALUD/Salud general/Investigación médica',
                 'description':'',
                 'code':'12182'
                 },
                 {
                 'sidi_id':'264',
                 'name_tag':'SALUD/Salud general/Servicios médicos',
                 'description':'',
                 'code':'12191'
                 },
                 {
                 'sidi_id':'265',
                 'name_tag':'SALUD/Salud básica',
                 'description':'',
                 'code':'122'
                 },
                 {
                 'sidi_id':'266',
                 'name_tag':'SALUD/Salud básica/Atención sanitaria básica',
                 'description':'',
                 'code':'12220'
                 },
                 {
                 'sidi_id':'267',
                 'name_tag':'SALUD/Salud básica/Infraestructura sanitaria básica',
                 'description':'',
                 'code':'12230'
                 },
                 {
                 'sidi_id':'268',
                 'name_tag':'SALUD/Salud básica/Nutrición básica',
                 'description':'',
                 'code':'12240'
                 },
                 {
                 'sidi_id':'269',
                 'name_tag':'SALUD/Salud básica/Control enfermedades infecciosas',
                 'description':'',
                 'code':'12250'
                 },
                 {
                 'sidi_id':'270',
                 'name_tag':'SALUD/Salud básica/Educación sanitaria',
                 'description':'',
                 'code':'12261'
                 },
                 {
                 'sidi_id':'271',
                 'name_tag':'SALUD/Salud básica/Control de la malaria',
                 'description':'',
                 'code':'12262'
                 },
                 {
                 'sidi_id':'272',
                 'name_tag':'SALUD/Salud básica/Control de la tuberculosis',
                 'description':'',
                 'code':'12263'
                 },
                 {
                 'sidi_id':'273',
                 'name_tag':'SALUD/Salud básica/Formación personal sanitario',
                 'description':'',
                 'code':'12281'
                 },
                 {
                 'sidi_id':'274',
                 'name_tag':'PROGRAMAS - POLÍTICAS SOBRE POBLACIÓN Y SALUD REPRODUCTIVA',
                 'description':'',
                 'code':'130'
                 },
                 {
                 'sidi_id':'275',
                 'name_tag':'PROGRAMAS - POLÍTICAS SOBRE POBLACIÓN Y SALUD REPRODUCTIVA/Política sobre población y gestión admini',
                 'description':'',
                 'code':'13010'
                 },
                 {
                 'sidi_id':'276',
                 'name_tag':'PROGRAMAS - POLÍTICAS SOBRE POBLACIÓN Y SALUD REPRODUCTIVA/Atención salud reproductiva',
                 'description':'',
                 'code':'13020'
                 },
                  {
                 'sidi_id':'277',
                 'name_tag':'PROGRAMAS - POLÍTICAS SOBRE POBLACIÓN Y SALUD REPRODUCTIVA/Planificación familiar',
                 'description':'',
                 'code':'13030'
                 },
                  {
                 'sidi_id':'278',
                 'name_tag':'PROGRAMAS - POLÍTICAS SOBRE POBLACIÓN Y SALUD REPRODUCTIVA/Lucha contra ETS (enfermedades de transmi',
                 'description':'',
                 'code':'13040'
                 },
                 {
                 'sidi_id':'279',
                 'name_tag':'PROGRAMAS - POLÍTICAS SOBRE POBLACIÓN Y SALUD REPRODUCTIVA/Formación de personal para población y sa',
                 'description':'',
                 'code':'13081'
                 },
                 {
                 'sidi_id':'280',
                 'name_tag':'AGUA Y SANEAMIENTO',
                 'description':'',
                 'code':'140'
                 },
                 {
                 'sidi_id':'281',
                 'name_tag':'AGUA Y SANEAMIENTO/Política de recursos hídricos y gestión administrativa',
                 'description':'',
                 'code':'14010'
                 },
                 {
                 'sidi_id':'282',
                 'name_tag':'AGUA Y SANEAMIENTO/Protección de recursos hídrico (incluida la recolección)',
                 'description':'',
                 'code':'14015'
                 },
                 {
                 'sidi_id':'283',
                 'name_tag':'AGUA Y SANEAMIENTO/Suministro de agua y saneamiento - Sistemas de envergadura',
                 'description':'',
                 'code':'14020'
                 },
                 {
                 'sidi_id':'284',
                 'name_tag':'AGUA Y SANEAMIENTO/Suministro de agua - Sistemas de envergadura',
                 'description':'',
                 'code':'14021'
                 },
                 {
                 'sidi_id':'285',
                 'name_tag':'AGUA Y SANEAMIENTO/Saneamiento - Sistemas de envergadura',
                 'description':'',
                 'code':'14022'
                 },
                 {
                 'sidi_id':'286',
                 'name_tag':'AGUA Y SANEAMIENTO/Abastecimiento básico de agua potable y saneamiento básico',
                 'description':'',
                 'code':'14030'
                 },
                 {
                 'sidi_id':'287',
                 'name_tag':'AGUA Y SANEAMIENTO/Abastecimiento básico de agua potable',
                 'description':'',
                 'code':'14031'
                 },
                 {
                 'sidi_id':'288',
                 'name_tag':'AGUA Y SANEAMIENTO/Saneamiento básico',
                 'description':'',
                 'code':'14032'
                 },
                 {
                 'sidi_id':'289',
                 'name_tag':'AGUA Y SANEAMIENTO/Desarrollo cuencas fluviales',
                 'description':'',
                 'code':'14040'
                 },
                 {
                 'sidi_id':'290',
                 'name_tag':'AGUA Y SANEAMIENTO/Manejo - eliminación de desechos',
                 'description':'',
                 'code':'14050'
                 },
                 {
                 'sidi_id':'291',
                 'name_tag':'AGUA Y SANEAMIENTO/Educación y formación en abastecimiento de agua y saneamiento',
                 'description':'',
                 'code':'14081'
                 },
                 {
                 'sidi_id':'292',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general',
                 'description':'',
                 'code':'151'
                 },
                 {
                 'sidi_id':'293',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15110'
                 },
                 {
                 'sidi_id':'294',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15121'
                 },
                 {
                 'sidi_id':'295',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15122'
                 },
                 {
                 'sidi_id':'296',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15123'
                 },
                 {
                 'sidi_id':'297',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15124'
                 },
                 {
                 'sidi_id':'298',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15125'
                 },
                 {
                 'sidi_id':'299',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15126'
                 },
                 {
                 'sidi_id':'300',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15127'
                 },
                 {
                 'sidi_id':'301',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15142'
                 },
                  {
                 'sidi_id':'302',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15143'
                 },
                  {
                 'sidi_id':'303',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15144'
                 },
                  {
                 'sidi_id':'304',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Política de administración y gestión de',
                 'description':'',
                 'code':'15154'
                 },
                  {
                 'sidi_id':'305',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Gestión financiera sector público',
                 'description':'',
                 'code':'15111'
                 },
                  {
                 'sidi_id':'306',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Gestión financiera sector público/Plani',
                 'description':'',
                 'code':'15117'
                 },
                 {
                 'sidi_id':'307',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Gestión financiera sector público/Audit',
                 'description':'',
                 'code':'15118'
                 },
                 {
                 'sidi_id':'308',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Gestión financiera sector público/Gesti',
                 'description':'',
                 'code':'15119'
                 },
                 {
                 'sidi_id':'309',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Descentralización y apoyo a los gobiern',
                 'description':'',
                 'code':'15112'
                 },
                 {
                 'sidi_id':'310',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Descentralización y apoyo a los gobiern',
                 'description':'',
                 'code':'15128'
                 },
                 {
                 'sidi_id':'311',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Descentralización y apoyo a los gobiern',
                 'description':'',
                 'code':'15129'
                 },
                 {
                 'sidi_id':'312',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Descentralización y apoyo a los gobiern',
                 'description':'',
                 'code':'15185'
                 },
                 {
                 'sidi_id':'313',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Organizaciones e instituciones anticorr',
                 'description':'',
                 'code':'15113'
                 },
                 {
                 'sidi_id':'314',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Movilización de ingresos nacionales',
                 'description':'',
                 'code':'15114'
                 },
                 {
                 'sidi_id':'315',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Movilización de ingresos nacionales/Rec',
                 'description':'',
                 'code':'15116'
                 },
                  {
                 'sidi_id':'316',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Movilización de ingresos nacionales/Pol',
                 'description':'',
                 'code':'15155'
                 },
                  {
                 'sidi_id':'317',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Movilización de ingresos nacionales/Otr,',
                 'description':'',
                 'code':'15156'
                 },
                 {
                 'sidi_id':'318',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial,',
                 'description':'',
                 'code':'15130'
                 },
                 {
                 'sidi_id':'319',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Política, p',
                 'description':'',
                 'code':'15131'
                 },
                 {
                 'sidi_id':'320',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Policía',
                 'description':'',
                 'code':'15132'
                 },
                 {
                 'sidi_id':'321',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Servicios d',
                 'description':'',
                 'code':'15133'
                 },
                 {
                 'sidi_id':'322',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Asuntos jud',
                 'description':'',
                 'code':'15134'
                 },
                 {
                 'sidi_id':'323',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Defensor de',
                 'description':'',
                 'code':'15135'
                 },
                 {
                 'sidi_id':'324',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Inmigración',
                 'description':'',
                 'code':'15136'
                 },
                 {
                 'sidi_id':'325',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Desarrollo legal y judicial/Prisiones',
                 'description':'',
                 'code':'15137'
                 },
                 {
                 'sidi_id':'326',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Participación democrática y sociedad ci',
                 'description':'',
                 'code':'15138'
                 },
                 {
                 'sidi_id':'327',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Procesos electorales',
                 'description':'',
                 'code':'15151'
                 },
                 {
                 'sidi_id':'328',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Legislaturas y partidos político',
                 'description':'',
                 'code':'15152'
                 },
                  {
                 'sidi_id':'329',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Medios de comunicación y el libre flujo',
                 'description':'',
                 'code':'15153'
                 },
                 {
                 'sidi_id':'330',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Derechos humanos',
                 'description':'',
                 'code':'15160'
                 },
                 {
                 'sidi_id':'331',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Organizaciones e instituciones de la ig',
                 'description':'',
                 'code':'15170'
                 },
                 {
                 'sidi_id':'332',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Gobierno y Sociedad Civil, general/Acabar la violencia contra mujeres y ni',
                 'description':'',
                 'code':'15180'
                 },
                 {
                 'sidi_id':'333',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad',
                 'description':'',
                 'code':'152'
                 },
                 {
                 'sidi_id':'334',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad/Gestión y reforma d',
                 'description':'',
                 'code':'15210'
                 },
                  {
                 'sidi_id':'335',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad/Construcción de la',
                 'description':'',
                 'code':'15220'
                 },
                 {
                 'sidi_id':'336',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad/Participación en op',
                 'description':'',
                 'code':'15230'
                 },
                 {
                 'sidi_id':'337',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad/Control de la proli',
                 'description':'',
                 'code':'15240'
                 },
                 {
                 'sidi_id':'338',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad/Desminado y elimina',
                 'description':'',
                 'code':'15250'
                 },
                  {
                 'sidi_id':'339',
                 'name_tag':'GOBIERNO Y SOCIEDAD CIVIL/Prevención y resolución de conflictos, paz y seguridad/Prevención y desmov',
                 'description':'',
                 'code':'15261'
                 },
                 {
                 'sidi_id':'340',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES',
                 'description':'',
                 'code':'160'
                 },
                 {
                 'sidi_id':'341',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Servicios sociales',
                 'description':'',
                 'code':'16010'
                 },
                 {
                 'sidi_id':'342',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Servicios sociales/Política, planificación y administrac',
                 'description':'',
                 'code':'16011'
                 },
                 {
                 'sidi_id':'343',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Servicios sociales/Seguridad social (sin incluir pension',
                 'description':'',
                 'code':'16012'
                 },
                 {
                 'sidi_id':'344',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Servicios sociales/Pensiones generales',
                 'description':'',
                 'code':'16013'
                 },
                 {
                 'sidi_id':'345',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Servicios sociales/Pensiones del servicio civil',
                 'description':'',
                 'code':'16014'
                 },
                 {
                 'sidi_id':'346',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Servicios sociales/Servicios sociales (incluido el desa',
                 'description':'',
                 'code':'16015'
                 },
                 {
                 'sidi_id':'347',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Política de empleo y gestión administrativa',
                 'description':'',
                 'code':'16020'
                 },
                 {
                 'sidi_id':'348',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Política de vivienda y gestión administrativa',
                 'description':'',
                 'code':'16030'
                 },
                 {
                 'sidi_id':'349',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Viviendas de bajo coste',
                 'description':'',
                 'code':'16040'
                 },
                 {
                 'sidi_id':'350',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Ayuda multisectorial para servicios sociales básicos',
                 'description':'',
                 'code':'16050'
                 },
                 {
                 'sidi_id':'351',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Cultura y recreación',
                 'description':'',
                 'code':'16061'
                 },
                 {
                 'sidi_id':'352',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Cultura y recreación/Recreación y deporte',
                 'description':'',
                 'code':'16065'
                 },
                 {
                 'sidi_id':'353',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Cultura y recreación/Cultura',
                 'description':'',
                 'code':'16066'
                 },
                 {
                 'sidi_id':'354',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Capacitación estadística',
                 'description':'',
                 'code':'16062'
                 },
                 {
                 'sidi_id':'355',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Control estupefacientes',
                 'description':'',
                 'code':'16063'
                 },
                 {
                 'sidi_id':'356',
                 'name_tag':'OTROS SERVICIOS E INFRAESTRUCTURAS SOCIALES/Mitigación social de VIH/SIDA',
                 'description':'',
                 'code':'16064'
                 },
                 {
                 'sidi_id':'357',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO',
                 'description':'',
                 'code':'210'
                 },
                 {
                 'sidi_id':'358',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Política transporte y gestión administrativa',
                 'description':'',
                 'code':'21010'
                 },
                  {
                 'sidi_id':'359',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Política transporte y gestión administrativa/Política de transporte, pla',
                 'description':'',
                 'code':'21011'
                 },
                  {
                 'sidi_id':'360',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Política transporte y gestión administrativa/Servicios de transporte púb',
                 'description':'',
                 'code':'21012'
                 },
                  {
                 'sidi_id':'361',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Política transporte y gestión administrativa/Regulación en transporte',
                 'description':'',
                 'code':'21013'
                 },
                 {
                 'sidi_id':'362',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte por carretera',
                 'description':'',
                 'code':'21020'
                 },
                 {
                 'sidi_id':'363',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte por carretera/Construcción de carreteras alimentadoras',
                 'description':'',
                 'code':'21021'
                 },
                 {
                 'sidi_id':'364',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte por carretera/Mantenimiento de carreteras alimentadoras',
                 'description':'',
                 'code':'21022'
                 },
                 {
                 'sidi_id':'365',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte por carretera/Construcción de carreteras nacionales',
                 'description':'',
                 'code':'21023'
                 },
                 {
                 'sidi_id':'366',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte por carretera/Mantenimiento de carreteras nacionales',
                 'description':'',
                 'code':'21024'
                 },
                 {
                 'sidi_id':'367',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte por ferrocarril',
                 'description':'',
                 'code':'21030'
                 },
                 {
                 'sidi_id':'368',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte marítimo y fluvial',
                 'description':'',
                 'code':'21040'
                 },
                 {
                 'sidi_id':'369',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Transporte aéreo',
                 'description':'',
                 'code':'21050'
                 },
                 {
                 'sidi_id':'370',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Almacenamiento',
                 'description':'',
                 'code':'21061'
                 },
                 {
                 'sidi_id':'371',
                 'name_tag':'TRANSPORTE Y ALMACENAMIENTO/Enseñanza y formación en materia de transporte y almacenamiento',
                 'description':'',
                 'code':'21081'
                 },
                 {
                 'sidi_id':'372',
                 'name_tag':'COMUNICACIONES',
                 'description':'',
                 'code':'220'
                 },
                 {
                 'sidi_id':'373',
                 'name_tag':'COMUNICACIONES/Política de comunicaciones y gestión administrativa',
                 'description':'',
                 'code':'22010'
                 },
                 {
                 'sidi_id':'374',
                 'name_tag':'COMUNICACIONES/Política de comunicaciones y gestión administrativa/Política de comunicaciones, plani',
                 'description':'',
                 'code':'22011'
                 },
                 {
                 'sidi_id':'375',
                 'name_tag':'COMUNICACIONES/Política de comunicaciones y gestión administrativa/Servicio postal',
                 'description':'',
                 'code':'22012'
                 },
                 {
                 'sidi_id':'376',
                 'name_tag':'COMUNICACIONES/Política de comunicaciones y gestión administrativa/Servicios de información',
                 'description':'',
                 'code':'22013'
                 },
                  {
                 'sidi_id':'377',
                 'name_tag':'COMUNICACIONES/Telecomunicaciones',
                 'description':'',
                 'code':'22020'
                 },
                 {
                 'sidi_id':'378',
                 'name_tag':'COMUNICACIONES/Radio, televisión, prensa',
                 'description':'',
                 'code':'22030'
                 },
                 {
                 'sidi_id':'379',
                 'name_tag':'COMUNICACIONES/Tecnología de la información y de las comunicaciones (TIC)',
                 'description':'',
                 'code':'22040'
                 },
                 {
                 'sidi_id':'380',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'231'
                 },
                  {
                 'sidi_id':'381',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'23110'
                 },
                 {
                 'sidi_id':'382',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'23111'
                 },
                  {
                 'sidi_id':'383',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'23112'
                 },
                  {
                 'sidi_id':'384',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'23181'
                 },
                 {
                 'sidi_id':'385',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'23182'
                 },
                 {
                 'sidi_id':'386',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, distribución y eficiencia-ge',
                 'description':'',
                 'code':'23183'
                 },
                 {
                 'sidi_id':'387',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables',
                 'description':'',
                 'code':'232'
                 },
                 {
                 'sidi_id':'388',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Generaci',
                 'description':'',
                 'code':'23210'
                 },
                 {
                 'sidi_id':'389',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Centrales',
                 'description':'',
                 'code':'23220'
                 },
                 {
                 'sidi_id':'390',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Energía s',
                 'description':'',
                 'code':'23230'
                 },
                 {
                 'sidi_id':'391',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Energía e',
                 'description':'',
                 'code':'23240'
                 },
                  {
                 'sidi_id':'392',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Energía m',
                 'description':'',
                 'code':'23250'
                 },
                 {
                 'sidi_id':'393',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Energía g',
                 'description':'',
                 'code':'23260'
                 },
                 {
                 'sidi_id':'394',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes renovables/Centrales',
                 'description':'',
                 'code':'23270'
                 },
                 {
                 'sidi_id':'395',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables',
                 'description':'',
                 'code':'233'
                 },
                 {
                 'sidi_id':'396',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables/Genera',
                 'description':'',
                 'code':'233310'
                 },
                 {
                 'sidi_id':'397',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables/Centra',
                 'description':'',
                 'code':'233320'
                 },
                 {
                 'sidi_id':'398',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables/Centra',
                 'description':'',
                 'code':'233330'
                 },
                 {
                 'sidi_id':'399',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables/Centra',
                 'description':'',
                 'code':'233340'
                 },
                 {
                 'sidi_id':'400',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables/Centra',
                 'description':'',
                 'code':'233350'
                 },
                 {
                 'sidi_id':'401',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Generación de energía, fuentes no renovables/Planta',
                 'description':'',
                 'code':'233360'
                 },
                 {
                 'sidi_id':'402',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Plantas de energía eléctrica hibrida',
                 'description':'',
                 'code':'234'
                 },
                 {
                 'sidi_id':'403',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Plantas de energía eléctrica hibrida/Plantas de ene',
                 'description':'',
                 'code':'23410'
                 },
                  {
                 'sidi_id':'404',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Plantas de energía eléctrica nuclear',
                 'description':'',
                 'code':'235'
                 },
                 {
                 'sidi_id':'405',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Plantas de energía eléctrica nuclear/Plantas de ene',
                 'description':'',
                 'code':'23510'
                 },
                 {
                 'sidi_id':'406',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Calefacción, refrigeración y distribución de energí',
                 'description':'',
                 'code':'236'
                 },
                  {
                 'sidi_id':'407',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Calefacción, refrigeración y distribución de energí',
                 'description':'',
                 'code':'23610'
                 },
                 {
                 'sidi_id':'408',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Calefacción, refrigeración y distribución de energí',
                 'description':'',
                 'code':'23620'
                 },
                 {
                 'sidi_id':'409',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Calefacción, refrigeración y distribución de energí',
                 'description':'',
                 'code':'23630'
                 },
                 {
                 'sidi_id':'410',
                 'name_tag':'GENERACIÓN DE ENERGÍA, DISTRIBUCIÓN Y EFICIENCIA/Calefacción, refrigeración y distribución de energí',
                 'description':'',
                 'code':'23640'
                 },
                  {
                 'sidi_id':'411',
                 'name_tag':'SERVICIOS BANCARIOS Y FINANCIEROS',
                 'description':'',
                 'code':'240'
                 },
                 {
                 'sidi_id':'412',
                 'name_tag':'SERVICIOS BANCARIOS Y FINANCIEROS/Política financiera y gestión administrativa',
                 'description':'',
                 'code':'24010'
                 },
                  {
                 'sidi_id':'413',
                 'name_tag':'SERVICIOS BANCARIOS Y FINANCIEROS/Instituciones monetarias',
                 'description':'',
                 'code':'24020'
                 },
                  {
                 'sidi_id':'414',
                 'name_tag':'SERVICIOS BANCARIOS Y FINANCIEROS/Intermediarios financieros del sector formal',
                 'description':'',
                 'code':'24030'
                 },
                 {
                 'sidi_id':'415',
                 'name_tag':'SERVICIOS BANCARIOS Y FINANCIEROS/Intermediarios financieros semi- formales, informales',
                 'description':'',
                 'code':'24040'
                 },
                 {
                 'sidi_id':'416',
                 'name_tag':'SERVICIOS BANCARIOS Y FINANCIEROS/Enseñanza-formación en banca y servicios financieros',
                 'description':'',
                 'code':'24081'
                 },
                  {
                 'sidi_id':'417',
                 'name_tag':'EMPRESAS Y OTROS SERVICIOS',
                 'description':'',
                 'code':'250'
                 },
                  {
                 'sidi_id':'418',
                 'name_tag':'EMPRESAS Y OTROS SERVICIOS/Servicios e instituciones de apoyo a la empresa',
                 'description':'',
                 'code':'25010'
                 },
                 {
                 'sidi_id':'419',
                 'name_tag':'EMPRESAS Y OTROS SERVICIOS/Privatizaciones',
                 'description':'',
                 'code':'25020'
                 },
                 {
                 'sidi_id':'420',
                 'name_tag':'AGRICULTURA',
                 'description':'',
                 'code':'311'
                 },
                  {
                 'sidi_id':'421',
                 'name_tag':'AGRICULTURA/Política agraria y gestión administrativa',
                 'description':'',
                 'code':'31110'
                 },
                 {
                 'sidi_id':'422',
                 'name_tag':'AGRICULTURA/Desarrollo agrario',
                 'description':'',
                 'code':'31120'
                 },
                 {
                 'sidi_id':'423',
                 'name_tag':'AGRICULTURA/Recursos terrestres para uso agrícola',
                 'description':'',
                 'code':'31130'
                 },
                 {
                 'sidi_id':'424',
                 'name_tag':'AGRICULTURA/Recursos hídricos para uso agrícola',
                 'description':'',
                 'code':'31140'
                 },
                 {
                 'sidi_id':'425',
                 'name_tag':'AGRICULTURA/Insumos agrícolas',
                 'description':'',
                 'code':'31150'
                 },
                 {
                 'sidi_id':'426',
                 'name_tag':'AGRICULTURA/Producción alimentos agrícolas',
                 'description':'',
                 'code':'31161'
                 },
                 {
                 'sidi_id':'427',
                 'name_tag':'AGRICULTURA/Cultivos industriales o para la exportación',
                 'description':'',
                 'code':'31162'
                 },
                 {
                 'sidi_id':'428',
                 'name_tag':'AGRICULTURA/Ganadería',
                 'description':'',
                 'code':'31163'
                 },
                 {
                 'sidi_id':'429',
                 'name_tag':'AGRICULTURA/Reforma agraria',
                 'description':'',
                 'code':'31164'
                 },
                 {
                 'sidi_id':'430',
                 'name_tag':'AGRICULTURA/Desarrollo agrario alternativo',
                 'description':'',
                 'code':'31165'
                 },
                 {
                 'sidi_id':'431',
                 'name_tag':'AGRICULTURA/Formación no académica en agricultura',
                 'description':'',
                 'code':'31166'
                 },
                 {
                 'sidi_id':'432',
                 'name_tag':'AGRICULTURA/Enseñanza-formación agraria',
                 'description':'',
                 'code':'31181'
                 },
                 {
                 'sidi_id':'433',
                 'name_tag':'AGRICULTURA/Investigación agraria',
                 'description':'',
                 'code':'31182'
                 },
                 {
                 'sidi_id':'434',
                 'name_tag':'AGRICULTURA/Servicios agrícolas',
                 'description':'',
                 'code':'31191'
                 },
                 {
                 'sidi_id':'435',
                 'name_tag':'AGRICULTURA/Protección plantas y poscosecha, y lucha contra plagas',
                 'description':'',
                 'code':'31192'
                 },
                 {
                 'sidi_id':'436',
                 'name_tag':'AGRICULTURA/Servicios financieros agrícolas',
                 'description':'',
                 'code':'31193'
                 },
                 {
                 'sidi_id':'437',
                 'name_tag':'AGRICULTURA/Cooperativas agrícolas',
                 'description':'',
                 'code':'31194'
                 },
                 {
                 'sidi_id':'438',
                 'name_tag':'AGRICULTURA/Servicios veterinarios',
                 'description':'',
                 'code':'31195'
                 },
                 {
                 'sidi_id':'439',
                 'name_tag':'SILVICULTURA',
                 'description':'',
                 'code':'312'
                 },
                 {
                 'sidi_id':'440',
                 'name_tag':'SILVICULTURA/Política forestal y gestión administrativa',
                 'description':'',
                 'code':'31210'
                 },
                 {
                 'sidi_id':'441',
                 'name_tag':'SILVICULTURA/Desarrollo forestal',
                 'description':'',
                 'code':'31220'
                 },
                 {
                 'sidi_id':'442',
                 'name_tag':'SILVICULTURA/Producción carbón vegetal o leña',
                 'description':'',
                 'code':'31261'
                 },
                 {
                 'sidi_id':'443',
                 'name_tag':'SILVICULTURA/Educación, formación forestal',
                 'description':'',
                 'code':'31281'
                 },
                 {
                 'sidi_id':'444',
                 'name_tag':'SILVICULTURA/Investigación en silvicultura',
                 'description':'',
                 'code':'31282'
                 },
                  {
                 'sidi_id':'445',
                 'name_tag':'SILVICULTURA/Servicios forestales',
                 'description':'',
                 'code':'31283'
                 },
                  {
                 'sidi_id':'446',
                 'name_tag':'PESCA',
                 'description':'',
                 'code':'313'
                 },
                  {
                 'sidi_id':'447',
                 'name_tag':'PESCA/Política pesquera y gestión administrativa',
                 'description':'',
                 'code':'31310'
                 },
                 {
                 'sidi_id':'448',
                 'name_tag':'PESCA/Desarrollo pesquero',
                 'description':'',
                 'code':'31320'
                 },
                  {
                 'sidi_id':'449',
                 'name_tag':'PESCA/Educación, formación pesquera',
                 'description':'',
                 'code':'31381'
                 },
                 {
                 'sidi_id':'450',
                 'name_tag':'PESCA/Investigación pesquera',
                 'description':'',
                 'code':'31382'
                 },
                 
                 {
                 'sidi_id':'452',
                 'name_tag':'INDUSTRIA',
                 'description':'',
                 'code':'321'
                 },
                  {
                 'sidi_id':'453',
                 'name_tag':'INDUSTRIA/Política industrial y gestión administrativa',
                 'description':'',
                 'code':'32110'
                 },
                 {
                 'sidi_id':'454',
                 'name_tag':'INDUSTRIA/Desarrollo industrial',
                 'description':'',
                 'code':'32120'
                 },
                 {
                 'sidi_id':'455',
                 'name_tag':'INDUSTRIA/Desarrollo PYME',
                 'description':'',
                 'code':'32130'
                 },
                 {
                 'sidi_id':'456',
                 'name_tag':'INDUSTRIA/Industria artesanal',
                 'description':'',
                 'code':'32140'
                 },
                 {
                 'sidi_id':'457',
                 'name_tag':'INDUSTRIA/Agroindustrias',
                 'description':'',
                 'code':'32161'
                 },
                 {
                 'sidi_id':'458',
                 'name_tag':'INDUSTRIA/Industrias forestales',
                 'description':'',
                 'code':'32162'
                 },
                 {
                 'sidi_id':'459',
                 'name_tag':'INDUSTRIA/Textiles, cuero y sustitutos',
                 'description':'',
                 'code':'32163'
                 },
                 {
                 'sidi_id':'460',
                 'name_tag':'INDUSTRIA/Productos químicos',
                 'description':'',
                 'code':'32164'
                 },
                 {
                 'sidi_id':'461',
                 'name_tag':'INDUSTRIA/Plantas de producción de fertilizantes',
                 'description':'',
                 'code':'32165'
                 },
                  {
                 'sidi_id':'462',
                 'name_tag':'INDUSTRIA/Cemento, cal, yeso',
                 'description':'',
                 'code':'32166'
                 },
                 {
                 'sidi_id':'463',
                 'name_tag':'INDUSTRIA/Fabricación productos energéticos',
                 'description':'',
                 'code':'32167'
                 },
                 {
                 'sidi_id':'464',
                 'name_tag':'INDUSTRIA/Producción farmacéutica',
                 'description':'',
                 'code':'32168'
                 },
                  {
                 'sidi_id':'465',
                 'name_tag':'INDUSTRIA/Industria metalúrgica básica',
                 'description':'',
                 'code':'32169'
                 },
                 {
                 'sidi_id':'466',
                 'name_tag':'INDUSTRIA/Industrias metales no ferrosos',
                 'description':'',
                 'code':'32170'
                 },
                 {
                 'sidi_id':'467',
                 'name_tag':'INDUSTRIA/Construcción mecánica y eléctrica',
                 'description':'',
                 'code':'32171'
                 },
                 {
                 'sidi_id':'468',
                 'name_tag':'INDUSTRIA/Industria de equipos de transporte',
                 'description':'',
                 'code':'32172'
                 },
                 {
                 'sidi_id':'469',
                 'name_tag':'INDUSTRIA/Investigación y desarrollo tecnológico',
                 'description':'',
                 'code':'32182'
                 },
                  {
                 'sidi_id':'470',
                 'name_tag':'RECURSOS MINERALES Y MINERIA',
                 'description':'',
                 'code':'322'
                 },
                  {
                 'sidi_id':'471',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Política de las industrias extractivas y gestión administrativa',
                 'description':'',
                 'code':'32210'
                 },
                 {
                 'sidi_id':'472',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Prospección y exploración minera',
                 'description':'',
                 'code':'32220'
                 },
                  {
                 'sidi_id':'473',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Carbón',
                 'description':'',
                 'code':'32261'
                 },
                  {
                 'sidi_id':'474',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Petróleo y gas',
                 'description':'',
                 'code':'32262'
                 },
                  {
                 'sidi_id':'475',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Metales ferrosos',
                 'description':'',
                 'code':'32263'
                 },
                 {
                 'sidi_id':'476',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Metales no ferrosos',
                 'description':'',
                 'code':'32264'
                 },
                 {
                 'sidi_id':'477',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Metales-minerales preciosos',
                 'description':'',
                 'code':'32265'
                 },
                 {
                 'sidi_id':'478',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Minerales industriales',
                 'description':'',
                 'code':'32266'
                 },
                 {
                 'sidi_id':'479',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Fertilizantes minerales',
                 'description':'',
                 'code':'32267'
                 },
                 {
                 'sidi_id':'480',
                 'name_tag':'RECURSOS MINERALES Y MINERIA/Recursos minerales fondos marinos',
                 'description':'',
                 'code':'32268'
                 },
                  {
                 'sidi_id':'481',
                 'name_tag':'CONSTRUCCIÓN',
                 'description':'',
                 'code':'323'
                 }, 
                 {
                 'sidi_id':'482',
                 'name_tag':'CONSTRUCCIÓN/Política de construcción y gestión administrativa',
                 'description':'',
                 'code':'32310'
                 }, 
                 {
                 'sidi_id':'483',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL',
                 'description':'',
                 'code':'331'
                 }, 
                 {
                 'sidi_id':'484',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL/Política comercial y gestión administrativa',
                 'description':'',
                 'code':'33110'
                 }, 
                 {
                 'sidi_id':'485',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL/Fomento del comercio',
                 'description':'',
                 'code':'33120'
                 }, 
                 {
                 'sidi_id':'486',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL/Acuerdos comerciales regionales',
                 'description':'',
                 'code':'33130'
                 }, 
                 {
                 'sidi_id':'487',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL/Negociaciones comerciales multilaterales',
                 'description':'',
                 'code':'33140'
                 }, 
                 {
                 'sidi_id':'488',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL/Ajustes vinculados al comercio',
                 'description':'',
                 'code':'33150'
                 }, 
                 {
                 'sidi_id':'489',
                 'name_tag':'POLÍTICA Y REGULACIÓN COMERCIAL/Educación-formación comercial',
                 'description':'',
                 'code':'33181'
                 },
                 {
                 'sidi_id':'490',
                 'name_tag':'TURISMO',
                 'description':'',
                 'code':'332'
                 },
                  {
                 'sidi_id':'491',
                 'name_tag':'TURISMO/Política turística y gestión administrativa',
                 'description':'',
                 'code':'33210'
                 },
                  {
                 'sidi_id':'492',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE',
                 'description':'',
                 'code':'410'
                 },
                  {
                 'sidi_id':'493',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Política medioambiental y gestión administrativa',
                 'description':'',
                 'code':'41010'
                 },
                 {
                 'sidi_id':'494',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Protección de la biosfera',
                 'description':'',
                 'code':'41020'
                 },
                 {
                 'sidi_id':'495',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Biodiversidad',
                 'description':'',
                 'code':'41030'
                 },
                  {
                 'sidi_id':'496',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Protección del patrimonio',
                 'description':'',
                 'code':'41040'
                 },
                  {
                 'sidi_id':'497',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Control y prevención de inundaciones',
                 'description':'',
                 'code':'41050'
                 },
                 {
                 'sidi_id':'498',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Educación, formación medioambiental',
                 'description':'',
                 'code':'41081'
                 },
                 {
                 'sidi_id':'499',
                 'name_tag':'PROTECCION GENERAL DEL MEDIO AMBIENTE/Investigación medioambiental',
                 'description':'',
                 'code':'41082'
                 },
                 {
                 'sidi_id':'500',
                 'name_tag':'OTROS MULTISECTORIAL',
                 'description':'',
                 'code':'430'
                 },
                  {
                 'sidi_id':'501',
                 'name_tag':'OTROS MULTISECTORIAL/Ayuda multisectorial',
                 'description':'',
                 'code':'43010'
                 },
                  {
                 'sidi_id':'502',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo y gestión urbanos',
                 'description':'',
                 'code':'43030'
                 },
                 {
                 'sidi_id':'503',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo y gestión urbana/Política y gestión de tierras urbanas',
                 'description':'',
                 'code':'43031'
                 },
                 {
                 'sidi_id':'504',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo y gestión urbanos/Desarrollo urbano',
                 'description':'',
                 'code':'43032'
                 },
                  {
                 'sidi_id':'505',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo rural',
                 'description':'',
                 'code':'43040'
                 },
                 {
                 'sidi_id':'506',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo rural/Política de gestión de tierras rurales',
                 'description':'',
                 'code':'43041'
                 },
                  {
                 'sidi_id':'507',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo rural/Desarrollo rural',
                 'description':'',
                 'code':'43042'
                 },
                  {
                 'sidi_id':'508',
                 'name_tag':'OTROS MULTISECTORIAL/Desarrollo alternativo no agrario',
                 'description':'',
                 'code':'43050'
                 },
                  {
                 'sidi_id':'509',
                 'name_tag':'OTROS MULTISECTORIAL/Enseñanza, formación multisectorial',
                 'description':'',
                 'code':'43051'
                 },
                 {
                 'sidi_id':'510',
                 'name_tag':'OTROS MULTISECTORIAL/Instituciones científicas y de investigación',
                 'description':'',
                 'code':'43082'
                 },
                 {
                 'sidi_id':'511',
                 'name_tag':'APOYO PRESUPUESTARIO GENERAL',
                 'description':'',
                 'code':'510'
                 },
                 {
                 'sidi_id':'512',
                 'name_tag':'APOYO PRESUPUESTARIO GENERAL/Ayuda relacionada con el apoyo presupuestario general',
                 'description':'',
                 'code':'51010'
                 },
                 {
                 'sidi_id':'513',
                 'name_tag':'AYUDA ALIMENTARIA PAR EL DESARROLLO-ASISTENCIA DE SEGURIDAD ALIMENTARIA',
                 'description':'',
                 'code':'520'
                 },
                 {
                 'sidi_id':'514',
                 'name_tag':'AYUDA ALIMENTARIA PAR EL DESARROLLO-ASISTENCIA DE SEGURIDAD ALIMENTARIA/Ayuda alimentaria-Programas',
                 'description':'',
                 'code':'52010'
                 },
                 {
                 'sidi_id':'515',
                 'name_tag':'OTRAS AYUDAS EN FORMA DE SUMINISTRO DE BIENES',
                 'description':'',
                 'code':'530'
                 },
                 {
                 'sidi_id':'516',
                 'name_tag':'OTRAS AYUDAS EN FORMA DE SUMINISTRO DE BIENES/Apoyo importación (bienes de equipo)',
                 'description':'',
                 'code':'53030'
                 },
                  {
                 'sidi_id':'517',
                 'name_tag':'OTRAS AYUDAS EN FORMA DE SUMINISTRO DE BIENES/Apoyo importación (productos)',
                 'description':'',
                 'code':'53040'
                 },
                 {
                 'sidi_id':'518',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA',
                 'description':'',
                 'code':'600'
                 },
                 {
                 'sidi_id':'519',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Actividades relacionadas con la deuda',
                 'description':'',
                 'code':'60010'
                 },
                 {
                 'sidi_id':'520',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Condonación de la deuda',
                 'description':'',
                 'code':'60020'
                 },
                 {
                 'sidi_id':'521',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Alivio de la deuda multilateral',
                 'description':'',
                 'code':'60030'
                 },
                 {
                 'sidi_id':'522',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Reestructuración y refinanciación',
                 'description':'',
                 'code':'60040'
                 },
                 {
                 'sidi_id':'523',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Canje de deuda por desarrollo',
                 'description':'',
                 'code':'60061'
                 },
                 {
                 'sidi_id':'524',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Otros tipos de canje de deuda',
                 'description':'',
                 'code':'60062'
                 },
                 {
                 'sidi_id':'525',
                 'name_tag':'ACTIVIDADES RELACIONADAS CON LA DEUDA/Recompra de deuda',
                 'description':'',
                 'code':'60063'
                 },
                 {
                 'sidi_id':'526',
                 'name_tag':'AYUDAS DE EMERGENCIA',
                 'description':'',
                 'code':'720'
                 },
                 {
                 'sidi_id':'527',
                 'name_tag':'AYUDAS DE EMERGENCIA/Ayuda y servicios materiales de emergencia',
                 'description':'',
                 'code':'72010'
                 },
                  {
                 'sidi_id':'528',
                 'name_tag':'AYUDAS DE EMERGENCIA/Ayuda alimentaria de emergencia',
                 'description':'',
                 'code':'72040'
                 },
                 {
                 'sidi_id':'529',
                 'name_tag':'AYUDAS DE EMERGENCIA/Coordinación humanitaria, protección y servicios de apoyo',
                 'description':'',
                 'code':'72050'
                 },
                 {
                 'sidi_id':'530',
                 'name_tag':'AYUDA A LA RECONSTRUCCIÓN Y REHABILITACIÓN',
                 'description':'',
                 'code':'730'
                 },
                 {
                 'sidi_id':'531',
                 'name_tag':'AYUDA A LA RECONSTRUCCIÓN Y REHABILITACIÓN/Ayuda a la reconstrucción y rehabilitación',
                 'description':'',
                 'code':'73010'
                 },
                 {
                 'sidi_id':'532',
                 'name_tag':'PREVENCIÓN DE DESASTRES',
                 'description':'',
                 'code':'740'
                 },
                 {
                 'sidi_id':'533',
                 'name_tag':'PREVENCIÓN DE DESASTRES/Prevención de desastres',
                 'description':'',
                 'code':'74010'
                 },
                 {
                 'sidi_id':'534',
                 'name_tag':'COSTES ADMINISTRATIVOS DONANTES',
                 'description':'',
                 'code':'910'
                 },
                 {
                 'sidi_id':'535',
                 'name_tag':'COSTES ADMINISTRATIVOS DONANTES/Costos administrativos(no asignables)',
                 'description':'',
                 'code':'91010'
                 },
                 {
                 'sidi_id':'536',
                 'name_tag':'AYUDA A REFUGIADOS EN EL PAIS DONANTE',
                 'description':'',
                 'code':'930'
                 },
                 {
                 'sidi_id':'537',
                 'name_tag':'AYUDA A REFUGIADOS EN EL PAÍS DONANTE/Ayuda a refugiados en el país donante (no asignable por sector',
                 'description':'',
                 'code':'93010'
                 },
                 {
                 'sidi_id':'538',
                 'name_tag':'SIN ASIGNAR-SIN ESPECIFICAR',
                 'description':'',
                 'code':'998'
                 },
                 {
                 'sidi_id':'539',
                 'name_tag':'SIN ASIGNAR-SIN ESPECIFICAR/Sectores no especificados',
                 'description':'',
                 'code':'99810'
                 },
                 {
                 'sidi_id':'540',
                 'name_tag':'SIN ASIGNAR-SIN ESPECIFICAR/Sensibilización sobre los problemas relacionados con el desarrollo (no a',
                 'description':'',
                 'code':'99820'
                 },

                 

            ]
          },
          {
            'project_clasification_id':'ods_objetivos_de_desarrollo_sostenible',
            'project_clasification_name':'ODS - Objetivos de Desarrollo Sostenible',
            'sidi_id':'7',
            'children':[
              {
                  'sidi_id':'541',
                     'name_tag':'Fin de la Pobreza',
                     'description':'',
                     'code':'1'

                },
                {
                  'sidi_id':'542',
                     'name_tag':'De aquí a 2030, erradicar para todas las personas y en todo el mundo la pobreza extrema(actualmente ',
                     'description':'',
                     'code':'1.1'

                },
                 {
                  'sidi_id':'543',
                     'name_tag':'De aquí a 2030, reducir al menos a la mitad la proporción de hombres, mujeres y niños de todas las e',
                     'description':'',
                     'code':'1.2'

                }
                ,
                 {
                  'sidi_id':'544',
                     'name_tag':'Implementar a nivel nacional sistemas y medidas apropiados de protección social para todos, incluido',
                     'description':'',
                     'code':'1.3'

                },
                {
                  'sidi_id':'545',
                     'name_tag':'Implementar a nivel nacional sistemas y medidas apropiados de protección social para todos, incluido',
                     'description':'',
                     'code':'1.4'

                },
                {
                  'sidi_id':'546',
                     'name_tag':'De aquí a 2030, fomentar la resiliencia de los pobres y las personas que se encuentran en situacione',
                     'description':'',
                     'code':'1.5'

                },
                {
                  'sidi_id':'547',
                     'name_tag':'Garantizar una movilización significativa de recursos procedentes de diversas fuentes, incluso media',
                     'description':'',
                     'code':'1.a'
                },
                {
                  'sidi_id':'548',
                     'name_tag':'Crear marcos normativos sólidos en los planos nacional, regional e internacional, sobre la base de e',
                     'description':'',
                     'code':'1.b'
                },
                {
                  'sidi_id':'549',
                     'name_tag':'Hambre Cero',
                     'description':'',
                     'code':'2'
                },
                {
                  'sidi_id':'550',
                     'name_tag':'Para 2030 erradicar el hambre y asegurar el acceso de todas las personas, en particular de los pobre',
                     'description':'',
                     'code':'2.1'
                },
                {
                  'sidi_id':'551',
                     'name_tag':'De aquí a 2030, poner fin a todas las formas de malnutrición, incluso logrando, a más tardar en 2025',
                     'description':'',
                     'code':'2.2'
                },
                {
                  'sidi_id':'552',
                     'name_tag':'De aquí a 2030, duplicar la productividad agrícola y los ingresos de los productores de alimentos en',
                     'description':'',
                     'code':'2.3'
                },
                {
                  'sidi_id':'553',
                     'name_tag':'De aquí a 2030, asegurar la sostenibilidad de los sistemas de producción de alimentos y aplicar prác',
                     'description':'',
                     'code':'2.4'
                },
                {
                  'sidi_id':'554',
                     'name_tag':'De aquí a 2020, mantener la diversidad genética de las semillas, las plantas cultivadas y los animal',
                     'description':'',
                     'code':'2.5'
                },
                {
                  'sidi_id':'555',
                     'name_tag':'Aumentar, incluso mediante una mayor cooperación internacional, las inversiones en infraestructura r',
                     'description':'',
                     'code':'2.a'
                },
                {
                  'sidi_id':'556',
                     'name_tag':'Corregir y prevenir las restricciones y distorsiones comerciales en los mercados agropecuarios mundi',
                     'description':'',
                     'code':'2.b'
                },
                {
                  'sidi_id':'557',
                     'name_tag':'Adoptar medidas para asegurar el buen funcionamiento de los mercados de productos básicos alimentari',
                     'description':'',
                     'code':'2.c'
                },
                {
                  'sidi_id':'558',
                     'name_tag':'Salud y Bienestar',
                     'description':'',
                     'code':'3'
                },
                {
                  'sidi_id':'559',
                     'name_tag':'De aquí a 2030, reducir la tasa mundial de mortalidad materna a menos de 70 por cada 100.000 nacidos',
                     'description':'',
                     'code':'3.1'
                },
                {
                  'sidi_id':'560',
                     'name_tag':'De aquí a 2030, poner fin a las muertes evitables de recién nacidos y de niños menores de 5 años, lo',
                     'description':'',
                     'code':'3.2'
                },
                {
                  'sidi_id':'561',
                     'name_tag':'De aquí a 2030, poner fin a las epidemias del SIDA, la tuberculosis, la malaria y las enfermedades t',
                     'description':'',
                     'code':'3.3'
                },
                {
                  'sidi_id':'562',
                     'name_tag':'De aquí a 2030, reducir en un tercio la mortalidad prematura por enfermedades no transmisibles media',
                     'description':'',
                     'code':'3.4'
                },
                {
                  'sidi_id':'563',
                     'name_tag':'Fortalecer la prevención y el tratamiento del abuso de sustancias adictivas, incluido el uso indebid',
                     'description':'',
                     'code':'3.5'
                },
                {
                  'sidi_id':'564',
                     'name_tag':'De aquí a 2020, reducir a la mitad el número de muertes y lesiones causadas por accidentes de tráfic',
                     'description':'',
                     'code':'3.6'
                },
                {
                  'sidi_id':'565',
                     'name_tag':'De aquí a 2030, garantizar el acceso universal a los servicios de salud sexual y reproductiva, inclu',
                     'description':'',
                     'code':'3.7'
                },
                {
                  'sidi_id':'566',
                     'name_tag':'Lograr la cobertura sanitaria universal, incluida la protección contra los riesgos financieros, el a',
                     'description':'',
                     'code':'3.8'
                },
                {
                  'sidi_id':'567',
                     'name_tag':'De aquí a 2030, reducir considerablemente el número de muertes y enfermedades causadas por productos',
                     'description':'',
                     'code':'3.9'
                },
                {
                  'sidi_id':'568',
                     'name_tag':'Fortalecer la aplicación del Convenio Marco de la Organización Mundial de la Salud para el Control d',
                     'description':'',
                     'code':'3.a'
                },
                {
                  'sidi_id':'569',
                     'name_tag':'Apoyar las actividades de investigación y desarrollo de vacunas y medicamentos contra las enfermedad',
                     'description':'',
                     'code':'3.b'
                },
                {
                  'sidi_id':'570',
                     'name_tag':'Aumentar considerablemente la financiación de la salud y la contratación, el perfeccionamiento, la c',
                     'description':'',
                     'code':'3.c'
                },
                {
                  'sidi_id':'571',
                     'name_tag':'Reforzar la capacidad de todos los países, en particular los países en desarrollo, en materia de ale',
                     'description':'',
                     'code':'3.d'
                },
                {
                  'sidi_id':'572',
                     'name_tag':'Educación de Calidad',
                     'description':'',
                     'code':'4'
                },
                {
                  'sidi_id':'573',
                     'name_tag':'Para 2030, asegurar que todos los niños y niñas completen la educación primaria y secundaria gratuit',
                     'description':'',
                     'code':'4.1'
                },
                {
                  'sidi_id':'574',
                     'name_tag':'Para 2030 garantizar que todas las niñas y los niños tengan acceso a un desarrollo de calidad en la',
                     'description':'',
                     'code':'4.2'
                },
                {
                  'sidi_id':'575',
                     'name_tag':'En 2030 garantizar la igualdad de acceso de todas las mujeres y hombres a la educación técnica, prof',
                     'description':'',
                     'code':'4.3'
                },
                {
                  'sidi_id':'576',
                     'name_tag':'Para 2030, aumentar en un x% el número de jóvenes y adultos con habilidades relevantes incluidas las',
                     'description':'',
                     'code':'4.4'
                },
                {
                  'sidi_id':'577',
                     'name_tag':'En 2030, eliminar las disparidades de género en la educación y garantizar la igualdad de acceso a to',
                     'description':'',
                     'code':'4.5'
                },
                {
                  'sidi_id':'578',
                     'name_tag':'En 2030 asegurar que todos los jóvenes y al menos x% de los adultos, tanto hombres como mujeres, log',
                     'description':'',
                     'code':'4.6'
                },
                {
                  'sidi_id':'579',
                     'name_tag':'En 2030 asegurar que todos los alumnos adquieran el conocimiento y las habilidades necesarias para p',
                     'description':'',
                     'code':'4.7'
                },
                {
                  'sidi_id':'580',
                     'name_tag':'Construir y mejorar las instalaciones educativas para hacerlas sensibles a los niños, las personas c',
                     'description':'',
                     'code':'4.a'
                },
                {
                  'sidi_id':'581',
                     'name_tag':'En 2020 expandir a nivel mundial en un x% el número de becas para los países en desarrollo, en parti',
                     'description':'',
                     'code':'4.b'
                },
                {
                  'sidi_id':'582',
                     'name_tag':'En 2030 aumentar un x% la oferta de docentes calificados, en particular mediante la cooperación inte',
                     'description':'',
                     'code':'4.c'
                },
                {
                  'sidi_id':'583',
                     'name_tag':'Igualdad de Género',
                     'description':'',
                     'code':'5'
                },
                {
                  'sidi_id':'584',
                     'name_tag':'Acabar todas las formas de discriminación contra todas las mujeres y niñas en todas partes.',
                     'description':'',
                     'code':'5.1'
                },
                {
                  'sidi_id':'585',
                     'name_tag':'Eliminar todas las formas de violencia contra las mujeres y las niñas en las esferas públicas y priv',
                     'description':'',
                     'code':'5.2'
                },
                 {
                  'sidi_id':'586',
                     'name_tag':'Eliminar todas las prácticas perjudiciales, como los matrimonios precoces y forzados y la mutilación',
                     'description':'',
                     'code':'5.3'
                },
                 {
                  'sidi_id':'587',
                     'name_tag':'Reconocer y valorar el trabajo doméstico y de cuidado no remunerado a través de la provisión de serv',
                     'description':'',
                     'code':'5.4'
                },
                {
                  'sidi_id':'588',
                     'name_tag':'Garantizar la participación plena y efectiva de las mujeres y la igualdad de oportunidades para el l',
                     'description':'',
                     'code':'5.5'
                },
                {
                  'sidi_id':'589',
                     'name_tag':'Asegurar el acceso universal a la salud sexual y reproductiva y los derechos reproductivos según lo',
                     'description':'',
                     'code':'5.6'
                },
                {
                  'sidi_id':'590',
                     'name_tag':'Emprender reformas para dar a las mujeres la igualdad de derechos a los recursos económicos, así com',
                     'description':'',
                     'code':'5.a'
                },
                {
                  'sidi_id':'591',
                     'name_tag':'Mejorar el uso de tecnologías de apoyo, en particular las TIC, para promover el empoderamiento de la',
                     'description':'',
                     'code':'5.b'
                },
                {
                  'sidi_id':'592',
                     'name_tag':'Adoptar y reforzar políticas sólidas y una legislación aplicable para la promoción de la igualdad de',
                     'description':'',
                     'code':'5.c'
                },
                {
                  'sidi_id':'593',
                     'name_tag':'Agua Límpia y Saneamiento',
                     'description':'',
                     'code':'6'
                },
                {
                  'sidi_id':'594',
                     'name_tag':'En 2030, lograr el acceso universal y equitativo al agua potable segura y asequible para todos',
                     'description':'',
                     'code':'6.1'
                },
                {
                  'sidi_id':'595',
                     'name_tag':'En 2030, lograr el acceso a servicios de saneamiento y de higiene adecuados y equitativos para todos',
                     'description':'',
                     'code':'6.2'
                },
                {
                  'sidi_id':'596',
                     'name_tag':'Para 2030, mejorar la calidad del agua mediante la reducción de la contaminación, la eliminación de',
                     'description':'',
                     'code':'6.3'
                },
                {
                  'sidi_id':'597',
                     'name_tag':'Para 2030, aumentar sustancialmente la eficiencia del uso del agua en todos los sectores y garantiza',
                     'description':'',
                     'code':'6.4'
                },
                {
                  'sidi_id':'598',
                     'name_tag':'En 2030 aplicar la gestión integrada de los recursos hídricos en todos los niveles, incluso mediante',
                     'description':'',
                     'code':'6.5'
                },
                {
                  'sidi_id':'599',
                     'name_tag':'En 2020 a proteger y restaurar los ecosistemas relacionados con el agua, incluyendo montañas, bosque',
                     'description':'',
                     'code':'6.6'
                },
                {
                  'sidi_id':'600',
                     'name_tag':'En 2030, ampliar la cooperación internacional y el apoyo a la creación de capacidades para los paíse',
                     'description':'',
                     'code':'6.a'
                },
                {
                  'sidi_id':'601',
                     'name_tag':'Apoyar y fortalecer la participación de las comunidades locales para mejorar la gestión del agua y e',
                     'description':'',
                     'code':'6.b'
                },
                {
                  'sidi_id':'602',
                     'name_tag':'Energía Asequible y No-contaminante',
                     'description':'',
                     'code':'7'
                },
                {
                  'sidi_id':'603',
                     'name_tag':'En 2030 garantizar el acceso universal a servicios de energía asequibles, confiables y modernos',
                     'description':'',
                     'code':'7.1'
                },
                {
                  'sidi_id':'604',
                     'name_tag':'Aumentar sustancialmente el porcentaje de energías renovables en el mix energético mundial para 2030',
                     'description':'',
                     'code':'7.2'
                },
                {
                  'sidi_id':'605',
                     'name_tag':'Doblar la tasa mundial de mejora de la eficiencia energética de aquí a 2030.',
                     'description':'',
                     'code':'7.3'
                },
                {
                  'sidi_id':'606',
                     'name_tag':'En 2030 aumentar la cooperación internacional para facilitar el acceso a la investigación y tecnolog',
                     'description':'',
                     'code':'7.a'
                },
                {
                  'sidi_id':'607',
                     'name_tag':'En 2030 ampliar la infraestructura y mejorar la tecnología para el suministro de servicios energétic',
                     'description':'',
                     'code':'7.b'
                },
                {
                  'sidi_id':'608',
                     'name_tag':'Trabajo Decente y Crecimiento Económico',
                     'description':'',
                     'code':'8'
                },
                {
                  'sidi_id':'609',
                     'name_tag':'Sostener el crecimiento económico per cápita, de acuerdo con las circunstancias nacionales, y en par',
                     'description':'',
                     'code':'8.1'
                },
                {
                  'sidi_id':'610',
                     'name_tag':'Alcanzar mayores niveles de productividad de las economías a través de la diversificación, el mejora',
                     'description':'',
                     'code':'8.2'
                },
                {
                  'sidi_id':'611',
                     'name_tag':'Promover políticas orientadas al desarrollo para apoyar las actividades productivas, la creación de',
                     'description':'',
                     'code':'8.3'
                },
                {
                  'sidi_id':'612',
                     'name_tag':'Mejorar progresivamente hacia el año 2030 la eficiencia global de los recursos tanto en el consumo c',
                     'description':'',
                     'code':'8.4'
                },
                {
                  'sidi_id':'613',
                     'name_tag':'Para 2030 lograr el empleo pleno y productivo y el trabajo decente para todas las mujeres y hombres,',
                     'description':'',
                     'code':'8.5'
                },
                {
                  'sidi_id':'614',
                     'name_tag':'Para el 2020 reducir sustancialmente la proporción de jóvenes sin empleo, educación o formación.',
                     'description':'',
                     'code':'8.6'
                },
                {
                  'sidi_id':'615',
                     'name_tag':'Adoptar medidas inmediatas y eficaces para conseguir la prohibición y la eliminación de las peores f',
                     'description':'',
                     'code':'8.7'
                },
                {
                  'sidi_id':'616',
                     'name_tag':'Proteger los derechos laborales y promover entornos de trabajo seguros y protegidos para todos los t',
                     'description':'',
                     'code':'8.8'
                },
                {
                  'sidi_id':'617',
                     'name_tag':'Para 2030 diseñar e implementar políticas para promover el turismo sostenible que cree puestos de tr',
                     'description':'',
                     'code':'8.9'
                },
                {
                  'sidi_id':'618',
                     'name_tag':'Fortalecer la capacidad de las instituciones financieras locales para promover la expansión del acce',
                     'description':'',
                     'code':'8.10'
                },
                {
                  'sidi_id':'619',
                     'name_tag':'Aumentar la Ayuda para el Comercio para los países en desarrollo, especialmente los PMA, incluyendo',
                     'description':'',
                     'code':'8.a'
                },
                {
                  'sidi_id':'620',
                     'name_tag':'En 2020 desarrollar y poner en práctica una estrategia global para el empleo de los jóvenes y poner',
                     'description':'',
                     'code':'8.b'
                },
                {
                  'sidi_id':'621',
                     'name_tag':'Industria, Innovación e Infraestructura',
                     'description':'',
                     'code':'9'
                },
                {
                  'sidi_id':'622',
                     'name_tag':'Desarrollar infraestructura de calidad, fiable, sostenible y resistente, incluidas la infraestructur',
                     'description':'',
                     'code':'9.1'
                },
                 {
                  'sidi_id':'623',
                     'name_tag':'Promover la industrialización incluyente y sostenible, y en 2030 aumentar de manera significativa la',
                     'description':'',
                     'code':'9.2'
                },
                {
                  'sidi_id':'624',
                     'name_tag':'Aumentar el acceso de las pequeñas empresas industriales y de otro tipo, en particular en los países',
                     'description':'',
                     'code':'9.3'
                },
                {
                  'sidi_id':'625',
                     'name_tag':'Para 2030 mejorar y actualizar la infraestructura y retroadaptar la industria para hacerlas sostenib',
                     'description':'',
                     'code':'9.4'
                },
                {
                  'sidi_id':'626',
                     'name_tag':'Potenciar la investigación científica, mejorar la capacidad tecnológica de los sectores industriales',
                     'description':'',
                     'code':'9.5'
                },
                {
                  'sidi_id':'627',
                     'name_tag':'Facilitar el desarrollo de infraestructuras sostenibles y resilientes en los países en desarrollo a',
                     'description':'',
                     'code':'9.a'
                },
                {
                  'sidi_id':'628',
                     'name_tag':'Ayudar al desarrollo de la tecnología local, la investigación y la innovación en los países en desar',
                     'description':'',
                     'code':'9.b'
                },
                {
                  'sidi_id':'629',
                     'name_tag':'Aumentar significativamente el acceso a las TIC y luchar por ofrecer acceso universal y asequible a',
                     'description':'',
                     'code':'9.c'
                },
                {
                  'sidi_id':'630',
                     'name_tag':'Reducción de las Desigualdades',
                     'description':'',
                     'code':'10'
                },
                {
                  'sidi_id':'631',
                     'name_tag':'Para 2030 alcanzar progresivamente y mantener el crecimiento de los ingresos del 40% inferior de la',
                     'description':'',
                     'code':'10.1'
                },
                 {
                  'sidi_id':'632',
                     'name_tag':'Para 2030 potenciar y promover la inclusión social, económica y política de todos independientemente',
                     'description':'',
                     'code':'10.2'
                },
                {
                  'sidi_id':'633',
                     'name_tag':'Garantizar la igualdad de oportunidades y reducir las desigualdades de los resultados, en particular',
                     'description':'',
                     'code':'10.3'
                },
                {
                  'sidi_id':'634',
                     'name_tag':'Adoptar políticas, especialmente fiscales, salariales y de protección social y lograr progresivament',
                     'description':'',
                     'code':'10.4'
                },
                {
                  'sidi_id':'635',
                     'name_tag':'Mejorar la regulación y supervisión de los mercados e instituciones financieras globales y fortalece',
                     'description':'',
                     'code':'10.5'
                },
                {
                  'sidi_id':'636',
                     'name_tag':'Garantizar una mayor representación y voz de los países en desarrollo en la toma de decisiones en la',
                     'description':'',
                     'code':'10.6'
                },
                {
                  'sidi_id':'637',
                     'name_tag':'Facilitar una migración y movimiento de personas ordenada, segura, regular y responsable, a través d',
                     'description':'',
                     'code':'10.7'
                },
                {
                  'sidi_id':'638',
                     'name_tag':'Aplicar el principio de trato especial y diferenciado para los países en desarrollo, en particular l',
                     'description':'',
                     'code':'10.a'
                },
                {
                  'sidi_id':'639',
                     'name_tag':'Fomentar la AOD y los flujos financieros, incluida la inversión extranjera directa, en los estados e',
                     'description':'',
                     'code':'10.b'
                },
                 {
                  'sidi_id':'640',
                     'name_tag':'Para el año 2030, reducir a menos del 3% los costos de transacción de las remesas de migrantes y eli',
                     'description':'',
                     'code':'10.c'
                },
                 {
                  'sidi_id':'641',
                     'name_tag':'Ciudades y Comunidades Sostenibles',
                     'description':'',
                     'code':'11'
                },
                {
                  'sidi_id':'642',
                     'name_tag':'Para 2030, asegurar el acceso para todos a una vivienda adecuada, segura y asequible, y a los servic',
                     'description':'',
                     'code':'11.1'
                },
                {
                  'sidi_id':'643',
                     'name_tag':'Para 2030, proporcionar acceso a sistemas de transportes seguros, económicos y sostenibles para todo',
                     'description':'',
                     'code':'11.2'
                },
                {
                  'sidi_id':'644',
                     'name_tag':'Para 2030 mejorar la urbanización sostenible e inclusiva y las capacidades para la planificación y g',
                     'description':'',
                     'code':'11.3'
                },
                {
                  'sidi_id':'645',
                     'name_tag':'Fortalecer los esfuerzos para proteger y salvaguardar el patrimonio cultural y natural del mundo.',
                     'description':'',
                     'code':'11.4'
                },
                {
                  'sidi_id':'646',
                     'name_tag':'Para 2030 reducir significativamente el número de muertes y el número de personas afectadas y dismin',
                     'description':'',
                     'code':'11.5'
                },
                {
                  'sidi_id':'647',
                     'name_tag':'En el 2030, reducir el impacto ambiental per cápita adverso de las ciudades, prestando especial aten',
                     'description':'',
                     'code':'11.6'
                },
                {
                  'sidi_id':'648',
                     'name_tag':'Para 2030, Proveer acceso universal a espacios verdes y públicos seguros, incluyentes y accesibles,',
                     'description':'',
                     'code':'11.7'
                },
                {
                  'sidi_id':'649',
                     'name_tag':'Apoyar vínculos económicos, sociales y ambientales positivos entre las zonas urbanas, periurbanas y',
                     'description':'',
                     'code':'11.a'
                },
                {
                  'sidi_id':'650',
                     'name_tag':'En el año 2020, aumentar en un x% el número de ciudades y asentamientos humanos que adoptan y aplica',
                     'description':'',
                     'code':'11.b'
                },
                {
                  'sidi_id':'651',
                     'name_tag':'Apoyar a los PMA, mediante la asistencia financiera y técnica, en los edificios sostenibles y resist',
                     'description':'',
                     'code':'11.c'
                },
                 {
                  'sidi_id':'652',
                     'name_tag':'Producción y Consumo Responsables',
                     'description':'',
                     'code':'12'
                },
                {
                  'sidi_id':'653',
                     'name_tag':'Aplicar el Marco Decenal de Programas sobre Consumo y Producción Sostenibles (10 YFP), en que todos',
                     'description':'',
                     'code':'12.1'
                },
                {
                  'sidi_id':'654',
                     'name_tag':'En 2030 alcanzar la gestión sostenible y uso eficiente de los recursos naturales.',
                     'description':'',
                     'code':'12.2'
                },
                {
                  'sidi_id':'655',
                     'name_tag':'En el 2030 reducir a la mitad el desperdicio de alimentos per cápita mundial a nivel de punto de ven',
                     'description':'',
                     'code':'12.3'
                },
                {
                  'sidi_id':'656',
                     'name_tag':'Para 2020 lograr la gestión ambiental adecuada de químicos y todo tipo de desechos a lo largo de su',
                     'description':'',
                     'code':'12.4'
                },
                {
                  'sidi_id':'657',
                     'name_tag':'En el 2030, reducir sustancialmente la generación de residuos mediante la prevención, la reducción,',
                     'description':'',
                     'code':'12.5'
                },
                {
                  'sidi_id':'658',
                     'name_tag':'Alentar a las empresas, especialmente a las grandes empresas y transnacionales, en la adopción de pr',
                     'description':'',
                     'code':'12.6'
                },
                 {
                  'sidi_id':'659',
                     'name_tag':'Promover las prácticas de contratación pública que son sostenibles, de conformidad con las políticas',
                     'description':'',
                     'code':'12.7'
                },
                {
                  'sidi_id':'660',
                     'name_tag':'Para 2030 asegurar que todas las poblaciones tengan la información y el conocimiento relevante para',
                     'description':'',
                     'code':'12.8'
                },
                {
                  'sidi_id':'661',
                     'name_tag':'Apoyar a los países en desarrollo para fortalecer sus capacidades científicas y tecnológicas para av',
                     'description':'',
                     'code':'12.a'
                },
                {
                  'sidi_id':'662',
                     'name_tag':'Desarrollar e implementar herramientas para monitorear los impactos en materia de desarrollo sosteni',
                     'description':'',
                     'code':'12.b'
                },
                {
                  'sidi_id':'663',
                     'name_tag':'Racionalizar los subsidios ineficientes a los combustibles fósiles que fomentan el despilfarro, elim',
                     'description':'',
                     'code':'12.c'
                },
                {
                  'sidi_id':'664',
                     'name_tag':'Acción por el Clima',
                     'description':'',
                     'code':'13'
                },
                {
                  'sidi_id':'665',
                     'name_tag':'Fortalecer la resiliencia y capacidad de adaptación a los peligros relacionados con el clima y los d',
                     'description':'',
                     'code':'13.1'
                },
                 {
                  'sidi_id':'666',
                     'name_tag':'Integrar medidas de cambio climático en las políticas, estrategias y planificación nacional.',
                     'description':'',
                     'code':'13.2'
                },
                {
                  'sidi_id':'667',
                     'name_tag':'Mejorar la educación, la sensibilización y la capacidad humana e institucional en la mitigación del',
                     'description':'',
                     'code':'13.3'
                },
                {
                  'sidi_id':'668',
                     'name_tag':'Implementar el compromiso asumido por los países desarrollados Partes de la CMNUCC de movilizar conj',
                     'description':'',
                     'code':'13.a'
                },
                {
                  'sidi_id':'669',
                     'name_tag':'Promover mecanismos para aumentar las capacidades de planificación y gestión eficaz relacionadas con',
                     'description':'',
                     'code':'13.b'
                },
                {
                  'sidi_id':'670',
                     'name_tag':'Vida Submarina',
                     'description':'',
                     'code':'14'
                },
                {
                  'sidi_id':'671',
                     'name_tag':'Para 2015, prevenir y reducir significativamente la contaminación marina de todo tipo, en particular',
                     'description':'',
                     'code':'14.1'
                },
                {
                  'sidi_id':'672',
                     'name_tag':'En 2020, administrar y proteger de manera sostenible los ecosistemas marinos y costeros para evitar',
                     'description':'',
                     'code':'14.2'
                },
                {
                  'sidi_id':'673',
                     'name_tag':'Minimizar y atender los impactos de la acidificación del océano, mediante la intensificación de la c',
                     'description':'',
                     'code':'14.3'
                },
                 {
                  'sidi_id':'674',
                     'name_tag':'En 2020, regular de manera efectiva la cosecha, y acabar con la sobrepesca, la pesca ilegal, no decl',
                     'description':'',
                     'code':'14.4'
                },
                {
                  'sidi_id':'675',
                     'name_tag':'Para 2020, conservar al menos el 10% de las zonas marinas y costeras, en armonía con la legislación',
                     'description':'',
                     'code':'14.5'
                },
                {
                  'sidi_id':'676',
                     'name_tag':'Para 2020, prohibir ciertas formas de subsidios pesqueros quecontribuyen al exceso de capacidad y la',
                     'description':'',
                     'code':'14.6'
                },
                {
                  'sidi_id':'677',
                     'name_tag':'En 2030 aumentar los beneficios económicos para los pequeños Estados insulares y los países menos ad',
                     'description':'',
                     'code':'14.7'
                },
                {
                  'sidi_id':'678',
                     'name_tag':'Aumentar el conocimiento científico, el desarrollo de las capacidades de investigación y la transfer',
                     'description':'',
                     'code':'14.a'
                },
                {
                  'sidi_id':'679',
                     'name_tag':'Proporcionar acceso de los pescadores artesanales de pequeña escala a los recursos marinos y los mer',
                     'description':'',
                     'code':'14.b'
                },
                {
                  'sidi_id':'680',
                     'name_tag':'Garantizar la plena aplicación del derecho internacional, como se refleja en la CNUDM para los Estad',
                     'description':'',
                     'code':'14.c'
                },
                {
                  'sidi_id':'681',
                     'name_tag':'Vida de Ecosistemas Terrestres',
                     'description':'',
                     'code':'15'
                },
                 {
                  'sidi_id':'682',
                     'name_tag':'En 2020 asegurar la conservación, restauración y uso sostenible de los ecosistemas de agua dulce ter',
                     'description':'',
                     'code':'15.1'
                },
                {
                  'sidi_id':'683',
                     'name_tag':'Para 2020, promover la implementación de la gestión sostenible de todos los tipos de bosques, detene',
                     'description':'',
                     'code':'15.2'
                },
                {
                  'sidi_id':'684',
                     'name_tag':'Para el año 2020, luchar contra la desertificación, y la restauración de la tierra y los suelos degr',
                     'description':'',
                     'code':'15.3'
                },
                {
                  'sidi_id':'685',
                     'name_tag':'En 2030 asegurar la preservación de los ecosistemas de montaña, incluyendo su biodiversidad, para me',
                     'description':'',
                     'code':'15.4'
                },
                {
                  'sidi_id':'686',
                     'name_tag':'Tomar medidas urgentes y significativas para reducir la degradación del hábitat natural, detener la',
                     'description':'',
                     'code':'15.5'
                },
                {
                  'sidi_id':'687',
                     'name_tag':'Asegurar la participación justa y equitativa en los beneficios derivados de la utilización de los re',
                     'description':'',
                     'code':'15.6'
                },
                {
                  'sidi_id':'688',
                     'name_tag':'Tomar medidas urgentes para poner fin a la caza furtiva y el tráfico de especies protegidas de flora',
                     'description':'',
                     'code':'15.7'
                },
                {
                  'sidi_id':'689',
                     'name_tag':'En 2020 implementar medidas para prevenir la introducción y reducir significativamente el impacto de',
                     'description':'',
                     'code':'15.8'
                },
                {
                  'sidi_id':'690',
                     'name_tag':'En 2020, integrar los valores de los ecosistemas y la biodiversidad en la planificación nacional y l',
                     'description':'',
                     'code':'15.9'
                },
                {
                  'sidi_id':'691',
                     'name_tag':'Movilizar y aumentar significativamente los recursos financieros de todas las fuentes para conservar',
                     'description':'',
                     'code':'15.a'
                },
                {
                  'sidi_id':'692',
                     'name_tag':'Movilizar de manera significativa los recursos de todas las fuentes y en todos los niveles para fina',
                     'description':'',
                     'code':'15.b'
                },
                 {
                  'sidi_id':'693',
                     'name_tag':'Aumentar el apoyo mundial a la lucha contra la caza furtiva y el tráfico de especies protegidas, inc',
                     'description':'',
                     'code':'15.c'
                },
                 {
                  'sidi_id':'694',
                     'name_tag':'Paz, Justicia e Instituciones Sólidas',
                     'description':'',
                     'code':'16'
                },
                 {
                  'sidi_id':'695',
                     'name_tag':'Reducir significativamente todas las formas de violencia y las tasas de mortalidad relacionadas en t',
                     'description':'',
                     'code':'16.1'
                },
                {
                  'sidi_id':'696',
                     'name_tag':'Terminar con el abuso, la explotación, la trata y todas las formas de violencia y tortura contra los',
                     'description':'',
                     'code':'16.2'
                },
                {
                  'sidi_id':'697',
                     'name_tag':'Promover el estado de derecho en los planos nacional e internacional, y garantizar la igualdad en el',
                     'description':'',
                     'code':'16.3'
                },
                {
                  'sidi_id':'698',
                     'name_tag':'En 2030 reducir significativamente los flujos financieros y de armas ilícitas, fortalecer la recuper',
                     'description':'',
                     'code':'16.4'
                },
                {
                  'sidi_id':'699',
                     'name_tag':'Reducir sustancialmente la corrupción y el soborno en todas sus formas.',
                     'description':'',
                     'code':'16.5'
                },
                {
                  'sidi_id':'700',
                     'name_tag':'Desarrollar instituciones eficaces, responsables y transparentes a todos los niveles.',
                     'description':'',
                     'code':'16.6'
                },
                {
                  'sidi_id':'701',
                     'name_tag':'Garantizar la toma de decisiones receptiva, inclusiva, participativa y representativa en todos los n',
                     'description':'',
                     'code':'16.7'
                },
                {
                  'sidi_id':'702',
                     'name_tag':'Ampliar y fortalecer la participación de los países en desarrollo en las instituciones de gobernanza',
                     'description':'',
                     'code':'16.8'
                },
                {
                  'sidi_id':'703',
                     'name_tag':'Para 2030 proporcionar identidad legal para todos incluyendo el registro de nacimientos',
                     'description':'',
                     'code':'16.9'
                },
                 {
                  'sidi_id':'704',
                     'name_tag':'Garantizar el acceso público a la información y proteger las libertades fundamentales, de conformida',
                     'description':'',
                     'code':'16.10'
                },
                {
                  'sidi_id':'705',
                     'name_tag':'Fortalecer las instituciones nacionales pertinentes, incluyendo mediante la cooperación internaciona',
                     'description':'',
                     'code':'16.a'
                },
                 {
                  'sidi_id':'706',
                     'name_tag':'Promover y hacer cumplir leyes y políticas no discriminatorias para el desarrollo sostenible.',
                     'description':'',
                     'code':'16.b'
                },
                 {
                  'sidi_id':'707',
                     'name_tag':'Alianzas para Lograr Objetivos',
                     'description':'',
                     'code':'17'
                },
                {
                  'sidi_id':'708',
                     'name_tag':'Fortalecer la movilización de recursos internos, incluyendo a través del apoyo internacional a los p',
                     'description':'',
                     'code':'17.1'
                },
                {
                  'sidi_id':'709',
                     'name_tag':'Los países desarrollados deben cumplir plenamente sus compromisos de AOD, incluida la de destinar el',
                     'description':'',
                     'code':'17.2'
                },
                {
                  'sidi_id':'710',
                     'name_tag':'Movilizar recursos financieros adicionales para los países en desarrollo a partir de múltiples fuent',
                     'description':'',
                     'code':'17.3'
                },
                {
                  'sidi_id':'711',
                     'name_tag':'Ayudar a los países en desarrollo a alcanzar la sostenibilidad de la deuda de largo plazo a través d',
                     'description':'',
                     'code':'17.4'
                },
                {
                  'sidi_id':'712',
                     'name_tag':'Adoptar y aplicar regímenes de promoción de inversiones para los PMA.',
                     'description':'',
                     'code':'17.5'
                },
                {
                  'sidi_id':'713',
                     'name_tag':'Profundizar la cooperación triangular Norte-Sur, Sur-Sur, regional e internacional y el acceso a la',
                     'description':'',
                     'code':'17.6'
                },
                 {
                  'sidi_id':'714',
                     'name_tag':'Promover el desarrollo, la transferencia, la diseminación y la difusión de tecnologías amigables con',
                     'description':'',
                     'code':'17.7'
                },
                 {
                  'sidi_id':'715',
                     'name_tag':'Operacionalizar plenamente el Banco de Tecnología e CT&I, mecanismo de creación de capacidad para lo',
                     'description':'',
                     'code':'17.8'
                },
                {
                  'sidi_id':'716',
                     'name_tag':'Mejorar el apoyo internacional para la aplicación de creación de capacidad efectiva y focalizada en',
                     'description':'',
                     'code':'17.9'
                },
                {
                  'sidi_id':'717',
                     'name_tag':'Promover un sistema multilateral de comercio universal, abierto, no discriminatorio y equitativo en',
                     'description':'',
                     'code':'17.10'
                },
                {
                  'sidi_id':'718',
                     'name_tag':'Incrementar significativamente las exportaciones de los países en desarrollo, con miras a duplicar l',
                     'description':'',
                     'code':'17.11'
                },
                {
                  'sidi_id':'719',
                     'name_tag':'Alcanzar la implementación oportuna del acceso al mercado libre de cuotas y de impuestos, sobre una',
                     'description':'',
                     'code':'17.12'
                },
                {
                  'sidi_id':'720',
                     'name_tag':'Mejorar la estabilidad macroeconómica global, a través de la coordinación y la coherencia de las pol',
                     'description':'',
                     'code':'17.13'
                },
                {
                  'sidi_id':'721    ',
                     'name_tag':'Mejorar la coherencia de las políticas para el desarrollo sostenible.',
                     'description':'',
                     'code':'17.14'
                },
                {
                  'sidi_id':'722    ',
                     'name_tag':'Respetar el espacio político y el liderazgo de cada país para establecer y poner en práctica polític',
                     'description':'',
                     'code':'17.15'
                },
                {
                  'sidi_id':'723    ',
                     'name_tag':'Fortalecer la asociación mundial para el desarrollo sostenible complementada por asociaciones multip',
                     'description':'',
                     'code':'17.16'
                },
                {
                  'sidi_id':'724    ',
                     'name_tag':'Incentivar y promover asociaciones públicas, público-privado y de sociedad civil eficientes, basándo',
                     'description':'',
                     'code':'17.17'
                },
                {
                  'sidi_id':'725    ',
                     'name_tag':'Para 2020, aumentar el apoyo para la creación de capacidad a los países en desarrollo, incluidos los',
                     'description':'',
                     'code':'17.18'
                },
                 {
                  'sidi_id':'726    ',
                     'name_tag':'En 2030, construir sobre las iniciativas existentes para desarrollar medidas de progreso en el desar',
                     'description':'',
                     'code':'17.19'
                },



            ]
          }

         ]


       };





        return projectsclasifications;

      },



      // get cluster donors
      getDonors: function( admin0pcode, cluster_id ) {

        // donor list
        var donors;

        // get from list
          // this list needs to be updated at the db to iclude admin0pcode as string (like activities)
          // hack for NG has been put in place, so much to do, so little time (horrible, I know!)
        donors = $filter( 'filter' )( ngmLists.getObject( 'lists' ).donorsList,
                          { cluster_id: cluster_id }, true );

        // if no list use default
        if ( !donors.length ) {
          donors = [
            { project_donor_id: 'australia', project_donor_name:'Australia'},
            { project_donor_id: 'aus_aid', project_donor_name:'AusAid'},
            { project_donor_id: 'bmz', project_donor_name:'BMZ'},
            { project_donor_id: 'brac', project_donor_name:'BRAC'},
            { project_donor_id: 'canada',  project_donor_name:'Canada'},
            { project_donor_id: 'care',  project_donor_name:'Care'},
            { project_donor_id: 'caritas_germany', project_donor_name: 'Caritas Germany' },
            { project_donor_id: 'cerf', project_donor_name: 'CERF' },
            { project_donor_id: 'chf', project_donor_name: 'CHF' },
            { project_donor_id: 'cida', project_donor_name: 'CIDA' },
            { project_donor_id: 'czech_aid', project_donor_name: 'Czech Aid' },
            { project_donor_id: 'czech_mofa', project_donor_name: 'Czech MOFA' },
            { project_donor_id: 'danida', project_donor_name:'Danida'},
            { project_donor_id: 'denmark', project_donor_name:'Denmark'},
            { project_donor_id: 'dfid', project_donor_name: 'DFID' },
            { project_donor_id: 'disaster_emergency_committee_dec', project_donor_name: 'Disaster Emergency Committee (DEC)' },
            { project_donor_id: 'echo', project_donor_name: 'ECHO' },
            { project_donor_id: 'ehf', project_donor_name: 'EHF' },
            { project_donor_id: 'european_union', project_donor_name: 'European Union' },
            { project_donor_id: 'fao', project_donor_name:'FAO' },
            { project_donor_id: 'finland', project_donor_name:'Finland' },
            { project_donor_id: 'france', project_donor_name:'France' },
            { project_donor_id: 'global_fund', project_donor_name: 'Global Fund' },
            { project_donor_id: 'german_foreign_ministry', project_donor_name: 'German Foreign Ministry' },
            { project_donor_id: 'icrc', project_donor_name: 'ICRC' },
            { project_donor_id: 'ifrc', project_donor_name: 'IFRC' },
            { project_donor_id: 'iom', project_donor_name: 'IOM' },
            { project_donor_id: 'irish_aid', project_donor_name: 'IrishAid' },
            { project_donor_id: 'italy', project_donor_name: 'Italy' },
            { project_donor_id: 'jica', project_donor_name: 'JICA' },
            { project_donor_id: 'johanniter', project_donor_name: 'Johanniter' },
            { project_donor_id: 'khalifa_bin_zayed_al_nahyan_charity_foundation', project_donor_name: 'Khalifa bin Zayed Al Nahyan Charity Foundation' },
            { project_donor_id: 'mukti', project_donor_name: 'Mukti' },
            { project_donor_id: 'netherlands', project_donor_name: 'Netherlands' },
            { project_donor_id: 'norway', project_donor_name: 'Norway' },
            { project_donor_id: 'ocha', project_donor_name: 'OCHA' },
            { project_donor_id: 'oxfam', project_donor_name: 'Oxfam' },
            { project_donor_id: 'qatar_red_crescent', project_donor_name: 'Qatar Red Crescent' },
            { project_donor_id: 'republic_of_korea', project_donor_name: 'Republic of Korea' },
            { project_donor_id: 'sdc', project_donor_name: 'SDC' },
            { project_donor_id: 'sida', project_donor_name: 'SIDA' },
            { project_donor_id: 'solidar_suisse', project_donor_name: 'Solidar Suisse' },
            { project_donor_id: 'start_network_global_humanitarian_assistance', project_donor_name: 'Start Network Global Humanitarian Assistance' },
            { project_donor_id: 'sweden', project_donor_name: 'Sweden' },
            { project_donor_id: 'switzerland', project_donor_name: 'Switzerland' },
            { project_donor_id: 'turkish_red_crescent', project_donor_name: 'Turkish Red Crescent' },
            { project_donor_id: 'usaid', project_donor_name: 'USAID' },
            { project_donor_id: 'unfpa', project_donor_name: 'UNFPA' },
            { project_donor_id: 'unhcr', project_donor_name: 'UNHCR' },
            { project_donor_id: 'unicef', project_donor_name: 'UNICEF' },
            { project_donor_id: 'unwomen', project_donor_name: 'UNWOMEN' },
            { project_donor_id: 'wfp', project_donor_name: 'WFP' },
            { project_donor_id: 'who', project_donor_name: 'WHO' },
            { project_donor_id: 'world_bank', project_donor_name: 'World Bank' }
          ];
        }

        // include for NG
        if ( admin0pcode === 'NG' ) {
          donors = [
            { project_donor_id: "africa_development_bank", project_donor_name:"African Development Bank" },
            { project_donor_id: "australian_high_commission", project_donor_name:"Australian High Commission" },
            { project_donor_id: "british_high_commission", project_donor_name:"British High Commission" },
            { project_donor_id: "central_emergency_response_fund", project_donor_name:"Central Emergency Response Fund" },
            { project_donor_id: "cjk", project_donor_name:"CJK" },
            { project_donor_id: "danish_international_development_agency", project_donor_name:"Danish International Development Agency" },
            { project_donor_id: "ukaid", project_donor_name:"Department for International Development (UKAID)" },
            { project_donor_id: "dgd_belgium_fund", project_donor_name:"DGD Belgium Fund" },
            { project_donor_id: "disability_rights_fund", project_donor_name:"Disability Rights Fund" },
            { project_donor_id: "dutch_cooperating_aid_agencies", project_donor_name:"Dutch Cooperating Aid Agencies" },
            { project_donor_id: "dutch_relief_alliance", project_donor_name:"Dutch Relief Alliance" },
            { project_donor_id: "embassy_denmark", project_donor_name:"Embassy of Denmark" },
            { project_donor_id: "embassy_finland", project_donor_name:"Embassy of Finland" },
            { project_donor_id: "embassy_france", project_donor_name:"Embassy of France" },
            { project_donor_id: "embassy_israel", project_donor_name:"Embassy of Israel" },
            { project_donor_id: "embassy_japan", project_donor_name:"Embassy of Japan" },
            { project_donor_id: "embassy_poland", project_donor_name:"Embassy of Poland" },
            { project_donor_id: "embassy_sweden", project_donor_name:"Embassy of Sweden" },
            { project_donor_id: "embassy_switzerland", project_donor_name:"Embassy of Switzerland" },
            { project_donor_id: "embassy_kingdom_of_netherlands", project_donor_name:"Embassy of the Kingdom of Netherlands" },
            { project_donor_id: "europe_aid", project_donor_name:"EuropeAid" },
            { project_donor_id: "european_commission", project_donor_name:"European Commission" },
            { project_donor_id: "european_commissioner_for_humanitarian_aid_and_civil_protection", project_donor_name:"European Commissioner for Humanitarian Aid and Civil Protection (ECHO)" },
            { project_donor_id: "european_union", project_donor_name:"European Union" },
            { project_donor_id: "french_ministry_of_foreign_affairs", project_donor_name:"French Ministry of Foreign Affairs" },
            { project_donor_id: "german_federal_foreign_office", project_donor_name:"German Federal Foreign Office" },
            { project_donor_id: "global_affairs_canada", project_donor_name:"Global Affairs Canada" },
            { project_donor_id: "global_fund", project_donor_name:"Global Fund" },
            { project_donor_id: "global_fund_for_women", project_donor_name:"Global Fund for Women" },
            { project_donor_id: "global_fund_observer", project_donor_name:"Global Fund Observer" },
            { project_donor_id: "high_comission_of_canda", project_donor_name:"High Commission of Canada" },
            { project_donor_id: "irish_aid", project_donor_name:"Irish Aid" },
            { project_donor_id: "italian_agency_for_cooperation_and_development", project_donor_name:"Italian Agency for Cooperation and Development" },
            { project_donor_id: "japan_international_cooperation_agency", project_donor_name:"Japan International Cooperation Agency" },
            { project_donor_id: "letsai", project_donor_name:"LETSAI" },
            { project_donor_id: "nigerian_humanitarian_fund", project_donor_name:"Nigerian Humanitarian Fund" },
            { project_donor_id: "norwegian_ministry_of_foreign_affairs", project_donor_name:"Norwegian Ministry of Foreign Affairs" },
            { project_donor_id: "office_of_us_disaster_assistance", project_donor_name:"Office of US Disaster Assistance" },
            { project_donor_id: "plan_international_candaa", project_donor_name:"Plan International Canada" },
            { project_donor_id: "private_donor", project_donor_name:"Private Donor" },
            { project_donor_id: "royal_norwegian_embassy", project_donor_name:"Royal Norwegian Embassy" },
            { project_donor_id: "sv", project_donor_name:"SV" },
            { project_donor_id: "swedish_international_development_cooperation_agency", project_donor_name:"Swedish International Development Cooperation Agency" },
            { project_donor_id: "swiss_embassy", project_donor_name:"Swiss Embassy" },
            { project_donor_id: "swiss_solidarity", project_donor_name:"Swiss Solidarity" },
            { project_donor_id: "united_nations_childrens_fund", project_donor_name:"United Nations Children's Fund" },
            { project_donor_id: "usaid", project_donor_name:"United States Agency for International Development" },
            { project_donor_id: "us_ofda", project_donor_name:"United States Office of Foreign Disaster Assistance" }
          ];
        }

        // if no list use default
        if ( admin0pcode === 'SO' ) {
          donors = [
            { project_donor_id: 'australia', project_donor_name:'Australia'},
            { project_donor_id: 'aus_aid', project_donor_name:'AusAid'},
            { project_donor_id: 'bmz', project_donor_name:'BMZ'},
            { project_donor_id: 'canada',  project_donor_name:'Canada'},
            { project_donor_id: 'caritas_germany', project_donor_name: 'Caritas Germany' },
            { project_donor_id: 'cerf', project_donor_name: 'CERF' },
            { project_donor_id: 'cida', project_donor_name: 'CIDA' },
            { project_donor_id: 'czech_aid', project_donor_name: 'Czech Aid' },
            { project_donor_id: 'czech_mofa', project_donor_name: 'Czech MOFA' },
            { project_donor_id: 'danida', project_donor_name:'Danida'},
            { project_donor_id: 'denmark', project_donor_name:'Denmark'},
            { project_donor_id: 'dfid', project_donor_name: 'DFID' },
            { project_donor_id: 'echo', project_donor_name: 'ECHO' },
            { project_donor_id: 'european_union', project_donor_name: 'European Union' },
            { project_donor_id: 'finland', project_donor_name:'Finland' },
            { project_donor_id: 'france', project_donor_name:'France' },
            { project_donor_id: 'global_fund', project_donor_name: 'Global Fund' },
            { project_donor_id: 'german_foreign_ministry', project_donor_name: 'German Foreign Ministry' },
            { project_donor_id: 'icrc', project_donor_name: 'ICRC' },
            { project_donor_id: 'ifrc', project_donor_name: 'IFRC' },
            { project_donor_id: 'irish_aid', project_donor_name: 'IrishAid' },
            { project_donor_id: 'italy', project_donor_name: 'Italy' },
            { project_donor_id: 'jica', project_donor_name: 'JICA' },
            { project_donor_id: 'johanniter', project_donor_name: 'Johanniter' },
            { project_donor_id: 'khalifa_bin_zayed_al_nahyan_charity_foundation', project_donor_name: 'Khalifa bin Zayed Al Nahyan Charity Foundation' },
            { project_donor_id: 'netherlands', project_donor_name: 'Netherlands' },
            { project_donor_id: 'norway', project_donor_name: 'Norway' },
            { project_donor_id: 'qatar_red_crescent', project_donor_name: 'Qatar Red Crescent' },
            { project_donor_id: 'republic_of_korea', project_donor_name: 'Republic of Korea' },
            { project_donor_id: 'sdc', project_donor_name: 'SDC' },
            { project_donor_id: 'shf', project_donor_name: 'SHF' },
            { project_donor_id: 'sida', project_donor_name: 'SIDA' },
            { project_donor_id: 'start_network_global_humanitarian_assistance', project_donor_name: 'Start Network Global Humanitarian Assistance' },
            { project_donor_id: 'sweden', project_donor_name: 'Sweden' },
            { project_donor_id: 'switzerland', project_donor_name: 'Switzerland' },
            { project_donor_id: 'usaid', project_donor_name: 'USAID' },
            { project_donor_id: 'unhcr', project_donor_name: 'UNHCR' },
            { project_donor_id: 'unicef', project_donor_name: 'UNICEF' },
            { project_donor_id: 'wfp', project_donor_name: 'WFP' },
            { project_donor_id: 'who', project_donor_name: 'WHO' },
            { project_donor_id: 'world_bank', project_donor_name: 'Worldbank' }
          ];
        }

        if(admin0pcode === 'COL'){

          donors = [
              {
                "project_donor_id": "acción_contra_el_hambre",
                "project_donor_name": "Acción contra el Hambre"
              },
              {
                "project_donor_id": "agencia_canadiense_para_el_desarrollo_internacional",
                "project_donor_name": "Agencia Canadiense para el Desarrollo Internacional"
              },
              {
                "project_donor_id": "agencia_de_estados_unidos_para_el_desarrollo_internacional",
                "project_donor_name": "Agencia de Estados Unidos para el Desarrollo Internacional"
              },
              {
                "project_donor_id":"agencia_de_cooperacion_internacional_de_corea_koica",
                "project_donor_name":"Agencia de Cooperación Internacional de Corea (KOICA)"
              },
              {
                "project_donor_id": "agencia_española_de_cooperación_internacional",
                "project_donor_name": "Agencia Española de Cooperación Internacional"
              },
              {
                "project_donor_id": "agencia_noruega_de_cooperación_para_el_desarrollo",
                "project_donor_name": "Agencia Noruega de Cooperación para el Desarrollo"
              },
              {
                "project_donor_id": "agencia_sueca_internacional_de_cooperación_al_desarrollo",
                "project_donor_name": "Agencia Sueca Internacional de Cooperación Al Desarrollo"
              },
              {
                "project_donor_id": "agencia_suiza_para_el_desarrollo_y_la_cooperación",
                "project_donor_name": "Agencia Suiza para el Desarrollo y La Cooperación"
              },
              {
                "project_donor_id": "alto_comisionado_de_las_naciones_unidas_para_los_refugiados",
                "project_donor_name": "Alto Comisionado de las Naciones Unidas para los Refugiados"
              },
              {
                "project_donor_id": "asociación­_nacional_de_ayuda_solidaria",
                "project_donor_name": "Asociación Nacional de Ayuda Solidaria"
              },
              {
                "project_donor_id": "banco_interamericano_de_desarrollo",
                "project_donor_name": "Banco Interamericano de Desarrollo"
              },
              {
                "project_donor_id": "buró_de_población_refugiados_y_migración",
                "project_donor_name": "Buró de Población, Refugiados y Migración"
              },
              {
                "project_donor_id": "cáritas_suiza",
                "project_donor_name": "Cáritas Suiza"
              },
              {
                "project_donor_id": "central_emergency_respond_fund",
                "project_donor_name": "Central Emergency Respond Fund"
              },
              {
                "project_donor_id": "centro_nacional_de_referencia_sobre_la_violencia",
                "project_donor_name": "Centro Nacional de Referencia Sobre La Violencia"
              },
              {
                "project_donor_id": "comité_internacional_de_la_cruz_roja",
                "project_donor_name": "Comité Internacional de la Cruz Roja"
              },
              {
                "project_donor_id": "corporación_andina_de_fomento",
                "project_donor_name": "Corporación Andina de Fomento"
              },
              {
                "project_donor_id": "country_based_pooled_funds",
                "project_donor_name": "Country based Pooled Funds"
              },
              {
                "project_donor_id": "cruz_roja_alemana",
                "project_donor_name": "Cruz Roja Alemana"
              },
              {
                "project_donor_id": "cruz_roja_colombiana",
                "project_donor_name": "Cruz Roja Colombiana"
              },
              {
                "project_donor_id": "cruz_roja_colombiana_seccional_antioquia",
                "project_donor_name": "Cruz Roja Colombiana Seccional Antioquia"
              },
              {
                "project_donor_id": "cruz_roja_ecuatoriana",
                "project_donor_name": "Cruz Roja Ecuatoriana"
              },
              {
                "project_donor_id": "cruz_roja_noruega",
                "project_donor_name": "Cruz Roja Noruega"
              },
              {
                "project_donor_id": "delegación_unión_europea_en_colombia",
                "project_donor_name": "DELEGACIÓN DE LA UNIÓN EUROPEA EN COLOMBIA"
              },
              {
                "project_donor_id": "departamento_de_estado_de_los_estados_unidos",
                "project_donor_name": "Departamento de Estado de los Estados Unidos"
              },
              {
                "project_donor_id": "departamento_para_la_prosperidad_social",
                "project_donor_name": "Departamento para la Prosperidad Social"
              },
              {
                "project_donor_id": "dutch_relief_alliance",
                "project_donor_name": "Dutch Relief Alliance"
              },
              {
                "project_donor_id": "diakonie_katastrophenhilfe_apoyo_en_emergencias",
                "project_donor_name": "Diakonie Katastrophenhilfe Apoyo en Emergencias"
              },
              {
                "project_donor_id": "embajada_de_alemania_en_colombia",
                "project_donor_name": "Embajada de Alemania en Colombia"
              },
              {
                "project_donor_id": "embajada_de_canadá",
                "project_donor_name": "Embajada de Canadá"
              },
              {
                "project_donor_id": "embajada_de_españa_en_colombia",
                "project_donor_name": "Embajada de España en Colombia"
              },
              {
                "project_donor_id": "embajada_de_estados_unidos_en_colombia",
                "project_donor_name": "Embajada de Estados Unidos en Colombia"
              },
              {
                "project_donor_id": "embajada_de_holanda_del_reino_de_los_paises_bajos_en_colombia",
                "project_donor_name": "Embajada de Holanda / del Reino de los Paises Bajos en Colombia"
              },
              {
                "project_donor_id": "embajada_de_hungría",
                "project_donor_name": "Embajada de Hungría"
              },
              {
                "project_donor_id": "embajada_de_noruega_en_colombia",
                "project_donor_name": "Embajada de Noruega en Colombia"
              },
              {
                "project_donor_id": "fondation_medicor",
                "project_donor_name": "Fondation Medicor"
              },
              {
                "project_donor_id": "fondo_de_construccion_de_paz_de_naciones_unidas_pbf",
                "project_donor_name": "Fondo de Construcción de Paz de Naciones Unidas (PBF)"
              },
              {
                "project_donor_id": "fondo_de_las_naciones_unidas_para_la_infancia",
                "project_donor_name": "Fondo de las Naciones Unidas para la Infancia"
              },
              {
                "project_donor_id": "fondo_de_población_de_las_naciones_unidas",
                "project_donor_name": "Fondo de Población de las Naciones Unidas"
              },
              {
                "project_donor_id": "fondo_fiduciario_de_asociados_multiples",
                "project_donor_name": "Fondo Fiduciario de Asociados Multiples"
              },
              {
                "project_donor_id": "fondo_fiduciario_de_la_union_europea_eu_trust_fond",
                "project_donor_name": "Fondo Fiduciario de la Unión Europea (EU Trust fond)"
              },
              {
                "project_donor_id": "fondo_multidonante_de_las_naciones_unidas_para_el_posconflicto",
                "project_donor_name": "Fondo Multidonante de las Naciones Unidas para el Posconflicto"
              },
              {
                "project_donor_id": "fundación_bolívar_davivienda",
                "project_donor_name": "Fundación Bolívar Davivienda"
              },
              {
                "project_donor_id": "fundación_éxito",
                "project_donor_name": "Fundación Éxito"
              },
              {
                "project_donor_id": "fundacion_plan",
                "project_donor_name": "Fundacion Plan"
              },

              {
                "project_donor_id": "german_federal_foreign_office",
                "project_donor_name": "German Federal Foreign Office"
              },
              {
                "project_donor_id": "glaxosmithkline",
                "project_donor_name": "Glaxosmithkline"
              },
              {
                "project_donor_id": "global_affairs_canada",
                "project_donor_name": "Global Affairs Canada"
              },
              {
                "project_donor_id": "global_links",
                "project_donor_name": "Global Links"
              },
              {
                "project_donor_id": "gobernación_de_antioquia",
                "project_donor_name": "Gobernación de Antioquia"
              },
              {
                "project_donor_id": "gobernación_de_cundinamarca",
                "project_donor_name": "Gobernación de Cundinamarca"
              },
              {
                "project_donor_id": "gobernación_de_nariño",
                "project_donor_name": "Gobernación de Nariño"
              },
              {
                "project_donor_id": "gobierno_alemán",
                "project_donor_name": "Gobierno Alemán"
              },
              {
                "project_donor_id": "gobierno_de_francia",
                "project_donor_name": "Gobierno de Francia"
              },
               {
                "project_donor_id": "gobierno_de_irlanda",
                "project_donor_name": "Gobierno de Irlanda"
              },
              {
                "project_donor_id": "gobierno_del_reino_de_dinamarca",
                "project_donor_name": "Gobierno del Reino de Dinamarca"
              },
               {
                "project_donor_id": "gobierno_del_reino_de_noruega",
                "project_donor_name": "Gobierno del Reino de Noruega"
              },

               {
                "project_donor_id": "gobierno_del_reino_de_suecia",
                "project_donor_name": "Gobierno del Reino de Suecia"
              },
              {
                "project_donor_id": "gobierno_del_reino_de_los_paises_bajos_holanda",
                "project_donor_name": "Gobierno del Reino de los Países Bajos (Holanda)"
              },
              {
                "project_donor_id": "gobierno_del_reino_unido",
                "project_donor_name": "Gobierno del Reino Unido"
              },
              {
                "project_donor_id": "gobierno_vasco",
                "project_donor_name": "Gobierno Vasco"
              },
              {
                "project_donor_id": "grand_challenges_canada",
                "project_donor_name": "Grand Challenges Canada"
              },
              {
                "project_donor_id": "inditex",
                "project_donor_name": "Inditex"
              },
              {
                "project_donor_id": "instituto_colombiano_de_bienestar_familiar",
                "project_donor_name": "Instituto Colombiano de Bienestar Familiar"
              },
              {
                "project_donor_id": "instituto_nacional_de_salud",
                "project_donor_name": "Instituto Nacional de Salud"
              },
              {
                "project_donor_id": "instituto_nacional_de_vigilancia_de_medicamentos_y_alimentos",
                "project_donor_name": "Instituto Nacional de Vigilancia de Medicamentos y Alimentos"
              },
              {
                "project_donor_id": "kinder_mission",
                "project_donor_name": "Kinder Mission"
              },
              {
                "project_donor_id": "management_systems_international",
                "project_donor_name": "Management Systems International"
              },
              {
                "project_donor_id": "médicos_sin_fronteras_españa",
                "project_donor_name": "Médicos Sin Fronteras España"
              },
              {
                "project_donor_id": "ministerio_de_educación_nacional",
                "project_donor_name": "Ministerio de Educación Nacional"
              },
              {
                "project_donor_id": "ministerio_de_protección_social",
                "project_donor_name": "Ministerio de Protección Social"
              },
              {
                "project_donor_id": "ministerio_de_salud_y_protección_social",
                "project_donor_name": "Ministerio de Salud y Protección Social"
              },
              {
                "project_donor_id": "office_of_us_foreign_disaster_assistance",
                "project_donor_name": "OFFICE OF U.S. FOREIGN DISASTER ASSISTANCE"
              },
              {
                "project_donor_id": "oficina_de_ayuda_humanitaria_de_la _comision_europea",
                "project_donor_name": "Oficina de Ayuda Humanitaria de la Comision Europea"
              },
              {
                "project_donor_id": "oficina_de_las_naciones_unidas_para_la_coordinación_de_asuntos_humanitarios",
                "project_donor_name": "Oficina de las Naciones Unidas para la Coordinación de Asuntos Humanitarios"
              },
              {
                "project_donor_id": "oficina_de_naciones_unidas_para_la_coordinación_de_asuntos_humanitarios",
                "project_donor_name": "Oficina de Naciones Unidas para la Coordinación de Asuntos Humanitarios"
              },
              {
                "project_donor_id": "organización_internacional_para_las_migraciones",
                "project_donor_name": "Organización Internacional para las Migraciones"
              },
              {
                "project_donor_id": "organización_panamericana_de_salud_organización_mundial_de_salud",
                "project_donor_name": "Organización Panamericana de Salud / Organización Mundial de Salud"
              },
              {
                "project_donor_id": "panamerican_health_and_education_foundation",
                "project_donor_name": "Panamerican Health And Education Foundation"
              },
              {
                "project_donor_id": "patrulla_aérea_civil_colombiana",
                "project_donor_name": "Patrulla Aérea Civil Colombiana"
              },
              {
                "project_donor_id": "plan_internacional",
                "project_donor_name": "Plan Internacional"
              },
              {
                "project_donor_id": "programa_conjunto_de_las_naciones_unidos_sobre_el_ vih/sida",
                "project_donor_name": "Programa Conjunto de las Naciones Unidos Sobre el Vih/sida"
              },
              {
                "project_donor_id": "programa_de_naciones_unidas_para_el_desarrollo",
                "project_donor_name": "Programa de Naciones Unidas para el Desarrollo"
              },
              {
                "project_donor_id": "programa_de_transformación_productiva",
                "project_donor_name": "Programa de Transformación Productiva"
              },
              {
                "project_donor_id": "programa_mundial_de_alimentos",
                "project_donor_name": "Programa Mundial de Alimentos"
              },
              {
                "project_donor_id": "reckitt_benckiser",
                "project_donor_name": "Reckitt Benckiser"
              },
              {
                "project_donor_id": "secretaría_distrital_de_salud",
                "project_donor_name": "Secretaría Distrital de Salud"
              },
               {
                "project_donor_id": "unidad_para_la_atencion_y_reparacion_integral_a_las_victimas",
                "project_donor_name": "Unidad para la Atención y Reparación Integral a las Víctimas"
              },
              {
                "project_donor_id": "united_nations_international_childrens_emergency_fund",
                "project_donor_name": "United Nations International Children's Emergency Fund"
              },
              {
                "project_donor_id": "united_nations_voluntary_fund_for_victims_of_torture",
                "project_donor_name": "United Nations Voluntary Fund For Victims Of Torture"
              },
              {
                "project_donor_id": "united_states_agency_international_development",
                "project_donor_name": "United States Agency International Development"
              }
            
              
           ]
          

         }




        // add other
        donors.push( { project_donor_id: 'other', project_donor_name: 'Other' } );

        return donors;
      },


      // country currencies
      getCurrencies: function( admin0pcode ) {


        if(admin0pcode === 'COL'){

          var currencies = [{
          // default is USD
          admin0pcode: admin0pcode,
          currency_id: 'usd',
          currency_name: 'USD'
        },
        {
          admin0pcode: admin0pcode,
          currency_id: 'eur',
          currency_name: 'EUR'
        },
        {

          admin0pcode: 'COL',
          currency_id: 'cop',
          currency_name: 'COP'
        },];

        }else{

        var currencies = [{

          admin0pcode: 'COL',
          currency_id: 'cop',
          currency_name: 'COP'
        },{
          admin0pcode: 'AF',
          currency_id: 'afn',
          currency_name: 'AFN'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'aud',
          currency_name: 'AUD'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'bdt',
          currency_name: 'BDT'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'cad',
          currency_name: 'CAD'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'chf',
          currency_name: 'CHF'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'ddk',
          currency_name: 'DDK'
        },{
          admin0pcode: 'ET',
          currency_id: 'etb',
          currency_name: 'ETB'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'eur',
          currency_name: 'EUR'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'gbp',
          currency_name: 'GBP'
        },{
          admin0pcode: 'IQ',
          currency_id: 'iqd',
          currency_name: 'IQD'
        },{
          admin0pcode: 'KE',
          currency_id: 'kes',
          currency_name: 'KES'
        },{
          admin0pcode: 'NG',
          currency_id: 'ngn',
          currency_name: 'NGN'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'nok',
          currency_name: 'NOK'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'sek',
          currency_name: 'SEK'
        },{
          admin0pcode: 'SO',
          currency_id: 'sos',
          currency_name: 'SOS'
        },{
          // default is USD
          admin0pcode: admin0pcode,
          currency_id: 'usd',
          currency_name: 'USD'
        }];
        }

        // filter currency options list by admin0pcode
        return $filter( 'filter' )( currencies, { admin0pcode: admin0pcode } );

      },

      // get objectives by cluster
      getStrategicObjectives: function (admin0pcode, start_report_year, end_report_year) {
        
        if (admin0pcode === 'AF') {

        var strategic_objectives = {
            2017: {
          'cvwg': [{
            cluster_id: 'cvwg',
            cluster: 'Cash Voucher Working Group',
                objective_type_id: 'mpc_objective_1',
                objective_type_name: 'MPC OBJECTIVE 1',
            objective_type_description: 'No objectives related to HRP for 2017',
            objective_type_objectives: []
          }],
          'eiewg': [{
            cluster_id: 'eiewg',
            cluster: 'EiEWG',
            objective_type_id: 'eiewg_objective_1',
            objective_type_name: 'EiEWG OBJECTIVE 1',
            objective_type_description: 'No objectives related to HRP for 2017',
            objective_type_objectives: []
          }],
          'fsac': [{
            cluster_id: 'fsac',
            cluster: 'FSAC',
            objective_type_id: 'fsac_objective_1',
            objective_type_name: 'FSAC OBJECTIVE 1',
            objective_type_description: 'Immediate food needs of targeted shock affected populations are addressed with appropriate transfer modality (food, cash or voucher)',
            objective_type_objectives: [ 'SO1' ]
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC',
            objective_type_id: 'fsac_objective_2',
            objective_type_name: 'FSAC OBJECTIVE 2',
            objective_type_description: 'Ensure continued and regular access to food during lean season for severely food insecure people, refugees and prolonged IDPs at risk of hunger and acute malnutrition',
            objective_type_objectives: [ 'SO3' ]
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC',
            objective_type_id: 'fsac_objective_3',
            objective_type_name: 'FSAC OBJECTIVE 3',
            objective_type_description: 'Strengethen emergency preparedness and response capabilities of partners through development of contingency plans, timely coordinated food security assessments and capacity development especially in hard to reach areas',
            objective_type_objectives: [ 'SO4' ]
          }],
          'esnfi': [{
            cluster_id: 'esnfi',
            cluster: 'ESNFI',
            objective_type_id: 'esnfi_objective_1',
            objective_type_name: 'ESNFI OBJECTIVE 1',
            objective_type_description: 'Coordinated and timely ES-NFI response to families affected by natural disaster and armed conflict',
            objective_type_objectives: [ 'SO1' ]
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI',
            objective_type_id: 'esnfi_objective_2',
            objective_type_name: 'ESNFI OBJECTIVE 2',
            objective_type_description: 'Coordinated and timely ES-NFI response to returnees',
            objective_type_objectives: [ 'SO1' ]
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI',
            objective_type_id: 'esnfi_objective_3',
            objective_type_name: 'ESNFI OBJECTIVE 3',
            objective_type_description: 'Families falling into acute vulnerability due to shock are assisted with ES-NFI interventions in the medium term',
            objective_type_objectives: [ 'SO3' ]
          }],
          'health': [{
            cluster_id: 'health',
            cluster: 'Health',
            objective_type_id: 'health_objective_1',
            objective_type_name: 'HEALTH OBJECTIVE 1',
            objective_type_description: 'Ensure access to emergency health services, effective trauma care and mass casualty management for shock affected people',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            cluster_id: 'health',
            cluster: 'Health',
            objective_type_id: 'health_objective_2',
            objective_type_name: 'HEALTH OBJECTIVE 2',
            objective_type_description: 'Ensure access to essential basic and emergency health services for white conflict-affected areas and overburdened services due to population movements',
            objective_type_objectives: [ 'SO2', 'SO4' ]
          },{
            cluster_id: 'health',
            cluster: 'Health',
            objective_type_id: 'health_objective_3',
            objective_type_name: 'HEALTH OBJECTIVE 3',
            objective_type_description: 'Provide immediate life saving assistance to those affected by public health outbreaks',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          }],
          'nutrition':[{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_1',
            objective_type_name: 'NUTRITION OBJECTIVE 1',
            objective_type_description: 'Quality community and facility-based nutrition information is made available timely for programme monitoring and decision making',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_2',
            objective_type_name: 'NUTRITION OBJECTIVE 2',
            objective_type_description: 'The incidence of acute malnutrition is reduced through Integrated Management of Acute Malnutrition among boys, girls, pregnant and lactating women',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_3',
            objective_type_name: 'NUTRITION OBJECTIVE 3',
            objective_type_description: 'Contribute to reduction of morbidity and mortality among returnees and refugees by providing preventative nutrition programmes',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_4',
            objective_type_name: 'NUTRITION OBJECTIVE 4',
            objective_type_description: 'Enhance capacity of partners to advocate for and respond at scale to nutrition in emergencies',
                objective_type_objectives: ['SO1', 'SO2', 'SO3', 'SO4'],
          }],
          'protection':[{
            cluster_id: 'protection',
            cluster: 'Protection',
            objective_type_id: 'protection_objective_1',
            objective_type_name: 'PROTECTION OBJECTIVE 1',
            objective_type_description: 'Acute protection concerns, needs and violations stemming from the immediate impact of shocks and taking into account specific vulnerabilities are identified and addressed in a timely manner',
            objective_type_objectives: [ 'SO1', 'SO2' ]
          },{
            cluster_id: 'protection',
            cluster: 'Protection',
            objective_type_id: 'protection_objective_2',
            objective_type_name: 'PROTECTION OBJECTIVE 2',
            objective_type_description: 'Evolving protection concerns, needs and violations are monitored, analysed and responded to, upholding fundamental rights and restoring the dignity and well-being of vulnerable shock affected populations',
            objective_type_objectives: [ 'SO3' ]
          },{
            cluster_id: 'protection',
            cluster: 'Protection',
            objective_type_id: 'protection_objective_3',
            objective_type_name: 'PROTECTION OBJECTIVE 3',
            objective_type_description: 'Support the creation of a protection-conducive environment to prevent and mitigate protection risks, as well as facilitate an effective response to protection violation',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          }],
          'wash':[{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_1',
            objective_type_name: 'WASH OBJECTIVE 1',
            objective_type_description: 'Ensure timely access to a sufficient quantity of safe drinking water, use of adequate and gender sensitive sanitation and appropriate means of hygiene practices by the affected population',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_2',
            objective_type_name: 'WASH OBJECTIVE 2',
            objective_type_description: 'Ensure timely and adequate access to WASH services in institutions affected by emergencies',
                objective_type_objectives: ['SO1', 'SO2', 'SO4'],
          },{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_3',
            objective_type_name: 'WASH OBJECTIVE 3',
            objective_type_description: 'Ensure timely and adequate assessments of WASH needs of the affected population',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_4',
            objective_type_name: 'WASH OBJECTIVE 4',
            objective_type_description: 'Two-year transition of cluster leadership of Ministry of Rural Rehabilitation and Development set in motion',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          }],
          'rnr_chapter': [{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            objective_type_id: 'project_rnr_chapter_objective_1',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 1',
            objective_type_description: 'Protection interventions provided to NWA refugees',
                objective_type_objectives: ['SO1'],
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            objective_type_id: 'project_rnr_chapter_objective_2',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 2',
            objective_type_description: 'Essential services delivered to returnees while pursuing durable solutions',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            objective_type_id: 'project_rnr_chapter_objective_3',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 3',
            objective_type_description: 'Immediate humanitarian needs for vulnerable refugee returnees, undocumented returnees and deportees are met',
            objective_type_objectives: [ 'SO1' ]
              }],
            },
            2018: {
              'cvwg': [{
                cluster_id: 'cvwg',
                cluster: 'Cash Voucher Working Group',
                objective_type_id: 'mpc_objective_1',
                objective_type_name: 'MPC OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need',
                objective_type_objectives: ['S01'],
                objective_year: 2018
              }],
              'eiewg': [{
                cluster_id: 'eiewg',
                cluster: 'EiEWG',
                objective_type_id: 'eiewg_objective_1',
                objective_type_name: 'EiEWG OBJECTIVE 1',
                objective_type_description: 'No objectives related to HRP for 2017',
                objective_type_objectives: [],
                objective_year: 2018
              }],
              'fsac': [{
                cluster_id: 'fsac',
                cluster: 'FSAC',
                objective_type_id: 'fsac_objective_1',
                objective_type_name: 'FSAC OBJECTIVE 1',
                objective_type_description: 'Ensure continued and regular access to food for the acute food insecure across the country',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
              }, {
                cluster_id: 'fsac',
                cluster: 'FSAC',
                objective_type_id: 'fsac_objective_2',
                objective_type_name: 'FSAC OBJECTIVE 2',
                objective_type_description: 'Protect and rehabilitate livelihoods for the vulnerable population at risk of hunger and malnutrition through appropriate response and linkages with development programme',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
              }, {
                cluster_id: 'fsac',
                cluster: 'FSAC',
                objective_type_id: 'fsac_objective_3',
                objective_type_name: 'FSAC OBJECTIVE 3',
                objective_type_description: 'Strengthen emergency preparedness and provide timely response in hard to reach areas through enhanced capacity of partners on assessment and contingency planning',
                objective_type_objectives: ['SO3'],
                objective_year: 2018
              }],
              'esnfi': [{
                cluster_id: 'esnfi',
                cluster: 'ESNFI',
                objective_type_id: 'esnfi_objective_1',
                objective_type_name: 'ESNFI OBJECTIVE 1',
                objective_type_description: 'Ensure timely, adequate access to shelter and non-food items for internally displaced and returnees assessed in need',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
              }, {
                cluster_id: 'esnfi',
                cluster: 'ESNFI',
                objective_type_id: 'esnfi_objective_2',
                objective_type_name: 'ESNFI OBJECTIVE 1',
                objective_type_description: 'Ensure that the living conditions of vulnerable people are improved',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
              }, {
                cluster_id: 'esnfi',
                cluster: 'ESNFI',
                objective_type_id: 'esnfi_objective_3',
                objective_type_name: 'ESNFI OBJECTIVE 1',
                objective_type_description: 'Ensure adequate response capacity through preparedness measures and prepositioning of emergency shelters and Non-Food Items',
                objective_type_objectives: ['SO3'],
                objective_year: 2018
              }],
              'health': [{
                cluster_id: 'health',
                cluster: 'Health',
                objective_type_id: 'health_objective_1',
                objective_type_name: 'HEALTH OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need: People suffering trauma related injuries because of the conflict receive life-saving treatment within the province where the injury was sustained in either existing medical facilities or new First Aid Trauma Posts',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
              }, {
                cluster_id: 'health',
                cluster: 'Health',
                objective_type_id: 'health_objective_2',
                objective_type_name: 'HEALTH OBJECTIVE 2',
                objective_type_description: 'Reduce protection violations and increase respect for International Humanitarian Law',
                objective_type_objectives: ['SO2'],
                objective_year: 2018
              }],
              'nutrition': [{
                cluster_id: 'nutrition',
                cluster: 'Nutrition',
                objective_type_id: 'nutrition_objective_1',
                objective_type_name: 'NUTRITION OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
              }],
              'protection': [{
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_1',
                objective_type_name: 'PROTECTION OBJECTIVE 1',
                objective_type_description: 'Parties increase measures to protect civilians based upon further harmonized POC/IHL advocacy by protection actors',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2018
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_2',
                objective_type_name: 'PROTECTION OBJECTIVE 2',
                objective_type_description: 'Child rights violations are monitored and verified to prevent and respond to the needs of children affected by emergencies',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2018
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_3',
                objective_type_name: 'PROTECTION OBJECTIVE 3',
                objective_type_description: 'Gender Based Violence incidents in emergencies are identified and survivors’ multi-sectorial needs are adequately responded to',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2018
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_4',
                objective_type_name: 'PROTECTION OBJECTIVE 4',
                objective_type_description: 'Vulnerable displaced persons are able to claim and exercise housing, land and property, as well as legal identity rights vital for achieving durable solutions',
                objective_type_objectives: ['SO1','SO3'],
                objective_year: 2018
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_5',
                objective_type_name: 'PROTECTION OBJECTIVE 5',
                objective_type_description: 'Reduce deaths and injuries from mines/ERW and promote inclusivity and rights of persons with disabilities, through education and clearance of high-impact mine/ERW and spot ERW contamination',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2018
              }],
              'wash': [{
                cluster_id: 'wash',
                cluster: 'Wash',
                objective_type_id: 'wash_objective_1',
                objective_type_name: 'WASH OBJECTIVE 1',
                objective_type_description: 'WASH related communicable diseases are reduced among IDP, returnee, refugee and non-displaced conflictaffected women, men and children of all ages through timely and adequate WASH assistance',
                objective_type_objectives: ['SO1', 'SO3'],
                objective_year: 2018
              }, {
                cluster_id: 'wash',
                cluster: 'Wash',
                objective_type_id: 'wash_objective_2',
                objective_type_name: 'WASH OBJECTIVE 2',
                objective_type_description: 'People affected by natural disasters –including severe weather conditions– are assessed and responded to in a timely manner preventing loss of life and risk of disease',
                objective_type_objectives: ['SO1', 'SO3'],
                objective_year: 2018
              }],
              'rnr_chapter': [{
                cluster_id: 'rnr_chapter',
                cluster: 'R&R Chapter',
                objective_type_id: 'project_rnr_chapter_objective_1',
                objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need',
                objective_type_objectives: ['SO1'],
                objective_year: 2018
          }]
            },
            2019: {
              'cvwg': [{
                cluster_id: 'cvwg',
                cluster: 'Cash Voucher Working Group',
                objective_type_id: 'mpc_objective_1',
                objective_type_name: 'MPC OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need',
                objective_type_objectives: ['S01'],
                objective_year: 2019
              }],
              'eiewg': [{
                cluster_id: 'eiewg',
                cluster: 'EiEWG',
                objective_type_id: 'eiewg_objective_1',
                objective_type_name: 'EiEWG OBJECTIVE 1',
                objective_type_description: 'No objectives related to HRP for 2017',
                objective_type_objectives: [],
                objective_year: 2019
              }],
              'fsac': [{
                cluster_id: 'fsac',
                cluster: 'FSAC',
                objective_type_id: 'fsac_objective_1',
                objective_type_name: 'FSAC OBJECTIVE 1',
                objective_type_description: 'Ensure continued and regular access to food for the acute food insecure across the country',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
              }, {
                cluster_id: 'fsac',
                cluster: 'FSAC',
                objective_type_id: 'fsac_objective_2',
                objective_type_name: 'FSAC OBJECTIVE 2',
                objective_type_description: 'Protect and rehabilitate livelihoods for the vulnerable population at risk of hunger and malnutrition through appropriate response and linkages with development programme',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
              }, {
                cluster_id: 'fsac',
                cluster: 'FSAC',
                objective_type_id: 'fsac_objective_3',
                objective_type_name: 'FSAC OBJECTIVE 3',
                objective_type_description: 'Strengthen emergency preparedness and provide timely response in hard to reach areas through enhanced capacity of partners on assessment and contingency planning',
                objective_type_objectives: ['SO3'],
                objective_year: 2019
              }],
              'esnfi': [{
                cluster_id: 'esnfi',
                cluster: 'ESNFI',
                objective_type_id: 'esnfi_objective_1',
                objective_type_name: 'ESNFI OBJECTIVE 1',
                objective_type_description: 'Ensure timely, adequate access to shelter and non-food items for internally displaced and returnees assessed in need',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
              }, {
                cluster_id: 'esnfi',
                cluster: 'ESNFI',
                objective_type_id: 'esnfi_objective_2',
                objective_type_name: 'ESNFI OBJECTIVE 1',
                objective_type_description: 'Ensure that the living conditions of vulnerable people are improved',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
              }, {
                cluster_id: 'esnfi',
                cluster: 'ESNFI',
                objective_type_id: 'esnfi_objective_3',
                objective_type_name: 'ESNFI OBJECTIVE 1',
                objective_type_description: 'Ensure adequate response capacity through preparedness measures and prepositioning of emergency shelters and Non-Food Items',
                objective_type_objectives: ['SO3'],
                objective_year: 2019
              }],
              'health': [{
                cluster_id: 'health',
                cluster: 'Health',
                objective_type_id: 'health_objective_1',
                objective_type_name: 'HEALTH OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need: People suffering trauma related injuries because of the conflict receive life-saving treatment within the province where the injury was sustained in either existing medical facilities or new First Aid Trauma Posts',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
              }, {
                cluster_id: 'health',
                cluster: 'Health',
                objective_type_id: 'health_objective_2',
                objective_type_name: 'HEALTH OBJECTIVE 2',
                objective_type_description: 'Reduce protection violations and increase respect for International Humanitarian Law',
                objective_type_objectives: ['SO2'],
                objective_year: 2019
              }],
              'nutrition': [{
                cluster_id: 'nutrition',
                cluster: 'Nutrition',
                objective_type_id: 'nutrition_objective_1',
                objective_type_name: 'NUTRITION OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
              }],
              'protection': [{
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_1',
                objective_type_name: 'PROTECTION OBJECTIVE 1',
                objective_type_description: 'Parties increase measures to protect civilians based upon further harmonized POC/IHL advocacy by protection actors',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2019
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_2',
                objective_type_name: 'PROTECTION OBJECTIVE 2',
                objective_type_description: 'Child rights violations are monitored and verified to prevent and respond to the needs of children affected by emergencies',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2019
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_3',
                objective_type_name: 'PROTECTION OBJECTIVE 3',
                objective_type_description: 'Gender Based Violence incidents in emergencies are identified and survivors’ multi-sectorial needs are adequately responded to',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2019
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_4',
                objective_type_name: 'PROTECTION OBJECTIVE 4',
                objective_type_description: 'Vulnerable displaced persons are able to claim and exercise housing, land and property, as well as legal identity rights vital for achieving durable solutions',
                objective_type_objectives: ['SO1','SO3'],
                objective_year: 2019
              }, {
                cluster_id: 'protection',
                cluster: 'Protection',
                objective_type_id: 'protection_objective_5',
                objective_type_name: 'PROTECTION OBJECTIVE 5',
                objective_type_description: 'Reduce deaths and injuries from mines/ERW and promote inclusivity and rights of persons with disabilities, through education and clearance of high-impact mine/ERW and spot ERW contamination',
                objective_type_objectives: ['SO1','SO2'],
                objective_year: 2019
              }],
              'wash': [{
                cluster_id: 'wash',
                cluster: 'Wash',
                objective_type_id: 'wash_objective_1',
                objective_type_name: 'WASH OBJECTIVE 1',
                objective_type_description: 'WASH related communicable diseases are reduced among IDP, returnee, refugee and non-displaced conflictaffected women, men and children of all ages through timely and adequate WASH assistance',
                objective_type_objectives: ['SO1', 'SO3'],
                objective_year: 2019
              }, {
                cluster_id: 'wash',
                cluster: 'Wash',
                objective_type_id: 'wash_objective_2',
                objective_type_name: 'WASH OBJECTIVE 2',
                objective_type_description: 'People affected by natural disasters –including severe weather conditions– are assessed and responded to in a timely manner preventing loss of life and risk of disease',
                objective_type_objectives: ['SO1', 'SO3'],
                objective_year: 2019
              }],
              'rnr_chapter': [{
                cluster_id: 'rnr_chapter',
                cluster: 'R&R Chapter',
                objective_type_id: 'project_rnr_chapter_objective_1',
                objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 1',
                objective_type_description: 'Save lives in the areas of highest need',
                objective_type_objectives: ['SO1'],
                objective_year: 2019
          }]
        }
          }
        }

        sub_strategic_objectives = {};
        for (var i = start_report_year; i <= end_report_year; i++) {
          if (strategic_objectives&&strategic_objectives[i]) sub_strategic_objectives[i] = strategic_objectives[i];
        }
        // return SO by cluster
        return sub_strategic_objectives;

      },

      // get HRP 2017 category
      getCategoryTypes: function(){

        // categories
        var category_types = [{
          cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash', 'eiewg', 'rnr_chapter' ],
          category_type_id: 'category_a',
          category_type_name: 'A) Emergency Relief Needs'
        },{
          cluster_id: [ 'cvwg', 'health', 'nutrition', 'protection', 'wash', 'rnr_chapter' ],
          category_type_id: 'category_b',
          category_type_name: 'B) Excess Morbidity and Mortality'
        },{
          cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'nutrition', 'protection', 'rnr_chapter' ],
          category_type_id: 'category_c',
          category_type_name: 'C) Shock-Induced Acute Vunerability'
        },{
          cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash', 'eiewg', 'rnr_chapter' ],
          category_type_id: 'category_d',
          category_type_name: 'D) Development'
        }];

        // return
        return category_types;
      },

			getUnits: function( admin0pcode ) {
				
        // filter by cluster?
        var units = [
            { cluster_id: [ 'fsac' ],
            unit_type_id: 'calls', unit_type_name: 'Calls', },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'kg', unit_type_name: 'KG', },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'doze', unit_type_name: 'Doze' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'quantin', unit_type_name: 'Quantin' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'seeds', unit_type_name: 'Seeds' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'livestock', unit_type_name: 'Livestock' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'cattle', unit_type_name: 'Cattle' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'sheep', unit_type_name: 'Sheep' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'goats', unit_type_name: 'Goats' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'camels', unit_type_name: 'Camels' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'donkeys', unit_type_name: 'Donkeys' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'equians', unit_type_name: 'Equians' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'm2', unit_type_name: 'm2' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'm3', unit_type_name: 'm3' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'kg', unit_type_name: 'KG' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'man_days', unit_type_name: 'Man Days' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'metric_tonnes', unit_type_name: 'Metric Tonnes' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'pieces', unit_type_name: 'Pieces' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'tablets', unit_type_name: 'Tablets' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'litres', unit_type_name: 'Litres' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'boxes', unit_type_name: 'Boxes' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'kits', unit_type_name: 'Kits' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'drums', unit_type_name: 'Drums' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'pac', unit_type_name: 'PAC' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'seeds', unit_type_name: 'Seeds' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'units', unit_type_name: 'Units' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'wheat', unit_type_name: 'Wheat' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'wheat_flour', unit_type_name: 'Wheat Flour' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'oil', unit_type_name: 'Oil' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'pulses', unit_type_name: 'Pulses' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'salt', unit_type_name: 'Salt' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'rice', unit_type_name: 'Rice' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'heb', unit_type_name: 'HEB' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'rusf', unit_type_name: 'RUSF' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'mnt', unit_type_name: 'MNT' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'facilities', unit_type_name: 'Facilities' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'structures', unit_type_name: 'Structures' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'sessions', unit_type_name: 'Sessions' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'tcs', unit_type_name: 'TCs' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'cbss', unit_type_name: 'CBSs' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'teachers', unit_type_name: 'People' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'teachers', unit_type_name: 'Teachers' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'tents', unit_type_name: 'Tents' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'classroom_kits', unit_type_name: 'Classroom Kits' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'school_kits', unit_type_name: 'School Kits' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'schools', unit_type_name: 'Schools' },
            { cluster_id: [ 'health' ],
              unit_type_id: 'centers', unit_type_name: 'Centers' },
            { cluster_id: [ 'health' ],
              unit_type_id: 'medics', unit_type_name: 'Medics' },
            { cluster_id: [ 'health' ],
              unit_type_id: 'health_extension_workers', unit_type_name: 'Health Extension Workers' },
            { cluster_id: [ 'esnfi' ],
              unit_type_id: 'houses', unit_type_name: 'Houses' },
            { cluster_id: [ 'esnfi' ],
            // ESNFI cash item types
              unit_type_id: 'afg', unit_type_name: 'AFG' },
            { cluster_id: [ 'esnfi' ],
              unit_type_id: 'USD', unit_type_name: 'USD' },    
          ];

        // unit type list
        var currencies=[];
        // add each currency
        angular.forEach( this.getCurrencies( admin0pcode ), function( d, i ){
					if(d.currency_id === 'afn'|| d.currency_id === 'usd'){
						currencies.push({ unit_type_id: d.currency_id, unit_type_name: d.currency_name, mpc_delivery_type_id:'cash' });
					}else{
						currencies.push({ unit_type_id: d.currency_id, unit_type_name: d.currency_name });
					}
        });
				units = currencies.concat( $filter( 'orderBy' )( units, 'unit_type_name' ) );

        // set to zero if CXB
        if ( admin0pcode === 'CB' ) {
          units = [];
        }
								
        return units;
      },

      // return ocha beneficiaries
      getBeneficiaries: function( year, admin0pcode, cluster_id ) {


        // default
        var beneficiaries = [{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idps',
            beneficiary_type_name: 'IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'drought_idps',
            beneficiary_type_name: 'Drought IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'flood_idps',
            beneficiary_type_name: 'Flood IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'natural_disaster_idps',
            beneficiary_type_name: 'Natural Disaster IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'conflict_idps',
            beneficiary_type_name: 'Conflict IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'returnees',
            beneficiary_type_name: 'Returnees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Host Communities'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'stakeholders',
            beneficiary_type_name: 'Stakeholders'
          }];

        // 2016
        if ( year === 2016 ) {
          beneficiaries = [{
            cluster_id: [ 'esnfi', 'health', 'wash', 'protection' ],
            beneficiary_type_id: 'conflict_displaced',
            beneficiary_type_name: 'Conflict IDPs'
          },{
            cluster_id: [ 'esnfi', 'health', 'wash' ],
            beneficiary_type_id: 'health_affected_conflict',
            beneficiary_type_name: 'Health Affected by Conflict'
          },{
            cluster_id: [ 'esnfi', 'health', 'wash', 'protection' ],
            beneficiary_type_id: 'natural_disaster_affected',
            beneficiary_type_name: 'Natural Disaster IDPs'
          },{
            cluster_id: [ 'esnfi', 'wash', 'protection' ],
            beneficiary_type_id: 'protracted_idps',
            beneficiary_type_name: 'Protracted IDPs'
          },{
            cluster_id: [ 'esnfi', 'health', 'wash', 'protection' ],
            beneficiary_type_id: 'refugees_returnees',
            beneficiary_type_name: 'Refugees & Returnees'
          },{
            cluster_id: [ 'esnfi', 'health', 'wash' ],
            beneficiary_type_id: 'white_area_population',
            beneficiary_type_name: 'White Area Population'
          }];

          // filter by cluster beneficiaries here
          beneficiaries = $filter( 'filter' )( beneficiaries, { cluster_id: cluster_id } );
        }

        if (  admin0pcode === 'CB' ) {
          // default
          beneficiaries = [{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Host Communities'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_wash_education,
            beneficiary_type_id: 'government_officials',
            beneficiary_type_name: 'Government Officials'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_wash_education,
            beneficiary_type_id: 'humanitarian_workers',
            beneficiary_type_name: 'Humanitarian Workers'
          },{
            cluster_id: [ 'fss' ],
            beneficiary_type_id: 'private_sector',
            beneficiary_type_name: 'Private Sector'
          },{
            cluster_id: [ 'fss' ],
            beneficiary_type_id: 'service_provider',
            beneficiary_type_name: 'Service Provider'
          }];
        }

        // admin COL

        if (  admin0pcode === 'COL' ) {
          // default
          var beneficiaries = [

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'afectados_por_deslizamientos',
            beneficiary_type_name: 'Afectados por deslizamientos'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'afectados_por_inundaciones',
            beneficiary_type_name: 'Afectados por inundaciones'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'afectados_por_otro_tipo_de_desastres_naturales',
            beneficiary_type_name: 'Afectados por otro tipo de desastres naturales'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'afectados_por_sequias',
            beneficiary_type_name: 'Afectados por sequias'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'afectados_por_vendavales',
            beneficiary_type_name: 'Afectados por vendavales'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Comunidades receptoras'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'lideres_lideresas_sociales_amenazados',
            beneficiary_type_name: 'Líderes / lideresas sociales amenazados'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'migrantes',
            beneficiary_type_name: 'Migrantes'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'mujeres_lactantes_gestantes',
            beneficiary_type_name: 'Mujeres lactantes / gestantes'
          },
          
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'personas_confinadas',
            beneficiary_type_name: 'Personas confinadas'
          }  
          ,
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'personas_desplazadas_internamente',
            beneficiary_type_name: 'Personas desplazadas internamente (individual)'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'personas_desplazadas_internamente',
            beneficiary_type_name: 'Personas desplazadas internamente (masivo)'
          },
           
          
           {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'poblacion_con_doble_afectacion_conflicto_y_desastres',
            beneficiary_type_name: 'Población con doble afectación (conflicto y desastres)'
          },  


          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'poblacion_con_multiples_afectaciones',
            beneficiary_type_name: 'Población con múltiples afectaciones'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'poblacion_en_situacion_de_discapacidad',
            beneficiary_type_name: 'Población en situación de discapacidad'

          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'poblacion_lgbttti',
            beneficiary_type_name: 'Población LGBTTTI'

          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'poblacion_vulnerable',
            beneficiary_type_name: 'Población vulnerable'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugiados'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'returnees',
            beneficiary_type_name: 'Retornados'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'solicitantes_de_asilo',
            beneficiary_type_name: 'Solicitantes de asilo'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_de_aei',
            beneficiary_type_name: 'Víctimas de AEI'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'sex_crimes_victims',
            beneficiary_type_name: 'Víctimas de Delitos Sexuales'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_del_conflicto_armado_en_general',
            beneficiary_type_name: 'Víctimas del conflicto armado en general'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_de_map',
            beneficiary_type_name: 'Víctimas de MAP'
          },

           {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_de_map_muse_aei_en_general',
            beneficiary_type_name: 'Víctimas de MAP / MUSE / AEI en general'
          },

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_de_muse',
            beneficiary_type_name: 'Víctimas de MUSE'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_de_otras_violencias_basadas_en_genero',
            beneficiary_type_name: 'Víctimas de otras violencias basadas en género'
          },
          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'victimas_de_reclutamiento_forzado',
            beneficiary_type_name: 'Víctimas de reclutamiento forzado'
          },
          

          {
            cluster_id: ngmClusterLists.all_sectors_col,
            beneficiary_type_id: 'otros',
            beneficiary_type_name: 'Otros'
          }
          

          ];

        }

        // admin SS
        if ( admin0pcode === 'SS' ) {
          // beneficiaries
          beneficiaries = [{
              cluster_id: ngmClusterLists.all_sectors,
              beneficiary_type_id: 'idps',
              beneficiary_type_name: 'IDPs'
            },{
              cluster_id: ngmClusterLists.all_sectors,
              beneficiary_type_id: 'refugees',
              beneficiary_type_name: 'Refugees'
            },{
              cluster_id: ngmClusterLists.all_sectors,
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: ngmClusterLists.all_sectors,
              beneficiary_type_id: 'otherwise_affected',
              beneficiary_type_name: 'Otherwise Affected'
            }];
        }

        // admin SO
        if ( admin0pcode === 'SO' ) {
          
          // beneficiaries
          beneficiaries = [{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idps',
            beneficiary_type_name: 'IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'drought_idps',
            beneficiary_type_name: 'Drought IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'flood_idps',
            beneficiary_type_name: 'Flood IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'conflict_idps',
            beneficiary_type_name: 'Conflict IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'returnees',
            beneficiary_type_name: 'Returnees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Host Communities'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'health_care_workers',
            beneficiary_type_name: 'Health Care Workers'
          }];          
        }

        // admin ET
        if ( admin0pcode === 'ET' ) {

          // beneficiaries
          beneficiaries = [{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idps',
            beneficiary_type_name: 'IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idp_conflict',
            beneficiary_type_name: 'Conflict IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idp_drought',
            beneficiary_type_name: 'Drought Affected IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idp_flood',
            beneficiary_type_name: 'Flood Affected IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idp_natural_disaster',
            beneficiary_type_name: 'Natural Disaster IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idp_returnee',
            beneficiary_type_name: 'Returnee IDPs'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'returnees',
            beneficiary_type_name: 'Returnees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugees'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'health_workers',
            beneficiary_type_name: 'Health Workers'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'social_workers',
            beneficiary_type_name: 'Social Workers'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Host Communities'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'conflict_affected',
            beneficiary_type_name: 'Conflict Affected'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'idp_natural_affected',
            beneficiary_type_name: 'Natural Disaster Affected'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            beneficiary_type_id: 'vulnerable_groups',
            beneficiary_type_name: 'Vulnerable Groups'
          }];

        } else if ( admin0pcode === 'AF' ) {
          // #TODO put it on config

          // ocha beneficiaries list
          if (year === 2017){

              beneficiaries = [{

                // Conflict Affected / Conflict IDPs

                // CAT A) conflict affected / conflict idps
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'conflict_affected',
                beneficiary_type_name: 'Conflict Affected'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs (Recent)'
              },{
              //   cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
              //   category_type_id: [ 'category_a' ],
              //   beneficiary_type_id: 'idp_conflict_natural_disaster',
              //   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
              // },{
                // CAT B) conflict affected / conflict idps
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'conflict_affected',
                beneficiary_type_name: 'Conflict Affected'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs (Recent)'
              },{
              //   cluster_id: [ 'wash' ],
              //   category_type_id: [ 'category_b' ],
              //   beneficiary_type_id: 'idp_conflict_natural_disaster',
              //   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
              // },{
                // CAT C) conflict affected / conflict idps
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection',  ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'conflict_affected',
                beneficiary_type_name: 'Conflict Affected'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection',  ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs'
              },{
              //   cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection',  ],
              //   category_type_id: [ 'category_c' ],
              //   beneficiary_type_id: 'idp_conflict_natural_disaster',
              //   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
              // },{
                // CAT D) conflict affected / conflict idps
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'conflict_affected',
                beneficiary_type_name: 'Conflict Affected'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs (Recent)'
              },{
              //   cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
              //   category_type_id: [ 'category_d' ],
              //   beneficiary_type_id: 'idp_conflict_natural_disaster',
              //   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
              // },{


                // Natural Disaster

                // CAT A) Natural Disaster
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'idp_natural_disaster',
                beneficiary_type_name: 'Natural Disaster IDPs'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'natural_disaster_affected',
                beneficiary_type_name: 'Natural Disaster Affected'
              },{
                // CAT B) Natural Disaster
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'idp_natural_disaster',
                beneficiary_type_name: 'Natural Disaster IDPs'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'natural_disaster_affected',
                beneficiary_type_name: 'Natural Disaster Affected'
              },{
                // CAT C) Natural Disaster
                cluster_id: [ 'esnfi' ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'idp_natural_disaster',
                beneficiary_type_name: 'Natural Disaster IDPs'
              },{
                cluster_id: [ 'esnfi' ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'natural_disaster_affected',
                beneficiary_type_name: 'Natural Disaster Affected'
              },{
                // CAT D) Natural Disaster
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'idp_natural_disaster',
                beneficiary_type_name: 'Natural Disaster IDPs'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'natural_disaster_affected',
                beneficiary_type_name: 'Natural Disaster Affected'
              },{


                // FSAC

                // CAT A), CAT B), Conflict, Natural Disaster
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs ( Returnees )'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs ( Refugee Returnees )'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'idp_conflict',
                beneficiary_type_name: 'Conflict IDPs ( Deportee Returnees )'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'natural_disaster_affected_earthquake',
                beneficiary_type_name: 'Natural Disaster Affected (Earthquake)'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'natural_disaster_affected_flood',
                beneficiary_type_name: 'Natural Disaster Affected (Flood)'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'natural_disaster_affected_drought',
                beneficiary_type_name: 'Natural Disaster Affected (Drought)'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'natural_disaster_affected_wls',
                beneficiary_type_name: 'Natural Disaster Affected (Winter / Lean Season)'
              },{
                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_a', 'category_c' ],
                beneficiary_type_id: 'natural_disaster_affected_locust',
                beneficiary_type_name: 'Natural Disaster Affected (Locust)'
              },{


                // Refugees, IDPs

                // CAT A), Cat B), Cat C), Protracted IDPs
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection' ],
                category_type_id: [ 'category_a', 'category_b', 'category_c' ],
                beneficiary_type_id: 'idp_protracted',
                beneficiary_type_name: 'Protracted IDPs'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_a', 'category_b' ],
                beneficiary_type_id: 'idp_protracted',
                beneficiary_type_name: 'Conflict IDPs (Prolonged)'
              },{
                // CAT A)
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'returnee_documented',
                beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'returnee_undocumented',
                beneficiary_type_name: 'Afghan Returnees (Undocumented)'
              },{
                // CAT B)
                cluster_id: [ 'nutrition', 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'returnee_documented',
                beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
              },{
                cluster_id: [ 'nutrition', 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'returnee_undocumented',
                beneficiary_type_name: 'Afghan Returnees (Undocumented)'
              },{
                cluster_id: [ 'cvwg', 'health', 'nutrition', 'wash' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'refugee_pakistani',
                beneficiary_type_name: 'Pakistani Refugees'
              },{
                // CAT C)
                cluster_id: [ 'cvwg', 'esnfi', 'protection' ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'returnee_documented',
                beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'protection' ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'returnee_undocumented',
                beneficiary_type_name: 'Afghan Returnees (Undocumented)'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection' ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'refugee_pakistani',
                beneficiary_type_name: 'Pakistani Refugees'
              },{
                // Cat D)
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'returnee_documented',
                beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'returnee_undocumented',
                beneficiary_type_name: 'Afghan Returnees (Undocumented)'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'refugee_pakistani',
                beneficiary_type_name: 'Pakistani Refugees'
              },{


                // EiEWG

                // CAT A), Refugees & Returnees
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'displaced_children',
                beneficiary_type_name: 'Displaced Children'
              },{
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'displaced_refugee_children',
                beneficiary_type_name: 'Displaced + Refugee Children'
              },{
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'displaced_returnee_children',
                beneficiary_type_name: 'Displaced + Returnee Children'
              },{
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'host_community_children',
                beneficiary_type_name: 'Host Community Children'
              },{
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'returnee_refugee_children',
                beneficiary_type_name: 'Returnee Refugee Children'
              },{
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'refugee_children',
                beneficiary_type_name: 'Refugee Children'
              },{
                cluster_id: [ 'eiewg' ],
                category_type_id: [ 'category_a', 'category_d' ],
                beneficiary_type_id: 'returnee_children',
                beneficiary_type_name: 'Returnee Children'
              },{


                // WASH

                // CAT A), host communities
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'host_communities_disaster_idps',
                beneficiary_type_name: 'Communities Hosting Natural Disasater IDPs'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'host_communities_conflict_idps',
                beneficiary_type_name: 'Communities Hosting Conflict IDPs'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'host_communities_returnees',
                beneficiary_type_name: 'Communities Hosting Returnees'
              },{
                cluster_id: [ 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'host_communities_refugees',
                beneficiary_type_name: 'Communities Hosting Refugees'
              },{

                // Host Communities

                // CAT A), host communities
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
                category_type_id: [ 'category_a' ],
                beneficiary_type_id: 'host_communities',
                beneficiary_type_name: 'Host Communities'
              },{
                cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'host_communities',
                beneficiary_type_name: 'Host Communities'
              },{


                // Access to services

                // CAT B)

                cluster_id: [ 'health' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'access_to_services',
                beneficiary_type_name: 'White Area Population'
              },{
                cluster_id: [ 'wash', 'protection' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'access_to_services',
                beneficiary_type_name: 'Underserved Community'
              },{
                cluster_id: [ 'cvwg', 'nutrition' ],
                category_type_id: [ 'category_b' ],
                beneficiary_type_id: 'access_to_services',
                beneficiary_type_name: 'Access to Services'
              },{


                // FASC

                // food insecture

                cluster_id: [ 'fsac' ],
                category_type_id: [ 'category_c' ],
                beneficiary_type_id: 'severely_food_insecure',
                beneficiary_type_name: 'Severely Food Insecure'
              },{


                // RnR Chapter

                // CAT A), CAT B), CAT C),
                cluster_id: [ 'rnr_chapter' ],
                category_type_id: [ 'category_a', 'category_b', 'category_c' ],
                beneficiary_type_id: 'returnee_documented',
                beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
              },{
                cluster_id: [ 'rnr_chapter' ],
                category_type_id: [ 'category_a', 'category_b', 'category_c' ],
                beneficiary_type_id: 'returnee_undocumented',
                beneficiary_type_name: 'Afghan Returnees (Undocumented)'
              },{
                cluster_id: [ 'rnr_chapter' ],
                category_type_id: [ 'category_a', 'category_b', 'category_c' ],
                beneficiary_type_id: 'refugee_pakistani',
                beneficiary_type_name: 'Pakistani Refugees'
              },{

                // HEALTH

                // CAT D) Others

                cluster_id: [ 'health' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'health_workers',
                beneficiary_type_name: 'Health Workers'
              },{
                cluster_id: [ 'health' ],
                category_type_id: [ 'category_d' ],
                beneficiary_type_id: 'other_beneficiaries',
                beneficiary_type_name: 'Other Beneficiaries'
              }];

          } else if (year === 2018){

            beneficiaries = [{

              // WASH

              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs (Recent)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected Community'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected Community People'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Conflict IDPs (Prolonged)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_disaster_idps',
              beneficiary_type_name: 'Communities Hosting Natural Disasater IDPs'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_conflict_idps',
              beneficiary_type_name: 'Communities Hosting Conflict IDPs'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_returnees',
              beneficiary_type_name: 'Communities Hosting Returnees'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_refugees',
              beneficiary_type_name: 'Communities Hosting Refugees'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'Underserved Community'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{

              // FSAC

              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_earthquake',
              beneficiary_type_name: 'Natural Disaster Affected (Earthquake)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_flood',
              beneficiary_type_name: 'Natural Disaster Affected (Flood)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_drought',
              beneficiary_type_name: 'Natural Disaster Affected (Drought)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_wls',
              beneficiary_type_name: 'Natural Disaster Affected (Winter / Lean Season)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_locust',
              beneficiary_type_name: 'Natural Disaster Affected (Locust)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'conflict_affected_non_displaced',
              beneficiary_type_name: 'Conflict Affected Non Displaced'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{

              // CASH

              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'conflict_affected_non_displaced',
              beneficiary_type_name: 'Conflict Affected Non Displaced'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_undocumented_border',
              beneficiary_type_name: 'Undoc. returnee (border)'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_undocumented_settlement',
              beneficiary_type_name: 'Undoc. returnee (settlement)'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_documented_encashment_center',
              beneficiary_type_name: 'Refugee returnee (documented) - encashment center'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_documented_settlement',
              beneficiary_type_name: 'Refugee returnee (documented) - settlement'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{

              // HEALTH
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'White Area Population'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'health_workers',
              beneficiary_type_name: 'Health Workers'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'other_beneficiaries',
              beneficiary_type_name: 'Other Beneficiaries'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp',
              beneficiary_type_name: 'IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'chronic_emergency',
              beneficiary_type_name: 'Chronic Emergency'
            },{

              // NUTRITION
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'Access to Services'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{

              // ESNFI

              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{

              // Protection

              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'Underserved Community'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{

              // EIEWG

              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'displaced_children',
              beneficiary_type_name: 'Displaced Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'displaced_refugee_children',
              beneficiary_type_name: 'Displaced + Refugee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'displaced_returnee_children',
              beneficiary_type_name: 'Displaced + Returnee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'host_community_children',
              beneficiary_type_name: 'Host Community Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'returnee_refugee_children',
              beneficiary_type_name: 'Returnee Refugee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'refugee_children',
              beneficiary_type_name: 'Refugee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'returnee_children',
              beneficiary_type_name: 'Returnee Children'
            }];
          } else if (year >= 2019){

            beneficiaries = [{

              // WASH

              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs (Recent)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected Community'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected Community People'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Conflict IDPs (Prolonged)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_disaster_idps',
              beneficiary_type_name: 'Communities Hosting Natural Disasater IDPs'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_conflict_idps',
              beneficiary_type_name: 'Communities Hosting Conflict IDPs'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_returnees',
              beneficiary_type_name: 'Communities Hosting Returnees'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'host_communities_refugees',
              beneficiary_type_name: 'Communities Hosting Refugees'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'Underserved Community'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'drought_affected_non_displaced_response',
              beneficiary_type_name: 'Drought Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'drought_affected_displaced_response',
              beneficiary_type_name: 'Drought Affected Displaced ( Response )'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'wash' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{

              // FSAC

              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict Affected IDPs'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'drought_affected_non_displaced_response',
              beneficiary_type_name: 'Drought Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'drought_affected_displaced_response',
              beneficiary_type_name: 'Drought Affected Displaced ( Response )'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_earthquake',
              beneficiary_type_name: 'Natural Disaster Affected (Earthquake)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_flood',
              beneficiary_type_name: 'Natural Disaster Affected (Flood)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_avalanche',
              beneficiary_type_name: 'Natural Disaster Affected (Avalanche)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_wls',
              beneficiary_type_name: 'Natural Disaster Affected (Winter / Lean Season)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'natural_disaster_affected_locust',
              beneficiary_type_name: 'Natural Disaster Affected (Locust)'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_documented_border_pakistan',
              beneficiary_type_name: 'Afghan Refugee Returnees from Pakistan (Documented) - Border'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_documented_border_iran',
              beneficiary_type_name: 'Afghan Refugee Returnees from Iran (Documented) - Border'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_documented_settlement_pakistan',
              beneficiary_type_name: 'Afghan Refugee Returnees from Pakistan (Documented) - Settlement'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_documented_settlement_iran',
              beneficiary_type_name: 'Afghan Refugee Returnees from Iran (Documented) - Settlement'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_undocumented_border_pakistan',
              beneficiary_type_name: 'Afghan Returnees from Pakistan (Undocumented) - Border'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_undocumented_border_iran',
              beneficiary_type_name: 'Afghan Returnees from Iran (Undocumented) - Border'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_undocumented_settlement_pakistan',
              beneficiary_type_name: 'Afghan Returnees from Pakistan (Undocumented) - Settlement'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'afghan_refugee_returnees_undocumented_settlement_iran',
              beneficiary_type_name: 'Afghan Returnees from Iran (Undocumented) - Settlement'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'fsac' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{

              // CASH

              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'conflict_affected_non_displaced',
              beneficiary_type_name: 'Conflict Affected Non Displaced'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_undocumented_border',
              beneficiary_type_name: 'Undoc. returnee (border)'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_undocumented_settlement',
              beneficiary_type_name: 'Undoc. returnee (settlement)'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_documented_encashment_center',
              beneficiary_type_name: 'Refugee returnee (documented) - encashment center'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'returnee_documented_settlement',
              beneficiary_type_name: 'Refugee returnee (documented) - settlement'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'drought_affected_non_displaced',
              beneficiary_type_name: 'Drought Affected Non Displaced'
            },{
              cluster_id: [ 'cvwg' ],
              beneficiary_type_id: 'drought_affected_displaced',
              beneficiary_type_name: 'Drought Affected Displaced'
            },{

              // HEALTH
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'White Area Population'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'health_workers',
              beneficiary_type_name: 'Health Workers'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'other_beneficiaries',
              beneficiary_type_name: 'Other Beneficiaries'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp',
              beneficiary_type_name: 'IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'drought_affected_non_displaced_response',
              beneficiary_type_name: 'Drought Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'drought_affected_displaced_response',
              beneficiary_type_name: 'Drought Affected Displaced ( Response )'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'chronic_emergency',
              beneficiary_type_name: 'Chronic Emergency'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'health' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{

              // NUTRITION
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'Access to Services'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'refugee_pakistani',
              beneficiary_type_name: 'Pakistani Refugees'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'drought_affected_non_displaced_response',
              beneficiary_type_name: 'Drought Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'drought_affected_displaced_response',
              beneficiary_type_name: 'Drought Affected Displaced ( Response )'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'nutrition' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{

              // ESNFI

              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'drought_affected_non_displaced_response',
              beneficiary_type_name: 'Drought Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'drought_affected_displaced_response',
              beneficiary_type_name: 'Drought Affected Displaced ( Response )'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'esnfi' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{

              // Protection

              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'access_to_services',
              beneficiary_type_name: 'Underserved Community'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'returnee_documented',
              beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'returnee_undocumented',
              beneficiary_type_name: 'Afghan Returnees (Undocumented)'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'conflict_affected',
              beneficiary_type_name: 'Conflict Affected'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'idp_conflict',
              beneficiary_type_name: 'Conflict IDPs'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'host_communities',
              beneficiary_type_name: 'Host Communities'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'idp_natural_disaster',
              beneficiary_type_name: 'Natural Disaster IDPs'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'natural_disaster_affected',
              beneficiary_type_name: 'Natural Disaster Affected'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'idp_protracted',
              beneficiary_type_name: 'Protracted IDPs'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'drought_affected_non_displaced_response',
              beneficiary_type_name: 'Drought Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'drought_affected_displaced_response',
              beneficiary_type_name: 'Drought Affected Displaced ( Response )'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'protection' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },{

              // EIEWG

              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'displaced_children',
              beneficiary_type_name: 'Displaced Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'displaced_refugee_children',
              beneficiary_type_name: 'Displaced + Refugee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'displaced_returnee_children',
              beneficiary_type_name: 'Displaced + Returnee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'host_community_children',
              beneficiary_type_name: 'Host Community Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'returnee_refugee_children',
              beneficiary_type_name: 'Returnee Refugee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'refugee_children',
              beneficiary_type_name: 'Refugee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'returnee_children',
              beneficiary_type_name: 'Returnee Children'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'flood_affected_non_displaced_response',
              beneficiary_type_name: 'Flood Affected Non Displaced ( Response )'
            },{
              cluster_id: [ 'eiewg' ],
              beneficiary_type_id: 'flood_affected_displaced_response',
              beneficiary_type_name: 'Flood Affected Displaced ( Response )'
            },];
          }

        }

        // filter by cluster beneficiaries here
        return beneficiaries;

      },

      getBeneficiariesCategories: function(){

        var beneficiary_categories = [

        {
            beneficiary_category_id: 'indigenas',
            beneficiary_category_name: 'Indígenas'
          },

        {
            beneficiary_category_id: 'afrocolombianos',
            beneficiary_category_name: 'Afrocolombianos'
          }
          ,{
            beneficiary_category_id: 'comunidades_negras_negro_palenquero_sanbasilio_raizal_archipielago_sanandres_providencia',
            beneficiary_category_name: 'Comunidades negras (negro ó palenquero de San Basilio ó Raizal del archipiélago de San Andrés y Providencia)' 
          },
          {
            beneficiary_category_id: 'rom_o_gitano',
            beneficiary_category_name: 'ROM ó Gitano'
          },
          {
            beneficiary_category_id: 'ninguna',
            beneficiary_category_name: 'Ninguna'
          },
          {
            beneficiary_category_id: 'sin_informacion',
            beneficiary_category_name: 'Sin información'
          }];

        return beneficiary_categories;

      },

      // get location groups
      // getLocationGroups: function(){

      //   var groups = 12;
      //   var locations = 20;

      //   var location_groups = []
      //   for( var i=1; i<=groups; i++ ){
      //     var id = i.toString();
      //     if ( id.length === 1 ) {
      //       id = '0' + id;
      //     }
      //     location_groups.push({
      //       location_group_id: 'location_group_' + id,
      //       location_group_name: 'Location Group ' + id
      //     });
      //   }
      //   return location_groups;

      // },

      // get site implementation
      getSiteImplementation: function( admin0pcode, cluster_id ){
        var site_implementation = [];
        if ( cluster_id === 'eiewg'  ) {
          site_implementation = [{
            site_implementation_id: 'formal',
            site_implementation_name: 'Formal'
          },{
            site_implementation_id: 'informal',
            site_implementation_name: 'Informal'
          }];
        } else if ( admin0pcode === 'AF' ){
          site_implementation = [{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'community_based',
            site_implementation_name: 'Community Based'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'local_committee',
            site_implementation_name: 'Local Committee'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'family_protection_center',
            site_implementation_name: 'Family Protection Center'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'woman_friendly_health_space',
            site_implementation_name: 'Woman Friendly Health Space'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'mobile_outreach_team',
            site_implementation_name: 'Mobile Outreach Team ( MOT )'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'mhnt',
            site_implementation_name: 'MHNT'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'mpt',
            site_implementation_name: 'MPT'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'ctc',
            site_implementation_name: 'CTC'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'ctu',
            site_implementation_name: 'CTU'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'orp',
            site_implementation_name: 'ORP'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_implementation_id: 'clinic',
            site_implementation_name: 'Clinic'
          }];
        } else if( admin0pcode === 'COL' ){
          site_implementation = [
          {
            site_implementation_id: 'apoyo_comunitario',
            site_implementation_name: 'Apoyo Comunitario'
          },
          {
            site_implementation_id: 'apoyo_institucional',
            site_implementation_name: 'Apoyo Institucional'
          },
          {
            site_implementation_id: 'apoyo_individual_familiar',
            site_implementation_name: 'Apoyo Individual/Familiar'
          },
          {
            site_implementation_id: 'otro',
            site_implementation_name: 'Otro'
          }
          

          ];

        }

        else {
          site_implementation = [{
            site_implementation_id: 'community_based',
            site_implementation_name: 'Community Based'
          },{
            site_implementation_id: 'child_friendly_sapce',
            site_implementation_name: 'Child Friendly Sapce'
          },{
            site_implementation_id: 'women_friendly_sapce',
            site_implementation_name: 'Women Friendly Sapce'
          },{
            site_implementation_id: 'feeding_center',
            site_implementation_name: 'Feeding Center'
          },{
            site_implementation_id: 'stabalization_center',
            site_implementation_name: 'Stabalization Center'
          },{
            site_implementation_id: 'food_distribution_point_gfd',
            site_implementation_name: 'Food Distribution Point (GFD)'
          },{
            site_implementation_id: 'e_voucher_outlet_food',
            site_implementation_name: 'E-Voucher Outlet (Food)'
          },{
            site_implementation_id: 'mhnt',
            site_implementation_name: 'MHNT'
          },{
            site_implementation_id: 'mpt',
            site_implementation_name: 'MPT'
          },{
            site_implementation_id: 'ctc',
            site_implementation_name: 'CTC'
          },{
            site_implementation_id: 'ctu',
            site_implementation_name: 'CTU'
          },{
            site_implementation_id: 'orp',
            site_implementation_name: 'ORP'
          },{
            site_implementation_id: 'clinic',
            site_implementation_name: 'Clinic'
          }];

        }

        return site_implementation;
      },

      // health site types
      getSiteTypes: function( cluster_id, admin0pcode ) {

        // site_type
        var site_types = [{
            site_type_id: 'multiple_sites',
            site_type_name: 'Multiple Sites'
          },{
            site_type_id: 'host_community',
            site_type_name: 'Host Community'
          },{
            site_type_id: 'settlement',
            site_type_name: 'Settlement'
          },{
            site_type_id: 'schools',
            site_type_name: 'School'
          },{
            site_type_id: 'hospital',
            site_type_name: 'Hospital'
          },{
            site_type_id: 'health_center',
            site_type_name: 'Health Center'
          },{
            site_type_id: 'health_post',
            site_type_name: 'Health Post'
          },{
            site_type_id: 'idp_site',
            site_type_name: 'IDP Site'
          },{
            site_type_id: 'refugee_site',
            site_type_name: 'Refugee Site'
          }];

        // health and not ET
        if ( admin0pcode === 'AF' ) {
          site_types = [{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'multiple_sites',
            site_type_name: 'Multiple Sites'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'host_community',
            site_type_name: 'Host Community'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'collective_settlement',
            site_type_name: 'Settlement'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'village',
            site_type_name: 'Village'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'schools',
            site_type_name: 'School'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'RH',
            site_type_name: 'RH'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'PH',
            site_type_name: 'PH'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'DH',
            site_type_name: 'DH'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'CHC',
            site_type_name: 'CHC'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'CHC+FATP',
            site_type_name: 'CHC + FATP'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'BHC',
            site_type_name: 'BHC'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'BHC+FATP',
            site_type_name: 'BHC + FATP'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'FHH',
            site_type_name: 'FHH'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'SHC',
            site_type_name: 'SHC'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'MHT',
            site_type_name: 'MHT'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'RRT',
            site_type_name: 'RRT'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'FATP',
            site_type_name: 'FATP'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'DATC',
            site_type_name: 'DATC'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'special_hospital',
            site_type_name: 'Special Hospital'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'rehabilitation_center',
            site_type_name: 'Rehabilitation Center'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'nutrition_center',
            site_type_name: 'Nutrition Center'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'idp_site',
            site_type_name: 'IDP Site'
          },{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'refugee_site',
            site_type_name: 'Refugee Site' 
          }];
        }


        // Cox bazar
        if ( admin0pcode === 'CB' ) {
          site_types = [{
            cluster_id: ngmClusterLists.all_sectors,
            site_type_id: 'union',
            site_type_name: 'Union'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_health,
            site_type_id: 'ward',
            site_type_name: 'Ward'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_health,
            site_type_id: 'host_community',
            site_type_name: 'Host Community'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_health,
            site_type_id: 'refugee_camp',
            site_type_name: 'Refugee Camp'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_wash_health,
            site_type_id: 'refugee_block',
            site_type_name: 'Refugee Block'
          },{
            cluster_id: [ 'fss' ],
            site_type_id: 'food_distribution_point',
            site_type_name: 'Food Distribution Point'
          },{
            cluster_id: [ 'fss' ],
            site_type_id: 'retail_store',
            site_type_name: 'Retail Store'
          },{
            cluster_id: [ 'fss' ],
            site_type_id: 'cyclone_shelter',
            site_type_name: 'Cyclone Shelter'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'plantation',
            site_type_name: 'Plantation'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_health,
            site_type_id: 'school',
            site_type_name: 'School'
          },{
            cluster_id: [ 'health' ],
            site_type_id: 'health_facility_camp',
            site_type_name: 'Health Facility (Refugees)'
          },{
            cluster_id: [ 'health' ],
            site_type_id: 'health_facility_host_community',
            site_type_name: 'Health Facility (Host Community)'
          },{
            cluster_id: [ 'health' ],
            site_type_id: 'refugee_camp',
            site_type_name: 'Non-Facility Based (Refugees)'
          },{
            cluster_id: [ 'health' ],
            site_type_id: 'host_community',
            site_type_name: 'Non-Facility Based (Host Community)'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'access_road',
            site_type_name: 'Access Road'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'access_road_and_drainage',
            site_type_name: 'Access Road and Drainage'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'bamboo_bridge',
            site_type_name: 'Bamboo Bridge'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'canal_re_excavation',
            site_type_name: 'Canal Re-excavation'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'culvert',
            site_type_name: 'Culvert'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'cyclone_shelter',
            site_type_name: 'Cyclone Shelter'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'dam',
            site_type_name: 'Dam'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'drainage',
            site_type_name: 'Drainage'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'enbankment',
            site_type_name: 'Enbankment'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'fencing',
            site_type_name: 'Fencing'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'pathway',
            site_type_name: 'Pathway'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'pathway_and_canal_pond_re_excavation',
            site_type_name: 'Pathway and Canal/pond Re-Excavation'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'pathway_and_drainage',
            site_type_name: 'Pathway and Drainage'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'rehabilitation_cyclone_shelters',
            site_type_name: 'Rehabilitation of Cyclone Shelters'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'road_construction',
            site_type_name: 'Road Construction'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'road_rehabilitation',
            site_type_name: 'Road Rehabilitation'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'slope_protection',
            site_type_name: 'Slope Protection'
          },{
            cluster_id: [ 'smsd' ],
            site_type_id: 'stair',
            site_type_name: 'Stair'
          },{
            cluster_id: ngmClusterLists.all_sectors_minus_wash_health_smsd,
            site_type_id: 'nutrition_center',
            site_type_name: 'Nutrition Center'
          }];
        }

        // eiewg
        if ( cluster_id === 'eiewg' ) {
          site_types = [{
            site_implementation_id: 'formal',
            site_type_id: 'higher',
            site_type_name: 'Higher'
          },{
            site_implementation_id: 'formal',
            site_type_id: 'secondary',
            site_type_name: 'Secondary'
          },{
            site_implementation_id: 'formal',
            site_type_id: 'primary',
            site_type_name: 'Primary'
          },{
            site_implementation_id: 'formal',
            site_type_id: 'ECD',
            site_type_name: 'ECD'
          },{
            site_implementation_id: 'formal',
            site_type_id: 'TC',
            site_type_name: 'TC'
          },{
            site_implementation_id: 'informal',
            site_type_id: 'ALC',
            site_type_name: 'ALC'
          },{
            site_implementation_id: 'informal',
            site_type_id: 'CBS',
            site_type_name: 'CBS'
          }]
        }

        // et
        if ( admin0pcode === 'ET' ) {
          site_types = [{
            site_type_id: 'multiple_sites',
            site_type_name: 'Multiple Sites'
          },{
            site_type_id: 'settlement',
            site_type_name: 'Settlement'
          },{
            site_type_id: 'hospital',
            site_type_name: 'Hospital'
          },{
            site_type_id: 'health_center',
            site_type_name: 'Health Center'
          },{
            site_type_id: 'health_post',
            site_type_name: 'Health Post'
          },{
            site_type_id: 'clinic',
            site_type_name: 'Clinic'
          },{
            site_type_id: 'schools',
            site_type_name: 'School'
          },{
            site_type_id: 'host_community_families',
            site_type_name: 'Host Community/Families'
          },{
            site_type_id: 'collective_center',
            site_type_name: 'Collective Center'
          },{
            site_type_id: 'dispersed_settlement',
            site_type_name: 'Dispersed Settlement'
          },{
            site_type_id: 'planned_site',
            site_type_name: 'Planned Site'
          },{
            site_type_id: 'spontaneous_site',
            site_type_name: 'Spontaneous Site'
          },{
            site_type_id: 'transit_site',
            site_type_name: 'Transit Site'
          },{
            site_type_id: 'other',
            site_type_name: 'Other'
          }];
        } 

        // ng
        if ( admin0pcode === 'NG' ) {
          site_types = [{
            site_type_id: 'multiple_sites',
            site_type_name: 'Multiple Sites'
          },{
            site_type_id: 'host_community',
            site_type_name: 'Host Community'
          },{
            site_type_id: 'settlement',
            site_type_name: 'Settlement'
          },{
            site_type_id: 'collective_settlement',
            site_type_name: 'Collective Settlement/Centre'
          },{
            site_type_id: 'transitional_centre',
            site_type_name: 'Transitional Centre'
          },{
            site_type_id: 'idp_site',
            site_type_name: 'IDP Site'
          },{
            site_type_id: 'hospital',
            site_type_name: 'Hospital'
          },{
            site_type_id: 'health_center',
            site_type_name: 'Health Center'
          },{
            site_type_id: 'nutrition_center',
            site_type_name: 'Nutrition Center'
          },{
            site_type_id: 'school',
            site_type_name: 'School'
          }];
        }

        // et
        if ( admin0pcode === 'SO' ) {
          site_types = [{
            site_type_id: 'multiple_sites',
            site_type_name: 'Multiple Sites'
          },{
            site_type_id: 'settlement',
            site_type_name: 'Settlement'
          },{
            site_type_id: 'hospital',
            site_type_name: 'Hospital'
          },{
            site_type_id: 'health_center',
            site_type_name: 'Health Center'
          },{
            site_type_id: 'health_post',
            site_type_name: 'Health Post'
          },{
            site_type_id: 'tb_center',
            site_type_name: 'TB Center'
          },{
            site_type_id: 'schools',
            site_type_name: 'School'
          },{
            site_type_id: 'host_community_families',
            site_type_name: 'Host Community/Families'
          },{
            site_type_id: 'idp_site',
            site_type_name: 'IDP Site'
          },{
            site_type_id: 'other',
            site_type_name: 'Other'
          }];
        }

        if(admin0pcode === 'COL'){


          site_types = [
          {
            site_type_id: 'multiple_sites',
            site_type_name: 'Múltiples Sitios'
          },{
            site_type_id: 'puestos_centros_instituciones_de_salud',
            site_type_name: 'Puestos/centros/instituciones de salud'
          },{
            site_type_id: 'espacios_instituciones_educativas',
            site_type_name: 'Espacios/instituciones educativas'
          },{
            site_type_id: 'asentamientos_alojamientos',
            site_type_name: 'Asentamientos/alojamientos'
          },{
            site_type_id: 'espacios_protectores',
            site_type_name: 'Espacios protectores'
          },
          {
            site_type_id: 'centros_logisticos',
            site_type_name: 'Centros logísticos'
          },{
            site_type_id: 'comedores_comunitarios',
            site_type_name: 'Comedores comunitarios'
          },{
            site_type_id: 'centros_de_desarrollo_infantil',
            site_type_name: 'Centros de desarrollo infantil'
          },
          {
            site_type_id: 'instituciones_locales_departamentales_territoriales_nacionales',
            site_type_name: 'Instituciones locales/departamentales/territoriales/nacionales'
          },
          {
            site_type_id: 'puntos_de_atencion_al_migrante',
            site_type_name: 'Puntos de atención al migrante'
          }
          ,
          {
            site_type_id:'settlement',
            site_type_name:'Asentamientos'
          },
          
          {
            site_type_id: 'other',
            site_type_name: 'Otro'
          }

           ]
        }
        
        // facilities
        return site_types;
      },

      // remove duplicates in item ( json array ) based on value ( filterOn )
      filterDuplicates: function( items, filterOn ){

        // vars
        var hashCheck = {},
            newItems = [];

        // comparison fn
        var extractValueToCompare = function ( item ) {
          if ( angular.isObject( item ) && angular.isString( filterOn ) ) {
            return item[ filterOn ];
          } else {
            return item;
          }
        };

        // filter unique
        angular.forEach( items, function ( item ) {
          var valueToCheck, isDuplicate = false;

          for ( var i = 0; i < newItems.length; i++ ) {
            if ( angular.equals( extractValueToCompare( newItems[i] ), extractValueToCompare( item ) ) ) {
              isDuplicate = true;
              break;
            }
          }
          if ( !isDuplicate ) {
            newItems.push( item );
          }
        });

        // duplicates filtered
        return newItems;
			},
			
			//stock-targeted-groups
			getStockTargetedGroups: function(){
				var stock_targeted_groups= [
					{
						stock_targeted_groups_id: 'all_population',
						stock_targeted_groups_name: 'All Population'
					},
					{
						stock_targeted_groups_id: 'conflict_affected',
						stock_targeted_groups_name: 'Conflict Affected'
					},
					{
						stock_targeted_groups_id: 'natural_disaster',
						stock_targeted_groups_name: 'Natural Disaster'
					},
					{
						stock_targeted_groups_id: 'returnees',
						stock_targeted_groups_name: 'Returnees'
					},

				]

				return stock_targeted_groups
			}
		};

    // return
    return ngmClusterLists;

	}]);
