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

angular.module('ngm.widget.iframe', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('iframe', {
        title: 'iFrame Panel',
        description: 'Display iFrame',
        controller: 'iframeCtrl',
        templateUrl: 'widgets/ngm-iframe/view.html'
      });
  }).controller('iframeCtrl', [
    '$scope',
    '$sce',
    '$element',
    'config',
    function($scope, $sce, $element, config){

      // update
    
      // statistics widget default config
      $scope.iframe = {

        container: 'outerdiv', 

        id: 'inneriframe',

        height: angular.element($element).height(),

        width: angular.element($element).width(),

        url: config.url,

        div: config.div        

      };

      // resize iframe on window resize
      angular.element($(window)).bind('resize', function() {
        // resize iframe
        $scope.iframe.height = angular.element($element).height();
        $scope.iframe.height = angular.element($element).width();
      });      

      // eval url for angular
      $scope.iframe.url = $sce.trustAsResourceUrl($scope.iframe.url);

  }
]);


