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
        templateUrl: '/views/modules/health/forms/report/form.html'
      });
  })
  .controller('ProjectReportCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, config){

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

        // project
        definition: config.project,

        // report
        report: config.report,

        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // last update
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        // locations
        locationsUrl: '/views/modules/health/forms/report/locations.html',

        // beneficiaries
        beneficiariesUrl: '/views/modules/health/forms/report/beneficiaries.html',

        // holder for UI options
        options: {
          list: {
            // beneficiaries
            beneficiaries: [{
              beneficiary_type: 'conflict_displaced',
              beneficiary_name: 'Conflict Displaced'
            },{
              beneficiary_type: 'health_affected_conflict',
              beneficiary_name: 'Health Affected by Conflict'
              
            },{
              beneficiary_type: 'refugees_returnees',
              beneficiary_name: 'Refugees & Returnees'
              
            },{
              beneficiary_type: 'natural_disaster_affected',
              beneficiary_name: 'Natural Disaster Affected'
            },{
              beneficiary_type: 'public_health',
              beneficiary_name: 'Public Health at Risk'
            },{
              beneficiary_type: 'white_area_population',
              beneficiary_name: 'White Area Population'
            }]
          },
          filter: {},
          selection: {
            beneficiaries: [],
          }
        },

        // cofirm exit if changes
        modalConfirm: function(modal){

          // if not pristine, confirm exit
          if( $scope.healthReportForm.$dirty ){
            $( '#' + modal ).openModal( { dismissible: false } );
          } else{
            $scope.project.cancel();
          }

        },

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {

            // Re-direct to summary
            $location.path( '/health/projects/reports/' + $scope.project.definition.id );

          }, 100);

        },

        // save project
        save: function() {

          // update details

          // make little message too

          console.log( 'save' );

        }

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // selects
          $('select').material_select();

          // modals
          $('.modal-trigger').leanModal();

          // set list
          $scope.project.options.filter.beneficiaries = $scope.project.options.list.beneficiaries;

          // // update dropdown
          $timeout(function(){
            $( '#ngm-beneficiary-category' ).material_select('update');
          }, 10);

        }, 1000);

      });
  }

]);
