angular.module('designer.workspace.canvases.jointjs.graph', [
  "designer.workspace.canvases.jointjs.shapes.container",
  "designer.workspace.canvases.jointjs.shapes.resource",
  "designer.workspace.canvases.jointjs.shapes.text",
  "designer.workspace.canvases.jointjs.link.resource",
  "designer.data.resources.factory"
])
  .service('Graph',
    ["ResourceElement", "ContainerElement", "TextElement", "ResourceLink",
      function(ResourceElement, ContainerElement, TextElement, ResourceLink) {
      return joint.dia.Graph.extend({
        resourceLinks: [],
        resourceCells: [],
        shapes: {},

        initialize: function() {
          joint.dia.Graph.prototype.initialize.apply(this, arguments);

          this.resourceLinks = [];
          this.resourceCells = [];
          this.textCells = [];
          this.shapes = {
            default_container: ContainerElement,
            default_resource: ResourceElement,
            custom: {}
          };
        },

        createResourceCell: function(r, geometry, additional) {
          var cell = null;
          var details = { resource: angular.copy(r), position: { x: geometry.x, y: geometry.y } };
          if(additional) details.info = additional;

          if(this.shapes.custom[r.type]) {
            cell = new this.shapes.custom[r.type](details);
          }
          else {
            cell = r.container ? new this.shapes.default_container(details) : new this.shapes.default_resource(details);
          }

          // Make sure the IDs match
          cell.resource_id = r.id;
          cell.id = cell.cid;

          this.resourceCells.push(cell);

          // Containers have a default size - set the proper size now
          if(cell.container) {
            cell.resize(geometry.w, geometry.h);
          }
        },

        createResourceLink: function(source, target, connection) {
          var link = new ResourceLink({});
          link.set('source', { id: source.id, selector: "g:nth-child(1) .connectionPoint" });
          link.set('target', { id: target.id, selector: "g:nth-child(1) .connectionPoint" });
          link.set('connection', connection);

          var startDirections = [];
          var endDirections = [];

          var start = source.position();
          var end = target.position();

          // Don't start links starting or ending in the wrong direction
          if (end.x > start.x) {
            startDirections.push("right");
            endDirections.push("left");
          } else {
            startDirections.push("left");
            endDirections.push("right");
          }

          // Don't start links starting or ending in the wrong direction
          if (end.y > start.y) {
            startDirections.push("bottom");
            endDirections.push("top");
          } else {
            startDirections.push("top");
            endDirections.push("bottom");
          }

          link.router('metro', {
            excludeEnds: ["source", "target"],
            excludeTypes: ["container"],
            step: 16,
            endDirections,
            startDirections,
          });
          link.connector('rounded', { radius: 20 });

          // Make sure the IDs match
          //link.id = connection.id;

          this.resourceLinks.push(link);

          return link;
        },

        createShape: function(info, shape_object, additional, resource = undefined) {
          var details = {
            position: { x: info.x, y: info.y },
            size: { width: info.width, height: info.height },
          };

          if (resource) {
            details.resource = resource;
          }

          if(additional) details.info = additional;

          var s  = new shape_object(details);
          s.name = info.name;
          s.resource_id = info.id || info.name;

          this.resourceCells.push(s);

          return s;
        },

        createTextBox: function(info) {
          var details = {
            position: { x: info.x, y: info.y },
            size: { width: info.w, height: info.h },
            attrs: {
              label: {
                text: info.text
              }
            }
          };

          var s = new TextElement(details);

          this.textCells.push(s);

          return s;
        },

        findByResourceId: function(id) {
          return _.filter(this.resourceCells, function(c) { return c.resource_id === id });
        },

        allCells: function() {
          return this.resourceCells.concat(this.resourceLinks).concat(this.textCells);
        },

        // TODO: both these functions are basically the same. This is pre-render, the next is post-render. Hrm.
        getResourceCellsForResource: function(resource_id) {
          return _.filter(this.resourceCells, function(cell) { return cell.resource_id === resource_id });
        },

        getCellsByResourceId: function(resource_id) {
          return this.get('cells').filter(function(cell) {
            return cell.resource_id === resource_id;
          });
        },

        clear: function() {
          this.resourceLinks = [];
          this.resourceCells = [];
          this.textCells = [];
        }
      });
    }]);
