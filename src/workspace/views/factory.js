angular.module("designer.workspace.views.factory", [
  "designer.model.view",
  "designer.workspace.views.infrastructure",
  "designer.workspace.views.infrastructure-info",
  "designer.workspace.views.security",
  "designer.workspace.views.container",
  "designer.workspace.views.list"
])
  .service("ViewsFactory", ["View", "InfrastructureView", "InfrastructureInfoView", "SecurityView", "ListView", "ContainerLayoutView",
    function(View, InfrastructureView, InfrastructureInfoView, SecurityView, ListView, ContainerLayoutView)
    {
      return function fromResourceObject(obj, environment) {
        var constructors = {
          "Views::Infrastructure": InfrastructureView,
          "Views::Infrastructure::Extended": InfrastructureInfoView,
          "Views::Security": SecurityView,
          "Views::Container": ContainerLayoutView,
          "Views::List": ListView
        };

        var c = constructors[obj.type];
        var view = c ? c.create(obj) : View.create(obj);

        view.load(environment);

        return view;
      };
    }]);
