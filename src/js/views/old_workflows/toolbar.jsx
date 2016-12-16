/* @flow */
import React, { Component, PropTypes } from 'react';
import Toolbar from '../../components/toolbar';
import Dropdown, {
  Item as DropdownItem,
  Control as DropdownControl,
} from '../../components/dropdown';
import { Control as Button, Controls } from '../../components/controls';
import Checkbox from '../../components/checkbox';
import Search from '../../components/search';
import Datepicker from '../../components/datepicker';

import { filterArray } from '../../helpers/workflows';
import { goTo } from '../../helpers/router';
import { includes } from 'lodash';

import { CHECKBOX_STATES } from '../../constants/checkbox';
import { WORKFLOW_FILTERS } from '../../constants/filters';

import { pureRender } from '../../components/utils';

@pureRender
export default class WorkflowsToolbar extends Component {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
  };

  props: {
    selected: string,
    onFilterClick: () => boolean,
    onRunningClick: () => void,
    onDeprecatedClick: () => void,
    onLastVersionClick: () => void,
    params: Object,
    defaultSearchValue: string,
    onSearchUpdate: () => void,
    batchAction: () => void,
    onAllClick: () => void,
    onNoneClick: () => void,
    onInvertClick: () => void,
    onCSVClick: () => void,
    expanded: boolean,
    onToggleStatesClick: Function,
  };

  /**
   * Handles selecting only running workflows
   */
  handleRunningClick = () => {
    this.props.onFilterClick((workflow) => workflow.exec_count > 0);
  };

  /**
   * Handles selecting only stopped workflows
   */
  handleStoppedClick = () => {
    this.props.onFilterClick((workflow) => workflow.exec_count === 0);
  };

  /**
   * Handles displaying only the running workflows
   */
  handleDisplayRunningClick = () => this.props.onRunningClick();

  /**
   * Handles displaying only the running workflows
   */
  handleDisplayLastVersionClick = () => this.props.onLastVersionClick();

  /**
   * Handles displaying only the running workflows
   */
  handleDisplayDeprecatedClick = () => this.props.onDeprecatedClick();

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
   * Handles hiding multiple workflows
   */
  handleSetDeprecatedClick = () => {
    this.props.batchAction('setDeprecated');
  };

  /**
   * Handles un-hiding multiple workflows
   */
  handleUnsetDeprecatedClick = () => {
    this.props.batchAction('unsetDeprecated');
  };

  handleStartClick = () => {
    this.props.batchAction('start');
  };

  handleStopClick = () => {
    this.props.batchAction('stop');
  };

  applyDate = (date: string) => {
    goTo(
      this.context.router,
      'workflows',
      this.context.route.path,
      this.context.params,
      { date },
      this.context.location.query
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
            label="Reset"
            icon="refresh"
            big
            btnStyle="default"
            action={this.handleResetClick}
          />
          <Dropdown id="hidden">
            <DropdownControl />
            <DropdownItem
              title="Start"
              icon="rocket"
              action={this.handleStartClick}
            />
            <DropdownItem
              title="Stop"
              icon="ban"
              action={this.handleStopClick}
            />
            <DropdownItem
              title="Set deprecated"
              icon="flag"
              action={this.handleSetDeprecatedClick}
            />
            <DropdownItem
              title="Unset deprecated"
              icon="flag-o"
              action={this.handleUnsetDeprecatedClick}
            />
          </Dropdown>
        </div>
      );
    }

    return null;
  }

  render() {
    const checked = CHECKBOX_STATES[this.props.selected];
    const filter = filterArray(this.props.params.filter);
    const date = this.props.params.date || '24h';

    return (
      <Toolbar sticky>
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
          <DropdownItem
            action={this.handleRunningClick}
            title="Running"
          />
          <DropdownItem
            action={this.handleStoppedClick}
            title="Stopped"
          />
        </Dropdown>
        {this.renderSelectionControls()}
        <Datepicker
          date={date}
          onApplyDate={this.applyDate}
          className="toolbar-item"
        />
        <Controls grouped noControls>
          <Button
            label="Running"
            big
            action={this.handleDisplayRunningClick}
            icon={includes(filter, WORKFLOW_FILTERS.RUNNING) ?
              'check-square-o' : 'square-o'}
            btnStyle={includes(filter, WORKFLOW_FILTERS.RUNNING) ?
              'success' : 'default'}
          />
          <Button
            label="Last version"
            big
            action={this.handleDisplayLastVersionClick}
            icon={includes(filter, WORKFLOW_FILTERS.LAST_VERSION) ?
              'check-square-o' : 'square-o'}
            btnStyle={includes(filter, WORKFLOW_FILTERS.LAST_VERSION) ?
              'success' : 'default'}
          />
          <Dropdown id="deprecated">
            <DropdownControl
              btnStyle={includes(filter, WORKFLOW_FILTERS.DEPRECATED) ?
                'success' : 'default'}
            />
            <DropdownItem
              title="Deprecated"
              icon={includes(filter, WORKFLOW_FILTERS.DEPRECATED) ?
                'check-square-o' : 'square-o'}
              action={this.handleDisplayDeprecatedClick}
            />
          </Dropdown>
        </Controls>
        <Button
          label="CSV"
          btnStyle="default"
          big
          action={this.props.onCSVClick}
        />
        <Button
          label={this.props.expanded ? 'Collapse states' : 'Expand states'}
          btnStyle={this.props.expanded ? 'success' : 'default'}
          big
          action={this.props.onToggleStatesClick}
        />
        <Search
          defaultValue={this.props.defaultSearchValue}
          onSearchUpdate={this.props.onSearchUpdate}
        />
      </Toolbar>
    );
  }
}