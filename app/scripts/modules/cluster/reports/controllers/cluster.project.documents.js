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
					$scope.model.header.download.downloads[0].request.data.report = organization.organization_tag  +'_projects-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );
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
