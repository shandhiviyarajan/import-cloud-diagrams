angular.module('designer.search', [
  "designer.data.resources.factory",
  "designer.app-scope",
  "designer.configuration",
  "designer.search.state"
])
  .directive('search',
    ["$rootScope", "$timeout", "$appScope", "Resources", "ResourcesFactory", "$window", "$filter", "DesignerConfig", "DesignerSearchState",
      function($rootScope, $timeout, $appScope, Resources, ResourcesFactory, $window, $filter, DesignerConfig, DesignerSearchState) {
      return {
        templateUrl: '/designer/search/search.html',
        controllerAs: "Search",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
          this.$onInit = function() {
            $scope.dt_options = {
              "columns": [
                {
                  "data": "image",
                  "render": function ( data, type, row, meta ) {
                    return '<img src="' + data + '" width="32px" />';
                  },
                  "orderable": false,
                  "searchable": false
                },
                {
                  "data": "name", "title": "Name",
                  "render": function(data, type, row, meta) {
                    data = data || "";
                    var content = data.length > 50 ? '<span title="' + data + '">' + data.substr( 0, 48 ) + '...</span>' : data;
                    content += "<br />";
                    content += row.summary_line;
                    return content;
                  }
                },
                {
                  "data": "type",
                  "title": "Type",
                  defaultContent: "-",
                  "render": function(data, type, row, meta) {
                    if(!data) {
                      return data;
                    }

                    var sections = data.split("::").slice(1);

                    return sections.join(" ");
                  }
                },
                { "data": "region", "title": "Region", defaultContent: "-" }, // Call the render method for this to display extra details... row["summary"] or something?
                {
                  "data": "price", "title": "Price",
                  "render": function ( data, type, row, meta ) {
                    return $filter("currency")(data, "$", 0);
                  }
                }
              ],
              "ajax": this.search,
              "dom": '<"designer-search-table"rtiS>',
              "deferRender": true,
              "processing": true,
              "serverSide": true,
              "scrollY": "600px",
              rowId: function(a) {
                return 'id_' + a.id;
              },
              "order": [[4, "desc"]],
              "scroller": {
                displayBuffer: 10,
                boundaryScale: 0.25
              },
              select: {
                style: 'single'
              }
            };
          };

          this.search = function(data, callback, settings) {
            // Format the params as we'd need them
            var params = {};
            params.q = DesignerSearchState.query;
            params.start = data["start"];
            params.length = data["length"];
            params.draw = data["draw"];
            params.context = true;

            // Figure out which column we're sorting on
            var order_info = data["order"]["0"];
            params.sort = data["columns"][order_info["column"]]["data"];
            params.sort_dir = order_info["dir"];

            $scope.SearchHeader.toggleLoading();

            DesignerConfig.get("searchMethod")(params).then(function(result) {
              // Use the resource objects to display in the list
              result.data = $scope.ResourceList.search_results.addResultSet(result, params);

              $scope.SearchHeader.toggleLoading();
              DesignerSearchState.count = result["recordsTotal"];
              DesignerSearchState.error = false;

              $timeout(function() {
                callback(result);
              }, 0);
            }, function(e) {
              var error = "";

              if (e["data"] && e["data"]["positions"]) {
                error = "Syntax error at character " + e["data"]["positions"][1]
                $rootScope.$broadcast("search:query:error", e["data"]["positions"]);
              }
              else {
                error = "There was an unexpected error!";
              }

              $scope.SearchHeader.toggleLoading();
              $scope.SearchHeader.setError(error);
              DesignerSearchState.error = true;
            });
          };
        }],
        link: function(scope, element, attrs, ctrl) {
          scope.selected = null;
          scope.dTable = null;

          scope.calculateHeight = function() {
            // Get available height and subtract header and footer. Man this sucks.
            var header = 38;
            var footer = 33;
            scope.dt_options["scrollY"] = $(".search-results").height() - header - footer;
          };

          scope.drawTable = function() {
            scope.calculateHeight();

            scope.dTable = $("#datatable-resources").DataTable(scope.dt_options);

            // Handlers!
            scope.dTable.on("select", function(e, dt, type, indexes) {
              var rowData = scope.dTable.rows(indexes).data().toArray()[0];
              $appScope.safeApply(function() {
                var resource =  scope.ResourceList.search_results.getResource(rowData.id);

                scope.selected = (resource === scope.selected) ? null : resource;

                $rootScope.$broadcast("resource:selected", scope.selected);
              }, scope);
            });

            scope.dTable.on("deselect", function(e, dt, type, indexes) {
              $appScope.safeApply(function() {
                scope.selected = null;

                $rootScope.$broadcast("resource:selected", scope.selected);
              }, scope);
            });

            scope.resizeTable();
          };

          // Add a delay on resize so we don't fire this a bajillion times
          scope.resizeTimer = null;
          scope.resizeTable = function() {
            clearTimeout(scope.resizeTimer);
            scope.resizeTimer = $timeout(function() {
              scope.calculateHeight();

              $('.dataTables_scrollBody').css('height', scope.dt_options["scrollY"] + "px");
              scope.dTable.scroller.measure(false);
            }, 500);
          };

          // Load the datatable once the directives have completed (timeout puts it outside the current digest)
          $timeout(function() {
            scope.drawTable();
          });

          // If the user resizes their window we have to redraw the whole table for now (https://datatables.net/manual/tech-notes/3)
          $window.addEventListener('resize', scope.resizeTable);
          scope.$on('$destroy', function () {
            $window.removeEventListener('resize', scope.resizeTable);
          });

          // Handle searches
          scope.$on("resource:search", function(evt, query) {
            scope.dTable.search("").draw();
          });
        }
      }
    }]);
