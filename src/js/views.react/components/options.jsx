define(function (require) {
  var React        = require('react'),
      TableView    = require('jsx!views.react/components/table').TableView,
      _            = require('underscore'),
      Col          = require('jsx!views.react/components/dummy'),
      EditableCell = require('jsx!views.react/components/editablecell'),
      SOptions     = require('models/system').Options,
      Option       = require('models/option'),
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
  
  var SystemOptions = React.createClass({
    getInitialState: function () {
      return {
        edit: false
      };
    },
    
    propTypes: {
      'onOptionAdd': React.PropTypes.func
    },
    
    add: function () {
      if (this.props.onOptionAdd) {
        var opt = SOptions.get(this.refs.opt.getDOMNode().value);
        this.props.onOptionAdd(opt);
      }
      this.cancel();
    },
    
    selectOption: function (e) {
      this.setState({ option: e.currentTarget.value });
    },
  
    addOption: function () {
      this.setState({ edit: true });
    },
    
    cancel: function () {
      this.setState({ edit: false, option: null });
    },
  
    render: function () {
      var options,
          edit = this.state.edit,
          exclude = this.props.exclude;
    
      if (!edit) {
        return (
          <a className="btn btn-success btn-small" onClick={ this.addOption }><i className="icon-plus" /> Add option</a>
        );      
      } else {
        var soptions = SOptions.getFor('workflow').filter(function (opt) {
          return !_.contains(exclude, opt.name);
        });
        
        options = _.map(soptions, function (opt) {
          return <option value={ opt.name }>{ opt.name }</option>;
        });
        
        return (
          <div>
            <select ref="opt" onChange={ this.selectOption }>
              { options }
            </select>
            <a className="btn btn-success btn-small" onClick={ this.add }><i className="icon-plus" /> Add</a>
            <a className="btn btn-danger btn-small" onClick={ this.cancel }><i className="icon-remove" /> Cancel</a>
          </div>
        );
      }
    }
  });
  
  ActionsCol = React.createClass({
    remove: function () {
      var model = this.props.model,
          opt = new Option({ name: model.name, value: ''});

      this.props.optionAdd(opt);
    },
  
    render: function () {
      return (
        <a className="label label-danger" onClick={ this.remove }><i className="icon-remove"></i></a>
      );
    }
  });
  
  OptionsView = React.createBackboneClass({
    propTypes: {
      options: React.PropTypes.array.isRequired
    },    
    
    optionAdd: function (opt) {
      this.props.model.setOption(opt.get('name'), opt.get('value'));
    },
    
    render: function () {
      return (
        <div>
          <h4>Options</h4>
          <div className="options">
            <TableView
              collection={ this.props.model.get('options') } 
              rowClick={ _.noop } 
              cssClass="table table-condensed table-sripped table-align-left">
              <Col name="Options">
                <DescView className="name" />
              </Col>
              <Col name="Value" cellView={ EditableCell } model={ this.props.model }>
                <Col _model={ this.props.model } />
              </Col>
              <Col className="narrow">
                <ActionsCol optionAdd={ this.optionAdd } className="middle" /> 
              </Col>
            </TableView>
            <SystemOptions exclude={ _.pluck(this.props.options, 'name') } onOptionAdd={ this.optionAdd } />
          </div>
        </div>
      );
    }
  });
  
  return OptionsView;
});