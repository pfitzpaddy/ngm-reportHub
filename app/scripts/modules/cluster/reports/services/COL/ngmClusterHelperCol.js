/**
 * @name ngmReportHub.factory:ngmClusterHelperCol
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperCol', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		// definition
		var ngmClusterHelperCol = {

			// update strategic objecgivres 
			updateIndicatorObjective:function( admin0pcode, beneficiary ){

				// if colombia
				if ( admin0pcode === 'COL' ){
					
					// wait for dropdown to process
					$timeout(function() {
						
						// default hrp
						var key = 'hrp';
						
						// if beneficiary_type
						//if( beneficiary.beneficiary_type_id === 'refugess_and_asylum_seekers' ){
						if( beneficiary.beneficiary_type_id === 'migrantes' ){

							key = 'rmrp';
						}
						
						// merge correct strategic objetives by key from activites.csv
						beneficiary = angular.merge( beneficiary, beneficiary.strategic_objective_descriptions[ key ] );

					}, 100 );

				}

			},
			searchUndafDesarrolloYPaz:function(scope,query){

	
					if (!scope.project.definition.undaf_desarrollo_paz) {
						scope.project.definition.undaf_desarrollo_paz = [];
					}
					return scope.project.lists.projectsclasifications[0].children.filter(function (el) {
						return (el.name_tag.toLowerCase().indexOf(query.toLowerCase()) > -1);
					});
			 	},

			searchAcuerdosDePaz:function(scope, query){

					if (!scope.project.definition.acuerdos_de_paz) {
						scope.project.definition.acuerdos_de_paz = [];
					}
					return scope.project.lists.projectsclasifications[1].children.filter(function (el) {
						return (el.name_tag.toLowerCase().indexOf(query.toLowerCase()) > -1);
					});
			 	},


			searchDACOECDDevelopmentAssistanceCommittee:function(scope, query){


					if (!scope.project.definition.dac_oecd_development_assistance_committee) {
						scope.project.definition.dac_oecd_development_assistance_committee = [];
					}
					return scope.project.lists.projectsclasifications[2].children.filter(function (el) {
						return (el.name_tag.toLowerCase().indexOf(query.toLowerCase()) > -1);
					});
			 	},

			searchODSObjetivosDeDesarrolloSostenible:function(scope, query){

				
					if (!scope.project.definition.ods_objetivos_de_desarrollo_sostenible) {
						scope.project.definition.ods_objetivos_de_desarrollo_sostenible = [];
					}
					return scope.project.lists.projectsclasifications[3].children.filter(function (el) {
						return (el.name_tag.toLowerCase().indexOf(query.toLowerCase()) > -1);
					});
			 	},

			run: function(scope, funct, data){
					return ngmClusterHelperCol[funct](scope, data);
			}

			

		}

		// return 
		return ngmClusterHelperCol;

	}]);
