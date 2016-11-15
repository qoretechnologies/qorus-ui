/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';

import Header from './header';
import { DetailTab } from './tabs';
import AlertsTable from '../../../components/alerts_table';
import MappersTable from '../../../containers/mappers';
import Tabs, { Pane } from '../../../components/tabs';
import DetailPane from '../../../components/pane';
import Code from '../../../components/code';
import actions from '../../../store/api/actions';
import LogTab from '../../workflows/detail/log_tab';

const Detail = ({
  location,
  paneTab,
  changePaneTab,
  onClose,
  model,
  getHeight,
}: {
  location: Object,
  paneTab: string,
  model: Object,
  changePaneTab: Function,
  onClose: Function,
  paneId: string | number,
  getHeight: Function,
}): React.Element<*> => (
  <DetailPane
    name="jobs-detail-pane"
    width={550}
    onClose={onClose}
  >
    <article>
      <Header model={model} />
      <Tabs
        className="pane__tabs"
        active={paneTab}
        tabChange={changePaneTab}
      >
        <Pane name="Detail">
          <DetailTab model={model} />
        </Pane>
        <Pane name="Code">
          <Code
            data={model.lib || {}}
            heightUpdater={getHeight}
          />
        </Pane>
        <Pane name="Log">
          <LogTab
            resource={`jobs/${model.id}`}
            location={location}
          />
        </Pane>
        <Pane name="Alerts">
          <AlertsTable alerts={model.alerts} />
        </Pane>
        <Pane name="Mappers">
          <MappersTable mappers={model.mappers} />
        </Pane>
      </Tabs>
    </article>
  </DetailPane>
);

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
    (state: Object, props: Object): Object => ({
      model: state.api.jobs.data.find((job: Object): boolean => (
        job.id === parseInt(props.paneId, 10))
      ),
    }),
    {
      fetchLibSources: actions.jobs.fetchLibSources,
      fetchCode: actions.jobs.fetchCode,
    }
  ),
  pure,
  fetchLibSourceOnMountAndOnChange,
  fetchCodeOnMountAndOnChange,
  withHandlers({
    getHeight: (): Function => (): number => {
      const navbar = document.querySelector('.navbar').clientHeight;
      const paneHeader = document.querySelector('.pane__content .pane__header').clientHeight;
      const panetabs = document.querySelector('.pane__content .nav-tabs').clientHeight;
      const top = navbar + paneHeader + panetabs + 20;

      return window.innerHeight - top;
    },
  })
)(Detail);
