angular.module('designer.model.resources.aws.ecs.task', ['designer.model.resource'])
  .factory('AWS_ECSTask', ["Resource", function(Resource) {
    return {
      load: function(resource, environment) {
        resource = Resource.load(resource, environment);
        resource.type_name = 'ECS TASK';
        resource.status = resource.last_status.toLowerCase();
        resource.task_definition = resource.task_definition_arn.split("/")[1];
        resource.status_list = {
          "provisioning": "warn",
          "pending": "warn",
          "activating": "warn",
          "running": "good",
          "deactivating": "warn",
          "stopping": "warn",
          "deprovisioning": "warn",
          "stopped": "stopped"
        };
        resource.label_status_list = {
          "provisioning": "warning",
          "pending": "warning",
          "activating": "warning",
          "running": "success",
          "deactivating": "warning",
          "stopping": "warning",
          "deprovisioning": "warning",
          "stopped": "secondary"
        };

        resource.info = function() {
          var info = {};

          info.cluster = this.getCluster();
          info.container_instance = this.getContainerInstance();
          info.containers = this.getContainers();
          info.service = this.getService();
          info.attachments = this.getAttachments();
          info.attachment_info = this.getAttachmentInfo();
          info.task_definition = this.getTaskDefinition();

          return info;
        };

        resource.getTaskDefinition = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::TaskDefinition")[0];
        };

        resource.getCluster = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Cluster")[0];
        };

        resource.getService = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Service")[0];
        };

        resource.getContainerInstance = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::ContainerInstance")[0];
        };

        resource.getContainers = function() {
          return environment.connectedTo(this, "Resources::AWS::ECS::Container");
        };

        resource.getAttachments = function() {
          return environment.connectedTo(this, "Resources::AWS::EC2::NetworkInterface");
        };

        resource.getAttachmentInfo = function() {
          var attachments = {};

          _.each(this.attachments, function(info) {
            var nic_provider_details = _.find(info["details"], function(detail) { return detail["name"] === "networkInterfaceId" }) || {};
            attachments[nic_provider_details["value"]] = info;
          });

          return attachments;
        };

        return resource;
      }
    }
  }]);
