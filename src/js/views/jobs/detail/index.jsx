/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import pure from 'recompose/pure';

import Header from './header';
import { DetailTab, AlertsTab } from './tabs';
import Tabs, { Pane } from '../../../components/tabs';
import LibraryTab from '../../../components/library';
import actions from '../../../store/api/actions';
import LogTab from '../../workflows/detail/log_tab';


import { goTo } from '../../../helpers/router';

const Detail = ({
  location,
  tabId,
  model,
  changeTab,
}: {
  location: Object,
  tabId: string,
  model: Object,
  changeTab: Function,
}): React.Element<*> => (
  <article>
    <Header model={model} />
    <Tabs
      className="pane__tabs"
      active={tabId}
      tabChange={changeTab}
    >
      <Pane name="Detail">
        <DetailTab model={model} />
      </Pane>
      <Pane name="Library">
        <LibraryTab
          library={model.lib || {}}
          mainCode={model.code || undefined}
        />
      </Pane>
      <Pane name="Log">
        <LogTab
          resource={`jobs/${model.id}`}
          location={location}
        />
      </Pane>
      <Pane name="Alerts">
        <AlertsTab alerts={model.alerts} />
      </Pane>
      <Pane name="Mappers">
        <p>Not implemented yet</p>
      </Pane>
    </Tabs>
  </article>
);

const getRouterContext = getContext({
  router: PropTypes.object,
  route: PropTypes.object,
  params: PropTypes.object,
});

const allowChangeTab = mapProps(({
  router,
  route,
  params,
  ...other,
}: {
  router: Object,
  route: Object,
  params: Object,
  other: Object,
}): Object => ({
  router,
  route,
  params,
  ...other,
  changeTab: (tabId: string): void => goTo(router, 'jobs', route.path, params, { tabId }),
}));

const fetchLibSourceOnMountAndOnChange = lifecycle({
  componentWillMount() {
    const { model, fetchLibSources } = this.props;
    fetchLibSources(model);
  },

  componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel, fetchLibSources } = nextProps;

    if (nextModel.id !== model.id) {
      fetchLibSources(nextModel);
    }
  },
});

const fetchCodeOnMountAndOnChange = lifecycle({
  componentWillMount() {
    const { model, fetchCode } = this.props;
    fetchCode(model);
  },

  componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel, fetchCode } = nextProps;

    if (nextModel.id !== model.id) {
      fetchCode(nextModel);
    }
  },
});

export default compose(
  connect(
    () => ({}),
    {
      fetchLibSources: actions.jobs.fetchLibSources,
      fetchCode: actions.jobs.fetchCode,
    }
  ),
  getRouterContext,
  pure,
  allowChangeTab,
  fetchLibSourceOnMountAndOnChange,
  fetchCodeOnMountAndOnChange,
)(Detail);
