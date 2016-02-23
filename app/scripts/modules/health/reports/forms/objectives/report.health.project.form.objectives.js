/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.objectives', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.objectives', {
        title: 'Health Project Objectives Form',
        description: 'Display Health Project Objectives Form',
        controller: 'ProjectObjectivesCtrl',
        templateUrl: '/scripts/modules/health/reports/forms/objectives/partials/form.html'
      });
  })
  .controller('ProjectObjectivesCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, config){

      // if empty
      if(!config.project.objectives){
        // add project details
        config.project.objectives = {
          username: ngmUser.get().username,
          organization_id: config.project.details.organization_id,
          project_id: config.project.details.id
        }
      }

      // project
      $scope.project = {

        // app style
        style: config.style,

        // project
        definition: config.project,

        // details template
        objectiveOneUrl: '/scripts/modules/health/reports/forms/objectives/partials/objectiveOne.html',

        // details template
        objectiveTwoUrl: '/scripts/modules/health/reports/forms/objectives/partials/objectiveTwo.html',

        // details template
        objectiveThreeUrl: '/scripts/modules/health/reports/forms/objectives/partials/objectiveThree.html',                

        // holder for UI options
        options: {
          list: {},
          select: {},
          selection: {}
        },        

        // add location
        addLocation: function(){

          // push location to objectiveOneLocations
          $scope.project.definition.objectiveLocations.push({
            username: ngmUser.get().username,
            organization_id: config.project.details.organization_id,
            project_id: config.project.details.id,
            prov_code: $scope.project.options.selection.province.prov_code,
            prov_name: $scope.project.options.selection.province.prov_name,
            dist_code: $scope.project.options.selection.district.dist_code,
            dist_name: $scope.project.options.selection.district.dist_name,
            lng: $scope.project.options.selection.district.lng,
            lat: $scope.project.options.selection.district.lat
          });

          // refresh dropdown options
          $scope.project.resetLocationSelect(true, true);

        },

        // remove location from location list
        removeLocation: function($index) {
          // remove location at i
          $scope.project.definition.objectiveLocations.splice($index, 1);
          // refresh dropdown options
          $scope.project.resetLocationSelect(true, true);

        },

        // apply location dropdowns
        locationSelect: function(id, select) {
              
          // disabled
          disabled = !$scope.project.options.selection.province;
          // filter districts
          $scope.project.options.select.districts = $filter('filter')($scope.project.options.list.districts, { prov_code: $scope.project.options.selection.province.prov_code }, true);
          // disable/enable
          $(id).prop('disabled', disabled);

          // update dropdown
          $timeout(function(){
            $(id).material_select('update');
          }, 200);

        },           

        // refresh dropdown options
        resetLocationSelect: function(province, district){

          // reset province
          if(province){
            // reset select option
            $scope.project.options.select.provinces = $scope.project.options.list.provinces;
            // refresh dropdown
            $('#ngm-project-province').prop('selectedIndex',0);
            $('#ngm-project-province').material_select('update');
          }

          // reset district
          if(district){
            // reset select option
            $scope.project.options.select.districts = $scope.project.options.list.districts;
            // refresh dropdown
            $('#ngm-project-district').prop('selectedIndex',0);
            $('#ngm-project-district').material_select('update');
          }

        },

        // cofirm exit if changes
        modalConfirm: function(modal){

          // if dirty, warn on exit
          if($scope.healthProjectObjectivesForm.$dirty){
            $('#' + modal).openModal({dismissible: false});
          } else{
            $scope.project.cancel();
          }

        },

        // update project/financials
        save: function(){

          // open success modal if valid form
          if($scope.healthProjectObjectivesForm.$valid){

           // details update
            var details = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectDetails',
              data: {
                project: $scope.project.definition
              }
            });

            // objectiveOne update
            var objectives = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectObjectives',
              data: {
                project: $scope.project.definition
              }
            });

            // request all 
            $q.all([details, objectives]).then(function(results) {
              // notification modal
              $('#save-modal').openModal({dismissible: false});
            });

          } else {
            // form validation takes over
            $scope.healthProjectObjectivesForm.$setSubmitted();
            // inform
            Materialize.toast('Please review the form for errors and try again!', 3000);
          }

        },

        // re-direct on save
        redirect: function(){

          // redirect on success
          $timeout(function(){
            $location.path( '/health/projects/summary/' + $scope.project.definition.details.id );
            Materialize.toast( $scope.project.definition.details.project_name + ' Financials updated!', 3000, 'success');
          }, 200)

        },

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {
            $location.path( '/health/projects/summary/' + $scope.project.definition.details.id );
            if( $scope.project.definition.details.project_status !== 'complete' ) {
              Materialize.toast( 'Project update cancelled!', 3000, 'note' );
            }
          }, 100);

        }

      }

      // get provinces
      if(!$scope.project.options.list.provinces) {
        ngmData.get({
          method: 'POST',
          url: 'http://' + $location.host() + '/api/health/getProvincesList'
        }).then(function(data){
          // this will not be filtered
          $scope.project.options.list.provinces = data;
          $scope.project.options.select.provinces = $scope.project.options.list.provinces;
          $('#ngm-project-province').material_select('update');
        });
      }  

      // get provinces
      if(!$scope.project.options.list.districts) {
        ngmData.get({
          method: 'POST',
          url: 'http://' + $location.host() + '/api/health/getDistrictsList'
        }).then(function(data){
          // this is full list that will be filtered
          $scope.project.options.list.districts = data;
        });
      }

      // initalize 
      $timeout(function() {

        // menu return to list
        $('#go-to-project-list').click(function(){
          $scope.project.cancel();
        });

        // selects
        $('select').material_select();        

      }, 400);
  
  }

]);
