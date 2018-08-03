/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperTargetBeneficiaries', [ '$http', '$filter', 'ngmAuth', function( $http, $filter, ngmAuth ) {

		return {

      // add beneficiary
      addBeneficiary: function ( target_beneficiaries ) {
        
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
        // inserted
        var inserted = {};

        // merge
        angular.merge( inserted, sadd );

        // clone
        var length = target_beneficiaries.length;
        if ( length ) {
          var b = angular.copy( target_beneficiaries[ length - 1 ] );
          delete b.id;
          delete b.injury_treatment_same_province;
          inserted = angular.merge( inserted, b, sadd );
          inserted.transfer_type_id = 0;
          inserted.transfer_type_value = 0;
        }
        return inserted;

      },

      // remove beneficiary from db
      removeBeneficiary: function( id ) {
        $http({
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/cluster/project/removeBeneficiary',
          data: { id: id }
        }).success( function( result ) {
          Materialize.toast( 'People in Need Removed!' , 3000, 'success' )
        }).error( function( err ) {
          Materialize.toast( 'Error!', 6000, 'error' );
        });
      },

      // disable save form
      rowSaveDisabled: function( $data ){
        var disabled = true;
        if ( $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id &&
              $data.households >= 0 && $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && 
              $data.men >= 0 && $data.women >= 0 && $data.elderly_men >= 0 && $data.elderly_women >= 0 ) {
            disabled = false;
        }
        return disabled;
      },
      
      // show activity (generic)
      showActivity: function( project, $data, $beneficiary ){
        var selected = [];
        $beneficiary.activity_type_id = $data;
        if( $beneficiary.activity_type_id && project.activity_type.length ) {
          selected = $filter('filter')( project.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);
          if ( selected.length ) {

            // catch for old data
            if( selected.length && selected[0].cluster_id && selected[0].cluster ) {
              $beneficiary.cluster_id = selected[0].cluster_id;
              $beneficiary.cluster = selected[0].cluster;
            }

            // selected
            if (selected.length) {
              $beneficiary.activity_type_name = selected[0].activity_type_name;
            } else {
              // if data exists then get it
              if ($beneficiary.activity_type_name&&$beneficiary.activity_type_id){
                selected = [{}];
                selected[0].activity_type_name = $beneficiary.activity_type_name;
              } else {
                delete $beneficiary.activity_type_id;
              }
            }

          }
        }
        return selected.length ? selected[0].activity_type_name : 'Needs Update!';
      },

      // show descipriton (generic)
      showDescription: function( lists, $data, $beneficiary ){
        var selected = [];
        $beneficiary.activity_description_id = $data;
        if( $beneficiary.activity_description_id ) {
          selected = $filter('filter')( lists.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id }, true);
          if ( selected.length ) {
            $beneficiary.activity_description_name = selected[0].activity_description_name;
          } else {
            // if data exists then get it
            if ($beneficiary.activity_description_name&&$beneficiary.activity_description_id){
              selected = [{}];
              selected[0].activity_description_name = $beneficiary.activity_description_name;
            } else {
              delete $beneficiary.activity_description_id;
            }
          }
        }
        return selected.length ? selected[0].activity_description_name : 'Needs Update!';
      },

      // display delivery (afg specific)
      showCashDelivery: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.mpc_delivery_type_id = $data;
        if( $beneficiary.mpc_delivery_type_id ) {

          // selection
          selected = $filter('filter')( lists.mpc_delivery_types, { mpc_delivery_type_id: $beneficiary.mpc_delivery_type_id }, true );
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
                  $beneficiary.activity_description_id.indexOf( 'in_kind' ) === -1 &&
                  $beneficiary.activity_description_id.indexOf( 'package' ) === -1 ) ){
            // reset
            $beneficiary.mpc_delivery_type_id = 'n_a';
            $beneficiary.mpc_delivery_type_name = 'N/A';
          }

        }

        return selected.length ? selected[0].mpc_delivery_type_name : '-';
      },

      // display package
      showPackageTypes: function( $data, $beneficiary ) {
        var selected = [];
        $beneficiary.package_type_id = $data;
        if( $beneficiary.package_type_id ) {

          // selection
          selected = $filter('filter')( [{
            'package_type_id': 'standard',
            'package_type_name': 'Standard'
          }, {
            'package_type_id': 'non-standard',
            'package_type_name': 'Non-standard'
          }], { package_type_id: $beneficiary.package_type_id }, true );
          if ( selected.length ) {
            $beneficiary.package_type_name = selected[0].package_type_name;
          } else {
            selected.push({
              package_type_id: 'n_a',
              package_type_name: 'N/A'
            });
          }

        }

        return selected.length ? selected[0].package_type_name : '-';
      },

      // display category
      showCategory: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.category_type_id = $data;
        if($beneficiary.category_type_id) {
          selected = $filter('filter')( lists.category_types, { category_type_id: $beneficiary.category_type_id }, true);
          if( selected.length ) {
            $beneficiary.category_type_name = selected[0].category_type_name;
          }
        }
        return selected.length ? selected[0].category_type_name : '-';
      },

      // display beneficiary
      showBeneficiary: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.beneficiary_type_id = $data;
        if($beneficiary.beneficiary_type_id) {
          selected = $filter('filter')( lists.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id, cluster_id: $beneficiary.cluster_id }, true);
        }
        if ( selected.length ) {
          $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
          return selected[0].beneficiary_type_name
        } else {
          return '-';
        }
      },

      // display delivery
      showDelivery: function( $data, $beneficiary ) {
        var selected = [];
        $beneficiary.delivery_type_id = $data;
        if($beneficiary.delivery_type_id) {
          selected = $filter('filter')( lists.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
          $beneficiary.delivery_type_name = selected[0].delivery_type_name;
        }
        return selected.length ? selected[0].delivery_type_name : 'No Selection!';
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

      // cash
      showCash: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if( ( b.activity_type_id && b.activity_type_id.indexOf('cash') > -1 ) ||
            ( b.activity_description_id && ( b.activity_description_id.indexOf('cash') > -1 ||
              b.activity_description_id.indexOf('package') > -1 ||
              b.activity_description_id.indexOf( 'fsac_in_kind' ) > -1 ) ) ) {
            display = true;
          }
        });
        return display;
      },

      // cash
      showPackage: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if( 
            ( b.activity_description_id && ( 
              b.activity_description_id.indexOf('tent_distribution_2_tarps_package') > -1 ||
              b.activity_description_id.indexOf( 'rental_support_3_month_package' ) > -1 ||
              b.activity_description_id.indexOf( 'existing_shelter_upgrade_package' ) > -1 ||
              b.activity_description_id.indexOf( 'nfi_package' ) > -1 ||
              b.activity_description_id.indexOf( 'winterization_package' ) > -1 ||
              b.activity_description_id.indexOf( 'transitional_shelter_package' ) > -1) ) ) {
            display = true;
          }
        });
        return display;
      },

      // enable editing package
      enablePackage: function( b ) {
        var display = false;
        if (
          ( b.activity_description_id && ( 
              b.activity_description_id.indexOf( 'tent_distribution_2_tarps_package' ) > -1 ||
              b.activity_description_id.indexOf( 'rental_support_3_month_package' ) > -1 ||
              b.activity_description_id.indexOf( 'existing_shelter_upgrade_package' ) > -1 ||
              b.activity_description_id.indexOf( 'nfi_package' ) > -1 ||
              b.activity_description_id.indexOf( 'winterization_package' ) > -1 ||
              b.activity_description_id.indexOf( 'transitional_shelter_package' ) > -1) )
        ) {
           display = true;
        }
        return display;
      },

      // units
      showUnits: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if(
              ( b.cluster_id === 'eiewg' || b.cluster_id === 'fsac' || b.cluster_id === 'agriculture' ) ||
              ( b.activity_description_id && b.activity_description_id.indexOf( '_standard' ) === -1 &&
              ( b.activity_description_id.indexOf( 'education' ) > -1 ||
                b.activity_description_id.indexOf( 'training' ) > -1 ||
                b.activity_description_id.indexOf( 'cash' ) > -1 ||
                b.activity_description_id.indexOf( 'in_kind' ) > -1 ||
                b.activity_description_id.indexOf( 'voucher' ) > -1 ||
                b.activity_description_id.indexOf( 'package' ) > -1 ||
                b.activity_description_id.indexOf( 'assessment' ) > -1 ) )
            ) {
            display = true;
          }
        });
        return display;
      },

      // unit types
      showUnitTypes: function( lists, $data, $beneficiary ){
        var selected = [];
        $beneficiary.unit_type_id = $data;
        if($beneficiary.unit_type_id) {
          selected = $filter('filter')( lists.units, { unit_type_id: $beneficiary.unit_type_id }, true);
          if( selected.length ) {
            $beneficiary.unit_type_name = selected[0].unit_type_name;
          }
        }else{
          $beneficiary.unit_type_id = 'n_a';
          $beneficiary.unit_type_name = 'N/A';
        }
        return selected.length ? selected[0].unit_type_name : 'N/A';
      },

      // transfer_type_id
      showTransferTypes: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.transfer_type_id = $data;
        if($beneficiary.transfer_type_id) {
          selected = $filter('filter')( lists.transfers, { transfer_type_id: $beneficiary.transfer_type_id }, true);
          if( selected.length ) {
            $beneficiary.transfer_type_value = selected[0].transfer_type_value;
          }
        }else{
          $beneficiary.transfer_type_id = 0;
          $beneficiary.transfer_type_value = 0;
        }
        return selected.length ? selected[0].transfer_type_value : 0;
      },

      // esnfi
      showHouseholds: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if( b.cluster_id === 'cvwg' || 
                b.cluster_id === 'agriculture' || 
                b.cluster_id === 'esnfi' || 
                b.cluster_id === 'fsac' || 
                ( b.cluster_id === 'wash' && project.admin0pcode !== 'AF' ) ){
            display = true;
          }
        });
        return display;
      },

      // families
      showFamilies: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if( project.admin0pcode !== 'NG' && 
              ( b.cluster_id === 'wash' || b.activity_type_id === 'nutrition_education_training' ) ){
            display = true;
          }
        });
        return display;
      },

      // men
      showMen: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if( b.activity_type_id !== 'mch' &&
              (b.activity_type_id !== 'vaccination' || b.activity_description_id === 'vaccination_tt') &&
              b.activity_description_id !== 'antenatal_care' &&
              b.activity_description_id !== 'postnatal_care' &&
              b.activity_description_id !== 'skilled_birth_attendant' &&
              b.activity_description_id !== 'penta_3' &&
              b.activity_description_id !== 'measles' ){
            display = true;
          }
        });
        return display;
      },

      // women
      showWomen: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
          if( (b.activity_type_id !== 'vaccination' || b.activity_description_id === 'vaccination_tt') &&
              b.activity_description_id !== 'penta_3' &&
              b.activity_description_id !== 'measles' ){
            display = true;
          }
        });
        return display;
      },

      // eld men
      showEldMen: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
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
        return display;
      },

      // eld women
      showEldWomen: function( project ){
        var display = false;
        var l = project.target_beneficiaries;
        angular.forEach( l, function(b){
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
        return display;
      },

		};

	}]);
