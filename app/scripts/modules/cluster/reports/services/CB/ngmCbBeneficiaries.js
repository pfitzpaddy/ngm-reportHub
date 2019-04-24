/**
 * @name ngmReportHub.factory:ngmCbBeneficiaries
 * @description
 * # ngmCbBeneficiaries
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  .factory( 'ngmCbBeneficiaries', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {


    // https://data2.unhcr.org/api/population/get?widget_id=114700&sv_id=34&population_group=4803

    // https://data2.unhcr.org/api/population/get/demography?widget_id=114702&sv_id=34&population_group=4803

    // ngmCbBeneficiaries
		ngmCbBeneficiaries = {
      
      // values
      ratios: {
        households: 4.34,
        boys: 0.275,
        girls: 0.267,
        men: 0.188,
        women: 0.233,
        elderly_men: 0.017,
        elderly_women: 0.019
      },

      // calculate SADD via HHs
      setSadd: function ( beneficiary ) {

        // if households
        if ( beneficiary.households && beneficiary.cluster_id && beneficiary.cluster_id === 'fss' ) {
          var popn = beneficiary.households * ngmCbBeneficiaries.ratios.households;
          beneficiary.boys = Math.round( popn * ngmCbBeneficiaries.ratios.boys );
          beneficiary.girls = Math.round( popn * ngmCbBeneficiaries.ratios.girls );
          beneficiary.men = Math.round( popn * ngmCbBeneficiaries.ratios.men );
          beneficiary.women = Math.round( popn * ngmCbBeneficiaries.ratios.women );
          beneficiary.elderly_women = Math.round( popn * ngmCbBeneficiaries.ratios.elderly_men );
          beneficiary.elderly_men = Math.round( popn * ngmCbBeneficiaries.ratios.elderly_women );
        }

      }

    }

    // return
    return ngmCbBeneficiaries;

	}]);