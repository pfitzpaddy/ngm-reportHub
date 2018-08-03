/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperAf', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		return {

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
      showFatpTreatmentSameProvince: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        if( l && project.admin0pcode === 'AF'  ){
          angular.forEach( l, function(b){
              if( b.activity_description_id === 'fatp_stabilization_referrals_conflict' ||
                  b.activity_description_id === 'fatp_stabilization_referrals_civilian' ){
                    display = true;
            }
          });
        }
        return display;
      },

      showTreatmentSameProvince: function ( $data, $beneficiary ) {
        var selected = [{}];
        // will show blank for all activities except
        if ( $beneficiary.activity_description_id !== 'fatp_stabilization_referrals_conflict' &&
          $beneficiary.activity_description_id !== 'fatp_stabilization_referrals_civilian' ) {
          delete $beneficiary.injury_treatment_same_province;
          selected[0].text = '-'
        // will show if not selected
        } else if ( $data == null ) {
          delete $beneficiary.injury_treatment_same_province;
          selected[0].text = 'Not Selected!'
        // will show if selected
        } else {
          $beneficiary.injury_treatment_same_province = $data;
          var selected = $filter('filter')([{
            'choise': true,
            'text': 'Yes'
          }, {
            'choise': false,
            'text': 'No'
          }], {
            choise: $beneficiary.injury_treatment_same_province
          });
        }
        return selected[0].text;
      },







      /****** EiEWG ************/


      // new site
      showYesNo: function( lists, $index, $data, target_location ){
        var selected = [];
        target_location.new_site_id = $data;
        if( target_location.new_site_id ) {
          selected = $filter('filter')( lists.new_site, { new_site_id: target_location.new_site_id }, true );
          target_location.new_site_name = selected[0].new_site_name;
        }
        return selected.length ? selected[0].new_site_name : 'No Selection!';
      },

      // show the label heading
      showSchoolNameLabel: function( project ){
        var display = false;
        angular.forEach( project.target_locations, function( d, i ) {
          if ( d.new_site_id ) {
            display = true;
          }
        });
        return display;
      },

      // show the label heading
      showHubSchoolNameLabel: function( project ){
        var display = false;
        angular.forEach( project.target_locations, function( d, i ) {
          if ( d.new_site_id && d.site_implementation_id === 'informal' ) {
            display = true;
          }
        });
        return display;
      },

      // show schools
      showSchools: function( lists, $index, $data, target_location ){

        var selected = [];
        target_location.site_id = $data;
        if( target_location.site_id && lists.schools[$index] && lists.schools[$index][target_location.admin2pcode] ) {
          selected = $filter('filter')( lists.schools[$index][target_location.admin2pcode], { site_id: target_location.site_id }, true);
          if (selected.length) {
            target_location.site_name = selected[0].site_name;
            target_location.site_lng = selected[0].site_lng;
            target_location.site_lat = selected[0].site_lat;
          }
        }
        return target_location.site_name ? target_location.site_name : 'No Selection!';
      },

      // hub school
      showHubSchools: function( lists, $index, $data, target_location ){
        var selected = [];
        target_location.site_hub_id = $data;
        if( target_location.site_hub_id && lists.hub_schools[$index] && lists.hub_schools[$index][target_location.admin2pcode] ) {
          selected = $filter('filter')( lists.hub_schools[$index][target_location.admin2pcode], { site_id: target_location.site_hub_id }, true);
          if (selected.length) {
            target_location.site_hub_name = selected[0].site_name;
            if( target_location.new_site_id === 'yes' ){
              target_location.site_lng = selected[0].site_lng;
              target_location.site_lat = selected[0].site_lat;
            }
          }
        }
        return target_location.site_hub_name;
      },

      // load schools
      loadSchools: function( lists, $index, $data, target_location ){

        // reset client
        if (!target_location.id) {
          target_location.site_name = null;
          target_location.site_id = null;
          target_location.site_hub_id = null;
          target_location.site_hub_name = null;
        }

        // list storage
        if (!lists.schools[$index]) {
          lists.schools[$index] = [];
          lists.hub_schools[$index] = [];
        }
        // list storage by pcode2
        if (!lists.schools[$index][target_location.admin2pcode]) {
          lists.schools[$index][target_location.admin2pcode] = [];
          lists.hub_schools[$index][target_location.admin2pcode] = [];
        }

        // if kabul remove so that PD schools are displayed
        if ( lists.schools[$index][target_location.admin2pcode].length && target_location.admin2pcode === '101' ) {
          lists.schools[$index][target_location.admin2pcode] = [];
          lists.hub_schools[$index][target_location.admin2pcode] = [];
        }

        // set lists
          // timeout will enable admin2 to be selected (if user changes admin2 retrospectively)
        $timeout(function(){
          if ( target_location.admin1pcode && target_location.admin2pcode && target_location.admin2name ) {
            // if already existing
            if( lists.schools[$index][target_location.admin2pcode] && lists.schools[$index][target_location.admin2pcode].length ) {
              // do nothing!
            } else {
              // else fetch!
              if( !target_location.id ){
                Materialize.toast( 'Loading Schools!' , 6000, 'note' );
              }
              $http({
                method: 'GET', url: ngmAuth.LOCATION + '/api/list/getAdmin2Sites?cluster_id=' + $scope.project.definition.cluster_id + '&admin0pcode=' + target_location.admin0pcode + '&admin1pcode=' + target_location.admin1pcode + '&admin2pcode=' + target_location.admin2pcode + '&admin2name=' + target_location.admin2name
              }).success( function( result ) {
                if ( target_location.admin1pcode && target_location.admin2pcode && !result.length ) {
                  Materialize.toast( 'No Schools for ' + target_location.admin1name +', ' + target_location.admin2name + '!' , 6000, 'success' );
                }
                // set
                lists.schools[$index][target_location.admin2pcode] = result;
                lists.hub_schools[$index][target_location.admin2pcode] = result;
              }).error( function( err ) {
                Materialize.toast( 'Schools List Error!', 6000, 'error' );
              });
            }
          }
        }, 10 );
      },

      
		};

	}]);
