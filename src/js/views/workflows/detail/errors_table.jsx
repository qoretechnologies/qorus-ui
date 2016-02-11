import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import { Controls, Control } from 'components/controls';
import CollectionSearch from 'components/collection_search';
import StatusIcon from 'components/status_icon';


import ErrorModal from './error_modal';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTable extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    onClone: PropTypes.func,
    onUpdate: PropTypes.func,
    onRemove: PropTypes.func,
  };


  static contextTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };


  /**
   * @param {object} props
   * @param {object} context
   */
  constructor(props, context) {
    super(props, context);

    this._modal = null;
    this._commitFn = null;

    this.state = this.getErrorsState(this.props, new RegExp());
  }


  /**
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState(
      this.getErrorsState(nextProps, this.state.filter)
    );
  }


  /**
   * @param {RegExp} filter
   */
  onFilterChange(filter) {
    this.setState(
      this.getErrorsState(this.props, filter)
    );
  }


  /**
   * @param {object} props
   * @param {RegExp} filter
   */
  getErrorsState(props, filter) {
    return {
      filter,
      errors: props.errors.filter(err => (new RegExp(filter)).test(err.error)),
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
        onCommit={::this.submitModal}
        onCancel={::this.closeModal}
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
        } },
      ],
    };
  }


  /**
   * @return {ReactElement}
   */
  render() {
    return (
      <div className="relative">
        <div className="clearfix">
          <h4 className="pull-left">{this.props.heading}</h4>
          <CollectionSearch onChange={::this.onFilterChange} ignoreCase />
        </div>
        {!this.state.errors.length && (
          <p>No data found.</p>
        )}
        {!!this.state.errors.length && (
          <Table
            className="table table-striped table-condensed table--small"
            data={this.state.errors}
          >
            <Col
              heading="Name"
              className="name"
              field="name"
              props={::this.nameColProps}
            />
            <Col
              heading="Severity"
              field="severity"
              props={::this.severityColProps}
            />
            <Col
              heading="Retry"
              childProps={::this.retryColProps}
            >
              <StatusIcon />
            </Col>
            <Col
              heading="Delay"
              field="delay"
              props={::this.delayColProps}
            />
            <Col
              heading="Business"
              field="value"
              childProps={::this.businessColProps}
            >
              <StatusIcon />
            </Col>
            {(
              this.props.onClone ||
              this.props.onUpdate ||
              this.props.onRemove
            ) && (
              <Col childProps={::this.controlsColProps}>
                <Controls>
                  {this.props.onClone && (
                    <Control
                      title="Override"
                      icon="copy"
                      btnStyle="warning"
                    />
                  )}
                  {this.props.onUpdate && (
                    <Control
                      title="Edit"
                      icon="pencil-square-o"
                      btnStyle="warning"
                    />
                  )}
                  {this.props.onRemove && (
                    <Control
                      title="Remove"
                      icon="times"
                      btnStyle="danger"
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
