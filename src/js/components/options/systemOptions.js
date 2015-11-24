import React, { Component, PropTypes } from 'react';


export default class SystemOptions extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { edit: false, selected: null };
  }

  onChange(e) {
    this.setState({
      selected: this.props.options.find(opt => (
        opt.name === e.currentTarget.value
      ))
    });
  }

  start() {
    this.setState({ edit: true, selected: this.props.options[0] });
  }

  cancel() {
    this.setState({ edit: false, selected: null });
  }

  commit(e) {
    e.preventDefault();

    this.props.onAdd(this.state.selected);
    this.setState({ edit: false, selected: null });
  }

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

  renderButton() {
    return (
      <a
        className='btn btn-success btn-sm'
        onClick={this.start.bind(this)}
      >
        <i className='fa fa-plus' /> Add option
      </a>
    );
  }

  render() {
    return this.state.edit ? this.renderOptions() : this.renderButton();
  }
}
