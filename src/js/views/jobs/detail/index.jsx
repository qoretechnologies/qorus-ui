/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';

import { DetailTab } from './tabs';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';
import Tabs, { Pane } from '../../../components/tabs';
import DetailPane from '../../../components/pane';
import Box from '../../../components/box';
import Code from '../../../components/code';
import Loader from '../../../components/loader';
import actions from '../../../store/api/actions';
import LogTab from '../../workflows/detail/log_tab';
import show from '../../../hocomponents/show-if-passed';
import titleManager from '../../../hocomponents/TitleManager';

const Detail = ({
  location,
  paneTab,
  changePaneTab,
  onClose,
  model,
  getHeight,
  lib,
  width,
  onResize,
  isTablet,
}: {
  location: Object,
  paneTab: string,
  model: Object,
  changePaneTab: Function,
  onClose: Function,
  paneId: string | number,
  getHeight: Function,
  lib: Object,
  width: number,
  onResize: Function,
  isTablet: boolean,
}): React.Element<*> => (
  <DetailPane
    name="jobs-detail-pane"
    width={width || 550}
    onResize={onResize}
    onClose={onClose}
    title={model.normalizedName}
  >
    <Box top>
      <Tabs id="jobsPane" active={paneTab} onChange={changePaneTab}>
        <Pane name="Detail">
          <DetailTab key={model.name} model={model} isTablet={isTablet} />
        </Pane>
        <Pane name="Code">
          {model.code ? (
            <Code
              selected={{
                name: `code - ${lib.code[0].name}`,
                code: lib.code[0].body,
                item: {
                  name: lib.code[0].name,
                },
              }}
              data={lib || {}}
              heightUpdater={getHeight}
              location={location}
            />
          ) : (
            <Loader />
          )}
        </Pane>
        <Pane name="Log">
          <LogTab resource={`jobs/${model.id}`} location={location} />
        </Pane>
        <Pane name="Mappers">
          <MappersTable mappers={model.mappers} />
        </Pane>
        <Pane name="Valuemaps">
          <Valuemaps vmaps={model.vmaps} />
        </Pane>
        <Pane name="Releases">
          <Releases
            component={model.name}
            compact
            key={model.name}
            location={location}
          />
        </Pane>
      </Tabs>
    </Box>
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
      model: state.api.jobs.data.find(
        (job: Object): boolean => job.id === parseInt(props.paneId, 10)
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
  mapProps(
    (props: Object): Object => ({
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
    })
  ),
  withHandlers({
    getHeight: (): Function => (): number => {
      const { top } = document
        .querySelector('.pane__content .container-resizable')
        .getBoundingClientRect();

      return window.innerHeight - top - 60;
    },
  }),
  titleManager(({ model }): string => model.name, 'Jobs', 'prefix')
)(Detail);
