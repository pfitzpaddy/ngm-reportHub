/**
 * @name ngmReportHub.factory:ngmClusterHelperAf
 * @description
 * # ngmClusterHelperAf
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperAf', [ '$http', '$filter', '$timeout', 'ngmAuth','$translate', function( $http, $filter, $timeout, ngmAuth,$translate ) {

		var ngmClusterHelperAf = {

			// set org to acbar partner
			updateAcbarOrganization: function( project ) {
        // set org
        $http({
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/setOrganizationPartner',
          data: {
            organization_id: project.organization_id,
            project_acbar_partner: project.project_acbar_partner
          }
        }).success( function( result ) {
          // success!
        }).error( function( err ) {
          Materialize.toast( 'ACBAR Partner Organization Error!', 6000, 'error' );
        });				
			},

      // set to model on check
      setStrategicObjectives: function( project, lists, cluster_id ){

        var strategic_objectives = [];
        angular.forEach( project.strategic_objectives_check, function( key, so ){

          if ( key ) {
            var so_obj = so.split(":");
            // "health_objective_2:2018"
            //  old 2017 SO has no year, update db or use this hunch
            if (so_obj[1]==="")so_obj[1]=2017;
            if ( cluster_id !== project.cluster_id ) {
              // always include cluster_id
              var objective = $filter('filter')( lists.strategic_objectives[so_obj[1]][ project.cluster_id ], { objective_type_id: so_obj[0] }, true);
              if( objective[0] ){
                strategic_objectives.push( objective[0] );
              }
            }
            var objective = $filter('filter')( [].concat.apply([], Object.values( lists.strategic_objectives[so_obj[1]])) , { objective_type_id: so_obj[0] }, true);
            if( objective[0] ){
              strategic_objectives.push( objective[0] );
            }

          }

        });
        return strategic_objectives;
      },

      // injury sustained same province field
      showFatpTreatmentSameProvince: function( beneficiaries ){
        var display = false;
        if ( beneficiaries ) {
          angular.forEach( beneficiaries, function(b){        
            if( b.activity_description_id === 'fatp_stabilization_referrals_conflict' ||
                  b.activity_description_id === 'fatp_stabilization_referrals_civilian' ) {
              display = true;
            }
          });
        }
        return display;
      },

      showTreatmentSameProvince: function( $data, $beneficiary ) {
        var selected = [{}];
        // will show blank for all activities except
        if ( $beneficiary.activity_description_id !== 'fatp_stabilization_referrals_conflict' &&
              $beneficiary.activity_description_id !== 'fatp_stabilization_referrals_civilian' ) {
          delete $beneficiary.injury_treatment_same_province;
          selected[0].text = '-'
        // will show if not selected
        } else if ( $data == null ) {
          delete $beneficiary.injury_treatment_same_province;
          selected[0].text = $filter('translate')('not_selected')+' !'
        // will show if selected
        } else {
          $beneficiary.injury_treatment_same_province = $data;
          var selected = $filter('filter')([{
            'choise': true,
            'text': $filter('translate')('yes')
          }, {
            'choise': false,
            'text': 'No'
          }], {
            choise: $beneficiary.injury_treatment_same_province
          });
        }
        return selected[0].text;
      }
      
		};

    // return
    return ngmClusterHelperAf;

	}]);
