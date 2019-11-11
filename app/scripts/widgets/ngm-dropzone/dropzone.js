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
		'$filter',
		'$route',
		'$timeout',
		function( $scope, $sce, $element, $location, $interval, ngmData, config, $filter, $route, $timeout ){
		
			// statistics widget default config
			$scope.dropzoneConfig = {

				// params
				url: '/upload-file',
				parallelUploads: 3,
				maxFileSize: 30,

				// card title
				cardTitle: false,

				// card header
				headerIcon: 'cloud_upload',
				header: 'collection-header blue lighten-1',

				toast: 'Process Complete!',

				// minimize upload
				minimize: {
					open: true,
					toggle: false,
					disabled: false
				},
				
				// interface display/user messages
				templateUrl: '/scripts/widgets/ngm-dropzone/template/default.html',

				dictMsg: '<div style="font-weight:400;font-size:1.2rem;">Click or Drag & Drop to Upload</div>',

				dictDefaultMessage: '<div id="default-message" align="center"><img src="images/upload/icon-drag-drop.png" width="200px" title="Click or Drag & Drop to Upload"/><br/>',
				
				previewTemplate: '<div id="dropzone-message" align="center"><img src="images/upload/feature-icon-idea-photography.png" width="200px" title="Uploading..."/><br/><div id="the-progress-text" style="font-weight:400;font-size:1.2rem;">Uploading...</div><br/><div class="dz-filename"><span data-dz-name></span></div><div class="progress"><div class="determinate" style="width:0%"></div>',
				
				processingMessage: '<div id="processing-message" align="center"><img src="images/upload/services-technology.png" width="200px" title="Processing..."/><br/><div id="processing_message" style="font-weight:400;font-size:1.2rem;">Processing...</div><div class="dz-filename"><span data-dz-name></span></div></h5><br/><div class="progress"><div class="indeterminate"></div></div>',
				
				completeMessage: '<div id="complete-message" align="center"><img src="images/upload/feature-icon-vote.png" width="200px" title="Processing..."/><br/><div style="font-weight:400;font-size:1.2rem;">Complete!<br/>Redirecting to Dashboard...(<span id="counter"></span>)</div>',

				errorMessage: '<div id="error-message" align="center"><img src="images/upload/feature-icon-judge.png" width="200px" title="Error!"/><div style="font-weight:400;font-size:1.2rem;color:#b71c1c">Error!</div><div id="error_message" style="font-weight:400;font-size:1.2rem;">Please refresh and try again</div>',
				
				process: {
					redirect: '/who',
					interval: 4
				},

				// uploadprogress
				uploadprogress: function( file, progress, bytesSent ) {
					$( ".determinate" ).width( Math.round( progress ) + '%');
					$( "#the-progress-text" ).text( Math.round( progress ) + '%');
				},

				// toggle dropzone
				openCloseDropZone: function(){
					$scope.dropzoneConfig.minimize.open = !$scope.dropzoneConfig.minimize.open;
				},

				setRedirect: function() {
					// redirect
					$interval(function() {
						// set interval
						$('#counter').html($scope.dropzoneConfig.process.interval--);
						// redirect when 0
						if ($scope.dropzoneConfig.process.interval === 0) {
							$route.reload($scope.dropzoneConfig.process.redirect);
						}
					}, 1000);          
				},

				//
				error: function( file, errorMessage, xhr ) {
					// set errormsg
					$('#dropzone-message').html('<i class="medium material-icons" style="color:#009688">error_outline</i><br/><h5 style="font-weight:300;">' + errorMessage + '</h5></div>');
				},

				//
				success: function( file, xhr ) {

					// enable minimize button
					$scope.dropzoneConfig.minimize.disabled = true;
					
					// if no process
					if ( !$scope.dropzoneConfig.process.requests ) {
							// success message
							$('#dropzone-message').html( $scope.dropzoneConfig.completeMessage );
							// redirect
							$scope.dropzoneConfig.setRedirect();

					} else if ( $scope.dropzoneConfig.process.requests.length ) {

						// variables
						var count = 0;
						var requests_count = $scope.dropzoneConfig.process.requests.length;

						// processing message
						$( '#dropzone-message' ).html( $scope.dropzoneConfig.processingMessage );

						// include file name to request
						if ( xhr.file.length ) {
							$scope.dropzoneConfig.process.requests[ count ].data.file = xhr.file[ count ].fd;
						}

						// run processes
						$scope.dropzoneConfig.doProcess( count, requests_count, $scope.dropzoneConfig.process.requests[ count ] );

					}

				},

				// do process
				doProcess: function( count, requests_count, request ) {

					// request process
					ngmData.get( request ).then( function( res ) {

						// processing message
						$( '#processing_message' ).html( res.msg );

						// set redirect
						count++;
						if ( count === requests_count ) {
							// enable minimize
							$scope.dropzoneConfig.minimize.disabled = false;
							// completed message
							$( '#dropzone-message' ).html( $scope.dropzoneConfig.completeMessage );
							// counter
							$( '#counter' ).html( $scope.dropzoneConfig.process.interval );
							// redirect
							$scope.dropzoneConfig.setRedirect();
							// toast
							$timeout(function () { Materialize.toast( $scope.dropzoneConfig.toast, 6000, 'success'); });
						} else {
							$scope.dropzoneConfig.doProcess( count, requests_count, $scope.dropzoneConfig.process.requests[ count ] );
						}
						
					},
					function(data) {
						// error!
						$('#dropzone-message').html( $scope.dropzoneConfig.errorMessage );
					});

				},

				// complete
				complete: function( file, xhr ) {},

			};

			// title
			$scope.dropzoneConfig.dictDefaultMessage += config.dictMsg ? config.dictMsg : $scope.dropzoneConfig.dictMsg

			// Merge defaults with config
			$scope.dropzoneConfig = angular.merge({}, $scope.dropzoneConfig, config);

	}
]);


