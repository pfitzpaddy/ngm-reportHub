/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectDocumentCtrl
 * @description
 * # ClusterProjectDetailsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectDocumentCtrl', ['$scope', '$rootScope', '$route', '$location', '$anchorScroll', '$timeout', '$sce', '$http', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', function ($scope, $rootScope, $route, $location, $anchorScroll, $timeout,$sce,$http, ngmAuth, ngmData, ngmUser, ngmClusterHelper) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// empty Project
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// placeholders
			title: '',
			subtitle: '',

			// current report
			// report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),

			// the header navigation settings
			getHeaderHtml: function(){
				var html = '<div class="row">'
										+'<div class="col s12 m12 l12">'
											+'<div style="padding:20px;">'
												+'<a class="btn-flat waves-effect waves-teal" href="#/cluster/projects/summary/' + $scope.report.project.id +'">'
													+'<i class="material-icons left">keyboard_return</i>Back to Project Summary'
												+'</a>'
												+'<span class="right" style="padding-top:8px;">Last Updated: ' + moment( $scope.report.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) +'</span>'
											+'</div>'
										+'</div>'
									+'</div>';

				return html;
			},

			// get organization
			getOrganization: function( organization_id ){

				// return http
				return {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/getOrganization',
					data: {
						'organization_id': organization_id
					}
				}
			},
			
			//set param upload
			setParamUpload:function(){
				return{
					project_id: $scope.report.project.id, 
					username: $scope.report.user.username, 
					organization_tag: $scope.report.project.organization_tag,
					cluster_id: $scope.report.project.cluster_id, 
					admin0pcode: $scope.report.project.admin0pcode,
					adminRpcode: $scope.report.project.adminRpcode,
					project_start_date: $scope.report.project.project_start_date,
					project_end_date: $scope.report.project.project_end_date,
				}
			},

			// set project details
			setUpload: function (data) {

				// org id
				$scope.report.organization_id =
						$route.current.params.organization_id ? $route.current.params.organization_id : ngmUser.get().organization_id;

				// org tag
				$scope.report.organization_tag =
				$route.current.params.organization_tag ? $route.current.params.organization_tag : ngmUser.get().organization_tag;

				// get data
				ngmData
					.get( $scope.report.getOrganization( $scope.report.organization_id ) )
					.then( function( organization ){
					// set model titles
					$scope.model.header.title.title = organization.admin0name.toUpperCase().substring(0, 3) + ' | ' + organization.cluster.toUpperCase() + ' | ' + organization.organization + ' | Documents';
					// $scope.model.header.subtitle.title = organization.cluster + ' projects for ' + organization.organization + ' ' + organization.admin0name;

				});

				// assign data
				$scope.report.project = data;

				// add project code to subtitle?

				$scope.report.subtitle = $scope.report.project.project_title + '- Documents' ;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_documents',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': $scope.report.subtitle
						},
						download: {
							'class': 'col s12 m3 l3',
							downloads: [{
								type: 'zip',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download all document project ' + $scope.report.project.project_title,
								request: {
									method: 'GET',
									url: ngmAuth.LOCATION + '/api/getProjectDocuments/' + $scope.report.project.id,
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'cluster_project_documents',
										format: 'zip',
										url: $location.$$path
									}
								}
							}]
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								config: {
									html: $scope.report.getHeaderHtml()
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'dropzone',
								config:{
									params: $scope.report.setParamUpload(),
									templateUrl: '/scripts/widgets/ngm-dropzone/template/upload.html',
									openModal: function (modal) {
										$('#' + modal).openModal({ dismissible: false });
									},
									previewTemplate: `	<div class="dz-preview dz-processing dz-image-preview dz-success dz-complete">
																			<div class="dz-image">
																				<img data-dz-thumbnail>
																			</div>
																			<div class="dz-details">
																				<div class="dz-size">
																					<span data-dz-size>
																				</div>
																				<div class="dz-filename">
																					<span data-dz-name></span>
																				</div>
																			</div>
																			<div data-dz-remove class=" remove-upload btn-floating red" style="margin-left:35%; "><i class="material-icons">clear</i></div> 
																		</div>`,
									completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">Complete!</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
									url: ngmAuth.LOCATION + '/api/uploadGDrive',
									acceptedFiles: 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,.zip,text/plain,text/csv,video/mp4,application/mp4',
									maxFiles: 3,
									accept:function(file,done){
										var ext = file.name.split('.').pop();
										if (file.type.indexOf('image') < 0 
												&& file.type.indexOf('officedocument') < 0 	
												&& file.type !== 'application/msword'
												&& file.type !== 'application/vnd.ms-excel'
												&& file.type !== 'application/vnd.ms-powerpoint' 
												&& file.type !== 'application/pdf'
												&& ext !== 'mp4' 
												&& ext !== 'zip'
												&& ext !== 'txt' 
												&& ext !== 'csv'
											){
											this.removeFile(file);
											$('#not-support-file').openModal({ dismissible: false });											
										}else{
											done(); 
										}
									},
									addRemoveLinks: false,
									autoProcessQueue:false,
									headers: { 'Authorization': 'Bearer ' + $scope.report.user.token },
									successMessage: false,
									dictDefaultMessage: 
										`<i class="medium material-icons" style="color:#009688;">cloud_upload</i> <br/>Drag files here or click button to upload `,
									process: {
									},
									setRedirect:function () {
										// set redirect link
										// console.log("redirect")
									},
									init:function(){
										myDropzone=this;
										$("#upload_doc").attr("disabled",true);
										$("#delete_doc").attr("disabled", true);

										document.getElementById('upload_doc').addEventListener("click", function () {
											// enable auto process queue after uploading started
											myDropzone.autoProcessQueue = true;
											myDropzone.processQueue(); // Tell Dropzone to process all queued files.																						
										});

										document.getElementById('delete_doc').addEventListener("click", function () {
											myDropzone.removeAllFiles(true);
										});

										this.on("addedfile", function (file) {
											document.querySelector(".dz-default.dz-message").style.display = 'none';
											var ext = file.name.split('.').pop();
											if(ext=='pdf'){
												$(file.previewElement).find(".dz-image img").attr("src", "images/pdfm.png");
											}
											if(ext=='doc' || ext =='docx'){
												$(file.previewElement).find(".dz-image img").attr("src", "images/docm.png");
											}
											if (ext == 'xls' || ext == 'xlsx') {
												$(file.previewElement).find(".dz-image img").attr("src", "images/xls.png");
											}
											if (ext == 'ppt' || ext == 'pptx') {
												$(file.previewElement).find(".dz-image img").attr("src", "images/ppt.png");
											}
											if(ext == 'zip'){
												$(file.previewElement).find(".dz-image img").attr("src", "images/zipm.png");
											}
											if(ext == 'txt'){
												$(file.previewElement).find(".dz-image img").attr("src", "images/txtm.png");
											}
											if (ext == 'mp4') {
												$(file.previewElement).find(".dz-image img").attr("src", "images/mp4m.png");
											}
											if (ext !== 'pdf' && ext !== 'doc' 
													&& ext !== 'docx' && ext !== 'doc' 
													&& ext !== 'xls' && ext !== 'xlsx' 
													&& ext !== 'ppt' && ext !== 'pptx' 
													&& ext !=='png' && ext !== 'zip'
													&& ext !== 'txt' && ext !== 'mp4'){
												$(file.previewElement).find(".dz-image img").attr("src", "images/elsedoc.png");
											}

											// chek filesize if more than 15MB
											if(file.size >15000000){
												$("#upload_doc").attr("disabled", true);
												document.getElementById("upload_doc").style.pointerEvents = "none";
												$("#delete_doc").attr("disabled", true);
												document.getElementById("delete_doc").style.pointerEvents = "none";
												$('#too-large-file').openModal({ dismissible: false });											
											}else{
												$("#upload_doc").attr("disabled", false);
												$("#delete_doc").attr("disabled", false);
											}
										});

										this.on("maxfilesexceeded", function (file) {
											document.querySelector(".dz-default.dz-message").style.display = 'none';
											$('#exceed-file').openModal({ dismissible: false });
											$("#upload_doc").attr("disabled", true);
											document.getElementById("upload_doc").style.pointerEvents = "none";
											$("#delete_doc").attr("disabled", true);
											document.getElementById("delete_doc").style.pointerEvents = "none";
										});

										this.on("removedfile",function(file){
											var bigFile=0
											if (myDropzone.files.length<1){
												$("#upload_doc").attr("disabled", true);
												$("#delete_doc").attr("disabled", true);
												bigFile =0;
												document.querySelector(".dz-default.dz-message").style.display = 'block';
											}

											if (myDropzone.files.length <= 3 && myDropzone.files.length >0){
													myDropzone.files.forEach((i)=>{
														if(i.size>15000000){
															bigFile +=1
														}
													})
												// check if in files there are file have more than 8MB after remove
												if(bigFile>0){
													$("#upload_doc").attr("disabled", true);
													$("#delete_doc").attr("disabled", true);
													$('#too-large-file').openModal({ dismissible: false });
												}else{
													document.getElementById("upload_doc").style.pointerEvents = 'auto';
													document.getElementById("delete_doc").style.pointerEvents = 'auto';
													$("#upload_doc").attr("disabled", false);
													$("#delete_doc").attr("disabled", false);
												}
												
											}
										});

										this.on("reset",function(){
											$(".progress").show()
											document.getElementById("upload_doc").style.pointerEvents = 'auto';
											document.getElementById("delete_doc").style.pointerEvents = 'auto';
										});

										myDropzone.on("uploadprogress", function (file, progress, bytesSent){
											// hide preview file upload 
											var previews = document.querySelectorAll(".dz-preview");
											previews.forEach(function (preview) {
												preview.style.display = 'none';
											})
											
											document.querySelector(".dz-default.dz-message").style.display = 'none';
											document.querySelector(".percent-upload").style.display = 'block';
											$(".percentage").html('<div style="font-size:32px;">Uploading....! </div>');
											// uncomment  this code below, if the write to server and gdrive is work well 
											// progress = Math.round(progress)
											// $(".percentage").text(progress + '%');											

											// if(progress== 100){												
											// 	$timeout(function () {
											// 		$(".percentage").html('<i class="medium material-icons" style="color:#009688;margin-left: 38%;">check_circle_outline</i><div style="font-size:32px;">Upload Success ! </div>');
											// 		$(".progress").hide()
											// 	},1000)
											// }
										})

										myDropzone.on('sending',function(file){
											if (this.getUploadingFiles().length == 1){
												Materialize.toast('Uploading...',3000, 'note');
											}
											$("#upload_doc").attr("disabled", true);
											// $("#delete_doc").attr("disabled", true);
										})
										
										
										myDropzone.on("complete", function (file) {
											if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
												myDropzone.removeAllFiles(true); 
											}

										});
									},
									success:function(){
										if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
												msg = "File Uploaded!";
												typ = 'success';
												Materialize.toast(msg, 2000, typ);
											
											document.querySelector(".percent-upload").style.display = 'none';
											document.querySelector(".dz-default.dz-message").style.display = 'block';
											$rootScope.$broadcast('refresh:doclist');
										}
									},
									error:function(file,response){
										document.querySelector(".percent-upload").style.display = 'none';									
										document.querySelector(".dz-default.dz-message").style.display = 'block';
										
										if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 ) {
											myDropzone.removeAllFiles(true);
											$timeout(function () {

												typ = 'error';
												Materialize.toast(response, 2000, typ);
												if(response.indexOf('canceled')<0){
													Materialize.toast('Upload canceled', 2000,typ);
												}
											}, 500);
										}
									}
								}
							}]
						}]
						}, {
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'list',
									card: 'white grey-text text-darken-2',
									config: {
										refreshEvent: 'refresh:doclist',
										titleIcon: 'alarm_on',
										color: 'blue lighten-4',
										itemsPerPage: 6,
										itemsPerPageGrid:18,
										openModal: function (modal,link) {
											$('#' + modal).openModal({ dismissible: false });
											if(link!==''){
												if(modal === 'close-preview-modal'){
													$scope.linkPreview= link;
												}else{													
													// if its from google drive; link in here is id of google drive  file
													$scope.linkPreview = "https://drive.google.com/file/d/"+link+"/preview"
												}
											}
										},
										extentionIcon:function(text){
											text = text.toLowerCase().replace(/\./g, '')
											if (text == 'pdf' || text == 'doc' || text == 'docx' || text == 'ppt' || text == 'pptx' || text == 'xls' || text == 'xlsx'){
												return 'insert_drive_file'
											}
											if(text=='png'||text=='jpg'||text=='jpeg'){
												return 'photo_size_select_actual'
											}
											if(text =='mp4'){
												return 'play_arrow'
											}
											return 'attach_file'
										},
										extentionColor:function(text){
											text = text.toLowerCase().replace(/\./g, '')
											if (text == 'pdf' || text == 'doc' || text == 'docx' || text == 'ppt' || text == 'pptx' || text == 'xls' || text == 'xlsx') {												
												return '#2196f3 !important'
											}
											if (text == 'png' || text == 'jpg' || text == 'jpeg') {
												return '#f44336 !important'
											}
											if (text == 'mp4') {
												return '#f44336 !important'
											}
											return '#26a69a !important'
										},
										removeFile:function(){
											// IF API READY TO USE
											Materialize.toast("Deleting...", 2000, 'note'); 
											$http({
												method: 'DELETE',
												url: ngmAuth.LOCATION + '/api/deleteGDriveFile/' + $scope.fileId,
												headers: { 'Authorization': 'Bearer ' + $scope.report.user.token },
											})
											.success(function (result){
														$timeout(function () {															
															msg="File Deleted!";
															typ = 'success';
															Materialize.toast(msg, 2000, typ);
															$rootScope.$broadcast('refresh:doclist');
														}, 2000);														
											})
											.error(function (err){
												$timeout(function () {
													msg = "Error, File Not Deleted!";
													typ = 'error';
													Materialize.toast(msg, 2000, typ);
												}, 2000);
											})
										},
										setRemoveId:function(id){
											$scope.fileId = id;
										},
										setLink: function(){
											return $sce.trustAsResourceUrl($scope.linkPreview);
										},
										setDonwloadLink:function(id){
											var donwloadLink ="https://drive.google.com/uc?export=download&id="+id;
											return donwloadLink;
										},
										setThumbnailfromGdrive:function(id,file_type){
											img = "https://drive.google.com/thumbnail?authuser=0&sz=w320&id="+id;
												return img

										},
										title: 'Upload',
										hoverTitle: 'Update',
										icon: 'edit',
										rightIcon: 'watch_later',
										templateUrl: 'scripts/widgets/ngm-list/template/list_upload.html',
										request: {
											method: 'GET',
											url: ngmAuth.LOCATION + '/api/listProjectDocuments/' + $route.current.params.project
										}									
									}
								}]
							}]

					},{columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel',
								style: 'padding:0px; height: 90px; padding-top:10px;',
								config: {
									html: $scope.report.ngm.footer
								}
							}]
						}]
					}]
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}

		}

		// Run page

		// return project
		ngmData.get({
			method: 'POST',
			url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
			data: {
				id: $route.current.params.project
			}
		}).then(function (data) {
			// assign data
			$scope.report.setUpload(data);
		});

	}]);
