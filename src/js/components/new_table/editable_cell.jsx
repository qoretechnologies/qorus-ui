import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { pureRender } from '../utils';
import { Control } from '../controls';

/**
 * Table data cell component which allows editing value.
 *
 * On cell click, it starts editing by turning the cell content into
 * text field. On enter, it commits the value by calling onSave prop
 * with value state as parameters. By definition, value can be only a
 * string.
 *
 * Nothing is updated (except for internal state) so parent component
 * must trigger app state change.
 */
@pureRender
export default class EditableCell extends Component {
  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    startEdit: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    type: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    showControl: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    startEdit: false,
    type: 'text',
    onSave: () => undefined,
    onCancel: () => undefined,
    showControl: false,
  };

  /**
   * Initializes internal state.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this._cell = null;
    this._editField = null;
    this._cancelablePromise = null;
  }

  /**
   * Sets default state values.
   */
  componentWillMount() {
    this.setState({
      value: this.props.value,
      edit: this.props.startEdit,
      width: '',
      error: false,
    });
  }

  /**
   * Updates state value with new value prop.
   *
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (!this.state.edit) {
      this.setState({ value: nextProps.value });
    }
  }

  /**
   * Focuses the input field when editing has been started.
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.edit && document.activeElement !== this._editField) {
      this._editField.focus();
      document.addEventListener('click', this.handleOutsideClick);

      if (this.props.type !== 'number') {
        this._editField.setSelectionRange(this._editField.value.length,
          this._editField.value.length);
      }
    }

    // call this.props.onCancel if canceled avoid error to setState on unmounted component
    if (!this.state.edit && prevState.edit) {
      document.removeEventListener('click', this.handleOutsideClick);
      this.props.onCancel();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  /**
   * Close editable if click outside cell
   * @param e
   */
  handleOutsideClick = (e) => {
    if (this._cell && !this._cell.contains(e.target)) {
      this.cancel();
    }
  };

  /**
   * Updates state value with latest value from input field.
   *
   * @param {Event} ev
   */
  onChange = (ev) => {
    this.setState({ value: ev.target.value });
  }

  /**
   * Translates key presses to edit lifecycle methods.
   *
   * Enter triggers {@link commit} and Escape triggers {@link cancel}.
   *
   * @param {KeyboardEvent} ev
   */
  onKeyUp = (ev) => {
    switch (ev.key) {
      case 'Escape':
        this.cancel();
        break;
      default:
        // Nothing.
        break;
    }
  };

  /**
   * Sets a reference to cell and computes cell width if in edit mode.
   *
   * @param {HTMLTableCellElement} c
   */
  cellDidRender = (c) => {
    this._cell = c;

    if (this._cell && this.state.edit) {
      this.setState({ width: `${this._cell.offsetWidth}px` });
    }
  };

  /**
   * Waits with edit mode to the moment when cell width is known.
   *
   * @return {boolean}
   */
  canEdit() {
    return this.state.edit && this.state.width;
  }

  /**
   * Starts edit mode.
   */
  start = (event) => {
    event.stopPropagation();

    this.setState({
      edit: true,
      width: `${this._cell.offsetWidth}px`,
    });
  };

  /**
   * Calls onSave prop with current value.
   *
   * It also stops the edit mode.
   */
  commit = (ev) => {
    if (ev) ev.preventDefault();

    if (this.props.type === 'number' &&
        (this.props.min && this.state.value < this.props.min) ||
        (this.props.max && this.state.value > this.props.max)) {
      this.setState({
        error: true,
      });
    } else {
      this.props.onSave(this.state.value);

      this.setState({
        edit: false,
        width: '',
        error: false,
      });
    }
  }

  /**
   * Stops edit mode and revert state value to prop value.
   */
  cancel = () => {
    this.setState({
      value: this.props.value,
      edit: false,
      width: '',
      error: false,
    });
  };

  /**
   * Stores edit field reference.
   *
   * @param {HTMLInputElement} el
   */
  refEditField = (el) => {
    this._editField = el;
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const props = omit(this.props, ['value', 'onSave', 'startEdit', 'onCancel', 'showControl']);

    return (
      <td
        {...props}
        className={classNames({
          editable: true,
          editor: this.canEdit(),
        })}
        onClick={this.start}
        style={{ width: this.state.width }}
        ref={this.cellDidRender}
      >
        {this.canEdit() ? (
          <form
            onSubmit={this.commit}
            className="editable-form"
          >
            <input
              key="input"
              name="newValue"
              type={this.props.type}
              value={this.state.value || ''}
              onChange={this.onChange}
              onKeyUp={this.onKeyUp}
              ref={this.refEditField}
              min={this.props.min}
              max={this.props.max}
              className={this.state.error ? 'form-error' : ''}
            />
            <Control
              className={classNames({ hide: !this.props.showControl })}
              key="button"
              type="submit"
              icon="plus"
              btnStyle="primary"
            />
          </form>
        ) : (
          <span>{this.state.value}</span>
        )}
      </td>
    );
  }
}
