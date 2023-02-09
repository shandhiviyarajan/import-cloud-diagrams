angular.module('designer.workspace.views.security', [
  "designer.model.view",
  "designer.workspace.canvases.jointjs.graph",
  "designer.workspace.views.security.shapes.arrow",
  "designer.workspace.views.security.shapes.arrow.azure",
  "designer.workspace.views.security.shapes.arrow.horizontal",
  "designer.workspace.views.security.shapes.security-group",
  "designer.workspace.views.security.shapes.security-group.azure",
  'designer.model.resources.security.arrow',
  'designer.model.resources.security.arrow.azure',
  'designer.model.resources.security.arrow.horizontal',
  'designer.workspace.views.security.shapes.nsg',
  'designer.model.resource'
])
  .factory('SecurityView', ["View", "Graph", "ArrowElement", "AzureArrowElement", "HorizontalArrowElement", "SecurityGroupElement", "AzureSecurityGroupElement", "SecurityArrow", "AureSecurityArrow", "HorizontalSecurityArrow", "NSGElement", "Resource",
    function(View, Graph, ArrowElement, AzureArrowElement, HorizontalArrowElement, SecurityGroupElement, AzureSecurityGroupElement, SecurityArrow, AureSecurityArrow, HorizontalSecurityArrow, NSGElement, Resource) {
      return {
        create: function(obj) {
          var view = View.create(obj);

          // TODO: i reckon a lot of this can be sent to View.create as an 'options' array, eh
          view.name = "Security Group";
          view.canvas = "jointjs";
          view.positioned = false;
          view.height = 0;
          view.width  = 0;
          view.model = new Graph();

          view.model.shapes.custom = {
            "Resources::AWS::EC2::SecurityGroup": SecurityGroupElement,
            "Resources::Azure::Network::Subnet": AzureSecurityGroupElement,
            "Resources::Azure::Network::NetworkInterface": AzureSecurityGroupElement,
            "Resources::Azure::Network::NetworkSecurityGroup": ArrowElement,
            "Resources::Azure::Network::ApplicationSecurityGroup": AzureSecurityGroupElement,
            "Resources::Security::Arrow": ArrowElement,
            "Resources::Security::Arrow::Azure": AzureArrowElement,
            "Resources::Security::Arrow::Horizontal": HorizontalArrowElement,
            "Resources::Azure::Generic::GlobalResource": AzureSecurityGroupElement
          };
          view.isEmpty = function() {
            return this.model.resourceCells.length === 0 && this.model.resourceLinks.length === 0;
          };

          view.load_with_positions = function(model, coords) {
            this.coordinates = coords;

            _.each(this.coordinates["arrows"], function(a) {
              a.y = a.y + 20;
              a.h = a.h - 40;
            });

            this.loadGroups(model);
            this.loadArrows(model);
            this.loadNSGs(model);
            this.loadInternalTraffic(model);
            this.loadLabels(model);

            this.loadDimensions();

            this.positioned = true;
          };

          view.reposition = function(model, coords) {
            // Implement when we can reposition
          };

          view.geometry = function(resource_id) {
            return _.filter(this.coordinates.rows, function(geometry) { return geometry["id"] === resource_id });
          };

          view.loadGroups = function(model) {
            _.each(this.coordinates["rows"], function(group) {
              var resource = model.getResource(group["id"]);

              if(resource) {
                this.model.createResourceCell(resource, group);
              }
              else {
                resource = this.loadEmptyResource(group);
                this.model.createResourceCell(resource, group);
              }
            }.bind(this));
          };

          view.loadLabels = function(model) {
            _.each(this.coordinates["labels"], function(label) {
              this.model.createTextBox(label);
            }.bind(this));
          };

          view.loadNSGs = function(model) {
            _.each(this.coordinates["nsg_blocks"], function(group) {
              var resource = model.getResource(group["id"])
              this.model.createShape(
                { id: group.id, x: group.x, y: group.y, width: group.w, height: group.h },
                NSGElement,
                {},
                resource
              );
            }.bind(this));
          }

          view.loadArrows = function(model) {
            _.each(this.coordinates["arrows"], function(arrow) {
              var geom = { x: arrow.x, y: arrow.y, w: arrow.width, h: arrow.height };
              var security_arrow;

              if (arrow.provider === "azure") {
                if (arrow.size === 0) {
                  security_arrow = HorizontalSecurityArrow.load(arrow)
                  this.loadSourceDestinations(model, security_arrow, 'id')
                } else {
                  security_arrow = AureSecurityArrow.load(arrow)
                  this.loadSourceDestinations(model, security_arrow, 'id')
                }
              } else {
                security_arrow = SecurityArrow.load(arrow);
                this.loadSourceDestinations(model, security_arrow, 'provider_id')
              }

              this.model.createResourceCell(security_arrow, geom, arrow);
              
            }.bind(this));
          };

          view.loadInternalTraffic = function(model) {
            _.each(this.coordinates["internal_blocks"], function(group) {
              var resource = model.getResource(group["id"])
              this.model.createShape(
                { name: "Internal", id: group.id, x: group.x, y: group.y, width: group.w, height: group.h },
                InternalElement,
                {},
                resource
              )
            })
          }

          view.loadDimensions = function() {
            var max_x, max_y = 0;

            _.each(this.coordinates.rows.concat(this.coordinates.labels), function(group) {
              max_x = group.x + group.w;
              max_y  = group.y + group.h;

              if(max_y > this.height) this.height = max_y;
              if(max_x > this.width)  this.width  = max_x;
            }.bind(this));

            // Add some padding
            this.height += 50;
            this.width += 50;
          };

          view.loadEmptyResource = function(group) {
            var resource = Resource.load(
              {
                name: group.name,
                type: 'Resources::Azure::Generic::GlobalResource',
                id: _.uniqueId(1000)
              }
            );

            resource.only_properties = {};
            resource.type_name = group.name;
            resource.info = function() {return {}}

            return resource;
          }

          view.loadSourceDestinations = function (model, security_arrow, id) {
            // Find source/destination information
            const source_row = this.coordinates["rows"].find((r) => r[id] === security_arrow.src);
            const destination_row = this.coordinates["rows"].find((r) => r[id] === security_arrow.dst);

            // Add source/destination information on arrows
            let source = model.getResource(source_row.id);
            let destination = model.getResource(destination_row.id);

            if (!source)  {
              source = source_row;
              source.resource = false;
            } else {
              source.resource = true;
            }
            if (!destination) {
              destination = destination_row;
              destination.resource = false;
            } else {
              destination.resource = true;
            }

            security_arrow.source = source;
            security_arrow.destination = destination;
          }

          return view;
        }
      }
    }]);
