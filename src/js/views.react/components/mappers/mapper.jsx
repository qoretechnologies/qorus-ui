define(function (require) {
  var React       = require('react'),
      MetaTable   = require('jsx!views.react/components/metatable'),
      Tabs        = require('jsx!views.react/components/tabs'),
      Tab         = Tabs.Tab,
      TabsView    = Tabs.TabsView,
      MapperGraph = require('jsx!views.react/components/mappers/graph'),
      Mapper;

  require('react.backbone');

  Mapper = React.createBackboneClass({
    render: function () {
      var model = this.props.model.toJSON();

      return (
        <div>
          <TabsView>
            <Tab name="graph">
              <MapperGraph mapper={ model } />
            </Tab>
            <Tab name="info">
              <MetaTable data={ model } />
            </Tab>
          </TabsView>
        </div>
      );
    }
  });

  return Mapper;
});
