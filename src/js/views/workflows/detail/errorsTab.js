import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import { Control } from 'components/controls';
import StatusIcon from 'components/statusIcon';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    globalErrors: PropTypes.array.isRequired
  }

  startClone() {
    throw new Error('Not yet implemented');
  }

  render() {
    return (
      <div className='relative'>
        <h4>Global definitions</h4>
        <Table
          className='table table-striped table-condensed'
          data={this.props.globalErrors}
        >
          <Col
            heading='Name'
            className='name'
            field='name'
            props={rec => ({ name: rec.error, className: 'name' })}
          />
          <Col
            heading='Severity'
            props={rec => ({ severity: rec.severity })}
          />
          <Col
            heading='Retry'
            childProps={rec => ({ value: rec.retry_flag })}
          >
            <StatusIcon />
          </Col>
          <Col
            heading='Delay'
            props={rec => ({ delay: rec.retry_delay_secs })}
          />
          <Col
            heading='Business'
            childProps={rec => ({ value: rec.business_flag })}
          >
            <StatusIcon />
          </Col>
          <Col
            childProps={rec => ({ value: rec.business_flag })}
          >
            <Control
              title='Override' icon='copy' labelStyle='warning'
              action={this.startClone.bind(this)}
            />
          </Col>
        </Table>
      </div>
    );
  }
}
