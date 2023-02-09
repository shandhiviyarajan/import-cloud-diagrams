angular.module('designer.search.data.results', ["designer.data.resources.factory"])
.factory('SearchResults', ["ResourcesFactory", function(ResourcesFactory) {
  return {
    load: function() {
      var results = {};

      // Initialise
      results.errors = [];
      results.resources = [];
      results.context = [];
      results.query = "";

      results.addResultSet = function(result, params) {
        // Set up the query ... if it's new do we reload the resource list and start again? Probably should if we've sorted too!
        this.query = params.q;

        // Rightooooo so we want to grab the resources, map them into our classes, then make them selectable
        var count = params.start;
        var new_resources = _.map(result.data, function (s) {
          var r = ResourcesFactory(s, this);
          r.counter = count + 1;
          count++;
          return r;
        }.bind(this));

        var context_resources = _.map(result.context, function(s) { return ResourcesFactory(s, this) }.bind(this));

        this.resources = _.uniqBy(this.resources.concat(new_resources).concat(context_resources), function(r) { return r.id });

        // Load remote connections, unless it's already in the array
        _.each(this.resources, function(resource) {
          _.each(resource.connections, function(connection) {
            if(connection.resource_id === resource.id) {
              var remote_resource = this.getResource(connection.remote_resource_id);

              if(remote_resource && !_.includes(remote_resource.connections, connection)) {
                remote_resource.connections.push(connection);
              }
            }
          }.bind(this));
        }.bind(this));

        return new_resources;
      };

      results.getResource = function (id) {
        return _.find(this.resources, function (s) {
          return s.id === id;
        });
      };

      results.connectedTo = function(resource, type, children_only) {
        var connected = [];

        _.each(resource.connections, function(connection) {
          if(children_only && connection.resource_id === resource.id) return;

          var resource_id = (connection.resource_id === resource.id) ? connection.remote_resource_id : connection.resource_id;
          var connected_to = this.getResource(resource_id);

          if(connected_to && (!type || connected_to.type === type)) {
            connected_to.connection_data = connection.data;
            connected.push(connected_to);
          }
        }.bind(this));

        return connected;
      };

      results.findConnectedTo = function(resource, types, children_only) {
        var connected_to = [];
        _.find(types, function(type) {
          connected_to = results.connectedTo(resource, type);
          return connected_to.length;
        });
        return connected_to;
      };

      results.getResourcesByType = function(type, parent) {
        var resources = (parent) ? this.connectedTo(parent, null) : this.resources;
        return _.filter(resources, function(s) { return s.type === type });
      };

      return results;
    }
  }
}]);
