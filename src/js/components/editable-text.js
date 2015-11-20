import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


import { pureRender } from './utils';


@pureRender
export default class EditableCell extends Component {
  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    context: PropTypes.any,
    onSave: PropTypes.func
  }

  static defaultProps = {
    value: '',
    onSave: () => {}
  }

  constructor(props) {
    super(props);

    this.tableCell = null;
    this.editField = null;
    this.state = {
      value: props.value,
      edit: false,
      width: ''
    };
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.width = nextState.edit ?
      ('' + this.tableCell.offsetWidth + 'px') :
      '';
  }

  componentDidUpdate() {
    if (this.state.edit) {
      this.editField.focus();
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  onKeyUp(e) {
    switch (e.key) {
    case 'Enter':
      this.commit();
      break;
    case 'Escape':
      this.cancel();
      break;
    default:
      // Nothing.
      break;
    }
  }

  start() {
    this.setState({
      value: this.props.value,
      edit: true
    });
  }

  commit() {
    this.props.onSave(this.state.value, this.props.context);

    this.setState({ edit: false });
  }

  cancel() {
    this.setState({ edit: false });
  }

  render() {
    const { value, onSave, ...props } = this.props;

    return (
      <div
        {...props}
        className={classNames({
          editable: true,
          editor: this.state.edit
        })}
        onClick={this.start.bind(this)}
        style={{ width: this.state.width }}
        ref={c => this.tableCell = c}
      >
        {
          this.state.edit ?
            <input
              type='text'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onKeyUp={this.onKeyUp.bind(this)}
              onBlur={this.cancel.bind(this)}
              ref={c => this.editField = c}
            /> :
            <span>{this.props.value}</span>
        }
      </div>
    );
  }
}
