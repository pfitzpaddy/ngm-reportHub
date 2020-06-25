/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportCtrl
 * @description
 * # ClusterProjectFormReportCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.financials', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.financials', {
        title: 'Cluster Financial Form',
        description: 'Cluster Financial Form',
        controller: 'ClusterProjectFormFinancialCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/financials/form.html'
      });
  })
  .controller( 'ClusterProjectFormFinancialCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmAuth',
    'ngmData',
    'ngmClusterHelper',
		'ngmClusterLists',
    'ngmClusterFinancial',
    'ngmClusterImportFile',
    'config',
    '$translate',
    function ($scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, ngmClusterFinancial, ngmClusterImportFile, config,$translate ){

      // project

      //budget_funds
      $scope.ngmClusterImportFile = ngmClusterImportFile;
			$scope.ngmClusterFinancial = ngmClusterFinancial;
      if($scope.config.project.admin0pcode === 'COL'){
        financial_html = 'financials-COL.html';
        budget_funds= [ { budget_funds_id: 'received', budget_funds_name: $filter('translate')('received') },{ budget_funds_id: 'excecuted', budget_funds_name: $filter('translate')('excecuted') } ];

      }else{
				// financial_html = 'financials.html';
				financial_html = 'financial-reform.html';
         budget_funds= [ { budget_funds_id: 'financial', budget_funds_name: $filter('translate')('financial') }, { budget_funds_id: 'inkind',budget_funds_name: $filter('translate')('inkind') } ];

			}
			$scope.detailFinancial = [];
			$scope.detailFinancial = config.project.project_budget_progress.length ?
			new Array(config.project.project_budget_progress.length).fill(false) : new Array(0).fill(false);
			if (config.project.project_budget_progress.length) {
				$scope.detailFinancial[0] = true;
			}
			// })

      $scope.messageFromfile = [];
      $scope.inputString = false;
      

      $scope.project = {
        
        // user
        user: ngmUser.get(),
        
        // app style
        style: config.style,
        
        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
                
        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/financials/',

        //financialsUrl: 'financials.html',
        financialsUrl: financial_html,

        notesUrl: 'notes.html',

        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.project.adminRpcode, admin0pcode:config.project.admin0pcode, cluster_id: config.project.cluster_id, organization_tag:config.project.organization_tag } ),

        // placeholder bydget activity
        lists: {
          reported_on_fts: [ { reported_on_fts_id: 'yes', reported_on_fts_name: $filter('translate')('yes') }, { reported_on_fts_id: 'no', reported_on_fts_name: 'No' } ],
          //budget_funds: [ { budget_funds_id: 'financial', budget_funds_name: $filter('translate')('financial') }, { budget_funds_id: 'inkind',budget_funds_name: $filter('translate')('inkind') } ],
          budget_funds: budget_funds,
          financial_programming: [{ 
            financial_programming_id: 'non_cash', financial_programming_name: $filter('translate')('non_cash')
          },{ 
            financial_programming_id: 'restricted_cash', financial_programming_name: $filter('translate')('restricted_cash') 
          },{ 
            financial_programming_id: 'unrestricted_cash', financial_programming_name: $filter('translate')('unrestricted_cash')
          }],
          multi_year_funding: [ { multi_year_funding_id: 'yes', multi_year_funding_name: $filter('translate')('yes') }, { multi_year_funding_id: 'no', multi_year_funding_name: 'No' } ],
          activity_type: angular.copy( config.project.activity_type ),
          currencies: ngmClusterLists.getCurrencies( config.project.admin0pcode ),
          activity_descriptions: angular.copy( config.project.target_beneficiaries),
          activity_descriptions2: [],

          //for Colombia
           target_locations_departamentos : [... new Set(config.project.target_locations.map(data => data.admin1name))],
           target_locations_departamentos2:  config.project.target_locations,
         target_locations_municipios:  [... new Set(config.project.target_locations.map(data => data.admin2name))],
         target_locations_municipios2: config.project.target_locations,


        },

        // datepicker
        datepicker: {
          maxDate: moment().format('YYYY-MM-DD'),
          onClose: function( $budget ) {
            // format date on selection
            $budget.project_budget_date_recieved = 
                moment( new Date( $budget.project_budget_date_recieved ) ).format('YYYY-MM-DD');
          }
        },

				cancelEdit: function ($index) {
					if (!$scope.project.definition.project_budget_progress[$index].id) {
						$scope.project.definition.project_budget_progress.splice($index, 1);
					}
				},

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 400);
        },

        text_input: '',
        messageWarning: '',
        isSaving:false,

        // donor
        showDonor: function( $data, $budget ) {
          var selected = [];
          $budget.project_donor_id = $data;
          if( $budget.project_donor_id ) {
            selected = $filter('filter')( $scope.project.definition.project_donor, { project_donor_id: $budget.project_donor_id }, true);
            if( selected.length ) {
              $budget.project_donor_name = selected[0].project_donor_name;
            }
          } 
          return selected.length ? selected[0].project_donor_name : $filter('translate')('no_selection')+'!';
        },

        // activity
        showActivity: function( $data, $budget ) {

          
          var selected = [];

          $budget.activity_type_id = $data;
       
          if( $budget.activity_type_id ) {
            selected = $filter('filter')( $scope.project.lists.activity_type, { activity_type_id: $budget.activity_type_id }, true);
            if( selected.length ) {
              $budget.cluster = selected[0].cluster;
              $budget.cluster_id = selected[0].cluster_id;
              $budget.activity_type_name = selected[0].activity_type_name;
            }

            $scope.project.lists.activity_descriptions2 = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_type_id: $budget.activity_type_id }, true);
            
          } 
          return selected.length ? selected[0].activity_type_name : $filter('translate')('no_selection')+'!';
        },

        //Select Departamento FOR COLOMBIA

        departamento: function( $data, $budget ) {

          var selected = [];
          $budget.admin1name = $data;


           if( $budget.admin1name ) {

              if($budget.admin1name == 'All' || $budget.admin1name == 'Todos'){

             
               $budget.admin1name = $filter('translate')('all_min1');
              $budget.admin1pcode = $filter('translate')('all_min1');
              $budget.admin1lat = 4.3200072;
              $budget.admin1lng = -74.1519811;

                // console.log(antes, "ANTES");
                 $scope.project.lists.target_locations_municipios =  [... new Set($scope.project.lists.target_locations_municipios2.map(data => data.admin2name))];
                  $scope.project.lists.target_locations_municipios.unshift($filter('translate')('all_min1'))

                 

               return $budget ? $budget.admin1name : $filter('translate')('no_selection')+'!';



             }else{

                 selected = $filter('filter')( $scope.project.lists.target_locations_departamentos2,  {admin1name: $budget.admin1name}, true);

                 if( selected.length ) {


                      $budget.admin1name = selected[0].admin1name;
                      $budget.admin1pcode = selected[0].admin1pcode;
                      $budget.admin1lat = selected[0].admin1lat;
                      $budget.admin1lng = selected[0].admin1lng;

                     var antes = $filter('filter')($scope.project.lists.target_locations_municipios2,{admin1name:$budget.admin1name},true);

                      $scope.project.lists.target_locations_municipios = [... new Set(antes.map(data => data.admin2name))];

                      $scope.project.lists.target_locations_municipios.unshift($filter('translate')('all_min1'))

                }          

                return selected.length ? selected[0].admin1name : $filter('translate')('no_selection')+'!';


             }
         }


         
        },

        //select municipio FOR COLOMBIA

        municipio: function( $data, $budget ) {


          var selected = [];
          $budget.admin2name = $data;

          if( $budget.admin2name ) {

            if($budget.admin2name == 'All' || $budget.admin2name == 'Todos'){

               $budget.admin2name = $filter('translate')('all_min1');
              $budget.admin2pcode = $filter('translate')('all_min1');
              $budget.admin2lat = $budget.admin1lat;
              $budget.admin2lng = $budget.admin1lng;

              return $budget ? $budget.admin2name : $filter('translate')('no_selection')+'!';

            }else{

              selected = $filter('filter')( $scope.project.lists.target_locations_municipios2,  {admin2name: $budget.admin2name} , true);
         
            if( selected.length ) {

              $budget.admin2name = selected[0].admin2name;
              $budget.admin2pcode = selected[0].admin2pcode;
              $budget.admin2lat = selected[0].admin2lat;
              $budget.admin2lng = selected[0].admin2lng;


            }
            return selected.length ? selected[0].admin2name : $filter('translate')('no_selection')+'!';


           }

           
          }


        },

        

        //activitydesciption
        showActivityDescription: function( $data, $budget ) {

          var selected = [];
          $budget.activity_description_id = $data;

          if( $budget.activity_description_id ) {

            selected = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_description_id: $budget.activity_description_id }, true);
            if( selected.length ) {
              
              $budget.activity_description_name = selected[0].activity_description_name;
            }
            
          } 


          return selected.length ? selected[0].activity_description_name : $filter('translate')('no_selection')+'!';
        },

        // currency
        showCurrency: function( $data, $budget ) {
          var selected = [];
          $budget.currency_id = $data;
          if( $budget.currency_id ) {
            selected = $filter('filter')( $scope.project.lists.currencies, { currency_id: $budget.currency_id }, true);
            if( selected.length ) {
              $budget.currency_name = selected[0].currency_name;
            }
          } 
          return selected.length ? selected[0].currency_name : $filter('translate')('no_selection')+'!';
        },

        // show in fts
        showFunds: function( $data, $budget ) {
          var selected = [];
          $budget.budget_funds_id = $data; 

          // default
          if($scope.project.definition.admin0pcode == 'COL'){
           
          }
          else{
            if( !$budget.reported_on_fts_id ){
            
              $budget.budget_funds_id = 'financial';
              $budget.budget_funds_name = $filter('translate')('financial');
              }

          }
          

          // selection
          if( $budget.budget_funds_id ) {
            selected = $filter('filter')( $scope.project.lists.budget_funds, { budget_funds_id: $budget.budget_funds_id }, true);
            if( selected.length ) {
              $budget.budget_funds_id = selected[0].budget_funds_id;
              $budget.budget_funds_name = selected[0].budget_funds_name;
            }
          } 

          return selected.length ? selected[0].budget_funds_name : 'N/A';
        },

        // show fts Id label
        showProgrammingLabel: function(){
          // budget progress
          var show = false;
          angular.forEach( $scope.project.definition.project_budget_progress, function( d, i ){
            if ( d.budget_funds_id === 'financial') {
              show = true;
            }
          });
          return show;
        },
				showProgrammingField:function(budget){
					if (budget.budget_funds_id === 'financial'){
						return true;
					}
					return false;
				},
        // show in fts
        showProgramming: function( $data, $budget ) {
          var selected = [];
          $budget.financial_programming_id = $data;

          // default
          if( !$budget.reported_on_fts_id ){
            $budget.financial_programming_id = 'non_cash';
            $budget.financial_programming_name = $filter('translate')('non_cash');
          }

          // selection
          if( $budget.financial_programming_id ) {
            selected = $filter('filter')( $scope.project.lists.financial_programming, { financial_programming_id: $budget.financial_programming_id }, true);
            if( selected.length ) {
              $budget.financial_programming_id = selected[0].financial_programming_id;
              $budget.financial_programming_name = selected[0].financial_programming_name;
            }
          } 
          return selected.length ? selected[0].financial_programming_name : 'N/A';
        },

        // funding 2017
        showFunding2017: function(){
          var show = false;
          angular.forEach( $scope.project.definition.project_budget_progress, function( d, i ){
            if ( d.multi_year_funding_id === 'yes') {
              show = true;
            }
          });
          return show;
        },
				
				//multi year funding
				showMultiYearFunding:function(){
					var show = false;
					$scope.multiYearRange=[];
					angular.forEach($scope.project.definition.project_budget_progress, function (d, i) {
						if (d.multi_year_funding_id === 'yes') {
              show = true;
            }
          });

					// to set range multi year
					if(show){
						var start_year = moment($scope.project.definition.project_start_date).year(); 
								end_year   = moment($scope.project.definition.project_end_date).year();
						if(end_year % start_year > 0){
							for (let index = start_year; index <= end_year; index++) {
								$scope.multiYearRange.push(index)								
							}
						}else{
							$scope.multiYearRange.push(end_year)
						}
					};
          return show;
				},
				showMultiYearFundingField:function(budget){
					if(budget.multi_year_funding_id === 'yes'){
						var start_year = moment($scope.project.definition.project_start_date).year();
						end_year = moment($scope.project.definition.project_end_date).year();
						if (!budget.multi_year_array || budget.multi_year_array.length<1){
							budget.multi_year_array =[];
							if (end_year % start_year > 0) {
								for (let index = start_year; index <= end_year; index++) {							
									budget.multi_year_array.push({ year: index, budget: 0 })
								}
							} else {
								budget.multi_year_array.push({year:end_year, budget:0})
							}
						}
						return true;
					}else{
						return false;
					}

				},

        // show in fts
        showMultiYear: function( $data, $budget ) {
          var selected = [];
          $budget.multi_year_funding_id = $data;

          // default
          if( !$budget.multi_year_funding_id ){
            $budget.multi_year_funding_id = 'no';
            $budget.multi_year_funding_name = 'No';
          }

          // selection
          if( $budget.multi_year_funding_id ) {
            selected = $filter('filter')( $scope.project.lists.multi_year_funding, { multi_year_funding_id: $budget.multi_year_funding_id }, true);
            if( selected.length ) {
              $budget.multi_year_funding_id = selected[0].multi_year_funding_id;
              $budget.multi_year_funding_name = selected[0].multi_year_funding_name;
            }
          } 

          // multi-year set 
          if ( $budget.multi_year_funding_id === 'no' ) {
						$budget.funding_2017 = $budget.project_budget;
						delete $budget.funding_year ;
          }

          return selected.length ? selected[0].multi_year_funding_name : 'N/A';
        },

        // show fts Id label
        showFtsIdLabel: function(){
          // budget progress
          var show = false;
          angular.forEach( $scope.project.definition.project_budget_progress, function( d, i ){
            if ( d.reported_on_fts_id === 'yes') {
              show = true;
            }
          });
          return show;
				},
				showFtsIdLabelField: function (budget) {
					if (budget.reported_on_fts_id === 'yes') {
						return true;
					}
					return false;
					
				},

        // show in fts
        showOnFts: function( $data, $budget ) {
          var selected = [];
          $budget.reported_on_fts_id = $data;

          // default
          if( !$budget.reported_on_fts_id ){
            $budget.reported_on_fts_id = 'no';
            $budget.reported_on_fts_name = 'No';
          }

          // selection
          if( $budget.reported_on_fts_id ) {
            selected = $filter('filter')( $scope.project.lists.reported_on_fts, { reported_on_fts_id: $budget.reported_on_fts_id }, true);
            if( selected.length ) {
              $budget.reported_on_fts_id = selected[0].reported_on_fts_id;
              $budget.reported_on_fts_name = selected[0].reported_on_fts_name;
            }
          }
          return selected.length ? selected[0].reported_on_fts_name : 'N/A';
        },
        // add beneficiary
        addBudgetItem: function() {
          
          // inserted
          $scope.inserted = {
            project_budget_amount_recieved: 0,
            project_budget_date_recieved: moment().format('YYYY-MM-DD'),
            comments: ''
          };

          // default donor
          if( $scope.project.definition.project_donor.length===1 ){
            $scope.inserted.project_donor_id = $scope.project.definition.project_donor[0].project_donor_id;
            $scope.inserted.project_donor_name = $scope.project.definition.project_donor[0].project_donor_name;
          }

          // clone
          var length = $scope.project.definition.project_budget_progress.length;
          if ( length ) {
            var b = angular.copy( $scope.project.definition.project_budget_progress[ length - 1 ] );
            delete b.id;
						delete b.multi_year_array;
            $scope.inserted = angular.merge( b, $scope.inserted );
          }

          // push
					$scope.project.definition.project_budget_progress.push( $scope.inserted );
					$scope.detailFinancial[$scope.project.definition.project_budget_progress.length-1] = true;
        },

        addBudgetItemFromFile:function(budget,index){
         
          $scope.project.definition.project_budget_progress.push(budget);
          $scope.detailFinancial[$scope.project.definition.project_budget_progress.length - 1] = true;

          $scope.messageFromfile[index] = ngmClusterFinancial.validateBudgetFromFile(budget, ($scope.project.definition.project_budget_progress.length - 1), $scope.detailFinancial);

          if (budget.multi_year_array && budget.multi_year_array.length && budget.multi_year_funding_id === 'yes'){
            
            var start_year = moment($scope.project.definition.project_start_date).year();
            end_year = moment($scope.project.definition.project_end_date).year();
            var years = []
            if (end_year % start_year > 0) {
              for (let index = start_year; index <= end_year; index++) {
                years.push(index)
              }
            } else {
              years.push(end_year)
            }
            var temp_array = [] 
            angular.forEach(budget.multi_year_array,function(e,i){
              indexYear = years.findIndex(x => x=== e.year);
              if(indexYear >0){
                temp_array.push(e)
              }else{
                $scope.messageFromfile[index].push({ label: false, property: 'multi_year_array', reason: 'Year(' + e.year + ') not  match with  this project year(start:' + start_year + ', end: ' + end_year+')'})
              }
            })
            budget.multi_year_array = temp_array;
          }

          if (!budget.multi_year_array && budget.multi_year_funding_id === 'yes'){
            $scope.messageFromfile[index].push({ label: false, property: 'multi_year_array', reason: 'Missing value '})
          }
          

        },

        // remove notification
        removeBudgetModal: function( $index ) {
          $scope.project.budgetIndex = $index;
          // open confirmation modal
          // $( '#budget-modal' ).openModal({ dismissible: false });
          $('#budget-modal').modal({ dismissible: false });
          $('#budget-modal').modal('open');
        },

        // remove budget item
        removeBudgetItem: function() {
          // id
          var id = $scope.project.definition.project_budget_progress[ $scope.project.budgetIndex ].id;
          // splice
          $scope.project.definition.project_budget_progress.splice( $scope.project.budgetIndex, 1 );
          // remove 
          $http({
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/project/removeBudgetItem',
            data: {
              id: id
            }
          }).success( function( project ){
            // on success
            // Materialize.toast( $filter('translate')('project_budget_item_removed')+'!', 3000, 'success');
            M.toast({ html: $filter('translate')('project_budget_item_removed') + '!', displayLength: 3000, classes: 'success' });
          }).error(function( err ) {
            // update
            // Materialize.toast( 'Error!', 6000, 'error' );
            M.toast({ html: 'Error', displayLength: 6000, classes: 'error' });
          });
        },

        save: function(){
          $scope.project.isSaving = true;
          M.toast({ html: 'Saving...', displayLength: 3000, classes: 'note' });
					// Update Project
          ngmData.get({
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){
            
            // set project definition
						$scope.project.definition = project;

            // on success
            // Materialize.toast( $filter('translate')('project_budget_item_added')+'!', 3000, 'success');
            $timeout(function(){
              M.toast({ html: $filter('translate')('project_budget_item_added') + '!', displayLength: 3000, classes: 'success' });
              $scope.project.isSaving = false;
            },2000);
          });          
				},
				
				openCloseDetailFinancial: function ($index) {
					$scope.detailFinancial[$index] = !$scope.detailFinancial[$index];
				},
				validateFinancialDetailsForm:function(){
					if(ngmClusterFinancial.validateBudgets($scope.project.definition.project_budget_progress, $scope.detailFinancial)){
						$scope.project.save()
					}
        },
        // upload file monthly report
        uploadFileReport: {
          openModal: function (modal) {
            // $('#' + modal).openModal({ dismissible: false });
            $('#' + modal).modal({ dismissible: false });
            $('#' + modal).modal('open');
          },
          closeModal: function (modal) {
            drop_zone.removeAllFiles(true);
            M.toast({ html: $filter('translate')('cancel_to_upload_file'), displayLength: 2000, classes: 'note' });
          },
          uploadFileConfig: {
            previewTemplate: ngmClusterImportFile.templatePreview(),
            completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">' + $filter('translate')('complete') + '</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
            acceptedFiles: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
            maxFiles: 1,
            parallelUploads: 1,
            url: ngmAuth.LOCATION + '/api/uploadGDrive',
            dictDefaultMessage:
              `<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please upload file with extention .csv or xlxs !',
            notSupportedFile: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + $filter('translate')('not_supported_file_type') + ' ',
            errorMessage: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Error`,
            addRemoveLinks: false,
            autoProcessQueue: false,
            init: function () {
              drop_zone = this;
              // upload_file and delete_file is ID for button upload and cancel
              $("#upload_file").attr("disabled", true);
              $("#delete_file").attr("disabled", true);

              document.getElementById('upload_file').addEventListener("click", function () {
                $("#upload_file").attr("disabled", true);
                $("#delete_file").attr("disabled", true);
                $("#switch_btn_file").attr("disabled", true);
                var ext = drop_zone.getAcceptedFiles()[0].name.split('.').pop();
                attribute_headers_obj = ngmClusterImportFile.listheaderAttributeInFile('financial');//$scope.project.uploadFileReport.obj_header;
                if (ext === 'csv') {
                  var file = drop_zone.getAcceptedFiles()[0],
                    read = new FileReader();

                  read.readAsBinaryString(file);

                  read.onloadend = function () {
                    var csv_string = read.result
                    csv_array = Papa.parse(csv_string).data;
                    if (csv_array[0].indexOf('Activity Type') < 0) {
                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      $scope.project.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                      $timeout(function () {
                        $('#upload-monthly-file-financial').modal('close');
                        document.querySelector(".dz-default.dz-message").style.display = 'block';
                        document.querySelector(".percent-upload").style.display = 'none';
                        $('#message-monthly-file-financial').modal({ dismissible: false });
                        $('#message-monthly-file-financial').modal('open');
                        $("#switch_btn_file").attr("disabled", false);
                      }, 1000)
                      return
                    };
                    var values = [];
                    values_obj = [];
                    // get value and change to object
                    values_obj = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);
                    // map the header to the attribute name
                    for (var index = 0; index < values_obj.length; index++) {
                      obj_true = {};
                      angular.forEach(values_obj[index], function (value, key) {

                        atribute_name = attribute_headers_obj[key];
                        obj_true[atribute_name] = value;

                      })
                      obj_true = $scope.project.addMissingAttributeFromFile(obj_true);
                      values.push(obj_true);
                    }
                    
                    if (values.length > 0) {
                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      var count_error = 0;
                      for (var x = 0; x < values.length; x++) {
                        
                        if ((!values[x].project_donor_id) || (!values[x].activity_type_id)) {
                          
                          if (!$scope.messageFromfile[x]) {
                            $scope.messageFromfile[x] = []
                          }
                          obj = {}
                          if (!values[x].project_donor_id) {
                            obj = { label: false, property: 'project_donor_id', reason: 'Missing Value' }
                            if (values[x].project_donor_name){
                              obj.reason = values[x].project_donor_name + ' (Not In List)';
                            }
                            $scope.messageFromfile[x].push(obj)
                          }
                          if (!values[x].activity_type_id) {
                            obj = { label: false, property: 'activity_type_id', reason: 'Missing Value' }
                            if (values[x].activity_type_name){
                              obj.reason = values[x].activity_type_name +' (Not In List)'
                            }
                            $scope.messageFromfile[x].push(obj)
                          }
                          count_error += 1;

                        } else {
                          $scope.project.addBudgetItemFromFile( values[x], x);
                        }
                      }

                    }

                    $timeout(function () {
                      document.querySelector(".percent-upload").style.display = 'none';
                      $('#upload-monthly-file-financial').modal('close');
                      drop_zone.removeAllFiles(true);
                      

                      var message_temp = '';

                      message_temp = ngmClusterImportFile.setMessageFromFile($scope.messageFromfile, ngmClusterFinancial.fieldBudget(), 'financial', 'message-monthly-file-financial')
                      if (message_temp !== '') {

                        $scope.project.messageWarning = message_temp;
                        $timeout(function () {
                          $('#message-monthly-file-financial').modal({ dismissible: false });
                          $('#message-monthly-file-financial').modal('open');
                        })

                      }
                      // perlu diperbaiki
                      if (count_error > 0 || values.length < 1) {
                        if ((count_error === values.length) || (values.length < 1)) {
                          M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                        } else {
                          var info = $filter('translate')('save_to_apply_changes');
                          M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                          M.toast({ html: info, displayLength: 4000, classes: 'note' });
                        }

                      } else {
                        var info = $filter('translate')('save_to_apply_changes');
                        M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                        M.toast({ html: info, displayLength: 4000, classes: 'note' });
                      }


                      // reset error message
                      $scope.messageFromfile = [];
                      $("#upload_file").attr("disabled", true);
                      $("#delete_file").attr("disabled", true);
                      $("#switch_btn_file").attr("disabled", false);
                    }, 2000)
                  }


                } else {
                  file = drop_zone.getAcceptedFiles()[0]
                  const wb = new ExcelJS.Workbook();
                  drop_zone.getAcceptedFiles()[0].arrayBuffer().then((data) => {
                    var result = []
                    wb.xlsx.load(data).then(workbook => {
                      const book = [];
                      var book_obj = [];

                      workbook.eachSheet((sheet, index) => {
                        // get only the first sheet
                        if (index === 1) {
                          const sh = [];
                          sheet.eachRow(row => {
                            sh.push(row.values);
                          });
                          book.push(sh);
                        }
                      });

                      if (book[0][0].indexOf('Activity Type') < 0) {
                        var previews = document.querySelectorAll(".dz-preview");
                        previews.forEach(function (preview) {
                          preview.style.display = 'none';
                        })
                        document.querySelector(".dz-default.dz-message").style.display = 'none';
                        document.querySelector(".percent-upload").style.display = 'block';
                        $scope.project.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                        $timeout(function () {
                          $('#upload-monthly-file-financial').modal('close');
                          document.querySelector(".dz-default.dz-message").style.display = 'block';
                          document.querySelector(".percent-upload").style.display = 'none';
                          $('#message-monthly-file-financial').modal({ dismissible: false });
                          $('#message-monthly-file-financial').modal('open');
                        }, 1000)
                        return
                      };
                      // get value and change to object
                      book_obj = ngmClusterImportFile.setExcelValueToArrayofObject(book);
                      // map the header to the attribute name
                      for (var index = 0; index < book_obj.length; index++) {
                        obj_true = {};
                        angular.forEach(book_obj[index], function (value, key) {

                          atribute_name = attribute_headers_obj[key];
                          obj_true[atribute_name] = value;

                        })
                        obj_true = $scope.project.addMissingAttributeFromFile(obj_true);
                        result.push(obj_true);
                      }

                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      // $scope.answer = result;
                      if (result.length > 0) {
                        var count_error = 0
                        for (var x = 0; x < result.length; x++) {

                          if ((!result[x].project_donor_id) || (!result[x].activity_type_id)) {

                            if (!$scope.messageFromfile[x]) {
                              $scope.messageFromfile[x] = []
                            }
                            obj = {}
                            if (!result[x].project_donor_id) {
                              obj = { label: false, property: 'project_donor_id', reason: 'Missing Value' }
                              if (result[x].project_donor_name) {
                                obj.reason = result[x].project_donor_name + ' (Not In List)';
                              }
                              $scope.messageFromfile[x].push(obj)
                            }
                            if (!result[x].activity_type_id) {
                              obj = { label: false, property: 'activity_type_id', reason: 'Missing Value' }
                              if (result[x].activity_type_name) {
                                obj.reason = result[x].activity_type_name + ' (Not In List)'
                              }
                              $scope.messageFromfile[x].push(obj)
                            }
                            count_error += 1;

                          } else {
                            $scope.project.addBudgetItemFromFile(result[x], x);
                          }
                        }
                      }
                      $timeout(function () {
                        document.querySelector(".percent-upload").style.display = 'none';
                        $('#upload-monthly-file-financial').modal('close');
                        drop_zone.removeAllFiles(true);
                        

                        var message_temp = '';


                        message_temp = ngmClusterImportFile.setMessageFromFile($scope.messageFromfile, ngmClusterFinancial.fieldBudget(), 'financial', 'message-monthly-file-financial')

                        if (message_temp !== '') {

                          $scope.project.messageWarning = message_temp;

                          $timeout(function () {
                            $('#message-monthly-file-financial').modal({ dismissible: false });
                            $('#message-monthly-file-financial').modal('open');
                          })

                        }
                        // perlu diperbaiki
                        if (count_error > 0 || result.length < 1) {
                          if ((count_error === result.length) || (result.length < 1)) {
                            M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                          } else {
                            var info = $filter('translate')('save_to_apply_changes');
                            M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                            M.toast({ html: info, displayLength: 4000, classes: 'note' });
                          }

                        } else {
                          var info = $filter('translate')('save_to_apply_changes');
                          M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                          M.toast({ html: info, displayLength: 4000, classes: 'note' });
                        }
                        // reset error message
                        $scope.messageFromfile = [];
                        $("#upload_file").attr("disabled", true);
                        $("#delete_file").attr("disabled", true);
                        $("#switch_btn_file").attr("disabled", false);
                      }, 2000)

                    })
                  })
                }
              });

              document.getElementById('delete_file').addEventListener("click", function () {
                drop_zone.removeAllFiles(true);
              });

              // when add file
              drop_zone.on("addedfile", function (file) {

                document.querySelector(".dz-default.dz-message").style.display = 'none';
                var ext = file.name.split('.').pop();
                //change preview if not image/*
                $(file.previewElement).find(".dz-image img").attr("src", "images/elsedoc.png");
                $("#upload_file").attr("disabled", false);
                $("#delete_file").attr("disabled", false);

              });

              // when remove file
              drop_zone.on("removedfile", function (file) {

                if (drop_zone.files.length < 1) {
                  // upload_file and delete_file is ID for button upload and cancel
                  $("#upload_file").attr("disabled", true);
                  $("#delete_file").attr("disabled", true);

                  document.querySelector(".dz-default.dz-message").style.display = 'block';
                  $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please upload file with extention .csv or xlxs !');
                }

                if ((drop_zone.files.length < 2) && (drop_zone.files.length > 0)) {
                  document.querySelector(".dz-default.dz-message").style.display = 'none';
                  $("#upload_file").attr("disabled", false);
                  $("#delete_file").attr("disabled", false);
                  document.getElementById("upload_file").style.pointerEvents = "auto";
                  document.getElementById("delete_file").style.pointerEvents = "auto";

                }
              });

              drop_zone.on("maxfilesexceeded", function (file) {
                document.querySelector(".dz-default.dz-message").style.display = 'none';
                $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + 'Please, import just one file at the time and remove exceeded file');
                document.querySelector(".dz-default.dz-message").style.display = 'block'
                // Materialize.toast("Too many file to upload", 6000, "error")
                M.toast({ html: "Too many file to upload", displayLength: 2000, classes: 'error' });
                $("#upload_file").attr("disabled", true);
                document.getElementById("upload_file").style.pointerEvents = "none";
                $("#delete_file").attr("disabled", true);
                document.getElementById("delete_file").style.pointerEvents = "none";
              });

              // reset
              this.on("reset", function () {
                // upload_file and delete_file is ID for button upload and cancel
                document.getElementById("upload_file").style.pointerEvents = 'auto';
                document.getElementById("delete_file").style.pointerEvents = 'auto';
              });
            },

          },
          uploadText: function () {

            document.querySelector("#ngm-input-string").style.display = 'none';
            document.querySelector(".percent-upload").style.display = 'block';
            $("#input_string").attr("disabled", true);
            $("#close_input_string").attr("disabled", true);
            $("#switch_btn_text").attr("disabled", true);
            attribute_headers_obj = ngmClusterImportFile.listheaderAttributeInFile('financial');//$scope.project.uploadFileReport.obj_header;
            if ($scope.project.text_input) {
              csv_array = Papa.parse($scope.project.text_input).data;
              if (csv_array[0].indexOf('Activity Type') < 0) {


                $timeout(function () {
                  $scope.project.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                  $('#upload-monthly-file-financial').modal('close');
                  document.querySelector("#ngm-input-string").style.display = 'block';
                  document.querySelector(".percent-upload").style.display = 'none';
                  $('#message-monthly-file-financial').modal({ dismissible: false });
                  $('#message-monthly-file-financial').modal('open');
                  $scope.project.text_input = '';
                  document.querySelector("#input-string-area").style.display = 'block';
                  $scope.inputString = false;
                }, 1000)
                return
              };
              var values = [];
              values_obj = [];
              values_obj = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);
              // map the header to the attribute name
              for (var index = 0; index < values_obj.length; index++) {
                obj_true = {};
                angular.forEach(values_obj[index], function (value, key) {

                  atribute_name = attribute_headers_obj[key];
                  obj_true[atribute_name] = value;

                })
                obj_true = $scope.project.addMissingAttributeFromFile(obj_true);
                values.push(obj_true);
              }

              if (values.length > 0) {

                var count_error = 0;
                for (var x = 0; x < values.length; x++) {
                  if ((!values[x].project_donor_id) || (!values[x].activity_type_id) ) {
                    if (!$scope.messageFromfile[x]) {
                      $scope.messageFromfile[x] = []
                    }
                    obj = {}
                    if (!values[x].project_donor_id) {
                      obj = { label: false, property: 'project_donor_id', reason: 'Missing Value' }
                      if (values[x].project_donor_name) {
                        obj.reason = values[x].project_donor_name + ' (Not In List)';
                      }
                      $scope.messageFromfile[x].push(obj)
                    }
                    if (!values[x].activity_type_id) {
                      obj = { label: false, property: 'activity_type_id', reason: 'Missing Value' }
                      if (values[x].activity_type_name) {
                        obj.reason = values[x].activity_type_name + ' (Not In List)'
                      }
                      $scope.messageFromfile[x].push(obj)
                    }
                    count_error += 1;

                  } else {
                    $scope.project.addBudgetItemFromFile(values[x], x);
                  }
                }

              }

              var message_temp = '';

              message_temp = ngmClusterImportFile.setMessageFromFile($scope.messageFromfile, ngmClusterFinancial.fieldBudget(), 'financial', 'message-monthly-file-financial')
              $timeout(function () {
                document.querySelector("#ngm-input-string").style.display = 'block';
                document.querySelector(".percent-upload").style.display = 'none';
                $('#upload-monthly-file-financial').modal('close');
                $scope.project.text_input = '';

                

               

                if (message_temp !== '') {

                  $scope.project.messageWarning = message_temp;
                  $timeout(function () {
                    $('#message-monthly-file-financial').modal({ dismissible: false });
                    $('#message-monthly-file-financial').modal('open');
                  })

                }
                // perlu diperbaiki
                if (count_error > 0 || values.length < 1) {
                  if ((count_error === values.length) || (values.length < 1)) {
                    M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                  } else {
                    var info = $filter('translate')('save_to_apply_changes');
                    M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                    M.toast({ html: info, displayLength: 4000, classes: 'note' });
                  }

                } else {
                  var info = $filter('translate')('save_to_apply_changes');
                  M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                  M.toast({ html: info, displayLength: 4000, classes: 'note' });
                }


                document.querySelector("#input-string-area").style.display = 'block';
              }, 2000)



            } else {
              $timeout(function () {
                document.querySelector("#ngm-input-string").style.display = 'block';
                document.querySelector(".percent-upload").style.display = 'none';
                $("#close_input_string").attr("disabled", false);
                $("#input_string").attr("disabled", false);
                $("#switch_btn_text").attr("disabled", false);
                M.toast({ html: 'Please Type something!', displayLength: 2000, classes: 'success' });
              }, 2000)

            }
            // reset error message
            $scope.messageFromfile = [];
          }

        },
        addMissingAttributeFromFile: function (obj) {
          // donor
          if (obj.project_donor_name){
            selected_donor = $filter('filter')($scope.project.definition.project_donor, { project_donor_name: obj.project_donor_name},true);
            if(selected_donor.length){
              obj.project_donor_id = selected_donor[0].project_donor_id;
            }
          }
          // activity type
          if (obj.activity_type_name){
            selected_act = $filter('filter')($scope.project.lists.activity_type,{ activity_type_name: obj.activity_type_name},true);
            if(selected_act.length){
              obj.activity_type_id = selected_act[0].activity_type_id;
              obj.cluster_id = selected_act[0].cluster_id;
            }
          }

          if(obj.activity_description_name){
            selected_desc = $filter('filter')($scope.project.lists.activity_descriptions, { activity_description_name: $budget.activity_description_name }, true);
            if (selected_desc.length) {
              $budget.activity_description_id = selected[0].activity_description_id;
            }
          }

          if (obj.currency_id){
            selected_currency = $filter('filter')($scope.project.lists.currencies, { currency_id: obj.currency_id},true);
            if(selected_currency.length){
              obj.currency_name = selected_currency[0].currency_name;
            }
          }

          if (obj.budget_funds_name){
            selected_budget = $filter('filter')($scope.project.lists.budget_funds, { budget_funds_name: obj.budget_funds_name }, true);
            if(selected_budget.length){
              obj.budget_funds_id = selected_budget[0].budget_funds_id;
            }
          }

          if (obj.multi_year_funding_name){
            selected_multiyear = $filter('filter')($scope.project.lists.multi_year_funding, { multi_year_funding_name: obj.multi_year_funding_name }, true);
            if(selected_multiyear.length){
              obj.multi_year_funding_id = selected_multiyear[0].multi_year_funding_id;
            }

            if (obj.multi_year_array && obj.multi_year_funding_id === 'yes') {
              
              obj.multi_year_array = obj.multi_year_array.split(',').map(function (y_a) {
                y_a.trim();
                y_a = y_a.split(':')
                var year_value = y_a[0].trim() === 'n/a' ? 0 : parseInt(y_a[0].trim());
                var budget_value = y_a[1].trim() === 'n/a' ? 0 : parseInt(y_a[1].trim());
                year_budget = {
                  year:year_value,
                  budget:budget_value
                }
                return year_budget;

              });
            }
          }

          if (obj.reported_on_fts_name){
            selected_ftsname = $filter('filter')($scope.project.lists.reported_on_fts, { reported_on_fts_name: obj.reported_on_fts_name }, true);
            if(selected_ftsname){
              obj.reported_on_fts_id = selected_ftsname[0].reported_on_fts_id;
            }
          }

          if (obj.financial_programming_name){
            selected_programing_name = $filter('filter')($scope.project.lists.financial_programming, { financial_programming_name: obj.financial_programming_name }, true);
            if (selected_programing_name.length){
              obj.financial_programming_id = selected_programing_name[0].financial_programming_id;
            }
          }

          return obj

        },
        switchInputFile: function () {
          $scope.inputString = !$scope.inputString;
          $scope.project.messageWarning = '';
        },

      }


      // if one donor
      $timeout(function(){

        // add ALL to activity_type
        $scope.project.lists.activity_type.unshift({
          cluster_id: $scope.project.definition.cluster_id,
          cluster: $scope.project.definition.cluster,
          activity_type_id: 'all',
          activity_type_name: $filter('translate')('all_activities')
        });

        //add all to departamentos and municipios COL
        $scope.project.lists.target_locations_departamentos.unshift(
          $filter('translate')('all_min1')

        );
       
        $scope.project.lists.target_locations_municipios.unshift(
          $filter('translate')('all_min1')

        );
       


      }, 0 );

  }

]);

