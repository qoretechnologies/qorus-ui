import React from 'react';
import { Link } from 'react-router';

import ServiceTable from '../services/table';
import { Cell } from '../../components/table';
import GroupControls from './controls';
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
      <Cell
        tag="th"
        className="narrow"
        name="enabled"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >Enabled</Cell>
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
        name="description"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Description
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="jobs_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Jobs
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="mappers_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Mappers
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="services_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Services
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="workflows_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Workflows
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="roles_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Roles
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        name="vmaps_count"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
      >
        Vmaps
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
        <GroupControls group={model} />
      </Cell>
    );

    yield (
      <Cell className="name">
        <Link to={`/groups/${model.name}`}>
          { model.name }
        </Link>
      </Cell>
    );

    yield (
      <Cell>{ model.description }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.jobs_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.mappers_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.services_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.workflows_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.roles_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.vmaps_count }</Cell>
    );
  }
}
