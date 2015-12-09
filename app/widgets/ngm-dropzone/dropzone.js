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

angular.module('ngm.widget.dropzone', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('dropzone', {
        title: 'HMTL5 Drag and Drop Panel',
        description: 'Display HMTL5 Drag and Drop Panel',
        controller: 'dropzoneCtrl',
        templateUrl: 'widgets/ngm-dropzone/view.html'
      });
  }).controller('dropzoneCtrl', [
    '$scope',
    '$element',
    'config',
    function($scope, $element, config){
    
      // statistics widget default config
      $scope.dropzoneConfig = {
        
        //
        parallelUploads: 3,

        //
        maxFileSize: 30,

        //
        template: 'widgets/ngm-dropzone/template/default.html',

      };

      // Merge defaults with config
      $scope.dropzoneConfig = angular.merge({}, $scope.dropzoneConfig, config);

  }
]);


