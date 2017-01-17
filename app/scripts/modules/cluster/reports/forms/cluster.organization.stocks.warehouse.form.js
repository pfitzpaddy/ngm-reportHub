/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStocksWarehouseForm
 * @description
 * # ClusterOrganizationStocksWarehouseForm
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.organization.stocks.warehouse.form', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('organization.stocks.warehouse.form', {
        title: 'Organization Warehouse and Stocks',
        description: 'Organization Warehouse and Stocks',
        controller: 'ClusterOrganizationStocksWarehouseForm',
        templateUrl: '/scripts/modules/cluster/views/forms/warehouse/form.html'
      });
  })
  .controller( 'ClusterOrganizationStocksWarehouseForm', [
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
    function($scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, ngmClusterHelper, config){

      // project
      $scope.report = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // budget
        budget: {
          project_budget_amount_recieved: 0,
          project_budget_date_recieved: moment().format('YYYY-MM-DD')
        },

        // project
        organization: config.organization,

        // last update
        updatedAt: moment( config.organization.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // warehouseUrl
        warehouseUrl: '/scripts/modules/cluster/views/forms/warehouse/locations.html',

        // holder for UI options
        options: {
          filter: {},
          warehouse: {},
          list: {
            // admin1 ( with admin0 filter )
            admin1: $filter( 'filter' )( localStorage.getObject( 'lists' ).admin1List, 
                            { admin0pcode: ngmUser.get().admin0pcode }, true ),
            // admin2 ( with admin0 filter )
            admin2: $filter( 'filter' )( localStorage.getObject( 'lists' ).admin2List, 
                            { admin0pcode: ngmUser.get().admin0pcode }, true ),
          }
        },

        // helpers helper
        updateLocationSelect: function( filter ) {

          // filter
          if ( filter ) {
            // why is admin2 filter not working in ng-repeat?
            $scope.report.options.list.admin2 = 
                    $filter( 'filter' )( localStorage.getObject( 'lists' ).admin2List, 
                            { admin1pcode: $scope.report.options.warehouse.admin1.admin1pcode }, true );
          }

          // update material_select
          ngmClusterHelper.updateSelect();

        },

        // add location
        addLocation: function(){

          // process + clean warehouse 
          var warehouse = 
              ngmClusterHelper.getCleanWarehouseLocation( ngmUser.get(), $scope.report.organization, $scope.report.options.warehouse );
 
          // extend targets with project, ngmData details & push
          $scope.report.organization.warehouses.unshift( warehouse );

          // reset
          $scope.report.options.warehouse = {};

          // update material select
          ngmClusterHelper.updateSelect();

          // Update Org with warehouse association
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/setOrganization',
            data: { organization: $scope.report.organization }
          }).then( function( organization ){

            // on success
            Materialize.toast( 'Warehouse Location Added!', 3000, 'success');

            // updated timestamp
            $route.reload();

          });

        },

        // remove location from location list
        removeLocationModal: function( $index ) {

          // set location index
          $scope.report.locationIndex = $index;

          // open confirmation modal
          $('#warehouses-modal').openModal({ dismissible: false });

        },

        // confirm locaiton remove
        removeLocation: function() {

          // remove location at i
          $scope.report.organization.warehouses.splice( $scope.report.locationIndex, 1 );

          // Update Org with warehouse association
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/setOrganization',
            data: { organization: $scope.report.organization }
          }).then( function( project ){
            
            // on success
            Materialize.toast( 'Warehouse Location Removed!', 3000, 'success');

            // reload
            $route.reload();

          });

        }

      }
  }

]);
