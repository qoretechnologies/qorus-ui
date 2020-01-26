/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MapperDiagram from './diagram/index';
import MapperCreator from './new_diagram/index';
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
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import jsyaml from 'js-yaml';
import modal from '../../hocomponents/modal';
import DetailModal from './diagram/modals/DetailModal';

export const providers = {
  type: {
    name: 'type',
    url: 'dataprovider/types',
    suffix: '',
    recordSuffix: '/type',
    type: 'type',
  },
  connection: {
    name: 'connection',
    url: 'remote/user',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'connection',
  },
  remote: {
    name: 'remote',
    url: 'remote/qorus',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'remote',
  },
  datasource: {
    name: 'datasource',
    url: 'remote/datasources',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'datasource',
  },
};

const getProviderUrl = (options, fieldType) => {
  // Get the mapper options data
  const { type, name, path = '', subtype } = jsyaml.safeLoad(
    options[`mapper-${fieldType}`]
  );
  // Get the rules for the given provider
  const { url, suffix, recordSuffix } = providers[type];
  // Build the URL based on the provider type
  return `${url}/${name}${suffix}${path}${
    recordSuffix && !subtype ? recordSuffix : ''
  }`;
};

const MapperInfo = ({
  mapper,
  location,
  tabQuery,
  onInfoClick,
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
              <MapperCreator
                inputs={mapper.options.input}
                outputs={mapper.options.output}
                relations={mapper.fields}
                inputUrl={getProviderUrl(mapper.option_source, 'input')}
                outputUrl={getProviderUrl(mapper.option_source, 'output')}
                onInfoClick={name => onInfoClick(mapper.fields[name])}
              />
            </Flex>
          </SimpleTab>
          <SimpleTab name="info">
            <Author model={mapper} />
            <InfoTable
              object={{
                type: mapper.type,
                description: mapper.desc,
                options: mapper.options,
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
  hasInterfaceAccess('mappers', 'Mappers'),
  pure,
  connect(mapperInfoSelector, {
    load: actions.mappers.fetch,
  }),
  modal(),
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
    onInfoClick: ({ openModal, closeModal }) => data => {
      openModal(<DetailModal detail={data} onClose={closeModal} />);
    },
  }),
  withTabs('diagram')
)(MapperInfo);
