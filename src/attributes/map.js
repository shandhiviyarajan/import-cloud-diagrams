angular.module("designer.attributes.map", [])
.directive("map", [function() {
  return {
    templateUrl: "/designer/attributes/map.html",
    scope:{
      regions: "=",
      responsive: "=" 
    },   
    replace: true,
    link: function (scope, element, attrs, ctrl) {
      scope.path = "assets";

      var region_location = {
        // AWS
        "eu-north-1":     { s: { y: 59, x: 166}, location: "Stockholm", name: "eu-north-1", color: "orange" },
        "ap-south-1":     { s: { y: 99, x: 219}, location: "Mumbai", name: "ap-south-1", color: "orange" },
        "eu-west-3":      { s: { y: 76, x: 154}, location: "Paris", name: "eu-west-3", color: "orange" },
        "eu-west-2":      { s: { y: 64, x: 142}, location: "London", name: "eu-west-2", color: "orange" },
        "eu-west-1":      { s: { y: 53, x: 137}, location: "Ireland", name: "eu-west-1", color: "orange" },
        "ap-northeast-2": { s: { y: 76, x: 277}, location: "Seoul", name:"ap-northeast-2", color: "orange" },
        "ap-northeast-1": { s: { y: 82, x: 289}, location: "Tokyo", name:"ap-northeast-1", color: "orange" },
        "sa-east-1":      { s: { y: 152, x: 107}, location: "São Paulo", name: "sa-east-1", color: "orange" },
        "ca-central-1":   { s: { y: 70, x: 61}, location: "Canada Central", name: "ca-central-1", color: "orange" },
        "ap-southeast-1": { s: { y: 129, x: 254}, location: "Singapore", name:"ap-southeast-1", color: "orange" },
        "ap-southeast-2": { s: { y: 158, x: 300}, location: "Sydney", name:"ap-southeast-2", color: "orange" },
        "eu-central-1":   { s: { y: 65, x: 178}, location: "Frankfurt", name: "eu-central-1", color: "orange" },
        "us-east-1":      { s: { y: 82, x: 84}, location: "N. Virginia", name: "us-east-1", color: "orange" },
        "us-east-2":      { s: { y: 82, x: 65}, location: "Ohio", name: "us-east-2", color: "orange" },
        "us-west-1":      { s: { y: 93, x: 37}, location: "N. California", name: "us-west-1", color: "orange" },
        "us-west-2":      { s: { y: 82, x: 37}, location: "Oregon", name: "us-west-2", color: "orange" },
        "eu-south-1":     { s: { y: 82, x: 173}, location: "Milan", name: "eu-south-1", color: "orange" },
        "af-south-1":     { s: { y: 171, x: 166}, location: "Cape Town", name: "af-south-1", color: "orange" },
      
        // Azure 
        "eastasia":      { s: { y: 83, x: 277 }, name: "AP East", location: "Hong Kong", color: "blue" },
        "southeastasia": { s: { y: 129, x: 254 }, name: "AP Southeast", location: "Singapore", color: "blue" },
        "uaecentral":    { s: { y: 105, x: 207 }, name: "AE Central", location: "Abu Dhabi",  color: "blue" },
        "uaenorth":      { s: { y: 105, x: 201 }, name: "AE North", location: "Dubai",  color: "blue" },
        "australiaeast": { s: { y: 158, x: 300 }, name: "AU East", location: "New South Wales", color: "blue" },
        "australiasoutheast": { s: { y: 170, x: 289 }, name: "AU Southeast", location: "Victoria", color: "blue" },
        "australiacentral":   { s: { y: 159, x: 295 }, name: "AU Central", location: "Canberra", color: "blue" },
        "australiacentral2":  { s: { y: 159, x: 295 }, name: "AU Central 2", location: "Canberra", color: "blue" },
        "brazilsouth":   { s: { y: 152, x: 107 },  name: "BR South", location: "São Paulo", color: "blue" },
        "canadacentral": { s: { y: 70, x: 61 }, name: "CA Central", location: "Toronto", color: "blue" },
        "canadaeast":    { s: { y: 71, x: 84 },  name: "CA East", location: "Quebec", color: "blue" },
        "switzerlandnorth":   { s: { y: 82, x: 173 }, name: "CH North", location: "Zürich",  color: "blue" },
        "switzerlandwest": { s: { y: 82, x: 173 }, name: "CH West", location: "Geneva",  color: "blue" },
        "northeurope":   { s: { y: 53, x: 137 }, name: "EU North", location: "Ireland",  color: "blue" },
        "westeurope":    { s: { y: 64, x: 149 }, name:"EU West", location: "Netherlands",  color: "blue" },
        "francecentral": { s: { y: 76, x: 154 }, name: "FR Central", location: "Paris",  color: "blue" },
        "francesouth":   { s: { y: 82, x: 154 }, name: "FR South", location: "Marseille",  color: "blue" },
        "centralindia":  { s: { y: 99, x: 219 }, name: "IN Central", location: "Pune",  color: "blue" },
        "southindia":    { s: { y: 105, x: 231 }, name: "IN South", location: "Chennai", color: "blue" },
        "westindia":     { s: { y: 99, x: 219 }, name: "IN West", location: "Mumbai",  color: "blue" },
        "japaneast":     { s: { y: 82, x: 289 },  name: "JA East", location: "Tokyo",  color: "blue" },
        "japanwest":     { s: { y: 94, x: 283 },  name: "JA West", location: "Osaka",  color: "blue" },
        "koreacentral":  { s: { y: 76, x: 277 }, name: "KR Central", location: "Seoul",  color: "blue" },
        "koreasouth":    { s: { y: 83, x: 277 }, name: "KR South", location: "Busan",  color: "blue" },
        "uksouth":       { s: { y: 64, x: 142 }, name: "UK South", location: "London",  color: "blue" },
        "ukwest":        { s: { y: 64, x: 142 }, name: "UK West", location: "Cardiff",  color: "blue" },
        "centralus":     { s: { y: 70, x: 61 }, name: "US Central", location: "Iowa", color: "blue" },
        "eastus":        { s: { y: 82, x: 84 }, name: "US East", location: "Virginia", color: "blue" },
        "eastus2":        { s: { y: 82, x: 84 }, name: "US East 2", location: "Virginia", color: "blue" },
        "northcentralus": { s: { y: 70, x: 61 }, name: "US  North Central", location: "Illinois", color: "blue" },
        "southcentralus": { s: { y: 94, x: 49 }, name: " US South Central", location: "Texas", color: "blue" },
        "westus":         { s: { y: 93, x: 37 }, namee: "US West", location: "California", color: "blue" },
        "westus2":        { s: { y: 93, x: 37 }, namee: "US West 2", location: "California", color: "blue" },
        "westcentralus":  { s: { y: 88, x: 49 }, name: "US West Central", location: "Wyoming", color: "blue" },
        "southafricanorth": { s: { y: 171, x: 166 }, name: "ZA North", location: "Johannesburg", color: "blue" },
        "southafricawest":  { s: { y: 171, x: 166 }, name: "ZA West", location: "Cape Town", color: "blue" },

        //GCP
        "asia-east1": { s: { y: 94, x: 283 }, name: "asia-east1", location: "Taiwan", color: "purple" },
        "asia-east2": { s: { y: 83, x: 277 }, name: "asia-east2", location: "Hong Kong", color: "purple" },
        "asia-northeast1": { s: { y: 82, x: 289 }, name: "asia-northeast1", location: "Tokyo", color: "purple" },
        "asia-northeast2": { s: { y: 82, x: 289 }, name: "asia-northeast2", location: "Osaka", color: "purple" },
        "asia-northeast3": { s: { y: 76, x: 277 }, name: "asia-northeast3", location: "Seoul", color: "purple" },
        "asia-south1": { s: { y: 99, x: 219 }, name: "asia-south1", location: "Mumbai", color: "purple" },
        "asia-southeast1": { s: { y: 129, x: 254 }, name: "asia-southeast1", location: "Singapore", color: "purple" },
        "australia-southeast1": { s: { y: 158, x: 300 }, name: "australia-southeast1", location: "Sydney", color: "purple" },
        "europe-north1": { s: { y: 59, x: 176 }, name: "europe-north1", location: "Finland", color: "purple" },
        "europe-west1": { s: { y: 70, x: 154 }, name: "europe-west1", location: "Belgium", color: "purple" },
        "europe-west2": { s: { y: 64, x: 142 }, name: "europe-west2", location: "London", color: "purple" },
        "europe-west3": { s: { y: 65, x: 178 }, name: "europe-west3", location: "Frankfurt", color: "purple" },
        "europe-west4": { s: { y: 64, x: 149 }, name: "europe-west4", location: "Netherlands", color: "purple" },
        "europe-west6": { s: { y: 82, x: 173 }, name: "europe-west6", location: "Zurich", color: "purple" },
        "northamerica-northeast1": { s: { y: 71, x: 84 }, name: "northamerica-northeast1", location: "Montreal", color: "purple" },
        "southamerica-east1": { s: { y: 152, x: 107 }, name: "southamerica-east1", location: "São Paulo", color: "purple" },
        "us-central1": { s: { y: 70, x: 61 }, name: "us-central1", location: "Iowa", color: "purple" },
        "us-east1": { s: { y: 88, x: 73 }, name: "us-east1", location: "South Carolina", color: "purple" },
        "us-east4": { s: { y: 82, x: 84 }, name: "us-east4", location: "Northern Virginia", color: "purple" },
        "us-west1": { s: { y: 82, x: 37 }, name: "us-west1", location: "Oregon", color: "purple" },
        "us-west2": { s: { y: 93, x: 37 }, name: "us-west2", location: "Los Angeles", color: "purple" },
        "us-west3": { s: { y: 82, x: 43 }, name: "us-west3", location: "Salt Lake City", color: "purple" },
        "us-west4": { s: { y: 88, x: 49 }, name: "us-west4", location: "Las Vegas", color: "purple" }
      }
      scope.loadRegions = function() {
        scope.mapped_regions = _.pickBy(region_location, function(v,r) {return scope.regions.indexOf(r) !== -1 });
      }

      scope.loadRegions();

      scope.$on("environment:reloaded",  function(event, environment, params) {
        scope.regions = environment.regions;
        scope.loadRegions();
      });
    }
  }
}]);
