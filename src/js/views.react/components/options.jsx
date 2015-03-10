define(function (require) {
  var React     = require('react'),
      TableView = require('jsx!views.react/components/table').TableView,
      _         = require('underscore'),
      Col       = require('jsx!views.react/components/dummy'),
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
  
  var EditableCell = React.createClass({
    getInitialState: function () {
      return {
        value: this.getModel().value,
        edit: false,
        width: ''
      };
    },
    
    componentWillUpdate: function (nextProps, nextState) {
      if (nextState.edit === true) {
        nextState.width = $(this.getDOMNode()).width();
      } else {
        nextState.width = '';
      }
    },
    
    componentDidUpdate: function () {
      var el = this.getDOMNode(),
          $el = $(el);
    
      if (this.state.edit) {
        $el.find('input').focus();
        $el.find('input').on('blur.input.edit', this.cancel);
      }
    },
    
    componentWillUnmount: function () {
      $(this.getDOMNode()).find('input').off('blur.input.edit');
    },
    
    componentWillReceiveProps: function (nextProps) {
      var val = nextProps.children.props.model.value;
      
      if (val !== this.state.value) {
        this.setState({ value: val });
      }
    },
  
    onClick: function (e) {
      this.setState({
        edit: true
      });
    },
    
    save: function () {
      var option = this.getModel().name,
          val    = this.state.value;

      this.props._model.setOption(option, val);
      
      this.setState({
        edit: false,
        value: val ? val : this.getModel().sysvalue
      });
    },
    
    cancel: function () {
      $(this.getDOMNode()).find('input').off('blur.input.edit');
    
      this.setState({
        edit: false,
        value: this.getModel().value
      });
    },
    
    onChange: function (e) {
      this.setState({
        value: e.target.value
      });
    },
    
    onKeyUp: function (e) {
      if (e.key === 'Enter') {
        this.save();
      } else if (e.key === 'Escape') {
        this.cancel();
      }
    },
    
    getModel: function () {
      return this.props.children.props.model;
    },
    
    render: function () {
      var props = _.omit(this.props, ['children']),
          style = { width: this.state.width },
          cls   = React.addons.classSet({
                    editable: true,
                    editor: this.state.edit
                  });
      
      if (this.state.edit) {
        view = <input type="text" value={ this.state.value } onChange={ this.onChange } onKeyUp={ this.onKeyUp } />;
      } else {
        view = <span>{ this.state.value || 'not set' }</span>;
      }
    
      return (
        <td {...this.props} className={ cls } onClick={ this.onClick } style={ style }>{ view }</td>
      );
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
              <Col name="">
                <SystemIcon />
              </Col>
              <Col name="Options">
                <DescView className="name" />
              </Col>
              <Col name="Value" cellView={ EditableCell }>
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