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

angular.module('ngm.widget.html', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('html', {
        title: 'HTML Panel',
        description: 'Display HTML template',
        controller: 'htmlCtrl',
        templateUrl: '/scripts/widgets/ngm-html/view.html',
        resolve: {
          data: function(ngmData, config){
            if (config.request){
              return ngmData.get(config.request);
            }
          }
        }
      });
  }).controller('htmlCtrl', [
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
      $scope.panel = {

        // html container id
        id: config.id ? config.id : 'ngm-html-' + Math.floor((Math.random()*1000000)),

        // display card
        display: true,
        
        // html template
        html: '',
        
        // src template
        templateUrl: '/scripts/widgets/ngm-html/template/default.html',

        // toggle tab
        toggleTab: function(href){

          // update location
          $timeout(function() {
            $location.path(href);
            $scope.$apply();
          }, 400);

        }

      }; 

      // assign data
      $scope.panel.data = data ? data : false;

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);

      // trust html
      $scope.panel.html = $sce.trustAsHtml($scope.panel.html);

      // if updatedAt
      if ( $scope.panel.data && $scope.panel.data.updatedAt ) {
        $scope.panel.data.updatedAt = moment( data.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a');
      }

      // init tabs
      if ($scope.panel.tabs) {
        $timeout(function() {
          $('ul.tabs').tabs();
        }, 400);
      }
  }
]);


