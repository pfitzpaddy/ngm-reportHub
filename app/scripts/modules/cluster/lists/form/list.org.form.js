angular.module('ngm.widget.form.organization.list', ['ngm.provider'])
    .config(function (dashboardProvider) {
        dashboardProvider
            .widget('form.organization.list', {
                title: 'Organization Form List',
                description: 'DOrganization Form List',
                controller: 'OrganizationFormListCtrl',
                templateUrl: '/scripts/modules/cluster/views/lists/organization.list.html'
            });
    })
    .controller('OrganizationFormListCtrl', [
        '$scope',
        'config',
        'ngmClusterLists',
        'ngmUser',
        'ngmAuth',
        'ngmData',
        '$http',
        '$timeout',
        function (
            $scope,
            config,
            ngmClusterLists,
            ngmUser,
            ngmAuth,
            ngmData,
            $http,
            $timeout
        ) {

            $scope.master = {
                // current user
                user: ngmUser.get(),
                organization: config.organization,
                clusters: ngmClusterLists.getClusters(ngmUser.get().admin0pcode),
                itemsPerPage: 9,
                listId: 'ngm-paginate-' + Math.floor((Math.random() * 1000000)),
                search: {
                    filter: '',
                    focused: false
                },
                editedOrg:{},
                removeOrg:{},
                openAddModal: function (modal) {
                    $('#add-org-modal').modal({ dismissible: false });
                    $('#add-org-modal').modal('open');
                    $scope.addOrganizationAtribute = {
                        organization_name: '',
                        organization_type: '',
                        organization_tag:'',
                        organization: '',
                        admin0pcode: '',
                    };

                },
                removeOrgModal:function(org){
                    $scope.master.removeOrg = org;
                    $('#remove-org-modal').modal({ dismissible: false });
                    $('#remove-org-modal').modal('open');

                },
                admin0pcode: config.admin0pcode.toUpperCase(),
                country: [
                    {
                        'admin0pname': 'All',
                        'admin0pcode': 'ALL',

                    },
                    {
                        'admin0pname': 'Afghanistan',
                        'admin0pcode': 'AF',

                    }, {
                        'admin0pname': 'Bangladesh',
                        'admin0pcode': 'BD',

                    }, {
                        'admin0pname': 'Cox Bazar',
                        'admin0pcode': 'CB',

                    }, {
                        'admin0pname': 'Democratic Republic of Congo',
                        'admin0pcode': 'CD',
                    }, {
                        'admin0pname': 'Ethiopia',
                        'admin0pcode': 'ET',

                    }, {
                        'admin0pname': 'Somalia',
                        'admin0pcode': 'SO',

                    }, {
                        'admin0pname': 'South Sudan',
                        'admin0pcode': 'SS',

                    }, {
                        'admin0pname': 'Syria',
                        'admin0pcode': 'SY',

                    }, {
                        'admin0pname': 'Ukraine',
                        'admin0pcode': 'UA',

                    }, {
                        'admin0pname': 'Yemen',
                        'admin0pcode': 'YE',

                    }, {
                        'admin0pname': 'Nigeria',
                        'admin0pcode': 'NG',

                    },
                    {
                        'admin0pname': 'Colombia',
                        'admin0pcode': 'COL',
                    }],
                type_org: [
                    { organization_type: 'United Nations' },
                    { organization_type: 'Government' },
                    { organization_type: 'International NGO' },
                    { organization_type: 'National NGO' }
                ],
                addOrganization: function () {
                    M.toast({ html: 'Adding New Organization...', displayLength: 2000, classes: 'note' });
                    $http({
                        method: 'POST',
                        url: ngmAuth.LOCATION + '/api/list/setOrganization',
                        data: {
                            organization: $scope.addOrganizationAtribute
                        }
                    }).success(function (new_org) {
                        if (new_org.err) {
                            M.toast({ html: 'Error! Organization Not Added </br>' + new_org.err, displayLength: 3000, classes: 'error' });
                        }
                        if (!new_org.err) {
                            $scope.master.organization.unshift(new_org);
                            $timeout(function () {
                                $('#add-org-modal').modal('close');
                                // Materialize.toast( msg , 6000, 'success');
                                M.toast({ html: 'Successfully Added New Organization ', displayLength: 4000, classes: 'success' });
                            }, 1000);

                        }
                    }).error(function (err) {
                        M.toast({
                            html: 'Error! Organization Not Added </br>' + err.err +'</br> Please change your Organization Tag!', displayLength: 6000, classes: 'error' });
                    })
                },
                checkValidationOrganization: function (org) {
                    valid = false;
                    if (!org || org.organization_name === '' || org.admin0pcode === '' || org.organization === '' || org.organization_tag === '' || org.organization_type === '') {
                        valid = false;
                    } else {
                        valid = true;
                    }
                    return valid;
                },
                checkActiveDeactivedOrg: function (item) {
                    var active = false
                    if (item.admin0pcode.indexOf($scope.master.admin0pcode) > -1 || item.admin0pcode.indexOf("ALL") > -1) {
                        active = true
                    }
                    if (item.admin0pcode_inactive && item.admin0pcode_inactive !== ''){
                        if (item.admin0pcode_inactive.indexOf($scope.master.admin0pcode) > -1 || item.admin0pcode_inactive.indexOf("ALL") > -1) {
                            active = false
                        }
                        if ((item.admin0pcode.indexOf($scope.master.admin0pcode) > -1) && (item.admin0pcode_inactive.indexOf($scope.master.admin0pcode)< 0) && item.admin0pcode_inactive.indexOf("ALL") > -1){
                            active = true;
                        }
                    }
                    return active
                },
                changeActiveDeactivedOrgByCountry: function (id) {
                    // $scope.IndexOrg = $scope.master.organization.map(x => { return x.id }).indexOf(id);
                    // if ($scope.master.organization[$scope.IndexOrg].organization_type !== 'International NGO' && $scope.master.organization[$scope.IndexOrg].organization_type !== 'United Nations'){
                    //     if ($scope.master.organization[$scope.IndexOrg].admin0pcode !== ''){
                    //         index = $scope.master.organization[$scope.IndexOrg].admin0pcode.indexOf($scope.master.admin0pcode);
                    //         if (index < 0) {
                    //             return;
                    //         }
                    //     }
                    // }
                    // // set deactivate country
                    // if (!$scope.master.organization[$scope.IndexOrg].admin0pcode_inactive) {
                    //     $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive ='';
                    // }
                    // if (document.getElementById(id).checked) {
                    //     if ($scope.master.organization[$scope.IndexOrg].admin0pcode === '') {
                    //         $scope.master.organization[$scope.IndexOrg].admin0pcode = $scope.master.organization[$scope.IndexOrg].admin0pcode += $scope.master.admin0pcode;
                    //     } else {
                    //         if ($scope.master.organization[$scope.IndexOrg].admin0pcode.indexOf($scope.master.admin0pcode)<0){
                    //             $scope.master.organization[$scope.IndexOrg].admin0pcode = ($scope.master.admin0pcode === 'ALL' ?
                    //                 $scope.master.admin0pcode + ', ' + $scope.master.organization[$scope.IndexOrg].admin0pcode :
                    //                 $scope.master.organization[$scope.IndexOrg].admin0pcode += ', ' + $scope.master.admin0pcode);
                    //         }

                    //     }
                    //     // remove code country from admin0pcode if checked
                    //     if ($scope.master.organization[$scope.IndexOrg].admin0pcode_inactive !== '') {
                    //         var copy = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive
                    //         var copyarray = copy.replace(/\s/g, '').split(",")
                    //         var delIndex = copyarray.indexOf($scope.master.admin0pcode);
                    //         copyarray.splice(delIndex, 1)
                    //         var copystring = copyarray.join("")
                    //         $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = copystring
                    //     }
                    // } else {
                    //     // option 1 delete country code if unchecked
                    //     // var copy = $scope.master.organization[$scope.IndexOrg].admin0pcode
                    //     // var copyarray = copy.replace(/\s/g, '').split(",")
                    //     // var delIndex = copyarray.indexOf($scope.master.admin0pcode);
                    //     // copyarray.splice(delIndex, 1)
                    //     // var copystring = copyarray.join("")
                    //     // $scope.master.organization[$scope.IndexOrg].admin0pcode = copystring

                    //     // option 2 put  country code  to admin0pcode_inactive if unchecked
                    //     if ($scope.master.organization[$scope.IndexOrg].admin0pcode_inactive === '') {
                    //         $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive += $scope.master.admin0pcode;
                    //     } else {
                    //         $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = ($scope.master.admin0pcode === 'ALL' ?
                    //             $scope.master.admin0pcode + ', ' + $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive :
                    //             $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive += ', ' + $scope.master.admin0pcode);

                    //     }

                    // }

                    // new flow
                    $scope.IndexOrg = $scope.master.organization.map(x => { return x.id }).indexOf(id);
                    if (document.getElementById(id).checked) {
                        if ($scope.master.admin0pcode ==='ALL'){
                            $scope.master.organization[$scope.IndexOrg].admin0pcode = 'ALL';
                            $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = '';
                        }else{
                            if ($scope.master.organization[$scope.IndexOrg].admin0pcode_inactive && 
                                $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive !== ''){
                                copy = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive
                                copyarray = copy.replace(/\s/g, '').split(",");
                                delIndex = copyarray.indexOf($scope.master.admin0pcode);
                                if(delIndex>-1){
                                    copyarray.splice(delIndex, 1);
                                    if (copyarray.length < 1) {
                                        $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = ''
                                    } else {
                                        var copystring = copyarray.join(", ")
                                        $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = copystring
                                    }
                                }else{
                                    if ($scope.master.organization[$scope.IndexOrg].admin0pcode === 'ALL' || $scope.master.organization[$scope.IndexOrg].admin0pcode.indexOf('ALL')>-1){
                                        $scope.master.organization[$scope.IndexOrg].admin0pcode = $scope.master.admin0pcode;
                                        $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive ='';
                                    }
                                }
                                
                            }else{
                                $scope.master.organization[$scope.IndexOrg].admin0pcode = $scope.master.organization[$scope.IndexOrg].admin0pcode += ", " + $scope.master.admin0pcode;
                            }
                            
                        }
                    }else{

                        if(!$scope.master.organization[$scope.IndexOrg].admin0pcode_inactive){
                            $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive='';
                        }


                        if($scope.master.organization[$scope.IndexOrg].organization_type === 'International NGO' || 
                        $scope.master.organization[$scope.IndexOrg].organization_type === 'United Nations'){
                            if ($scope.master.admin0pcode ==='ALL'){
                                $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = 'ALL';
                            }else{
                                if ($scope.master.organization[$scope.IndexOrg].admin0pcode_inactive === '') {
                                    $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive += $scope.master.admin0pcode
                                } else {
                                    $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive += ', ' + $scope.master.admin0pcode;
                                }
                            }

                            
                        }else{
                            if ($scope.master.organization[$scope.IndexOrg].admin0pcode_inactive === '') {
                                $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive += $scope.master.admin0pcode
                            } else {
                                $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive = $scope.master.organization[$scope.IndexOrg].admin0pcode_inactive += ', ' + $scope.master.admin0pcode;
                            }
                        }

                    }

                    $scope.master.editOrganization($scope.master.organization[$scope.IndexOrg])

                },
                disabledOrg: function(item){
                    // if (item.organization_type !== 'International NGO' && item.organization_type !== 'United Nations') {
                    //     index = item.admin0pcode.indexOf($scope.master.admin0pcode);
                    //     indexall = item.admin0pcode.indexOf('ALL');
                    //     if(item.admin0pcode !== ''){
                    //         if (index < 0 && indexall < 0) {
                    //             return true
                    //         }
                    //     }
                    //     return false
                    // }
                    // return false

                    if (item.organization_type !== 'International NGO' && item.organization_type !== 'United Nations'){
                        if ($scope.master.admin0pcode ==='ALL'){
                            return true;
                        }
                    }
                    return false
                },
                setEditedOrg:function(org){
                    $scope.master.editedOrg = angular.copy(org);
                    $('#edit-org-modal').modal({ dismissible: false });
                    $('#edit-org-modal').modal('open');
                    $scope.master.changeListCountry($scope.master.editedOrg);
                },
                editOrganization:function(org){
                    
                    M.toast({ html: 'Updating Organization....', displayLength: 2000, classes: 'note' });
                    $http({
                        method: 'POST',
                        url: ngmAuth.LOCATION + '/api/list/setOrganization',
                        data: {
                            organization: org
                        }
                    }).success(function (org_edited) {
                        if(org_edited.err){
                            M.toast({ html: 'Error! Organization not updated', displayLength: 3000, classes: 'error' });
                        }
                        if (!org_edited.err) {
                            var index = $scope.master.organization.map(x => { return x.id }).indexOf(org_edited.id);
                            $scope.master.organization[index] = org;
                            $timeout(function () {
                                // Materialize.toast( msg , 6000, 'success');
                                M.toast({ html: 'Organization is Updated ', displayLength: 3000, classes: 'success' });
                            }, 1000);
                            
                        }
                    }).error(function (err) {
                        M.toast({ html: 'Error! Organization not updated', displayLength: 3000, classes: 'error' });
                    })

                    //after save reset
                    $scope.editedOrg={};
                },
                disabledEditButton:function(item){
                    var role = ngmAuth.userPermissions().reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })['ROLE'];
                    // disable edit if role is COUNTRY;
                    if(role === 'COUNTRY'){
                        return true;
                    }
                    // if organization type is international
                    if (item.organization_type === 'International NGO' || item.organization_type === 'United Nations' ){
                        if(role === 'SUPERADMIN'){
                            return false;
                        }
                        return true;
                    }
                    return false;
                },
                editCountryOrg:function(id) {
                    // old flow
                    // if (!$scope.master.editedOrg.admin0pcode_inactive) {
                    //     $scope.master.editedOrg.admin0pcode_inactive = '';
                    // }
                    // if (document.getElementById('edit-'+id).checked) {
                        
                    //     if ($scope.master.editedOrg.admin0pcode === '') {
                    //         $scope.master.editedOrg.admin0pcode += id;
                    //     } else {
                    //         if ($scope.master.editedOrg.admin0pcode.indexOf(id)<0){
                    //             $scope.master.editedOrg.admin0pcode = (id === 'ALL' ?
                    //                 id + ', ' + $scope.master.editedOrg.admin0pcode :
                    //                 $scope.master.editedOrg.admin0pcode += ', ' + id);
                    //         }
                    //     }
                    //     if ($scope.master.editedOrg.admin0pcode_inactive !== '' && $scope.master.editedOrg.admin0pcode_inactive.indexOf(id)>-1) {
                    //         var copy = $scope.master.editedOrg.admin0pcode_inactive
                    //         var copyarray = copy.replace(/\s/g, '').split(",")
                    //         var delIndex = copyarray.indexOf(id);
                    //         copyarray.splice(delIndex, 1)
                    //         var copystring = copyarray.join(", ")
                    //         $scope.master.editedOrg.admin0pcode_inactive = copystring
                    //     }
                    // }else{
                    // //     var copy =$scope.master.editedOrg.admin0pcode
                    // //     var copyarray = copy.replace(/\s/g, '').split(",")
                    // //     var delIndex = copyarray.indexOf(id);
                    // //     copyarray.splice(delIndex, 1)
                    // //     var copystring = copyarray.join("")
                    // //    $scope.master.editedOrg.admin0pcode = copystring

                    //     // option 2 put  country code  to admin0pcode_inactive if unchecked
                    //     if ($scope.master.editedOrg.admin0pcode_inactive === '') {
                    //         $scope.master.editedOrg.admin0pcode_inactive = $scope.master.editedOrg.admin0pcode_inactive += id;
                    //     } else {
                    //         $scope.master.editedOrg.admin0pcode_inactive = (id === 'ALL' ?
                    //             id + ', ' + $scope.master.editedOrg.admin0pcode_inactive :
                    //             $scope.master.editedOrg.admin0pcode_inactive += ', ' + id);

                    //     }
                    // }

                    // new flow
                    if (document.getElementById('edit-' + id).checked) {
                        if ($scope.master.editedOrg.organization_type === 'International NGO' ||
                            $scope.master.editedOrg.organization_type === 'United Nations') {
                            // if ALL selected then set admin0pcode just to ALL
                            if (id === 'ALL') {
                                $scope.master.editedOrg.admin0pcode = 'ALL';
                            } else {
                                // if ALL not selected 
                                // if empty string
                                if ($scope.master.editedOrg.admin0pcode === '') {
                                    $scope.master.editedOrg.admin0pcode += id;
                                } else {
                                    // check if ALL is exist
                                    if ($scope.master.editedOrg.admin0pcode.indexOf('ALL') > -1) {
                                        var copy = $scope.master.editedOrg.admin0pcode
                                        var copyarray = copy.replace(/\s/g, '').split(",")
                                        var delIndex = copyarray.indexOf('ALL');
                                        copyarray.splice(delIndex, 1)
                                        var copystring = copyarray.join(", ")
                                        $scope.master.editedOrg.admin0pcode = copystring
                                        $scope.master.editedOrg.admin0pcode_inactive='';
                                    }

                                    if ($scope.master.editedOrg.admin0pcode === '') {
                                        $scope.master.editedOrg.admin0pcode += id;
                                    } else {
                                        $scope.master.editedOrg.admin0pcode = $scope.master.editedOrg.admin0pcode += ', ' + id;
                                    }
                                }

                            }
                        } else {
                            // for not International and not UN
                            if ($scope.master.editedOrg.admin0pcode === '') {
                                $scope.master.editedOrg.admin0pcode += id;
                            } else {
                                // check if ALL is exist
                                if ($scope.master.editedOrg.admin0pcode.indexOf(id)<0){
                                    $scope.master.editedOrg.admin0pcode = $scope.master.editedOrg.admin0pcode += ', ' + id;
                                }else{
                                    var copy = $scope.master.editedOrg.admin0pcode_inactive
                                    var copyarray = copy.replace(/\s/g, '').split(",")
                                    var delIndex = copyarray.indexOf(id);
                                    copyarray.splice(delIndex, 1)
                                    if(copyarray.length>0){
                                        var copystring = copyarray.join(", ")
                                        $scope.master.editedOrg.admin0pcode_inactive = copystring
                                        
                                    }else{
                                        $scope.master.editedOrg.admin0pcode_inactive = '';
                                    }

                                }
                            }
                        }


                    } else {
                        var copy = $scope.master.editedOrg.admin0pcode
                        var copyarray = copy.replace(/\s/g, '').split(",")
                        if (copyarray.length > 1) {
                            
                            if (!$scope.master.editedOrg.admin0pcode_inactive) {
                                $scope.master.editedOrg.admin0pcode_inactive = '';
                            }
                            if($scope.master.editedOrg.admin0pcode_inactive ===''){
                                $scope.master.editedOrg.admin0pcode_inactive = $scope.master.editedOrg.admin0pcode_inactive += id
                            }else{
                                $scope.master.editedOrg.admin0pcode_inactive = $scope.master.editedOrg.admin0pcode_inactive += ', ' + id;
                            }


                            
                           
                        } else {
                            if (!$scope.master.editedOrg.admin0pcode_inactive) {
                                $scope.master.editedOrg.admin0pcode_inactive = '';
                            }
                            if ($scope.master.editedOrg.organization_type === 'International NGO' ||
                                $scope.master.editedOrg.organization_type === 'United Nations'){
                                    $scope.master.editedOrg.admin0pcode = 'ALL';
                                    $scope.master.editedOrg.admin0pcode_inactive ='ALL';
                            }else{
                                if ($scope.master.editedOrg.admin0pcode_inactive === '') {
                                    $scope.master.editedOrg.admin0pcode_inactive = $scope.master.editedOrg.admin0pcode_inactive += id
                                } else {
                                    if ($scope.master.editedOrg.admin0pcode_inactive.indexOf('AF')){
                                        $scope.master.editedOrg.admin0pcode_inactive = $scope.master.editedOrg.admin0pcode_inactive += ', ' + id;
                                    }
                                }
                            }

                        }
                    }
                },
                addCountryOrg: function (id) {

                    if (document.getElementById('add-'+id).checked) {
                        // if ($scope.addOrganizationAtribute.admin0pcode === '') {
                        //     // if (($scope.addOrganizationAtribute.organization_type === 'International NGO' || $scope.addOrganizationAtribute.organization_type === 'United Nations')&& id !== 'all'){
                        //     //     $scope.addOrganizationAtribute.admin0pcode += 'ALL, ';
                        //     // }
                        //     $scope.addOrganizationAtribute.admin0pcode += id;
                        // } else {
                        //     $scope.addOrganizationAtribute.admin0pcode = (id === 'ALL' ?
                        //         id + ', ' + $scope.addOrganizationAtribute.admin0pcode :
                        //         $scope.addOrganizationAtribute.admin0pcode += ', ' + id);
                        // }
                        if(id ==='ALL'){
                            $scope.addOrganizationAtribute.admin0pcode = 'ALL';
                        }else{
                            if ($scope.addOrganizationAtribute.admin0pcode.indexOf('ALL') > -1) {
                                var copy = $scope.addOrganizationAtribute.admin0pcode
                                var copyarray = copy.replace(/\s/g, '').split(",")
                                var delIndex = copyarray.indexOf('ALL');
                                copyarray.splice(delIndex, 1)
                                var copystring = copyarray.join(", ")
                                $scope.addOrganizationAtribute.admin0pcode = copystring
                                $scope.addOrganizationAtribute.admin0pcode_inactive = '';
                            }
                            if ($scope.addOrganizationAtribute.admin0pcode === '') {
                                $scope.addOrganizationAtribute.admin0pcode += id;
                            }else{
                                $scope.addOrganizationAtribute.admin0pcode = $scope.addOrganizationAtribute.admin0pcode += ', '+ id;
                            }

                        }
                    } else {
                        var copy = $scope.addOrganizationAtribute.admin0pcode
                        var copyarray = copy.replace(/\s/g, '').split(",")
                        var delIndex = copyarray.indexOf(id);
                        copyarray.splice(delIndex, 1)
                        var copystring = copyarray.join(", ")
                        $scope.addOrganizationAtribute.admin0pcode = copystring
                    }
                },
                removeOrganization:function(id){
                    M.toast({ html: 'Deleting Organization....', displayLength: 2000, classes: 'note' });
                    $http({
                        method: 'POST',
                        url: ngmAuth.LOCATION + '/api/list/deleteOrganization',
                        data: {
                           id: id
                        }
                    }).success(function (org) {
                        if (org.err) {
                            M.toast({ html: 'Error! Organization not deleted', displayLength: 3000, classes: 'error' });
                        }
                        if (!org.err) {
                            $timeout(function () {
                                var index = $scope.master.organization.map(x => { return x.id }).indexOf(id);
                                $scope.master.organization.splice(index,1);
                                // Materialize.toast( msg , 6000, 'success');
                                M.toast({ html: 'Succesfully delete organization ', displayLength: 3000, classes: 'success' });
                            }, 1000);

                        }
                    }).error(function (err) {
                        M.toast({ html: 'Error! Organization not deleted </br>' + err.err, displayLength: 3000, classes: 'error' });
                    })
                },
                changeListCountry:function(item){
                    if (item.organization_type !== 'United Nations' && item.organization_type !== 'International NGO'){
                        if ($scope.master.admin0pcode ==='ALL'){
                            $scope.master.list_country = $scope.master.list_country.filter(x => x.admin0pcode !== $scope.master.admin0pcode);
                        }else{
                            $scope.master.list_country = $scope.master.list_country.filter(x => x.admin0pcode === $scope.master.admin0pcode);
                        }
                    }else{
                        $scope.master.list_country = $scope.master.country;
                    }
                    var role = ngmAuth.userPermissions().reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })['ROLE'];
                    if (role === 'COUNTRY_ADMIN' || role === 'CLUSTER'){
                        $scope.master.list_country = $scope.master.list_country.filter(x => x.admin0pcode === $scope.master.admin0pcode);
                    }
                },
                showInactive:function(org){
                    return org && org.admin0pcode && 
                          (org.admin0pcode.indexOf('ALL') > -1)
                          
                },
                editInactiveCountry:function(id,prefix,item) {
                    if (document.getElementById(prefix + id).checked) {
                        if(!item.admin0pcode_inactive){
                            item.admin0pcode_inactive ='';
                        }
                        if(id ==='ALL'){
                            item.admin0pcode_inactive = 'ALL';
                        }else{
                            if(item.admin0pcode_inactive === ''){
                                item.admin0pcode_inactive += id;
                            }else{
                                item.admin0pcode_inactive = item.admin0pcode_inactive += ', ' +id;
                            }
                        }
                        
                    }else{
                        if (id === 'ALL') {
                            item.admin0pcode_inactive = '';
                        }else{
                            var copy = item.admin0pcode_inactive
                            var copyarray = copy.replace(/\s/g, '').split(",")
                            var delIndex = copyarray.indexOf(id);
                            copyarray.splice(delIndex, 1)
                            if(copyarray.length>0){
                                var copystring = copyarray.join(", ")
                                item.admin0pcode_inactive = copystring;
                            }else{
                                item.admin0pcode_inactive ='';
                            }
                        }
                    }
                },
                init:function(){
                    $scope.master.list_country=[];
                    $scope.master.list_inactive_country = [];
                    var role = ngmAuth.userPermissions().reduce(function (max, v) { return v.LEVEL > max.LEVEL ? v : max })['ROLE'];
                    if (role === 'SUPERADMIN' || $scope.master.user.email === 'farifin@immap.org' || $scope.master.user.email === 'pfitzgerald@immap.org' || $scope.master.user.email === 'tkilkeiev@immap.org'){
                        $scope.master.list_country = $scope.master.country;
                    }else{
                        $scope.master.list_country = $scope.master.country.filter(x=>x.admin0pcode === $scope.master.admin0pcode);
                    }
                    $scope.master.list_inactive_country = $scope.master.country;

                }
            }

            $scope.master.init();

        }])