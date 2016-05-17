import React, { Component, PropTypes } from 'react';
import Toolbar, { Actions } from 'components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import { Control as Button } from 'components/controls';
import Checkbox from 'components/checkbox';
import Search from 'components/search';
import Datepicker from 'components/datepicker';

import { goTo } from 'helpers/router';

import { CHECKBOX_STATES } from 'constants/checkbox';
import { ORDER_STATES } from 'constants/orders';

import { pureRender } from 'components/utils';

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
  handleEnableClick = () => {
    this.props.batchAction('enable');
  };

  /**
   * Handles disabling multiple workflows
   */
  handleDisableClick = () => {
    this.props.batchAction('disable');
  };

  /**
   * Handles reseting multiple workflows
   */
  handleResetClick = () => {
    this.props.batchAction('reset');
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
            label="Enable"
            icon="power-off"
            big
            btnStyle="default"
            action={this.handleEnableClick}
          />
          <Button
            label="Disable"
            icon="ban"
            big
            btnStyle="default"
            action={this.handleDisableClick}
          />
          <Button
            label="Reset"
            icon="refresh"
            big
            btnStyle="default"
            action={this.handleResetClick}
          />
        </Actions>
      );
    }

    return null;
  }

  renderOrderStates = () => ORDER_STATES.map(o => (
    <DropdownItem title={o.title} />
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
            />&nbsp;
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
          date={this.props.params.date}
          onApplyDate={this.applyDate}
        />
        <Dropdown
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
