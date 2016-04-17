import React, { Component, PropTypes } from 'react';
import Toolbar, { Actions } from 'components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import { Control as Button, Controls } from 'components/controls';
import Checkbox from 'components/checkbox';
import Search from 'components/search';

import { includes } from 'lodash';

import { CHECKBOX_STATES } from '../../constants/checkbox';
import { WORKFLOW_FILTERS } from '../../constants/filters';

import { pureRender } from '../../components/utils';

@pureRender
export default class WorkflowsToolbar extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
    onRunningClick: PropTypes.func,
    onDeprecatedClick: PropTypes.func,
    onLastVersionClick: PropTypes.func,
    filter: PropTypes.array,
    defaultSearchValue: PropTypes.string,
    onSearchUpdate: PropTypes.func,
  };

  componentWillMount() {
    this.handleAllClick = ::this.handleAllClick;
    this.handleNoneClick = ::this.handleNoneClick;
    this.handleInvertClick = ::this.handleInvertClick;
    this.handleRunningClick = ::this.handleRunningClick;
    this.handleStoppedClick = ::this.handleStoppedClick;
  }

  /**
   * Handles selecting/deselecting all workflows
   */
  handleAllClick() {
    if (this.props.selected === 'none' || this.props.selected === 'some') {
      this.props.onFilterClick(() => true);
    } else {
      this.handleNoneClick();
    }
  }

  /**
   * Handles deselecting all workflows
   */
  handleNoneClick() {
    this.props.onFilterClick(() => false);
  }

  /**
   * Handles inverting selected workflows
   */
  handleInvertClick() {
    this.props.onFilterClick((workflow, selectedWorkflows) => !selectedWorkflows[workflow.id]);
  }

  /**
   * Handles selecting only running workflows
   */
  handleRunningClick() {
    this.props.onFilterClick((workflow) => workflow.exec_count > 0);
  }

  /**
   * Handles selecting only stopped workflows
   */
  handleStoppedClick() {
    this.props.onFilterClick((workflow) => workflow.exec_count === 0);
  }

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
          />
          <Button
            label="Disable"
            icon="ban"
            big
            btnStyle="default"
          />
          <Button
            label="Reset"
            icon="refresh"
            big
            btnStyle="default"
          />
          <Dropdown id="hidden">
            <DropdownControl />
            <DropdownItem
              title="Hide"
              icon="flag"
            />
            <DropdownItem
              title="Show"
              icon="flag-o"
            />
          </Dropdown>
        </Actions>
      );
    }

    return null;
  }

  render() {
    const checked = CHECKBOX_STATES[this.props.selected];

    return (
      <Toolbar>
        <Dropdown id="selection">
          <DropdownControl>
            <Checkbox
              action={this.handleAllClick}
              checked={checked}
            />&nbsp;
          </DropdownControl>
          <DropdownItem
            action={this.handleAllClick}
            title="All"
          />
          <DropdownItem
            action={this.handleNoneClick}
            title="None"
          />
          <DropdownItem
            action={this.handleInvertClick}
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
        <Controls grouped noControls>
          <Button
            label="Running"
            big
            action={::this.props.onRunningClick}
            icon={includes(this.props.filter, WORKFLOW_FILTERS.RUNNING) ?
              'check-square-o' : 'square-o'}
            btnStyle={includes(this.props.filter, WORKFLOW_FILTERS.RUNNING) ?
              'success' : 'default'}
          />
          <Button
            label="Last version"
            big
            action={::this.props.onLastVersionClick}
            icon={includes(this.props.filter, WORKFLOW_FILTERS.LAST_VERSION) ?
              'check-square-o' : 'square-o'}
            btnStyle={includes(this.props.filter, WORKFLOW_FILTERS.LAST_VERSION) ?
              'success' : 'default'}
          />
          <Dropdown id="deprecated">
            <DropdownControl
              btnStyle={includes(this.props.filter, WORKFLOW_FILTERS.DEPRECATED) ?
                'success' : 'default'}
            />
            <DropdownItem
              title="Deprecated"
              icon={includes(this.props.filter, WORKFLOW_FILTERS.DEPRECATED) ?
                'check-square-o' : 'square-o'}
              action={::this.props.onDeprecatedClick}
            />
          </Dropdown>
        </Controls>
        <Search
          defaultValue={this.props.defaultSearchValue}
          onSearchUpdate={::this.props.onSearchUpdate}
        />
      </Toolbar>
    );
  }
}
