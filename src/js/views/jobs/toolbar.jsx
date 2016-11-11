import React, { Component, PropTypes } from 'react';
import Toolbar, { Actions } from 'components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import { Control as Button } from '../../components/controls';
import Checkbox from 'components/checkbox';
import Search from 'components/search';
import Datepicker from 'components/datepicker';

import { goTo } from '../../helpers/router';

import { CHECKBOX_STATES } from '../../constants/checkbox';

import { pureRender } from '../../components/utils';

@pureRender
export default class extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
    params: PropTypes.object,
    location: PropTypes.object,
    route: PropTypes.object,
    router: PropTypes.object,
    defaultSearchValue: PropTypes.string,
    onSearchUpdate: PropTypes.func,
    batchAction: PropTypes.func,
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
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

  /**
   * Handles reseting multiple workflows
   */
  handleRunClick = () => {
    this.props.batchAction('run');
  };

  applyDate = (date) => {
    goTo(
      this.props.router,
      'jobs',
      this.props.route.path,
      this.props.params,
      { date },
      this.props.location.query
    );
  };

  /**
   * Renders the selection dropdown to the component
   */
  renderSelectionControls() {
    if (this.props.selected !== 'none') {
      return (
        <div
          className="btn-group pull-left"
          id="selection-actions"
        >
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
            label="Run"
            icon="play"
            big
            btnStyle="default"
            action={this.handleRunClick}
          />
          <Button
            label="Reset"
            icon="refresh"
            big
            btnStyle="default"
            action={this.handleResetClick}
          />
        </div>
      );
    }

    return null;
  }

  render() {
    const checked = CHECKBOX_STATES[this.props.selected];

    return (
      <Toolbar>
        <Dropdown
          id="selection"
          className="pull-left"
        >
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
        <Search
          defaultValue={this.props.defaultSearchValue}
          onSearchUpdate={this.props.onSearchUpdate}
        />
        <Button
          label="CSV"
          btnStyle="default"
          big
          action={this.props.onCSVClick}
        />
      </Toolbar>
    );
  }
}
