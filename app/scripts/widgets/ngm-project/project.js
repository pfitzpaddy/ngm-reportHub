/* *
 * The MIT License
 *
 * Copyright (c) 2015, Patrick Fitzgerald
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

angular.module('ngm.widget.project', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project', {
        title: 'Health Project Form',
        description: 'Display Health Project Form',
        controller: 'projectCtrl',
        templateUrl: '/scripts/widgets/ngm-project/view.html'
      });
  }).controller('projectCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, ngmData, config){

      // get activities

      // get locations 
      
      // project
      $scope.project = {

        // parent
        style: config.style,

        // project
        details: config.project,

        // activities
        activities: [{
          organization_id: config.project.organization_id,
          project_id: config.project.id,
        }],

        // indicators
        indicators: [],

        // locations
        locations:[],

        // holder for UI options
        options: {
          select: {}
        },

        // holder for user selections
        selection: {
          location: {}
        },

        // details template
        detailsUrl: '/scripts/widgets/ngm-project/template/details.html',

        // activities template
        activityUrl: '/scripts/widgets/ngm-project/template/activity.html',

        // add activity
        addActivity: function(){

          var length = $scope.project.activities.length;

          // Test current activity
          if ($scope.project.activities[length-1].activity_type
              && $scope.project.activities[length-1].activity_description
              && $scope.project.locations.length){
            
            // Add empty activities obj
            $scope.project.activities.push([{
              organization_id: config.project.organization_id,
              project_id: config.project.id              
            }]);
            
            // Init select
            $timeout(function(){
              $('select').material_select();
            }, 400);

          } else {
            // user msg
            Materialize.toast( 'Complete the current activity section first!', 3000, 'note' );
          }

        },

        // remoce activity
        removeActivity: function(i) {
          
          // remove location at i
          $scope.project.activities.splice(i, 1);

        },        

        // add location
        addLocation: function(){

          // push location to locations
          $scope.project.locations.push({
            organization_id: config.project.organization_id,
            project_id: config.project.id,
            activity_id: 16,
            prov_code: $scope.project.selection.location.province.prov_code,
            prov_name: $scope.project.selection.location.province.prov_name,
            dist_code: $scope.project.selection.location.district.dist_code,
            dist_name: $scope.project.selection.location.district.dist_name,
            hf_id: $scope.project.selection.location.hf_name.fac_id,
            hf_type: $scope.project.selection.location.hf_name.fac_type,
            hf_name: $scope.project.selection.location.hf_name.fac_name,
            lat: $scope.project.selection.location.hf_name.lat,
            lng: $scope.project.selection.location.hf_name.lng
          });

          // refresh dropdown options
          $scope.project.resetLocation(true, true, true);

        },

        // remove location from location list
        removeLocation: function(i) {
          
          // remove location at i
          $scope.project.locations.splice(i, 1);
        },       

        // apply location dropdowns
        locationDropdowns: function(id, select) {

          var disabled;

          switch(select) {
            case 'district':
              // disabled
              disabled = !$scope.project.selection.location.province;
              // filter
              $scope.project.options.select.districts = $filter('filter')($scope.project.options.districts, { prov_code: $scope.project.selection.location.province.prov_code }, true);
              // refresh dropdown options
              $scope.project.resetLocation(false, true, true);
              break;
            case 'hf_type':
              // disabled
              disabled = !$scope.project.selection.location.district;
              // refresh dropdown options
              $scope.project.resetLocation(false, false, true);
              break;
            case 'hf_name':
              // disabled
              disabled = !$scope.project.selection.location.hf_type;
              // filter
              var provFilter = $filter('filter')($scope.project.options.hf_name, { prov_code: $scope.project.selection.location.province.prov_code }, true);
              var distFilter = $filter('filter')(provFilter, { dist_code: $scope.project.selection.location.district.dist_code }, true);
              var typeFilter = $filter('filter')(distFilter, { fac_type: $scope.project.selection.location.hf_type.fac_type }, true);
              $scope.project.options.select.hf_name = typeFilter;
              break;      
          }

          // update dropdown
          $timeout(function(){
            $(id).prop('disabled', disabled);
            $(id).material_select('update');            
          }, 400);

        },

        // refresh dropdown options
        resetLocation: function(province, district, hf){

          // reset province
          if(province){
            $('#ngm-project-province').prop('selectedIndex',0);
          }

          if(district){
            // refresh all location 'select'
            $('#ngm-project-district').prop('selectedIndex',0);
            $('#ngm-project-district').prop('disabled', true);
          }

          if(hf){
            $('#ngm-project-hf_type').prop('selectedIndex',0);
            $('#ngm-project-hf_type').prop('disabled', true);
          }

          // default
          $('#ngm-project-hf_name').prop('selectedIndex',0);
          $('#ngm-project-hf_name').prop('disabled', true);

          // update
          $('#ngm-project-province').material_select('update');
          $('#ngm-project-district').material_select('update');
          $('#ngm-project-hf_type').material_select('update');
          $('#ngm-project-hf_name').material_select('update');
        
        },

        // 
        submit: function(){
          
          // open success modal if valid form
          if($scope.healthProjectForm.$valid){
            $('#save-modal').openModal({dismissible: false});
          } else {
            // form validation takes over
            $scope.healthProjectForm.$setSubmitted();
          }

        },        

        // run submit
        save: function(markComplete){

          // User msg (new, active, complete)
          var msg;

          // if true, becomes complete!
          if( markComplete ){
            msg = $scope.project.details.project_name + ' complete, congratulations!';
            $scope.project.details.project_status = 'complete';
          } else {
            // update
            msg = $scope.project.details.project_name + ' updated!';
          }

          // new becomes active!
          if( $scope.project.details.project_status === 'new' ) {
            msg = $scope.project.details.project_name + ' created!';
            $scope.project.details.project_status = 'active';
          }          

          // Submit project for save
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/health/setProject',
            data: {
              project: $scope.project.details
            }
          }).then(function(data){
            
            $location.path( '/health/projects' );

            Materialize.toast( msg, 3000, 'success');

          });

        },

        // cancel and delete empty project
        cancel: function() {

          // if new project, delete
          if( $scope.project.details.project_status === 'new' ) {

            // project for delete
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/deleteProject',
              data: {
                id: $scope.project.details.id
              }
            }).then(function(data){
              
              $location.path( '/health/projects' );
              Materialize.toast( 'Create Project cancelled!', 3000, 'note' );

            });

          } else {

            $timeout(function() {
              $location.path( '/health/projects' );
              Materialize.toast( 'Project update cancelled!', 3000, 'note' );
            }, 100);

          }

        },

        // uiSlider project budget progress
        setProgress: function() {

          //

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
                var date = moment($scope.project.details.project_start_date).format('YYYY-MM-DD');

                $scope.project.startPicker.set('select', date, { format: 'yyyy-mm-dd' } );

              }, 0)
            },          
            onSet: function(event){
              // close on date select
              if(event.select){

                // get date
                var selectedDate = moment(event.select);

                // check dates
                if ( (selectedDate).isAfter($scope.project.details.project_end_date) ) {
                  
                  // inform
                  Materialize.toast('Please check the dates and try again!', 3000);

                  // reset time
                  $scope.project.startPicker.set('select', moment($scope.project.details.project_start_date).format('X'))

                } else {
                  // set date
                  $scope.project.details.project_start_date = moment(selectedDate).format('YYYY-MM-DD');
                }

                $scope.project.startPicker.close();

              }

            }

          });        

          //pickadate API
          $scope.project.startPicker = $scope.$input.pickadate('picker');

          // open on click
          $('#ngm-start-date').bind('click', function($e) {
            
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
                var date = moment($scope.project.details.project_end_date).format('YYYY-MM-DD');

                $scope.project.endPicker.set('select', date, { format: 'yyyy-mm-dd' } );

              }, 0)
            },           
            onSet: function(event){
              // close on date select
              if(event.select){

                // get date
                var selectedDate = moment(event.select);

                // check dates
                if ( selectedDate && (selectedDate).isBefore($scope.project.details.project_start_date) ) {
                  
                  // inform
                  Materialize.toast('Please check the dates and try again!', 3000);

                  // reset time
                  $scope.project.endPicker.set('select', moment($scope.project.details.project_end_date).format('X'))

                } else {
                  // set date
                  $scope.project.details.project_end_date = moment(selectedDate).format('YYYY-MM-DD');
                }

                $scope.project.endPicker.close();

              }

            }

          });        

          //pickadate API
          $scope.project.endPicker = $scope.$input.pickadate('picker');

          // open on click
          $('#ngm-end-date').bind('click', function($e) {
            
            $scope.project.endPicker.open();

          });
          
        }

      }     

      // get provinces
      if(!$scope.project.options.provinces) {
        ngmData.get({
          method: 'POST',
          url: 'http://' + $location.host() + '/api/health/getProvincesList'
        }).then(function(data){
          $scope.project.options.provinces = data;
          $('#ngm-project-province').material_select('update');
        });
      }  

      // get provinces
      if(!$scope.project.options.districts) {
        ngmData.get({
          method: 'POST',
          url: 'http://' + $location.host() + '/api/health/getDistrictsList'
        }).then(function(data){
          $scope.project.options.districts = data;
          // $('#ngm-project-district').material_select('update');
        });
      } 

      // get hf_types
      if(!$scope.project.options.hf_type) {
        ngmData.get({
          method: 'POST',
          url: 'http://' + $location.host() + '/api/health/getFacilityTypeList'
        }).then(function(data){
          $scope.project.options.hf_type = data;
          $('#ngm-project-hf_type').material_select('update');
        });
      }  

      // get hf_name
      if(!$scope.project.options.hf_name) {
        ngmData.get({
          method: 'POST',
          url: 'http://' + $location.host() + '/api/health/getFacilityList'
        }).then(function(data){
          $scope.project.options.hf_name = data;
          $('#ngm-project-hf_name').material_select('update');
        });
      }                      
      
      // initalize 
      $timeout(function() {

        // modals
        $('.modal-trigger').leanModal();

        // menu return to list
        $('#go-to-project-list').click(function(){
          $scope.project.cancel();
        });        

        // selects
        $('select').material_select();

        // set budget progress
        // $scope.project.setProgress();

        // initiate date pickers
        $scope.project.setStartTime();
        $scope.project.setEndTime();

      }, 400);
  }

]);

