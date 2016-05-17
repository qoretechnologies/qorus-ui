import React from 'react';
import Table from '../../../services/table';

import { Cell } from '../../../../components/table';
import OrderControls from './controls';
import Date from '../../../../components/date';
import Checkbox from '../../../../components/checkbox';

import { ORDER_STATES } from '../../../../constants/orders';

export default class extends Table {
  static defaultProps = {
    setSelectedData: () => {},
    selectedData: {},
  };

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
      <Cell tag="th" className="narrow" />
    );

    yield (
      <Cell tag="th" className="narrow">
        Actions
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="status"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Status
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="business_error"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Bus. Err.
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
        Order
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="started"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Started
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="completed"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Completed
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="modified"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Modified
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="scheduled"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Scheduled
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="error_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Errors
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="warning_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Warning
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
      >
        Lock
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="note_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Notes
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
          action={ this.handleCheckboxClick }
          checked={ selected ? 'CHECKED' : 'UNCHECKED'}
        />
      </Cell>
    );

    yield (
      <Cell className="narrow line-counter" />
    );

    yield (
      <Cell className="narrow">
        <OrderControls data={ model } />
      </Cell>
    );

    const { label } = ORDER_STATES.find(o => o.name === model.workflowstatus);

    yield (
      <Cell className="narrow">
        <span className={`label label-${label}`}>
          { model.workflowstatus }
        </span>
      </Cell>
    );

    yield (
      <Cell className="narrow">{ model.business_error }</Cell>
    );

    yield (
      <Cell className="name">{ model.name }</Cell>
    );

    yield (
      <Cell>
        <Date date={ model.started } />
      </Cell>
    );

    yield (
      <Cell>
        <Date date={ model.completed } />
      </Cell>
    );

    yield (
      <Cell>
        <Date date={ model.modified } />
      </Cell>
    );

    yield (
      <Cell>
        <Date date={ model.scheduled } />
      </Cell>
    );

    yield (
      <Cell className="narrow">{ model.error_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.warning_count }</Cell>
    );

    yield (
      <Cell className="narrow"> Lock </Cell>
    );

    yield (
      <Cell>{ model.note_count }</Cell>
    );
  }
}