angular.module('designer.attributes.region', [])
  .directive('regionInfo', [function() {
    return {
      templateUrl: '/designer/attributes/region.html',
      replace: true,
      scope: {
        regions: "=",
        responsive: "="
      },
      link: function (scope, element, attrs) {
        scope.region_location = {
          // AWS
          "eu-north-1":     { l: { y: 47,  x: 438}, m: { y: 19, x: 240}, location: "Stockholm", name: "eu-north-1"},
          "ap-south-1":     { l: { y: 175, x: 606}, m: { y: 92, x: 335}, location: "Mumbai", name: "ap-south-1"},
          "eu-west-3":      { l: { y: 80,  x: 406}, m: { y: 49, x: 232}, location: "Paris", name: "eu-west-3"},
          "eu-west-2":      { l: { y: 68,  x: 394}, m: { y: 31, x: 217}, location: "London", name: "eu-west-2"},
          "eu-west-1":      { l: { y: 66,  x: 378}, m: { y: 28, x: 207}, location: "Ireland", name: "eu-west-1"},
          "ap-northeast-2": { l: { y: 112, x: 744}, m: { y: 58, x: 412}, location: "Seoul", name:"ap-northeast-2"},
          "ap-northeast-1": { l: { y: 120, x: 781}, m: { y: 60, x: 430}, location: "Tokyo", name:"ap-northeast-1"},
          "sa-east-1":      { l: { y: 305, x: 266}, m: { y: 162, x: 146}, location: "São Paulo", name: "sa-east-1"},
          "ca-central-1":   { l: { y: 105, x: 138}, m: { y: 48,  x: 64}, location: "Canada Central", name: "ca-central-1"},
          "ap-southeast-1": { l: { y: 224, x: 695}, m: { y: 116, x: 384}, location: "Singapore", name:"ap-southeast-1"},
          "ap-southeast-2": { l: { y: 341, x: 817}, m: { y: 178, x: 457}, location: "Sydney", name:"ap-southeast-2"},
          "eu-central-1":   { l: { y: 93,  x: 451}, m: { y: 43, x: 251}, location: "Frankfurt", name: "eu-central-1"},
          "us-east-1":      { l: { y: 117, x: 181}, m: { y: 61, x: 95}, location: "N. Virginia", name: "us-east-1"},
          "us-east-2":      { l: { y: 106, x: 167}, m: { y: 51, x: 83}, location: "Ohio", name: "us-east-2"},
          "us-west-1":      { l: { y: 124, x: 69 }, m: { y: 64, x: 40}, location: "N. California", name: "us-west-1"},
          "us-west-2":      { l: { y: 98,  x: 64},  m: { y: 55, x: 32}, location: "Oregon", name: "us-west-2"},
          "eu-south-1":     { l: { y: 93,  x: 427}, m: { y: 38, x: 227}, location: "Milan", name: "eu-south-1"},
          "af-south-1":     { l: { y: 341, x: 445}, m: { y: 181, x: 245}, location: "Cape Town", name: "af-south-1"},
        }  
        _.each(scope.regions, function(region) { 
          if(scope.region_location[region]){
            scope.region_location[region]["in_use"] = true;
          };
        })
      }
    }
  }]);
