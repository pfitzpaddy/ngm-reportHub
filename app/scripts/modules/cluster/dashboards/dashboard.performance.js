/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardPerformanceCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
    .controller('DashboardPerformanceCtrl', [
        '$scope',
        '$q',
        '$http',
        '$location',
        '$route',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter',
        'ngmUser',
        'ngmAuth',
        'ngmData',
        'ngmClusterHelper',
        'ngmClusterLists',
        'ngmLists',
        '$translate',
        '$filter',
        function ($scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, ngmLists, $translate, $filter) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            // init empty model
            $scope.model = $scope.$parent.ngm.dashboard.model;

            // create dews object
            $scope.dashboard = {

                // parent
                ngm: $scope.$parent.ngm,

                // current user
                user: ngmUser.get(),

                // report period start
                startDate: moment($route.current.params.start).format('YYYY-MM-DD'),//moment().format('YYYY-MM-DD'),

                // report period end
                endDate: moment($route.current.params.end).format('YYYY-MM-DD'),//moment().format('YYYY-MM-DD'),

                title: $route.current.params.admin0pcode.toUpperCase()+' | Performance',
                subtitle: 'Performance for ' + $route.current.params.admin0pcode.toUpperCase(),
                setMenu: function(){
                   countryMenu = [{
                        'id': 'search-country',
                        'icon': 'location_on',
                        'title': $filter('translate')('country_mayus'),
                        'class': 'teal lighten-1 white-text',
                        'rows': [
                            {
                                'title': 'ALL',
                                'param': 'admin0pcode',
                                'active': 'all',
                                'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                'href': '/desk/#/performance/all/' + $scope.dashboard.hrp + '/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                            },{
                            'title': 'Afghanistan',
                            'param': 'admin0pcode',
                            'active': 'af',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/af/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Bangladesh',
                            'param': 'admin0pcode',
                            'active': 'bd',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/bd/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Cox Bazar',
                            'param': 'admin0pcode',
                            'active': 'cb',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/cb/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Democratic Republic of Congo',
                            'param': 'admin0pcode',
                            'active': 'cd',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/cd/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Ethiopia',
                            'param': 'admin0pcode',
                            'active': 'et',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/et/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Somalia',
                            'param': 'admin0pcode',
                            'active': 'so',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/so/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'South Sudan',
                            'param': 'admin0pcode',
                            'active': 'ss',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/ss/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Syria',
                            'param': 'admin0pcode',
                            'active': 'so',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/sy/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Ukraine',
                            'param': 'admin0pcode',
                            'active': 'ua',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/ua/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Yemen',
                            'param': 'admin0pcode',
                            'active': 'ye',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/ye/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }, {
                            'title': 'Nigeria',
                            'param': 'admin0pcode',
                            'active': 'ng',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/ng/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        },
                        {
                            'title': 'Colombia',
                            'param': 'admin0pcode',
                            'active': 'col',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#performance/col/' +$scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        },
                        {
                            'title': 'Papua New Guinea',
                            'param': 'admin0pcode',
                            'active': 'pg',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/pg/' + $scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        },
                        {
                            'title': 'Philippines',
                            'param': 'admin0pcode',
                            'active': 'phl',
                            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                            'href': '/desk/#/performance/phl/' + $scope.dashboard.hrp+'/'+ $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                        }]
                    },{
                           'id': 'search-country',
                           'icon': 'location_on',
                           'title': 'HRP/Timestamp',
                           'class': 'teal lighten-1 white-text',
                           'rows': [{
                               'title': 'TRUE',
                               'param': 'hrp',
                               'active': 'true',
                               'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                               'href': '/desk/#/performance/'+$scope.dashboard.admin0pcode+'/' +'true/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                           }, {
                               'title': 'FALSE',
                               'param': 'hrp',
                               'active': 'false',
                               'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                               'href': '/desk/#/performance/'+$scope.dashboard.admin0pcode+'/' + 'false/' + $scope.dashboard.startDate + '/' + $scope.dashboard.endDate
                           }]
                    }];
                    $scope.model.menu = countryMenu;
                },

                

                getPath: function () {

                    var path = '/performance/' + $scope.dashboard.admin0pcode +
                        '/' + $scope.dashboard.hrp+
                        '/' + $scope.dashboard.startDate +
                        '/' + $scope.dashboard.endDate;

                    return path;
                },

                // set dashboard
                // init: function (data) {
                init: function () {
                    var startDate = $route.current.params.start;
                    var endDate = $route.current.params.end;
                    var admin0pcode = $route.current.params.admin0pcode
                    var hrp = $route.current.params.hrp
                    var req = '/api/metrics/getPerformanceStatistics?admin0pcode=' + admin0pcode + '&hrp=' + hrp + '&start_date=' + startDate + '&end_date=' + endDate;
                    // var data_user_by_cluster = data.users_by_cluster.map(x=>x.count);
                    // var cluster_user_by_cluster = data.users_by_cluster.map(x => x.cluster);
                    // var registered_data_user_by_cluster = data.users_registered_by_cluster.map(x => x.count);
                    // var registered_cluster_user_by_cluster = data.users_registered_by_cluster.map(x => x.cluster);
                    
                    // model
                    $scope.model = {
                        name: 'cluster_dashboard',
                        header: {
                            div: {
                                'class': 'col s12 m12 l12 report-header',
                                'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
                            },
                            title: {
                                'class': 'col s12 m8 l8 report-title truncate',
                                'style': 'color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
                                'title': $scope.dashboard.title,
                            },
                            subtitle: {
                                'class': 'col hide-on-small-only report-subtitle truncate m7 l9',
                                'title': $scope.dashboard.subtitle,
                            },
                            datePicker: {
                                'class': 'col s12 m5 l3',
                                dates: [{
                                    style: 'float:left;',
                                    label: $filter('translate')('from'),
                                    format: 'd mmm, yyyy',
                                    min: '2017-01-01',
                                    max: $scope.dashboard.endDate,
                                    currentTime: $scope.dashboard.startDate,
                                    onClose: function () {
                                        // set date
                                        var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
                                        if (date !== $scope.dashboard.startDate) {
                                            
                                            // set new date
                                            $scope.dashboard.startDate = date;
                                            var path = $scope.dashboard.getPath();
                                            $location.path(path);
                                        }
                                    }
                                }, {
                                    style: 'float:right',
                                    label: $filter('translate')('to'),
                                    format: 'd mmm, yyyy',
                                    min: $scope.dashboard.startDate,
                                    currentTime: $scope.dashboard.endDate,
                                    onClose: function () {
                                        // set date
                                        var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
                                        if (date !== $scope.dashboard.endDate) {
                                            // set new date
                                            $scope.dashboard.endDate = date;
                                            var path = $scope.dashboard.getPath();
                                            $location.path(path);
                                        }
                                    }
                                }]
                            }
                        },
                        menu: [],
                        rows: [{
                            columns: [{
                                styleClass: 's12 m12 l12',
                                widgets: [{
                                    type: 'html',
                                    card: 'white grey-text text-darken-2',
                                    style: 'margin:15px; padding-bottom:30px;',
                                    config: {
                                        id: 'dashboard-btn-performance',
                                        getPreviousMonth: function () {
                                            // get dates
                                            var start_date = moment(new Date($scope.dashboard.startDate)).utc().subtract(1, 'M').startOf('M').format('YYYY-MM-DD');
                                            var end_date = moment(new Date($scope.dashboard.endDate)).utc().subtract(1, 'M').endOf('M').format('YYYY-MM-DD');
                                            // set dates
                                            $scope.dashboard.startDate = start_date;
                                            $scope.dashboard.endDate = end_date;
                                            // set path
                                            var path = $scope.dashboard.getPath();
                                            // update new date
                                            $location.path(path);
                                        },
                                        getCurrentMonth: function () {
                                            // get dates
                                            var start_date = moment().utc().startOf('M').format('YYYY-MM-DD');
                                            var end_date = moment().utc().endOf('M').format('YYYY-MM-DD');
                                            // set dates
                                            $scope.dashboard.startDate = start_date;
                                            $scope.dashboard.endDate = end_date;
                                            // set path
                                            var path = $scope.dashboard.getPath();
                                            // update new date
                                            $location.path(path);
                                        },
                                        templateUrl: '/scripts/widgets/ngm-html/template/performance-btn.html'
                                    }
                                }]
                            }]
                        },{
                                columns: [{
                                    styleClass: 's12 m12 l12',
                                    widgets: [{
                                        type: 'html',
                                        card: 'white grey-text text-darken-2',
                                        style: 'margin:15px; padding-bottom:30px;',
                                        config: {
                                            id: 'performance_page',
                                            // data: data,
                                            templateUrl: '/scripts/widgets/ngm-html/template/performance.html',
                                            chartConfigUserbyCluster: {
                                                options: {
                                                    chart: {
                                                        type: 'column',
                                                    },
                                                    tooltip: {
                                                        enabled: true
                                                    },
                                                    exporting: {
                                                        enabled: false
                                                    },
                                                    legend: {
                                                        enabled: false,
                                                    },
                                                    title: {
                                                        text: 'User By Cluster'
                                                    },
                                                    xAxis: {
                                                        tickWidth: 0,
                                                        labels: {
                                                            style: {
                                                                color: '#000',
                                                            }
                                                        },
                                                        categories: []//cluster_user_by_cluster,
                                                    },
                                                    yAxis: {
                                                        title: {
                                                            text: 'Number User'
                                                        },
                                                    }
                                                },
                                                credits: {
                                                    enabled: false
                                                },
                                                series: [{
                                                    name: 'User',
                                                    data: []//data_user_by_cluster
                                                }],
                                            },
                                            chartConfigRegisterdUserbyCluster: {
                                                options: {
                                                    chart: {
                                                        type: 'column',
                                                    },
                                                    tooltip: {
                                                        enabled: true
                                                    },
                                                    exporting: {
                                                        enabled: false
                                                    },
                                                    legend: {
                                                        enabled: false,
                                                    },
                                                    title: {
                                                        text: 'User Registered By Cluster'
                                                    },
                                                    xAxis: {
                                                        tickWidth: 0,
                                                        labels: {
                                                            style: {
                                                                color: '#000',
                                                            }
                                                        },
                                                        categories: []//registered_cluster_user_by_cluster,
                                                    },
                                                    yAxis: {
                                                        title: {
                                                            text: 'Number User'
                                                        },
                                                    }
                                                },
                                                credits: {
                                                    enabled: false
                                                },
                                                series: [{
                                                    name: 'User',
                                                    data: []//registered_data_user_by_cluster
                                                }],
                                            },
                                            setChart: function(data,chart,prop){
                                                var getValue = function (data, prop, prop_src){
                                                    x = data[prop].map(x => x[prop_src])
                                                    return x
                                                }
                                                chart.options.xAxis.categories = getValue(data, prop, 'cluster');
                                                chart.series[0].data = getValue(data, prop, 'count');
                                                return chart
                                            },
                                            request: { method: 'GET', url: ngmAuth.LOCATION + req }
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
                                            templateUrl: '/scripts/widgets/ngm-html/template/footer.html',
                                            lightPrimaryColor: $scope.ngm.style.lightPrimaryColor,
                                            defaultPrimaryColor: $scope.ngm.style.defaultPrimaryColor,
                                        }
                                    }]
                                }]
                            }]
                    }
                    $scope.dashboard.admin0pcode = $route.current.params.admin0pcode
                    $scope.dashboard.hrp = $route.current.params.hrp
                    $scope.dashboard.setMenu();
                    $scope.dashboard.ngm.dashboard.model = $scope.model;
                }

            };

            // var startDate= $route.current.params.start;
            // var endDate = $route.current.params.end;
            // var admin0pcode = $route.current.params.admin0pcode
            // var hrp = $route.current.params.hrp
            // var req = '/api/metrics/getPerformanceStatistics?admin0pcode=' + admin0pcode+'&hrp='+hrp+'&start_date='+startDate+'&end_date='+endDate;
            // ngmData
            //     .get({ method: 'GET', url: ngmAuth.LOCATION + req })
            //     .then(function (data) {
            //         // load data
            //         $scope.dashboard.init(data.data);
                   
            //         $scope.dashboard.admin0pcode = $route.current.params.admin0pcode
            //         $scope.dashboard.hrp = $route.current.params.hrp
            //         $scope.dashboard.setMenu();
            //         $scope.dashboard.ngm.dashboard.model = $scope.model;
                    
            //     });
            // $scope.$on('$includeContentLoaded', function (eve, htmlpath) {
            //     if ($rootScope.$broadcast("preload",{show:true}))
            //     if (htmlpath === '/scripts/widgets/ngm-html/template/performance.html'){
            //         $rootScope.$broadcast("preload", { show: false });
            //     }
            // });
            $scope.dashboard.init();

                
           

            

        }

    ]);