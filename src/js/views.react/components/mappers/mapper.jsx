define(function (require) {
  var React = require('react'),
      MetaTable = require('jsx!views.react/components/metatable'),
      Mapper;
  
  require('react.backbone');
  
  Mapper = React.createBackboneClass({
    render: function () {
      return (
        <div>
          <MetaTable data={ this.props.model.toJSON() } />
        </div>
      );
    }
  });

  return Mapper;
});