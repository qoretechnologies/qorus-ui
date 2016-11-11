import React from 'react';
import { Link } from 'react-router';
import { union } from 'lodash';

import Table from '../../../services/table';
import { Cell, Row } from '../../../../components/table';
import OrderControls from './controls';
import Date from '../../../../components/date';
import Checkbox from '../../../../components/checkbox';
import Dropdown, { Item, Control } from '../../../../components/dropdown';
import Lock from './modals/lock';
import { ORDER_STATES, CUSTOM_ORDER_STATES } from '../../../../constants/orders';
import { updateDone } from '../../../../store/api/resources/orders/actions/specials';

export default class OrdersTable extends Table {
  static defaultProps = {
    setSelectedData: () => {},
    selectedData: {},
  };

  handleLockClick = (model) => () => {
    const label = model.operator_lock ? 'Unlock' : 'Lock';

    this._modal = (
      <Lock
        onClose={this.handleModalCloseClick}
        data={model}
        label={label}
        username={this.props.username}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  handleHighlightEnd = (id) => () => {
    this.context.dispatch(
      updateDone(id)
    );
  };

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    if (!this.props.noCheckbox) {
      yield (
        <Cell tag="th" className="narrow" />
      );
    }

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
        name="workflowstatus"
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
        name="normalizedName"
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
    if (!this.props.noCheckbox) {
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
            checked={ selected ? 'CHECKED' : 'UNCHECKED'}
          />
        </Cell>
      );
    }

    yield (
      <Cell className="narrow line-counter" />
    );

    yield (
      <Cell className="narrow">
        <OrderControls
          data={ model }
          onScheduleClick={this.props.onScheduleClick}
        />
      </Cell>
    );

    const states = union(ORDER_STATES, CUSTOM_ORDER_STATES);
    const { label } = states.find(o => o.name === model.workflowstatus);

    yield (
      <Cell className="narrow">
        <span className={`label label-${label}`}>
          { model.workflowstatus }
        </span>
      </Cell>
    );

    yield (
      <Cell>{ model.business_error }</Cell>
    );

    yield (
      <Cell className="name nowrap">
        <Link to={`/order/${model.id}/${this.props.linkDate || ''}`}>
          { model.normalizedName }
        </Link>
      </Cell>
    );

    yield (
      <Cell className="nowrap">
        <Date date={ model.started } />
      </Cell>
    );

    yield (
      <Cell className="nowrap">
        <Date date={ model.completed } />
      </Cell>
    );

    yield (
      <Cell className="nowrap">
        <Date date={ model.modified } />
      </Cell>
    );

    yield (
      <Cell className="nowrap">
        <Date date={ model.scheduled } />
      </Cell>
    );

    yield (
      <Cell className="narrow">{ model.error_count }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.warning_count }</Cell>
    );

    const icon = model.operator_lock ? 'lock' : 'unlock';
    const itemIcon = model.operator_lock ? 'unlock' : 'lock';
    const locked = model.operator_lock || '';
    const title = model.operator_lock ? 'Unlock' : 'Lock';
    const style = model.operator_lock ? 'danger' : 'success';
    const disabled = model.operator_lock && model.operator_lock !== this.props.username;

    yield (
      <Cell className="narrow">
        <Dropdown>
          <Control
            disabled={disabled}
            small
            btnStyle={style}
          >
            <i className={`fa fa-${icon}`} />
            {' '}
            { locked }
          </Control>
          <Item
            icon={itemIcon}
            title={title}
            action={this.handleLockClick(model)}
          />
        </Dropdown>
      </Cell>
    );

    yield (
      <Cell>{ model.note_count }</Cell>
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
          cells={this._renderCells}
          highlight={model._updated}
          onHighlightEnd={this.handleHighlightEnd(model.id)}
        />
      );
    }
  }
}
