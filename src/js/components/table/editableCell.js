import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


import { pureRender } from '../utils';


/**
 * Table data cell component which allows editing value.
 *
 * On cell click, it starts editing by turning the cell content into
 * text field. On enter, it commits the value by calling onSave prop
 * with value and context props as parameters. By definition, value
 * can be only a string.
 *
 * Nothing is updated (except for internal state) so parent component
 * must trigger app state change.
 */
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

  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this._container = null;
    this._editField = null;
    this.state = {
      value: this.props.value,
      edit: false
    };
  }

  /**
   * Updates state value with new value prop.
   *
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (!this.state.edit) {
      this.setState({ value: nextProps.value })
    }
  }

  /**
   * Focuses the input field when editing has been started.
   *
   * @param {object} prevProps
   * @param {object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.edit && this.state.edit) {
      this._editField.focus();
      this._editField.setSelectionRange(this._editField.value.length,
                                        this._editField.value.length);
    }
  }

  /**
   * Updates state value with latest value from input field.
   *
   * @param {Event} ev
   */
  onChange(ev) {
    this.setState({ value: ev.target.value });
  }

  /**
   * Translates key presses to edit lifecycle methods.
   *
   * Enter triggers {@link commit} and Escape triggers {@link cancel}.
   *
   * @param {KeyboardEvent} ev
   */
  onKeyUp(ev) {
    switch (ev.key) {
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

  /**
   * Starts edit mode.
   */
  start() {
    this.setState({ edit: true });
  }

  /**
   * Calls onSave prop with current value and optional context.
   *
   * It also stops the edit mode.
   */
  commit() {
    this.props.onSave(this.state.value, this.props.context);

    this.setState({ edit: false });
  }

  /**
   * Stops edit mode and revert state value to prop value.
   */
  cancel() {
    this.setState({
      value: this.props.value,
      edit: false
    });
  }

  /**
   * @return {ReactElement}
   */
  render() {
    const { value, onSave, ...props } = this.props;
    const width = this.state.edit && this._container ?
      ('' + this._container.offsetWidth + 'px') :
      '';

    return (
      <td
        {...props}
        className={classNames({
          editable: true,
          editor: this.state.edit
        })}
        onClick={this.start.bind(this)}
        style={{ width }}
        ref={c => this._container = c}
      >
        {
          this.state.edit ?
            <input
              type='text'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onKeyUp={this.onKeyUp.bind(this)}
              onBlur={this.cancel.bind(this)}
              ref={c => this._editField = c}
            /> :
            <span>{this.state.value}</span>
        }
      </td>
    );
  }
}
