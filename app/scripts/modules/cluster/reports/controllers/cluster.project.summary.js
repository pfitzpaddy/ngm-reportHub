/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectSummaryCtrl
 * @description
 * # ClusterProjectSummaryCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectSummaryCtrl', ['$scope', '$route', '$location', 'ngmData', 'ngmUser', function ($scope, $route, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// return project
		ngmData.get({
			method: 'POST',
			url: 'http://' + $location.host() + '/api/cluster/project/getProject',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectSummary( data );
		});

		// init empty model
		$scope.model = {
			rows: [{}]
		};

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// set summary
			setProjectSummary: function(data){

				// set project
				$scope.report.project = data;
				
				// report dashboard model
				$scope.model = {
					name: 'cluster_project_summary',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: ngmUser.get().admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': $scope.report.project.project_description
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {
									html: '<a class="waves-effect waves-light btn left" href="#/cluster/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a><span class="right" style="padding-top:8px;">Last Updated: ' + moment( $scope.report.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) + '</span>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									project: $scope.report.project,
									user: $scope.report.user,
									report_date: moment().subtract( 1, 'M').endOf( 'M' ).format('YYYY-MM-DD'),
									templateUrl: '/scripts/modules/cluster/views/cluster.project.summary.html',									
									// forms:[{
									// 	icon: 'edit',
									// 	location: 'details',
									// 	title: 'Project Details',
									// 	subtitle: 'Project Details, Location and Beneficiaries',
									// 	description: 'Define the project details, locations and beneficiaries for '
									// },{
									// 	icon: 'attach_money',
									// 	location: 'financials',
									// 	title: 'Project Financial Items',
									// 	subtitle: 'Project Financial Line Items',
									// 	description: 'Track the project spending against financial line items for '
									// }],
					        // run submit

					        // mark project active
					        markActive: function( project ){

					          // mark project active
					          project.project_status = 'active';       

					          // Submit project for save
					          ngmData.get({
					            method: 'POST',
					            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
					            data: {
					              project: project
					            }
					          }).then(function(data){
					            // redirect on success
					            $location.path( '/cluster/projects' );
					            Materialize.toast( 'Project moved to Active!', 3000, 'success');
					          });

					        },

					        // mark poject complete
					        markComplete: function( project ){

					          // mark project complete
					          project.project_status = 'complete';       

					          // Submit project for save
					          ngmData.get({
					            method: 'POST',
					            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
					            data: {
					              project: project
					            }
					          }).then(function(data){
					            // redirect on success
					            $location.path( '/cluster/projects' );
					            Materialize.toast( 'Project marked as Complete, Congratulations!', 3000, 'success');
					          });

					        }					        
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
				};

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}

		}
		
	}]);