/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperAf', [ '$http', '$filter', 'ngmAuth', function( $http, $filter, ngmAuth ) {

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

      }
      
		};

	}]);
