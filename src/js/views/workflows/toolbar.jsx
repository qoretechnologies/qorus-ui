import React, { Component, PropTypes } from 'react';
import Toolbar, { Actions } from 'components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import { Control as Button, Controls } from 'components/controls';
import Checkbox from 'components/checkbox';

import { CHECKBOX_STATES } from '../../constants/checkbox';

import { pureRender } from 'components/utils';

@pureRender
export default class WorkflowsToolbar extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
    onRunningClick: PropTypes.func,
    onDeprecatedClick: PropTypes.func,
  };

  onAllClick() {
    if (this.props.selected === 'none' || this.props.selected === 'some') {
      this.props.onFilterClick(() => true);
    } else {
      this.onNoneClick();
    }
  }

  onNoneClick() {
    this.props.onFilterClick(() => false);
  }

  onInvertClick() {
    this.props.onFilterClick((workflow, selectedWorkflows) => !selectedWorkflows[workflow.id]);
  }

  onRunningClick() {
    this.props.onFilterClick((workflow) => workflow.exec_count > 0);
  }

  onStoppedClick() {
    this.props.onFilterClick((workflow) => workflow.exec_count === 0);
  }

  /**
   * Renders the seleciton dropdown to the component
   */
  renderSelectionControls() {
    if (this.props.selected !== 'none') {
      return (
        <Actions>
          <Button
            label="Enable"
            icon="toggle-on"
            big
            btnStyle="default"
          />
          <Button
            label="Disable"
            icon="toggle-off"
            big
            btnStyle="default"
          />
          <Button
            label="Reset"
            icon="power-off"
            big
            btnStyle="default"
          />
          <Dropdown>
            <DropdownControl />
            <DropdownItem
              title="Set deprecated"
              icon="flag"
            />
            <DropdownItem
              title="Unset deprecated"
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
              action={::this.onAllClick}
              checked={checked}
            />&nbsp;
          </DropdownControl>
          <DropdownItem
            action={::this.onAllClick}
            title="All"
          />
          <DropdownItem
            action={::this.onNoneClick}
            title="None"
          />
          <DropdownItem
            action={::this.onInvertClick}
            title="Invert"
          />
          <DropdownItem
            action={::this.onRunningClick}
            title="Running"
          />
          <DropdownItem
            action={::this.onStoppedClick}
            title="Stopped"
          />
        </Dropdown>
        {this.renderSelectionControls()}
        <Controls grouped noControls>
          <Button
            label="Running"
            big
            action={::this.props.onRunningClick}
            icon="square-o"
            btnStyle="default"
          />
          <Button
            label="Last version"
            big
            icon="square-o"
            btnStyle="default"
          />
          <Button
            label="Deprecated"
            big
            action={::this.props.onDeprecatedClick}
            icon="square-o"
            btnStyle="default"
          />
        </Controls>
      </Toolbar>
    );
  }
}
