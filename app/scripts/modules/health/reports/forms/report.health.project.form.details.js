/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectFormDetailsCtrl
 * @description
 * # ReportHealthProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.details', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.details', {
        title: 'Health Project Details Form',
        description: 'Display Health Project Details Form',
        controller: 'ProjectDetailsCtrl',
        templateUrl: '/views/modules/health/forms/details/form.html'
      });
  })
  .controller('ProjectDetailsCtrl', [
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

      // project
      $scope.project = {

        // app style
        style: config.style,

        // project
        definition: config.project,

        // holder for UI options
        options: {
          list: {
            beneficiaries: [{
              beneficiary_name: 'Conflict Displaced',
              beneficiary_category: 'conflict_displaced'
            },{
              beneficiary_name: 'Health Affected by Conflict',
              beneficiary_category: 'health_affected_conflict'
            },{
              beneficiary_name: 'Refugees & Returnees',
              beneficiary_category: 'refugees_returnees'
            },{
              beneficiary_name: 'Natural Disaster Affected',
              beneficiary_category: 'natural_disaster_affected'
            },{
              beneficiary_name: 'Public Health at Risk',
              beneficiary_category: 'public_health'
            }]
          },
          filter: {},
          selection: {}
        },

        // details template
        detailsUrl: '/views/modules/health/forms/details/details.html',

        // details template
        locationsUrl: '/views/modules/health/forms/details/locations.html',

        // details template
        beneficiariesUrl: '/views/modules/health/forms/details/beneficiaries.html',

        // apply location dropdowns
        locationSelect: function(id, select) {

          var disabled;

          switch(select) {
            case 'district':
              
              // disabled
              disabled = !$scope.project.options.selection.province;

              // filter districts
              $scope.project.options.filter.districts = $filter('filter')($scope.project.options.list.districts, { prov_code: $scope.project.options.selection.province.prov_code }, true);

              break;

            case 'hf_type':
              
              // disabled
              disabled = !$scope.project.options.selection.district;

              // alert user if conflict district selected
              if($scope.project.options.selection.district.conflict){
                Materialize.toast('Alert! ' + $scope.project.options.selection.district.dist_name + ' is listed as a conflict district', 3000);
              }

              // reset dropdowns
              $scope.project.resetLocationSelect(false, false, true, false);
              
              // assign select options
              $scope.project.options.filter.hf_type = $scope.project.options.list.hf_type;

              break;

            case 'hf_name':
              
              // disabled
              disabled = !$scope.project.options.selection.hf_type;
              // filter
              var provFilter = $filter('filter')($scope.project.options.list.hf_name, { prov_code: $scope.project.options.selection.province.prov_code }, true);
              var distFilter = $filter('filter')(provFilter, { dist_code: $scope.project.options.selection.district.dist_code }, true);
              var typeFilter = $filter('filter')(distFilter, { fac_type: $scope.project.options.selection.hf_type.fac_type }, true);

              // if option
              if(typeFilter.length>0){

                // filter
                $scope.project.options.filter.hf_name = typeFilter;

              } else {

                // add 'Other' and exit
                $scope.project.options.selection.hf_name ={
                  fac_id: 111112,
                  fac_type: $scope.project.options.selection.hf_type.fac_type,
                  fac_name: 'Other',
                  lng: $scope.project.options.selection.district.lng,
                  lat: $scope.project.options.selection.district.lat
                }
                //
                // disable/enable
                $(id).prop('disabled', true);
                $scope.project.addLocation();
                Materialize.toast('No facility exists of that type in ' + $scope.project.options.selection.province.prov_name + ", added as 'Other'", 3000, 'note');
              }

          }

          // disable/enable
          $(id).prop('disabled', disabled);

          // update dropdown
          $timeout(function(){
            $(id).material_select('update');
          }, 200);

        },

        // add location
        addLocation: function(){

          // push location to locations
          $scope.project.definition.locations.push({
            organization_id: config.project.details.organization_id,
            project_id: config.project.details.id,
            user_id: ngmUser.get().id,
            username: ngmUser.get().username,
            project_title: config.project.details.project_title,
            prov_code: $scope.project.options.selection.province.prov_code,
            prov_name: $scope.project.options.selection.province.prov_name,
            dist_code: $scope.project.options.selection.district.dist_code,
            dist_name: $scope.project.options.selection.district.dist_name,
            conflict: $scope.project.options.selection.district.conflict,
            fac_id: $scope.project.options.selection.hf_name.fac_id,
            fac_type: $scope.project.options.selection.hf_name.fac_type,
            fac_name: $scope.project.options.selection.hf_name.fac_name,
            lng: $scope.project.options.selection.hf_name.lng,
            lat: $scope.project.options.selection.hf_name.lat
          });

          // refresh dropdown options
          $scope.project.resetLocationSelect(true, true, true, true);

        },

        // remove location from location list
        removeLocation: function($index) {
          // remove location at i
          $scope.project.definition.locations.splice($index, 1);
          // refresh dropdown options
          $scope.project.resetLocationSelect(true, true, true, true);

        },        

        // refresh dropdown options
        resetLocationSelect: function(province, district, hf_type, hf_name){

          // reset province
          if(province){
            // reset select option
            $scope.project.options.selection.province = {};
            $scope.project.options.list.provinces = angular.fromJson(localStorage.getItem('provinceList'));
            // reset dropdown
            $('#ngm-project-province').prop('selectedIndex',0);
            $timeout(function() {
              // update
              $('#ngm-project-province').material_select('update');
            }, 10);
          }

          // reset district
          if(district){
            // reset select option
            $scope.project.options.selection.district = {};
            $scope.project.options.list.districts = angular.fromJson(localStorage.getItem('districtList'));
            // refresh dropdown
            $('#ngm-project-district').prop('selectedIndex',0);
            $('#ngm-project-district').prop('disabled', true);
            $timeout(function() {
              // update
              $('#ngm-project-district').material_select('update');
            }, 10);
          }

          // reset district
          if(hf_type){
            // reset select option
            $scope.project.options.selection.hf_type = {};
            $scope.project.options.list.hf_type = angular.fromJson(localStorage.getItem('hfTypeList'));
            // refresh dropdown
            $('#ngm-project-hf_type').prop('selectedIndex',0);
            $('#ngm-project-hf_type').prop('disabled', true);
            $timeout(function() {
              // update
              $('#ngm-project-hf_type').material_select('update');
            }, 10);
          }

          // reset district
          if(hf_name){
            // reset select option
            $scope.project.options.selection.hf_name = {};
            $scope.project.options.list.hf_name = angular.fromJson(localStorage.getItem('hfList'));
            // refresh dropdown
            $('#ngm-project-hf_name').prop('selectedIndex',0);
            $('#ngm-project-hf_name').prop('disabled', true);
            $timeout(function() {
              // update
              $('#ngm-project-hf_name').material_select('update');
            }, 10);
          }

        },

        // 
        addBeneficiary: function() {

          // copy selection
          var beneficiary = angular.copy($scope.project.options.selection.beneficiary);

          // push to beneficiaries
          $scope.project.definition.beneficiaries.push({
            username: ngmUser.get().username,
            organization_id: config.project.details.organization_id,
            project_id: config.project.details.id,
            beneficiary_name: beneficiary.beneficiary_name,
            beneficiary_category: beneficiary.beneficiary_category
          });

          // clear selection
          $scope.project.options.selection.beneficiary = {}

          // filter list
          $scope.project.options.list.beneficiaries = $filter('filter')($scope.project.options.list.beneficiaries, { beneficiary_category: '!' + beneficiary.beneficiary_category }, true);
          
          // update dropdown
          $timeout(function(){
            // filter
            $('#ngm-beneficiary-category').material_select('update');
          }, 10);

        },

        // cofirm exit if changes
        modalConfirm: function(modal){

          // if dirty, confirm exit
          if($scope.healthProjectForm.$dirty){
            $('#' + modal).openModal({dismissible: false});
          } else{
            $scope.project.cancel();
          }

        },

        // 
        save: function(){

          // open success modal if valid form
          if($scope.healthProjectForm.$valid){

            // details update
            var details = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectDetails',
              data: {
                project: $scope.project.definition
              }
            });

            // locations update
            var locations = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectLocations',
              data: {
                project: $scope.project.definition
              }
            });

            // beneficiaries update
            var beneficiaries = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectBeneficiaries',
              data: {
                project: $scope.project.definition
              }
            });

            // request all 
            $q.all([details, locations, beneficiaries]).then(function(results) {
              // notification modal
              $('#save-modal').openModal({dismissible: false});
            });

          } else {
            // form validation takes over
            $scope.healthProjectForm.$setSubmitted();
            // inform
            Materialize.toast('Please review the form for errors and try again!', 3000);
          }

        },

        // re-direct on save
        redirect: function(){

          // new becomes active!
          if( $scope.project.definition.details.project_status === 'new' ) {
            var msg = $scope.project.definition.details.project_title + ' created!';
          } else {
            var msg = $scope.project.definition.details.project_title + ' updated!';
          }

          // redirect on success
          $timeout(function(){
            $location.path( '/health/projects/summary/' + $scope.project.definition.details.id );
            Materialize.toast( msg, 3000, 'success');
          }, 200);

        },

        // cancel and delete empty project
        cancel: function() {

          // if new project, delete
          if( $scope.project.definition.details.project_status === 'new' ) {
            // project for delete
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/deleteProject',
              data: {
                id: $scope.project.definition.details.id
              }
            }).then(function(data){
              // 
              $location.path( '/health/projects' );
              Materialize.toast( 'Create Project cancelled!', 3000, 'note' );

            });

          } else {
            // update
            $timeout(function() {
              $location.path( '/health/projects/summary/' + $scope.project.definition.details.id );
              if( $scope.project.definition.details.project_status !== 'complete' ) {
                Materialize.toast( 'Project update cancelled!', 3000, 'note' );
              }
            }, 100);

          }

        },

        // set start datepicker
        setStartTime: function() {
            
          // set element
          $scope.$input = $('#ngm-start-date').pickadate({
            selectMonths: true,
            selectYears: 15,
            format: 'dd mmm, yyyy',
            onStart: function(){
              $timeout(function(){
                // set time
                var date = moment($scope.project.definition.details.project_start_date).format('YYYY-MM-DD');
                $scope.project.startPicker.set('select', date, { format: 'yyyy-mm-dd' } );

              }, 0)
            },          
            onSet: function(event){
              // close on date select
              if(event.select){
                // get date
                var selectedDate = moment(event.select);
                // check dates
                if ( (selectedDate).isAfter($scope.project.definition.details.project_end_date) ) {
                  // inform
                  Materialize.toast('Please check the dates and try again!', 3000);
                  // reset time
                  $scope.project.startPicker.set('select', moment($scope.project.definition.details.project_start_date).format('X'))

                } else {
                  // set date
                  $scope.project.definition.details.project_start_date = moment(selectedDate).format('YYYY-MM-DD');
                }
                // close
                $scope.project.startPicker.close();

              }

            }

          });        

          //pickadate api
          $scope.project.startPicker = $scope.$input.pickadate('picker');
          // on click
          $('#ngm-start-date').bind('click', function($e) {
            // open
            $scope.project.startPicker.open();
          });

        },

        // set end datepicker
        setEndTime: function() {
            
          // set element
          $scope.$input = $('#ngm-end-date').pickadate({
            selectMonths: true,
            selectYears: 15,
            format: 'dd mmm, yyyy',
            onStart: function(){
              $timeout(function(){
                // set time
                var date = moment($scope.project.definition.details.project_end_date).format('YYYY-MM-DD');
                $scope.project.endPicker.set('select', date, { format: 'yyyy-mm-dd' } );

              }, 0)
            },           
            onSet: function(event){
              // close on date select
              if(event.select){
                // get date
                var selectedDate = moment(event.select);

                // check dates
                if ( selectedDate && (selectedDate).isBefore($scope.project.definition.details.project_start_date) ) {
                  // inform
                  Materialize.toast('Please check the dates and try again!', 3000);
                  // reset time
                  $scope.project.endPicker.set('select', moment($scope.project.definition.details.project_end_date).format('X'))

                } else {
                  // set date
                  $scope.project.definition.details.project_end_date = moment(selectedDate).format('YYYY-MM-DD');
                }
                // close
                $scope.project.endPicker.close();

              }

            }

          });        

          //pickadate api
          $scope.project.endPicker = $scope.$input.pickadate('picker');
          // on click
          $('#ngm-end-date').bind('click', function($e) {
            //open
            $scope.project.endPicker.open();
          });
          
        }    

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // selects
          $('select').material_select();

          // modals
          $('.modal-trigger').leanModal();

          // init start date
          $scope.project.setStartTime();

          // init end date
          $scope.project.setEndTime();

          // menu return to list
          $('#go-to-project-list').click(function(){
            $scope.project.cancel();
          });

          // refresh dropdown options
          $scope.project.resetLocationSelect(true, true, true, true);

          // set list
          $scope.project.options.filter.beneficiaries = $scope.project.options.list.beneficiaries;

          // filter beneficiaries
          angular.forEach($scope.project.definition.beneficiaries, function(d, i){
            
            // filter list
            $scope.project.options.filter.beneficiaries = $filter('filter')($scope.project.options.list.beneficiaries, { beneficiary_category: '!' + d.beneficiary_category }, true);

          });

          // update dropdown
          $timeout(function(){
            $('#ngm-beneficiary-category').material_select('update');
          }, 10);          

        }, 1000);

      });
  }

]);
