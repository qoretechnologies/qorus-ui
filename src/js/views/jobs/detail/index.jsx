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
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import DetailPane from '../../../components/pane';
import Box from '../../../components/box';
import Code from '../../../components/code';
import Loader from '../../../components/loader';
import actions from '../../../store/api/actions';
import LogTab from '../../workflows/detail/log_tab';
import show from '../../../hocomponents/show-if-passed';
import titleManager from '../../../hocomponents/TitleManager';
import Container from '../../../components/container';

const Detail = ({
  location,
  paneTab,
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
  onClose: Function,
  paneId: string | number,
  getHeight: Function,
  lib: Object,
  width: number,
  onResize: Function,
  isTablet: boolean,
}): React.Element<*> => (
  <DetailPane
    width={width || 600}
    onResize={onResize}
    onClose={onClose}
    title={`Job ${model.id}`}
    tabs={{
      tabs: ['Detail', 'Mappers', 'Valuemaps', 'Releases', 'Code', 'Log'],
      queryIdentifier: 'paneTab',
    }}
  >
    <Box top>
      <Container fill>
        <SimpleTabs activeTab={paneTab}>
          <SimpleTab name="detail">
            <DetailTab key={model.name} model={model} isTablet={isTablet} />
          </SimpleTab>
          <SimpleTab name="code">
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
          </SimpleTab>
          <SimpleTab name="log">
            <LogTab resource={`jobs/${model.id}`} location={location} />
          </SimpleTab>
          <SimpleTab name="mappers">
            <MappersTable mappers={model.mappers} />
          </SimpleTab>
          <SimpleTab name="valuemaps">
            <Valuemaps vmaps={model.vmaps} />
          </SimpleTab>
          <SimpleTab name="releases">
            <Releases
              component={model.name}
              compact
              key={model.name}
              location={location}
            />
          </SimpleTab>
        </SimpleTabs>
      </Container>
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
