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
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, config ){

      // set activity descriptions
      $scope.activity_descriptions = ngmClusterHelper.getActivities( config.project, false, false );

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
        indicators: config.report.report_year === 2016 ? ngmClusterHelper.getIndicators() : ngmClusterHelper.getIndicators( true ),

        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ],

        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // title
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        // lists
        // activity_type: config.project.activity_type,
        activity_descriptions: $scope.activity_descriptions,
        category_types: ngmClusterHelper.getCategoryTypes(),
        beneficiary_types: config.report.report_year === 2016 ? ngmClusterHelper.getBeneficiaries2016( config.project.cluster_id, [] ) : ngmClusterHelper.getBeneficiaries( config.project.admin0pcode ),
        lists: {
          // units
          units: ngmClusterHelper.getUnits( config.project.admin0pcode ),
          // transfers
          transfers: ngmClusterHelper.getTransfers( 10 ),
          // Population
          delivery_types:ngmClusterHelper.getDeliveryTypes(),
          // MPC
          mpc_delivery_types: ngmClusterHelper.getMpcDeliveryTypes(),
          // MOH, International NGO, Local NGO AND Private, Community
          trainee_affiliations: [{ trainee_affiliation_id: 'community', trainee_affiliation_name: 'Community' },
                                    { trainee_affiliation_id: 'moh', trainee_affiliation_name: 'MoH' },
                                    { trainee_affiliation_id: 'private', trainee_affiliation_name: 'Private' },
                                    { trainee_affiliation_id: 'local_ngo', trainee_affiliation_name: 'Local NGO' },
                                    { trainee_affiliation_id: 'international_ngo', trainee_affiliation_name: 'International NGO' }],
          trainee_health_workers: [{ trainee_health_worker_id: 'doctors', trainee_health_worker_name: 'Doctors' },
                                    { trainee_health_worker_id: 'nurses', trainee_health_worker_name: 'Nurses' },
                                    { trainee_health_worker_id: 'midwives', trainee_health_worker_name: 'Midwives' },
                                    { trainee_health_worker_id: 'pharmacists', trainee_health_worker_name: 'Pharmacists' },
                                    { trainee_health_worker_id: 'health_officers', trainee_health_worker_name: 'Health Officers' },
                                    { trainee_health_worker_id: 'laboratory_technologists_technicians', trainee_health_worker_name: 'Laboratory Technologists / Technicians' },
                                    { trainee_health_worker_id: 'community_health_workers', trainee_health_worker_name: 'Community Health Workers' },
                                    { trainee_health_worker_id: 'community_health_volunteers', trainee_health_worker_name: 'Community Health Volunteers' },
                                    { trainee_health_worker_id: 'health_extension_workers', trainee_health_worker_name: 'Health Extension Workers' },
                                    { trainee_health_worker_id: 'environmental_health_workers', trainee_health_worker_name: 'Environmental Health Workers' }]
        },

        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        locationsUrl: 'locations.html',
        beneficiariesUrl: config.report.report_year === 2016 ? 'beneficiaries/2016/beneficiaries.html' : 'beneficiaries/beneficiaries.html',
        beneficiariesTrainingUrl: 'beneficiaries/2016/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
        trainingsUrl: 'trainings/trainings.html',
        training_participantsUrl: 'trainings/training_participants.html',
        notesUrl: 'notes.html',

        datepicker: {
          startOnClose: function( $parent, $index, value ) {
            var a = moment( value );
            var b = moment( $scope.project.report.locations[ $parent ].trainings[ $index ].training_end_date );
            $scope.project.report.locations[ $parent ].trainings[ $index ].training_start_date = moment( value ).format( 'YYYY-MM-DD' );
            $scope.project.report.locations[ $parent ].trainings[ $index ].training_days_number = b.diff( a, 'days' )+1;
          },
          endOnClose: function( $parent, $index, value ) {
            var a = moment( $scope.project.report.locations[ $parent ].trainings[ $index ].training_start_date );
            var b = moment( value );
            $scope.project.report.locations[ $parent ].trainings[ $index ].training_end_date = moment( value ).format( 'YYYY-MM-DD' );
            $scope.project.report.locations[ $parent ].trainings[ $index ].training_days_number = b.diff( a, 'days' )+1;
          },
        },

        // get activities
        getActivityTypes: function(){
          //
          var activity_types = $scope.project.definition.activity_type;
          if ( $scope.project.definition.admin0pcode === 'ET' ) {
            activity_types = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: '!training_capacity_building' }, true);
          }
          return activity_types;
        },

        // display traiings in monthly reports
        displayTrainings: function() {
          // if training and capacity building
          if ( $scope.project.definition.admin0pcode === 'ET' ) {
            if ( $filter( 'filter' )( $scope.project.definition.activity_type, { activity_type_id: 'training_capacity_building' }, true ).length ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        },

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
          }, 400);
        },

        // resize form
        editTraining: function(){
          $('.editable-text').css({ width: '100%' });
          $('#training_topics').css({border: 'none' });
          $('.editable-textarea').css({ width: '100%' });
        },

        // add trainings
        addTrainings: function( $parent ) {
          // training topics
          var selected = [];
          angular.forEach( $scope.project.activity_descriptions, function( t ) {
            if ( t.activity_type_id.indexOf( 'training_capacity_building' ) >= 0) {
              selected.push( t.activity_description_name );
            }
          });

          // trainings
          $scope.trainingInserted = {
            training_title: 'Training / Workshop Title...',
            training_topics: selected.join(', '),
            training_start_date: moment().format('YYYY-MM-DD'),
            training_end_date: moment().add( 3, 'd' ).format('YYYY-MM-DD'),
            training_days_number: 3,
            training_total_trainees: 0,
            training_conducted_by: $scope.project.definition.organization,
            training_supported_by: $scope.project.definition.organization,
            training_participants: [{
              trainee_affiliation_id: null,
              trainee_affiliation_name: null,
              trainee_health_worker_id: null,
              trainee_health_worker_name: null,
              trainee_men: 0,
              trainee_women: 0
            }]
          }

          // clone
          if ( !$scope.project.report.locations[ $parent ].trainings ) {
            $scope.project.report.locations[ $parent ].trainings = [];
          }
          $scope.project.report.locations[ $parent ].trainings.push( $scope.trainingInserted );

          // expand title text
          $timeout( function() {
            $('.editable-text').css({ width: '100%' });
            $('#training_topics').css({border: 'none' });
            $('.editable-textarea').css({ width: '100%' });
            $('#participantsRowformEdit').click();
          }, 400 );
        },

        // add particiapnt
        addParticipant: function( $grandParent, $parent  ){
          // trainings
          $scope.participantInserted = {
            trainee_affiliation_id: null,
            trainee_affiliation_name: null,
            trainee_health_worker_id: null,
            trainee_health_worker_name: null,
            trainee_men: 0,
            trainee_women: 0
          }
          // add to training participants
          if ( !$scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants ) {
            $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants = [];
          }
          $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants.push( $scope.participantInserted );
        },

        // sum participants
        sumParticipants: function( $grandParent, $parent, forparticipant ) {
          // var sum = 0;
          // angular.forEach( $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants, function( t ){
          //   sum += t.trainee_men + t.trainee_women;
          // });
          $timeout(function(){
            console.log( participant.trainee_men + participant.trainee_women );
            $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_total_trainees = participant.trainee_men + participant.trainee_women;
          }, 10 )
        },

        // add beneficiary
        addBeneficiary: function( $parent ) {
          // sadd
          var sadd = {
            units: 0,
            cash_amount: 0,
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
            cluster_id: null,
            cluster: null,
            category_type_id: null,
            category_type_name: null,
            beneficiary_type_id: null,
            beneficiary_type_name: null,
            activity_type_id: null,
            activity_type_name: null,
            activity_description_id: null,
            activity_description_name: null,
            delivery_type_id: null,
            delivery_type_name: null,
            transfer_type_id: 0,
            transfer_type_value: 0
          };

          // merge
          angular.merge( $scope.inserted, sadd );

          // eiewg
          if( $scope.project.definition.admin0pcode !== 'AF' || $scope.project.definition.cluster_id === 'eiewg' ){
            $scope.inserted.category_type_id = 'category_a';
            $scope.inserted.category_type_name = 'A) Emergency Relief Needs';
          }

          // clone
          if ( !$scope.project.report.locations[ $parent ].beneficiaries ) {
            $scope.project.report.locations[ $parent ].beneficiaries = [];
          }
          var length = $scope.project.report.locations[ $parent ].beneficiaries.length;
          if ( length ) {
            var b = angular.copy( $scope.project.report.locations[ $parent ].beneficiaries[ length - 1 ] );
						delete b.id;
						delete b.injury_treatment_same_province;
            $scope.inserted = angular.merge( $scope.inserted, b, sadd );
            $scope.inserted.transfer_type_id = 0;
            $scope.inserted.transfer_type_value = 0;
          }
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if($beneficiary.activity_type_id) {
            selected = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);

            // catch for old data
            if( selected[0].cluster_id && selected[0].cluster ) {
              $beneficiary.cluster_id = selected[0].cluster_id;
              $beneficiary.cluster = selected[0].cluster;
            }
            if (selected.length) {
            	$beneficiary.activity_type_name = selected[0].activity_type_name;
            } else {
            	delete $beneficiary.activity_type_id
            }

          }
          return selected.length ? selected[0].activity_type_name : 'Needs Update!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id }, true );

						if (selected.length) {
            	$beneficiary.activity_description_name = selected[0].activity_description_name;
            } else {
            	delete $beneficiary.activity_description_id;
            }

          }
          return selected.length ? selected[0].activity_description_name : 'Needs Update!';
        },

        // display delivery
        showCashDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.mpc_delivery_type_id = $data;
          if($beneficiary.mpc_delivery_type_id) {

            // selection
            selected = $filter('filter')( $scope.project.lists.mpc_delivery_types, { mpc_delivery_type_id: $beneficiary.mpc_delivery_type_id }, true );
            if ( selected.length ) {
              $beneficiary.mpc_delivery_type_name = selected[0].mpc_delivery_type_name;
            } else {
              selected.push({
                mpc_delivery_type_id: 'n_a',
                mpc_delivery_type_name: 'N/A'
              });
            }

            // no cash! for previous selections
            if ( $beneficiary.activity_type_id.indexOf( 'cash' ) === -1 &&
                  $beneficiary.activity_description_id &&
                  ( $beneficiary.activity_description_id.indexOf( 'cash' ) === -1 &&
                    $beneficiary.activity_description_id.indexOf( 'in_kind' ) === -1 ) ) {
              // reset
              $beneficiary.mpc_delivery_type_id = 'n_a';
              $beneficiary.mpc_delivery_type_name = 'N/A';
            }

          }
          return selected.length ? selected[0].mpc_delivery_type_name : 'No Selection!';
        },

        // display category
        showCategory: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.category_type_id = $data;
          if( $beneficiary.category_type_id ) {
            selected = $filter('filter')( $scope.project.category_types, { category_type_id: $beneficiary.category_type_id }, true);
            $beneficiary.category_type_name = selected[0].category_type_name;
          }
          return selected.length ? selected[0].category_type_name : 'No Selection!';
        },

        // display beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.beneficiary_type_id = $data;
          if ( $beneficiary.beneficiary_type_id ) {
            selected = $filter('filter')( $scope.project.beneficiary_types, { cluster_id: $beneficiary.cluster_id, beneficiary_type_id: $beneficiary.beneficiary_type_id }, true );

          }
          if ( selected.length ) {
            $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
            return selected[0].beneficiary_type_name
          } else {
            return 'No Selection!';
          }
        },

        // display delivery
        showDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.delivery_type_id = $data;
          if($beneficiary.delivery_type_id) {
            selected = $filter('filter')( $scope.project.lists.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
            $beneficiary.delivery_type_name = selected[0].delivery_type_name;
          }
          return selected.length ? selected[0].delivery_type_name : 'No Selection!';
        },

        // display if education/training sessions provided
        showSessions: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( ( $scope.project.definition.cluster_id !== 'eiewg' )
                  && ( b.activity_description_id )
                  && ( b.activity_description_id.indexOf( 'education' ) !== -1 || b.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showUnits: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
            if(
                ( b.cluster_id === 'eiewg' || b.cluster_id === 'fsac' || b.cluster_id === 'agriculture' ) ||
                ( b.activity_description_id &&
                ( b.activity_description_id.indexOf( 'education' ) > -1 ||
                  b.activity_description_id.indexOf( 'training' ) > -1 ||
                  b.activity_description_id.indexOf( 'cash' ) > -1 ||
                  b.activity_description_id.indexOf( 'in_kind' ) > -1 ) )
              ) {
                display = true;
              }
            });
          }
          return display;
        },

        // unit types
        showUnitTypes: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.unit_type_id = $data;
          if( $beneficiary.unit_type_id && $beneficiary.admin0pcode && $beneficiary.cluster_id ) {
            selected = $filter('filter')( $scope.project.lists.units, { unit_type_id: $beneficiary.unit_type_id }, true);
            if(selected.length) {
              $beneficiary.unit_type_name = selected[0].unit_type_name;
            }
          }else{
            $beneficiary.unit_type_id = 'n_a';
            $beneficiary.unit_type_id = 'N/A';
          }
          return selected.length ? selected[0].unit_type_name : 'N/A';
        },

        // transfer_type_id
        showTransferTypes: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.transfer_type_id = $data;
          if($beneficiary.transfer_type_id) {
            selected = $filter('filter')( $scope.project.lists.transfers, { transfer_type_id: $beneficiary.transfer_type_id }, true);
            if( selected.length ) {
              $beneficiary.transfer_type_value = selected[0].transfer_type_value;
            }
          }else{
            $beneficiary.transfer_type_id = 0;
            $beneficiary.transfer_type_value = 0;
          }
          return selected.length ? selected[0].transfer_type_value : 0;
        },

        // cash
        showCash: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( ( b.activity_type_id && b.activity_type_id.indexOf('cash') > -1 ) ||
                  ( b.activity_description_id &&
                  ( b.activity_description_id.indexOf( 'cash' ) > -1 ||
                    b.activity_description_id.indexOf( 'fsac_in_kind' ) > -1 ) ) ) {
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showHouseholds: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id === 'cvwg' || b.cluster_id === 'esnfi' || b.cluster_id === 'agriculture' || b.cluster_id === 'fsac' || ( b.cluster_id === 'wash' && $scope.project.report.admin0pcode !== 'AF' ) ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showFamilies: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id === 'wash' || b.activity_type_id === 'nutrition_education_training' ) {
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showMen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
                if( ( b.cluster_id !== 'nutrition' || b.activity_type_id === 'nutrition_education_training' ) &&
                  b.activity_type_id !== 'mch' &&
                  b.activity_type_id !== 'vaccination' &&
                  b.activity_description_id !== 'antenatal_care' &&
                  b.activity_description_id !== 'postnatal_care' &&
                  b.activity_description_id !== 'skilled_birth_attendant' &&
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showWomen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.activity_type_id !== 'vaccination' &&
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showEldMen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id !== 'eiewg' &&
                  b.cluster_id !== 'nutrition' &&
                  b.cluster_id !== 'wash' &&
                  b.activity_type_id !== 'mch' &&
                  b.activity_description_id !== 'antenatal_care' &&
                  b.activity_description_id !== 'postnatal_care' &&
                  b.activity_description_id !== 'skilled_birth_attendant' &&
                  b.activity_type_id !== 'vaccination' &&
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

        // units
        showEldWomen: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
              if( b.cluster_id !== 'eiewg' &&
                  b.cluster_id !== 'nutrition' &&
                  b.cluster_id !== 'wash' &&
                  b.activity_type_id !== 'mch' &&
                  b.activity_description_id !== 'antenatal_care' &&
                  b.activity_description_id !== 'postnatal_care' &&
                  b.activity_description_id !== 'skilled_birth_attendant' &&
                  b.activity_type_id !== 'vaccination' &&
                  b.activity_description_id !== 'penta_3' &&
                  b.activity_description_id !== 'measles' ){
                display = true;
              }
            });
          }
          return display;
        },

				// injury sustained same province field
        showFatpTreatmentSameProvince: function( $locationIndex ){
          var display = false;
          var l = $scope.project.report.locations[ $locationIndex ];
          if( l ){
            angular.forEach( l.beneficiaries, function(b){
								if( b.activity_description_id === 'fatp_stabilization_referrals_conflict' ||
										b.activity_description_id === 'fatp_stabilization_referrals_civilian' ){
                			display = true;
              }
            });
          }
          return display;
				},

				showTreatmentSameProvince: function( $data, $beneficiary ){
					var selected = [];
					if (!$data || ($beneficiary.activity_description_id !== 'fatp_stabilization_referrals_conflict' &&
						$beneficiary.activity_description_id !== 'fatp_stabilization_referrals_civilian')) {
						delete $beneficiary.injury_treatment_same_province;
					} else {
						$beneficiary.injury_treatment_same_province = $data;
						var selected = $filter('filter')([{'choise':true, 'text':'Yes'},{'choise':false, 'text':'No'}], {choise: $beneficiary.injury_treatment_same_province});
					}
          return selected.length ? selected[0].text : 'No Selection!';
				},

        // training_title
        showTrainingTitle: function( $data, training ){
          training.training_title = $data;
          return training.training_title ? training.training_title : '';
        },

        showTrainingTopics: function( $data, training ){
          training.training_topics = $data;
          return training.training_topics ? training.training_topics : '';
        },

        // training_title
        showTrainingConductedBy: function( $data, training ){
          training.training_conducted_by = $data;
          return training.training_conducted_by ? training.training_conducted_by : '';
        },

        // training_title
        showTrainingSupportedBy: function( $data, training ){
          training.training_supported_by = $data;
          return training.training_supported_by ? training.training_supported_by : '';
        },

        // show affiliation
        showAffiliation: function( $data, $participant ) {
          var selected = [];
          $participant.trainee_affiliation_id = $data;
          if( $participant.trainee_affiliation_id ) {
            selected = $filter('filter')( $scope.project.lists.trainee_affiliations, { trainee_affiliation_id: $participant.trainee_affiliation_id }, true );
            $participant.trainee_affiliation_name = selected[0].trainee_affiliation_name;
          }
          return selected.length ? selected[0].trainee_affiliation_name : 'No Selection!';
        },

        showHealthWorker: function( $data, $participant ) {
          var selected = [];
          $participant.trainee_health_worker_id = $data;
          if( $participant.trainee_health_worker_id ) {
            selected = $filter('filter')( $scope.project.lists.trainee_health_workers, { trainee_health_worker_id: $participant.trainee_health_worker_id }, true );
            $participant.trainee_health_worker_name = selected[0].trainee_health_worker_name;
          }
          return selected.length ? selected[0].trainee_health_worker_name : 'No Selection!';
        },

        // training_title
        setTraineeMen: function( $data, participant ){
          participant.trainee_men = $data;
          return participant.trainee_men;
        },
        setTraineeWomen: function( $data, participant ){
          participant.trainee_women = $data;
          return participant.trainee_women;
        },

        // disable input
        disabledInput: function( $beneficiary, indicator ) {
          var disabled = false;

          // health, MCH, ANC, PNC, SBA
          if( $beneficiary.activity_description_id === 'postnatal_care' ){
            if( indicator !== 'boys' && indicator !== 'girls' && indicator !== 'women' ){
              disabled = true;
            }
          }
          // health, MCH, ANC, PNC, SBA
          if( $beneficiary.activity_type_id === 'mch' ||
              $beneficiary.activity_description_id === 'antenatal_care' ||
              $beneficiary.activity_description_id === 'skilled_birth_attendant' ){
            if( indicator !== 'women' ){
              disabled = true;
            }
          }

          // health, vaccination
          if( $beneficiary.activity_type_id === 'vaccination' ||
              $beneficiary.activity_description_id === 'penta_3' ||
              $beneficiary.activity_description_id === 'measles' ){
            if( indicator !== 'boys' && indicator !== 'girls' ){
              disabled = true;
            }
          }

          return disabled;
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.project.report.locations[ $parent ].beneficiaries[ $index ][ indicator ] = $data;
        },

        // sessions disabled
        rowSessionsDisabled: function( $beneficiary ){
          var disabled = true;
          if( ( $beneficiary.cluster_id !== 'eiewg' )
                && ( $beneficiary.activity_description_id )
                && ( $beneficiary.activity_description_id.indexOf( 'education' ) !== -1 || $beneficiary.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
            disabled = false
          }
          return disabled;
        },

        // disable save form
        rowSaveDisabled: function( $data ){
					var disabled = true;
					switch ($scope.project.definition.admin0pcode) {
						case 'AF':
								if ( $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id && $data.delivery_type_id &&
									$data.units >= 0 && $data.sessions >= 0 && $data.households >= 0 && $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.elderly_men >= 0 && $data.elderly_women >= 0 ) {
									disabled = false;
										}
								break;

						default:
								if ( $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id &&
									$data.units >= 0 && $data.sessions >= 0 && $data.households >= 0 && $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.elderly_men >= 0 && $data.elderly_women >= 0 ) {
									disabled = false;
										}
									break;
          }
          return disabled;
        },

        // remove from array if no id
        cancelTrainingEdit: function( $parent, $index ) {
          if ( !$scope.project.report.locations[ $parent ].trainings[ $index ].id ) {
            $scope.project.report.locations[ $parent ].trainings.splice( $index, 1 );
          }
        },

        // remove from array if no id
        cancelTraineeEdit: function( $grandParent, $parent, $index ) {
          if ( !$scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants[ $index ].id ) {
            $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants.splice( $index, 1 );
          }
        },

        // remove from array if no id
        cancelEdit: function( $parent, $index ) {
          if ( !$scope.project.report.locations[ $parent ].beneficiaries[ $index ].id ) {
            $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
          }
        },

        // remove modal
        removeTrainingModal: function( $parent, $index ) {
          if ( $scope.project.formComplete() ){
            // set location index
            $scope.project.locationIndex = $parent;
            $scope.project.trainingIndex = $index;
            // open confirmation modal
            $( '#training-modal' ).openModal({ dismissible: false });
          }
        },

        // removeTraining
        removeTraining: function(){
          // t
          var t = $scope.project.report.locations[ $scope.project.locationIndex ].trainings[ $scope.project.trainingIndex ];
          $scope.project.report.locations[ $scope.project.locationIndex ].trainings.splice( $scope.project.trainingIndex, 1 );

          // setReportRequest
          var setBeneficiariesRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/report/removeTraining',
            data: {
              id: t.id
            }
          }

          // set report
          $http( setBeneficiariesRequest ).success( function( result ){

            if ( result.err ) {
              // update
              Materialize.toast( 'Error! Please try again', 6000, 'error' );
            }

            if ( !result.err ) {

              // save report
              $scope.project.save( false, false );
            }

          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });

        },

        // removeTraining
        removeTrainee: function( $grandParent, $parent, $index ) {

          // t
          var t = $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants[ $index ];
          $scope.project.report.locations[ $grandParent ].trainings[ $parent ].training_participants.splice( $index, 1 );

          // setReportRequest
          var setBeneficiariesRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/report/removeTrainee',
            data: {
              id: t.id
            }
          }

          // set report
          $http( setBeneficiariesRequest ).success( function( result ){

            if ( result.err ) {
              // update
              Materialize.toast( 'Error! Please try again', 6000, 'error' );
            }

            if ( !result.err ) {

              // save report
              $scope.project.save( false, false );
            }

          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });

        },


        // remove location from location list
        removeBeneficiaryModal: function( $parent, $index ) {
          if ( $scope.project.formComplete() ){
            // set location index
            $scope.project.locationIndex = $parent;
            $scope.project.beneficiaryIndex = $index;
            // open confirmation modal
            $( '#beneficiary-modal' ).openModal({ dismissible: false });
          }
        },

        // remove beneficiary
        removeBeneficiary: function() {

          // b
          var b = $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries[ $scope.project.beneficiaryIndex ];
          $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );

          // setReportRequest
          var setBeneficiariesRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/report/removeBeneficiary',
            data: {
              id: b.id
            }
          }

          // set report
          $http( setBeneficiariesRequest ).success( function( result ){

            if ( result.err ) {
              // update
              Materialize.toast( 'Error! Please correct the ROW and try again', 6000, 'error' );
            }

            if ( !result.err ) {

              // save report
              $scope.project.save( false, false );
            }

          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });
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

        // ennsure all locations contain at least one complete beneficiaries
        formComplete: function() {
          var beneficiaries = 0;
          var rowComplete = 0;
          angular.forEach( $scope.project.report.locations, function( l ){
            if( l.beneficiaries ) {
              beneficiaries += l.beneficiaries.length;
              if ( l.beneficiaries.length ) {
                angular.forEach( l.beneficiaries, function( b ){
                  if ( !$scope.project.rowSaveDisabled( b ) ) {
                    rowComplete++;
                  }
                });
              // } else {
              //   rowComplete++;
              }
            }
          });
          //
          if( rowComplete >= beneficiaries ){
            return true;
          } else {
            return false;
          }
        },

				// preps for 2018 #TODO delete
				categoryShow2017: function(){
					return moment()<moment('2018-02-01')
				},

        // training form valid
        trainingValid: function(){
          console.log( $scope.participantsRowform.$valid );
          return $scope.participantsRowform.$valid;
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
            data: {
              report: $scope.project.report
            }
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
              var msg = 'Project Report for  ' + moment( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
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

  }

]);
