/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportCtrl
 * @description
 * # ClusterProjectFormReportCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.report', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.report', {
        title: 'Cluster Reports Form',
        description: 'Cluster Reports Form',
        controller: 'ClusterProjectFormReportCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/report/form.html'
      });
  })
  .controller( 'ClusterProjectFormReportCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, ngmClusterHelper, config ){

      // set activity descriptions
      $scope.activity_descriptions = ngmClusterHelper.getActivities( config.project, false, false );

      // project
      $scope.project = {
        
        // user
        user: ngmUser.get(),
        
        // app style
        style: config.style,
        
        // project
        definition: config.project,
        
        // report
        report: config.report,

        // default indicators ( 2016 )
        indicators: config.report.report_year === 2016 ? ngmClusterHelper.getIndicators() : ngmClusterHelper.getIndicators( true ),

        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ],
        
        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        
        // title
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),
        
        // lists
        // activity_type: config.project.activity_type,
        activity_descriptions: $scope.activity_descriptions,
        category_types: ngmClusterHelper.getCategoryTypes(),
        beneficiary_types: config.report.report_year === 2016 ? ngmClusterHelper.getBeneficiaries2016( config.project.cluster_id, [] ) : ngmClusterHelper.getBeneficiaries(),
        lists: {
          units: ngmClusterHelper.getUnits( config.project.admin0pcode ),
          // transfers
          transfers: ngmClusterHelper.getTransfers( 10 ),
          // Population
          delivery_types:[{
            delivery_type_id: 'population',
            delivery_type_name: 'New Beneficiaries'
          },{
            delivery_type_id: 'service',
            delivery_type_name: 'Existing Beneficiaries'
          }],
          // MPC
          mpc_delivery_types: [{
            mpc_delivery_type_id: 'hawala',
            mpc_delivery_type_name: 'Hawala'
          },{
            mpc_delivery_type_id: 'cash_in_envelope',
            mpc_delivery_type_name: 'Cash in Envelope'
          },{
            mpc_delivery_type_id: 'mobile',
            mpc_delivery_type_name: 'Mobile'
          },{
            mpc_delivery_type_id: 'bank',
            mpc_delivery_type_name: 'Bank'
          }]
        },
        
        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        locationsUrl: 'locations.html',
        beneficiariesUrl: config.report.report_year === 2016 ? 'beneficiaries/2016/beneficiaries.html' : 'beneficiaries/beneficiaries.html',        
        beneficiariesTrainingUrl: 'beneficiaries/2016/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
        notesUrl: 'notes.html',

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
          }, 400);
        },

        // add beneficiary
        addBeneficiary: function( $parent ) {
          // sadd
          var sadd = {
            units: 0,
            cash_amount: 0,
            households: 0, 
            sessions: 0, 
            families: 0, 
            boys: 0, 
            girls: 0, 
            men:0, 
            women:0, 
            elderly_men:0, 
            elderly_women:0 
          };
          $scope.inserted = {
            cluster_id: null,
            cluster: null,
            category_type_id: null,
            category_type_name: null,
            beneficiary_type_id: null,
            beneficiary_type_name: null,
            activity_type_id: null,
            activity_type_name: null,
            activity_description_id: null,
            activity_description_name: null,
            delivery_type_id: null,
            delivery_type_name: null,
            transfer_type_id: 0,
            transfer_type_value: 0
          };

          // merge
          angular.merge( $scope.inserted, sadd );

          // eiewg
          if( $scope.project.definition.cluster_id === 'eiewg' ){
            $scope.inserted.category_type_id = 'category_a';
            $scope.inserted.category_type_name = 'A) Emergency Relief Needs';
          }

          // clone
          if ( !$scope.project.report.locations[ $parent ].beneficiaries ) {
            $scope.project.report.locations[ $parent ].beneficiaries = [];
          }
          var length = $scope.project.report.locations[ $parent ].beneficiaries.length;
          if ( length ) {
            var b = angular.copy( $scope.project.report.locations[ $parent ].beneficiaries[ length - 1 ] );
            delete b.id;
            $scope.inserted = angular.merge( $scope.inserted, b, sadd );
            $scope.inserted.transfer_type_id = 0;
            $scope.inserted.transfer_type_value = 0;
          }
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if($beneficiary.activity_type_id) {
            selected = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);

            // catch for old data
            if( selected[0].cluster_id && selected[0].cluster ) {
              $beneficiary.cluster_id = selected[0].cluster_id;
              $beneficiary.cluster = selected[0].cluster;
            }
            $beneficiary.activity_type_name = selected[0].activity_type_name;
          }
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id }, true);
            $beneficiary.activity_description_name = selected[0].activity_description_name;
          } 
          return selected.length ? selected[0].activity_description_name : 'No Selection!';
        },

        // display delivery
        showCashDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.mpc_delivery_type_id = $data;
          if($beneficiary.mpc_delivery_type_id) {
            
            // selection
            selected = $filter('filter')( $scope.project.lists.mpc_delivery_types, { mpc_delivery_type_id: $beneficiary.mpc_delivery_type_id }, true);
            if ( selected.length ) {
              $beneficiary.mpc_delivery_type_name = selected[0].mpc_delivery_type_name;
            } else {
              selected.push({
                mpc_delivery_type_id: 'n_a',
                mpc_delivery_type_name: 'N/A'
              });
            }

            // no cash! for previous selections
            if ( $beneficiary.activity_type_id.indexOf( 'cash' ) === -1 && 
                  $beneficiary.activity_description_id && 
                  $beneficiary.activity_description_id.indexOf( 'cash' ) === -1 ){
              // reset
              $beneficiary.mpc_delivery_type_id = 'n_a';
              $beneficiary.mpc_delivery_type_name = 'N/A';
            }

          }
          return selected.length ? selected[0].mpc_delivery_type_name : 'No Selection!';
        },

        // display category
        showCategory: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.category_type_id = $data;
          if( $beneficiary.category_type_id ) {
            selected = $filter('filter')( $scope.project.category_types, { category_type_id: $beneficiary.category_type_id }, true);
            $beneficiary.category_type_name = selected[0].category_type_name;
          }
          return selected.length ? selected[0].category_type_name : 'No Selection!';
        },

        // display beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.beneficiary_type_id = $data;
          if ( $beneficiary.beneficiary_type_id ) {
            selected = $filter('filter')( $scope.project.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id }, true);
          }
          if ( selected.length ) {
            $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
            return selected[0].beneficiary_type_name
          } else {
            return 'No Selection!';
          }
        },

        // display delivery
        showDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.delivery_type_id = $data;
          if($beneficiary.delivery_type_id) {
            selected = $filter('filter')( $scope.project.lists.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
            $beneficiary.delivery_type_name = selected[0].delivery_type_name;
          }
          return selected.length ? selected[0].delivery_type_name : 'No Selection!';
        },
        
        // display if education/training sessions provided
        showSessions: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( ( $scope.project.definition.cluster_id !== 'eiewg' )
                  && ( b.activity_description_id )
                  && ( b.activity_description_id.indexOf( 'education' ) !== -1 || b.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showUnits: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
            if( 
                ( b.cluster_id === 'eiewg' || b.cluster_id === 'fsac' || b.cluster_id === 'wash' ) ||
                ( b.activity_description_id && 
                ( b.activity_description_id.indexOf( 'education' ) > -1 ||
                  b.activity_description_id.indexOf( 'training' ) > -1 ||
                  b.activity_description_id.indexOf('cash') > -1 ) )
              ) {
                display = true;
              }
            });
          }
          return display;
        },

        // unit types
        showUnitTypes: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.unit_type_id = $data;
          if( $beneficiary.unit_type_id ) {
            selected = $filter('filter')( $scope.project.lists.units, { unit_type_id: $beneficiary.unit_type_id }, true);
            if(selected.length) {
              $beneficiary.unit_type_name = selected[0].unit_type_name;
            }
          }else{
            $beneficiary.unit_type_id = 'n_a';
            $beneficiary.unit_type_id = 'N/A';
          }            
          return selected.length ? selected[0].unit_type_name : 'N/A';
        },

        // transfer_type_id
        showTransferTypes: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.transfer_type_id = $data;
          if($beneficiary.transfer_type_id) {
            selected = $filter('filter')( $scope.project.lists.transfers, { transfer_type_id: $beneficiary.transfer_type_id }, true);
            if( selected.length ) {
              $beneficiary.transfer_type_value = selected[0].transfer_type_value;
            }
          }else{
            $beneficiary.transfer_type_id = 0;
            $beneficiary.transfer_type_value = 0;
          }
          return selected.length ? selected[0].transfer_type_value : 0;
        },

        // display notes when cash activity
        showTransferNotes: function(){
          var display = false;
          angular.forEach( $scope.project.report.locations, function(l){
            angular.forEach( l.beneficiaries, function(b){
              if( ( b.activity_type_id && b.activity_type_id.indexOf('cash') > -1 ) || ( b.activity_description_id && b.activity_description_id.indexOf('cash') > -1 ) ){
                display = true;
              }
            });
          });
          return display;
        },

        // cash
        showCash: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( ( b.activity_type_id && b.activity_type_id.indexOf('cash') > -1 ) || ( b.activity_description_id && b.activity_description_id.indexOf('cash') > -1 ) ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showHouseholds: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id === 'cvwg' || b.cluster_id === 'esnfi' || b.cluster_id === 'fsac' ) {
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showFamilies: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id === 'wash' ) {
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showMen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
                if( b.cluster_id !== 'eiewg' && 
                  b.cluster_id !== 'nutrition' && 
                  b.activity_type_id !== 'mch' &&
                  b.activity_description_id !== 'antenatal_care' &&
                  b.activity_description_id !== 'postnatal_care' &&
                  b.activity_description_id !== 'skilled_birth_attendant' &&
                  b.activity_type_id !== 'vaccination' && 
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showWomen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id !== 'eiewg' &&
                  b.activity_type_id !== 'vaccination' && 
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showEldMen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id !== 'eiewg' && 
                  b.cluster_id !== 'nutrition' && 
                  b.cluster_id !== 'wash' && 
                  b.activity_type_id !== 'mch' &&
                  b.activity_description_id !== 'antenatal_care' &&
                  b.activity_description_id !== 'postnatal_care' &&
                  b.activity_description_id !== 'skilled_birth_attendant' &&
                  b.activity_type_id !== 'vaccination' && 
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showEldWomen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id !== 'eiewg' && 
                  b.cluster_id !== 'nutrition' && 
                  b.cluster_id !== 'wash' && 
                  b.activity_type_id !== 'mch' &&
                  b.activity_description_id !== 'antenatal_care' &&
                  b.activity_description_id !== 'postnatal_care' &&
                  b.activity_description_id !== 'skilled_birth_attendant' &&
                  b.activity_type_id !== 'vaccination' && 
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // disable input
        disabledInput: function( $beneficiary, indicator ) {
          var disabled = false;

          // health, MCH, ANC, PNC, SBA
          if( $beneficiary.activity_description_id === 'postnatal_care' ){
            if( indicator !== 'boys' && indicator !== 'girls' && indicator !== 'women' ){
              disabled = true;
            }
          }
          // health, MCH, ANC, PNC, SBA
          if( $beneficiary.activity_type_id === 'mch' ||
              $beneficiary.activity_description_id === 'antenatal_care' ||
              $beneficiary.activity_description_id === 'skilled_birth_attendant' ){
            if( indicator !== 'women' ){
              disabled = true;
            }
          }

          // health, vaccination
          if( $beneficiary.activity_type_id === 'vaccination' ||
              $beneficiary.activity_description_id === 'penta_3' ||
              $beneficiary.activity_description_id === 'measles' ){
            if( indicator !== 'boys' && indicator !== 'girls' ){
              disabled = true;
            }
          }

          return disabled;
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.project.report.locations[ $parent ].beneficiaries[ $index ][ indicator ] = $data;
        },

        // sessions disabled
        rowSessionsDisabled: function( $beneficiary ){
          var disabled = true;
          if( ( $beneficiary.cluster_id !== 'eiewg' )
                && ( $beneficiary.activity_description_id )
                && ( $beneficiary.activity_description_id.indexOf( 'education' ) !== -1 || $beneficiary.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
            disabled = false
          }
          return disabled;
        },
        
        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.category_type_id && $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id && $data.delivery_type_id &&
                $data.units >= 0 && $data.sessions >= 0 && $data.households >= 0 && $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.elderly_men >= 0 && $data.elderly_women >= 0 ) {
              disabled = false;
          }
          return disabled;
        },

        // remove from array if no id
        cancelEdit: function( $parent, $index ) {
          if ( !$scope.project.report.locations[ $parent ].beneficiaries[ $index ].id ) {
            $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
          }
        },

        // remove location from location list
        removeBeneficiaryModal: function( $parent, $index ) {
          if ( $scope.project.formComplete() ){
            // set location index
            $scope.project.locationIndex = $parent;
            $scope.project.beneficiaryIndex = $index;
            // open confirmation modal
            $( '#beneficiary-modal' ).openModal({ dismissible: false });
          }
        },

        // remove beneficiary
        removeBeneficiary: function() {
          
          // b
          var b = $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries[ $scope.project.beneficiaryIndex ];

          // setReportRequest
          var setBeneficiariesRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/report/removeBeneficiary',
            data: {
              id: b.id
            }
          }          
          
          // set report
          $http( setBeneficiariesRequest ).success( function( result ){

            if ( result.err ) {
              // update
              Materialize.toast( 'Error! Please correct the ROW and try again', 6000, 'error' );
            }

            if ( !result.err ) {
              // remove
              $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );

              // save report
              $scope.project.save( false, false );
            }

          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });
        },

        // save form on enter
        keydownSaveForm: function(){
          setTimeout(function(){
            $('.editable-input').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // ennsure all locations contain at least one complete beneficiaries 
        formComplete: function() {
          var beneficiaries = 0;
          var rowComplete = 0;
          angular.forEach( $scope.project.report.locations, function( l ){
            if( l.beneficiaries ) {
              beneficiaries += l.beneficiaries.length;
              if ( l.beneficiaries.length ) {
                angular.forEach( l.beneficiaries, function( b ){
                  if ( !$scope.project.rowSaveDisabled( b ) ) {
                    rowComplete++;
                  }
                });
              } else {
                rowComplete++;
              }
            }
          });
          // 
          if( rowComplete >= beneficiaries ){
            return true;
          } else {
            return false;  
          }
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.project.cancel();
          }
        },

        // save 
        save: function( complete, display_modal ){

          // if textarea
          $( 'textarea[name="notes"]' ).removeClass( 'ng-untouched' ).addClass( 'ng-touched' );
          $( 'textarea[name="notes"]' ).removeClass( 'invalid' ).addClass( 'valid' ); 

          // report
          // $scope.project.report.submit = true;
          $scope.project.report.report_status = complete ? 'complete' : 'todo';
          $scope.project.report.report_submitted = moment().format();

          // update project details of report + locations + beneficiaries
          $scope.project.report = 
              ngmClusterHelper.getCleanReport( $scope.project.definition, $scope.project.report );
          
          // msg
          Materialize.toast( 'Processing Report...' , 3000, 'note');

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/report/setReport',
            data: {
              report: $scope.project.report
            }
          }   
          
          // set report
          $http( setReportRequest ).success( function( report ){

            if ( report.err ) {
              // update
              Materialize.toast( 'Error! Please correct the ROW and try again', 6000, 'error' );
            }

            if ( !report.err ) {
              
              // updated report
              $scope.project.report = report;
              $scope.project.report.submit = false;
              
              // user msg
              var msg = 'Project Report for  ' + moment( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
                  msg += complete ? 'Submitted!' : 'Saved!';
              
              // msg
              $timeout(function() { Materialize.toast( msg , 3000, 'success'); }, 600 );
              
              // set trigger
              $('.modal-trigger').leanModal();
              
              // Re-direct to summary
              if ( $scope.project.report.report_status !== 'complete' ) {

                // notification modal
                if( display_modal ){
                  $timeout(function() {
                    $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
                  }, 400);
                }

              } else {
                $timeout(function() {
                  $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
                }, 400);
              }
            }
          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });;

        }

      }

  }

]);

