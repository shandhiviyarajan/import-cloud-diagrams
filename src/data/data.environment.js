angular.module('designer.model.environment', ["designer.data.resources.factory", "designer.workspace.views.factory", "designer.configuration"])
.factory('Environment', ["ResourcesFactory", "ViewsFactory", "DesignerConfig", function(ResourcesFactory, ViewsFactory, DesignerConfig) {
  return {
    load: function(environment, default_view) {
      // Initialise
      environment.name = environment.name || "";
      environment.valid = true;
      environment.valid_name = (environment.name.length > 0);
      environment.errors = [];
      environment.dirty = false;
      environment.facet.resources = _.map(environment.facet.resources, function (s) { return ResourcesFactory(s, environment) });
      environment.searching = (environment.environment_type === 'search' && (environment.state === 'pending' || environment.state === 'importing'));

      // Parse the query to see if we need ot do any tag highlighting
      environment.search_tokens = _(environment.query.match(/(([a-zA-Z_]+:[^"\s]+)|([a-zA-Z_]+:".+?"))/g))
      .map(function(m) {
        var pair = m.replace('"', "").split(":");

        return { key: pair[0], value: pair[1] };
      }).value();

      // Methods
      environment.setCurrentView = function(id) {
        this.current_view = _.find(this.views, function(l) { return l.id === id });
      };

      environment.setCurrentRevision = function(id) {
        this.current_revision = _.find(this.latest_revisions, function(l) { return l.id === id });
      };

      environment.getResource = function (id) {
        return _.find(this.facet.resources, function (s) {
          return s.id === id;
        });
      };

      environment.getResourceBySourceId = function(id) {
        return _.find(this.facet.resources, function (r) {
          return r.provider_id === id;
        });
      };

      environment.simple = function() { 
        var sources = _.compact(_.uniq(this.sources.map(function (s) { return s.type})));
        if (sources.length > 1 || sources.length == 0) {
          return false;
        } else {
          return sources[0].toLowerCase().includes("azure");
        }
      }

      environment.connectedTo = function(resource, type, children_only) {
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

        return _.uniq(connected);
      };

      environment.findConnectedTo = function(resource, types, children_only) {
        var connected_to = [];
         _.find(types, function(type) {
          connected_to = environment.connectedTo(resource, type);
          return connected_to.length;
        });
        return connected_to;
      };

      environment.getResourcesByType = function(type, parent) {
        var resources = (parent) ? this.connectedTo(parent, null) : this.facet.resources;
        return _.filter(resources, function(s) { return s.type === type });
      };

      ////////////////////////////////////////////////////////////////////////////////////
      // Load connections into the opposite side before we return the decorated object
      ////////////////////////////////////////////////////////////////////////////////////
      _.each(environment.facet.resources, function(resource) {
        _.each(resource.connections, function(connection) {
          if(connection.resource_id === resource.id) {
            var remote_resource = environment.getResource(connection.remote_resource_id);

            // TODO: we should ALWAYS find a remote resource! Right now this handles missing DHCPOptions, once layout code is finished removed this
            if(remote_resource)
              remote_resource.connections.push(connection);
          }
        });
      });

      // Initialise views, if we don't have any views create a basic mock one
      if(environment.views.length) {
        environment.views = _.map(environment.views, function(view) { return ViewsFactory(view, environment) });
      }
      else {
        environment.views = [ViewsFactory({}, environment)];
      }

      // Set the current view to whatever we select for default
      environment.current_view = _.find(environment.views, function(v) { return v.type === default_view }) ||
                                 _.sortBy(environment.views, function(v) { return v.type })[0];

      // Set the current revision
      environment.current_revision =  _.find(environment.latest_revisions, function(l) { return l.id === environment.current_revision.id }) || environment.current_revision;

      return environment;
    }
  }
}]);
