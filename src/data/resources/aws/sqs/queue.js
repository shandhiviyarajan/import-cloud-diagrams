angular.module('designer.model.resources.aws.sqs.queue', ['designer.model.resource'])
.factory('AWS_SQSQueue', ["Resource", function(Resource) {
  return {
    load: function(resource, environment) {
      resource = Resource.load(resource, environment);
      resource.type_name = 'SQS QUEUE';

      resource.info = function() {
        var info = {};

        info.created = moment(this.created_timestamp * 1000).format('MMMM Do YYYY, HH:mm');
        info.modified = moment(this.last_modified_timestamp * 1000).format('MMMM Do YYYY, HH:mm');
        info.retention = this.secondsToDMS(this.message_retention_period || 0);
        info.queue = this.getQueue();

        return info;
      };

      resource.getQueue = function() {
        return environment.connectedTo(this, "Resources::AWS::SQS::Queue")[0];
      };

      resource.secondsToDMS = function(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);

        var dDisplay = d > 0 ? d + (d === 1 ? " day " : " days ") : "";
        var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes ") : "";
        var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

        return dDisplay + hDisplay + mDisplay + sDisplay;
      };

      return resource;
    }
  }
}]);
