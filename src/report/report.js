angular.module('report.report', [
  "report.graphs.bar-chart",
  "report.graphs.column-chart",
  "report.graphs.combo-chart",
  "report.graphs.report-map",
  "reporter.state",
  "report.exporter"
])
.directive('report', [
  function() {
  return {
    templateUrl: '/designer/report/report.html',
    replace: true,
    controller: ["$scope", "ReporterState", function($scope, ReporterState) {
      var report = $scope.Reporter.model;
      $scope.report = report;
      
      $scope.extended = {};
      $scope.mode = $scope.Reporter.mode ? "reporter-" + $scope.Reporter.mode : "reporter-app";
      var export_option = ReporterState.get("exportOption");
      $scope.export_option = _.isEmpty(export_option) ? "hide" : export_option;
      $scope.expanded_list = ReporterState.get("expandedList");
      $scope.path = $scope.Reporter.path || "assets";

      $scope.account_id = report.data.table.accounts[0].table.id;
      $scope.account_name = report.data.table.accounts[0].table.name;
      
      // Format Region/Resource Data 
      $scope.resource_stats = {};
      $scope.resource_stats["id"] = 'total-resources';
      $scope.resource_stats["title"] = 'Total Resources';
      $scope.resource_stats["categories"] = [];

      var series = [];
      var resource_list = report.data.table.resource_data_set;

      _.each(resource_list, function(resource) {
        var total = resource.table.data[0];
        if (total>0) {
          $scope.resource_stats.categories.push(resource.table.label);
          series.push(total);
        }    
      });
      $scope.resource_stats["series"] = [{
        name: 'Resources',
        data: series
      }];
      $scope.resource_stats["max"] = _.max(series);
  
      // Format Regions and Resources utilized
      $scope.region_resource_stats = {};
      var resource_hash = {};
      var region_resources = {};
      var region_stats = report.data.table.region_stats_tooltip.table[$scope.account_name].table;
      _.each(region_stats, function(resources, region) {
        var resource_list = _.compact(resources.split("<br>"))
        _.each(resource_list, function(resource){
          var resource_total = resource.split(":");

          if (!resource_hash[resource_total[0]]) resource_hash[resource_total[0]] = {};
          resource_hash[resource_total[0]][region] = resource_total[1];
          
          if (!region_resources[region]) region_resources[region] = {};
          region_resources[region][resource_total[0]] = resource_total[1];
        })   
      });
  
      var resource_values = {};
      var totals = [];
      var regions = _.keys(region_resources);
      _.each(regions, function(region, index){
        var total_region = 0;
        var tmp_resources = region_resources[region];
        _.each(tmp_resources, function(total, resource){
          if (!resource_values[resource]) resource_values[resource] = Array(regions.length).fill(null);
          resource_values[resource][index] = parseInt(total);
          total_region += parseInt(total);
        })
        totals.push(total_region);
      });
  
      var region_series = [];
      _.each(resource_values, function(values, resource){
        region_series.push({
          name: resource,
          data: values
        })
      });
  
      $scope.region_resource_stats["series"] = region_series;
      $scope.region_resource_stats["categories"] = regions;
      $scope.region_resource_stats["title"] = 'Resources by Region';
      $scope.region_resource_stats["max"] = _.max(totals);
      $scope.region_resource_stats["stack"] = true;
      
      // Format IAM Data
      $scope.iam_data = {};
      var active_values = {};
      var inactive_values = {};
      var list = report.data.table.iam_active_data_set;
      var categories = ['Users', 'Roles'];
  
      _.each(list, function(iam) {
        var key = iam.table.label;
        var val = iam.table.data[0];

        key.indexOf("Active") != -1 ? 
          active_values[key.replace('Active ','')] = val : 
          inactive_values[key.replace('Inactive ','')] = val;
      });
  
      var series = [
        {
          name: 'Active',
          data: _.sortBy(active_values, function(k,v) { return v })
        },
        {
          name: 'Inactive',
          data: _.sortBy(inactive_values, function(k,v) { return v }) 
        }
      ];
      
      var max_x = _.max(_.map(categories, function(category){
        return active_values[_.lowerCase(category)] + inactive_values[_.lowerCase(category)];
      }));

      $scope.iam_data["categories"] = categories;
      $scope.iam_data["series"] = series
      $scope.iam_data["title"] = "IAM";
      $scope.iam_data["max"] = max_x;
      $scope.iam_data["stack"] = true;
  
      $scope.findings = {};
  
      $scope.severity_color = {
        "Critical": "#ba1f06",
        "High": "#ff5a46",
        "Medium": "#fb9702",
        "Low": "#36a2eb",
        "Info": "#33cab2",
        "Verbose": "#00a9ff"
      };
      
      var findings_map = {
        "Critical": {},
        "High": {},
        "Medium": {},
        "Low": {},
        "Info": {},
        "Verbose": {}
      };

      var list = report.data.table.findings.table;
      $scope.extended.list = {};
  
      _.each(list, function(values, type){
        // Don't display cloudmapper errors, it's because the user didn't give us permission to check something
        if(type === "ERROR") return;

        _.each(values.table, function(vals, subtype) {
          var severity_regions = vals.table.accounts.table[$scope.account_id].table.regions.table;
          var details = _.find(_.uniq(_.map(severity_regions, function(val,key) {return val.table.hits[0].table.details})), function(state){ return state !== 'null' });
          if (! findings_map[vals.table.severity][type])  findings_map[vals.table.severity][type] = {};
          $scope.extended.list[subtype] = $scope.export_option=="expand" ? true : $scope.export_option=="preselected" ? _.includes($scope.expanded_list, subtype) : false;
          findings_map[vals.table.severity][type][subtype] = !_.isEmpty(details);
        });
      });
      ReporterState.set("expandedList", _.keys(_.pickBy($scope.extended.list, function(val) { return val})));

      $scope.findings_map = _.pickBy(findings_map, function(i) { return _.keys(i).length > 0 });

      var serie_pie1_hash = {};
      var serie_pie2 = [];
      var severity_total_resources = {};
      _.each($scope.findings_map, function(values, severity){
        var severity_finding = $scope.findings_map[severity];
        severity_total_resources[severity] = _.keys(values).length;

        _.each(severity_finding, function(subtypes, type){
          var total = _.keys(subtypes).length;
          serie_pie2.push({
            name: type,
            data: total
          });
          if (! serie_pie1_hash[severity])  serie_pie1_hash[severity] = 0;
          serie_pie1_hash[severity] = serie_pie1_hash[severity] + total;
        }); 
      }); 
  
      var serie_pie1 = [];
      _.each(serie_pie1_hash, function(values, resource){
        serie_pie1.push({
          name: resource,
          data: values
        })
      }); 
      
      $scope.findings["categories"] = ['Finding'];
      $scope.findings["series"] = [{ name: 'pie1', data: serie_pie1 }, { name: 'pie2', data: serie_pie2 }];
      $scope.findings["title"] = "Findings";
      $scope.findings["severity_total_resources"] = severity_total_resources;
  
      // Theme
      var theme = {
        series: {
          colors: [
            '#4bc0c0', '#36a2eb', '#f27173', '#ffcd56', '#289399',
            '#60ca87', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };
      // toastui.Chart.registerTheme('reportTheme', theme);
        
      $scope.set_extended_list = function(subtype) {
        $scope.extended.list[subtype] = !$scope.extended.list[subtype]
        ReporterState.set("expandedList", _.keys(_.pickBy($scope.extended.list, function(val) { return val})));
      };
    }],
    link: function(scope, element, attrs, ctrl) {
      
    }
  }
}]);
