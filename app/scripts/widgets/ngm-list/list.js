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

angular.module('ngm.widget.list', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('list', {
        title: 'Materialize Paginated List',
        description: 'Display List template',
        controller: 'listCtrl',
        templateUrl: '/scripts/widgets/ngm-list/view.html',
        resolve: {
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  }).controller('listCtrl', [
    '$scope',
    '$sce',
    '$element',
    '$location',
    '$timeout',
    'ngmAuth',
    'data', 
    'config',
    function($scope, $sce, $element, $location, $timeout, ngmAuth, data, config){
    
      // statistics widget default config
      $scope.list = {

        // paginate id
        id: config.id ? config.id : 'ngm-paginate-' + Math.floor((Math.random()*1000000)),

        // format reporting_period
        format: false,

        // search
        search: {
          filter: '',
          focused: false
        },

        // default params
        itemsPerPage: 5,
        
        // src template
        templateUrl: '/scripts/widgets/ngm-list/template/default.html',

        // format date
        updatedAt: function( date ) {
          // return moment
          return moment( date ).format('DD MMMM, YYYY @ h:mm:ss a');
        },

        // format date
        monthlyTitleFormat: function( date ) {
          // return moment
          return moment.utc( date ).format('MMMM, YYYY');
        },

        // format date
        dueFormat: function( date ) {
          // return moment
          return moment.utc( date ).format('DD MMMM, YYYY');
        },

        // description
        reportFormat: function( report ) {

          // return list description
          if( report.report_status === 'complete' ) {
            return 'Report Submitted: ' + $scope.list.dueFormat( report.report_submitted );
          } else {
            return 'Report Due Date: ' + $scope.list.dueFormat( report.reporting_due_date );
          }

        },

        // expand search box
        toggleSearch: function( $event ) {
          // focus search
          $( '#search_' + $scope.list.id ).focus();
          $scope.list.search.focused = $scope.list.search.focused ? false : true;

        }

      };

      // assign data
      $scope.list.data = data ? data : false;

      // Merge defaults with config
      $scope.list = angular.merge({}, $scope.list, config);

      // format list
      if ( $scope.list.format ) {
        // momentjs
        $scope.list.data.forEach( function( d, i ){
          // add this to assist display / filtering
          $scope.list.data[i].reporting_period_title = $scope.list.monthlyTitleFormat( d.reporting_period );
        });
      }

  }
]);


