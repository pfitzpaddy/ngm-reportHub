/**
 * @name ngmReportHub.factory:ngmClusterTrainings
 * @description
 * # ngmClusterTrainings
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  .factory( 'ngmClusterTrainings', 
      [ '$http',
        '$filter',
        '$timeout',
        'ngmClusterBeneficiaries',
        'ngmAuth', function( $http, $filter, $timeout, ngmClusterBeneficiaries, ngmAuth ) {

    // ngmClusterTraining
    var ngmClusterTrainings = {

      // templates
      trainingsUrl: 'trainings/trainings.html',
      training_participantsUrl: 'trainings/training_participants.html',

      // training start date / end date
      datepicker: {
        startOnClose: function( training, value ) {
          var a = moment.utc( value );
          var b = moment.utc( training.training_end_date );
          training.training_start_date = moment.utc( value ).format( 'YYYY-MM-DD' );
          training.training_days_number = b.diff( a, 'days' )+1;
        },
        endOnClose: function( $parent, $index, value ) {
          var a = moment.utc( training.training_start_date );
          var b = moment.utc( value );
          training.training_end_date = moment.utc( value ).format( 'YYYY-MM-DD' );
          training.training_days_number = b.diff( a, 'days' )+1;
        },
      },

      // add trainings
      addTrainings: function( $scope, lists, project, location, locationIndex ) {
        
        // training topics
        var selected = [];
        angular.forEach( lists.activity_descriptions, function( t ) {
          if ( t.activity_type_id.indexOf( 'training_capacity_building' ) >= 0) {
            selected.push( t.activity_description_name );
          }
        });

        // trainings
        $scope.trainingInserted = {
          training_title: 'Training / Workshop Title...',
          training_topics: selected.join(', '),
          training_start_date: moment.utc().format('YYYY-MM-DD'),
          training_end_date: moment.utc().add( 3, 'd' ).format('YYYY-MM-DD'),
          training_days_number: 3,
          training_total_trainees: 0,
          training_conducted_by: project.organization,
          training_supported_by: project.organization,
          training_participants: [{
            trainee_men: 0,
            trainee_women: 0
          }]
        }

        var length = location.trainings.length;
        if ( length ) {
          var t = angular.copy( location.trainings[ length - 1 ] );
          delete t.id;
          delete t.training_participants;
          $scope.trainingInserted = angular.merge( $scope.trainingInserted, t );
        }

        // push
        location.trainings.push( $scope.trainingInserted );

        // expand new trianing form
        ngmClusterTrainings.editTraining( 600, true, locationIndex, location.trainings.length-1, 0 );
      },

      // add participant
      addParticipant: function( $scope, training  ){
        
        // trainings
        $scope.participantInserted = {
          trainee_men: 0,
          trainee_women: 0
        }

        // get previous
        if ( training.training_participants && training.training_participants.length ) {
          var p = angular.copy( training.training_participants[ length - 1 ] );
          delete p.id;
          $scope.participantInserted = angular.merge( $scope.participantInserted, p );
        } else {
          training.training_participants = [];
        }

        // add to training participants
        training.training_participants.push( $scope.participantInserted );
      },

      // resize form
      editTraining: function( timeout, click, locationIndex, trainingIndex, participantIndex ){
        $timeout( function() {
          $( '.editable-text' ).css({ width: '100%' });
          $( '#training_topics_' + locationIndex+trainingIndex ).css({border: 0 });
          $( '.editable-textarea' ).css({ width: '100%' });
          if ( click ) {
            $( '#participantsRowformEdit_' + locationIndex+trainingIndex+participantIndex ).click();
          }
        }, timeout );
      },

      // remove modal
      removeTrainingModal: function( project, locations, $parent, $index ) {
				if (!project.report.locations[$parent].trainings[$index].id){
					project.report.locations[$parent].trainings.splice($index, 1);
				} else {
					if (ngmClusterTrainings.trainingFormComplete(locations)) {
						ngmClusterTrainings.project = project;
						ngmClusterTrainings.locationIndex = $parent;
						ngmClusterTrainings.trainingIndex = $index;
						$('#training-modal').openModal({ dismissible: false });
					}
				}
        // if ( ngmClusterTrainings.trainingFormComplete( locations ) ){
        //   ngmClusterTrainings.project = project;
        //   ngmClusterTrainings.locationIndex = $parent;
        //   ngmClusterTrainings.trainingIndex = $index;
        //   $( '#training-modal' ).openModal({ dismissible: false });
        // }
      },

      // removeTraining
      removeTraining: function(){
        
        // t
        var t = ngmClusterTrainings.project.report.locations[ ngmClusterTrainings.locationIndex ].trainings[ ngmClusterTrainings.trainingIndex ];
        ngmClusterTrainings.project.report.locations[ ngmClusterTrainings.locationIndex ].trainings.splice( ngmClusterTrainings.trainingIndex, 1 );
				ngmClusterTrainings.project.activePrevReportButton();
        // setReportRequest
        var removeTrainingRequest = {
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/cluster/report/removeTraining',
          data: { id: t.id }
        }

        // set report
        $http( removeTrainingRequest ).success( function( result ){
          if ( result.err ) { Materialize.toast( 'Error! Please try again', 6000, 'error' ); }
          if ( !result.err ) { ngmClusterTrainings.project.save( false, false ); }
        }).error(function( err ) {
          Materialize.toast( 'Error!', 6000, 'error' );
        });

      },

      // removeTrainee
      removeTrainee: function( project, $grandParent, $parent, $index ) {

        // t
        var t = project.report.locations[ $grandParent ].trainings[ $parent ].training_participants[ $index ];
        project.report.locations[ $grandParent ].trainings[ $parent ].training_participants.splice( $index, 1 );

				if(!t.copy_prev_month){
        // setReportRequest
        var removeTrainingParticipantRequest = {
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/cluster/report/removeTrainee',
          data: { id: t.id }
        }

        // set report
        $http( removeTrainingParticipantRequest ).success( function( result ){
          if ( result.err ) { Materialize.toast( 'Error! Please try again', 6000, 'error' );}
          if ( !result.err ) {  project.save( false, false ); }
        }).error(function( err ) {
          Materialize.toast( 'Error!', 6000, 'error' );
        });

      }},

      // ennsure all locations contain at least one complete beneficiaries
      trainingFormComplete: function( locations ) {
        var trainings = 0;
        var rowCompleteTrainings = 0;
        var training_participants = 0;
        var rowCompleteParticipants = 0;
        angular.forEach( locations, function( l ){
          if ( l.trainings && l.trainings.length ) {
            trainings += l.trainings.length;
            angular.forEach( l.trainings, function( t ){
              if ( t ){
                if ( !ngmClusterTrainings.rowSaveDisabledTraining( t ) ) {
                  rowCompleteTrainings++;
                }
                if( t.training_participants && t.training_participants.length ) {
                  training_participants += t.training_participants.length;
                  angular.forEach( t.training_participants, function( p ){
                    if ( !ngmClusterTrainings.rowSaveDisabledTrainingParticipant( p ) ) {
                      rowCompleteParticipants++;
                    }
                  });
                }
              }
            });
          }
        });
        // return
        // console.log('trainings')
        // console.log(rowCompleteTrainings)
        // console.log(trainings)
        // console.log(rowCompleteTrainings >= trainings)
        // console.log('participants')
        // console.log(rowCompleteParticipants)
        // console.log(training_participants)
        // console.log(rowCompleteParticipants >= training_participants)
        if( rowCompleteTrainings >= trainings && 
              rowCompleteParticipants >= training_participants ){ return true; } else { return false; }
      },

      // disable save form
      rowSaveDisabledTraining: function( $data ){
        var disabled = true;
        if ( $data.training_title && 
              $data.training_topics &&
              $data.training_start_date &&
              $data.training_end_date &&
              $data.training_conducted_by &&
              $data.training_supported_by ) {
          disabled = false;
        }
        return disabled;
      },

      // disable save form
      rowSaveDisabledTrainingParticipant: function( $data ){
        var disabled = true;
        if ( $data.trainee_affiliation_id && 
              $data.trainee_health_worker_id &&
              $data.trainee_men >= 0 &&
              $data.trainee_women >= 0 ) {
          disabled = false;
        }
        return disabled;
      },    

      // sum participants
      sumTrainingParticipants: function( training, participant ) {
        $timeout( function(){
          training.training_total_trainees = participant.trainee_men + participant.trainee_women;
        }, 10 );
      },
      
      // display traings in monthly reports
      displayTrainings: function( project ) {
        // if training and capacity building
        if ( project.admin0pcode === 'ET' ) {
          if ( $filter( 'filter' )( project.activity_type, { activity_type_id: 'training_capacity_building' }, true ).length ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },

      // training_title
      showTrainingTitle: function( $data, training ){
        training.training_title = $data;
        return training.training_title ? training.training_title : '';
      },

      // training_topics
      showTrainingTopics: function( $data, training ){
        training.training_topics = $data;
        return training.training_topics ? training.training_topics : '';
      },

      // training_supported_by
      showTrainingSupportedBy: function( $data, training ){
        training.training_supported_by = $data;
        return training.training_supported_by ? training.training_supported_by : '';
      },

      // training_conducted_by
      showTrainingConductedBy: function( $data, training ){
        training.training_conducted_by = $data;
        return training.training_conducted_by ? training.training_conducted_by : '';
      },

      // show affiliation
      showAffiliation: function( lists, $data, $participant ) {
        var selected = [];
        $participant.trainee_affiliation_id = $data;
        if( $participant.trainee_affiliation_id ) {
          selected = $filter('filter')( lists.trainee_affiliations, { trainee_affiliation_id: $participant.trainee_affiliation_id }, true );
          $participant.trainee_affiliation_name = selected[0].trainee_affiliation_name;
        }
        return selected.length ? selected[0].trainee_affiliation_name : '-';
      },

      // show health worker
      showHealthWorker: function( lists, $data, $participant ) {
        var selected = [];
        $participant.trainee_health_worker_id = $data;
        if( $participant.trainee_health_worker_id ) {
          selected = $filter('filter')( lists.trainee_health_workers, { trainee_health_worker_id: $participant.trainee_health_worker_id }, true );
          $participant.trainee_health_worker_name = selected[0].trainee_health_worker_name;
        }
        return selected.length ? selected[0].trainee_health_worker_name : '-';
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

      // remove from array if no id
      cancelTrainingEdit: function( location, $index ) {			
        if ( !location.trainings[ $index ].id ) {
					if (!location.trainings[ $index ].copy_prev_month) {						
						location.trainings.splice($index, 1);
					}
          // location.trainings.splice( $index, 1 );
        }
      },

      // remove from array if no id
      cancelTraineeEdit: function( training, $index ) {
        if ( !training.training_participants[ $index ].id ) {
					if (!training.training_participants[$index].copy_prev_month) {
						training.training_participants.splice($index, 1);
					}
          // training.training_participants.splice( $index, 1 );
        }
      },

    };

    // return 
    return ngmClusterTrainings;

  }]);
