angular.module("report.graphs.combo-chart", [])
.directive("comboChart", [function() {
  return {
    templateUrl: "/designer/report/graphs/chart.html",
    scope: {
      data:"="
    },   
    replace: true,
    link: function (scope, element, attrs, ctrl) {

      scope.rgbToHex = function(r) {
        return "#" + ((1 << 24) + (r[0] << 16) + (r[1] << 8) + r[2]).toString(16).slice(1);
      };

      var severity_list_rgb = {
        "Critical": [196,63,42],
        "High": [255,90,70],
        "Medium": [251,151,2],
        "Low": [55, 161, 235],
        "Info": [51,202,178],
        "Verbose": [0,169,255]
      };
      var inside_colors = [];
      var outside_colors = [];

      _.each(scope.data.severity_total_resources, function(total, severity) {
        var rgb = severity_list_rgb[severity];
        inside_colors.push(scope.rgbToHex(rgb));
        for(var i = 0; i < total; i++){
          rgb = _.map(rgb, function(j) { var r = j+(10*1); return r<256 ? r : 255});
          outside_colors.push(scope.rgbToHex(rgb));
        }
      });

      var el = document.getElementById('chart-area');
      var data = {
        categories: scope.data.categories,
        seriesAlias: {
          pie1: 'pie',
          pie2: 'pie'
        },

        series: scope.data.series
      };
      var options = {
        chart: {
          width: 700,
          height: 700,
          title: scope.data.title
        },
        series: {
          dataLabels: {
            visible: true,
            pieSeriesName: {
              visible: true,
              anchor: 'center'
            }
          },
          pie1: {
            radiusRange: { inner: '57%' },
          },
          pie2: {
            radiusRange: { inner: '70%', outer: '100%' },
          }
        },
        legend: {
          visible: false
        },
        theme: {
          series: {
            pie1: {
              colors: inside_colors
            },
            pie2: {
              colors: outside_colors
            }
          }
        }
      };

      toastui.Chart.nestedPieChart({el, data, options});
    }
  }
}]);
