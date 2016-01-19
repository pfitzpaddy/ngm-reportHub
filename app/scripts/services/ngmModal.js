'use strict';

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
	.factory('ngmModal', ['$document', '$templateRequest', '$compile',
		function($document, $templateRequest, $compile) {

		// ngmModal
		var ngmModal = {

			// create modal div and inject
			open: function(modal){

				// modal element to be added
				var $div = $('<div id="ngm-modal-container" ng-controller="ngmModalCtrl" ng-include src="' + modal.template + '"></div>');

				// target is body
				var $target = angular.element(document.body);

				// inject element and compile
				angular.element($target).injector().invoke(function($compile) {
					var $scope = angular.element($target).scope();
					$scope.config = modal;
					$target.append($compile($div)($scope));
					// refresh the watch expressions in the new element
					$scope.$apply();
				});

			}

		};

		// return
		return ngmModal;

	}])
	// will load $http requests
	.controller('ngmModalCtrl', [
    	'$scope',
    	'$timeout',
    	'ngmData',
    	'NgTableParams',
    	function($scope, $timeout, ngmData, NgTableParams){

    		//
    		$scope.modal = {
    			// modal id
    			id: 'ngm-dews-modal-' + Math.floor((Math.random()*1000000)),
    			
    			// open modal
    			open: function(){
    				$('#' + $scope.modal.id).openModal($scope.modal.materialize);
    			},

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
						}, 400);
					}

    		}

      	// Merge defaults with config
      	$scope.modal = angular.merge({}, $scope.modal, $scope.config);

    		// open modal after render
    		$timeout(function(){
    			$scope.modal.open();
    		}, 200);

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


