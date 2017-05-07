/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStocksFormList
 * @description
 * # ClusterOrganizationStocksFormList
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.organization.stocks.list', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('organization.stocks.list', {
        title: 'Organization Warehouse and Stocks',
        description: 'Organization Warehouse and Stocks',
        controller: 'ClusterOrganizationStocksFormList',
        templateUrl: '/scripts/modules/cluster/views/forms/warehouse/form.html'
      });
  })
  .controller( 'ClusterOrganizationStocksFormList', [
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

        // organization
        getOrganizationHref: function() {
          var href = '#/cluster/organization';
          if ( $route.current.params.organization_id ) { href += '/' + $route.current.params.organization_id }
          return href;
        },

        // setorg request
        setOrganization: function() {
          return {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/setOrganization',
            data: { organization: $scope.report.organization }
          }
        },

        // rmove stocklocation request
        removeStockLocation: function( stock_warehouse_id ){
          return {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/stock/removeStockLocation',
            data: { stock_warehouse_id: stock_warehouse_id }
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
          $scope.report.organization.warehouses.push( warehouse );

          // reset
          $scope.report.options.warehouse = {};

          // update material select
          ngmClusterHelper.updateSelect();

          // Update Org with warehouse association
          ngmData.get($scope.report.setOrganization()).then( function( organization ){

            // set org
            $scope.report.organization = organization;

            // on success
            Materialize.toast( 'Warehouse Location Added!', 3000, 'success');

            // refresh to update empty reportlist
            $route.reload();

          });

        },

        // remove location from location list
        removeLocationModal: function( $index ) {

          // set location index
          $scope.report.locationIndex = $scope.report.organization.warehouses.length-1 - $index;

          // open confirmation modal
          $('#warehouses-modal').openModal({ dismissible: false });

        },

        // confirm locaiton remove
        removeLocation: function() {

          // get warehouse to remove
          var stock_warehouse_id = $scope.report.organization.warehouses[$scope.report.locationIndex].id;

          // remove location at i
          $scope.report.organization.warehouses.splice( $scope.report.locationIndex, 1 );

          // send request
          $q.all([ $http($scope.report.setOrganization()), $http($scope.report.removeStockLocation(stock_warehouse_id)) ]).then( function( results ){

            // set org
            $scope.report.organization = results[0].data;
            
            // on success
            Materialize.toast( 'Warehouse Location Removed!', 3000, 'success');

            // refresh to update empty reportlist
            // $route.reload();

          });

        }

      }
  }

]);
