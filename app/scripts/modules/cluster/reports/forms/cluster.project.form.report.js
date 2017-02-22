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

      // lists
      // $scope.disabled = true;
      // $scope.activity_types = config.project.activity_type;
      // $scope.activity_descriptions = ngmClusterHelper.getActivities( config.project.cluster_id, false );
      // $scope.beneficiary_types = ngmClusterHelper.getBeneficiaries( config.project.cluster_id, [] );

      // display activity
      // $scope.showActivity = function($data, $beneficiary) {
      //   var selected = [];
      //   $beneficiary.activity_type_id = $data;
      //   if($beneficiary.activity_type_id) {
      //     selected = $filter('filter')($scope.activity_types, { activity_type_id: $beneficiary.activity_type_id });
      //   }
      //   return selected.length ? selected[0].activity_type_name : 'Not Set';
      // };

      // display description
      // $scope.showDescription = function($data, $beneficiary) {
      //   var selected = [];
      //   $beneficiary.activity_description_id = $data;
      //   if($beneficiary.activity_description_id) {
      //     selected = $filter('filter')($scope.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id });
      //   } 
      //   return selected.length ? selected[0].activity_description_name : 'Not Set';
      // };

      // display beneficiary
      // $scope.showBeneficiary = function($data, $beneficiary) {
      //   var selected = [];
      //   $beneficiary.beneficiary_type_id = $data;
      //   if($beneficiary.beneficiary_type_id) {
      //     selected = $filter('filter')($scope.beneficiary_types, { beneficiary_type: $beneficiary.beneficiary_type_id });
      //   }
      //   return selected.length ? selected[0].beneficiary_name : 'Not Set';
      // };

      // // update inidcators
      // $scope.updateInput = function($parent, $index, indicator, $data ){
      //   $scope.project.report.locations[$parent].beneficiaries[$index][indicator] = $data;
      // };

      // validate form
      // $scope.disabled = function($data){
      //   var disabled = true;
      //   if ( $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id &&
      //         $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.sessions >= 0) {
      //       disabled = false;
      //   }
      //   return disabled;
      // }

      // add user CHANGE AT DB LEVEL PLEASE AND ADD MIGRATION SCRIPT
      // BENEFICIARY CHANGES!??
      // $scope.addBeneficiary = function($parent) {
      //   $scope.inserted = {
      //     activity_type_id: null,
      //     activity_type_name: null,
      //     activity_description_id: null,
      //     activity_description_name: null,
      //     beneficiary_type_id: null,
      //     beneficiary_type_name: null,
      //     boys: 0, girls: 0, men:0, women:0, sessions: 0
      //   };
      //   $scope.project.report.locations[$parent].beneficiaries.push($scope.inserted);
      // };

      // save beneficiary
      // $scope.saveBeneficiary = function($data) {
      //   $timeout(function(){ Materialize.toast( 'Beneficiary Saved!' , 3000, 'success' ) }, 400);
      //   return [200, {status: 'ok'}];
      // };

      // remove beneficiary
      // $scope.removeBeneficiary = function($parent, $index) {
      //   $scope.project.report.locations[$parent].beneficiaries.splice($index, 1);
      // };

      // // save form on enter
      // $scope.keydownSaveForm = function(){
      //   setTimeout(function(){
      //     $('.editable-input').keydown(function (e) {
      //       var keypressed = e.keyCode || e.which;
      //       if (keypressed == 13) {
      //         $('.save').trigger('click');
      //       }
      //     });
      //   }, 0 );
      // };


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
        indicators: ngmClusterHelper.getIndicators(),

        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'notes' ],
        
        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        
        // title
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),
        
        // lists
        activity_types: config.project.activity_type,
        activity_descriptions: ngmClusterHelper.getActivities( config.project.cluster_id, false ),
        beneficiary_types: ngmClusterHelper.getBeneficiaries( config.project.cluster_id, [] ),
        
        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        locationsUrl: 'locations.html',
        notesUrl: 'notes.html',
        beneficiariesTrainingUrl: 'beneficiaries/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/beneficiaries-health-2016.html',
        beneficiariesUrl: config.report.report_year === 2016 ? 'beneficiaries/beneficiaries-2016.html' : 'beneficiaries/beneficiaries.html',

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if($beneficiary.activity_type_id) {
            selected = $filter('filter')( $scope.project.activity_types, { activity_type_id: $beneficiary.activity_type_id });
          }
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id });
          } 
          return selected.length ? selected[0].activity_description_name : 'No Selection!';
        },

        // display beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.beneficiary_type_id = $data;
          if($beneficiary.beneficiary_type_id) {
            selected = $filter('filter')( $scope.project.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id });
          }
          return selected.length ? selected[0].beneficiary_type_name : 'No Selection!';
        },

        // add beneficiary
        addBeneficiary: function( $parent ) {
          $scope.inserted = {
            activity_type_id: null,
            activity_type_name: null,
            activity_description_id: null,
            activity_description_name: null,
            beneficiary_type_id: null,
            beneficiary_type_name: null,
            boys: 0, girls: 0, men:0, women:0, sessions: 0
          };
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.project.report.locations[ $parent ].beneficiaries[ $index ][ indicator ] = $data;
        },

        // sessions disabled
        rowSessionsDisabled: function( $beneficiary ){
          var disabled = true;
          if( $beneficiary.activity_description_id === 'education' || $beneficiary.activity_description_id === 'training' ) {
            disabled = false
          }
          return disabled;
        },
        
        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id &&
                $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.sessions >= 0) {
              disabled = false;
          }
          return disabled;
        },

        // save beneficiary
        saveBeneficiary: function( $data ) {
          $timeout( function(){ Materialize.toast( 'Beneficiary Saved!' , 3000, 'success' ) }, 600 );
          return [200, {status: 'ok'}];
        },

        // remove beneficiary
        removeBeneficiary: function( $parent, $index ) {
          $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
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

        // cofirm exit if changes
        modalConfirm: function( modal ){
          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.project.cancel();
          }
        },

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
          }, 200);
        },

        // ennsure all locations contain at least one complete beneficiaries 
        formComplete: function() {
          var valid = true;
          angular.forEach( $scope.project.report.locations, function( l ){
            angular.forEach( l.beneficiaries, function( b ){
              if ( $scope.project.rowSaveDisabled( b ) ) {
                valid = false;
              }
            });
          });
          return valid;
        },

        // // save project
        // save: function( complete ) {

        //   // disable btn
        //   $scope.project.report.submit = true;

        //   // set to complete if "submit monthly report"
        //   $scope.project.report.report_status = complete ? 'complete' : 'todo';

        //   // time submitted
        //   $scope.project.report.report_submitted = moment().format();

        //   // update activites for report ( from project )
        //   $scope.project.report = 
        //           ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.report )

        //   // if new beneficiary type, add to project discription
        //   var length = $scope.project.definition.beneficiary_type.length;

        //   // foreach
        //   angular.forEach( $scope.project.report.locations, function( l, i ){

        //     // update activites for location ( from project )
        //     $scope.project.report.locations[i] = 
        //           ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.report.locations[i] ); 

        //     // each beneficiary
        //     angular.forEach( l.beneficiaries, function( b, j ){

        //       // update activites for location ( from project )
        //       $scope.project.report.locations[i].beneficiaries[j] = 
        //             ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.report.locations[i].beneficiaries[j] ); 

        //       // if new type, add to project discription
        //       if ( $scope.project.definition.beneficiary_type.indexOf( b.beneficiary_type ) < 0 ) {
        //         $scope.project.definition.beneficiary_type.push( b.beneficiary_type );
        //       }
        //     });
        //   });

        //   // setReportRequest
        //   var setReportRequest = {
        //     method: 'POST',
        //     url: 'http://' + $location.host() + '/api/cluster/report/setReport',
        //     data: {
        //       report: $scope.project.report
        //     }
        //   };

        //   // setProjectRequest
        //   var setProjectRequest = {
        //     method: 'POST',
        //     url: 'http://' + $location.host() + '/api/cluster/project/setProject',
        //     data: {
        //       project: $scope.project.definition
        //     }
        //   } 

        //   // msg
        //   Materialize.toast( 'Processing Report...' , 3000, 'note');

        //   // set report
        //   ngmData.get( setReportRequest ).then( function( report, complete ){

        //     // report
        //     $scope.project.updatedAt = moment( report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' );

        //     // if no project update
        //     if ( length === $scope.project.definition.beneficiary_type.length ) {
        //       $scope.project.refreshReport( report );
        //     } else {

        //       // set project
        //       ngmData.get( setProjectRequest ).then( function( project, complete ){
        //         // project
        //         $scope.project.definition.updatedAt = moment( project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' );
        //         $scope.project.refreshReport( report );
        //       });

        //     }         

        //   });

        // },

        // // update user 
        // refreshReport: function( results, complete ){

        //   // enable
        //   $scope.project.report.submit = false;  

        //   // user msg
        //   var msg = 'Project Report for  ' + moment( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
        //       msg += complete ? 'Submitted!' : 'Saved!';

        //   // msg
        //   Materialize.toast( msg , 3000, 'success');

        //   // Re-direct to summary
        //   if ( $scope.project.report.report_status !== 'complete' ) {
        //     // avoids duplicate beneficiaries 
        //       // ( if 'save' and then 'submit' is submited without a refresh in between ) ???
        //     $route.reload();
        //   } else {
        //     $location.path( '/cluster/projects/report/' + $scope.project.definition.id );  
        //   }

        // }

      }
  }

]);

