import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import { Control } from 'components/controls';
import StatusIcon from 'components/statusIcon';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTable extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      errors: props.errors,
      searchText: ''
    };
  }

  onSearch(e) {
    this.setState({
      searchText: e.target.value,
      errors: this.props.errors.filter(err => (
        !e.target.value ||
        err.error.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0
      ))
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  startClone() {
    throw new Error('Not yet implemented');
  }

  render() {
    return (
      <div className='relative'>
        <div className='clearfix'>
          <h4 className='pull-left'>{this.props.heading}</h4>
          <form
            className='form-inline text-right form-search'
            onSubmit={this.onSubmit.bind(this)}
          >
            <div className='form-group'>
              <input
                type='search'
                className='form-control input-sm'
                placeholder='Search…'
                value={this.state.searchText}
                onChange={this.onSearch.bind(this)}
              />
              <button type='submit' className='btn btn-default btn-sm'>
                <i className='fa fa-search' />
              </button>
            </div>
          </form>
        </div>
        {!this.state.errors.length && 'No data found.'}
        {!!this.state.errors.length && (
          <Table
            className='table table-striped table-condensed'
            data={this.state.errors}
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
        )}
      </div>
    );
  }
}
