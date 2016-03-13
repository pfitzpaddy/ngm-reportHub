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
 
angular.module('ngm.widget.tabs', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('tabs', {
        title: 'Tabs Panel',
        description: 'Display Navigation Tabs',
        controller: 'tabsCtrl',
        templateUrl: '/scripts/widgets/ngm-tabs/view.html'
      });
  }).controller('tabsCtrl', [
    '$scope',
    '$element',
    '$location',
    '$timeout',
    'config',
    function($scope, $element, $location, $timeout, config){

      // statistics widget default config
      $scope.tabs = {};

      // Merge defaults with config
      $scope.tabs = angular.merge({}, $scope.tabs, config);
      
      // init tabs
      // $timeout(function(){
      //   $('ul.tabs').tabs();
      // }, 200);

  }
]);


