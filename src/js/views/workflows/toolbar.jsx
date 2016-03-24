import React, { Component } from 'react';
import Toolbar from 'components/toolbar';


import classNames from 'classnames';
import { pureRender } from 'components/utils';


function Dummy() {
  return <span />;
}


const DateFilterView = Dummy;
const Filters = Dummy;
const SearchFormView = Dummy;


@pureRender
export default class WorkflowsToolbar extends Component {
  componentWillMount() {
    this.setState({
      showSelectionDropdown: false
    })
  }

  render() {
    const btnCls = classNames('btn', 'btn-default', 'btn-sm');

    return (
      <Toolbar>
        <div className="workflows-toolbar btn-toolbar sticky toolbar">
          <div className="btn-group">
            <button
              className={classNames(btnCls, 'dropdown-toggle')}
              data-toggle="dropdown"
              onClick={::this.handleSelectionDropdownToggleClick}
              id="selection-toggle"
            >
              <i
                  className="fa fa-square-o check-all checker icon-check-minus"
              /> &nbsp;
              <span className="caret" />
            </button>
            {this.renderSelectionDropdown()}
          </div>
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
          <DateFilterView
            filters={null}
            handleSubmitData={null}
            setDate={null}
          />
          <Filters
            setDeprecated={null}
            filters={null}
          />
          <div className="pull-right">
            <SearchFormView
              filterText={null}
              filterChange={null}
            />
          </div>
        </div>
        <div className="datepicker-container"></div>
      </Toolbar>
    );
  }

  /**
   * Displays / hides the control dropdown
   * based on the current state
   *
   * @param {object} event
   */
  handleSelectionDropdownToggleClick() {
    this.setState({
      showSelectionDropdown: !this.state.showSelectionDropdown
    });
  }

  renderSelectionDropdown() {
    if (this.state.showSelectionDropdown) {
      return <ul
        className={classNames('dropdown-menu', 'above', 'show')}
        id="selection-dropdown"
      >
        <li><a href="#" className="check-all">All</a></li>
        <li><a href="#" className="uncheck-all">None</a></li>
        <li><a href="#" className="invert">Invert</a></li>
        <li><a href="#" className="running">Running</a></li>
        <li><a href="#" className="stopped">Stopped</a></li>
      </ul>;
    }

    return null;
  }
}
