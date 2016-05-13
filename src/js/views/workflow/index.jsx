import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Header from './header';
import Tabs, { Pane } from '../../components/tabs';
import List from './tabs/list';
import Loader from '../../components/loader';

import { goTo } from '../../helpers/router';

import actions from 'store/api/actions';

const workflowSelector = state => state.api.workflows.data[0];

const selector = createSelector(
  [
    workflowSelector,
  ], (workflow) => ({
    workflow,
  })
);

@connect(selector)
export default class extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    workflow: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
    sortData: PropTypes.object,
    onFilterClick: PropTypes.func,
    filterFn: PropTypes.func,
    onSearchChange: PropTypes.func,
    clearSelection: PropTypes.func,
    onDataFilterChange: PropTypes.func,
    setSelectedData: PropTypes.func,
    onBatchAction: PropTypes.func,
    selectedData: PropTypes.object,
    selected: PropTypes.string,
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
    location: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
  };

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
      location: this.props.location,
      params: this.props.params,
      route: this.props.route,
    };
  }

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(actions.workflows.fetch({}, id));
  }

  handleTabChange = (tabId) => {
    goTo(
      this.context.router,
      'workflow',
      this.props.route.path,
      this.props.params,
      { tabId }
    );
  };

  render() {
    if (!this.props.workflow) {
      return <Loader />;
    }

    return (
      <div>
        <Header
          data={this.props.workflow}
          tabId={this.props.params.tabId}
        />
        <div className="row">
          <div className="col-xs-12">
            <Tabs
              active={this.props.params.tabId}
              tabChange={this.handleTabChange}
            >
              <Pane name="List">
                <List
                  id={this.props.params.id}
                  onFilterClick={this.props.onFilterClick}
                  onSearchChange={this.props.onSearchChange}
                  selected={this.props.selected}
                  defaultSearchValue={this.props.location.query.q}
                  params={this.props.params}
                  onAllClick={this.props.onAllClick}
                  onNoneClick={this.props.onNoneClick}
                  onInvertClick={this.props.onInvertClick}
                  clearSelection={this.props.clearSelection}
                  location={this.props.location}
                  filterFn={this.props.filterFn}
                  onDataFilterChange={this.props.onDataFilterChange}
                  setSelectedData={this.props.setSelectedData}
                  selectedData={this.props.selectedData}
                  sortData={this.props.sortData}
                />
              </Pane>
              <Pane name="Performance" />
              <Pane name="Log" />
              <Pane name="Info" />
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
