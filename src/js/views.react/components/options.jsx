define(function (require) {
  var React        = require('react'),
      TableView    = require('jsx!views.react/components/table').TableView,
      _            = require('underscore'),
      Col          = require('jsx!views.react/components/dummy'),
      EditableCell = require('jsx!views.react/components/editablecell'),
      OptionsView;
      
  var DescView = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function () {
      var model = this.props.model;
      return (
        <span>
          { model.name }<br />
          <p className="muted">{ model.desc }</p>
        </span>
      );
    }
  });
  
  var SystemIcon = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function () {
      var modified, model = this.props.model;
      
      if (model.sysvalue) {
        modified = '*';
      }
      
      if (model.system) {
        return <p><i className="icon-cog" title={ (modified) ? "Overriden system option" : "System option" }/>{ modified }</p>;
      }
      
      return (<span />);
    }
  });
  
  OptionsView = React.createBackboneClass({
    propTypes: {
      options: React.PropTypes.array.isRequired
    },
    
    render: function () {
      return (
        <div>
          <h4>Options</h4>
          <div className="options">
            <TableView
              collection={ this.props.options } 
              rowClick={ _.noop } 
              cssClass="table table-condensed table-sripped table-align-left">
              <Col name="Options">
                <DescView className="name" />
              </Col>
              <Col name="Value" cellView={ EditableCell } model={ this.props.model }>
                <Col _model={ this.props.model } />
              </Col>
            </TableView>
          </div>
        </div>
      );
    }
  });
  
  return OptionsView;
});

/*            <a className="btn btn-success btn-small"><i className="icon-plus" /> Add option</a>*/
