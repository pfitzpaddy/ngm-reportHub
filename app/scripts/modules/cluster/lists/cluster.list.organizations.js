/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectProjectsCtrl
 * @description
 * # ClusterProjectProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
    .controller('ListOrgCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', '$translate', '$filter', '$rootScope', 'ngmClusterLists', function ($scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper, $translate, $filter, $rootScope, ngmClusterLists) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // init empty model
        $scope.model = $scope.$parent.ngm.dashboard.model;

        // report object
        $scope.list = {

            // ngm
            ngm: $scope.$parent.ngm,

            // user
            user: ngmUser.get(),

            // init
            init: function () {

                // report dashboard model
                $scope.model = {
                    name: 'cluster_project_list',
                    header: {
                        div: {
                            'class': 'col s12 m12 l12 report-header',
                            style: 'border-bottom: 3px ' + $scope.list.ngm.style.defaultPrimaryColor + ' solid;'
                        },
                        title: {
                            'class': 'col s12 m9 l9 report-title truncate',
                            style: 'font-size: 3.4rem; color: ' + $scope.list.ngm.style.defaultPrimaryColor,
                            title: 'Organizations | ' + $scope.list.title
                        },
                        subtitle: {
                            'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
                            title: 'List Organizations For ' + $scope.list.title
                        },
                        download: {
                            'class': 'col s12 m3 l3 hide-on-small-only',
                            downloads: [
                                {
                                    type: 'csv',
                                    color: 'blue lighten-2',
                                    icon: 'assignment',
                                    hover: 'Download Organization CSV',
                                    request: {
                                        method: 'GET',
                                        url: ngmAuth.LOCATION + '/api/list/organizationsCSV',
                                        params: {
                                           admin0pcode: $route.current.params.admin0pcode
                                        },
                                        data:{
                                            report: 'list_organization_' + $route.current.params.admin0pcode,
                                            csv: true
                                        } 
                                    },
                                    metrics: {
                                        method: 'POST',
                                        url: ngmAuth.LOCATION + '/api/metrics/set',
                                        data: {
                                            organization: $scope.list.user.organization,
                                            username: $scope.list.user.username,
                                            email: $scope.list.user.email,
                                            dashboard: 'organization list',
                                            theme: 'list_organizations',
                                            format: 'csv',
                                            url: $location.$$path
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    menu: [],
                    rows: [{
                        columns: [{
                            styleClass: 's12 m12 l12',
                            widgets: [{
                                type: 'html',
                                card: 'white grey-text text-darken-2',
                                style: 'padding: 20px;',
                                config: {
                                    html: '<a class="btn-flat waves-effect waves-teal left hide-on-small-only" href="#/cluster/lists/admin"><i class="material-icons left">keyboard_return</i> Back To List </a>'
                                }
                            }]
                        }]
                    }, {
                        columns: [{
                            styleClass: 's12 m12 l12',
                            widgets: [{
                                type: 'form.organization.list',
                                style: 'padding:0px; height: 90px; padding-top:10px;',
                                config: {
                                    style: $scope.list.ngm.style,
                                    organization: $scope.list.organizations,
                                    admin0pcode: $route.current.params.admin0pcode
                                }
                            }]
                        }]
                    }, {
                        columns: [{
                            styleClass: 's12 m12 l12',
                            widgets: [{
                                type: 'html',
                                card: 'card-panel',
                                style: 'padding:0px; height: 90px; padding-top:10px;',
                                config: {
                                    html: $scope.list.ngm.footer
                                }
                            }]
                        }]
                    }]
                };

                // assign to ngm app scope
                $scope.list.ngm.dashboard.model = $scope.model;

            }

        }
        // run page
        ngmData.get({
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/organizations'
          }).then(function(org){
              if(org.length){
                  country = $route.current.params.admin0pcode.toUpperCase()
                  $scope.list.organizations = org;
                  if(country !== 'ALL'){
                      $scope.list.organizations = org.filter(x => x.admin0pcode.indexOf(country) > -1 || x.admin0pcode.indexOf('ALL') > -1 || x.organization_type === 'International NGO' || x.organization_type === 'United Nations' );
                  }
                  $scope.list.title = $route.current.params.admin0pcode.toUpperCase();
                  setTimeout(() => {
                      $('.fixed-action-btn').floatingActionButton({ direction: 'left' });
                  }, 0);
                  // init
                  $scope.list.init();
              }
          })
        // $scope.list.organizations = ngmClusterLists.getOrganizations($route.current.params.admin0pcode.toUpperCase())
        // console.log($scope.list.organizations)
        // $scope.list.title = $route.current.params.admin0pcode.toUpperCase();
        // // init
        // $scope.list.init();

    }]);
