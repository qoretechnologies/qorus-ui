import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Header from './header';
import Tabs, { Pane } from '../../components/tabs';
import List from './tabs/list';
import Loader from '../../components/loader';
import Log from './tabs/log';
import InfoTable from '../../components/info_table';
import Code from '../../components/code';
import Performance from './tabs/performance';
import MappersTable from '../../containers/mappers';
import { goTo } from '../../helpers/router';
import { formatDate } from '../../helpers/workflows';
import { ORDER_STATES } from '../../constants/orders';
import { DATE_FORMATS } from '../../constants/dates';

import actions from 'store/api/actions';

const workflowSelector = (state, props) => {
  const wfl = state.api.workflows.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflowid, 10)
  ));

  return wfl;
};

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
    router: PropTypes.object.isRequired,
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

    this.props.dispatch(actions.workflows.fetch({ lib_source: true }, id));
  }

  componentWillUnmount() {
    this.props.dispatch(
      actions.orders.unsync()
    );

    this.props.dispatch(
      actions.workflows.unsync()
    );
  }

  getHeight: Function = (): number => {
    const navbar = document.querySelector('.navbar').clientHeight;
    const header = document.querySelector('.workflow-header').clientHeight;
    const tabs = document.querySelector('#content-wrapper .nav-tabs').clientHeight;
    const footer = document.querySelector('footer').clientHeight;
    const top = navbar + header + tabs + footer + 40;

    return window.innerHeight - top;
  };

  /**
   * Gets the formatted date for the
   * workflow link in the workflow table
   */
  getDate = () => formatDate(this.props.params.date).format(DATE_FORMATS.URL_FORMAT);

  handleTabChange = (tabId) => {
    goTo(
      this.context.router,
      'workflow',
      this.props.route.path,
      this.props.params,
      { tabId },
      this.props.location.query
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
          date={this.getDate()}
          tabId={this.props.params.tabId}
        />
        <div className="row">
          <div className="col-xs-12">
            <Tabs
              className="workflow-detail-tabs"
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
                  filterFn={this.props.filterFn}r
                  onDataFilterChange={this.props.onDataFilterChange}
                  setSelectedData={this.props.setSelectedData}
                  selectedData={this.props.selectedData}
                  sortData={this.props.sortData}
                  onCSVClick={this.props.onCSVClick}
                  linkDate={this.getDate()}
                />
              </Pane>
              <Pane name="Performance">
                <Performance
                  workflow={this.props.workflow}
                />
              </Pane>
              <Pane name="Log">
                <Log
                  resource={`workflows/${this.props.workflow.id}`}
                  location={this.props.location}
                />
              </Pane>
              <Pane name="Code">
                <Code
                  data={this.props.workflow.lib}
                  heightUpdater={this.getHeight}
                />
              </Pane>
              <Pane name="Info">
                <InfoTable
                  object={this.props.workflow}
                  omit={[
                    'options', 'lib', 'stepmap', 'segment', 'steps', 'stepseg',
                    'stepinfo', 'wffuncs', 'groups', 'alerts', 'exec_count', 'autostart',
                    'has_alerts', 'TOTAL', 'timestamp', 'id', 'normalizedName',
                  ].concat(ORDER_STATES.map(os => os.name))}
                />
              </Pane>
              <Pane name="Mappers">
                <MappersTable mappers={this.props.workflow.mappers} />
              </Pane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
