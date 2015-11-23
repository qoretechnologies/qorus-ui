import React, { Component, PropTypes } from 'react';
import Table, { Col } from '../table';
import EditableCell from '../table/editableCell';


import { pureRender } from '../utils';


@pureRender
class DescView extends Component {
  static propTypes = {
    name: PropTypes.string,
    desc: PropTypes.string
  }

  static defaultProps = {
    name: '',
    desc: ''
  }

  render() {
    return (
      <div>
        {this.props.name}<br />
        <p className='muted'>{this.props.desc}</p>
      </div>
    );
  }
}


class SystemOptions extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { edit: false, value: null };
  }

  onChange(e) {
    this.setState({ value: e.currentTarget.value });
  }

  start() {
    this.setState({ edit: true, value: null });
  }

  cancel() {
    this.setState({ edit: false });
  }

  commit() {
    this.props.onAdd(this.state.value);
    this.setState({ edit: false });
  }

  renderOptions() {
    return (
      <div>
        <select
          value={this.state.value}
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
        <a
          className='btn btn-success btn-small'
          onClick={this.commit.bind(this)}
        >
          <i className='fa fa-plus' /> Add
        </a>
        <a
          className='btn btn-danger btn-small'
          onClick={this.cancel.bind(this)}
        >
          <i className='fa fa-times' /> Cancel
        </a>
      </div>
    );
  }

  renderButton() {
    return (
      <a
        className='btn btn-success btn-small'
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

class ActionsCol extends Component {
  static propTypes = {
    context: PropTypes.any,
    onDelete: PropTypes.func
  }

  render() {
    return this.props.onDelete && (
      <a
        className='label label-danger'
        onClick={() => this.props.onDelete(this.props.context)}
      >
        <i className='fa fa-times' />
      </a>
    );
  }
}

export default class Options extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  }

  addOption(opt) {
    this.props.onAdd(opt);
  }

  changeOption(value, opt) {
    this.props.onChange(Object.assign(opt, { value }));
  }

  deleteOption(opt) {
    this.props.onDelete(opt);
  }

  render() {
    return (
      <div>
        <h4>Options</h4>
        <div className='options'>
          <Table
            data={this.props.workflow.options}
            className='table table-condensed table-sriped table-align-left'
          >
            <Col
              heading='Options'
              props={rec => ({ name: rec.name })}
            >
              <DescView className='name' />
            </Col>
            <Col
              heading='Value'
              comp={EditableCell}
              props={rec => ({
                context: rec,
                value: rec.value,
                onSave: this.changeOption.bind(this)
              })}
            />
            <Col
              className='narrow'
              childProps={rec => ({ context: rec, value: rec.value })}
            >
              <ActionsCol
                onDelete={this.deleteOption.bind(this)}
                className='middle'
              />
            </Col>
          </Table>
          <SystemOptions
            options={this.props.options}
            onAdd={this.addOption.bind(this)}
          />
        </div>
      </div>
    );
  }
}
