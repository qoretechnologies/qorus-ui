import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';


import _ from 'lodash';
import { pureRender } from 'components/utils';
import { ORDER_STATES } from 'constants/orders';


const COMPLEX_VALUE_INDENT = 4;


@pureRender
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };

  getData() {
    const omit = [
      'options', 'lib', 'stepmap', 'segment', 'steps', 'stepseg', 'stepinfo',
      'wffuncs', 'groups', 'alerts', 'exec_count', 'autostart', 'has_alerts',
      'TOTAL', 'timestamp', 'id', 'normalizedName'
    ].concat(ORDER_STATES.map(os => os.name));

    return Object.keys(this.props.workflow).
      filter(k => omit.indexOf(k) < 0).
      map(k => ({
        name: k,
        value: this.props.workflow[k]
      }));
  }

  renderValue(val) {
    switch (typeof val) {
      case 'object':
        return val ?
          <pre>{JSON.stringify(val, null, COMPLEX_VALUE_INDENT)}</pre> :
          '';
      default:
        return '' + val;
    }
  }

  render() {
    return (
      <div>
        <Table
          data={this.getData()}
          className='table table-vertical table-condensed table-striped'
        >
          <Col
            comp='th'
            field='name'
            props={rec => ({ name: _.capitalize(rec.name) })}
          />
          <Col
            field='value'
            props={rec => ({ value: this.renderValue(rec.value) })}
          />
        </Table>
      </div>
    );
  }
}
