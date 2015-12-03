import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import { Control } from 'components/controls';
import StatusIcon from 'components/statusIcon';


import ErrorModal from './errorModal';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTable extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    onClone: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  }

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func
  }

  constructor(props) {
    super(props);

    this._cloneModal = null;

    this.state = this.getErrorsState(this.props, '');
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      this.getErrorsState(nextProps, this.state.searchText)
    );
  }

  onSearch(e) {
    this.setState(
      this.getErrorsState(this.props, e.target.value)
    );
  }

  onSubmit(e) {
    e.preventDefault();
  }

  getErrorsState(props, searchText) {
    return {
      searchText,
      errors: props.errors.filter(err => (
        !searchText ||
        err.error.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
      ))
    };
  }

  startClone(err) {
    this._cloneModal = (
      <ErrorModal
        actionLabel='Clone'
        error={Object.assign({}, err)}
        onCommit={this.commitClone.bind(this)}
        onCancel={this.cancelClone.bind(this)}
      />
    );

    this.context.openModal(this._cloneModal);
  }

  commitClone(err) {
    this.props.onClone(err);
    this.context.closeModal(this._cloneModal);
    this._cloneModal = null;
  }

  cancelClone() {
    this.context.closeModal(this._cloneModal);
    this._cloneModal = null;
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
        {!this.state.errors.length && (
          <p>No data found.</p>
        )}
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
            {this.props.onClone && (
              <Col
                childProps={rec => ({
                  action: () => { this.startClone(rec); }
                })}
              >
                <Control title='Override' icon='copy' labelStyle='warning' />
              </Col>
            )}
            {this.props.onRemove && (
              <Col
                childProps={rec => ({
                  action: () => { this.props.onRemove(rec); }
                })}
              >
                <Control title='Remove' icon='times' labelStyle='danger' />
              </Col>
            )}
          </Table>
        )}
      </div>
    );
  }
}
