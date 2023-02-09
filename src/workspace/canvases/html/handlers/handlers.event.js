angular.module('designer.workspace.canvases.html.handler.event', [])
  .factory('HtmlEventHandler', [function() {
    function EventHandler() {
      this.listeners = {};
    }

    EventHandler.prototype.on = function(event_name, callme) {
      if(!this.listeners[event_name]) this.listeners[event_name] = [];

      this.listeners[event_name].push(callme);
    };

    EventHandler.prototype.trigger = function() {
      var args = _.map(arguments, function(a) { return a });
      var event_name = args.shift();

      if(this.listeners[event_name]) {
        _.each(this.listeners[event_name], function(callme) {
          callme.apply(null, args);
        });
      }
    };

    EventHandler.prototype.off = function() {
      if(arguments.length == 1) {
        delete this.listeners[arguments[0]];
      }
      else {
        this.listeners = {};
      }
    };

    return EventHandler;
  }]);
