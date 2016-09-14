import React, { Component, PropTypes } from 'react';

import Toolbar, { Actions } from '../../../../components/toolbar';
import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../../../components/dropdown';
import { Control as Button } from '../../../../components/controls';
import Checkbox from '../../../../components/checkbox';
import Search from '../../../../components/search';
import Datepicker from '../../../../components/datepicker';
import { pureRender } from '../../../../components/utils';
import { goTo } from '../../../../helpers/router';
import { getActionData } from '../../../../helpers/orders';

import { CHECKBOX_STATES } from '../../../../constants/checkbox';
import { ORDER_STATES } from '../../../../constants/orders';


@pureRender
export default class OrdersToolbar extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
    params: PropTypes.object,
    defaultSearchValue: PropTypes.string,
    onSearchUpdate: PropTypes.func,
    batchAction: PropTypes.func,
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
  };

  /**
   * Handles enabling multiple workflows
   */
  handleRetryClick = () => {
    this.props.batchAction('retry');
  };

  /**
   * Handles disabling multiple workflows
   */
  handleBlockClick = () => {
    this.props.batchAction('block');
  };

  /**
   * Handles reseting multiple workflows
   */
  handleUnblockClick = () => {
    this.props.batchAction('unblock');
  };

  /**
   * Handles reseting multiple workflows
   */
  handleCancelClick = () => {
    this.props.batchAction('cancel');
  };

  /**
   * Handles reseting multiple workflows
   */
  handleUncancelClick = () => {
    this.props.batchAction('uncancel');
  };

  applyDate = (date) => {
    goTo(
      this.context.router,
      'workflow',
      this.context.route.path,
      this.context.params,
      { date },
      this.context.location.query
    );
  };

  applyFilter = (filters) => {
    goTo(
      this.context.router,
      'workflow',
      this.context.route.path,
      this.context.params,
      { filter: filters.join(',') },
      this.context.location.query
    );
  };

  /**
   * Renders the selection dropdown to the component
   */
  renderSelectionControls() {
    if (this.props.selected !== 'none') {
      return (
        <Actions>
          <Button
            label={getActionData('retry', 'name')}
            icon={getActionData('retry', 'icon')}
            big
            btnStyle="default"
            action={this.handleRetryClick}
          />
          <Button
            label={getActionData('cancel', 'name')}
            icon={getActionData('cancel', 'icon')}
            big
            btnStyle="default"
            action={this.handleCancelClick}
          />
          <Button
            label={getActionData('uncancel', 'name')}
            icon={getActionData('uncancel', 'icon')}
            big
            btnStyle="default"
            action={this.handleUncancelClick}
          />
          <Button
            label={getActionData('block', 'name')}
            icon={getActionData('block', 'icon')}
            big
            btnStyle="default"
            action={this.handleBlockClick}
          />
          <Button
            label={getActionData('unblock', 'name')}
            icon={getActionData('unblock', 'icon')}
            big
            btnStyle="default"
            action={this.handleUnblockClick}
          />
        </Actions>
      );
    }

    return null;
  }

  renderOrderStates = () => ORDER_STATES.map((o, k) => (
    <DropdownItem key={k} title={o.title} />
  ));

  render() {
    const checked = CHECKBOX_STATES[this.props.selected];
    const filter = this.props.params.filter.split(',');

    return (
      <Toolbar>
        <Dropdown id="selection">
          <DropdownControl>
            <Checkbox
              action={this.props.onAllClick}
              checked={checked}
            />
            {' '}
          </DropdownControl>
          <DropdownItem
            action={this.props.onAllClick}
            title="All"
          />
          <DropdownItem
            action={this.props.onNoneClick}
            title="None"
          />
          <DropdownItem
            action={this.props.onInvertClick}
            title="Invert"
          />
        </Dropdown>
        {this.renderSelectionControls()}
        <Datepicker
          className="toolbar-item"
          date={this.props.params.date}
          onApplyDate={this.applyDate}
        />
        <Dropdown
          id="filters"
          multi
          def="All"
          onSubmit={this.applyFilter}
          selected={filter}
        >
          <DropdownControl />
          <DropdownItem title="All" />
          {this.renderOrderStates()}
        </Dropdown>
        <Button
          label="CSV"
          btnStyle="default"
          big
          action={this.props.onCSVClick}
        />
        <Search
          defaultValue={this.props.defaultSearchValue}
          onSearchUpdate={this.props.onSearchUpdate}
        />
      </Toolbar>
    );
  }
}
