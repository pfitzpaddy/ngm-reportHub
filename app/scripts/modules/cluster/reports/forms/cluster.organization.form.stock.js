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
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, ngmClusterHelper, config ){

      // project
      $scope.report = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // project
        organization: config.organization,

        // report
        report: config.report,

        // validation
        validationNames: { number_in_stock:0, number_in_pipeline:0, beneficiaries_covered:0 },

        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // last update
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        templatesUrl: '/scripts/modules/cluster/views/forms/stock/',
        locationsUrl: 'locations.html',
        stocksUrl: 'stocks.html',
        stockUrl: 'stock.html',
        notesUrl: 'notes.html',

        // holder for UI options
        options: {
          list: {
            // get default stocks
            stocks: ngmClusterHelper.getStocks( config.organization.cluster_id, [] )
          },
          stocks: []
        },

        // add stock
        addStock: function( $index ) {

          // init load is null
          if ( $scope.report.options.stocks[ $index ] ) {
            
            // process + clean location
            var stocks = 
                ngmClusterHelper.getCleanStocks( $scope.report.report, $scope.report.report.stocklocations[ $index ], $scope.report.options.stocks[ $index ] );

            // push to stocks
            $scope.report.report.stocklocations[ $index ].stocks.push( stocks );

            // clear selection
            $scope.report.options.stocks[ $index ] = {};

            // filter / sort stocks
            $scope.report.options.list.stocks[ $index ]
                = ngmClusterHelper.getStocks( $scope.report.organization.cluster_id, $scope.report.report.stocklocations[ $index ].stocks );

            // update material select
            ngmClusterHelper.updateSelect();

          }

        },

        // remove stocks
        removeStock: function( $parent, $index ) {

          // remove location at i
          $scope.report.report.stocklocations[ $parent ].stocks.splice( $scope.report.report.stocklocations[ $parent ].stocks.length-1 - $index, 1 );

          // filter / sort
          $scope.report.options.list.stocks[ $parent ]
              = ngmClusterHelper.getStocks( $scope.report.organization.cluster_id, $scope.report.report.stocklocations[ $parent].stocks );

          // update material select
          ngmClusterHelper.updateSelect();
          
        },

        // when the user wishes to update form
        editReport: function(){

          // set report to 'todo'
          $scope.report.report.report_status = 'todo';

          // using jquery to combat Materialize form classes! Needs a better solution
          for ( var name in $scope.report.validationNames ) {
            console.log(name);
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
            $scope.report.cancel();
          }

        },

        // determine if all locations containt at least one beneficiaries details 
        formComplete: function() {

          var valid = true;

          // for each locations
          angular.forEach( $scope.report.report.stocklocations, function( l, i ){

            // check beneficiaries length
            if ( !l.stocks.length ) {
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
            $location.path( '/cluster/stocks/');

          }, 200);

        },

        // save 
        save: function( complete ) {

          // disable btn
          $scope.report.report.submit = true;

          // set to complete if "submit monthly report"
          $scope.report.report.report_status = complete ? 'complete' : 'todo';

          // time submitted
          $scope.report.report.report_submitted = moment().format();

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/stock/setReport',
            data: {
              report: $scope.report.report
            }
          }

          // msg
          Materialize.toast( 'Processing Stock Report...' , 3000, 'note');

          // set report
          ngmData.get( setReportRequest ).then( function( report, complete ){

            // report
            $scope.report.updatedAt = moment( report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' );        

            // 
            $scope.report.refreshReport( report );

          });

        },

        // update user 
        refreshReport: function( results, complete ){

          // enable
          $scope.report.report.submit = false;  

          // user msg
          var msg = 'Stock Report for  ' + moment( $scope.report.report.reporting_period ).format('MMMM, YYYY') + ' ';
              msg += complete ? 'Submitted!' : 'Saved!';

          // msg
          Materialize.toast( msg , 3000, 'success');

          // Re-direct to summary
          if ( $scope.report.report.report_status !== 'complete' ) {
            // avoids duplicate beneficiaries 
              // ( if 'save' and then 'submit' is submited without a refresh in between ) ???
            // Not if you do it properly (return and set with .populate()!)
            $route.reload();
          } else {
            $location.path( '/cluster/stocks');  
          }

        }        

      }

      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // filter beneficiaries
          angular.forEach( $scope.report.report.stocklocations, function( l, i ) {

            // filter / sort beneficiaries
            $scope.report.options.list.stocks[ i ]
                = ngmClusterHelper.getStocks( $scope.report.organization.cluster_id, $scope.report.report.stocklocations[ i ].stocks );

            // update select
            ngmClusterHelper.updateSelect();

          });

        }, 1000);

      });
  }

]);

