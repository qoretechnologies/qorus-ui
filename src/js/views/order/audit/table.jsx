import React, { PropTypes } from 'react';
import Table from '../../services/table';

import { Cell } from '../../../components/table';

import Date from '../../../components/date';

export default class extends Table {
  static defaultProps = {
    setSelectedData: () => {},
    selectedData: {},
    steps: PropTypes.array,
  };

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="narrow">
        Event Code
      </Cell>
    );

    yield (
      <Cell tag="th">
        Event ID
      </Cell>
    );

    yield (
      <Cell tag="th">
        Created
      </Cell>
    );

    yield (
      <Cell tag="th">
        Event
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
      >
        Info
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
      >
        Reason
      </Cell>
    );

    yield (
      <Cell
        tag="th"
      >
        Source
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
      >
        Who
      </Cell>
    );
  }


  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @return {Generator<ReactElement>}
   */
  *renderCells({ model }) {
    yield (
      <Cell className="narrow">{ model.audit_event_code }</Cell>
    );

    yield (
      <Cell>{ model.audit_eventid }</Cell>
    );

    yield (
      <Cell className="nowrap">
        <Date date={ model.created } />
      </Cell>
    );

    yield (
      <Cell>{ model.event }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.info1 }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.reason }</Cell>
    );

    yield (
      <Cell>{ model.source }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.who }</Cell>
    );
  }
}
