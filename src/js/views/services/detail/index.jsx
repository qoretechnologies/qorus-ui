import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

import DetailPane from 'components/pane';
import Box from 'components/box';
import { DetailTab, MethodsTab, ResourceTab } from './tabs';
import Code from '../../../components/code';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import LogContainer from '../../../containers/log';
import Releases from '../../../containers/releases';
import actions from 'store/api/actions';
import titleManager from '../../../hocomponents/TitleManager';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject } from '../../../utils';
import InfoTable from '../../../components/info_table';

@connect(
  (state, props) => ({
    service: state.api.services.data.find(
      service => service.id === parseInt(props.paneId, 10)
    ),
  }),
  {
    load: actions.services.fetchLibSources,
  }
)
@mapProps(
  ({ service, ...rest }: Object): Object => ({
    methods: service.lib
      ? service.class_based
        ? service.methods.map(
            (method: Object): Object => ({
              ...method,
              ...{ body: service.class_source.class_source },
            })
          )
        : service.methods
      : {},
    service,
    ...rest,
  })
)
@mapProps(
  ({ service, methods, ...rest }: Object): Object => ({
    data: service.lib ? Object.assign(service.lib, { methods }) : {},
    service,
    methods,
    ...rest,
  })
)
@mapProps(
  ({ data, service, ...rest }: Object): Object => ({
    data: service.class_based
      ? {
          ...{
            code: [
              {
                name: 'Service code',
                body: service.class_source.class_source,
              },
            ],
          },
          ...data,
        }
      : data,
    service,
    ...rest,
  })
)
@titleManager(({ service }): string => service.name, 'Services', 'prefix')
export default class ServicesDetail extends Component {
  static propTypes = {
    service: PropTypes.object,
    systemOptions: PropTypes.array.isRequired,
    paneTab: PropTypes.string,
    paneId: PropTypes.string,
    onClose: PropTypes.func,
    location: PropTypes.object,
    changePaneTab: PropTypes.func,
    width: PropTypes.number,
    onResize: PropTypes.func,
    data: PropTypes.object,
  };

  componentWillMount() {
    this.props.load(this.props.paneId);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.paneId !== nextProps.paneId) {
      this.props.load(nextProps.paneId);
    }
  }

  render() {
    const { service, paneTab, systemOptions, methods } = this.props;
    const loaded: boolean = service && 'author' in service;

    if (!loaded) {
      return null;
    }

    const configItems: Array<Object> = rebuildConfigHash(service);

    return (
      <DetailPane
        width={this.props.width || 600}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
        title={`Service ${service.id}`}
        tabs={{
          tabs: [
            'Detail',
            'Code',
            { title: 'Methods', suffix: `(${size(methods)})` },
            'Log',
            { title: 'Mappers', suffix: `(${size(service.mappers)})` },
            { title: 'Value maps', suffix: `(${size(service.vmaps)})` },
            'Resources',
            'Releases',
            {
              title: 'Config',
              suffix: `(${countArrayItemsInObject(configItems)})`,
            },
            'Info',
          ],
          queryIdentifier: 'paneTab',
        }}
      >
        <SimpleTabs activeTab={paneTab}>
          <SimpleTab name="detail">
            <DetailTab
              key={service.name}
              service={service}
              systemOptions={systemOptions}
            />
          </SimpleTab>
          <SimpleTab name="code">
            <Box top fill>
              <Code data={this.props.data} location={this.props.location} />
            </Box>
          </SimpleTab>
          <SimpleTab name="methods">
            <MethodsTab service={service} methods={this.props.methods} />
          </SimpleTab>
          <SimpleTab name="log">
            <Box top fill>
              <LogContainer
                resource={`services/${service.id}`}
                location={this.props.location}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="mappers">
            <Box top fill noPadding>
              <MappersTable mappers={service.mappers} />
            </Box>
          </SimpleTab>
          <SimpleTab name="value maps">
            <Box top fill noPadding>
              <Valuemaps vmaps={service.vmaps} />
            </Box>
          </SimpleTab>
          <SimpleTab name="resources">
            <Box top fill>
              <ResourceTab
                resources={service.resources}
                resourceFiles={service.resource_files}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="releases">
            <Box top fill>
              <Releases
                component={service.name}
                compact
                key={service.name}
                location={this.props.location}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="config">
            <Box top fill scrollY>
              <ConfigItemsTable items={configItems} intrf="services" />
            </Box>
          </SimpleTab>
          <SimpleTab name="info">
            <Box top fill>
              <InfoTable object={service} />
            </Box>
          </SimpleTab>
        </SimpleTabs>
      </DetailPane>
    );
  }
}
