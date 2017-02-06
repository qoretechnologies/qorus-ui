/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';

import Header from './header';
import { DetailTab } from './tabs';
import MappersTable from '../../../containers/mappers';
import Tabs, { Pane } from '../../../components/tabs';
import DetailPane from '../../../components/pane';
import Code from '../../../components/code';
import Loader from '../../../components/loader';
import actions from '../../../store/api/actions';
import LogTab from '../../workflows/detail/log_tab';
import show from '../../../hocomponents/show-if-passed';

const Detail = ({
  location,
  paneTab,
  changePaneTab,
  onClose,
  model,
  getHeight,
  lib,
}: {
  location: Object,
  paneTab: string,
  model: Object,
  changePaneTab: Function,
  onClose: Function,
  paneId: string | number,
  getHeight: Function,
  lib: Object,
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
          {model.code ? (
            <Code
              selected={{
                name: `code - ${lib.code[0].name}`,
                code: lib.code[0].body,
              }}
              data={lib || {}}
              heightUpdater={getHeight}
            />
          ) : (
            <Loader />
          )}
        </Pane>
        <Pane name="Log">
          <LogTab
            resource={`jobs/${model.id}`}
            location={location}
          />
        </Pane>
        <Pane name="Mappers">
          <MappersTable mappers={model.mappers} />
        </Pane>
      </Tabs>
    </article>
  </DetailPane>
);

const fetchLibSourceOnMountAndOnChange = lifecycle({
  async componentWillMount() {
    const { model, fetchLibSources } = this.props;
    await fetchLibSources(model);
  },

  async componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel, fetchLibSources } = nextProps;

    if (nextModel.id !== model.id) {
      await fetchLibSources(nextModel);
    }
  },
});

export default compose(
  connect(
    (state: Object, props: Object): Object => ({
      jobsLoaded: state.api.jobs.sync,
      model: state.api.jobs.data.find((job: Object): boolean => (
        job.id === parseInt(props.paneId, 10))
      ),
    }),
    {
      fetchLibSources: actions.jobs.fetchLibSources,
      fetchCode: actions.jobs.fetchCode,
    }
  ),
  show((props: Object) => props.jobsLoaded),
  pure,
  fetchLibSourceOnMountAndOnChange,
  mapProps((props: Object): Object => ({
    ...props,
    lib: {
      ...{
        code: [
          {
            name: 'Job code',
            body: props.model.code,
          },
        ],
      },
      ...props.model.lib,
    },
  })),
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
