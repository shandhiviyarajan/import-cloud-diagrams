angular.module('designer.model.view', [])
  .factory('View', [function() {
    return {
      create: function(obj) {
        var view = angular.copy(obj);

        // Set to false in views that need to wait for positioning info to come from cliet side layout
        view.positioned = true;
        view.supported_exports = {
          pdf: true,
          png: true,
          vsdx: false,
          csv: true,
          json: true
        };

        view.load    = function() { };
        view.clear   = function() { };
        view.render  = function() { };
        view.isEmpty = function() { };

        return view;
      }
    }
  }]);
