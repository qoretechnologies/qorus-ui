/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

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
import { NonIdealState } from '@blueprintjs/core';
import InfoTable from '../../../components/info_table';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import ConfigItemsTable from '../../../components/ConfigItemsTable';

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
  configItems,
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
  configItems: Array<Object>,
}): React.Element<*> => (
  <DetailPane
    width={width || 600}
    onResize={onResize}
    onClose={onClose}
    title={`Job ${model.id}`}
    tabs={{
      tabs: [
        'Detail',
        'Process',
        { title: 'Mappers', suffix: `(${size(model.mappers)})` },
        { title: 'Value maps', suffix: `(${size(model.vmaps)})` },
        'Releases',
        { title: 'Config', suffix: `(${size(configItems)})` },
        'Log',
      ],
      queryIdentifier: 'paneTab',
    }}
  >
    <Box top>
      <SimpleTabs activeTab={paneTab}>
        <SimpleTab name="detail">
          <DetailTab key={model.name} model={model} isTablet={isTablet} />
        </SimpleTab>
        <SimpleTab name="code">
          <Container fill>
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
          </Container>
        </SimpleTab>

        {model.process ? (
          <SimpleTab name="process">
            <Container fill>
              <InfoTable
                object={{
                  ...model.process,
                  ...{ memory: model.process.priv_str },
                }}
                omit={['priv', 'rss', 'vsz', 'priv_str']}
              />
            </Container>
          </SimpleTab>
        ) : (
          <SimpleTab name="process">
            <Container fill>
              <NonIdealState
                title="Process unavailable"
                description="This job is not running under a process"
                visual="warning-sign"
              />
            </Container>
          </SimpleTab>
        )}
        <SimpleTab name="log">
          <Container fill>
            <LogTab resource={`jobs/${model.id}`} location={location} />
          </Container>
        </SimpleTab>
        <SimpleTab name="mappers">
          <Container fill>
            <MappersTable mappers={model.mappers} />
          </Container>
        </SimpleTab>
        <SimpleTab name="value maps">
          <Container fill>
            <Valuemaps vmaps={model.vmaps} />
          </Container>
        </SimpleTab>
        <SimpleTab name="releases">
          <Container fill>
            <Releases
              component={model.name}
              compact
              key={model.name}
              location={location}
            />
          </Container>
        </SimpleTab>
        <SimpleTab name="config">
          <Container fill>
            <ConfigItemsTable items={configItems} intrf="jobs" />
          </Container>
        </SimpleTab>
      </SimpleTabs>
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
      configItems: rebuildConfigHash(props.model.config, props.model.id),
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
