/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStockForm
 * @description
 * # ClusterOrganizationStockForm
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.organization.stock', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('organization.stock', {
        title: 'Cluster Stock Reports Form',
        description: 'Cluster Stock Reports Form',
        controller: 'ClusterOrganizationStockForm',
        templateUrl: '/scripts/modules/cluster/views/forms/stock/form.html'
      });
  })
  .controller( 'ClusterOrganizationStockForm', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmAuth',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, config ){

      // project
      $scope.report = {

        // user
        user: ngmUser.get(),
        // app style
        style: config.style,
        // form
        submit: true,
        // project
        organization: config.organization,
        // report
        report: config.report,
        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        // last update
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        templatesUrl: '/scripts/modules/cluster/views/forms/stock/',
        locationsUrl: 'locations.html',
        stocksUrl: 'stocks.html',
        stockUrl: 'stock.html',
        notesUrl: 'notes.html',

        // lists
        lists: {
          clusters: ngmClusterHelper.getClusters(),
          units: ngmClusterHelper.getUnits( config.organization.admin0pcode ),
          stocks: localStorage.getObject( 'lists' ).stockItemsList,
          stock_status:[{
            stock_status_id: 'available',
            stock_status_name: 'Available'
          },{
            stock_status_id: 'reserved',
            stock_status_name: 'Reserved'
          }]
        }, 

        // init
        init: function(){},

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            var href = '/cluster/stocks';
            if ( $scope.report.user.roles.indexOf('ADMIN') !== -1 ) { href += '/' + $scope.report.organization.id }
            $location.path( href );
          }, 200);
        },

        // add stock
        addStock: function( $parent ) {
          $scope.inserted = {
            stock_item_type: null,
            stock_item_name: null,
            unit_type_id: null,
            unit_type_name: null,
            number_in_stock:0, number_in_pipeline:0, beneficiaries_covered:0
          };
          // process + clean location
          $scope.inserted = 
              ngmClusterHelper.getCleanStocks( $scope.report.report, $scope.report.report.stocklocations[ $parent ], $scope.inserted );
          $scope.report.report.stocklocations[ $parent ].stocks.push( $scope.inserted );
        },

        // cluster
        showStockCluster: function( $data, $stock ){
          var selected = [];
          $stock.cluster_id = $data;
          if($stock.cluster_id) {
            selected = $filter('filter')( $scope.report.lists.clusters, { cluster_id: $stock.cluster_id }, true);
            $stock.cluster = selected[0].cluster;
          }
          return selected.length ? selected[0].cluster : 'No Selection!';
        },

        // show stock type
        showStockType: function( $data, $stock ){
          var selected = [];
          $stock.stock_item_type = $data;
          if($stock.stock_item_type) {
            selected = $filter('filter')( $scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type }, true);
            $stock.stock_item_name = selected[0].stock_item_name;
          }
          return selected.length ? selected[0].stock_item_name : 'No Selection!';
        },

        showStockUnits: function( $data, $stock ){
          var selected = [];
          $stock.unit_type_id = $data;
          if( $stock.unit_type_id ) {
            selected = $filter('filter')( $scope.report.lists.units, { unit_type_id: $stock.unit_type_id }, true );
            if ( selected.length ){
              $stock.unit_type_name = selected[0].unit_type_name;
            }
          }
          return selected.length ? selected[0].unit_type_name : 'No Selection!';
        },

        showStockStatus: function( $data, $stock ){
          var selected = [];
          $stock.stock_status_id = $data;
          if( $stock.stock_status_id ) {
            selected = $filter('filter')( $scope.report.lists.stock_status, { stock_status_id: $stock.stock_status_id }, true );
            if ( selected.length ){
              $stock.stock_status_name = selected[0].stock_status_name;
            }
          }
          return selected.length ? selected[0].stock_status_name : 'No Selection!';
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.report.report.stocklocations[$parent].stocks[ $index ][ indicator ] = $data;
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.stock_item_type &&
                $data.unit_type_id &&
                $data.stock_status_id &&
                $data.number_in_stock >= 0 && $data.number_in_pipeline >= 0 && $data.beneficiaries_covered >= 0 ) {
              disabled = false;
          }
          return disabled;
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

        // remove stocks
        removeStock: function( $parent, $index ) {
          $scope.report.report.stocklocations[ $parent ].stocks.splice( $index, 1 );
          // save
          $scope.report.save( false );
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.report.cancel();
          }

        },

        // determine if all locations containt at least one beneficiaries details 
        formComplete: function() {
          var valid = false;
          angular.forEach( $scope.report.report.stocklocations, function( l ){
            angular.forEach( l.stocks, function( b ){
              if ( !$scope.report.rowSaveDisabled( b ) ) {
                valid = true;
              }
            });
          });
          return valid;
        },

        // enable edit report
        editReport: function(){
          $scope.report.report.report_status = 'todo';
          $scope.report.save( false, false );
        },

        // save 
        save: function( complete, display_modal ) {

          // disable btn
          $scope.report.submit = false;

          // set to complete if "submit monthly report"
          $scope.report.report.report_status = complete ? 'complete' : 'todo';

          // time submitted
          $scope.report.report.report_submitted = moment().format();

          // msg
          Materialize.toast( 'Processing Stock Report...' , 3000, 'note');

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/stock/setReport',
            data: {
              report: $scope.report.report
            }
          }

          // set report
          ngmData.get( setReportRequest ).then( function( report ){

            // enable
            $scope.report.submit = true;

            // report
            $scope.report.updatedAt = moment( report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' );        

            // user msg
            var msg = 'Stock Report for  ' + $scope.report.titleFormat + ' ';
                msg += complete ? 'Submitted!' : 'Saved!';

            // msg
            Materialize.toast( msg , 3000, 'success');

            // Re-direct to summary
            if ( $scope.report.report.report_status !== 'complete' ) {
              if(display_modal){
                // update
                $timeout(function() {
                  // Re-direct to summary
                  $location.path( '/cluster/stocks/');
                }, 200);
              } else {
                $timeout(function() {
                  $route.reload();
                }, 200);
              }
            } else {
              $timeout(function() {
                $location.path( '/cluster/stocks');
              }), 200;
            }

          });

        }
      }

      $scope.report.init();
  }

]);

