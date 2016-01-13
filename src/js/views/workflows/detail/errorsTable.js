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
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func
  };

  /**
   * @param {object} props
   * @param {object} context
   */
  constructor(props, context) {
    super(props, context);

    this._modal = null;
    this._commitFn = null;

    this.state = this.getErrorsState(this.props, '');

    this.submitModal = this.submitModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.nameColProps = this.nameColProps.bind(this);
    this.severityColProps = this.severityColProps.bind(this);
    this.retryColProps = this.retryColProps.bind(this);
    this.delayColProps = this.delayColProps.bind(this);
    this.businessColProps = this.businessColProps.bind(this);
    this.controlsColProps = this.controlsColProps.bind(this);
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
   * @param {?boolean} requireChanges
   */
  openModal(err, commmitFn, label, requireChanges) {
    this._commitFn = commmitFn;
    this._modal = (
      <ErrorModal
        actionLabel={label}
        error={Object.assign({}, err)}
        onCommit={this.submitModal}
        onCancel={this.closeModal}
        requireChanges={requireChanges}
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

  nameColProps(rec) {
    return { name: rec.error, className: 'name' };
  }

  severityColProps(rec) {
    return { severity: rec.severity };
  }

  retryColProps(rec) {
    return { value: rec.retry_flag };
  }

  delayColProps(rec) {
    return { delay: rec.retry_delay_secs };
  }

  businessColProps(rec) {
    return { value: rec.business_flag };
  }

  controlsColProps(rec) {
    return {
      controls: [
        { action: () => {
          this.openModal(rec, this.props.onClone, 'Clone', true);
        } },
        { action: () => {
          this.openModal(rec, this.props.onUpdate, 'Edit');
        } },
        { action: () => {
          this.props.onRemove(rec);
        } }
      ]
    };
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
            onSubmit={this.onSubmit}
          >
            <div className='form-group'>
              <input
                type='search'
                className='form-control input-sm'
                placeholder='Search…'
                value={this.state.searchText}
                onChange={this.onSearch}
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
              props={this.nameColProps}
            />
            <Col
              heading='Severity'
              field='severity'
              props={this.severityColProps}
            />
            <Col
              heading='Retry'
              childProps={this.retryColProps}
            >
              <StatusIcon />
            </Col>
            <Col
              heading='Delay'
              field='delay'
              props={this.delayColProps}
            />
            <Col
              heading='Business'
              field='value'
              childProps={this.businessColProps}
            >
              <StatusIcon />
            </Col>
            {(
              this.props.onClone ||
              this.props.onUpdate ||
              this.props.onRemove
            ) && (
              <Col childProps={this.controlsColProps}>
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
