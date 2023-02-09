angular.module('designer.workspace.views.list', [
  "designer.model.view",
  "designer.workspace.views.list.control"
])
  .factory('ListView', ["$rootScope", "$compile", "$http", "$templateCache", "View",
    function($rootScope, $compile, $http, $templateCache, View) {
      return {
        create: function(obj) {
          var view = View.create(obj);

          view.name = "List";
          view.canvas = "html";
          view.zoomable = false;
          view.scrollable = false;
          view.elements = [];
          view.model = null;
          view.height = 0;
          view.width  = 0;
          view.controller = null;

          view.supported_exports = {
            pdf: false,
            png: false,
            vsdx: false,
            csv: true,
            json: true
          };

          view.load = function(model) {
            this.model = model;
          };

          view.compileController = function() {
            var $scope = $rootScope.$new(true);
            $scope.resources = _.map(this.resources, function(list_items) {
              return this.model.getResource(list_items["id"])
            }.bind(this));
            var controller = $('<div list-control></div>');

            $compile(controller)($scope);

            return controller;
          };

          view.render = function(diagram) {
            diagram.clear();

            this.controller = this.compileController();

            diagram.el.append(this.controller);
          };

          view.loadDimensions = function() {
            if(this.controller) {
              this.height = this.controller.height();
              this.width = 1100; // Need to set a minimum or it goes all squishy
            }
          };

          return view;
        }
      }
    }]);
