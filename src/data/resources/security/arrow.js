angular.module('designer.model.resources.security.arrow', ['designer.model.resource'])
  .factory('SecurityArrow', ["Resource", function(Resource) {
    return {
      load: function(resource) {
        resource.type_name = 'SECURITY';
        resource.name = "Arrow";
        resource.type = "Resources::Security::Arrow";

        resource = Resource.load(resource);

        return resource;
      }
    }
  }]);
