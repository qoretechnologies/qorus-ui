import React, { Component, PropTypes } from 'react';
import Toolbar from 'components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import Checkbox from 'components/checkbox';

import { CHECKBOX_STATES } from '../../constants/checkbox';

import classNames from 'classnames';
import { pureRender } from 'components/utils';

@pureRender
export default class WorkflowsToolbar extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
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
      const btnCls = classNames('btn', 'btn-default', 'btn-sm');

      return (
        <div className="btn-group">
          <button className={btnCls}>
            <i className="fa fa-off" /> Enable
          </button>
          <button className={btnCls}>
            <i className="fa fa-ban-circle" /> Disable
          </button>
          <button className={btnCls}>
            <i className="fa fa-refresh" /> Reset
          </button>
          <button className={btnCls}>
            <i className="fa fa-flag-alt" /> Hide
          </button>
          <button className={btnCls}>
            <i className="fa fa-flag" /> Show
          </button>
        </div>
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
      </Toolbar>
    );
  }
}
