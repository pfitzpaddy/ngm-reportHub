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

angular.module('ngm.widget.table', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('table', {
        title: 'Table Panel',
        description: 'Display ngTable widget',
        controller: 'tableCtrl',
        templateUrl: '/scripts/widgets/ngm-table/view.html',
        resolve: {
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  }).controller('tableCtrl', [
    '$scope',
    '$location',
    '$element',
    'data', 
    'config',
    'NgTableParams',
    function($scope, $location, $element, data, config, NgTableParams){
    
      // table config
      $scope.table = {

        // html container id
        id: config.id ? config.id : 'ngm-table-' + Math.floor((Math.random()*1000000)),

        // search replace "," global
        regex: new RegExp(',', 'g'),

        // ngTable params
        tableOptions: {
          page: 1,
          count: 10,
        },

        // ngTable settings
        tableSettings: {
          counts: []
        },

        formatUtcDate: function ( date ) {
          // return moment
          return moment.utc( date ).format('MMMM');
        },

        // on row click
        rowClick: function( newTab, href ){

          // in new tab
          if ( newTab ) {
            window.open( href , '_blank');
          } else {
            $location.path( href );
          }
        }

      };

      // Merge defaults with config
      $scope.table = angular.merge({}, $scope.table, config);

      // data
      $scope.data = config.data ? config.data : data;

      // check if features
      if ( data && data.features ) {
        $scope.data = data.features;
      }

      // update settings based on data
      $scope.table.tableSettings.total = config.total ? config.total : $scope.data.length;
      $scope.table.tableSettings.data = $scope.data;

      // ngTable
      $scope.table.tableParams = new NgTableParams($scope.table.tableOptions, $scope.table.tableSettings);

  }
]);


