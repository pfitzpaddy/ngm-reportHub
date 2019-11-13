/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportiFrameCtrl
 * @description
 * # ReportiFrameCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('UpdateDewsCtrl', ['$scope', '$location', 'ngmAuth', 'ngmUser', function ($scope, $location, ngmAuth, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// report object
		$scope.upload = {

			// parent
			ngm: $scope.$parent.ngm

		}

		// panel height = window height - header - padding
		$scope.upload.ngm.style.height = $scope.upload.ngm.height - 160 - 10;

		// report dashboard model
		$scope.model = {
			name: 'upload_dews',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.upload.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: 'WHO | DEWS | UPLOAD',
					style: 'color: ' + $scope.upload.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'Update the DEWS outbreak dashboard by uploading the latest extract',
				}
			},
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'dropzone',
						style: 'height: 296px;',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							url: ngmAuth.LOCATION + '/api/upload-file',
							acceptedFiles: '.xlsx',
							headers: { 'Authorization': 'Bearer ' + ngmUser.get().token },
							successMessage: false,
							process: {
								requests: [{
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/process',
									data: {
										type: 'xlsx',
										schema: 'dews',
										table: 'moph_afg_dews_outbreaks_import',
										importScript: 'dewsxlsx2pgsql.py',
										processScript: 'moph_afg_dews_outbreaks_upload.sh'
									}
								}]
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
							html: $scope.upload.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.upload.ngm.dashboard.model = $scope.model;
		
	}]);