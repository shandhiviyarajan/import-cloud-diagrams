angular.module('reporter.state', [])
.value('ReporterState', {
  default: {
    expandedList: {},
    exportOption: ""
  },

  overrides: {},

  set: function(k, v) {
    this.overrides[k] = v;
  },

  get: function(k) {
    return this.overrides[k] || this.default[k];
  },

  reset: function(k) {
    this.overrides[k] = angular.copy(this.default[k]);
  }
});
