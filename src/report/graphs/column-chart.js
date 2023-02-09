angular.module("report.graphs.column-chart", [])
.directive("columnChart", [function() {
  return {
    templateUrl: "/designer/report/graphs/chart.html",
    scope:{
      data:"="
    },   
    replace: true,
    link: function (scope, element, attrs, ctrl) {
      var el = document.getElementById('chart-area');
      var data = {
        categories: scope.data.categories,
        series: scope.data.series
      };
      var options = {
        chart: {
          width: 900,
          height: 650,
          title: scope.data.title,
          format: '1,000'
        },
        yAxis: {
          title: 'Total',
          min: 0,
          max: scope.data.max
        },
        xAxis: {
          title: 'Group'
        },
        series: {
          showLegend: true,
          showLabel: true,
          labelAlign: 'center'
        },
        legend: {
          align: 'bottom',
          visible: true
        },
        theme: {
          colors: [
            '#4bc0c0', '#36a2eb', '#f27173', '#ffcd56', '#289399',
            '#60ca87', '#617178', '#8a9a9a', '#516f7d', '#dddddd'
          ]
        }
      };
      if(scope.data.stack) options.series["stack"] = 'normal';

      toastui.Chart.columnChart({el, data, options});
    }
  }
}]);
