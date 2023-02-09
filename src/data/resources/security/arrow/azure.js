angular.module('designer.model.resources.security.arrow.azure', ['designer.model.resource'])
  .factory('AureSecurityArrow', ["Resource", function(Resource) {
    return {
      load: function(resource) {
        resource.type_name = 'SECURITY';
        resource.name = "Arrow";
        resource.type = "Resources::Security::Arrow::Azure";

        resource = Resource.load(resource);

        return resource;
      }
    }
  }]);
