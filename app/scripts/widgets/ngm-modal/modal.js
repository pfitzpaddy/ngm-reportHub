/* *
 * The MIT License
 *
 * Copyright (c) 2015, Patrick Fitzgerald
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

angular.module('ngm.widget.modal', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('modal', {
        title: 'Modal',
        description: 'Display Modal',
        controller: 'modalCtrl',
        templateUrl: '/scripts/widgets/ngm-modal/view.html'
      });
  }).controller('modalCtrl', [
    '$scope',
    '$location',
    'ngmData',
    'NgTableParams',
    'config',
    function($scope, $location, ngmData, NgTableParams, config){
    
      // statistics widget default config
      $scope.modal = {

        // html container id
        id: config.id,

        // show loading
        loading: true,

        // src template
        templateUrl: '/scripts/widgets/ngm-modal/template/dews.modal.html',

        // set ng-table params
        table: function(data){
          // modal data
          $scope.modal.data = data;
          // set $scope
          $scope.modal.tableParams = new NgTableParams({
              page: 1,
              count: 10,
            }, { 
              total: data.length, 
              counts: [], 
              data: data 
          });
        },

        // close modal
        open: function( params ){

          // turn off loading
          $scope.modal.loading = true;

          // set date
          $scope.modal.date = moment( params.date ).format( 'DD MMMM, YYYY' ),

          // set filename
          $scope.modal.filename = 'daily-summary-' + $scope.modal.date.replace(' ', '_').replace(', ', '_') + '-for-' + $location.$$path.replace(/\//g, '_').slice(1, -22) + '-extracted-' + moment().format() + '.csv',          
          
          // open materialize
          $('#' + $scope.modal.id).openModal($scope.modal.materialize);

          // get data
          ngmData.get( params.request )
            .then( function( response ) {

              // turn off loading
              $scope.modal.loading = false;

              // assign data to table
              $scope.modal.table( response.data );
            });

        }

      };

      // Merge defaults with config
      $scope.modal = angular.merge({}, $scope.modal, config);

      // listen to broadcast events
      $scope.$on( $scope.modal.id, function( event, params ) {

        // open modal
        $scope.modal.open(params);

      });

    }
  ]);


