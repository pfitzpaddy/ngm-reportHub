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
			'ngmUser',
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser ) {
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

			// placeholder
			project: {},

			// placeholder
			definition: {},

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
					id: $route.current.params.report
				}
			}),

			// add beneficiary, spin off of addBeneficiary fnc
			addDefaultBeneficiaries: function (report, project) {

				// cleaned project beneficiaries
				var target_beneficiaries_array = [];

				angular.forEach(project.target_beneficiaries, function (p, i) {

					// null fields
					var sadd = {
						units: 0,
						cash_amount: 0,
						households: 0,
						sessions: 0,
						families: 0,
						boys: 0,
						girls: 0,
						men: 0,
						women: 0,
						elderly_men: 0,
						elderly_women: 0
					};

					// for merge, if missing fields
					var inserted = {
						cluster_id: null,
						cluster: null,
						category_type_id: null,
						category_type_name: null,
						beneficiary_type_id: null,
						beneficiary_type_name: null,
						activity_type_id: null,
						activity_type_name: null,
						activity_description_id: null,
						activity_description_name: null,
						delivery_type_id: null,
						delivery_type_name: null,
						transfer_type_id: 0,
						transfer_type_value: 0
					};

					// cleaned non value beneficiary object
					var inserted_target_benf = {
						cluster_id: p.cluster_id,
						cluster: p.cluster,
						category_type_id: p.category_type_id,
						category_type_name: p.category_type_name,
						beneficiary_type_id: p.beneficiary_type_id,
						beneficiary_type_name: p.beneficiary_type_name,
						activity_type_id: p.activity_type_id,
						activity_type_name: p.activity_type_name,
						activity_description_id: p.activity_description_id,
						activity_description_name: p.activity_description_name,
						delivery_type_id: p.delivery_type_id,
						delivery_type_name: p.delivery_type_name,
						transfer_type_id: 0,
						transfer_type_value: 0,
						default_beneficiary: true,
					};

					if (p.mpc_delivery_type_id&&p.mpc_delivery_type_name){
						var add_mpc = {
							mpc_delivery_type_id: p.mpc_delivery_type_id,
							mpc_delivery_type_name: p.mpc_delivery_type_id
						}
						angular.merge(inserted_target_benf, add_mpc);
					}

					// construct cleaned beneficiary
					angular.merge(inserted, inserted_target_benf, sadd);

					target_beneficiaries_array.push(inserted);
				})
				// for each location
				angular.forEach(report.locations, function (l, i) {
					// if no beneficiaries, add default target beneficiaries
					if (!l.beneficiaries.length) {
						var target_beneficiaries_array_copy = angular.copy(target_beneficiaries_array);
						angular.forEach(target_beneficiaries_array_copy, function (b, i) {
							l.beneficiaries.push(b)
						})
						// check if in report there are beneficiaries, absent but in project defaults
						// case when user adds in project def, to show in the same month
						// no functnlty to not show if user deletes in the same month
						// maybe better to delete it on backend
						// could be excessive and bug prone
					}
					// else {
					// 	// for report location
					// 	var report_cleaned_beneficiaries_array = [];
					// 	// comparation lines
					// 	angular.forEach(l.beneficiaries, function (b, i) {

					// 		var existing_target_benf = {
					// 			cluster_id: b.cluster_id,
					// 			cluster: b.cluster,
					// 			category_type_id: b.category_type_id,
					// 			category_type_name: b.category_type_name,
					// 			beneficiary_type_id: b.beneficiary_type_id,
					// 			beneficiary_type_name: b.beneficiary_type_name,
					// 			activity_type_id: b.activity_type_id,
					// 			activity_type_name: b.activity_type_name,
					// 			activity_description_id: b.activity_description_id,
					// 			activity_description_name: b.activity_description_name,
					// 			delivery_type_id: b.delivery_type_id,
					// 			delivery_type_name: b.delivery_type_name,
					// 		};

					// 		if (b.mpc_delivery_type_id&&b.mpc_delivery_type_name){
					// 			var add_mpc = {
					// 				mpc_delivery_type_id: b.mpc_delivery_type_id,
					// 				mpc_delivery_type_name: b.mpc_delivery_type_id
					// 			}
					// 			angular.merge(existing_target_benf, add_mpc);
					// 		};

					// 		report_cleaned_beneficiaries_array.push(existing_target_benf);
					// 	})

					// 	// check each project target beneficiary with reports
					// 	angular.forEach(project.target_beneficiaries, function (p, i) {
					// 		var target_benf = {
					// 			cluster_id: p.cluster_id,
					// 			cluster: p.cluster,
					// 			category_type_id: p.category_type_id,
					// 			category_type_name: p.category_type_name,
					// 			beneficiary_type_id: p.beneficiary_type_id,
					// 			beneficiary_type_name: p.beneficiary_type_name,
					// 			activity_type_id: p.activity_type_id,
					// 			activity_type_name: p.activity_type_name,
					// 			activity_description_id: p.activity_description_id,
					// 			activity_description_name: p.activity_description_name,
					// 			delivery_type_id: p.delivery_type_id,
					// 			delivery_type_name: p.delivery_type_name,
					// 		};

					// 		if (p.mpc_delivery_type_id&&p.mpc_delivery_type_name){
					// 			var add_mpc = {
					// 				mpc_delivery_type_id: p.mpc_delivery_type_id,
					// 				mpc_delivery_type_name: p.mpc_delivery_type_id
					// 			}
					// 			angular.merge(target_benf, add_mpc);
					// 		};

					// 		var sadd = {
					// 			units: 0,
					// 			cash_amount: 0,
					// 			households: 0,
					// 			sessions: 0,
					// 			families: 0,
					// 			boys: 0,
					// 			girls: 0,
					// 			men: 0,
					// 			women: 0,
					// 			elderly_men: 0,
					// 			elderly_women: 0
					// 		};

					// 		var addon = {
					// 			transfer_type_id: 0,
					// 			transfer_type_value: 0,
					// 			default_beneficiary: true,
					// 		};

					// 		var eq = 0;
					// 		var flag = true;

					// 		// find if target beneficiary does not exists in report location
					// 		angular.forEach(report_cleaned_beneficiaries_array, function (rb, i) {
					// 			if (flag && angular.equals(target_benf, rb))
					// 			{eq += 1;
					// 				flag = false;}
					// 		})

					// 		if (!eq) {
					// 			var target_benf_copy = angular.copy(target_benf);
					// 			angular.merge(target_benf_copy, sadd, addon);
					// 			l.beneficiaries.push(target_benf_copy);

					// 		}

					// 	})
					// }
				})
			},



			// set project details
			setProjectDetails: function( data ){

				// project
				$scope.report.project = data[0].data;

				// report
				$scope.report.definition = data[1].data;

				$scope.report.addDefaultBeneficiaries($scope.report.definition, $scope.report.project);
				// set report for downloads
				$scope.report.report = $scope.report.project.organization + '_' + $scope.report.project.cluster + '_' + $scope.report.project.project_title.replace(/\ /g, '_') + '_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );

				// add project code to subtitle?
				var text = 'Actual Monthly Beneficiaries Report for ' + moment( $scope.report.definition.reporting_period ).format('MMMM, YYYY');
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
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: 'Download Monthly Acvitiy Report as CSV',
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
									report: $scope.report.definition
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

		// send request
		$q.all([ $scope.report.getProject, $scope.report.getReport ]).then( function( results ){

			// assign
			$scope.report.setProjectDetails( results );

		});

	}]);
