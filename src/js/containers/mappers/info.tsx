/* @flow */
import jsyaml from 'js-yaml';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import { createSelector } from 'reselect';
import Alert from '../../components/alert';
import Author from '../../components/author';
import Box from '../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Flex from '../../components/Flex';
import Headbar from '../../components/Headbar';
import InfoTable from '../../components/info_table';
import Loader from '../../components/loader';
import { SimpleTab, SimpleTabs } from '../../components/SimpleTabs';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import modal from '../../hocomponents/modal';
import withTabs from '../../hocomponents/withTabs';
import actions from '../../store/api/actions';
import Releases from '../releases';
import DetailModal from './diagram/modals/DetailModal';
import MapperCreator from './new_diagram/index';

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
  factory: {
    name: 'factory',
    url: 'dataprovider/factories',
    filter: null,
    inputFilter: 'supports_read',
    outputFilter: 'supports_create',
    suffix: '',
    namekey: 'name',
    desckey: 'desc',
    recordSuffix: '',
    requiresRecord: false,
    type: 'factory',
  },
};

const getProviderUrl = (options, fieldType) => {
  // Get the mapper options data
  const { type, name, path = '', subtype } = jsyaml.safeLoad(
    options[`mapper-${fieldType}`]
  );
  // Check if the type is factory
  if (type === 'factory') {
    // Return just the type
    return type;
  }
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'onInfoClick' does not exist on type '{ m... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            {mapper.name} v{mapper.version} ({mapper.mapperid})
          </Crumb>
          <CrumbTabs tabs={['Diagram', 'Releases', 'Info']} />
        </Breadcrumbs>
      </Headbar>
      <Box top fill>
        <SimpleTabs activeTab={tabQuery}>
          <SimpleTab name="diagram">
            <Flex scrollY>
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'valid' does not exist on type 'Object'.
              {!mapper.valid ? (
                <Alert
                  bsStyle="danger"
                  title="Warning: This mapper contains an error and can not be
                    rendered!"
                >
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
                  {mapper.error}
                </Alert>
              ) : (
                <MapperCreator
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
                  inputs={mapper.options.input || {}}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
                  outputs={mapper.options.output || {}}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
                  staticData={mapper.options?.context?.staticdata?.fields || {}}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'fields' does not exist on type 'Object'.
                  relations={mapper.fields}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'option_source' does not exist on type 'O... Remove this comment to see the full error message
                  inputUrl={getProviderUrl(mapper.option_source, 'input')}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'option_source' does not exist on type 'O... Remove this comment to see the full error message
                  outputUrl={getProviderUrl(mapper.option_source, 'output')}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'fields' does not exist on type 'Object'.
                  onInfoClick={(name) => onInfoClick(mapper.fields[name])}
                />
              )}
            </Flex>
          </SimpleTab>
          <SimpleTab name="info">
            <Author model={mapper} />
            <InfoTable
              object={{
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                type: mapper.type,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
                description: mapper.desc,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
                options: mapper.options,
              }}
            />
          </SimpleTab>
          <SimpleTab name="releases">
            <Releases
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              component={mapper.name}
              location={location}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              key={mapper.name}
              compact
            />
          </SimpleTab>
        </SimpleTabs>
      </Box>
    </Flex>
  );
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const metaSelector = (state: Object): Object => state.api.mappers;
const stateSelector = (state, { mapperId }) =>
  state.api.mappers.data.find(
    (item) => item.mapperid === parseInt(mapperId, 10)
  );

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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'mappers' does not exist on type '{}'.
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
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    onBackClick: (): Function => (ev: EventHandler): void => {
      ev.preventDefault();

      history.go(-1);
    },
    onInfoClick: ({ openModal, closeModal }) => (data) => {
      openModal(<DetailModal detail={data} onClose={closeModal} />);
    },
  }),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('diagram')
)(MapperInfo);
