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
        Severity
      </Cell>
    );

    yield (
      <Cell tag="th">
        Error Code
      </Cell>
    );

    yield (
      <Cell tag="th">
        Description
      </Cell>
    );

    yield (
      <Cell tag="th">
        Step name
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
      >
        Ind
      </Cell>
    );

    yield (
      <Cell
        tag="th"
      >
        Created
      </Cell>
    );

    yield (
      <Cell
        tag="th"
      >
        Error Type
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
        Retry
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
      <Cell className="narrow">{ model.severity }</Cell>
    );

    yield (
      <Cell>{ model.error }</Cell>
    );

    yield (
      <Cell>{ model.description }</Cell>
    );

    const stepName = this.props.steps.find(s => s.stepid === model.stepid).stepname;

    yield (
      <Cell className="narrow">{ stepName }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.ind }</Cell>
    );

    yield (
      <Cell className="nowrap">
        <Date date={ model.created } />
      </Cell>
    );

    yield (
      <Cell>{ model.business_error ? 'Business' : 'Other' }</Cell>
    );

    yield (
      <Cell>{ model.info }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.retry }</Cell>
    );
  }
}
