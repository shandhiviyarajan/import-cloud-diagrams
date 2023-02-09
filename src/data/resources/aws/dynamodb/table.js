angular.module('designer.model.resources.aws.dynamodb.table', ['designer.model.resource'])
.factory('AWS_DynamoDBTable', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'DYNAMODB TABLE';
      resource.status = resource.table_status.toLowerCase();
      resource.status_list = {
        "creating": "warn",
        "updating": "warn",
        "deleting": "warn",
        "active": "good",
        "inaccessible_encryption_credentials": "bad",
        "archiving": "warn",
        "archived": "stopped"
      };

      resource.index_status_list = {
        "CREATING": "warn",
        "UPDATING": "warn",
        "DELETING": "warn",
        "ACTIVE": "good"
      };

      resource.replica_status_list = {
        "CREATING": "warn",
        "CREATION_FAILED": "bad",
        "UPDATING": "warn",
        "DELETING": "warn",
        "ACTIVE": "good"
      };

      resource.attribute_types = {
        "S": "String",
        "N": "Number",
        "B": "Binary",
        null: "-"
      }

      resource.info = function() {
        var info = {};

        //  Primary keys
        var values = this.parseKeySchema(this.key_schema);
        info.primary_partition_key = values.partition_key;
        info.primary_sort_key = values.sort_key;

        // Indexes
        _.each(this.local_secondary_indexes.concat(this.global_secondary_indexes), function(index) {
          var values = this.parseKeySchema(index.key_schema);
          index.partition_key = values.partition_key;
          index.sort_key = values.sort_key;

        }.bind(this));

        return info;
      };

      resource.parseKeySchema = function(key_schema) {
        var values = { partition_key: null, sort_key: null };

        _.each(key_schema, function(schema) {
          var definition = _.find(this.attribute_definitions, function(def) { return def.attribute_name === schema.attribute_name });

          if(schema.key_type === "HASH") {
            values.partition_key = { name: schema.attribute_name, type: this.attribute_types[definition.attribute_type] };
          }
          else if(schema.key_type === 'RANGE') {
            values.sort_key = { name: schema.attribute_name, type: this.attribute_types[definition.attribute_type] };
          }
        }.bind(this));

        return values;
      };

      return resource;
    }
  }
}]);

