import React, { Component, PropTypes } from 'react';


import Table, { Section, Row, Cell } from 'components/table';
import Badge from 'components/badge';
import AutoStart from 'components/autostart';
import WorkflowsControls from './controls';


import { pureRender } from 'components/utils';
import goTo from 'routes';


import classNames from 'classnames';
import actions from 'store/api/actions';
import { ORDER_STATES } from 'constants/orders';


/**
 * List of all workflows in the system.
 *
 * Beware, this component is very performance internsive - even
 * HTML/CSS without any JS is relatively slow.
 */
@pureRender
export default class WorkflowsTable extends Component {
  static propTypes = {
    workflows: PropTypes.array,
    activeWorkflowId: PropTypes.number,
  };


  static contextTypes = {
    router: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };


  /**
   * Bounds generators and event handlers to `this` instance.
   *
   * This improves render performance as generators and event handlers
   * are used as cache key by pure render.
   */
  componentWillMount() {
    this._activateWorkflow = ::this.activateWorkflow;

    this._renderSections = ::this.renderSections;
    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
  }


  /**
   * Dispatches `setAutostart` action for workflows.
   *
   * @param {number} id
   * @param {number} value
   */
  setAutostart(id, value) {
    this.context.dispatch(
      actions.workflows.setAutostart(id, value)
    );
  }


  /**
   * Finds workflow associated with given row element.
   *
   * @param {HTMLTableRowElement} row
   * @return {Object}
   */
  findActivatedWorkflow(row) {
    let idx = null;
    for (let i = 0; i < row.parentElement.rows.length; i += 1) {
      if (row === row.parentElement.rows[i]) {
        idx = i;
        break;
      }
    }

    return this.props.workflows[idx] || null;
  }


  /**
   * Changes active route to workflow associated with clicked element.
   *
   * If the event handled some significant action before (i.e., its
   * default action is prevented), it does nothing.
   *
   * @param {Event} ev
   */
  activateWorkflow(ev) {
    if (ev.isDefaultPrevented()) return;

    const workflow = this.findActivatedWorkflow(ev.currentTarget);
    const shouldDeactivate =
      this.context.params.detailId &&
      parseInt(this.context.params.detailId, 10) === workflow.workflowid;
    const change = {
      detailId: shouldDeactivate ? null : workflow.workflowid,
      tabId: shouldDeactivate ? null : this.context.params.tabId,
    };

    goTo(
      this.context.router,
      'workflows',
      this.context.route.path,
      this.context.params,
      change
    );
  }


  /**
   * Yields heading cells for workflow info including order states.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="narrow" />
    );

    yield (
      <Cell tag="th" className="narrow">Actions</Cell>
    );

    yield (
      <Cell tag="th" className="col-autostart">Autostart</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">Execs</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">ID</Cell>
    );

    yield (
      <Cell tag="th" className="name">Name</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">Version</Cell>
    );

    for (const state of ORDER_STATES) {
      yield (
        <Cell tag="th" className="narrow">{state.short}</Cell>
      );
    }

    yield (
      <Cell tag="th" className="narrow">Total</Cell>
    );
  }


  /**
   * Yields cells with workflow data including order states.
   *
   * @param {Object} workflow
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderCells(workflow) {
    yield (
      <Cell className="narrow">
        <i className="fa fa-square-o" />
      </Cell>
    );

    yield (
      <Cell className="narrow">
        <WorkflowsControls workflow={workflow} />
      </Cell>
    );

    yield (
      <Cell className="col-autostart">
        <AutoStart
          context={workflow}
          autostart={workflow.autostart}
          execCount={workflow.exec_count}
          inc={::this.setAutostart}
          dec={::this.setAutostart}
        />
      </Cell>
    );

    yield (
      <Cell className="narrow">{workflow.exec_count}</Cell>
    );

    yield (
      <Cell className="narrow">{workflow.workflowid}</Cell>
    );

    yield (
      <Cell className="name">{workflow.name}</Cell>
    );

    yield (
      <Cell className="narrow">{workflow.version}</Cell>
    );

    for (const state of ORDER_STATES) {
      yield (
        <Cell className="narrow">
          <Badge label={state.label} val={workflow[state.name]} />
        </Cell>
      );
    }

    yield (
      <Cell className="narrow">{workflow.TOTAL}</Cell>
    );
  }


  /**
   * Yields row for table head.
   *
   * @return {Generator<ReactElement>}
   * @see renderHeadings
   */
  *renderHeadingRow() {
    yield (
      <Row cells={::this.renderHeadings} />
    );
  }


  /**
   * Yields rows for table body.
   *
   * Row with active workflow is highlighted. Row are clickable and
   * trigger route change via {@link activateWorkflow}.
   *
   * @param {number} activeId
   * @param {Array<Object>} workflows
   * @return {Generator<ReactElement>}
   * @see activateWorkflow
   * @see renderCells
   */
  *renderRows({ activeId, workflows }) {
    for (const workflow of workflows) {
      yield (
        <Row
          key={workflow.workflowid}
          data={workflow}
          cells={this._renderCells}
          onClick={this._activateWorkflow}
          className={classNames({
            info: workflow.workflowid === activeId,
          })}
        />
      );
    }
  }


  /**
   * Yields table sections.
   *
   * @return {Generator<ReactElement>}
   * @see renderHeadingRow
   * @see renderRows
   */
  *renderSections(data) {
    yield (
      <Section type="head" rows={this._renderHeadingRow} />
    );

    yield (
      <Section type="body" data={data} rows={this._renderRows} />
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Table
        data={{
          activeId: this.props.activeWorkflowId,
          workflows: this.props.workflows,
        }}
        sections={this._renderSections}
        className={'table table-striped table-condensed table-hover ' +
                   'table-fixed table--data'}
      />
    );
  }
}
