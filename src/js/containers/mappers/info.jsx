/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MapperDiagram from './diagram/index';
import actions from '../../store/api/actions';
import Loader from '../../components/loader';
import Alert from '../../components/alert';
import Author from '../../components/author';
import InfoTable from '../../components/info_table';
import Releases from '../releases';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Box from '../../components/box';
import Headbar from '../../components/Headbar';
import Flex from '../../components/Flex';
import withTabs from '../../hocomponents/withTabs';
import { SimpleTabs, SimpleTab } from '../../components/SimpleTabs';

const MapperInfo = ({
  mapper,
  location,
  tabQuery,
}: {
  mapper: Object,
  onBackClick: Function,
  location: Object,
  tabQuery: string,
}) => {
  if (!mapper) return <Loader />;

  return (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb>Mappers</Crumb>
          <Crumb>
            {mapper.name} v{mapper.version} ({mapper.mapperid})
          </Crumb>
          <CrumbTabs tabs={['Diagram', 'Releases', 'Info']} />
        </Breadcrumbs>
      </Headbar>
      <Box top fill>
        <SimpleTabs activeTab={tabQuery}>
          <SimpleTab name="diagram">
            <Flex scrollY>
              {!mapper.valid && (
                <Alert
                  bsStyle="danger"
                  title="Warning: This mapper contains an error and might not be
                    rendered correctly"
                >
                  {mapper.error}
                </Alert>
              )}
              <MapperDiagram mapper={mapper} />
            </Flex>
          </SimpleTab>
          <SimpleTab name="info">
            <Author model={mapper} />
            <InfoTable
              object={{
                type: mapper.type,
                description: mapper.desc,
                options: mapper.opts,
              }}
            />
          </SimpleTab>
          <SimpleTab name="releases">
            <Releases
              component={mapper.name}
              location={location}
              key={mapper.name}
              compact
            />
          </SimpleTab>
        </SimpleTabs>
      </Box>
    </Flex>
  );
};

const metaSelector = (state: Object): Object => state.api.mappers;
const stateSelector = (state, { mapperId }) =>
  state.api.mappers.data.find(item => item.mapperid === parseInt(mapperId, 10));

const mapperInfoSelector = createSelector(
  stateSelector,
  metaSelector,
  (mapper, meta) => ({
    mappers: meta,
    mapper,
  })
);

export default compose(
  pure,
  connect(
    mapperInfoSelector,
    {
      load: actions.mappers.fetch,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { load, mapperId } = this.props;

      load({}, mapperId);
    },
  }),
  withHandlers({
    onBackClick: (): Function => (ev: EventHandler): void => {
      ev.preventDefault();

      history.go(-1);
    },
  }),
  withTabs('diagram')
)(MapperInfo);
