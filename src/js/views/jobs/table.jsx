import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import ServiceTable from '../services/table';
import { Cell, Row } from '../../components/table';
import { Controls, Control as Button } from '../../components/controls';
import Badge from '../../components/badge';
import JobControls from './controls';
import DateComponent from '../../components/date';
import Checkbox from '../../components/checkbox';

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

  handleHighlightEnd = (id) => () => {
    this.props.onUpdateDone(id);
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
      <Cell tag="th" className="narrow">-</Cell>
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
    const { params: { date = '24h' } = {} } = this.props;
    const handleCheckboxClick = () => {
      const selectedData = Object.assign({},
        this.props.selectedData,
        { [model.id]: !this.props.selectedData[model.id] }
      );

      this.setSelectedServices(selectedData);
    };

    yield (
      <Cell className="narrow checker">
        <Checkbox
          action={handleCheckboxClick}
          checked={selected ? 'CHECKED' : 'UNCHECKED'}
        />
      </Cell>
    );

    const handleDetailClick = () => {
      this.props.onDetailClick(model.jobid);
    };

    yield (
      <Cell className="narrow">
        <Button
          label="Detail"
          btnStyle="success"
          onClick={handleDetailClick}
          title="Open detail pane"
        />
      </Cell>
    );

    const {
      id,
      enabled,
      active,
    } = model;

    yield (
      <Cell className="narrow">
        <JobControls
          id={id}
          enabled={enabled}
          active={active}
          job={model}
        />
      </Cell>
    );

    const handleAlertClick = () => {
      this.props.onDetailClick(model.jobid, 'detail');
    };

    yield (
      <Cell className="narrow">
        {model.has_alerts && (
          <Controls>
            <Button
              btnStyle="danger"
              icon="warning"
              onClick={handleAlertClick}
              title="Show alerts"
            />
          </Controls>
        )}
      </Cell>
    );

    yield (
      <Cell className="name">
        <Link
          to={`/job/${model.jobid}?date=${date}`}
          className="resource-name-link"
        >
          {model.name}
        </Link>
      </Cell>
    );

    yield (
      <Cell className="narrow">{model.version}</Cell>
    );

    yield (
      <Cell><DateComponent date={model.last_executed} /></Cell>
    );

    yield (
      <Cell><DateComponent date={model.next} /></Cell>
    );

    yield (
      <Cell><DateComponent date={model.expiry_date} /></Cell>
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

  *renderRows({ collection, selectedData }) {
    for (const model of collection) {
      yield (
        <Row
          key={model.id}
          data={{
            model,
            selected: selectedData[model.id],
          }}
          highlight={model._updated}
          onHighlightEnd={this.handleHighlightEnd(model.id)}
          cells={this._renderCells}
          className={classNames('resource-row', {
            info: model.id === parseInt(this.props.paneId, 10),
          })}
        />
      );
    }
  }
}
