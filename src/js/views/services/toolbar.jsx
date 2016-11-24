import React, { Component, PropTypes } from 'react';
import Toolbar, { Actions } from '../../components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import { Control as Button } from 'components/controls';
import Checkbox from 'components/checkbox';
import Search from 'components/search';

import { CHECKBOX_STATES } from '../../constants/checkbox';

import { pureRender } from '../../components/utils';

@pureRender
export default class extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
    onRunningClick: PropTypes.func,
    onDeprecatedClick: PropTypes.func,
    onLastVersionClick: PropTypes.func,
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
  handleLoadClick = () => {
    this.props.batchAction('load');
  };

  /**
   * Handles reseting multiple workflows
   */
  handleUnloadClick = () => {
    this.props.batchAction('unload');
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
            label="Load"
            icon="check"
            big
            btnStyle="default"
            action={this.handleLoadClick}
          />
          <Button
            label="Unload"
            icon="remove"
            big
            btnStyle="default"
            action={this.handleUnloadClick}
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

  render() {
    const checked = CHECKBOX_STATES[this.props.selected];

    return (
      <Toolbar sticky>
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
