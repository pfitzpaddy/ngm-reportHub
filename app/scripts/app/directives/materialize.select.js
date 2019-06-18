angular.module("ngm.materialize.select", [])
        .directive("materializeSelect", ["$compile", "$timeout", function ($compile, $timeout) {
            return {
                link: function (scope, element, attrs) {
                    if (element.is("select")) {
						//BugFix 139: In case of multiple enabled. Avoid the circular looping.
                        function initSelect(newVal, oldVal) {
                            if (attrs.multiple) {
                                if (oldVal !== undefined && newVal !== undefined) {
                                    if (oldVal.length === newVal.length) {
                                        return;
                                    }
                                }
                                var activeUl = element.siblings("ul.active");
                                if (newVal !== undefined && activeUl.length) { // If select is open
                                    var selectedOptions = activeUl.children("li.active").length; // Number of selected elements
                                    if (selectedOptions == newVal.length) {
                                        return;
                                    }
                                }
                            }

                            element.siblings(".caret").remove();
                            // function fixActive () {         
                            //     if (!attrs.multiple) {
                            //         var value = element.val();
                            //         var ul = element.siblings("ul");
                            //         ul.find("li").each(function () {
                            //             var that = $(this);
                            //             if (that.text() === value) {
                            //                 that.addClass("active");
                            //             }
                            //         });
                            //     }
                            // }
                            scope.$evalAsync(function () {

                                // TODO: test that no bugs
                                element.material_select();

                                // commented
                                //Lines 301-311 fix Dogfalo/materialize/issues/901 and should be removed and the above uncommented whenever 901 is fixed
                                // element.material_select(function () {
                                //     if (!attrs.multiple) {
                                //         element.siblings('input.select-dropdown').trigger('close');
                                //     }
                                //     fixActive();
                                // });
                                // var onMouseDown = function (e) {
                                //     // preventing the default still allows the scroll, but blocks the blur.
                                //     // We're inside the scrollbar if the clientX is >= the clientWidth.
                                //     if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
                                //         e.preventDefault();
                                //     }
                                // };
                                // element.siblings('input.select-dropdown').off("mousedown.material_select_fix").on('mousedown.material_select_fix', onMouseDown);

                                // fixActive();

                                // element.siblings('input.select-dropdown').off("click.material_select_fix").on("click.material_select_fix", function () {
                                //     $("input.select-dropdown").not(element.siblings("input.select-dropdown")).trigger("close");
                                // });
                            });
                        }


                        // $timeout(initSelect);
                        // run on current/next cycle $evalAsync
                        initSelect();

                        if (attrs.ngModel) {

                            if (attrs.ngModel && !angular.isDefined(scope.$eval(attrs.ngModel))) {
                                // This whole thing fixes that if initialized with undefined, then a ghost value option is inserted. If this thing wasn't done, then adding the 'watch' attribute could also fix it. #160
                                var hasChangedFromUndefined = false;
                                scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                                    if (!hasChangedFromUndefined && angular.isDefined(scope.$eval(attrs.ngModel))) {
                                        hasChangedFromUndefined = true;
                                        initSelect(); // initSelect without arguments forces it to actually run.
                                    } else {
                                        initSelect(newVal, oldVal);
                                    }
                                });
                            } else {
                                scope.$watch(attrs.ngModel, initSelect);
                            }

                        }

                        // already watching ngModel
                        // if ("watch" in attrs) {
                        //     // scope.$watch(function () {
                        //     //     return element[0].innerHTML;
                        //     // }, function (newValue, oldValue) {
                        //     //     if (newValue !== oldValue) {
                        //     //         $timeout(initSelect);
                        //     //     }
                        //     // });
                        // }
                        
                        if(attrs.ngDisabled) {
                            scope.$watch(attrs.ngDisabled, initSelect)
                        }
                    }
                }
            };
        }]);