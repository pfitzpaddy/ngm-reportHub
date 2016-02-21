/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectFormDetailsCtrl
 * @description
 * # ReportHealthProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngmReportHub')
  .controller('ReportHealthProjectFormFinancialsCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    'ngmData',
    function($scope, $location, $timeout, $filter, ngmData){

      // accept data

      // project details

      // project locations

      // project beneficiaries






  //     // project
  //     $scope.project = {

  //       // parent
  //       style: config.style,

  //       // project descritpion
  //       definition: {
  //         // project
  //         details: config.project.details,
  //         // activities
  //         activities: config.project.activities
  //       },

  //       // holder for UI options
  //       options: {
  //         select: {}
  //       },

  //       // details template
  //       detailsUrl: '/scripts/widgets/ngm-project/template/details.html',

  //       // activities template
  //       activityUrl: '/scripts/widgets/ngm-project/template/activity.html',

  //       // add activity
  //       addActivity: function(){

  //         var length = $scope.project.definition.activities.length;

  //         // Test current activity
  //         if ($scope.project.definition.activities[length-1].activity_type
  //             && $scope.project.definition.activities[length-1].activity_description
  //             && $scope.project.definition.activities[length-1].beneficiaries
  //             && $scope.project.definition.activities[length-1].locations.length){

  //           // toast msg
  //           Materialize.toast( 'New Activity Added!', 2000, 'note' );

  //           // create activity in db
  //           $scope.project.createActivity();

  //         } else {
  //           // user msg
  //           Materialize.toast( 'Complete the current activity section first!', 3000, 'note' );
  //         }

  //       },

  //       createActivity: function() {

  //         // create new activity
  //         ngmData.get({
  //           method: 'POST',
  //           url: 'http://' + $location.host() + '/api/health/activity/create',
  //           data:{
  //             organization_id: config.project.details.organization_id,
  //             project_id: config.project.details.id
  //           }
  //         }).then(function(data){
  //           // Add empty activities obj
  //           $scope.project.definition.activities.push({
  //             // default
  //             organization_id: config.project.details.organization_id,
  //             project_id: config.project.details.id,
  //             id: data.id,
  //             // beneficiaries
  //             beneficiaries: {
  //               organization_id: config.project.details.organization_id,
  //               project_id: config.project.details.id,                
  //               activity_id: data.id
  //             },
  //             // locations
  //             locations:[]
  //           });

  //           // Init select
  //           $timeout(function(){
  //             $('select').material_select();
  //           }, 400);

  //         });

  //       } ,       

  //       // remoce activity
  //       removeActivity: function(i) {

  //         console.log($scope.project.definition.activities);
          
  //         // remove location at i
  //         $scope.project.definition.activities.splice(i, 1);

  //         console.log($scope.project.definition.activities);

  //       },        

  //       // add location
  //       addLocation: function(i){

  //         // push location to locations
  //         $scope.project.definition.activities[i].locations.push({
  //           organization_id: config.project.details.organization_id,
  //           project_id: config.project.details.id,
  //           activity_id: $scope.project.definition.activities[i].id,
  //           prov_code: $scope.project.definition.activities[i].selection.province.prov_code,
  //           prov_name: $scope.project.definition.activities[i].selection.province.prov_name,
  //           dist_code: $scope.project.definition.activities[i].selection.district.dist_code,
  //           dist_name: $scope.project.definition.activities[i].selection.district.dist_name,
  //           fac_id: $scope.project.definition.activities[i].selection.hf_name.fac_id,
  //           fac_type: $scope.project.definition.activities[i].selection.hf_name.fac_type,
  //           fac_name: $scope.project.definition.activities[i].selection.hf_name.fac_name,
  //           lat: $scope.project.definition.activities[i].selection.hf_name.lat,
  //           lng: $scope.project.definition.activities[i].selection.hf_name.lng
  //         });

  //         // refresh dropdown options
  //         $scope.project.resetLocation(true, true, true, true);

  //       },

  //       // remove location from location list
  //       removeLocation: function($index, $locationIndex) {
          
  //         // remove location at i
  //         $scope.project.definition.activities[$index].locations.splice($locationIndex, 1);
  //         // refresh dropdown options
  //         $scope.project.resetLocation(true, true, true, true);
  //       },       

  //       // apply location dropdowns
  //       locationDropdowns: function(i, id, select) {

  //         console.log('here');

  //         var disabled;

  //         switch(select) {
  //           case 'district':
  //             // disabled
  //             disabled = !$scope.project.definition.activities[i].selection.province;
  //             // filter
  //             $scope.project.options.select.districts = $filter('filter')($scope.project.options.districts, { prov_code: $scope.project.definition.activities[i].selection.province.prov_code }, true);
  //             // refresh dropdown options
  //             $scope.project.resetLocation(false, true, true, false);
  //             break;
  //           case 'hf_type':
  //             // disabled
  //             disabled = !$scope.project.definition.activities[i].selection.district;
  //             // refresh dropdown options
  //             $scope.project.resetLocation(false, false, true, false);
  //             break;
  //           case 'hf_name':
  //             // disabled
  //             disabled = !$scope.project.definition.activities[i].selection.hf_type;
  //             // filter
  //             var provFilter = $filter('filter')($scope.project.options.hf_name, { prov_code: $scope.project.definition.activities[i].selection.province.prov_code }, true);
  //             var distFilter = $filter('filter')(provFilter, { dist_code: $scope.project.definition.activities[i].selection.district.dist_code }, true);
  //             var typeFilter = $filter('filter')(distFilter, { fac_type: $scope.project.definition.activities[i].selection.hf_type.fac_type }, true);

  //             // if null (fix location!)
  //             if(typeFilter.length===0){
  //               // add 'Other' and exit
  //               $scope.project.definition.activities[i].selection.hf_name ={
  //                 fac_id: 11111,
  //                 fac_type: $scope.project.definition.activities[i].selection.hf_type.fac_type,
  //                 fac_name: 'Other',
  //                 lat: 0,
  //                 lng: 0
  //               }
  //               Materialize.toast('No facility exists of that type in ' + $scope.project.definition.activities[i].selection.province.prov_name + ", added as 'Other'", 3000, 'note');
  //               $scope.project.addLocation(i);

  //             } else {
  //               $scope.project.options.select.hf_name = typeFilter;
  //             }


  //             break;      
  //         }

  //         // update dropdown
  //         $timeout(function(){
  //           $(id).prop('disabled', disabled);
  //           $(id).material_select('update');            
  //         }, 400);

  //       },

  //       // refresh dropdown options
  //       resetLocation: function(province, district, hf, reset){

  //         // for each activity option
  //         angular.forEach($scope.project.definition.activities, function(d, i){
  //           // reset province
  //           if(province){
  //             $('#ngm-project-province-' + i).prop('selectedIndex',0);
  //           }

  //           if(district){
  //             // refresh all location 'select'
  //             $('#ngm-project-district-' + i).prop('selectedIndex',0);
  //             $('#ngm-project-district-' + i).prop('disabled', true);
  //           }

  //           if(hf){
  //             $('#ngm-project-hf_type-' + i).prop('selectedIndex',0);
  //             $('#ngm-project-hf_type-' + i).prop('disabled', true);
  //           }

  //           // default
  //           $('#ngm-project-hf_name-' + i).prop('selectedIndex',0);
  //           $('#ngm-project-hf_name-' + i).prop('disabled', true);

  //           // update
  //           $('#ngm-project-province-' + i).material_select('update');
  //           $('#ngm-project-district-' + i).material_select('update');
  //           $('#ngm-project-hf_type-' + i).material_select('update');
  //           $('#ngm-project-hf_name-' + i).material_select('update');

  //           if(reset){
  //             // reset selection
  //             $scope.project.definition.activities[i].selection = {
  //               province: {},
  //               district: {},
  //               hf_type: {},
  //               hf_name: {}
  //             };
  //           }

  //         });
        
  //       },

  //       // 
  //       save: function(){

  //         // open success modal if valid form
  //         if($scope.healthProjectForm.$valid){

  //           // Submit project for save
  //           ngmData.get({
  //             method: 'POST',
  //             url: 'http://' + $location.host() + '/api/health/project/setProject',
  //             data: {
  //               project: $scope.project.definition
  //             }
  //           }).then(function(data){
  //             // notification modal
  //             $('#save-modal').openModal({dismissible: false});
  //           });

  //         } else {
  //           // form validation takes over
  //           $scope.healthProjectForm.$setSubmitted();
  //           // inform
  //           Materialize.toast('Please review the form for errors and try again!', 3000);
  //         }

  //       },

  //       // re-direct on save
  //       redirect: function(){
            
  //         var msg;

  //         // new becomes active!
  //         if( $scope.project.definition.details.project_status === 'new' ) {
  //           msg = $scope.project.definition.details.project_name + ' created!';
  //         } else {
  //           msg = $scope.project.definition.details.project_name + ' updated!';
  //         }

  //         // redirect on success
  //         $timeout(function(){
  //           $location.path( '/health/projects' );
  //           Materialize.toast( msg, 3000, 'success');
  //         }, 200)

  //       },               

  //       // run submit
  //       saveComplete: function(){

  //         // User msg
  //         var msg;

  //         // mark project complete
  //         $scope.project.definition.details.project_status = 'complete';       

  //         // Submit project for save
  //         ngmData.get({
  //           method: 'POST',
  //           url: 'http://' + $location.host() + '/api/health/project/setProject',
  //           data: {
  //             project: $scope.project.definition
  //           }
  //         }).then(function(data){
  //           // redirect on success
  //           $location.path( '/health/projects' );
  //           Materialize.toast( msg, 3000, 'success');
  //         });

  //       },

  //       // cancel and delete empty project
  //       cancel: function() {

  //         // if new project, delete
  //         if( $scope.project.definition.details.project_status === 'new' ) {

  //           // project for delete
  //           ngmData.get({
  //             method: 'POST',
  //             url: 'http://' + $location.host() + '/api/health/project/deleteProject',
  //             data: {
  //               id: $scope.project.definition.details.id
  //             }
  //           }).then(function(data){
              
  //             $location.path( '/health/projects' );
  //             Materialize.toast( 'Create Project cancelled!', 3000, 'note' );

  //           });

  //         } else {

  //           $timeout(function() {
  //             $location.path( '/health/projects' );
  //             Materialize.toast( 'Project update cancelled!', 3000, 'note' );
  //           }, 100);

  //         }

  //       },

  //       // uiSlider project budget progress
  //       setProgress: function() {

  //         //

  //       },

  //       // set start datepicker
  //       setStartTime: function() {
            
  //         // set element
  //         $scope.$input = $('#ngm-start-date').pickadate({
  //           selectMonths: true,
  //           selectYears: 15,
  //           format: 'dd mmm, yyyy',
  //           onStart: function(){
  //             $timeout(function(){
                
  //               // set time
  //               var date = moment($scope.project.definition.details.project_start_date).format('YYYY-MM-DD');

  //               $scope.project.startPicker.set('select', date, { format: 'yyyy-mm-dd' } );

  //             }, 0)
  //           },          
  //           onSet: function(event){
  //             // close on date select
  //             if(event.select){

  //               // get date
  //               var selectedDate = moment(event.select);

  //               // check dates
  //               if ( (selectedDate).isAfter($scope.project.definition.details.project_end_date) ) {
                  
  //                 // inform
  //                 Materialize.toast('Please check the dates and try again!', 3000);

  //                 // reset time
  //                 $scope.project.startPicker.set('select', moment($scope.project.definition.details.project_start_date).format('X'))

  //               } else {
  //                 // set date
  //                 $scope.project.definition.details.project_start_date = moment(selectedDate).format('YYYY-MM-DD');
  //               }

  //               $scope.project.startPicker.close();

  //             }

  //           }

  //         });        

  //         //pickadate API
  //         $scope.project.startPicker = $scope.$input.pickadate('picker');

  //         // open on click
  //         $('#ngm-start-date').bind('click', function($e) {
            
  //           $scope.project.startPicker.open();

  //         });

  //       },

  //       // set end datepicker
  //       setEndTime: function() {
            
  //         // set element
  //         $scope.$input = $('#ngm-end-date').pickadate({
  //           selectMonths: true,
  //           selectYears: 15,
  //           format: 'dd mmm, yyyy',
  //           onStart: function(){
  //             $timeout(function(){
                
  //               // set time
  //               var date = moment($scope.project.definition.details.project_end_date).format('YYYY-MM-DD');

  //               $scope.project.endPicker.set('select', date, { format: 'yyyy-mm-dd' } );

  //             }, 0)
  //           },           
  //           onSet: function(event){
  //             // close on date select
  //             if(event.select){

  //               // get date
  //               var selectedDate = moment(event.select);

  //               // check dates
  //               if ( selectedDate && (selectedDate).isBefore($scope.project.definition.details.project_start_date) ) {
                  
  //                 // inform
  //                 Materialize.toast('Please check the dates and try again!', 3000);

  //                 // reset time
  //                 $scope.project.endPicker.set('select', moment($scope.project.definition.details.project_end_date).format('X'))

  //               } else {
  //                 // set date
  //                 $scope.project.definition.details.project_end_date = moment(selectedDate).format('YYYY-MM-DD');
  //               }

  //               $scope.project.endPicker.close();

  //             }

  //           }

  //         });        

  //         //pickadate API
  //         $scope.project.endPicker = $scope.$input.pickadate('picker');

  //         // open on click
  //         $('#ngm-end-date').bind('click', function($e) {
            
  //           $scope.project.endPicker.open();

  //         });
          
  //       }

  //     }

  //     // get provinces
  //     if(!$scope.project.options.provinces) {
  //       ngmData.get({
  //         method: 'POST',
  //         url: 'http://' + $location.host() + '/api/health/getProvincesList'
  //       }).then(function(data){
  //         $scope.project.options.provinces = data;
  //         $('#ngm-project-province').material_select('update');
  //       });
  //     }  

  //     // get provinces
  //     if(!$scope.project.options.districts) {
  //       ngmData.get({
  //         method: 'POST',
  //         url: 'http://' + $location.host() + '/api/health/getDistrictsList'
  //       }).then(function(data){
  //         $scope.project.options.districts = data;
  //       });
  //     } 

  //     // get hf_types
  //     if(!$scope.project.options.hf_type) {
  //       ngmData.get({
  //         method: 'POST',
  //         url: 'http://' + $location.host() + '/api/health/getFacilityTypeList'
  //       }).then(function(data){
  //         $scope.project.options.hf_type = data;
  //         $('#ngm-project-hf_type').material_select('update');
  //       });
  //     }  

  //     // get hf_name
  //     if(!$scope.project.options.hf_name) {
  //       ngmData.get({
  //         method: 'POST',
  //         url: 'http://' + $location.host() + '/api/health/getFacilityList'
  //       }).then(function(data){
  //         $scope.project.options.hf_name = data;
  //         $('#ngm-project-hf_name').material_select('update');
  //       });
  //     }                      
      
  //     // initalize 
  //     $timeout(function() {

  //       // modals
  //       $('.modal-trigger').leanModal();

  //       // menu return to list
  //       $('#go-to-project-list').click(function(){
  //         $scope.project.cancel();
  //       });        

  //       // selects
  //       $('select').material_select();

  //       // set budget progress
  //       // $scope.project.setProgress();

  //       // initiate date pickers
  //       $scope.project.setStartTime();
  //       $scope.project.setEndTime();

  //     }, 400);
  
  }

]);
