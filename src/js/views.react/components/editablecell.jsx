define(function (require) {
  var React      = require('react'),
      classNames = require('classnames');

  var EditableCell = React.createClass({
    getInitialState: function () {
      var valueAttr = this.props.dataKey;
      return {
        value: this.getModel()[valueAttr],
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
      $(this.getDOMNode()).find('input').off('blur.input.edit');
      var atr = this.props.attributeName || 'name';

      var option = this.getModel()[atr],
          val    = this.state.value;

      if (this.props.onSave) {
        this.props.onSave(option, val);
      } else if (this.props._model.setOption) {
        this.props._model.setOption(option, val);
      } else {
        console.warn('You have to implement onSave handler');
      }

      this.setState({
        edit: false,
        value: val
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
      return this.props.model;
    },

    render: function () {
      var props = _.omit(this.props, ['children']),
          style = { width: this.state.width },
          cls   = classNames({
                    editable: true,
                    editor: this.state.edit
                  });

      if (this.state.edit) {
        view = <input type="text" value={ this.state.value } onChange={ this.onChange } onKeyUp={ this.onKeyUp } />;
      } else {
        view = <span>{ this.state.value }</span>;
      }

      return (
        <td {...this.props} className={ cls } onClick={ this.onClick } style={ style }>{ view }</td>
      );
    }
  });

  return EditableCell;
});