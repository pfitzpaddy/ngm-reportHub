/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportCtrl
 * @description
 * # ClusterProjectFormReportCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.report', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.report', {
        title: 'Cluster Reports Form',
        description: 'Cluster Reports Form',
        controller: 'ClusterProjectFormReportCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/report/form.html'
      });
  })
  .controller( 'ClusterProjectFormReportCtrl', [
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
    'ngmClusterLocations',
    'ngmClusterBeneficiaries',
    'ngmClusterTrainings',
    'ngmClusterValidation',
    'ngmClusterHelperAf',
    'ngmClusterHelperNgWash',
    'ngmClusterHelperNgWashLists',
    'ngmClusterHelperNgWashValidation',
    'config',
    function( 
      $scope,
      $location,
      $timeout,
      $filter,
      $q,
      $http,
      $route,
      ngmUser,
      ngmAuth,
      ngmData,
      ngmClusterHelper,
      ngmClusterLists,
      ngmClusterLocations,
      ngmClusterBeneficiaries,
      ngmClusterTrainings,
      ngmClusterValidation,
      ngmClusterHelperAf,
      ngmClusterHelperNgWash,
      ngmClusterHelperNgWashLists,
      ngmClusterHelperNgWashValidation,
      config ){


      /**** TRAINING SERVICE ****/

      // link for ngmClusterTrainings service directly into the template
        // this should be a directive - sorry Steve Jobs!
      $scope.scope = $scope;
      $scope.ngmClusterLists = ngmClusterLists;
      $scope.ngmClusterLocations = ngmClusterLocations;
      $scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
      $scope.ngmClusterTrainings = ngmClusterTrainings;
      $scope.ngmClusterValidation = ngmClusterValidation;
      $scope.ngmClusterHelperNgWash = ngmClusterHelperNgWash;
      $scope.ngmClusterHelperNgWashLists = ngmClusterHelperNgWashLists;
			$scope.ngmClusterHelperNgWashValidation = ngmClusterHelperNgWashValidation;
			$scope.deactivedCopybutton =false;

      // project
      $scope.project = {

        // defaults
        user: ngmUser.get(),
        style: config.style,
        definition: config.project,
        // canEdit: ngmAuth.canDoPlain('EDIT', config.project.adminRpcode, config.project.admin0pcode, config.project.cluster_id, config.project.organization_tag),
        // canEdit: ngmAuth.canDo('EDIT',  config.report),
        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.project.adminRpcode, admin0pcode:config.project.admin0pcode, cluster_id: config.project.cluster_id, organization_tag:config.project.organization_tag } ),
        report: config.report,
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        monthlyTitleFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMMM, YYYY'),
				monthNameFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMM'),
				previousMonth: moment.utc([config.report.report_year, config.report.report_month, 1]).subtract(1,'month').format("MMMM, YYYY"),

        // lists ( project, mpc transfers )
        lists: ngmClusterLists.setLists( config.project, 10 ),

        
        /**** TEMPLATES ****/

        // url
        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        // templates
        locationsUrl: 'location/locations.html',
        addLocationUrl: 'location/add.location.html',
        beneficiariesTrainingUrl: 'beneficiaries/2016/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
        template_distribution_date: 'beneficiaries/ET/distribution_date.html',
        template_partial_kits: 'beneficiaries/ET/partial_kits.html',
        template_kit_details: 'beneficiaries/ET/kit_details.html',
        notesUrl: 'notes.html',

        // init lists
        init: function() {
          // usd default currency
          if( !$scope.project.definition.project_budget_currency ){
            $scope.project.definition.project_budget_currency = 'usd';
          }
          // set org users
          ngmClusterLists.setOrganizationUsersList( $scope.project.lists, config.project );
          // set form on page load
          ngmClusterHelper.setForm( $scope.project.definition, $scope.project.lists );
          // set columns / rows
          ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.definition.locations );
        },
        
        // beneficairies template
        beneficiariesUrl: function() {
          var template;
          if ( $scope.project.report.report_year === 2016 ) {
            template = 'beneficiaries/2016/beneficiaries.html';
          } else if ( $scope.project.report.admin0pcode === 'NG' ) {
            template ='beneficiaries/NG/beneficiaries.html';
          } else {
            template ='beneficiaries/beneficiaries.html';
          }
          return template;
        },
        
        // cancel monthly report
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
          }, 400);
        },

        // save form on enter
        keydownSaveForm: function(){
          $timeout(function(){
            $('.editable-input').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // update inidcators ( place into array on update )
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.project.report.locations[ $parent ].beneficiaries[ $index ][ indicator ] = $data;
        },


        /**** Afghanistan ****/

        reportingYear: function(){
          return moment().subtract(1,'M').year();
        },

        // preps for 2018 #TODO delete
        categoryShow2017: function(){
          return moment()<moment('2018-02-01')
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.project.cancel();
          }
        },

        // injury sustained same province as field hospital
        showFatpTreatmentSameProvince: function( $locationIndex ){
          return ngmClusterHelperAf.showFatpTreatmentSameProvince( $scope.project.report.locations[ $locationIndex ].beneficiaries )
        },

        // treatment same province
        showTreatmentSameProvince: function ( $data, $beneficiary ) {
          return ngmClusterHelperAf.showTreatmentSameProvince( $data, $beneficiary );
        },



        /**** BENEFICIARIES ****/

        // add beneficiary
        addBeneficiary: function( $parent, defaults ) {
          $scope.inserted = ngmClusterBeneficiaries.addBeneficiary( $scope.project.report.locations[ $parent ].beneficiaries, defaults );
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
          // set columns / rows display
          ngmClusterBeneficiaries.setBeneficiariesFormTargets( $scope.project.lists, $parent, $scope.inserted, $scope.project.report.locations[ $parent ].beneficiaries.length-1 );
        },

        // add beneficiary
        addNgWashBeneficiary: function( $parent ) {
          $scope.inserted = ngmClusterHelperNgWash.addBeneficiary( $scope.project.report.locations[ $parent ].beneficiaries );
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

				// remove beneficiary nodal
        removeBeneficiaryModal: function( $parent, $index ) {					
					if (!$scope.project.report.locations[$parent].beneficiaries[$index].id) {		
						$scope.project.report.locations[$parent].beneficiaries.splice($index, 1);
						$scope.project.activePrevReportButton();						
					} else{
						if ( ngmClusterBeneficiaries.beneficiaryFormComplete( $scope.project.definition, $scope.project.report.locations ) ){
								$scope.project.locationIndex = $parent;
								$scope.project.beneficiaryIndex = $index;
							$( '#beneficiary-modal' ).openModal({ dismissible: false });
						}
					} 
        },

        // remove beneficiary
        removeBeneficiary: function() {
          var id = $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries[ $scope.project.beneficiaryIndex ].id;
					$scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
					$scope.project.activePrevReportButton();
          ngmClusterBeneficiaries.removeBeneficiary( $scope.project, id );
        },


        
        /**** LOCATIONS ****/

        // project focal point
        showReporter: function( $data, target_location ){
          return ngmClusterLocations.showReporter( $scope.project.lists, $data, target_location )
        },

        // site implementation
        showSiteImplementation: function( $data, target_location ){
          return ngmClusterLocations.showSiteImplementation( $scope.project.lists, $data, target_location );
        },

        // showadmin
        showAdmin: function( parent_pcode, list, pcode, name, $index, $data, target_location ){
          return ngmClusterLocations.showAdmin( $scope.project.lists, parent_pcode, list, pcode, name, $index, $data, target_location );
        },

        // fetch lists
        getAdminSites: function( pcode, $index, $data, target_location ){
          ngmClusterLocations.getAdminSites( $scope.project.lists, $scope.project.definition.admin0pcode, pcode, $index, $data, target_location );
        },

        // on change
        adminOnChange: function( pcode, $index, $data, target_location ){
          $timeout(function() {
            ngmClusterLocations.adminOnChange( $scope.project.lists, pcode, $index, $data, target_location );
          }, 0 );
        },

        // site_type
        showSiteType: function( $index, $data, target_location ){
          return ngmClusterLocations.showSiteType( $scope.project.lists, $index, $data, target_location );
        },

        // select from list?
        showListYesNo: function( $index, $data, target_location ){
          return ngmClusterLocations.showListYesNo( $scope.project.lists, $index, $data, target_location );
        },

        // yes/no
        yesNoOnChange: function( target_location ){
          target_location.site_id = null ;
        },

        // show sites
        showAdminSites: function( $index, $data, target_location ){
          return ngmClusterLocations.showAdminSites( $scope.project.lists, $index, $data, target_location );
        },

        // site_name
        showSiteName: function( $data, target_location ){
          return ngmClusterLocations.showSiteName( $data, target_location );
        },


        
        /**** ACTIVITIES ****/

        // disable save form
        rowSaveDisabled: function( $data ){
          return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
        },

        // remove from array if no id
        cancelEdit: function( $parent, $index ) {
          if ( !$scope.project.report.locations[ $parent ].beneficiaries[ $index ].id ) {
						if (!$scope.project.report.locations[$parent].beneficiaries[$index].copy_prev_month){					
							 $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
						}
          }
        },

        // validate form ( ng wash )
        validateWashNgBeneficiariesForm: function( complete, display_modal ){
          if ( ngmClusterHelperNgWashValidation.validateActivities( $scope.project.report.locations ) ){
            if ( complete ) {
              $( '#complete-modal' ).openModal( { dismissible: false } );
            } else if ( display_modal ) {
              $( '#save-modal' ).openModal( { dismissible: false } );
            } else {
              $scope.project.save( false, false );
            }
          }
        },

        // validate form ( ng wash )
        validateBeneficiariesDetailsForm: function( rowform, complete, display_modal ){
          if ( ngmClusterValidation.validateDetails( rowform, $scope.project.report.locations ) ){
            if ( complete ) {
              $( '#complete-modal' ).openModal( { dismissible: false } );
            } else if ( display_modal ) {
              $( '#save-modal' ).openModal( { dismissible: false } );
            } else {
              $scope.project.save( false, false );
            }
          }
				},

				// process adding previous report data
				addPrevReport: function(prev_report){
					angular.forEach(prev_report.locations, function(l,i){

						var project_id=l.project_id ;site_id = l.site_id; site_name = l.site_name; admin1pcode = l.admin1pcode; admin2pcode = l.admin2pcode;

						var $loc = $scope.project.report.locations.find(function (l) {							
							return (l.site_id === site_id) && (l.project_id===project_id) && (l.site_name === site_name ) &&(l.admin1pcode===admin1pcode) && (l.admin2pcode === admin2pcode);
						})

						if($loc !== undefined){

							angular.forEach(l.beneficiaries, function (b,i) {					
								$scope.insertedBeneficiary = ngmClusterHelper.getCleanBeneficiaryforCopy(b,$loc,$scope.project.report);														
								$scope.project.report.locations.find(function (l) {		
									return (l.site_id === site_id) && (l.project_id === project_id) && (l.site_name === site_name) && (l.admin1pcode === admin1pcode) && (l.admin2pcode === admin2pcode);
								}).beneficiaries.push($scope.insertedBeneficiary);
							})
							
							angular.forEach(l.trainings,function (t,j) {
								$scope.insertedTraining = ngmClusterHelper.getCleanTrainingsforCopy(t,$loc,$scope.project.report);								
								$scope.project.report.locations.find(function (l) {									
									return (l.site_id === site_id) && (l.project_id === project_id) && (l.site_name === site_name) && (l.admin1pcode === admin1pcode) && (l.admin2pcode === admin2pcode);
								}).trainings.push($scope.insertedTraining);								
							})

						} else{
							new_location = ngmClusterHelper.getCleanCopyLocation(l,$scope.project.report);
							$scope.project.report.locations.push(new_location);							
						}
					})					
				},
				
				// entry copy previous report
				copyPrevReport: function(){
					Materialize.toast('Getting Data...', 1500, 'note');
					$scope.deactivedCopybutton = true;
					$scope.addBeneficiaryDisable = true;
					var setParam ={}
					if (config.report.report_month < 1) {
						setParam ={
							id: $route.current.params.report,
							project_id: $route.current.params.project,
							month: 11,
							year: config.report.report_year-1,
							previous: true
						}
					} else{
						setParam = {
							id: $route.current.params.report,
							project_id: $route.current.params.project,
							month: config.report.report_month - 1,
							// month: config.report.report_month,							
							year: config.report.report_year,
							previous: true
						}
					}
					

					var getPrevReport ={
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/report/getReport',
						data: setParam
					}

					ngmData.get(getPrevReport).then(function (prev_report) {
						
						var brows = 0;
						var trows =0;
						var info = "Save to apply changes"
						angular.forEach(prev_report.locations, function(l){
							brows += l.beneficiaries.length;
							trows += l.trainings.length;
						})

						if(!brows && !trows){
							if(Object.keys(prev_report).length){
								var msg = "No data in previous report";
										typ = 'success';
							}else{
								var msg = "No previous report";
										typ = 'success';
							}
							$scope.deactivedCopybutton = false;
							
								Materialize.toast(msg, 3000, typ);
							
						} else{
							Materialize.toast('Copying ...', 1500, 'note');
							if ( !brows && trows > 0 ){
									var msg = 'Copied Trainings ' + trows + ' rows';
									typ = 'success';
							} else if ( brows > 0 && !trows ){
								var msg = "Copied Beneficiaries " + brows + ' rows';
									  typ = 'success';
							} else{
									var msg = 'Copied beneficiaries ' + brows + ' rows'+ " and " + 'trainings ' + trows + ' rows';
										  typ = 'success';
							}
							
							$scope.project.addPrevReport(prev_report);
							$timeout(function () {
								countNewLocation=0;
								angular.forEach($scope.project.report.locations,function(loc){
									if(!loc.id){
										countNewLocation+=1;
									}
								})
								if(countNewLocation>0){
									msg += " and "+countNewLocation+" location"
								}
								Materialize.toast(msg, 4000, typ);
								Materialize.toast(info, 4500, 'note');
							}, 1500);
						}						
						$scope.addBeneficiaryDisable = false;						
						
					}).catch(function (e){
						Materialize.toast("Error, Not copied", 3000, 'error');
						$scope.addBeneficiaryDisable = false;
						$scope.deactivedCopybutton = false;
					})
				},

				// active deactivate copy previoust month
				activePrevReportButton: function(){
					
					$scope.beneficiariesCount= 0;
					$scope.trainingsCount = 0;
					$scope.project.report.locations.forEach(function(l){
						 $scope.beneficiariesCount += l.beneficiaries.length;
						 if(l.trainings){
							 $scope.trainingsCount += l.trainings.length;
						 }						 
					})
					
					if($scope.project.report.report_status !== 'todo' || (($scope.beneficiariesCount>0) || ($scope.trainingsCount>0))){
						$scope.deactivedCopybutton= true;						
						return $scope.deactivedCopybutton
					} else{
						$scope.deactivedCopybutton = false;
						return $scope.deactivedCopybutton;
					}					

				},


        // save
        save: function( complete, display_modal ){

          // if textarea
          $( 'textarea[name="notes"]' ).removeClass( 'ng-untouched' ).addClass( 'ng-touched' );
          $( 'textarea[name="notes"]' ).removeClass( 'invalid' ).addClass( 'valid' );

          // report
          // $scope.project.report.submit = true;
          $scope.project.report.report_status = complete ? 'complete' : 'todo';
          $scope.project.report.report_submitted = moment().format();

          // update project details of report + locations + beneficiaries
          $scope.project.report =
              ngmClusterHelper.getCleanReport( $scope.project.definition, $scope.project.report );

          // msg
          Materialize.toast( 'Processing Report...' , 3000, 'note');

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/report/setReport',
            data: { report: $scope.project.report }
          }

          // set report
          $http( setReportRequest ).success( function( report ){

            if ( report.err ) {
              // update
              Materialize.toast( 'Error! Please correct the ROW and try again', 6000, 'error' );
            }

            if ( !report.err ) {

              // updated report
              $scope.project.report = report;
              $scope.project.report.submit = false;

              // user msg
              var msg = 'Project Report for  ' + moment.utc( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
                  msg += complete ? 'Submitted!' : 'Saved!';

              // msg
              $timeout(function() { Materialize.toast( msg , 3000, 'success'); }, 600 );

              // set trigger
              $('.modal-trigger').leanModal();

              // Re-direct to summary
              if ( $scope.project.report.report_status !== 'complete' ) {

                // notification modal
                if( display_modal ){
                  $timeout(function() {
                    $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
                  }, 400);
                }

              } else {
                $timeout(function() {
                  $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
                }, 400);
              }
            }
          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });;

        }

      }

      // init project
			$scope.project.init();
			$scope.project.activePrevReportButton();

  }

]);
