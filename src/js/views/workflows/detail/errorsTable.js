import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import { Controls, Control } from 'components/controls';
import StatusIcon from 'components/statusIcon';


import ErrorModal from './errorModal';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTable extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    onClone: PropTypes.func,
    onUpdate: PropTypes.func,
    onRemove: PropTypes.func
  }

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func
  }

  /**
   * @param {object} props
   * @param {object} context
   */
  constructor(props, context) {
    super(props, context);

    this._modal = null;
    this._commitFn = null;

    this.state = this.getErrorsState(this.props, '');
  }

  /**
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState(
      this.getErrorsState(nextProps, this.state.searchText)
    );
  }

  /**
   * @param {Event} ev
   */
  onSearch(ev) {
    this.setState(
      this.getErrorsState(this.props, ev.target.value)
    );
  }

  /**
   * @param {Event} ev
   */
  onSubmit(ev) {
    ev.preventDefault();
  }

  /**
   * @param {object} props
   * @param {string} searchText
   */
  getErrorsState(props, searchText) {
    return {
      searchText,
      errors: props.errors.filter(err => (
        !searchText ||
        err.error.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
      ))
    };
  }

  /**
   * @param {object} err
   * @param {function(object)} commitFn
   * @param {string} label
   */
  openModal(err, commmitFn, label) {
    this._commitFn = commmitFn;
    this._modal = (
      <ErrorModal
        actionLabel={label}
        error={Object.assign({}, err)}
        onCommit={this.submitModal.bind(this)}
        onCancel={this.closeModal.bind(this)}
      />
    );

    this.context.openModal(this._modal);
  }

  /**
   * @param {object} err
   */
  submitModal(err) {
    this._commitFn(err);
    this.closeModal();
  }

  closeModal() {
    this.context.closeModal(this._modal);
    this._modal = null;
    this._commitFn = null;
  }

  /**
   * @return {ReactElement}
   */
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
            {(
              this.props.onClone ||
              this.props.onUpdate ||
              this.props.onRemove
            ) && (
              <Col
                childProps={rec => ({
                  controls: [
                    { action: () => {
                      this.openModal(rec, this.props.onClone, 'Clone');
                    } },
                    { action: () => {
                      this.openModal(rec, this.props.onUpdate, 'Edit');
                    } },
                    { action: () => {
                      this.props.onRemove(rec);
                    } }
                  ]
                })}
              >
                <Controls>
                  {this.props.onClone && (
                    <Control
                      title='Override'
                      icon='copy'
                      btnStyle='warning'
                    />
                  )}
                  {this.props.onUpdate && (
                    <Control
                      title='Edit'
                      icon='pencil-square-o'
                      btnStyle='warning'
                    />
                  )}
                  {this.props.onRemove && (
                    <Control
                      title='Remove'
                      icon='times'
                      btnStyle='danger'
                    />
                  )}
                </Controls>
              </Col>
            )}
          </Table>
        )}
      </div>
    );
  }
}
