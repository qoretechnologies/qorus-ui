import React, { Component, PropTypes } from 'react';
import Table, { Col } from '../table';
import EditableCell from '../table/editableCell';
import ActionsCol from './actionsCol';
import SystemOptions from './systemOptions';


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
      <div className='options'>
        <h4>Options</h4>
        <div>
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
          <SystemOptions
            options={this.props.options}
            onAdd={this.addOption.bind(this)}
          />
        </div>
      </div>
    );
  }
}
