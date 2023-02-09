angular.module("report.graphs.report-map", [])
.directive("reportMap", [function() {
  return {
    templateUrl: "/designer/report/graphs/report-map.html",
    scope:{
      data:"="
    },   
    replace: true,
    link: function (scope, element, attrs, ctrl) {
      scope.path = scope.$parent.Reporter.path || "assets";

      scope.region_location = {
        "eu-north-1": {name:"Stockholm", m: {x:47, y:438}, s: {x:19, y:240}},
        "ap-south-1": {name:"Mumbai", m: {x:175, y:606}, s: {x:92, y:335}},
        "eu-west-3": {name:"Paris", m: {x:80, y:406}, s: {x:49, y:232}},
        "eu-west-2": {name:"London", m: {x:68, y:394}, s: {x:31, y:217}},
        "eu-west-1": {name:"Ireland", m: {x:66, y:378}, s: {x:28, y:207}},
        "ap-northeast-2": {name:"Seoul", m: {x:112, y:744}, s: {x:58, y:412}},
        "ap-northeast-1": {name:"Tokyo", m: {x:120, y:781}, s: {x:60, y:430}},
        "sa-east-1": {name:"São Paulo", m: {x:305, y:266}, s: {x:162, y:146}},
        "ca-central-1": {name:"Canada Central", m: {x:105, y:138}, s: {x:48, y:64}},
        "ap-southeast-1": {name:"Singapore", m: {x:224, y:695}, s: {x:116, y:384}},
        "ap-southeast-2": {name:"Sydney", m: {x:341, y:817}, s: {x:178, y:457}},
        "eu-central-1": {name:"Frankfurt", m: {x:93, y:451}, s: {x:43, y:251}},
        "us-east-1": {name:"N. Virginia", m: {x:117, y:181}, s: {x:61, y:95}},
        "us-east-2": {name:"Ohio", m: {x:106, y:167}, s: {x:51, y:83}},
        "us-west-1": {name:"N. California", m: {x:124, y:69}, s: {x:64, y:40}},
        "us-west-2": {name:"Oregon", m: {x:98, y:64}, s: {x:55, y:32}},
        "eu-south-1": {name:"Milan", m: {x:93, y:427}, s: {x:38, y:227}},
        "af-south-1": {name:"Cape Town", m:{x:341, y:445}, s: {x:181, y:245}}
      };

      var used_regions = _.keys(_.pickBy(scope.data, function(v,r) {return v=="Y"}));
      scope.regions = _.pickBy(scope.region_location, function(v,r) {return used_regions.indexOf(r) !== -1 });
    }
  }
}]);
