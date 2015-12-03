import React, { Component, PropTypes } from 'react';
import Table, { Col } from '../table';
import EditableCell from '../table/editableCell';
import ActionsCol from './actionsCol';
import SystemOptions from './systemOptions';


export default class Options extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  }

  getUnusedSystemOptions() {
    return this.props.systemOptions.filter(sysOpt => (
      this.props.workflow.options.findIndex(wflOpt => (
        wflOpt.name === sysOpt.name
      )) < 0
    ));
  }

  addOption(opt) {
    let value;

    // This ensures that empty default system value does not prevent
    // the option from adding.
    if (opt.value === null && opt.expects === 'integer') {
      value = '0';
    } else if (opt.value === null) {
      value = ' ';
    } else {
      value = opt.value;
    }

    this.props.onAdd(Object.assign({}, opt, { value }));
  }

  changeOption(value, opt) {
    this.props.onChange(Object.assign({}, opt, { value }));
  }

  deleteOption(opt) {
    this.props.onDelete(opt);
  }

  render() {
    return (
      <div className='options'>
        <h4>Options</h4>
        <div>
          {!this.props.workflow.options.length && (
            <p>No options found.</p>
          )}
          {!!this.props.workflow.options.length && (
            <Table
              data={this.props.workflow.options}
              className='table table-condensed table-striped table-align-left'
            >
              <Col
                heading='Options'
                field='name'
                props={rec => ({ name: rec.name, className: 'name' })}
              />
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
                  className='middle'
                  onDelete={this.deleteOption.bind(this)}
                />
              </Col>
            </Table>
          )}
          <SystemOptions
            options={this.getUnusedSystemOptions()}
            onAdd={this.addOption.bind(this)}
          />
        </div>
      </div>
    );
  }
}
