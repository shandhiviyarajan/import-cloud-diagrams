angular.module('designer.model.resources.security.arrow.horizontal', ['designer.model.resource'])
  .factory('HorizontalSecurityArrow', ["Resource", function(Resource) {
    return {
      load: function(resource) {
        resource.type_name = 'SECURITY';
        resource.name = "Arrow";
        resource.type = "Resources::Security::Arrow::Horizontal";

        resource = Resource.load(resource);

        return resource;
      }
    }
  }]);
