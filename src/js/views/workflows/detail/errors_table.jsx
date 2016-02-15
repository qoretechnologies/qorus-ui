import React, { Component, PropTypes } from 'react';
import Table, { Section, Row, Cell } from 'components/table';
import { Controls, Control } from 'components/controls';
import CollectionSearch from 'components/collection_search';
import StatusIcon from 'components/status_icon';


import ErrorModal from './error_modal';


import { pureRender } from 'components/utils';


/**
 * Table to display and manage Qorus erros known to the system or
 * assigned to individual entities.
 *
 * It uses modal dialogs to manage errors.
 */
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
   * Initializes internal state.
   *
   * @param {Object} props
   * @param {Object} context
   */
  constructor(props, context) {
    super(props, context);

    this._modal = null;
    this._commitFn = null;
  }


  /**
   * Sets state to show all errors.
   */
  componentWillMount() {
    this.setState(
      this.getErrorsState(this.props, new RegExp())
    );
  }


  /**
   * Sets state to show coming errors after being filtered.
   *
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState(
      this.getErrorsState(nextProps, this.state.filter)
    );
  }


  /**
   * Sets state to show errors with new filter.
   *
   * @param {RegExp} filter
   */
  onFilterChange(filter) {
    this.setState(
      this.getErrorsState(this.props, filter)
    );
  }


  /**
   * Returns state change object with filtered errors.
   *
   * @param {Object} props
   * @param {RegExp} filter
   */
  getErrorsState(props, filter) {
    return {
      filter,
      errors: props.errors.filter(err => (new RegExp(filter)).test(err.error)),
    };
  }


  /**
   * Opens modal dialog to manage particular error.
   *
   * @param {Object} err
   * @param {function(Object)} commitFn
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
   * Submit changes from currently open modal dialog and closes it.
   *
   * It also calls commit function assigned to it with given error.
   *
   * @param {Object} err
   * @see closeModal
   */
  submitModal(err) {
    this._commitFn(err);
    this.closeModal();
  }


  /**
   * Closes currently open modal dialog.
   */
  closeModal() {
    this.context.closeModal(this._modal);
    this._modal = null;
    this._commitFn = null;
  }


  /**
   * Yields cells with error data and controls to manage error.
   *
   * @param {Object} error
   * @return {Generator<ReactElement>}
   */
  *renderCells(error) {
    yield (
      <Cell className="name">{error.error}</Cell>
    );

    yield (
      <Cell>{error.severity}</Cell>
    );

    yield (
      <Cell>
        <StatusIcon value={error.retry_flag} />
      </Cell>
    );

    yield (
      <Cell>{error.retry_delay_secs && `${error.retry_delay_secs}`}</Cell>
    );

    yield (
      <Cell>
        <StatusIcon value={error.business_flag} />
      </Cell>
    );

    const onClone = this.props.onClone && this.openModal.bind(
      this, error, this.props.onClone, 'Clone', true
    );
    const onUpdate = this.props.onUpdate && this.openModal.bind(
      this, error, this.props.onUpdate, 'Edit'
    );
    const onRemove = this.props.onRemove && this.props.onRemove.bind(
      this, error
    );

    yield (
      <Cell>
        <Controls>
          {onClone && (
            <Control
              title="Override"
              icon="copy"
              btnStyle="warning"
              action={onClone}
            />
          )}
          {onUpdate && (
            <Control
              title="Edit"
              icon="pencil-square-o"
              btnStyle="warning"
              action={onUpdate}
            />
          )}
          {onRemove && (
            <Control
              title="Remove"
              icon="times"
              btnStyle="danger"
              action={onRemove}
            />
          )}
        </Controls>
      </Cell>
    );
  }


  /**
   * Yields rows for table body.
   *
   * @param {Array<Object>} errors
   * @return {Generator<ReactElement>}
   * @see renderCells
   */
  *renderRows(errors) {
    for (const error of errors) {
      yield (
        <Row data={error} cells={::this.renderCells} />
      );
    }
  }


  /**
   * Yields table sections.
   *
   * @param {Array<Object>} errors
   * @return {Generator<ReactElement>}
   * @see renderRows
   */
  *renderSections(errors) {
    yield (
      <thead>
        <tr>
          <th className="name">Name</th>
          <th>Severity</th>
          <th>Retry</th>
          <th>Delay</th>
          <th>Business</th>
          <th />
        </tr>
      </thead>
    );

    yield (
      <Section type="body" data={errors} rows={::this.renderRows} />
    );
  }


  /**
   * Returns element for this component.
   *
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
            data={this.state.errors}
            sections={::this.renderSections}
            className={'table table-striped table-condensed table--data ' +
                       'table--small'}
          />
        )}
      </div>
    );
  }
}
