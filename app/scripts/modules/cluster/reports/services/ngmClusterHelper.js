/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelper', 
      [ '$location', 
        '$q',
        '$http',
        '$filter',
        '$timeout',
        'ngmAuth',
        'ngmClusterLists',
        'ngmClusterLocations','$translate','$filter', 
    function( $location, 
                $q, 
                $http, 
                $filter, 
                $timeout, 
                ngmAuth, 
                ngmClusterLists, 
                ngmClusterLocations,$translate,$filter ) {

		var ngmClusterHelper = {


      // set form on load
      setForm: function( project, lists ) {

        // on page load
        angular.element( document ).ready(function () {

          // give a few seconds to render
          $timeout(function() {

            // add activity type check box list
            if ( project.inter_cluster_activities ) {
              project.inter_cluster_check = {};
              angular.forEach( project.inter_cluster_activities, function( d, i ){
                if ( d ){
                  project.inter_cluster_check[ d.cluster_id ] = true;
                }
              });
            }

            // add activity type check box list
            if ( project.activity_type ) {
              project.activity_type_check = {};
              angular.forEach( project.activity_type, function( d, i ){
                if ( d ){
                  project.activity_type_check[ d.activity_type_id ] = true;
                }
              });
            }

            // if Cash
            if ( project.cluster_id === 'cvwg' ) {

              // set only option to true
              if ( !project.activity_type ) {
                project.activity_type_check = {
                  'cvwg_multi_purpose_cash': true
                };
              }

              // compile activity type
              ngmClusterHelper.compileActivityType( project, lists );
              // add project donor check box list
              if ( project.mpc_purpose ) {
                project.mpc_purpose_check = {};
                angular.forEach( project.mpc_purpose, function( d, i ){
                  if ( d ){
                    project.mpc_purpose_check[ d.mpc_purpose_type_id ] = true;
                  }
                });
              }
            }

            // add project donor check box list
            if ( project.mpc_delivery_type ) {
              project.mpc_delivery_type_check = {};
              angular.forEach( project.mpc_delivery_type, function( d, i ){
                if ( d ){
                  project.mpc_delivery_type_check[ d.delivery_type_id ] = true;
                }
              });
            } 

            // add project donor check box list
            if ( project.project_donor ) {
              project.project_donor_check = {};
              angular.forEach( project.project_donor, function( d, i ){
                if ( d ){
                  project.project_donor_check[ d.project_donor_id ] = true;
                }
              });
            }

            // add SOs check box list
            if ( project.strategic_objectives ) {
              project.strategic_objectives_check = {};
              angular.forEach( project.strategic_objectives, function( d, i ){
                if ( d ){
                  project.strategic_objectives_check[ d.objective_type_id + ':' + (d.objective_year?d.objective_year:'') ] = true;
                }
              });
            }

            // fetch lists for project details
            // if ( project.id ) {
            //   angular.forEach( project.target_locations, function( t, i ){
            //     if ( t ){
            //       // ngmClusterLocations.getAdminSites( lists, project.admin0pcode, t );
            //     }
            //   });
            // }

          }, 1000 );

        });
      },

      // get a new project
      getNewProject: function( user ) {

        // copy user and remove conflicts
        var u = angular.copy( user );
                delete u.id;
                delete u.createdAt;
                delete u.updatedAt;
                delete u.admin1pcode;
                delete u.admin1name;
                delete u.admin1lng;
                delete u.admin1lat;
                delete u.site_class;
                delete u.site_type_id;
                delete u.site_type_name;
                delete u.site_status;
                delete u.site_name;
                delete u.site_lng;
                delete u.site_lat;

        // create empty project
        var project = {
          project_status: 'new',
          project_title: '',//'Enter New ' + user.organization + ' Project Title...',
          project_description: $filter('translate')('please_complete_a_project_plan_and_enter_a_summary_description_including_objetives'),

          project_start_date: moment.utc().startOf( 'M' ).format('YYYY-MM-DD'),
          project_end_date: moment.utc().add( 8, 'M' ).endOf( 'M' ).format('YYYY-MM-DD'),
          // project_code: user.organization + '/' + moment().unix(),
          project_hrp_project: true,
          project_budget: '0',
          project_budget_progress: [],
          beneficiary_type: [],
          target_beneficiaries: [],
          target_locations: [],
          project_donor:[],
          implementing_partners : [],
          undaf_desarrollo_paz:[],
          acuerdos_de_paz:[],
          dac_oecd_development_assistance_committee:[],
          ods_objetivos_de_desarrollo_sostenible:[]

        }

        // extend defaults with ngmUser details
        project = angular.merge( {}, u, project );

        // set hrp code
        project.project_hrp_code = ngmClusterHelper.getProjectHrpCode( project );

        // remove id of ngmUser to avoid conflict with new project
        delete project.id;

        // return
        return project;
      },

      // get hrp code
      getProjectHrpCode: function( project ) {

        // return project code (defaults to HRP)
        var tag = project.admin0pcode === 'CB' ? '-JRP-' : '-HRP-';
        return project.admin0name.toUpperCase().substring(0, 3) + tag +
                        moment().year() + '-' +
                        project.cluster_id.toUpperCase() + '-' +
                        moment().unix();
      },

      // get hrp code
      getProjectHrpName: function( project ) {

        // return project code (defaults to HRP)
        var tag = project.admin0pcode === 'CB' ? 'JRP' : 'HRP';
        return tag;
      },

      // compile cluster activities
      compileInterClusterActivities: function( project, lists ){

        project.inter_cluster_activities = [];
        angular.forEach( project.inter_cluster_check, function( t, key ){
          if ( t ) {
            var cluster = $filter( 'filter' )( lists.clusters, { cluster_id: key }, true)[0];
            if ( cluster ) {
              project.inter_cluster_activities.push( { cluster_id: cluster.cluster_id, cluster: cluster.cluster } );
            }
          } else {
            // turn off ?
            var activity_type = [];
            angular.forEach( project.activity_type, function( obj, i ) {
              if ( obj.cluster_id === key ){
                project.activity_type_check[ obj.activity_type_id ] = false;
              } else{
                activity_type.push(obj);
              }
            });
          }
        });
        ngmClusterHelper.compileStrategicObjectives( project, lists );
        ngmClusterHelper.compileActivityType( project, lists );
      },

      // strategic objectives
      compileStrategicObjectives: function( project, lists ){

        var strategic_objectives = [];

        // each SO
        angular.forEach( project.strategic_objectives_check, function( key, so ){

          if ( key ) {
            var so_obj = so.split(":");
            // "health_objective_2:2018"
            // old 2017 SO has no year, update db or use this hunch
            if (so_obj[1]==="")so_obj[1]=2017;
            // default
            var objective = $filter('filter')( lists.strategic_objectives[so_obj[1]][ project.cluster_id ], { objective_type_id: so_obj[0] }, true );
            if( objective[0] ){
              strategic_objectives.push( objective[0] );
            }

            // intercluster
            angular.forEach( project.inter_cluster_activities, function( d, i ){
              var objective = $filter('filter')( lists.strategic_objectives[so_obj[1]][ d.cluster_id ], { objective_type_id: so_obj[0] }, true );
              if( objective[0] ){
                strategic_objectives.push( objective[0] );
              }
            });
          }

        });

        project.strategic_objectives = strategic_objectives;
      },

      // compile mpc cash purpose
      compileMpcPurpose: function( project, lists ) {

        // db attributes
        project.mpc_purpose = [];
        project.mpc_purpose_cluster_id = '';
        project.mpc_purpose_type_id = '';
        project.mpc_purpose_type_name = '';


        // mpc purpose
        angular.forEach( project.mpc_purpose_check, function( t, key ){
          if ( t ) {
            var a_type = $filter( 'filter' )( lists.mpc_purpose, { mpc_purpose_type_id: key }, true)[0];
            if ( a_type ) {
              project.mpc_purpose.push( a_type );
              project.mpc_purpose_cluster_id += a_type.cluster_id + ', ';
              project.mpc_purpose_type_id += a_type.mpc_purpose_type_id + ', ';
              project.mpc_purpose_type_name += a_type.mpc_purpose_type_name + ', ';
            }
          }
        });

        // trim last character of string
        // refactor
        project.mpc_purpose_cluster_id = project.mpc_purpose_cluster_id.slice( 0, -2 );
        project.mpc_purpose_type_id = project.mpc_purpose_type_id.slice( 0, -2 );
        project.mpc_purpose_type_name = project.mpc_purpose_type_name.slice( 0, -2 );
      },

      // compile activity_type
      compileActivityType: function( project, lists ){

        // update
        // lists.activity_types = ngmClusterLists.getActivities( project, true, 'activity_type_id' );
        // lists.activity_descriptions = ngmClusterLists.getActivities( project, true, 'activity_description_id' );
        // lists.activity_details = ngmClusterLists.getActivities( project, true, 'activity_detail_id' );
        // lists.indicators = ngmClusterLists.getActivities( project, true, 'indicator_id' );

        // filter
        project.activity_type = [];
        angular.forEach( project.activity_type_check, function( t, key ){
          if ( t ) {
            var a_type = $filter( 'filter' )( lists.activity_types, { activity_type_id: key }, true)[0];
            if ( a_type ) {
              project.activity_type.push( { cluster_id: a_type.cluster_id, cluster: a_type.cluster, activity_type_id: a_type.activity_type_id, activity_type_name: a_type.activity_type_name } );
            }
          }
        });
      },

      // compile project_donor
      compileDonor: function( project, lists ){
        project.project_donor = [];
        angular.forEach( project.project_donor_check, function( d, key ){
          if ( d ) {
            var donor = $filter( 'filter' )( lists.donors, { project_donor_id: key }, true)[0];
            project.project_donor.push( donor );
          }
          // focus on select
          if ( key === 'other' && d ) {
            $( '#ngm-project-project_donor_other' ).focus();
          }
          // remove if un-selected
          if ( key === 'other' && !d ) {
            project.project_donor_other = '';
          }
        });
      },




      // get processed warehouse location
      getCleanWarehouseLocation: function( user, organization, warehouse ){

        // merge
        var warehouse = angular.merge({}, organization, warehouse, warehouse.admin2, warehouse.admin3, warehouse.site_type);

        // delete
        delete warehouse.id;
        delete warehouse.admin1;
        delete warehouse.admin2;
        delete warehouse.admin3;
        delete warehouse.site_type;
				delete warehouse.createdAt;
				delete warehouse.updatedAt;

        // add params
        // warehouse.warehouse_status = 'new';
        warehouse.username = user.username;
        warehouse.email = user.email;
        warehouse.site_lng = warehouse.admin3lng ? warehouse.admin3lng : warehouse.admin2lng;
				warehouse.site_lat = warehouse.admin3lat ? warehouse.admin3lat : warehouse.admin2lat;

        return warehouse;
      },

      // get processed stock location
      getCleanStocks: function( report, location, stocks ){

        // merge
        var stock = angular.merge( {}, stocks, report, location );

        // // delete
        delete stock.id;
        delete stock.stocks;
        delete stock.stocklocations;

        // default stock
        stock.report_id = stock.report_id.id;

        return stock;
      },

      // get processed target location
      getCleanTargetLocation: function( project, locations ){

        // needs to operate on an array
        angular.forEach( locations, function( location, i ){
          // set site_lng, site_lat
            // this is propigated through the entire datasets
          if ( !location.site_lng && !location.site_lat ) {
            // set admin4, admin3 or admin2
            if ( location.admin2lng && location.admin2lat ) {
              location.site_id = location.admin2pcode;
              location.site_lng = location.admin2lng;
              location.site_lat = location.admin2lat;
            }
            if ( location.admin3lng && location.admin3lat ) {
              location.site_id = location.admin3pcode;
              location.site_lng = location.admin3lng;
              location.site_lat = location.admin3lat;
            }
            if ( location.admin4lng && location.admin4lat ) {
              location.site_id = location.admin4pcode;
              location.site_lng = location.admin4lng;
              location.site_lat = location.admin4lat;
            }
            if ( location.admin5lng && location.admin5lat ) {
              location.site_id = location.admin5pcode;
              location.site_lng = location.admin5lng;
              location.site_lat = location.admin5lat;
            }
          }
        });

        // return clean location
        return locations;

      },

      // update entire report with project details (dont ask)
      getCleanReport: function( project, report ) {

        // locations
        angular.forEach( report.locations, function( location, i ){

          // report_status
          location.report_status = report.report_status;

          // set site_lng, site_lat
            // this is propigated through the entire datasets
          if ( !location.site_lng && !location.site_lat ) {
            // set admin4, admin3 or admin2
            if ( location.admin2lng && location.admin2lat ) {
              location.site_lng = location.admin2lng;
              location.site_lat = location.admin2lat;
            }
            if ( location.admin3lng && location.admin3lat ) {
              location.site_lng = location.admin3lng;
              location.site_lat = location.admin3lat;
            }
            if ( location.admin4lng && location.admin4lat ) {
              location.site_lng = location.admin4lng;
              location.site_lat = location.admin4lat;
            }
            if ( location.admin5lng && location.admin5lat ) {
              location.site_lng = location.admin5lng;
              location.site_lat = location.admin5lat;
            }
          }

          // locations
          angular.forEach( report.locations[i].beneficiaries, function( beneficiary, j ){
            // report_status
            beneficiary.report_status = report.report_status;
          });

        });

        return report;
      },

			// get Menu Country
			getCountryMenu:function(url){
				var menu = {
					'all': {
            'search': true,
						'id': 'search-all',
						'icon': 'location_on',
						'title': $filter('translate')('country_mayus'),
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'Afghanistan',
							'param': 'admin0pcode',
							'active': 'af',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/af/all/all',
						}, {
							'title': 'Bangladesh',
							'param': 'admin0pcode',
							'active': 'bd',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'searo/bd/all/all',
						}, {
							'title': 'Cox Bazar',
							'param': 'admin0pcode',
							'active': 'cb',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'searo/cb/all/all',
						}, {
							'title': 'Democratic Republic of Congo',
							'param': 'admin0pcode',
							'active': 'cd',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/cd/all/all'
						}, {
							'title': 'Ethiopia',
							'param': 'admin0pcode',
							'active': 'et',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/et/all/all',
						}, {
							'title': 'Somalia',
							'param': 'admin0pcode',
							'active': 'so',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/so/all/all',
						}, {
							'title': 'South Sudan',
							'param': 'admin0pcode',
							'active': 'ss',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/ss/all/all',
						}, {
							'title': 'Syria',
							'param': 'admin0pcode',
							'active': 'so',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/sy/all/all',
						}, {
							'title': 'Ukraine',
							'param': 'admin0pcode',
							'active': 'ua',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'euro/ua/all/all',
						}, {
							'title': 'Yemen',
							'param': 'admin0pcode',
							'active': 'ye',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/ye/all/all',
						}, {
							'title': 'Nigeria',
							'param': 'admin0pcode',
							'active': 'ng',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/ng/all/all',
						},
						{
							'title': 'Colombia',
							'param': 'admin0pcode',
							'active': 'col',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'amer/col/all/all',
						}]
					},
					'afro': {
            'search': true,
						'id': 'search-afro',
						'icon': 'person_pin',
						'title': $filter('translate')('country_mayus'),
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'Democratic Republic of Congo',
							'param': 'admin0pcode',
							'active': 'cd',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/cd/all/all'
						}, {
							'title': 'Ethiopia',
							'param': 'admin0pcode',
							'active': 'et',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/et/all/all',
						}, {
							'title': 'Nigeria',
							'param': 'admin0pcode',
							'active': 'ng',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/ng/all/all',
						}, {
							'title': 'South Sudan',
							'param': 'admin0pcode',
							'active': 'ss',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'afro/ss/all/all',
						}]
					},
					'emro': {
            'search': true,
						'id': 'search-emro',
						'icon': 'person_pin',
						'title': $filter('translate')('country_mayus'),
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'Afghanistan',
							'param': 'admin0pcode',
							'active': 'af',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/af/all/all',
						}, {
							'title': 'Somalia',
							'param': 'admin0pcode',
							'active': 'so',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/so/all/all',
						}, {
							'title': 'Syria',
							'param': 'admin0pcode',
							'active': 'sy',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/sy/all/all',
						}, {
							'title': 'Yemen',
							'param': 'admin0pcode',
							'active': 'ye',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'emro/ye/all/all',
						}]
					},
					'searo': {
            'search': true,
						'id': 'search-searo',
						'icon': 'person_pin',
						'title': $filter('translate')('country_mayus'),
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'Bangladesh',
							'param': 'admin0pcode',
							'active': 'bd',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'searo/bd/all/all',
						}, {
							'title': 'Cox Bazar',
							'param': 'admin0pcode',
							'active': 'cb',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'searo/cb/all/all',
						}]
					},
					'euro': {
            'search': true,
						'id': 'search-euro',
						'icon': 'person_pin',
						'title': $filter('translate')('country_mayus'),
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'Ukraine',
							'param': 'admin0pcode',
							'active': 'ua',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'euro/ua/all/all'
						},]
					},
					'amer': {
            'search': true,
						'id': 'search-amer',
						'icon': 'person_pin',
						'title': $filter('translate')('country_mayus'),
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': 'Colombia',
							'param': 'admin0pcode',
							'active': 'col',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': url + 'amer/col/all/all'
						},]
					}
				}
				return menu
			},

			// get Menu Region 
			getRegionMenu: function(url){
				var region = {
          'search': true,
					'id': 'search-region',
					'icon': 'person_pin',
					'title': $filter('translate')('region'),
					'class': 'teal lighten-1 white-text',
					'rows': [{
						'title': 'HQ',
						'param': 'adminRpcode',
						'active': 'all',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + '/all/all/all/all',
					}, {
						'title': 'AFRO',
						'param': 'adminRpcode',
						'active': 'afro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + '/afro/all/all/all'
					}, {
						'title': 'AMER',
						'param': 'adminRpcode',
						'active': 'amer',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + '/amer/all/all/all'
					}, {
						'title': 'EMRO',
						'param': 'adminRpcode',
						'active': 'emro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + '/emro/all/all/all'
					}, {
						'title': 'SEARO',
						'param': 'adminRpcode',
						'active': 'searo',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + '/searo/all/all/all'
					}, {
						'title': 'EURO',
						'param': 'adminRpcode',
						'active': 'euro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': url + '/euro/all/all/all'
					}
					]
				};
				return region
			}

		};

    return ngmClusterHelper;

	}]);
