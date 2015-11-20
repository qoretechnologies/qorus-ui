import React, { Component, PropTypes } from 'react';
import Table, { Col } from '../table';
import EditableText from '../editable-text';


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


@pureRender
class SystemIcon extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    modified: PropTypes.string.isRequired
  }

  render() {
    let { modified, model } = this.props;

    if (model.sysvalue) modified = '*';

    if (!model.system) return <span />;

    return (
      <p>
        <i
          className='fa fa-cog'
          title={modified ? 'Overriden system option' : 'System option'}
        />
        {modified}
      </p>
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

  start() {
    this.setState({ edit: true, value: null });
  }

  cancel() {
    this.setState({ edit: false });
  }

  commit() {
    this.onAdd(this.state.value);
    this.setState({ edit: false });
  }

  onChange(e) {
    this.setState({ value: e.currentTarget.value });
  }

  renderOptions() {
    return (
      <div>
        <select
          ref={c => this.domSelect = c}
          onChange={this.onChange.bind(this)}
        >
          {this.props.options.map(opt => (
            <option value={opt.name} selected={opt.name === this.state.value}>
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
        onClick={e => this.props.onDelete(this.props.context)}
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
    console.log('wrk options', this.props.workflow.options);
    console.log('sys options', this.props.options);

    return (
      <div>
        <h4>Options</h4>
        <div className='options'>
          <Table
            collection={this.props.workflow.options}
            cssClass='table table-condensed table-sripped table-align-left'
          >
            <Col name='Options' transMap={{ name: 'name' }}>
              <DescView className='name' />
            </Col>
            <Col
              name='Value'
              passItemAs='context'
              transMap={{ value: 'value' }}
            >
              <EditableText onSave={this.changeOption.bind(this)} />
            </Col>
            <Col passItemAs='context' className='narrow'>
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
