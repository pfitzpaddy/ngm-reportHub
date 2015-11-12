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

'use strict';

angular.module('ngm.widget.html', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('html', {
        title: 'HTML Panel',
        description: 'Display HTML template',
        controller: 'htmlCtrl',
        templateUrl: 'widgets/ngm-html/view.html',
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
    '$element',
    'data', 
    'config',
    function($scope, $element, data, config){
    
      // statistics widget default config
      $scope.html = {
        content: '<h1>ngm</h1>',
        template: 'widgets/ngm-html/template/default.html'
      };

      // Merge defaults with config
      $scope.html = angular.merge({}, $scope.html, config);

  }
]);


