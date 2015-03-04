define(function (require) {
  var React = require('react'),
      Actions = require('views.react/actions/form');

  var Field = React.createClass({
    getInitialState: function () {
      return {
        value: this.props.value
      };
    },
  
    onChange: function (e) {
      var val = e.target.value;
      
      if (this.props.type === 'bool') {
        val = e.target.checked;
      }
      
      this.setState({
        value: val
      });
    },
  
    render: function () {
      var View, 
          props = {
            id: this.props.attrName,
            value: this.state.value,
            onChange: this.onChange
          };
      
      switch (this.props.type) {
        case "string":
          View = <input type="text" {...props} />;
          break;
        case "bool":
          View = <input type="checkbox" checked={ this.state.value } {...props} />;
          break;
        case "text":
          View = <textarea {...props} />;
          break;
      }
    
      return (
        <div className="control-group">
          <label className="control-label" htmlFor={ this.props.attrName }>{ this.props.name }</label>
          <div className="controls">
            { View }
          </div>
        </div>
      );
    }
  });
  
  var ModelForm = React.createClass({
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      fields: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
      submit_text: React.PropTypes.string,
      store: React.PropTypes.object,
      actions: React.PropTypes.object
    },
    
    getDefaultProps: function () {
      var actions = new Actions();
      
      return {
        actions: actions,
        store: new Store(actions),
        submit_text: 'Save'
      };
    },
    
    onSave: function (e) {
      e.preventDefault();
      this.props.actions.submit(this.prepare());
    },
    
    prepare: function () {
      var refs = _.pluck(this.props.fields, 'attrName'),
          attrs = {};
      
      _.each(refs, function (ref) {
        attrs[ref] = this.refs[ref].state.value;
      }, this);
      
      return attrs;
    },
  
    render: function () {
      var state = this.state,
          model = this.props.model;
      
      var fields = _.map(this.props.fields, function (field) {
        return <Field {...field} value={ model.get(field.attrName) } ref={ field.attrName } />;
      });
    
      return (
        <form className="form-horizontal" id="error-edit-form" onSubmit={ this.onSave }>
          { fields }
          <button className="btn btn-success" type="submit">{ this.props.submit_text } </button>
        </form>
      );
    }
  });
  
  return {
    ModelForm: ModelForm,
    Field: Field
  };
});