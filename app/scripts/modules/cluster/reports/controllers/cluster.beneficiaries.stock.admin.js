/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterBenefeciariesStockAdminCtrl
 * @description
 * # ClusterBenefeciariesStockAdminCtrl;
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
    .controller('ClusterBenefeciariesStockAdminCtrl', [
        '$scope',
        '$q',
        '$http',
        '$location',
        '$route',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter',
        '$sce',
        'ngmUser',
        'ngmAuth',
        'ngmData',
        'ngmClusterLists', '$translate',
        function ($scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, $sce, ngmUser, ngmAuth, ngmData, ngmClusterLists, $translate) {

            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            // init empty model
            $scope.model = $scope.$parent.ngm.dashboard.model;

            $scope.report = {

                // parent
                ngm: $scope.$parent.ngm,

                // current user
                user: ngmUser.get(),
                userRestrictedRouteParams: ngmAuth.getRouteParams('ADMIN'),
                userMenuItems: ngmAuth.getMenuParams('ADMIN'),
                // report start
                startDate: moment($route.current.params.start).format('YYYY-MM-DD'),
                // report end
                endDate: moment($route.current.params.end).format('YYYY-MM-DD'),

                menu: [{
                    'id': 'search-region',
                    'icon': 'person_pin',
                    'title': $filter('translate')('region'),
                    'class': 'teal lighten-1 white-text',
                    'rows': [{
                        'title': 'HQ',
                        'param': 'adminRpcode',
                        'active': 'hq',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/' + $route.current.params.type
                    }, {
                        'title': 'AFRO',
                        'param': 'adminRpcode',
                        'active': 'afro',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/'+ $route.current.params.type+'/afro'
                    }, {
                        'title': 'AMER',
                        'param': 'adminRpcode',
                        'active': 'amer',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/'+ $route.current.params.type+'/amer'
                    }, {
                        'title': 'EMRO',
                        'param': 'adminRpcode',
                        'active': 'emro',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/'+ $route.current.params.type+'/emro'
                    }, {
                        'title': 'SEARO',
                        'param': 'adminRpcode',
                        'active': 'searo',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/'+ $route.current.params.type+'/searo'
                    }, {
                        'title': 'EURO',
                        'param': 'adminRpcode',
                        'active': 'euro',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/'+ $route.current.params.type+'/euro'
                    }, {
                        'title': 'WPRO',
                        'param': 'adminRpcode',
                        'active': 'wpro',
                        'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                        'href': '/desk/#/cluster/record-admin/'+ $route.current.params.type+'/wpro'
                    }
                    ]
                }],

                setTitle: function() {
                    title = $route.current.params.type ? $route.current.params.type:'Beneficiaries';
                    return title.toUpperCase()+' | RECORD ADMIN';
                },
                setSubtitle: function () {
                    // subtitle
                    subtitle = '';
                    // admin0
                    if ($scope.report.admin0pcode === 'hq') {
                        subtitle = 'ALL COUNTRY';
                    }

                    if ($scope.report.admin0pcode !== 'hq') {
                        if ($scope.report.admin0pcode === 'all'){
                            subtitle += $scope.report.adminRpcode.toUpperCase()
                        }else{
                            subtitle += $scope.report.admin0pcode.toUpperCase();
                        }
                        
                    }
                    // cluster
                    if ($scope.report.cluster_id === 'all') {
                        subtitle += ' | ALL';
                    } else {
                        subtitle += ' | ' + $scope.report.cluster_id.toUpperCase();
                    }
                    // org
                    if ($scope.report.organization_tag === 'all') {
                        subtitle += ' | ALL';
                    } else {
                        var org =  $scope.report.organization_tag ?  $scope.report.organization_tag.toUpperCase() : '';
                        subtitle += ' | ' + org ;
                    }
                    subtitle += ' | ' + ($route.current.params.type ? $route.current.params.type : 'Beneficiaries').toUpperCase();
                   return subtitle
                },
                setUrl: function () {

                    // if ADMIN
                    var path = $scope.report.getPath($scope.report.cluster_id, $scope.report.type, $scope.report.organization_tag);
                    // if current location is not equal to path
                    if (path !== $location.$$path) {
                        //
                        $location.path(path);
                    }

                },
                getPath: function (cluster_id,type,organization_tag){
                    var path = '/cluster/record-admin/' + type +
                        '/'+ $scope.report.adminRpcode.toLowerCase() +
                        '/' + $scope.report.admin0pcode.toLowerCase() +
                        '/' + cluster_id +
                        '/' + organization_tag +
                        '/' + $scope.report.startDate +
                        '/' + $scope.report.endDate;

                    return path;
                },
                // downloads
                getDownloads: function () {

                    // var downloads = [
                    //     {
                    //         type: 'csv',
                    //         color: 'blue lighten-2',
                    //         icon: 'group',
                    //         hover: $filter('translate')('download_beneficiary_data_as_csv'),
                    //         request: $scope.report.getRequestCsv({ csv: true, indicator: 'beneficiaries', report: 'file_beneficiary_data-extracted-from-' + $scope.report.startDate + '-to-' + $scope.report.endDate + '-extracted-' + moment().format('YYYY-MM-DDTHHmm') }),
                    //         metrics: $scope.report.getMetrics('beneficiaries', 'csv')
                    //     },
                    //     {
                    //         type: 'csv',
                    //         color: 'blue lighten-2',
                    //         icon: 'show_chart',
                    //         hover: $filter('translate')('download_stock_data_as_csv'),
                    //         request: $scope.report.getRequestCsv({ csv: true, indicator: 'stocks', report:'file_stock_data-extracted-from-' + $scope.report.startDate + '-to-' + $scope.report.endDate + '-extracted-' + moment().format('YYYY-MM-DDTHHmm') }),
                    //         metrics: $scope.report.getMetrics('stocks', 'csv')
                    //     }
                    // ]
                    var downloads = {
                        beneficiaries: [
                            {
                                type: 'csv',
                                color: 'blue lighten-2',
                                icon: 'group',
                                hover: $filter('translate')('download_beneficiary_data_as_csv'),
                                request: $scope.report.getRequestCsv({ csv: true, indicator: 'beneficiaries', report: 'file_beneficiary_data-extracted-from-' + $scope.report.startDate + '-to-' + $scope.report.endDate + '-extracted-' + moment().format('YYYY-MM-DDTHHmm') }),
                                metrics: $scope.report.getMetrics('beneficiaries', 'csv')
                            }
                        ],
                        stocks: [
                            {
                                type: 'csv',
                                color: 'blue lighten-2',
                                icon: 'show_chart',
                                hover: $filter('translate')('download_stock_data_as_csv'),
                                request: $scope.report.getRequestCsv({ csv: true, indicator: 'stocks', report: 'file_stock_data-extracted-from-' + $scope.report.startDate + '-to-' + $scope.report.endDate + '-extracted-' + moment().format('YYYY-MM-DDTHHmm') }),
                                metrics: $scope.report.getMetrics('stocks', 'csv')
                            }
                        ]
                    };
                    return downloads[$route.current.params.type];
                },
                getRequestList: function () {
                    var request = {
                        method: 'POST',
                        url: ngmAuth.LOCATION + '/api/cluster/indicator',
                        data: {
                            adminRpcode: $scope.report.adminRpcode,
                            admin0pcode: $scope.report.admin0pcode,
                            admin1pcode: 'all',
                            admin2pcode: 'all',
                            cluster_id: $scope.report.cluster_id,
                            organization_tag: $scope.report.organization_tag,
                            beneficiaries: ['all'],
                            start_date: $scope.report.startDate,
                            end_date: $scope.report.endDate,
                            indicator: $scope.report.type,
                            json:true,
                        }
                    }
                    return request;
                },
                getRequestCsv: function (obj) {
                    var request = {
                        method: 'POST',
                        url: ngmAuth.LOCATION + '/api/cluster/indicator',
                        data: {
                            adminRpcode: $scope.report.adminRpcode,
                            admin0pcode: $scope.report.admin0pcode,
                            admin1pcode: 'all',
                            admin2pcode: 'all',
                            cluster_id: $scope.report.cluster_id,
                            organization_tag: $scope.report.organization_tag,
                            beneficiaries: ['all'],
                            start_date: $scope.report.startDate,
                            end_date: $scope.report.endDate,
                        }
                    }
                    request.data = angular.merge(request.data, obj);
                    return request;
                },
                // metrics
                getMetrics: function (type, format) {

                    var request = {
                        method: 'POST',
                        url: ngmAuth.LOCATION + '/api/metrics/set',
                        data: {
                            organization: $scope.report.user.organization,
                            username: $scope.report.user.username,
                            email: $scope.report.user.email,
                            dashboard: 'cluster_beneficiaries_stocks_admin_' + type + '_' + $scope.report.cluster_id,
                            theme: 'cluster_beneficiaries_stocks_admin_' + type + '_' + $scope.report.cluster_id,
                            format: format,
                            url: $location.$$path
                        }
                    }

                    return request;

                },

                setMenu: function (userMenuItems){
                    if (userMenuItems.includes('adminRpcode')) {
                        $scope.model.menu = $scope.report.menu;
                    }
                    if (userMenuItems.includes('admin0pcode')) {
                        $scope.report.setCountryMenu();
                    }
                    if (userMenuItems.includes('cluster_id')) {
                        $scope.report.setClusterMenu();
                    }

                    if (userMenuItems.includes('organization_tag')) {
                        $scope.report.setOrgMenu()
                    }
                   
                },
                setCountryMenu: function () {
                    var menu = {
                        'hq': {
                            'id': 'search-country',
                            'icon': 'location_on',
                            'title': $filter('translate')('country_mayus'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Afghanistan',
                                'param': 'admin0pcode',
                                'active': 'af',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/af'
                            }, {
                                'title': 'Bangladesh',
                                'param': 'admin0pcode',
                                'active': 'bd',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/searo/bd'
                            }, {
                                'title': 'Cox Bazar',
                                'param': 'admin0pcode',
                                'active': 'cb',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/searo/cb'
                            }, {
                                'title': 'Democratic Republic of Congo',
                                'param': 'admin0pcode',
                                'active': 'cd',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type+'/afro/cd'
                            }, {
                                'title': 'Ethiopia',
                                'param': 'admin0pcode',
                                'active': 'et',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/afro/et'
                            }, {
                                'title': 'Somalia',
                                'param': 'admin0pcode',
                                'active': 'so',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/so'
                            }, {
                                'title': 'South Sudan',
                                'param': 'admin0pcode',
                                'active': 'ss',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/afro/ss'
                            }, {
                                'title': 'Syria',
                                'param': 'admin0pcode',
                                'active': 'so',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/sy'
                            }, {
                                'title': 'Ukraine',
                                'param': 'admin0pcode',
                                'active': 'ua',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/euro/ua'
                            }, {
                                'title': 'Yemen',
                                'param': 'admin0pcode',
                                'active': 'ye',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/ye'
                            }, {
                                'title': 'Nigeria',
                                'param': 'admin0pcode',
                                'active': 'ng',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/afro/ng'
                            },
                            {
                                'title': 'Colombia',
                                'param': 'admin0pcode',
                                'active': 'col',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/amer/col'
                            },
                            {
                                'title': 'Papua New Guinea',
                                'param': 'admin0pcode',
                                'active': 'pg',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/wpro/pg'
                            },
                            {
                                'title': 'Philippines',
                                'param': 'admin0pcode',
                                'active': 'phl',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/wpro/phl'
                            }]
                        },
                        'afro': {
                            'id': 'search-country',
                            'icon': 'person_pin',
                            'title': $filter('translate')('country_mayus'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Democratic Republic of Congo',
                                'param': 'admin0pcode',
                                'active': 'cd',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type+'/afro/cd'
                            }, {
                                'title': 'Ethiopia',
                                'param': 'admin0pcode',
                                'active': 'et',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/afro/et'
                            }, {
                                'title': 'Nigeria',
                                'param': 'admin0pcode',
                                'active': 'ng',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/afro/ng'
                            }, {
                                'title': 'South Sudan',
                                'param': 'admin0pcode',
                                'active': 'ss',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/afro/ss'
                            }]
                        },
                        'emro': {
                            'id': 'search-country',
                            'icon': 'person_pin',
                            'title': $filter('translate')('country_mayus'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Afghanistan',
                                'param': 'admin0pcode',
                                'active': 'af',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/af'
                            }, {
                                'title': 'Somalia',
                                'param': 'admin0pcode',
                                'active': 'so',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/so'
                            }, {
                                'title': 'Syria',
                                'param': 'admin0pcode',
                                'active': 'sy',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/sy'
                            }, {
                                'title': 'Yemen',
                                'param': 'admin0pcode',
                                'active': 'ye',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/emro/ye'
                            }]
                        },
                        'searo': {
                            'id': 'search-country',
                            'icon': 'person_pin',
                            'title': $filter('translate')('country_mayus'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Bangladesh',
                                'param': 'admin0pcode',
                                'active': 'bd',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/searo/bd'
                            }, {
                                'title': 'Cox Bazar',
                                'param': 'admin0pcode',
                                'active': 'cb',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/searo/cb'
                            }]
                        },
                        'euro': {
                            'id': 'search-country',
                            'icon': 'person_pin',
                            'title': $filter('translate')('country_mayus'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Ukraine',
                                'param': 'admin0pcode',
                                'active': 'ua',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/euro/ua'
                            },]
                        },
                        'amer': {
                            'id': 'search-country',
                            'icon': 'person_pin',
                            'title': $filter('translate')('country_mayus'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Colombia',
                                'param': 'admin0pcode',
                                'active': 'col',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/amer/col'
                            },]
                        },
                        'wpro': {
                            'id': 'search-country',
                            'icon': 'person_pin',
                            'title': $filter('translate')('country'),
                            'class': 'teal lighten-1 white-text',
                            'rows': [{
                                'title': 'Papua New Guinea',
                                'param': 'admin0pcode',
                                'active': 'pg',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/wpro/pg'
                            }, {
                                'title': 'Philippines',
                                'param': 'admin0pcode',
                                'active': 'phl',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/cluster/record-admin/' + $route.current.params.type +'/wpro/phl'
                            }]
                        }
                    }
                    $scope.model.menu.push(menu[$scope.report.adminRpcode]);
                },
                setClusterMenu:function(){
                    clusterRows = []
                    clusters = ngmClusterLists.getClusters($route.current.params.admin0pcode).filter(cluster => cluster.filter !== false)
                    if (clusters[0].cluster_id !== 'all') {
                        clusters.unshift({
                            cluster_id: 'all',
                            cluster: 'ALL',
                        });
                    }
                    // add cluster
                    angular.forEach(clusters, function (d, i) {

                        // admin URL
                        var path = $scope.report.getPath(d.cluster_id,$scope.report.type, $scope.report.organization_tag);

                        // menu rows
                        clusterRows.push({
                            'title': clusters[i].cluster,
                            'param': 'cluster_id',
                            'active': d.cluster_id,
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#' + path
                        });

                    });

                    $scope.model.menu.push({
                        'search': true,
                        'id': 'search-cluster',
                        'icon': 'camera',
                        'title': $filter('translate')('sector_mayus'),
                        'class': 'teal lighten-1 white-text',
                        'rows': clusterRows
                    });
                },
                setOrgMenu:function(){
                    orgRows = [];
                    $http($scope.report.getRequestList()).success(function (result) {
                        org = result.data.map((x) => {
                            var obj = {};
                            obj['organization'] = x.organization
                            obj['organization_tag'] = x.organization_tag
                            return obj
                        })
                        organizations = org.filter((value, index, self) => self.map(x => x.organization_tag).indexOf(value.organization_tag) == index);
                        organizations.unshift({ organization: "ALL", organization_tag: "all"})
                        organizations.forEach(function (d, i) {

                            // admin URL
                            var path = $scope.report.getPath($scope.report.cluster_id, $scope.report.type, d.organization_tag);

                            // menu rows
                            orgRows.push({
                                'title': d.organization,
                                'param': 'organization_tag',
                                'active': d.organization_tag,
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#' + path
                            });

                        });
                        $scope.model.menu.push({
                            'search': true,
                            'id': 'search-cluster-organization',
                            'icon': 'supervisor_account',
                            'title': $filter('translate')('organization'),
                            'class': 'teal lighten-1 white-text',
                            'rows': orgRows
                        });
                    })
                },

                init:function(){

                    // set
                    $scope.report.adminRpcode = $route.current.params.adminRpcode;
                    $scope.report.admin0pcode = $route.current.params.admin0pcode;
                    $scope.report.cluster_id = $route.current.params.cluster_id;
                    $scope.report.organization_tag = $route.current.params.organization_tag;
                    $scope.report.type = $route.current.params.type;

                    // override route params to user permitted zone params if any
                    if ($scope.report.userRestrictedRouteParams) {
                        for (const key of $scope.report.userRestrictedRouteParams) {
                            $scope.report[key] = $scope.report.user[key].toLowerCase()
                        }
                    }
                    $scope.report.setUrl();
                    $scope.model = {
                        name: 'cluster_beneficiaires_stock_admin',
                        header: {
                            div: {
                                'class': 'col s12 m12 l12 report-header',
                                style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
                            },
                            title: {
                                'class': 'col s12 m8 l8 report-title truncate',
                                style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
                                title: $scope.report.setTitle()
                            },
                            subtitle: {
                                'class': 'col s12 m7 l9 report-subtitle truncate',
                                'title': $scope.report.setSubtitle()
                            },
                            datePicker: {
                                'class': 'col s12 m5 l3',
                                dates: [{
                                    style: $rootScope.rtl ? 'float:right;' : 'float:left;',
                                    label: $filter('translate')('from'),
                                    format: 'd mmm, yyyy',
                                    min: '2017-01-01',
                                    max: $scope.report.endDate,
                                    currentTime: $scope.report.startDate,
                                    onClose: function () {
                                        // set date
                                        var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD');
                                        if (date !== $scope.report.startDate) {
                                            // set new date
                                            $scope.report.startDate = date;
                                            // URL
                                            var path = $scope.report.getPath($route.current.params.cluster_id, $route.current.params.type, $route.current.params.organization_tag);
                                            // update new date
                                            $location.path(path);

                                        }
                                    }
                                }, {
                                    style: $rootScope.rtl ? 'float:left;' : 'float:right;',
                                    label: $filter('translate')('to'),
                                    format: 'd mmm, yyyy',
                                    min: $scope.report.startDate,
                                    currentTime: $scope.report.endDate,
                                    onClose: function () {
                                        // set date
                                        var date = moment.utc(new Date(this.currentTime)).format('YYYY-MM-DD')
                                        if (date !== $scope.report.endDate) {
                                            // set new date
                                            $scope.report.endDate = date;
                                            // URL
                                            var path = $scope.report.getPath($route.current.params.cluster_id, $route.current.params.type, $route.current.params.organization_tag);
                                            // update new date
                                            $location.path(path);
                                        }
                                    }
                                }]
                            },
                            download: {
                                'class': 'col s12 m4 l4 hide-on-small-only',
                                downloads: $scope.report.getDownloads()
                            }
                        },
                        menu: [],
                        rows: [{
                            columns: [{
                                styleClass: 's12 m12 l12',
                                    widgets: [{
                                        type: 'html',
                                        config: {
                                            html: '<div class="row">'
                                                + '<div class="col s12 m12 l12">'
                                                + '<div style="padding:20px;">'
                                                + '<span class="left show-on-small hide-on-med-and-up" style="padding-top:8px;padding-bottom: 15px;">' + $filter('translate')('last_updated') + ': ' +'' + '</span>'
                                                + '<a class="btn-flat waves-effect waves-teal" href="#/cluster/organization' + '">'
                                                + '<i class="material-icons mirror left">keyboard_return</i>' + 'Back Organization'
                                                + '</a>'
                                                + '</div>'
                                                + '</div>'
                                                + '</div>'
                                        }
                                    }]
                                }]
                            },
                            {
                            columns: [{
                                styleClass: 's12 m12 l12',
                                    widgets: [{
                                        type: 'upload.beneficiaries.stock.report',
                                        config: {
                                            style: $scope.report.ngm.style,
                                            list_request: $scope.report.getRequestList(),
                                            getPreviousMonth: function () {
                                                // get dates
                                                var start_date = moment(new Date($scope.report.startDate)).utc().subtract(1, 'M').startOf('M').format('YYYY-MM-DD');
                                                var end_date = moment(new Date($scope.report.endDate)).utc().subtract(1, 'M').endOf('M').format('YYYY-MM-DD');
                                                // set dates
                                                $scope.report.startDate = start_date;
                                                $scope.report.endDate = end_date;
                                                // set path
                                                var path = $scope.report.getPath($route.current.params.cluster_id, $route.current.params.type, $route.current.params.organization_tag);
                                                // update new date
                                                $location.path(path);
                                            },
                                            getCurrentMonth: function () {
                                                // get dates
                                                var start_date = moment().utc().startOf('M').format('YYYY-MM-DD');
                                                var end_date = moment().utc().endOf('M').format('YYYY-MM-DD');
                                                // set dates
                                                $scope.report.startDate = start_date;
                                                $scope.report.endDate = end_date;
                                                // set path
                                                var path = $scope.report.getPath($route.current.params.cluster_id, $route.current.params.type, $route.current.params.organization_tag);
                                                // update new date
                                                $location.path(path);
                                            }
                                        }
                                    }]
                                }]
                            },
                            {
                                columns: [{
                                    styleClass: 's12 m12 l12',
                                    widgets: [{
                                        type: 'html',
                                        card: 'card-panel',
                                        style: 'padding:0px; height: 90px; padding-top:10px;',
                                        config: {
                                            // html: $scope.report.ngm.footer
                                            templateUrl: '/scripts/widgets/ngm-html/template/footer.html',
                                            lightPrimaryColor: $scope.ngm.style.lightPrimaryColor,
                                            defaultPrimaryColor: $scope.ngm.style.defaultPrimaryColor,
                                        }
                                    }]
                                }]
                            },
                        
                    ]
                    }

                    $scope.report.setMenu($scope.report.userMenuItems);
                    // assign to ngm app scope ( for menu )
                    $scope.report.ngm.dashboard.model = $scope.model;
                    setTimeout(() => {
                        $('.fixed-action-btn').floatingActionButton({ direction: 'left' });
                    }, 0);
                }
            };

            $scope.report.init();

            // get list
            // $http($scope.report.getRequest()).success(function (result) {
            //     console.log(result)
            // })
    }]);