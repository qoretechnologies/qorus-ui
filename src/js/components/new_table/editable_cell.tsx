// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control } from '../controls';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Text from '../text';
import { ControlGroup } from '@blueprintjs/core';

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
@onlyUpdateForKeys(['value', 'className'])
export default class EditableCell extends Component {
  props: {
    value: string | number,
    startEdit: boolean,
    onSave: Function,
    onCancel: Function,
    type: string,
    min: number,
    max: number,
    showControl: boolean,
    className: string,
    noMarkdown?: Boolean,
  } = this.props;

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
  constructor (props) {
    super(props);

    // @ts-expect-error ts-migrate(2339) FIXME: Property '_cell' does not exist on type 'EditableC... Remove this comment to see the full error message
    this._cell = null;
    // @ts-expect-error ts-migrate(2551) FIXME: Property '_editField' does not exist on type 'Edit... Remove this comment to see the full error message
    this._editField = null;
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_cancelablePromise' does not exist on ty... Remove this comment to see the full error message
    this._cancelablePromise = null;
  }

  /**
   * Sets default state values.
   */
  componentWillMount () {
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
  componentWillReceiveProps (nextProps) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'edit' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    if (!this.state.edit) {
      this.setState({ value: nextProps.value });
    }
  }

  /**
   * Focuses the input field when editing has been started.
   */
  componentDidUpdate (prevProps, prevState) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'edit' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    if (this.state.edit && document.activeElement !== this._editField) {
      // @ts-expect-error ts-migrate(2551) FIXME: Property '_editField' does not exist on type 'Edit... Remove this comment to see the full error message
      this._editField.focus();
      document.addEventListener('click', this.handleOutsideClick);

      if (this.props.type !== 'number') {
        // @ts-expect-error ts-migrate(2551) FIXME: Property '_editField' does not exist on type 'Edit... Remove this comment to see the full error message
        this._editField.setSelectionRange(
          // @ts-expect-error ts-migrate(2551) FIXME: Property '_editField' does not exist on type 'Edit... Remove this comment to see the full error message
          this._editField.value.length,
          // @ts-expect-error ts-migrate(2551) FIXME: Property '_editField' does not exist on type 'Edit... Remove this comment to see the full error message
          this._editField.value.length
        );
      }
    }

    // call this.props.onCancel if canceled avoid error to setState on unmounted component
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'edit' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    if (!this.state.edit && prevState.edit) {
      document.removeEventListener('click', this.handleOutsideClick);
      this.props.onCancel();
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  /**
   * Close editable if click outside cell
   * @param e
   */
  handleOutsideClick = e => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_cell' does not exist on type 'EditableC... Remove this comment to see the full error message
    if (this._cell && !this._cell.contains(e.target)) {
      this.cancel();
    }
  };

  /**
   * Updates state value with latest value from input field.
   *
   * @param {Event} ev
   */
  onChange = ev => {
    this.setState({ value: ev.target.value });
  };

  /**
   * Translates key presses to edit lifecycle methods.
   *
   * Enter triggers {@link commit} and Escape triggers {@link cancel}.
   *
   * @param {KeyboardEvent} ev
   */
  onKeyUp = ev => {
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
  cellDidRender = c => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property '_cell' does not exist on type 'EditableC... Remove this comment to see the full error message
    this._cell = c;

    // @ts-expect-error ts-migrate(2339) FIXME: Property '_cell' does not exist on type 'EditableC... Remove this comment to see the full error message
    if (this._cell && this.state.edit) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property '_cell' does not exist on type 'EditableC... Remove this comment to see the full error message
      this.setState({ width: `${this._cell.offsetWidth}px` });
    }
  };

  /**
   * Waits with edit mode to the moment when cell width is known.
   *
   * @return {boolean}
   */
  canEdit () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'edit' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    return this.state.edit && this.state.width;
  }

  /**
   * Starts edit mode.
   */
  start = event => {
    event.stopPropagation();

    this.setState({
      edit: true,
      // @ts-expect-error ts-migrate(2339) FIXME: Property '_cell' does not exist on type 'EditableC... Remove this comment to see the full error message
      width: `${this._cell.offsetWidth}px`,
    });
  };

  /**
   * Calls onSave prop with current value.
   *
   * It also stops the edit mode.
   */
  commit = ev => {
    if (ev) ev.preventDefault();

    if (
      (this.props.type === 'number' &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
        this.props.min && this.state.value < this.props.min) ||
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
      (this.props.max && this.state.value > this.props.max)
    ) {
      this.setState({
        error: true,
      });
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
      this.props.onSave(this.state.value);

      this.setState({
        edit: false,
        width: '',
        error: false,
      });
    }
  };

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
  refEditField = el => {
    // @ts-expect-error ts-migrate(2551) FIXME: Property '_editField' does not exist on type 'Edit... Remove this comment to see the full error message
    this._editField = el;
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render () {
    const props = omit(this.props, [
      'value',
      'onSave',
      'startEdit',
      'onCancel',
      'showControl',
    ]);

    return (
      <td
        {...props}
        className={classNames(this.props.className, {
          editable: true,
          editor: this.canEdit(),
        })}
        onClick={this.start}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'width' does not exist on type 'Readonly<... Remove this comment to see the full error message
        style={{ width: this.state.width }}
        ref={this.cellDidRender}
      >
        {this.canEdit() ? (
          <form onSubmit={this.commit} className="editable-form">
            <ControlGroup className="bp3-fill">
              <input
                key="input"
                name="newValue"
                type={this.props.type}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
                value={this.state.value || ''}
                onChange={this.onChange}
                onKeyUp={this.onKeyUp}
                ref={this.refEditField}
                min={this.props.min}
                max={this.props.max}
                className={`bp3-input bp3-small ${
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Readonly<... Remove this comment to see the full error message
                  this.state.error ? 'form-error' : ''
                }`}
              />
              <Control
                className="bp3-fixed"
                btnStyle="success"
                type="submit"
                icon="small-tick"
              />
            </ControlGroup>
          </form>
        ) : (
          <React.Fragment>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
            <Text text={this.state.value} noMarkdown={this.props.noMarkdown} />
            <Control
              title="Edit"
              icon="edit"
              className="editable-button"
              onClick={this.start}
            />
          </React.Fragment>
        )}
      </td>
    );
  }
}
