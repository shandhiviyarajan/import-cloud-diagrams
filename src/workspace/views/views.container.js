angular.module('designer.workspace.views.container', [
  "designer.model.view",
  "designer.workspace.canvases.jointjs.graph",
  "designer.workspace.views.container.shapes.cluster",
  "designer.workspace.views.container.shapes.namespace",
  "designer.workspace.views.container.shapes.aws.service",
  "designer.workspace.views.container.shapes.kubernetes.service",
  'designer.workspace.views.container.shapes.hex',
  'designer.workspace.views.container.shapes.hex.empty',
  'designer.workspace.views.container.shapes.workload',
  'designer.workspace.views.container.shapes.load-balancer'
])
.factory('ContainerLayoutView', [
  "View", "Graph", "ClusterElement", "HexElement", "NamespaceElement", "AWSServiceElement", "KubeServiceElement", "EmptyHexElement", "LoadBalancerElement", "WorkloadElement",
  function(View, Graph, ClusterElement, HexElement, NamespaceElement, AWSServiceElement, KubeServiceElement, EmptyHexElement, LoadBalancerElement, WorkloadElement) {
    return {
      create: function(obj) {
        var view = View.create(obj);

        view.name = "Container";
        view.canvas = "jointjs";
        view.positioned = false;
        view.height = 0;
        view.width  = 0;
        view.model = new Graph();

        // Set some of our own shapes
        view.model.shapes.custom = {
          "Resources::AWS::ECS::Cluster": ClusterElement,
          "Resources::AWS::ECS::Task": HexElement,
          "Resources::AWS::ECS::Service": AWSServiceElement,
          "Resources::AWS::ElasticLoadBalancingV2::TargetGroup": LoadBalancerElement,
          "Resources::AWS::ElasticLoadBalancing::LoadBalancer": LoadBalancerElement,

          "Resources::Kubernetes::Cluster::Cluster": ClusterElement,
          "Resources::Kubernetes::Cluster::Namespace": NamespaceElement,
          "Resources::Kubernetes::Cluster::Pod": HexElement,
          "Resources::Kubernetes::Cluster::DaemonSet": WorkloadElement,
          "Resources::Kubernetes::Cluster::Deployment": WorkloadElement,
          "Resources::Kubernetes::Cluster::ReplicaSet": WorkloadElement,
          "Resources::Kubernetes::Cluster::StatefulSet": WorkloadElement,
          "Resources::Kubernetes::Cluster::Service": KubeServiceElement,
        };

        // Disable visio export
        view.supported_exports.vsdx = false;

        view.isEmpty = function() {
          return this.model.resourceCells.length === 0;
        };

        view.load = function(model) {
          this.loadResources(model);
          this.loadEmptyCells();
          this.loadResourceConnections(model);
          this.loadDimensions();
        };

        view.load_with_positions = function(model, coords) {
          this.coordinates = coords;

          this.loadResources(model);
          this.loadEmptyCells();
          this.loadResourceConnections(model);
          this.loadDimensions();

          this.positioned = true;
        };

        view.reposition = function(model, coords) {
          // Just clear and redraw
          this.model.clear();

          this.load_with_positions(model, coords);
        };

        view.geometry = function(resource_id) {
          return _.filter(this.coordinates, function(geometry) { return geometry["id"] === resource_id });
        };

        view.loadResources = function(model) {
          _.each(model.facet.resources, function(resource) {
            var geom = this.geometry(resource.id);

            if(resource.drawable(true) && geom.length > 0) {
              _.each(geom, function(g) { this.model.createResourceCell(resource, g) }.bind(this));
            }
          }.bind(this));
        };

        view.loadResourceConnections = function(environment) {
          var connection_map = [];
          _.each(environment.facet.resources, function (resource) {
            if(resource.drawable() && this.geometry(resource.id).length > 0) {
              var connectables = resource.getDisplayableConnections();

              _.each(connectables, function(c) {
                // Check if we've already done this connection
                if(connection_map[resource.id] && _.includes(connection_map[resource.id], c.id)) {
                  return;
                }
                else {
                  if(!connection_map[resource.id]) connection_map[resource.id] = [];
                  connection_map[resource.id].push(c.id)
                }

                var provideCells = this.model.getResourceCellsForResource(resource.id);
                var dependCells  = this.model.getResourceCellsForResource(c.id);

                _.each(provideCells, function(provideCell) {
                  _.each(dependCells, function(dependCell) {
                    this.model.createResourceLink(provideCell, dependCell, {});
                  }.bind(this));
                }.bind(this));
              }.bind(this));
            }
          }.bind(this));
        };

        view.loadEmptyCells = function() {
          var empty = this.geometry("empty");

          _.each(empty, function(g) { this.model.createShape(g, EmptyHexElement) }.bind(this));
        };

        view.loadDimensions = function() {
          _.each(this.coordinates, function(g) {
            if(g && g.x && g.y) {
              var max_x = g.x + g.w;
              var max_y = g.y + g.h;

              if(max_x > this.width)  this.width  = max_x;
              if(max_y > this.height) this.height = max_y;
            }
          }.bind(this));
        };

        return view;
      }
    }
  }]);
