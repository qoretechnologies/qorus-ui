import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import { flowRight } from 'lodash';

import { setTitle } from '../../helpers/document';
import sort from '../../hocomponents/sort';
import withPane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import { sortDefaults } from '../../constants/sort';
import actions from '../../store/api/actions';
import ServicesToolbar from './toolbar';
import ServicesTable from './table';
import ServicesDetail from './detail';
import { findBy } from '../../helpers/search';

const filterSearch = (search) => (services) =>
  findBy('name', search, services);

const servicesSelector = state => state.api.services;

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.service)
);

const searchSelector = (state, props) => props.location.query.q;

const collectionSelector = createSelector(
  [
    searchSelector,
    servicesSelector,
  ],
  (search, services) => flowRight(
    filterSearch(search)
  )(services.data)
);

const viewSelector = createSelector(
  [
    servicesSelector,
    systemOptionsSelector,
    collectionSelector,
  ],
  (services, systemOptions, collection) => ({
    meta: services,
    services: collection,
    systemOptions,
  }),
);

@compose(
  connect(viewSelector, actions.services),
  sync('meta', true, 'fetch'),
  sort('services', 'services', sortDefaults.services),
  withPane(
    ServicesDetail,
    [
      'systemOptions',
      'dispatch',
      'location',
    ],
    'detail'
  )
)
export default class Services extends Component {
  static propTypes = {
    location: PropTypes.object,
    instanceKey: PropTypes.string,
    services: PropTypes.array,
    info: PropTypes.object,
    systemOptions: PropTypes.array,
    params: PropTypes.object,
    route: PropTypes.object,
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
    sortData: PropTypes.object,
    onSortChange: PropTypes.func,
    paneId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    openPane: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  componentDidMount() {
    setTitle(`Services | ${this.context.getTitle()}`);
  }

  componentDidUpdate() {
    setTitle(`Services | ${this.context.getTitle()}`);
  }

  handleCSVClick = () => {
    this.props.onCSVClick(this.props.services, 'services');
  };

  /**
   * Handles the batch action calls like
   * enabling, disabling, reseting etc
   * of multiple workflows
   *
   * @param {String} type
   */
  handleBatchAction = (type) => {
    const selectedData = [];

    Object.keys(this.props.selectedData).forEach(w => {
      if (this.props.selectedData[w]) {
        selectedData.push(w);
      }
    });

    this.props.clearSelection();
    this.props[`${type}Batch`](selectedData);
  };

  render() {
    return (
      <div>
        <ServicesToolbar
          onFilterClick={this.props.onFilterClick}
          onSearchUpdate={this.props.onSearchChange}
          selected={this.props.selected}
          defaultSearchValue={this.props.location.query.q}
          batchAction={this.handleBatchAction}
          onAllClick={this.props.onAllClick}
          onNoneClick={this.props.onNoneClick}
          onInvertClick={this.props.onInvertClick}
          onCSVClick={this.handleCSVClick}
        />
        <ServicesTable
          initialFilter={this.props.filterFn}
          onDataFilterChange={this.props.onDataFilterChange}
          setSelectedData={this.props.setSelectedData}
          selectedData={this.props.selectedData}
          onSortChange={this.props.onSortChange}
          sortData={this.props.sortData}
          collection={this.props.services}
          activeRowId={parseInt(this.props.paneId, 10)}
          onDetailClick={this.props.openPane}
          onUpdateDone={actions.services.updateDone}
        />
      </div>
    );
  }
}
