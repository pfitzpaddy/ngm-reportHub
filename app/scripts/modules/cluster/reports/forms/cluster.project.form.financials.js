/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportCtrl
 * @description
 * # ClusterProjectFormReportCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.financials', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.financials', {
        title: 'Cluster Financial Form',
        description: 'Cluster Financial Form',
        controller: 'ClusterProjectFormFinancialCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/financials/form.html'
      });
  })
  .controller( 'ClusterProjectFormFinancialCtrl', [
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

        // last update
        updatedAt: moment( config.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        
        // title
        titleFormat: moment( config.project.reporting_period ).format('MMMM, YYYY'),
                
        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/financials/',
        financialsUrl: 'financials.html',
        notesUrl: 'notes.html',

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 400);
        },

      }

  }

]);

