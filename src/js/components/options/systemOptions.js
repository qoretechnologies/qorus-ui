import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Drop-down component with a button to add options.
 */
@pureRender
export default class SystemOptions extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired
  }

  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = { edit: false, selected: null };
  }

  /**
   * Changes selected option.
   *
   * @param {Event} ev
   */
  onChange(ev) {
    this.setState({
      selected: this.props.options.find(opt => (
        opt.name === ev.currentTarget.value
      ))
    });
  }

  /**
   * Start editing by showing options to add.
   */
  start() {
    this.setState({ edit: true, selected: this.props.options[0] });
  }

  /**
   * Cancels editing by hiding options to add.
   */
  cancel() {
    this.setState({ edit: false, selected: null });
  }

  /**
   * Adds new option by calling `onAdd` prop.
   *
   * @param {Event} ev
   */
  commit(ev) {
    ev.preventDefault();

    this.props.onAdd(this.state.selected);
    this.setState({ edit: false, selected: null });
  }

  /**
   * @return {ReactElement}
   */
  renderOptions() {
    return (
      <form className='form-inline' onSubmit={this.commit.bind(this)}>
        <select
          className='form-control'
          value={this.state.selected && this.state.selected.name}
          ref={c => this.domSelect = c}
          onChange={this.onChange.bind(this)}
        >
          {this.props.options.map(opt => (
            <option
              key={opt.name}
              value={opt.name}
            >
              {opt.name}
            </option>
          ))}
        </select>
        <button
          type='submit'
          className='btn btn-success btn-sm'
        >
          <i className='fa fa-plus' /> Add
        </button>
        <button
          type='button'
          className='btn btn-danger btn-sm'
          onClick={this.cancel.bind(this)}
        >
          <i className='fa fa-times' /> Cancel
        </button>
      </form>
    );
  }

  /**
   * @return {ReactElement}
   */
  renderButton() {
    return (
      <button
        className='btn btn-success btn-sm'
        onClick={this.start.bind(this)}
        disabled={!this.props.options.length}
      >
        <i className='fa fa-plus' /> Add option
      </button>
    );
  }

  /**
   * @return {ReactElement}
   */
  render() {
    return this.state.edit ? this.renderOptions() : this.renderButton();
  }
}
