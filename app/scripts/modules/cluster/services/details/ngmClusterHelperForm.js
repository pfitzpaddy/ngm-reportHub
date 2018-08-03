/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperForm', [ '$http', '$filter', 'ngmClusterHelperTargetBeneficiaries', 'ngmAuth', function( $http, $filter, ngmClusterHelperTargetBeneficiaries, ngmAuth ) {

		return {

      // validate project type
      project_details_valid: function ( project ) {

      	// valid
      	this.project_details_valid_labels = [];

        if( !project.project_title ){
          this.project_details_valid_labels.push('ngm-project-name');
        }
        if( !project.project_start_date ){
          this.project_details_valid_labels.push('ngm-start-date');
        }
        if( !project.project_end_date ){
          this.project_details_valid_labels.push('ngm-end-date');
        }
        if( !project.project_budget_currency ){
          this.project_details_valid_labels.push('ngm-project-budget');
        }
        if( !project.project_description ){
          this.project_details_valid_labels.push('ngm-project-description');
        }

        // if NO labels details valid
        return !this.project_details_valid_labels.length;
      },

      // validate if ONE activity type
      activity_type_valid: function ( project ) {
        
        // valid
        this.activity_type_valid_labels = [];

        // activity types?
        if( typeof project.activity_type_check === 'undefined' ){
          this.activity_type_valid_labels.push('ngm-activity_type');
        }

        // if NO labels activities valid
        return !this.activity_type_valid_labels.length;
      },

      // validate project donor
      project_donor_valid: function ( project ) {

      	// valid
      	this.project_donor_valid_labels = [];

        // donor
        if( !project.project_donor_check ){
          this.project_donor_valid_labels.push('ngm-project_donor');
        }

        // if NO labels activities valid
        return !this.project_donor_valid_labels.length;
      },

      // validate if ALL target beneficairies valid
      target_beneficiaries_valid: function( project ){
        var rowComplete = 0;
        angular.forEach( project.target_beneficiaries, function( d, i ){
          if ( !ngmClusterHelperTargetBeneficiaries.rowSaveDisabled( d ) ){
            rowComplete++;
          }
        });
        if( rowComplete === project.target_beneficiaries.length ){
          return true;
        } else {
          return false;
        }
      },

      // validate id ALL target locations valid
      target_locations_valid: function( project ){
        var rowComplete = 0;
        angular.forEach( project.target_locations, function( d, i ){
          if ( d.admin1pcode && d.admin1name && d.admin2pcode && d.admin2name && d.site_name ){
            rowComplete++;
          }
          // hack for eiewg
          if ( d.admin0pcode === 'AF' && d.cluster_id === 'eiewg' ) { 
            if ( d.site_implementation_id && d.site_implementation_id === 'informal' && !d.site_hub_id ) {
              rowComplete--;
            }
          }
        });
        if( project.target_locations.length && ( rowComplete === project.target_locations.length ) ){
          return true;
        } else {
          return false;
        }
      },

      // validate form
      validate: function( project ){

        // run validation
        $('label').css({ 'color': '#26a69a'});
        $('#ngm-target_locations').css({ 'color': '#26a69a'});
        var scrollDiv;
        var a = this.project_details_valid( project );
        var b = this.activity_type_valid( project );
        var c = this.project_donor_valid( project );
        var d = this.target_beneficiaries_valid( project );
        var e = this.target_locations_valid( project );

        // locations invalid!
        if ( !e ) {
          $('#ngm-target_locations').css({ 'color': '#EE6E73'});
          scrollDiv = $('#ngm-target_locations');
        }

        if ( !d ) {
          $('#ngm-target_beneficiaries').css({ 'color': '#EE6E73'});
          scrollDiv = $('#ngm-target_beneficiaries');
        }

        // donor
        angular.forEach( this.project_donor_valid_labels, function( l,i ){
          $('label[for=' + l + ']').css({ 'color': '#EE6E73'});
          scrollDiv = $('#ngm-project_donor_label');
        });

        // activity types
        angular.forEach( this.activity_type_valid_labels, function( l,i ){
          $('label[for=' + l + ']').css({ 'color': '#EE6E73'});
          scrollDiv = $('#ngm-activity_type_label');
        });

        // project description
        angular.forEach( this.project_details_valid_labels, function( l,i ){
          $('label[for=' + l + ']').css({ 'color': '#EE6E73'});
          scrollDiv = $('#project_details_form');
        });

        // popup
        if ( a && b && c && d && e ) {
          $( '#save-modal' ).openModal( { dismissible: false } );
        } else {
          // scroll and error
          scrollDiv.animatescroll();
          Materialize.toast( 'Project contains errors!', 6000, 'error' );
        }

      }

		};

	}]);
