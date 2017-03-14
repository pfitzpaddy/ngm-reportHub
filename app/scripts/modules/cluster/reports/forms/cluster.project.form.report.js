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
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, ngmClusterHelper, config ){

      // order locations by
      config.report.locations = $filter( 'orderBy' )( config.report.locations, [ 'admin1name', 'admin2name' ] );

      // project
      $scope.project = {
        
        // user
        user: ngmUser.get(),
        
        // app style
        style: config.style,
        
        // project
        definition: config.project,
        
        // report
        report: config.report,

        // default indicators ( 2016 )
        indicators: ngmClusterHelper.getIndicators(),

        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ],
        
        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        
        // title
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),
        
        // lists
        // activity_type: config.project.activity_type,
        activity_descriptions: ngmClusterHelper.getActivities( config.project.cluster_id, false ),
        category_types: ngmClusterHelper.getCategoryTypes( config.project.cluster_id ),
        beneficiary_types: config.report.report_year === 2016 ? ngmClusterHelper.getBeneficiaries2016( config.project.cluster_id, [] ) : ngmClusterHelper.getBeneficiaries( config.project.cluster_id, [] ),
        delivery_types:[{
          delivery_type_id: 'population',
          delivery_type_name: 'New Beneficiaries'
        },{
          delivery_type_id: 'service',
          delivery_type_name: 'Existing Beneficiaries'
        }],
        
        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        locationsUrl: 'locations.html',
        beneficiariesUrl: config.report.report_year === 2016 ? 'beneficiaries/2016/beneficiaries.html' : 'beneficiaries/beneficiaries.html',        
        beneficiariesTrainingUrl: 'beneficiaries/2016/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
        notesUrl: 'notes.html',

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
          }, 200);
        },

        // add beneficiary
        addBeneficiary: function( $parent ) {
          // sadd
          var sadd = { 
            households: 0, 
            sessions: 0, 
            families: 0, 
            boys: 0, 
            girls: 0, 
            men:0, 
            women:0, 
            elderly_men:0, 
            elderly_women:0 
          };
          $scope.inserted = {
            activity_type_id: null,
            activity_type_name: null,
            activity_description_id: null,
            activity_description_name: null,
            category_type_id: null,
            category_type_name: null,
            beneficiary_type_id: null,
            beneficiary_type_name: null,
            delivery_type_id: null,
            delivery_type_name: null
          };

          // merge
          angular.merge( $scope.inserted, sadd );

          // clone
          var length = $scope.project.report.locations[ $parent ].beneficiaries.length;
          if ( length ) {
            var b = angular.copy( $scope.project.report.locations[ $parent ].beneficiaries[ length - 1 ] );
            delete b.id;
            $scope.inserted = angular.merge( $scope.inserted, b, sadd );
          }
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

        // display category
        showCategory: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.category_type_id = $data;
          if($beneficiary.category_type_id) {
            selected = $filter('filter')( $scope.project.category_types, { category_type_id: $beneficiary.category_type_id }, true);
            $beneficiary.category_type_name = selected[0].category_type_name;
          }
          return selected.length ? selected[0].category_type_name : 'No Selection!';
        },

        // display beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.beneficiary_type_id = $data;
          if($beneficiary.beneficiary_type_id) {
            selected = $filter('filter')( $scope.project.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id }, true);
          }
          if ( selected.length ) {
            $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
            return selected[0].beneficiary_type_name
          } else {
            return 'No Selection!';
          }
        },

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if($beneficiary.activity_type_id) {
            selected = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);
            $beneficiary.activity_type_name = selected[0].activity_type_name;
          }
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id }, true);
            $beneficiary.activity_description_name = selected[0].activity_description_name;
          } 
          return selected.length ? selected[0].activity_description_name : 'No Selection!';
        },

        // display delivery
        showDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.delivery_type_id = $data;
          if($beneficiary.delivery_type_id) {
            selected = $filter('filter')( $scope.project.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
            $beneficiary.delivery_type_name = selected[0].delivery_type_name;
          }
          return selected.length ? selected[0].delivery_type_name : 'No Selection!';
        },

        // show sessions
        showSessions: function(){
          var display = false;
          angular.forEach($scope.project.report.locations, function(l){
            angular.forEach(l.beneficiaries, function(b){
              if( b.activity_description_id === 'education' || b.activity_description_id === 'training' ){
                display = true;
              }
            });
          });
          return display;
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.project.report.locations[ $parent ].beneficiaries[ $index ][ indicator ] = $data;
        },

        // sessions disabled
        rowSessionsDisabled: function( $beneficiary ){
          var disabled = true;
          if( $beneficiary.activity_description_id === 'education' || $beneficiary.activity_description_id === 'training' ) {
            disabled = false
          }
          return disabled;
        },
        
        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.category_type_id && $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id && $data.delivery_type_id &&
                $data.sessions >= 0 && $data.households >= 0 && $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.elderly_men >= 0 && $data.elderly_women >= 0 ) {
              disabled = false;
          }
          return disabled;
        },

        // remove location from location list
        removeBeneficiaryModal: function( $parent, $index ) {
          // set location index
          $scope.project.locationIndex = $parent;
          $scope.project.beneficiaryIndex = $index;
          // open confirmation modal
          $( '#beneficiary-modal' ).openModal({ dismissible: false });
        },

        // remove beneficiary
        removeBeneficiary: function() {
          $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
          // save
          $scope.project.save( false );
        },

        // save form on enter
        keydownSaveForm: function(){
          setTimeout(function(){
            $('.editable-input').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // ennsure all locations contain at least one complete beneficiaries 
        formComplete: function() {
          var valid = false;
          angular.forEach( $scope.project.report.locations, function( l ){
            angular.forEach( l.beneficiaries, function( b ){
              if ( !$scope.project.rowSaveDisabled( b ) ) {
                valid = true;
              }
            });
          });
          return valid;
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

        // save 
        save: function( complete ){

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
            url: 'http://' + $location.host() + '/api/cluster/report/setReport',
            data: {
              report: $scope.project.report
            }
          }          
          
          // set report
          ngmData.get( setReportRequest ).then( function( report, complete ){
            
            // report
            $scope.project.report = angular.merge( {}, $scope.project.report, report );
            $scope.project.report.submit = false;
            
            // user msg
            var msg = 'Project Report for  ' + moment( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
                msg += complete ? 'Submitted!' : 'Saved!';
            
            // msg
            Materialize.toast( msg , 3000, 'success');
            
            // Re-direct to summary
            if ( $scope.project.report.report_status !== 'complete' ) {
              // avoids duplicate beneficiaries 
                // ( if 'save' and then 'submit' is submited without a refresh in between ) ???
              // $route.reload();
            } else {
              $location.path( '/cluster/projects/report/' + $scope.project.definition.id );  
            }
          });

        }

      }

  }

]);

