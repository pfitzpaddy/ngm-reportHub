/**
 * @name ngmReportHub.factory:ngmCbBeneficiaries
 * @description
 * # ngmCbBeneficiaries
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  .factory( 'ngmCbBeneficiaries', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

    // ngmCbBeneficiaries
		ngmCbBeneficiaries = {
      demographics:{
        households: 4.29,
        boys: 27.5,
        girls: 26.7,
        men: 18.8,
        women: 23.3,
        elderly_men: 1.7,
        elderly_women: 1.9
      }
    }

    // return
    return ngmCbBeneficiaries;

	}]);