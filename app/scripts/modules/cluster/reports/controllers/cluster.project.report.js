/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectReportCtrl
 * @description
 * # ClusterProjectReportCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectReportCtrl', [
			'$scope',
			'$route',
			'$q',
			'$http',
			'$location',
			'$anchorScroll',
			'$timeout',
			'ngmAuth',
			'ngmData',
			'ngmUser','$translate','$filter', 'ngmClusterLists',
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser,$translate,$filter, ngmClusterLists ) {
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

			// placeholder
			project: {},

			// placeholder
			definition: {},

			// location_group
			location_group: $route.current.params.location_group,

			// current user
			user: ngmUser.get(),

			// report name placeholder (is updated below)
			report: 'monthly_report',

			// get project
			getProject: $http({
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}),

			// get report
			getReport: $http({
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/report/getReport',
				data: {
					report_id: $route.current.params.report,
					location_group_id: $route.current.params.location_group
				}
			}),

			// set project details
			setProjectDetails: function( data ){

				// project
				$scope.report.project = data[0].data;

				// report
				$scope.report.definition = data[1].data;

				// set report for downloads
				$scope.report.report = $scope.report.project.organization + '_' + $scope.report.project.cluster + '_' + $scope.report.project.project_title.replace(/\ /g, '_') + '_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );


				// project title
				if ( $scope.report.project.admin0name ) {
					$scope.report.title = $scope.report.project.organization + ' | ' + $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ';
				}
				// cluster
				if( $scope.report.project.cluster.length < 31 ){
					$scope.report.title += $scope.report.project.cluster.toUpperCase() + ' | ';
				} else {
					$scope.report.title += $scope.report.project.cluster_id.toUpperCase() + ' | ';
				}
				// title
				$scope.report.title += $scope.report.project.project_title;


				// add project code to subtitle?
				var text = $filter('translate')('actual_monthly_progress_for') + ' ' + moment.utc( $scope.report.definition.reporting_period ).format('MMMM, YYYY');

				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + text : text;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_report',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate',
							'title': subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: $filter('translate')('download_monthly_activity_report_as_csv'),
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/report/getReportCsv',
									data: {
										report: $scope.report.report,
										report_type: 'activity',
										report_id: $scope.report.definition.id
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
										theme: 'cluster_project_report_' + $scope.report.user.cluster_id,
										format: 'csv',
										url: $location.$$path
									}
								}
							},{
								type: 'zip',
								color: 'blue lighten-2',
								icon: 'folder',
								hover: $filter('translate')('download_all_report_documents'),
								request: {
									method: 'GET',
									url: ngmAuth.LOCATION + '/api/getReportDocuments/' + $scope.report.definition.id,
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'cluster_report_documents',
										format: 'zip',
										url: $location.$$path
									}
								}
							},{
								type: 'xlsx',
								color: 'blue lighten-2',
								icon: 'description',
								hover: $filter('translate')('download_project_lists'),
								request: {
									method: 'GET',
									url: ngmAuth.LOCATION + '/api/cluster/report/getProjectLists',
									params: {
										report_id: $scope.report.definition.id,
										project_id: $scope.report.project.id
									},
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: $scope.report.project.project_title,
										theme: 'cluster_report_lists_' + $scope.report.user.cluster_id,
										format: 'xlsx',
										url: $location.$$path
									}
								}
							},{
								type: 'client',
								color: 'blue lighten-2',
								icon: 'description',
								hover: $filter('translate')('download_populations_lists'),
								request: {
									filename: 'population_groups_lists' + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) + '.xlsx',
									mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
									function: function () {
										let lists = ngmClusterLists.setLists( $scope.report.project, 10 );

										// XLSX processing
										const workbook = new ExcelJS.Workbook();

										let worksheetPopulationGroups = workbook.addWorksheet('Beneficiary Types');
										let worksheetHrpPopulationGroups = workbook.addWorksheet('HRP Beneficiary Types');
										let worksheetCategories = workbook.addWorksheet('Beneficiary Categories');
										let worksheetPopulation = workbook.addWorksheet('Population');

										// xlsx headers
										const boldHeader = sheet => sheet.getRow(1).font = { bold: true };

										worksheetPopulationGroups.columns = [
											{ header: 'Year', key: 'year', width: 10 },
											{ header: 'Cluster', key: 'cluster', width: 20 },
											{ header: 'Beneficiary Type', key: 'beneficiary_type_name', width: 60 }
										];
										boldHeader(worksheetPopulationGroups);

										worksheetHrpPopulationGroups.columns = [
											{ header: 'Year', key: 'year', width: 10 },
											{ header: 'Cluster', key: 'cluster', width: 20 },
											{ header: 'Beneficiary Type', key: 'hrp_beneficiary_type_name', width: 60 }
										];
										boldHeader(worksheetHrpPopulationGroups);

										worksheetCategories.columns = [
											{ header: 'Beneficiary Category', key: 'beneficiary_category_name', width: 20 }
										];
										boldHeader(worksheetCategories);

										worksheetPopulation.columns = [
											{ header: 'Population', key: 'delivery_type_name', width: 20 }
										];
										boldHeader(worksheetPopulation);

										// add rows

										// transform array of cluster_ids to comma separated clusters
										let beneficiary_types = lists.beneficiary_types.map(function (b) {
											cluster = b.cluster_id.map(function (cid) {
												cluster = lists.clusters.filter(c => c.cluster_id === cid)[0];
												if (cluster) return cluster.cluster;
												return false;
											}).filter(c => c).sort().join(', ');
											beneficiary_type_name = b.beneficiary_type_name;
											year = b.year ? b.year : "";
											return {
												year,
												cluster,
												beneficiary_type_name
											};
										});

										// transform array of cluster_ids to comma separated clusters
										let hrp_beneficiary_types = lists.hrp_beneficiary_types.map(function (b) {
											cluster = b.cluster_id.map(function (cid) {
												cluster = lists.clusters.filter(c => c.cluster_id === cid)[0];
												if (cluster) return cluster.cluster;
												return false;
											}).filter(c => c).sort().join(', ');
											hrp_beneficiary_type_name = b.hrp_beneficiary_type_name;
											year = b.year ? b.year : "";
											return {
												year,
												cluster,
												hrp_beneficiary_type_name,
											};
										});

										worksheetPopulationGroups.addRows(beneficiary_types);
										worksheetHrpPopulationGroups.addRows(hrp_beneficiary_types);
										worksheetCategories.addRows(lists.beneficiary_categories);
										worksheetPopulation.addRows(lists.delivery_types);

										// return buffer
										return workbook.xlsx.writeBuffer();

									},
									metrics: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/metrics/set',
										data: {
											organization: $scope.report.user.organization,
											username: $scope.report.user.username,
											email: $scope.report.user.email,
											dashboard: $scope.report.project.project_title,
											theme: 'population_groups_lists_' + $scope.report.user.cluster_id,
											format: 'xlsx',
											url: $location.$$path
										}
									}
								}
							}]
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'project.report',
								config: {
									style: $scope.report.ngm.style,
									project: $scope.report.project,
									report: $scope.report.definition,
									location_group: $scope.report.location_group
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel',
								style: 'padding:0px; height: 90px; padding-top:10px;',
								config: {
									// html: $scope.report.ngm.footer
									templateUrl: '/scripts/widgets/ngm-html/template/footer.html',
									lightPrimaryColor: $scope.ngm.style.lightPrimaryColor,
									defaultPrimaryColor: $scope.ngm.style.defaultPrimaryColor,
								}
							}]
						}]
					}]
				}

				// hide download
				const canDownload = ngmAuth.canDo('DASHBOARD_DOWNLOAD',{
					adminRpcode: $scope.report.project.adminRpcode,
					admin0pcode: $scope.report.project.admin0pcode,
					cluster_id: $scope.report.project.cluster_id,
					organization_tag: $scope.report.project.organization_tag });
				// remove download button
				if (!canDownload) {
					$scope.model.header.download.class += ' hide';
				}
				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}

		}

		// assign to ngm app scope
		$scope.report.ngm.dashboard.model = $scope.model;

		// taost for user
		$timeout( function() {
			// Materialize.toast( $filter('translate')('loading_monhtly_progress_report'), 4000, 'success' );
			M.toast({ html: $filter('translate')('loading_monhtly_progress_report'), displayLength: 4000, classes: 'success' });
		}, 400 );

		// send request
		$q.all([ $scope.report.getProject, $scope.report.getReport ]).then( function( results ){

			// assign
			$scope.report.setProjectDetails( results );

			setTimeout(() => {
				$('.fixed-action-btn').floatingActionButton({ direction: 'left' });
			}, 0);
		});

	}]);
