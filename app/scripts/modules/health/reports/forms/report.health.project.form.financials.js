/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.financials', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.financials', {
        title: 'Health Project Financials Form',
        description: 'Display Health Project Financials Form',
        controller: 'ProjectFinancialsCtrl',
        templateUrl: '/views/modules/health/forms/financials/form.html'
      });
  })
  .controller('ProjectFinancialsCtrl', [
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
          selection: {},
          list: [{
              expenditure_item: 'agreements',
              expenditure_name: 'Agreements with UN/NGO'
            },{
              expenditure_item: 'contractual_service_general',
              expenditure_name: 'Contractual Service General'
            },{
              expenditure_item: 'dfc',
              expenditure_name: 'DFC'
            },{
              expenditure_item: 'equiptment_vehicles_furniture',
              expenditure_name: 'Equiptment, Vehicles, Furniture'
            },{
              expenditure_item: 'general_operating_costs',
              expenditure_name: 'General Operating Costs'
            },{ 
              expenditure_item: 'medical_supplies_literature',
              expenditure_name: 'Medical Supplies, Literature'
            },{
              expenditure_item: 'psc_cost',
              expenditure_name: 'PSC Cost'
            },{
              expenditure_item: 'security_expenses',
              expenditure_name: 'Security Expenses'
            },{
              expenditure_item: 'staff_costs_lt',
              expenditure_name: 'Staff Costs LT'
            },{
              expenditure_item: 'staff_costs_st',
              expenditure_name: 'Staff Costs ST'
            },{
              expenditure_item: 'staff_costs_supplementary',
              expenditure_name: 'Staff Costs Supplementary'
            },{
              expenditure_item: 'telecomunications',
              expenditure_name: 'Telecomunications'
            },{
              expenditure_item: 'training',
              expenditure_name: 'Training'
            },{
              expenditure_item: 'travel',
              expenditure_name: 'Travel'
          }]
        },        

        // details template
        financialsUrl: '/views/modules/health/forms/financials/financials.html',

        // 
        addFinancialItem: function() {

          // push to financials
          $scope.project.definition.financials.push({
            username: ngmUser.get().username,
            organization_id: $scope.project.definition.details.organization_id,
            project_id: $scope.project.definition.details.id,
            status: 'new',
            expenditure_item: $scope.project.options.selection.expenditure.expenditure_item,
            expenditure_name: $scope.project.options.selection.expenditure.expenditure_name,
            expenditure_start_date: moment().format('YYYY-MM-DD'),
            expenditure_end_date: moment().add(1, 'months').format('YYYY-MM-DD')
          });
          
          // update dropdown
          $timeout(function(){
            // selects
            $('#ngm-expenditure-item-' + $scope.project.definition.financials.length - 1).material_select();
            // date picker
            $scope.project.setStartTime();
            $scope.project.setEndTime();
          }, 10);

        },

        // remove location from location list
        removeFinancialItem: function($index) {
          // remove location at i
          $scope.project.definition.financials.splice($index, 1);
        },

        // cofirm exit if changes
        modalConfirm: function(modal){

          // if dirty, warn on exit
          if($scope.healthProjectFinancialsForm.$dirty){
            $('#' + modal).openModal({dismissible: false});
          } else{
            $scope.project.cancel();
          }

        },

        // update project/financials
        save: function(){

          // open success modal if valid form
          if($scope.healthProjectFinancialsForm.$valid){

           // details update
            var details = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectDetails',
              data: {
                project: $scope.project.definition
              }
            });

            // financials update
            var financials = $http({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProjectFinancials',
              data: {
                project: $scope.project.definition
              }
            });

            // request all 
            $q.all([details, financials]).then(function(results) {
              // notification modal
              $('#save-modal').openModal({dismissible: false});
            });

          } else {
            // form validation takes over
            $scope.healthProjectFinancialsForm.$setSubmitted();
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

        },

        // set start datepicker
        setStartTime: function() {

          // for each financial item
          angular.forEach($scope.project.definition.financials, function(d, i){

            // set element
            $scope.$input = $('#ngm-expenditure-start-date-' + i).pickadate({
              selectMonths: true,
              selectYears: 15,
              format: 'dd mmm, yyyy',
              onStart: function(){
                $timeout(function(){
                  // set time
                  $scope.project.startPicker.set('select', d.expenditure_start_date, { format: 'yyyy-mm-dd' } );

                }, 10)
              },          
              onSet: function(event){
                // close on date select
                if(event.select){
                  // get date
                  var selectedDate = moment(event.select);
                  // check dates
                  if ( (selectedDate).isAfter(d.expenditure_end_date) ) {
                    // inform
                    Materialize.toast('Please check the dates and try again!', 3000);
                    // reset time
                    $scope.project.startPicker.set('select', moment(d.expenditure_start_date).format('X'));

                  } else {
                    // set date
                    $scope.project.definition.financials[i].expenditure_start_date = moment(selectedDate).format('YYYY-MM-DD');
                  }
                  // close
                  $scope.project.startPicker.close();

                }

              }

            });

            //pickadate api
            $scope.project.startPicker = $scope.$input.pickadate('picker');
            // on click
            $('#ngm-expenditure-start-date-' + i).bind('click', function($e) {
              // open
              $scope.project.startPicker.open();
            });            

          });

        },

        // set end datepicker
        setEndTime: function() {

          // for each financial item
          angular.forEach($scope.project.definition.financials, function(d, i){
            
            // set element
            $scope.$input = $('#ngm-expenditure-end-date-' + i).pickadate({
              selectMonths: true,
              selectYears: 15,
              format: 'dd mmm, yyyy',
              onStart: function(){
                $timeout(function(){
                  // set time
                  $scope.project.endPicker.set('select', d.expenditure_end_date, { format: 'yyyy-mm-dd' } );

                }, 10)
              },          
              onSet: function(event){
                // close on date select
                if(event.select){
                  // get date
                  var selectedDate = moment(event.select);
                  // check dates
                  if ( (selectedDate).isBefore(d.expenditure_start_date) ) {
                    // inform
                    Materialize.toast('Please check the dates and try again!', 3000);
                    // reset time
                    $scope.project.endPicker.set('select', moment(d.expenditure_end_date).format('X'))

                  } else {
                    // set date
                    $scope.project.definition.financials[i].expenditure_end_date = moment(selectedDate).format('YYYY-MM-DD');
                  }
                  // close
                  $scope.project.endPicker.close();

                }

              }

            });        

            //pickadate api
            $scope.project.endPicker = $scope.$input.pickadate('picker');
            // on click
            $('#ngm-expenditure-end-date-' + i).bind('click', function($e) {
              // open
              $scope.project.endPicker.open();
            });         

          });

        }        

      }

      // initalize 
      $timeout(function() {

        // menu return to list
        $('#go-to-project-list').click(function(){
          $scope.project.cancel();
        });        

        // selects
        $('#ngm-beneficiary-category').material_select();

        // initiate date pickers
        $scope.project.setStartTime();
        $scope.project.setEndTime();

      }, 400);
  
  }

]);
