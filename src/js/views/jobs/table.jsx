import React from 'react';
import ServiceTable from '../services/table';

import { Cell } from '../../components/table';
import Badge from '../../components/badge';
import JobControls from './controls';
import Date from '../../components/date';
import Checkbox from '../../components/checkbox';

import { goTo } from '../../helpers/router';

/**
 * List of all jobs in the system.
 *
 * Beware, this component is very performance internsive - even
 * HTML/CSS without any JS is relatively slow.
 */
export default class JobsTable extends ServiceTable {
  static defaultProps = {
    setSelectedData: () => {},
    selectedData: {},
  };

  /**
   * Changes active route to job associated with clicked element.
   *
   * If the event handled some significant action before (i.e., its
   * default action is prevented), it does nothing.
   *
   * @param {Event} ev
   */
  activateRow(ev) {
    if (ev.defaultPrevented) return;

    const model = this.findActivatedRow(ev.currentTarget);
    const shouldDeactivate =
      this.context.params.detailId &&
      parseInt(this.context.params.detailId, 10) === model.id;
    const change = {
      detailId: shouldDeactivate ? null : model.id,
      tabId: shouldDeactivate ? null : this.context.params.tabId,
    };

    goTo(
      this.context.router,
      'jobs',
      this.context.route.path,
      this.context.params,
      change
    );
  }


  /**
   * Yields heading cells for model info.
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
      <Cell tag="th" className="narrow">
        <i className="fa fa-warning" />
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="name"
        name="name"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Name
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="version"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Version
      </Cell>
    );

    yield (
      <Cell tag="th">Last</Cell>
    );

    yield (
      <Cell tag="th">Next</Cell>
    );

    yield (
      <Cell tag="th">Expiry Date</Cell>
    );

    yield (
      <Cell
        tag="th"
        name="COMPLETE"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Complete
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="ERROR"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Error
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="IN-PROGRESS"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        In-progress
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="CRASHED"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Crashed
      </Cell>
    );
  }


  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @param {String} selected
   * @return {Generator<ReactElement>}
   */
  *renderCells({ model, selected }) {
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
        <JobControls job={model} />
      </Cell>
    );

    const alert = model.has_alerts ?
      <i className="fa fa-warning text-danger" /> : '';

    yield (
      <Cell className="narrow">{ alert }</Cell>
    );

    yield (
      <Cell className="name">{model.name}</Cell>
    );

    yield (
      <Cell className="narrow">{model.version}</Cell>
    );

    yield (
      <Cell><Date date={model.last_executed} /></Cell>
    );

    yield (
      <Cell><Date date={model.next} /></Cell>
    );

    yield (
      <Cell><Date date={model.expiry_date} /></Cell>
    );

    yield (
      <Cell><Badge label="complete" val={model.COMPLETE || 0} /></Cell>
    );

    yield (
      <Cell><Badge label="error" val={model.ERROR || 0} /></Cell>
    );

    yield (
      <Cell><Badge label="progress" val={model['IN-PROGRESS'] || 0} /></Cell>
    );

    yield (
      <Cell><Badge label="crashed" val={model.CRASHED || 0} /></Cell>
    );
  }
}
