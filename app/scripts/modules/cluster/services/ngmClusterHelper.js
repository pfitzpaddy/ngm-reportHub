/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module('ngmReportHub')
	.factory('ngmClusterHelper', function() {

		return {

			getIndicators: function() {
				return {
					boys: 0,
					girls: 0,
					men: 0,
					women: 0,
					penta3_vacc_male_under1: 0,
					penta3_vacc_female_under1: 0,
					antenatal_care: 0,
					postnatal_care: 0,
					skilled_birth_attendant: 0,
					male_referrals: 0,
					female_referrals: 0,
					conflict_trauma_treated: 0,
					capacity_building_sessions: 0,
					capacity_building_male: 0,
					capacity_building_female: 0,
					education_sessions: 0,
					education_male: 0,
					education_female: 0,
					notes: false
			  }
			}

		};
	});
