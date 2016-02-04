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
  render() {
    const btnCls = classNames('btn', 'btn-default', 'btn-sm');

    return (
      <Toolbar>
        <div className="workflows-toolbar btn-toolbar sticky toolbar">
          <div className="btn-group">
            <button
              className={classNames(btnCls, 'dropdown-toggle')}
              data-toggle="dropdown"
            >
              <i className="fa fa-square-o check-all checker"></i>&nbsp;
              <span className="caret" />
            </button>
            <ul className="dropdown-menu above">
              <li><a href="#" className="check-all">All</a></li>
              <li><a href="#" className="uncheck-all">None</a></li>
              <li><a href="#" className="invert">Invert</a></li>
              <li><a href="#" className="running">Running</a></li>
              <li><a href="#" className="stopped">Stopped</a></li>
            </ul>
          </div>
          <div className="btn-group">
            <button className={btnCls}>
              <i className="fa fa-off"></i> Enable
            </button>
            <button className={btnCls}>
              <i className="fa fa-ban-circle"></i> Disable
            </button>
            <button className={btnCls}>
              <i className="fa fa-refresh"></i> Reset
            </button>
            <button className={btnCls}>
              <i className="fa fa-flag-alt"></i> Hide
            </button>
            <button className={btnCls}>
              <i className="fa fa-flag"></i> Show
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
}
