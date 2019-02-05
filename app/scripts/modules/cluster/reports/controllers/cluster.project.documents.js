/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectDocumentCtrl
 * @description
 * # ClusterProjectDetailsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectDocumentCtrl', ['$scope', '$route', '$location', '$anchorScroll', '$timeout', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', function ($scope, $route, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser, ngmClusterHelper) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = {
			rows: [{}]
		}

		// empty Project
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// current report
			// report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-' + moment().format('YYYY-MM-DDTHHmm'),

			// set project details
			setUpload: function (data) {

				// assign data
				$scope.report.project = data;

				// var title = $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ';
				var title = 'Project Documents'

				// set model to null
				// if ($route.current.params.project === 'new') {
				// 	title += 'New Project';
				// } else {
				// 	title += $scope.report.project.project_title;
				// }

				// add project code to subtitle?
				// var text = 'Documents Project for ' + $scope.report.project.project_title;
				var subtitle = $scope.report.project.project_title + '- Document' ;//$scope.report.project.project_code ? $scope.report.project.project_code + ' - ' + $scope.report.project.project_description : $scope.report.project.project_description;

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
							title: title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'all',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download all document project ' + $scope.report.project.project_title,
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/project/getProjects',
									data: {
										report: $scope.report.report,
										details: 'projects',
										query: { project_id: $scope.report.project.id },
										csv: true
									}
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'cluster_project_details',
										format: 'csv',
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
								type: 'dropzone',
								config:{
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
																			<div class="dz-progress">
																				<span class="dz-upload" data-dz-uploadprogress="" style="width: 100%;"></span>
																			</div>
																			<div class="dz-error-message">
																				<span data-dz-errormessage></span>
																			</div>
																			<div class="dz-success-mark">
																			<i class="material-icons">check_circle_outline</i>
																				
																			</div>
																			<div class="dz-error-mark">
																				<i class="material-icons">clear</i>
																			</div>
																		</div>`,
									url: ngmAuth.LOCATION + '/api/upload-file',
									acceptedFiles: 'image/*,application/pdf',
									accept:function(file,done){
										done(); 
									},
									headers: { 'Authorization': 'Bearer ' + ngmUser.get().token },
									successMessage: false,
									dictDefaultMessage: 
										`<i class="medium material-icons" style="color:#009688;">cloud_upload</i> <br/>Drag files here or click button to upload `,
									process: {
									},
									setRedirect:function () {
										console.log("redirect")
									}
								}
							}]
						}]
					}, {
						columns: [{
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

		// if 'new' create empty project
		if ($route.current.params.project === 'new') {

			// get new project
			var project = ngmClusterHelper.getNewProject(ngmUser.get());

			// set summary
			$scope.report.setUpload(project);

		} else {

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

		}

	}]);
