/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.form.authentication', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('form.authentication', {
        title: 'ReportHub Authentication Form',
        description: 'ReportHub Authentication Form',
        controller: 'AuthenticationFormCtrl',
        templateUrl: '/scripts/app/views/view.html'
      });
  })
  .controller( 'AuthenticationFormCtrl', [
    '$scope',
    '$http',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    'ngmAuth',
    'ngmUser',
    'ngmData',
    'config',
    function( $scope, $http, $location, $timeout, $filter, $q, ngmAuth, ngmUser, ngmData, config){

      // project
      $scope.panel = {

        err: false,

        date : new Date(),

        user: ngmUser.get(),

        btnDisabled: false,

        btnActivate: config.user && config.user.status === 'deactivated' ? true : false,

        btnDeactivate: config.user && config.user.status === 'active' ? true : false,

        // adminRegion
        adminRegion: [
          { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'AF', admin0name: 'Afghanistan' },
          // { adminRpcode: 'SEARO', adminRname: 'SEARO', admin0pcode: 'BD', admin0name: 'Bangladesh' },
          { adminRpcode: 'SEARO', adminRname: 'SEARO', admin0pcode: 'CB', admin0name: 'Cox Bazar' },
          { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'CD', admin0name: 'Democratic Republic of Congo' },
          { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'ET', admin0name: 'Ethiopia' },
          { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'IQ', admin0name: 'Iraq' },
          { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'KE', admin0name: 'Kenya' },
          { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'NG', admin0name: 'Nigeria' },
          { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SO', admin0name: 'Somalia' },
          { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'SS', admin0name: 'South Sudan' },
          { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SY', admin0name: 'Syria' },
          { adminRpcode: 'EURO', adminRname: 'EURO', admin0pcode: 'UA', admin0name: 'Ukraine' },
          { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'UR', admin0name: 'Uruk' },
          { adminRpcode: 'AMER', adminRname: 'AMER', admin0pcode: 'COL', admin0name: 'Colombia'}
        ],

        // programme
        programme:[
          { programme_id: 'DRCWHOPHISP1', programme_name: 'DRCWHOPHISP1' },
          { programme_id: 'ETWHOIMOSUPPORTP1', programme_name: 'ETWHOIMOSUPPORTP1' },
          { programme_id: 'ETWHOIMOSUPPORTP2', programme_name: 'ETWHOIMOSUPPORTP2' },
          { programme_id: 'ETUSAIDOFDAIMOSUPPORTP1', programme_name: 'ETUSAIDOFDAIMOSUPPORTP1' },
          { programme_id: 'WWCDCCOOPERATIVEAGREEMENTP11', programme_name: 'WWCDCCOOPERATIVEAGREEMENTP11' },
          { programme_id: 'WWCDCCOOPERATIVEAGREEMENTP12', programme_name: 'WWCDCCOOPERATIVEAGREEMENTP12' },
        ],

        // duty stations
        dutyStations: localStorage.getObject( 'dutyStations'),

        // cluster
        cluster: {
          'cvwg': { cluster: 'MPC' },
          'agriculture': { cluster: 'Agriculture' },
          'cccm_esnfi': { cluster: 'CCCM - Shelter' },
          'coordination': { cluster: 'Coordination' },
          'education': { cluster: 'Education' },
          'eiewg': { cluster: 'EiEWG' },
          'emergency_telecommunications': { cluster: 'Emergency Telecommunications' },
          'esnfi': { cluster: 'ESNFI' },
          'fsac': { cluster: 'FSAC' },
          'health': { cluster: 'Health' },
          'logistics': { cluster: 'Logistics' },
          'nutrition': { cluster: 'Nutrition' },
          'protection': { cluster: 'Protection' },
          'rnr_chapter': { cluster: 'R&R Chapter' },
          'wash': { cluster: 'WASH' }
        },

        // login fn
        login: function( ngmLoginForm ){

          // if invalid
          if( ngmLoginForm.$invalid ){
            // set submitted for validation
            ngmLoginForm.$setSubmitted();
          } else {

            // login
            ngmAuth
              .login({ user: $scope.panel.user }).success( function( result ) {

              // db error!
              if( result.err || result.summary ){
                var msg = result.summary ? result.summary : result.msg;
                Materialize.toast( msg, 6000, 'error' );
              }

              // success
              if ( !result.err && !result.summary ){

                // go to default org page
                $location.path( result.app_home );
                $timeout( function(){
                  Materialize.toast( 'Welcome back ' + result.username + '!', 3000, 'note' );
                }, 2000);
              }

            });

          }
        },

        // open modal by id 
        openModal: function( modal ) {
          $( '#' + modal ).openModal({ dismissible: false });
        },

        // deactivate 
        updateStatus: function ( status ) {
          // set status
          $scope.panel.user.status = status;
          $scope.panel.update( true );
          
        },

        // delete user!
        delete: function () {
          
          // disable btns
          $scope.panel.btnDisabled = true;

          // return project
          ngmData.get({
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/delete',
            data: {
              user: $scope.panel.user
            }
          }).then( function( data ){
            
            if ( data.success ) {
              // success message
              Materialize.toast( 'Success! User Deleted!', 6000, 'success' );
              $timeout( function(){
                var path = ( ngmUser.get().organization === 'iMMAP' && ( ngmUser.get().admin0pcode === 'CD' || ngmUser.get().admin0pcode === 'ET' ) ) ? '/immap/team' : '/team';
                $location.path( path );
              }, 1000 );
            } else {
              Materialize.toast( 'Error! Try Again!', 6000, 'error' );
            }

          });
        },

        // update profile
        update: function( reload ) {

          // disable btns
          $scope.panel.btnDisabled = true;

          // merge adminRegion
          $scope.panel.user = angular.merge( {}, $scope.panel.user,
                                                  $filter('filter')( $scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0],
                                                  $filter('filter')( $scope.panel.programme, { programme_id: $scope.panel.user.programme_id }, true)[0] );

          // if immap and ET || CD
          if ( $scope.panel.user.site_name ) {
            var dutyStation = $filter('filter')( $scope.panel.dutyStations, { site_name: $scope.panel.user.site_name }, true)[0];
                delete dutyStation.id;
            // merge duty station
            $scope.panel.user = angular.merge( {}, $scope.panel.user, dutyStation );
          }

          // register
          ngmAuth
            .updateProfile({ user: $scope.panel.user }).success(function( result ) {

              // db error!
              if( result.err || result.summary ){
                var msg = result.msg ? result.msg : 'error!';
                Materialize.toast( msg, 6000, msg );
              }

              // success
              if ( result.success ){
                // set user and localStorage (if updating own profile)
                if ( $scope.panel.user.username === ngmUser.get().username ) {
                  $scope.panel.user = angular.merge( {}, $scope.panel.user, result.user );
                  ngmUser.set( $scope.panel.user );
                }
                // success message
                Materialize.toast( 'Success! Profile updated!', 6000, 'success' );
                $timeout( function(){
                  
                  // activate btn
                  $scope.panel.btnDisabled = false;

                  // redirect to team view and page refresh
                  if ( reload ) {
                    var path = ( ngmUser.get().organization === 'iMMAP' && ( ngmUser.get().admin0pcode === 'CD' || ngmUser.get().admin0pcode === 'ET' ) ) ? '/immap/team' : '/team';
                    $location.path( path );
                  }
                }, 1000 );
              }

            });
        },

        // register fn
        register: function( ngmRegisterForm ){

          // merge adminRegion
          $scope.panel.user = angular.merge( {}, $scope.panel.user,
                                                  $filter('filter')( $scope.panel.programme, { programme_id: $scope.panel.user.programme_id }, true)[0],
                                                  $filter('filter')( $scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0],
                                                  $scope.panel.cluster[ $scope.panel.user.cluster_id ] );

          // if immap and ET || CD
          if ( $scope.panel.user.site_name ) {
            var dutyStation = $filter('filter')( $scope.panel.dutyStations, { site_name: $scope.panel.user.site_name }, true)[0];
                delete dutyStation.id;
            // merge duty station
            $scope.panel.user = angular.merge( {}, $scope.panel.user, dutyStation );
          }

          // register
          ngmAuth
            .register({ user: $scope.panel.user }).success(function( result ) {

            // db error!
            if( result.err || result.summary ){
              var msg = result.summary ? result.summary : result.msg;
              Materialize.toast( msg, 6000, 'error' );
            }

            // success
            if ( !result.err && !result.summary ){
              // go to default org page
              $location.path( result.app_home );
              $timeout( function(){
                Materialize.toast( 'Welcome ' + result.username + ', time to create a Project!', 3000, 'success' );
              }, 2000);
            }

          });

        },

        // register fn
        passwordResetSend: function( ngmResetForm ){

          // if $invalid
          if(ngmResetForm.$invalid){
            // set submitted for validation
            ngmResetForm.$setSubmitted();
          } else {

            // user toast msg
            $timeout(function(){
              Materialize.toast('Your Email Is Being Prepared!', 3000, 'note');
            }, 400);

            // resend password email
            ngmAuth.passwordResetSend({
                user: $scope.panel.user,
                url: ngmAuth.LOCATION + '/desk/#/cluster/find/'
              }).success( function( result ) {

                // go to password reset page
                $( '.carousel' ).carousel( 'prev' );

                // user toast msg
                $timeout(function(){
                  Materialize.toast('Email Sent! Please Check Your Inbox', 3000, 'success');
                }, 400);

              }).error(function( err ) {

                // set err
                $scope.panel.err = err;

                // update
                $timeout(function(){
                  Materialize.toast( err.msg, 6000, 'error' );
                }, 400);
              });
          }

        },

        // register fn
        passwordReset: function( ngmResetPasswordForm, token ){

          // if $invalid
          if(ngmResetPasswordForm.$invalid){
            // set submitted for validation
            ngmResetPasswordForm.$setSubmitted();
          } else {

            // register
            ngmAuth.passwordReset({ reset: $scope.panel.user, token: token })
              .success( function( result ) {

              // go to default org page
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast( 'Welcome back ' + result.username + '!', 3000, 'note' );
              }, 2000);


            }).error(function(err) {
              // update
              $timeout(function(){
                Materialize.toast( err.msg, 6000, 'error' );
              }, 1000);
            });
          }

        },

        // RnR chapter validation
        organizationDisabled: function(){

          var disabled = true;
          if ( $scope.panel.user && $scope.panel.user.admin0pcode && $scope.panel.user.cluster_id && $scope.panel.user.organization_name ) {
            // not R&R Chapter
            if ( $scope.panel.user.cluster_id !== 'rnr_chapter' ) {
              disabled = false;
            } else {
              if ( $scope.panel.user.organization === 'UNHCR' || $scope.panel.user.organization === 'IOM' ) {
                disabled = false;
              } else {
                disabled = true;
              }
            }
          }
          return disabled;
        },

        // select org
        onOrganizationSelected: function(){
          // filter
          $scope.select = $filter( 'filter' )( $scope.panel.organizations, { organization: $scope.panel.user.organization }, true );
          // merge org
          var org = angular.copy( $scope.select[0] );
          delete org.id;
          angular.merge( $scope.panel.user, org );

          // update home page for iMMAP Ethiopia
          if ( $scope.panel.user.organization === 'iMMAP' ) {
            // add defaults as admin
            // $scope.panel.user.app_home = '/immap/';
            $scope.panel.user.app_home = '/cluster/admin/' + $scope.panel.user.adminRpcode.toLowerCase() + '/' + $scope.panel.user.admin0pcode.toLowerCase();
            $scope.panel.user.roles = [ 'ADMIN', 'USER' ];
            
          } else {
            delete $scope.panel.user.app_home;
          }

          // validate
          if ( $scope.panel.user && $scope.panel.user.organization_name ) {
            // not R&R Chapter
            if ( $scope.panel.user.cluster_id !== 'rnr_chapter' ) {
              // update icon
              $( '.organization_symbol' ).css({ 'color': 'teal' });
              // toast
              Materialize.toast( org.organization + '<br/>' + org.organization_name + ' Selected...', 4000, 'note' );
            } else {
              if ( $scope.panel.user.organization === 'UNHCR' || $scope.panel.user.organization === 'IOM' ) {
                // update icon
                $( '.organization_symbol' ).css({ 'color': 'teal' });
                // toast
                Materialize.toast( org.organization + '<br/>' + org.organization_name + ' Selected...', 4000, 'note' );
              } else {
                Materialize.toast( 'Only UNHCR or IOM Can Register in R&R Chapter!', 6000, 'error' );
              }
            }
          }
        }

      }

      // fetch duty stations
      if ( !localStorage.getObject( 'dutyStations') ) {
        // activities list
        var getDutyStations = {
          method: 'GET',
          url: ngmAuth.LOCATION + '/api/list/getDutyStations'
        }
        // send request
        $q.all([ $http( getDutyStations ) ] ).then( function( results ){
          localStorage.setObject( 'dutyStations', results[0].data );
          $scope.panel.dutyStations = results[0].data;
        });

      }

      // if config user
      if ( config.user ) {
        $scope.panel.user = {};
      }
      // merge defaults with config
      $scope.panel = angular.merge( {}, $scope.panel, config );

      // get organizations
      // if ( !localStorage.getObject( 'organizations') ){

        // set
        $http.get( ngmAuth.LOCATION + '/api/list/organizations' ).then(function( organizations ){
          localStorage.setObject( 'organizations', organizations.data );
          $scope.panel.organizations = organizations.data;
          $timeout(function() {
            $( 'select' ).material_select();
          }, 400);
        });

      // } else {

        // set
        // $scope.panel.organizations = localStorage.getObject( 'organizations');
        // $timeout(function() {
        //   $( 'select' ).material_select();
        // }, 100);

      // }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // on change update icon color
          $( '#ngm-country' ).on( 'change', function() {
            if( $( this ).find( 'option:selected' ).text() ) {
              $( '.country' ).css({ 'color': 'teal' });
              $( 'select' ).material_select();
            }
          });

          // on change update icon color
          $( '#ngm-cluster' ).on( 'change', function() {
            if ( $( this ).find( 'option:selected' ).text() ) {
              $( '.cluster' ).css({ 'color': 'teal' });
            }
          });

        }, 900 );

      });

    }

]);
