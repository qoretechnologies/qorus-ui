import React, { Component, PropTypes } from 'react';
import Toolbar from 'components/toolbar';
import Dropdown, { Item as DropdownItem, Control as DropdownControl } from 'components/dropdown';
import Checkbox from 'components/checkbox';

import classNames from 'classnames';
import { pureRender } from 'components/utils';

@pureRender
export default class WorkflowsToolbar extends Component {
  static propTypes = {
    selected: PropTypes.bool,
  };

  /**
   * Renders the seleciton dropdown to the component
   */
  renderSelectionControls() {
    if (this.props.selected) {
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

  onAllClick() {
    this.props.onFilterClick((workflow) => {
      return true;
    });
  }
  
  render() {
    return (
      <Toolbar>
        <Dropdown id="selection">
          <DropdownControl>
            <Checkbox
              action={::this.onAllClick}
              checked={false}
            />&nbsp;
          </DropdownControl>
          <DropdownItem
            action={::this.onAllClick}
            title="All" />
          <DropdownItem title="None" />
          <DropdownItem title="Invert" />
          <DropdownItem title="Running" />
          <DropdownItem title="Stopped" />
        </Dropdown>
        {this.renderSelectionControls()}
      </Toolbar>
    );
  }
}
