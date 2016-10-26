import React, { Component, PropTypes } from 'react';
import { includes } from 'lodash';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Table, { Section, Row, Cell } from 'components/table';
import Badge from 'components/badge';
import AutoStart from 'components/autostart';
import Checkbox from 'components/checkbox';
import WorkflowsControls from './controls';
import { filterArray } from '../../helpers/workflows';
import { WORKFLOW_FILTERS } from '../../constants/filters';
import classNames from 'classnames';
import actions from 'store/api/actions';
import { ORDER_STATES } from '../../constants/orders';

/**
 * List of all workflows in the system.
 *
 * Beware, this component is very performance internsive - even
 * HTML/CSS without any JS is relatively slow.
 */
@connect(
  () => ({}),
  {
    setAutostart: actions.workflows.setAutostart,
    updateDone: actions.workflows.updateDone,
  }
)
export default class WorkflowsTable extends Component {
  static propTypes = {
    workflows: PropTypes.array,
    activeWorkflowId: PropTypes.number,
    initialFilter: PropTypes.func,
    onWorkflowFilterChange: PropTypes.func,
    setSelectedWorkflows: PropTypes.func,
    selectedWorkflows: PropTypes.object,
    onSortChange: PropTypes.func,
    sortData: PropTypes.object,
    linkDate: PropTypes.string,
    openPane: PropTypes.func,
    updateDone: PropTypes.func,
    setAutostart: PropTypes.func,
  };

  static contextTypes = {
    params: PropTypes.object.isRequired,
  };

  /**
   * Bounds generators and event handlers to `this` instance.
   *
   * This improves render performance as generators and event handlers
   * are used as cache key by pure render.
   */
  componentWillMount() {
    this._renderSections = ::this.renderSections;
    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
    this.renderHeadings = ::this.renderHeadings;
  }

  componentWillReceiveProps(next) {
    if (this.props.initialFilter !== next.initialFilter) {
      this.setupFilters(next);
    }
  }

  /**
   * Sets the initial selected workflows based on the
   * filter function received in props
   *
   * @param {Object} props
   */
  setupFilters(props) {
    const selectedWorkflows = props.initialFilter ?
      props.workflows.reduce((sel, w) => (
        Object.assign(sel, { [w.id]: props.initialFilter(w, this.props.selectedWorkflows) })
      ), {}) :
    {};

    this.setSelectedWorkflows(selectedWorkflows);
  }

  handleHighlightEnd = (id) => () => {
    this.props.updateDone(id);
  };

  /**
   * Sends the selected workflows one level up to
   * the workflows component and sets the state
   *
   * @param {Object} selectedWorkflows
   */
  setSelectedWorkflows(selectedWorkflows) {
    if (this.props.workflows.every(w => selectedWorkflows[w.id])) {
      this.props.onWorkflowFilterChange('all');
    } else if (this.props.workflows.some(w => selectedWorkflows[w.id])) {
      this.props.onWorkflowFilterChange('some');
    } else {
      this.props.onWorkflowFilterChange('none');
    }

    this.props.setSelectedWorkflows(selectedWorkflows);
  }

  /**
   * Dispatches `setAutostart` action for workflows.
   *
   * @param {number} id
   * @param {number} value
   */
  setAutostart = (id, value) => {
    this.props.setAutostart(id, value);
  };

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
   * Handles the individual workflow checkboxes
   *
   * @param {Event} ev
   */
  handleCheckboxClick = (ev) => {
    const workflow = this.findActivatedWorkflow(ev.currentTarget.parentElement.parentElement);
    const selectedWorkflows = Object.assign({},
      this.props.selectedWorkflows,
      { [workflow.id]: !this.props.selectedWorkflows[workflow.id] }
    );

    this.setSelectedWorkflows(selectedWorkflows);
  };

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
      <Cell
        tag="th"
        className="col-autostart"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="autostart"
      >
        Autostart
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="exec_count"
      >
        Execs
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="id"
      >
        ID
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="name"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="name"
      >
        Name
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="version"
      >
        Version
      </Cell>
    );

    for (const state of ORDER_STATES) {
      yield (
        <Cell
          tag="th"
          className="narrow"
          onSortChange={this.props.onSortChange}
          sortData={this.props.sortData}
          name={state.name}
        >
          {state.short}
        </Cell>
      );
    }

    yield (
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="TOTAL"
      >
        Total
      </Cell>
    );

    if (includes(filterArray(this.context.params.filter), WORKFLOW_FILTERS.DEPRECATED)) {
      yield (
        <Cell
          tag="th"
          className="narrow"
        >
          Visible
        </Cell>
      );
    }
  }

  /**
   * Yields cells with workflow data including order states.
   *
   * @param {Object} workflow
   * @param {bool} selected
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderCells({ workflow, selected }) {
    yield (
      <Cell className="narrow checker">
        <Checkbox
          action={this.handleCheckboxClick}
          checked={selected ? 'CHECKED' : 'UNCHECKED'}
        />
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
          inc={this.setAutostart}
          dec={this.setAutostart}
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
      <Cell className="name">
        <Link to={`/workflow/${workflow.workflowid}/list/All/${this.props.linkDate}`}>
          {workflow.name}
        </Link>
      </Cell>
    );

    yield (
      <Cell className="narrow">{workflow.version}</Cell>
    );

    for (const state of ORDER_STATES) {
      yield (
        <Cell className="narrow">
          <Link to={`/workflow/${workflow.workflowid}/list/${state.title}/${this.props.linkDate}`}>
            <Badge label={state.label} val={workflow[state.name]} />
          </Link>
        </Cell>
      );
    }

    yield (
      <Cell className="narrow">
        <Link to={`/workflow/${workflow.workflowid}/list/All/${this.props.linkDate}`}>
          {workflow.TOTAL}
        </Link>
      </Cell>
    );

    if (includes(filterArray(this.context.params.filter), WORKFLOW_FILTERS.DEPRECATED)) {
      const flag = workflow.deprecated ? 'fa-flag-o' : 'fa-flag';

      yield (
        <Cell
          className="narrow"
        >
          <i className={classNames('fa', flag)} />
        </Cell>
      );
    }
  }


  /**
   * Yields row for table head.
   *
   * @return {Generator<ReactElement>}
   * @see renderHeadings
   */
  *renderHeadingRow() {
    yield (
      <Row cells={this.renderHeadings} />
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
   * @param {Object<number, boolean>} selectedWorkflows
   * @return {Generator<ReactElement>}
   * @see activateWorkflow
   * @see renderCells
   */
  *renderRows({ activeId, workflows, selectedWorkflows }) {
    for (const workflow of workflows) {
      const handleRowClick = (e) => {
        if (e.defaultPrevented) return;

        this.props.openPane(workflow.workflowid);
      };

      yield (
        <Row
          key={workflow.workflowid}
          data={{
            workflow,
            selected: selectedWorkflows[workflow.workflowid],
          }}
          cells={this._renderCells}
          onClick={handleRowClick}
          highlight={workflow._updated}
          onHighlightEnd={this.handleHighlightEnd(workflow.workflowid)}
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
          selectedWorkflows: this.props.selectedWorkflows,
        }}
        sections={this._renderSections}
        className={'table table-striped table-condensed table-hover ' +
                   'table-fixed table--data'}
      />
    );
  }
}
