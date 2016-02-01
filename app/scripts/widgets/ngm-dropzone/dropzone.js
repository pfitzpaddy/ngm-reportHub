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
 
angular.module('ngm.widget.dropzone', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('dropzone', {
        title: 'HMTL5 Drag and Drop Panel',
        description: 'Display HMTL5 Drag and Drop Panel',
        controller: 'dropzoneCtrl',
        templateUrl: '/scripts/widgets/ngm-dropzone/view.html'
      });
  }).controller('dropzoneCtrl', [
    '$scope',
    '$sce',
    '$element',
    '$location',
    '$interval',
    'ngmData',
    'config',
    function($scope, $sce, $element, $location, $interval, ngmData, config){
    
      // statistics widget default config
      $scope.dropzoneConfig = {

        // params
        url: '/upload-file',
        parallelUploads: 3,
        maxFileSize: 30,
        
        // interface display/user messages
        templateUrl: '/scripts/widgets/ngm-dropzone/template/default.html',

        dictDefaultMessage: '<i class="medium material-icons" style="color:#009688;">cloud_upload</i><br/>Drag files here or click to upload',
        
        previewTemplate: '<div id="dropzone-message" align="center"><h5 style="font-weight:300;">Uploading...</h5><br/><h5 style="font-weight:100;"><div class="dz-filename"><span data-dz-name></span></div></h5><br/><div class="progress"><div class="determinate" data-dz-uploadprogress></div></div></div>',
        
        processingMessage: '<h5 style="font-weight:300;">Processing...</h5><br/><h5 style="font-weight:100;"><div class="dz-filename"><span data-dz-name></span></div></h5><br/><div class="progress"><div class="indeterminate"></div></div>',
        
        completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">Complete!</h5><br/><h5 style="font-weight:100;">Re-directing to dashboard...(<span id="counter"></span>)</h5></div>',
        
        process: {
          redirect: '/who',
          interval: 4
        },

        setRedirect: function() {
          // redirect
          $interval(function() {
            // set interval
            $('#counter').html($scope.dropzoneConfig.process.interval--);
            // redirect when 0
            if ($scope.dropzoneConfig.process.interval === 0) {
              $location.path($scope.dropzoneConfig.process.redirect);
            }
          }, 1000);          
        },

        //
        error: function(file, errorMessage, xhr) {
          // set errormsg
          $('#dropzone-message').html('<i class="medium material-icons" style="color:#009688">error_outline</i><br/><h5 style="font-weight:300;">' + errorMessage + '</h5></div>');
        },

        //
        success: function(file, xhr) {
          
          // if no process
          if (!$scope.dropzoneConfig.process.request) {
              // success message
              $('#dropzone-message').html($scope.dropzoneConfig.completeMessage);
              // redirect
              $scope.dropzoneConfig.setRedirect();

          } else if ($scope.dropzoneConfig.process.request) {

            // processing message
            $('#dropzone-message').html($scope.dropzoneConfig.processingMessage);
            
            // include file name to request
            $scope.dropzoneConfig.process.request.data.file = xhr.file[0].fd;
            
            // request process
            ngmData.get($scope.dropzoneConfig.process.request).then(function(res) {
              
              // completed message
              $('#dropzone-message').html($scope.dropzoneConfig.completeMessage);
              // counter
              $('#counter').html($scope.dropzoneConfig.process.interval);
              // set redirect
              $scope.dropzoneConfig.setRedirect();
              
            },
            function(data) {
              //
              $('#dropzone-message').html('<i class="medium material-icons" style="color:#009688">error_outline</i><br/><h5 style="font-weight:300;">Data processing error, please check the ' + $scope.dropzoneConfig.process.request.data.type.toUpperCase() + ' and try again!</h5></div>');
            });
          }

        },

        //
        complete: function(file, xhr) {},

      };

      // Merge defaults with config
      $scope.dropzoneConfig = angular.merge({}, $scope.dropzoneConfig, config);

  }
]);


