angular.module('ngmReportHub')
	.factory('ngmClusterDocument',
		[	'ngmAuth',
			'ngmData',
			'ngmUser',
			'$timeout',
			'$filter',
			'$http',
			'$rootScope',
			'$sce',
			function (ngmAuth, ngmData, ngmUser, $timeout, $filter, $http, $rootScope,$sce) {
				var upload={}
				var ngmClusterDocument ={
					setParam:function (token) {
						// upload.params = params;
						upload.token = token;
					},
					getDocument: function (id, api_url, grid_page, list_page, nameOfList) {
						ngmData.get({
							method: 'GET',
							async:false,
							url: ngmAuth.LOCATION + api_url + id
						}).then(function (data) {
							// assign data
							// set for grid view
							// var listUpload;
							// $rootScope[nameOfList] = data;
							// $rootScope[nameOfList].id = 'ngm-paginate-' + Math.floor((Math.random() * 1000000))
							// $rootScope[nameOfList].itemsPerPage = 12;
							// $rootScope[nameOfList].itemsPerListPage = 6;


						});
					},
					// ****to manage shown file****
					// open preview modal
					openPreview: function (modal, link) {
						// $('#' + modal).openModal({ dismissible: false });
						$('#' + modal).modal({ dismissible: false });
						$('#' + modal).modal('open');
						this.linkPreview = "https://drive.google.com/file/d/" + link + "/preview";
						console.log(modal, link);
					},
					// set link to preview the file
					setLink: function () {

						return $sce.trustAsResourceUrl(this.linkPreview);
					},
					// set download link
					setDownloadLink: function (id) {
						var donwloadLink = "https://drive.google.com/uc?export=download&id=" + id;
						return donwloadLink;
					},
					// set id to remove file
					setRemoveId: function (modal, id) {
						// $('#' + modal).openModal({ dismissible: false });
						$('#' + modal).modal({ dismissible: false });
						$('#' + modal).modal('open');
						this.removeFileId = id;
					},
					// remove file
					removeFile: function () {

						// Materialize.toast($filter('translate')('deleting'), 6000, 'note');
						M.toast({ html: $filter('translate')('deleting'), displayLength: 6000, classes: 'note' });
						$http({
							method: 'DELETE',
							url: ngmAuth.LOCATION + '/api/deleteGDriveFile/' + this.removeFileId,
							headers: { 'Authorization': 'Bearer ' + upload.token },
						})
							.success(function (result) {
								$timeout(function () {
									msg = $filter('translate')('file_deleted');
									typ = 'success';
									// Materialize.toast(msg, 6000, typ);
									M.toast({ html: msg, displayLength: 6000, classes: typ });

									$rootScope.$broadcast('refresh:listUpload');
								}, 2000);
							})
							.error(function (err) {
								$timeout(function () {
									msg = $filter('translate')('error_file_not_deleted');
									typ = 'error';
									// Materialize.toast(msg, 6000, typ);
									M.toast({ html: msg, displayLength: 6000, classes: typ });
								}, 2000);
							})
					},
					// to show icon based on extention like PNG,PDF etc
					extentionIcon: function (text) {
						text = text.toLowerCase().replace(/\./g, '')
						if (text == 'pdf' || text == 'doc' || text == 'docx' || text == 'ppt' || text == 'pptx' || text == 'xls' || text == 'xlsx') {
							return 'insert_drive_file'
						}
						if (text == 'png' || text == 'jpg' || text == 'jpeg') {
							return 'photo_size_select_actual'
						}
						if (text == 'mp4') {
							return 'play_arrow'
						}
						return 'attach_file'
					},
					// to show icon color based on extention like PNG,PDF etc
					extentionColor: function (text) {

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
					// set thumbnail file in a  grid view
					setThumbnailfromGdrive: function (id) {
						img = "https://drive.google.com/thumbnail?authuser=0&sz=w320&id=" + id;
						return img
					},
					// to manage shown file end
					// config for dropzone upload
					uploadDocument: function (parameter) {
						var upload = {
							openModal: function (modal) {
								// $('#' + modal).openModal({ dismissible: false });
								$('#' + modal).modal({ dismissible: false });
								$('#' + modal).modal('open');
							},
							closeModal: function (modal) {
								myDropzone.removeAllFiles(true);
								M.toast({ html: $filter('translate')('cancel_to_upload_file'), displayLength: 2000, classes: 'note'});
							},
							// params: {
							// 	project_id: id === 'new' ? null : id,
							// 	username: config.project.username,
							// 	organization_tag: config.project.organization_tag,
							// 	cluster_id: config.project.cluster_id,
							// 	admin0pcode: config.project.admin0pcode,
							// 	adminRpcode: config.project.adminRpcode,
							// 	project_start_date: config.project.project_start_date,
							// 	project_end_date: config.project.project_end_date,
							// },
							params: parameter,
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
							completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">' + $filter('translate')('complete') + '</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
							url: ngmAuth.LOCATION + '/api/uploadGDrive',
							acceptedFiles: 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,.zip,text/plain,text/csv,video/mp4,application/mp4',
							maxFiles: 3,
							parallelUploads: 3,
							accept: function (file, done) {
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
								) {
									this.removeFile(file);
									if (this.getQueuedFiles().length > 0) {
										document.querySelector(".dz-default.dz-message").style.display = 'block';
										$timeout(function () {
											document.querySelector(".dz-default.dz-message").style.display = 'none';
										}, 2000)
									}
									$('.dz-default.dz-message').html(upload.notSupportedFile);
									$timeout(function () {
										$('.dz-default.dz-message').html(upload.dictDefaultMessage);
									}, 2000)
								} else {
									done();
								}
							},
							dictDefaultMessage:
								`<i class="medium material-icons" style="color:#009688;">cloud_upload</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' ',
							dictMaxFilesExceeded: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + $filter('translate')('exceed_file_upload_please_remove_one_of_your_file') + ' ',
							tooLargeFilesSize: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + $filter('translate')('file_too_large_please_remove_the_file') + ' ',
							notSupportedFile: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + $filter('translate')('not_supported_file_type') + ' ',
							errorMessage: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Error`,
							addRemoveLinks: false,
							autoProcessQueue: false,
							headers: { 'Authorization': 'Bearer ' + ngmUser.get().token },
							init: function () {
								myDropzone = this;
								// upload_doc and delete_doc is ID for button upload and cancel
								$("#upload_doc").attr("disabled", true);
								$("#delete_doc").attr("disabled", true);

								document.getElementById('upload_doc').addEventListener("click", function () {
									// enable auto process queue after uploading started
									myDropzone.autoProcessQueue = true;
									myDropzone.processQueue(); // Tell Dropzone to process all queued files.
								});

								document.getElementById('delete_doc').addEventListener("click", function () {
									myDropzone.removeAllFiles(true);
								});

								// when add file
								myDropzone.on("addedfile", function (file) {
									document.querySelector(".dz-default.dz-message").style.display = 'none';
									var ext = file.name.split('.').pop();
									//change preview if not image/*
									if (ext == 'pdf') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/pdfm.png");
									}
									if (ext == 'doc' || ext == 'docx') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/docm.png");
									}
									if (ext == 'xls' || ext == 'xlsx') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/xls.png");
									}
									if (ext == 'ppt' || ext == 'pptx') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/ppt.png");
									}
									if (ext == 'zip') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/zipm.png");
									}
									if (ext == 'txt') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/txtm.png");
									}
									if (ext == 'mp4') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/mp4m.png");
									}
									if (ext !== 'pdf' && ext !== 'doc'
										&& ext !== 'docx' && ext !== 'doc'
										&& ext !== 'xls' && ext !== 'xlsx'
										&& ext !== 'ppt' && ext !== 'pptx'
										&& ext !== 'png' && ext !== 'zip'
										&& ext !== 'txt' && ext !== 'mp4') {
										$(file.previewElement).find(".dz-image img").attr("src", "images/elsedoc.png");
									}

									// chek filesize if more than 15MB
									if (file.size > 15000000) {
										document.querySelector(".dz-default.dz-message").style.display = 'block'
										$('.dz-default.dz-message').html(upload.tooLargeFilesSize);
										// upload_doc and delete_doc is ID for button upload and cancel
										$("#upload_doc").attr("disabled", true);
										document.getElementById("upload_doc").style.pointerEvents = "none";
										$("#delete_doc").attr("disabled", true);
										document.getElementById("delete_doc").style.pointerEvents = "none";
									} else {
										$("#upload_doc").attr("disabled", false);
										$("#delete_doc").attr("disabled", false);
									}
								});

								// when remove file
								myDropzone.on("removedfile", function (file) {
									var bigFile = 0
									if (myDropzone.files.length < 1) {
										// upload_doc and delete_doc is ID for button upload and cancel
										$("#upload_doc").attr("disabled", true);
										$("#delete_doc").attr("disabled", true);
										bigFile = 0;
										document.querySelector(".dz-default.dz-message").style.display = 'block';
										$('.dz-default.dz-message').html(upload.dictDefaultMessage);
									}

									if (myDropzone.files.length <= 3 && myDropzone.files.length > 0) {
										document.querySelector(".dz-default.dz-message").style.display = 'none'
										$('.dz-default.dz-message').html(upload.dictDefaultMessage);
										myDropzone.files.forEach((i) => {
											if (i.size > 15000000) {
												bigFile += 1
											}
										})
										// check if in files there are file have more than 8MB after remove
										if (bigFile > 0) {
											// upload_doc and delete_doc is ID for button upload and cancel
											$("#upload_doc").attr("disabled", true);
											$("#delete_doc").attr("disabled", true);
											document.querySelector(".dz-default.dz-message").style.display = 'block'
											$('.dz-default.dz-message').html(upload.tooLargeFilesSize);
										} else {
											document.getElementById("upload_doc").style.pointerEvents = 'auto';
											document.getElementById("delete_doc").style.pointerEvents = 'auto';
											$("#upload_doc").attr("disabled", false);
											$("#delete_doc").attr("disabled", false);
										}

									}
								});

								// when max file exceed
								myDropzone.on("maxfilesexceeded", function (file) {
									document.querySelector(".dz-default.dz-message").style.display = 'none';
									$('.dz-default.dz-message').html(upload.dictMaxFilesExceeded);
									document.querySelector(".dz-default.dz-message").style.display = 'block'
									// Materialize.toast("Too many file to upload", 6000, "error")
									M.toast({ html: "Too many file to upload", displayLength: 6000, classes: 'error'});
									$("#upload_doc").attr("disabled", true);
									document.getElementById("upload_doc").style.pointerEvents = "none";
									$("#delete_doc").attr("disabled", true);
									document.getElementById("delete_doc").style.pointerEvents = "none";
								});

								// when uploading
								myDropzone.on("uploadprogress", function (file, progress, bytesSent) {
									// hide preview file upload
									var previews = document.querySelectorAll(".dz-preview");
									previews.forEach(function (preview) {
										preview.style.display = 'none';
									})

									document.querySelector(".dz-default.dz-message").style.display = 'none';
									document.querySelector(".percent-upload").style.display = 'block';
									$(".percentage").html('<div style="font-size:32px;">' + $filter('translate')('uploading') + '</div>');
								});

								// when sending file
								myDropzone.on('sending', function (file) {
									if (this.getUploadingFiles().length == 1) {

										// Materialize.toast($filter('translate')('uploading'), 6000, 'note');
										M.toast({ html: $filter('translate')('uploading'), displayLength: 6000, classes: 'note' });
									}
									$("#upload_doc").attr("disabled", true);
								});

								// when complete
								myDropzone.on("complete", function (file) {
									if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
										myDropzone.removeAllFiles(true);
									}
								});

								// reset
								this.on("reset", function () {
									// upload_doc and delete_doc is ID for button upload and cancel
									document.getElementById("upload_doc").style.pointerEvents = 'auto';
									document.getElementById("delete_doc").style.pointerEvents = 'auto';
								});
							},
							success: function () {
								if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
									msg = $filter('translate')('file_uploaded');
									typ = 'success';
									// Materialize.toast(msg, 6000, typ);
									M.toast({ html: msg, displayLength: 6000, classes: typ });
									// percent-upload is a class use to show progress bar when upload file
									document.querySelector(".percent-upload").style.display = 'none';
									document.querySelector(".dz-default.dz-message").style.display = 'block';
									// $('#upload-file').closeModal({ dismissible: true });
									$('#upload-file').modal({ dismissible: true });
									$('#upload-file').modal('close');
									$rootScope.$broadcast('refresh:listUpload');
								}
							},
							error: function (file, response) {
								// percent-upload is a class use to show progress bar when upload file
								document.querySelector(".percent-upload").style.display = 'none';
								if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 && !response.err) {
									typ = 'error';
									// Materialize.toast(response, 6000, typ);
									M.toast({ html: response, displayLength: 6000, classes: typ });
								}
								if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 && response.err) {
									myDropzone.removeAllFiles(true);
									$timeout(function () {
										typ = 'error';
										// Materialize.toast(response.err, 6000, typ);
										M.toast({ html: response.err, displayLength: 6000, classes: typ });
										if (response.err.indexOf('canceled') < 0) {

											// Materialize.toast($filter('translate')('upload_canceled'), 6000, typ);
											M.toast({ html: $filter('translate')('upload_canceled'), displayLength: 6000, classes: typ });
										}
									}, 500);
								}
							}
						};
						return upload;
					}
				}

				return ngmClusterDocument;

			}]);
