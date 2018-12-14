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
        'ngmClusterLocations',
    function( $location, 
                $q, 
                $http, 
                $filter, 
                $timeout, 
                ngmAuth, 
                ngmClusterLists, 
                ngmClusterLocations ) {

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
            if ( project.id ) {
              angular.forEach( project.target_locations, function( t, i ){
                if ( t ){
                  // ngmClusterLocations.getAdminSites( lists, project.admin0pcode, t );
                }
              });
            }

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
          project_description: 'Please complete Project Details and enter a project summary description including objectives...',
          project_start_date: moment.utc().startOf( 'M' ).format('YYYY-MM-DD'),
          project_end_date: moment.utc().add( 8, 'M' ).endOf( 'M' ).format('YYYY-MM-DD'),
          // project_code: user.organization + '/' + moment().unix(),
          project_hrp_project: true,
          project_budget: '0',
          project_budget_progress: [],
          beneficiary_type: [],
          target_beneficiaries: [],
          target_locations: [],
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
        return project.admin0name.toUpperCase().substring(0, 3) + '-HRP-' +
                        moment().year() + '-' +
                        project.cluster.toUpperCase().substring(0, 3) + '-' +
                        moment().unix();
      },

      // update activities for an object ( update )
      updateActivities: function( project, update ){

        // update activity_type / activity_description
        update.project_title = project.project_title;
        update.activity_type = project.activity_type;
        update.beneficiary_type = project.beneficiary_type;
        update.activity_description = project.activity_description;

        //
        return update;
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
        lists.activity_types = ngmClusterLists.getActivities( project, true, 'activity_type_id' );
        lists.activity_descriptions = ngmClusterLists.getActivities( project, true, 'activity_description_id' );

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
      getCleanBudget: function( user, project, budget ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.project_budget_progress;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.updatedAt;
        delete budget.updatedAt;

        // merge
        budget = angular.merge( {}, { username: user.username }, { email: user.email }, p, budget );

        // return clean budget
        return budget;

      },

      // get processed target location
      getCleanTargetBeneficiaries: function( project, beneficiaries ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.cluster_id;
        delete p.cluster;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;
        delete p.beneficiary_type;

        // needs to operate on an array
        angular.forEach( beneficiaries, function( d, i ){
          // merge beneficiaries + project
          delete beneficiaries[i].project_donor;
          delete beneficiaries[i].strategic_objectives;
          delete beneficiaries[i].admin1pcode;
          delete beneficiaries[i].admin2pcode;
          delete beneficiaries[i].admin3pcode;
          beneficiaries[i] = angular.merge( {}, p, d );
          // add default
          if( project.activity_type && project.activity_type.length === 1){
            beneficiaries[i].activity_type_id = project.activity_type[0].activity_type_id;
            beneficiaries[i].activity_type_name = project.activity_type[0].activity_type_name;
          }
        });

        // return clean beneficiaries
        return beneficiaries;

      },

      // get processed target location
      getCleanTargetLocation: function( project, locations ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;
        delete p.admin1pcode;
        delete p.admin2pcode;
        delete p.admin3pcode;
        // user
        delete p.name;
        delete p.position;
        delete p.phone;
        delete p.email;
        delete p.username;

        // needs to operate on an array
        angular.forEach( locations, function( d, i ){
          // merge locations + project
          delete locations[i].project_donor;
          delete locations[i].strategic_objectives;
          delete locations[i].activity_type;
          delete locations[i].beneficiary_type;
          locations[i] = angular.merge( {}, p, d );
          // set site_lng, site_lat
            // this is propigated through the entire datasets
          if ( !locations[i].site_lng && !locations[i].site_lat ) {
            // set admin4, admin3 or admin2
            if ( locations[i].admin2lng && locations[i].admin2lat ) {
              locations[i].site_lng = locations[i].admin2lng;
              locations[i].site_lat = locations[i].admin2lat;
            }
            if ( locations[i].admin3lng && locations[i].admin3lat ) {
              locations[i].site_lng = locations[i].admin3lng;
              locations[i].site_lat = locations[i].admin3lat;
            }
            if ( locations[i].admin4lng && locations[i].admin4lat ) {
              locations[i].site_lng = locations[i].admin4lng;
              locations[i].site_lat = locations[i].admin4lat;
            }
            if ( locations[i].admin5lng && locations[i].admin5lat ) {
              locations[i].site_lng = locations[i].admin5lng;
              locations[i].site_lat = locations[i].admin5lat;
            }
          }
        });

        // return clean location
        return locations;

      },

      // update entire report with project details (dont ask)
      getCleanReport: function( project, report ) {

        // copy to p
        var p = angular.copy( project );
        var r = angular.copy( report );

        // remove duplication from merge
        delete p.id;
        delete p.target_beneficiaries;
        delete p.target_locations;
				delete p.project_budget_progress;
				delete p.createdAt;
				delete p.updatedAt;

        // remove arrays to update
        delete r.activity_description;
        delete r.activity_type;
        delete r.admin1pcode;
        delete r.admin2pcode;
        delete r.admin3pcode;
        delete r.beneficiary_type;
        delete r.category_type;
        delete r.project_donor;
				delete r.strategic_objectives;
				delete r.createdAt;
				delete r.updatedAt;

        // merge
        report = angular.merge( {}, p, r );

        // locations
        angular.forEach( report.locations, function( location, i ){

          // remove to ensure updated
          var l = angular.copy( location );
          delete r.id;
          delete p.admin1pcode;
          delete p.admin2pcode;
          delete p.admin3pcode;
          delete r.admin1pcode;
          delete r.admin2pcode;
          delete r.admin3pcode;
          delete r.locations;
          delete l.activity_description;
          delete l.activity_type;
          delete l.beneficiary_type;
          delete l.category_type;
          delete l.project_donor;
					delete l.strategic_objectives;
					delete l.createdAt;
					delete l.updatedAt;
          // ids
          l.project_id = project.id;
          l.report_id = report.id;

          // set site_lng, site_lat
            // this is propigated through the entire datasets
          if ( !l.site_lng && !l.site_lat ) {
            // set admin4, admin3 or admin2
            if ( l.admin2lng && l.admin2lat ) {
              l.site_lng = l.admin2lng;
              l.site_lat = l.admin2lat;
            }
            if ( l.admin3lng && l.admin3lat ) {
              l.site_lng = l.admin3lng;
              l.site_lat = l.admin3lat;
            }
            if ( l.admin4lng && l.admin4lat ) {
              l.site_lng = l.admin4lng;
              l.site_lat = l.admin4lat;
            }
            if ( l.admin5lng && l.admin5lat ) {
              l.site_lng = l.admin5lng;
              l.site_lat = l.admin5lat;
            }
          }

          // merge
          report.locations[i] = angular.merge( {}, p, r, l );        

          // locations
          angular.forEach( report.locations[i].trainings, function( training, j ){
            // rm
            // delete p.cluster_id;
            // delete p.cluster;
            // report
            // delete r.cluster_id;
            // delete r.cluster;
            // location
            delete l.id;
            delete l.report_id;
            delete l.beneficiaries;
            // delete l.cluster_id;
            // delete l.cluster;
            // remove to ensure updated
            var t = angular.copy( training );
            delete t.activity_description;
            delete t.activity_type;
            delete t.beneficiary_type;
            delete t.category_type;
            delete t.project_donor;
						delete t.strategic_objectives;
						delete t.createdAt;
						delete t.updatedAt;
            // ids
            t.project_id = project.id;
            t.report_id = report.id;
            // merge
            // report.locations[i].trainings[j] = angular.merge( {}, t, l, r, p );
            report.locations[i].trainings[j] = angular.merge( {}, p, r, l, t );

            // trainees
            angular.forEach( training.training_participants, function( trainees, k ){
              var trainings = angular.copy( report.locations[i].trainings[j] );
							delete trainings.id;
							delete trainings.createdAt;
							delete trainings.updatedAt;
              report.locations[i].trainings[j].training_participants[k] = angular.merge( {}, trainees, trainings);
              delete report.locations[i].trainings[j].training_participants[k].trainings;
              delete report.locations[i].trainings[j].training_participants[k].training_participants;
            });

          });

          // locations
          angular.forEach( report.locations[i].beneficiaries, function( beneficiary, j ){
            // rm
            delete p.cluster_id;
            delete p.cluster;
            // report
            delete r.cluster_id;
            delete r.cluster;
            // location
            delete l.id;
            delete l.report_id;
            delete l.beneficiaries;
            delete l.cluster_id;
            delete l.cluster;
            // remove to ensure updated
            var b = angular.copy( beneficiary );
            delete b.activity_description;
            delete b.activity_type;
            delete b.beneficiary_type;
            delete b.category_type;
            delete b.project_donor;
						delete b.strategic_objectives;
						delete b.createdAt;
						delete b.updatedAt;
            // ids
            b.project_id = project.id;
            b.report_id = report.id;
            // merge
            // report.locations[i].beneficiaries[j] = angular.merge( {}, b, l, r, p );
            report.locations[i].beneficiaries[j] = angular.merge( {}, p, r, l, b );

          });

        });

        return report;
      }

		};

    return ngmClusterHelper;

	}]);
