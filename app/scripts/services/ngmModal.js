/**
 * @name ngmReportHubApp.factory:ngmUser
 * @description
 * # ngmAccess
 * Manages browser local storage
 *
 * @name ngmReportHubApp.factory:ngmUser
 * @description
 * # ngmAccess
 * Manages browser local storage
 *
 */
angular.module('ngmReportHub')
	.factory('ngmModal', ['$document', '$templateRequest', '$compile', '$timeout',
		function($document, $templateRequest, $compile, $timeout) {

		// ngmModal
		var ngmModal = {

			// create modal div and inject with $compile
			open: function(modal){

				// set modal id
				modal.id = 'ngm-dews-modal-' + Math.floor((Math.random()*1000000));     

				// modal element to be added
				var $div = $('<div id="ngm-modal-container" ng-controller="ngmModalCtrl" ng-include src="' + modal.template + '"></div>');

				// target is body
				var $target = angular.element(document.body);

				// inject element and compile
				angular.element($target).injector().invoke(function($compile) {
					var $scope = angular.element($target).scope();
					// set scope config
					$scope.config = modal;
					// append div and compile
					$target.append($compile($div)($scope));
					// refresh the watch expressions in the new element
					$scope.$apply();
					// open modal
					$timeout(function(){
						$('#' + $scope.config.id).openModal($scope.config.materialize);
					}, 400);
				});

			}

		};

		// return
		return ngmModal;

	}])
	// modal controller
	.controller('ngmModalCtrl', [
			'$scope',
			'$timeout',
			'$location',
			'ngmData',
			'NgTableParams',
			function($scope, $timeout, $location, ngmData, NgTableParams){

				// modal
				$scope.modal = {
					
					// filename
					filename: 'daily-summary-' + $scope.config.date.replace(' ', '_').replace(', ', '_') + '-for-' + $location.$$path.replace(/\//g, '_').slice(1, -22) + '-extracted-' + moment().format() + '.csv',

					// set ng-table params
					table: function(data){
						// modal data
						$scope.modal.data = data;
						// set $scope
						$scope.modal.tableParams = new NgTableParams({
								page: 1,
								count: 10,
							}, { 
								total: data.length, 
								counts: [], 
								data: data 
						});
					},

					// close modal
					close: function(){
						// materialize
						$('#' + $scope.modal.id).closeModal();
						// remove element
						$timeout(function(){
							$('#ngm-modal-container').remove();
						}, 1200);
					}

				}

				// Merge defaults with config
				$scope.modal = angular.merge({}, $scope.modal, $scope.config);

				// send request to fetch data
				if($scope.modal.request){
					ngmData.get($scope.modal.request).then(function(response) {
						 
						// turn off loading
						$scope.modal.loading = false;

						// switch the type
						switch($scope.modal.type){
							case 'table':
								$scope.modal.table(response.data);
								break;
							default: 
								$scope.modal.table(response.data);
						}

					}, function(){
						// error
						$scope.modal.error = true;
					});
				}	

			}
		]);


