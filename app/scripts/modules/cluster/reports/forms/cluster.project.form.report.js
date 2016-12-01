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

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // default indicators
        indicators: ngmClusterHelper.getIndicators(),

        // project
        definition: config.project,

        // report
        report: config.report,

        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // last update
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        locationsUrl: 'locations.html',
        notesUrl: 'notes.html',
        beneficiariesUrl: 'beneficiaries/beneficiaries.html',
        beneficiariesDefaultUrl: 'beneficiaries/beneficiaries-' + ngmUser.get().cluster_id + '.html',
        beneficiariesTrainingUrl: 'beneficiaries/beneficiaries-training.html',

        // holder for UI options
        options: {
          list: {
            // beneficiaries
            beneficiaries: ngmClusterHelper.getBeneficiaries()
          },
          beneficiaries: []
        },

        // add beneficiary
        addBeneficiary: function( $index ) {

          // init load is null
          if ( $scope.project.options.beneficiaries[ $index ] ) {
            
            // process + clean location
            var beneficiaries = 
                ngmClusterHelper.getCleanBeneficiaries( $scope.project.definition, $scope.project.report, $scope.project.indicators, $scope.project.report.locations[ $index ], $scope.project.options.beneficiaries[ $index ] );

            // push to beneficiaries
            $scope.project.report.locations[ $index ].beneficiaries.unshift( beneficiaries );

            // clear selection
            $scope.project.options.beneficiaries[ $index ] = {};

            // filter / sort beneficiaries
            $scope.project.options.list.beneficiaries[ $index ]
                = ngmClusterHelper.getBeneficiaries( $scope.project.report.locations[ $index ].beneficiaries );

            // update material select
            ngmClusterHelper.updateSelect();

          }

        },

        // remove beneficiary
        removeBeneficiary: function( $parent, $index ) {

          // remove location at i
          $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );

          // filter / sort
          $scope.project.options.list.beneficiaries[ $parent ]
              = ngmClusterHelper.getBeneficiaries( $scope.project.report.locations[ $index ].beneficiaries );

          // update material select
          ngmClusterHelper.updateSelect();
          
        },

        // when the user wishes to update form
        editReport: function(){

          // set report to 'todo'
          $scope.project.report.report_status = 'todo';

          // using jquery to combat Materialize form classes! Needs a better solution
          for ( var name in ngmClusterHelper.getIndicators() ) {
            // update classes
            $( 'input[name="' + name + '"]' ).removeClass( 'ng-untouched' ).addClass( 'ng-touched' );
            $( 'input[name="' + name + '"]' ).removeClass( 'invalid' ).addClass( 'valid' );
            // if textarea
            $( 'textarea[name="' + name + '"]' ).removeClass( 'ng-untouched' ).addClass( 'ng-touched' );
            $( 'textarea[name="' + name + '"]' ).removeClass( 'invalid' ).addClass( 'valid' );            
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
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );

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
            url: 'http://' + $location.host() + '/api/cluster/report/setReport',
            data: {
              report: $scope.project.report
            }
          };

          // setProjectRequest
          var setProjectRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          } 

          // msg
          Materialize.toast( 'Processing Report...' , 3000, 'note');

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
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );  
          }

        }        

      }

      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // filter beneficiaries
          angular.forEach( $scope.project.report.locations, function( l, i ) {

            // filter / sort beneficiaries
            $scope.project.options.list.beneficiaries[ i ]
                = ngmClusterHelper.getBeneficiaries( $scope.project.report.locations[ i ].beneficiaries );

            // update select
            ngmClusterHelper.updateSelect();

          });

        }, 1000);

      });
  }

]);

