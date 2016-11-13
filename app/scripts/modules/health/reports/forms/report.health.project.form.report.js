/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectFormDetailsCtrl
 * @description
 * # ReportHealthProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.report', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.report', {
        title: 'Health Reports Form',
        description: 'Health Reports Form',
        controller: 'ProjectReportCtrl',
        templateUrl: '/scripts/modules/health/views/forms/report/form.html'
      });
  })
  .controller('ProjectReportCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, config){

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // exchange rate
        exchange: {
          USDUSD: 1,
          USDAFN: 68.61          
        },

        // default indicators
        indicators: {
          boys: 0,
          girls: 0,
          men: 0,
          women: 0,
          penta3_vacc_male_under1: 0,
          penta3_vacc_female_under1: 0,
          skilled_birth_attendant: 0,
          conflict_trauma_treated: 0,
          capacity_building_sessions: 0,
          capacity_building_male: 0,
          capacity_building_female: 0,
          education_sessions: 0,
          education_male: 0,
          education_female: 0          
        },

        // project
        definition: config.project,

        // report
        report: config.report,

        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // last update
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        // locations
        locationsUrl: '/scripts/modules/health/views/forms/report/locations.html',

        // locations
        notesUrl: '/scripts/modules/health/views/forms/report/notes.html',

        // beneficiaries
        beneficiariesUrl: '/scripts/modules/health/views/forms/report/beneficiaries.html',

        // default
        beneficiariesDefaultUrl: '/scripts/modules/health/views/forms/report/beneficiaries/beneficiaries-default.html',

        // training
        beneficiariesTrainingUrl: '/scripts/modules/health/views/forms/report/beneficiaries/beneficiaries-training.html',        

        // something to do with formatting of forms with editiing a selected form!?
        formNames: [{
          name: 'boys'
        },{
          name: 'girls'
        },{
          name: 'men'
        },{
          name: 'women'
        },{
          name: 'pentaMale'
        },{
          name: 'pentaFemale'
        },{
          name: 'sba'
        },{
          name: 'conflictTrauma'
        },{
          name: 'educationTopic'
        },{
          name: 'educationSessions'
        },{
          name: 'educationMale'
        },{
          name: 'educationFemale'
        },{
          name: 'capacityTopic'
        },{
          name: 'capacitySessions'
        },{
          name: 'capacityMale'
        },{
          name: 'capacityFemale'
        }],

        // holder for UI options
        options: {
          list: {
            // beneficiaries
            beneficiaries: [{
              beneficiary_type: 'conflict_displaced',
              beneficiary_name: 'Conflict IDPs'
            },{
              beneficiary_type: 'health_affected_conflict',
              beneficiary_name: 'Health Affected by Conflict'
            },{
              beneficiary_type: 'training',
              beneficiary_name: 'Education & Capacity Building'
            },{
              beneficiary_type: 'natural_disaster_affected',
              beneficiary_name: 'Natural Disaster IDPs'
            },{
              beneficiary_type: 'refugees_returnees',
              beneficiary_name: 'Refugees & Returnees'
            },{
              beneficiary_type: 'white_area_population',
              beneficiary_name: 'White Area Population'
            }]
          },
          filter: {
            beneficiaries: []
          },
          selection: {
            beneficiaries: [],
          }
        },

        // add beneficiary
        addBeneficiary: function( $index ) {

          // copy selection
          var beneficiary = angular.copy( $scope.project.options.selection.beneficiaries[ $index ] );

          // beneficiaries
          var b = {
            beneficiary_name: beneficiary.beneficiary_name,
            beneficiary_type: beneficiary.beneficiary_type
          }

          // beneficiaries + location
          b = angular.merge( {}, b, $scope.project.report.locations[$index] );

          // beneficiaries + location + indicators
          b = angular.merge( {}, b, $scope.project.indicators );

          // beneficiaries + location + indicators + project
          b = angular.merge( {}, b, config.project );
          b.project_id = config.project.id;
          delete b.id;

          // beneficiaries + location + indicators + project + report
          b = angular.merge( {}, b, $scope.project.report );
          b.report_id = $scope.project.report.id;
          delete b.id;
          // remove duplication from merge
          delete b.project_budget_progress;
          delete b.target_beneficiaries;
          delete b.target_locations;
          delete b.locations;

          // push to beneficiaries
          $scope.project.report.locations[ $index ].beneficiaries.unshift( b );

          // clear selection
          $scope.project.options.selection.beneficiaries[ $index ] = {};

          // filter list
          $scope.project.options.filter.beneficiaries[ $index ] = $filter( 'filter' )($scope.project.options.filter.beneficiaries[$index], { beneficiary_type: '!' + beneficiary.beneficiary_type }, true);

          // update dropdown
          $timeout(function(){
            // apply filter
            $( 'select' ).material_select();
          }, 0);

        },

        // remove beneficiary
        removeBeneficiary: function( $parent, $index ) {

          // add option to selection
          $scope.project.options.filter.beneficiaries[ $parent ].push({
            'beneficiary_type': $scope.project.report.locations[ $parent ].beneficiaries[ $index ].beneficiary_type,
            'beneficiary_name': $scope.project.report.locations[ $parent ].beneficiaries[ $index ].beneficiary_name,
          });

          // remove location at i
          $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );

          // sort
          $scope.project.options.filter.beneficiaries[ $parent ] = $filter( 'orderBy' )( $scope.project.options.filter.beneficiaries[ $parent ], 'beneficiary_name' );

          // update dropdown
          $timeout(function(){
            // apply filter
            $( 'select' ).material_select();
          }, 0);

        },

        // when the user wishes to update form
        editReport: function(){

          // set report to 'todo'
          $scope.project.report.report_status = 'todo';

          // using jquery to combat Materialize
          angular.forEach( $scope.project.formNames, function( d, i ){
            // update classes
            $( 'input[name="' + d.name + '"]' ).removeClass('ng-untouched').addClass('ng-touched');
            $( 'input[name="' + d.name + '"]' ).removeClass('invalid').addClass('valid');            
          });

        },

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            // if ( $scope.healthReportForm.$dirty ) {
            //   $( '#' + modal ).openModal( { dismissible: false } );
            // } else{
              $scope.project.cancel();
            // }
          }

        },

        // determine if all locations containt at least one beneficiaries details 
        formComplete: function() {

          var valid = true;

          // for each locations
          angular.forEach( $scope.project.report.locations, function( l, i ){

            // check beneficiaries length
            if ( !l.beneficiaries.length ) {
              // if no beneficiaries for one loaction then not valid
              valid = false;

            }

          });

          return valid;

        },

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {

            // Re-direct to summary
            $location.path( '/health/projects/report/' + $scope.project.definition.id );

          }, 200);

        },

        // save project
        save: function( complete ) {

          // disable btn
          $scope.project.report.submit = true;

          // set to complete if "submit monthly report"
          $scope.project.report.report_status = complete ? 'complete' : 'todo';

          // time submitted
          $scope.project.report.report_submitted = moment().format();

          // if new beneficiary type, add to project discription
          var length = $scope.project.definition.beneficiary_type.length;
          angular.forEach( $scope.project.report.locations, function( l, i ){
            // each beneficiary
            angular.forEach( l.beneficiaries, function( b, j ){
              // if new type, add to project discription
              if ( $scope.project.definition.beneficiary_type.indexOf( b.beneficiary_type ) < 0 ) {
                $scope.project.definition.beneficiary_type.push( b.beneficiary_type );
              }
            });
          });

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/health/report/setReport',
            data: {
              report: $scope.project.report
            }
          };

          // setProjectRequest
          var setProjectRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/health/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }

          // set report
          ngmData.get( setReportRequest ).then( function( report, complete ){  

            // if no project update
            if ( length === $scope.project.definition.beneficiary_type.length ) {
              $scope.project.refreshReport( report );
            } else {

              // set project
              ngmData.get( setProjectRequest ).then( function( project, complete ){
                $scope.project.refreshReport( report );
              });

            }         

          });

        },

        // update user 
        refreshReport: function( results, complete ){

          // enable
          $scope.project.report.submit = false;  

          // user msg
          var msg = 'Project Report for  ' + moment( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
              msg += complete ? 'Submitted!' : 'Saved!';

          // msg
          Materialize.toast( msg , 3000, 'success');

          // Re-direct to summary
          if ( $scope.project.report.report_status !== 'complete' ) {
            // avoids duplicate beneficiaries ( if 'save' and then 'submit' is submited without a refresh in between )
            $route.reload();            
          } else {
            $location.path( '/health/projects/report/' + $scope.project.definition.id );  
          }

        }        

      }

      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // selects
          $( 'select' ).material_select();

          // modals
          $( '.modal-trigger' ).leanModal();

          // maximise text area
          if ( $scope.project.report.notes ) {
            $( 'textarea' ).height( $('textarea')[0].scrollHeight );
          }

          // filter beneficiaries
          angular.forEach( $scope.project.report.locations, function( l, i ) {
            
            // set list
            $scope.project.options.filter.beneficiaries[i] = angular.copy( $scope.project.options.list.beneficiaries );

            // if beneficiaries
            if ( l.beneficiaries.length ) {

              // for each beneficiaries
              angular.forEach( l.beneficiaries, function( d, j ){
              
                // filter list
                $scope.project.options.filter.beneficiaries[ i ] = $filter( 'filter' )( $scope.project.options.filter.beneficiaries[ i ], { beneficiary_type: '!' + d.beneficiary_type }, true);              

              });

              // sort
              $scope.project.options.filter.beneficiaries[ i ] = $filter( 'orderBy' )( $scope.project.options.filter.beneficiaries[ i ], 'beneficiary_name' );        

            }

          }); 

          // update dropdown
          $timeout(function(){
            $( 'select' ).material_select();
          }, 10);

        }, 1000);

      });
  }

]);
