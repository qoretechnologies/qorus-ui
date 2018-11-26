import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

import DetailPane from 'components/pane';
import Box from 'components/box';
import { DetailTab, MethodsTab, ResourceTab } from './tabs';
import Code from '../../../components/code';
import LogTab from '../../workflows/detail/log_tab';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';
import actions from 'store/api/actions';
import titleManager from '../../../hocomponents/TitleManager';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import Container from '../../../components/container';

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

  handlePaneClose = () => {
    this.props.onClose(['logQuery']);
  };

  getHeight: Function = (): number => {
    const { top } = document
      .querySelector('.pane__content .container-resizable')
      .getBoundingClientRect();

    return window.innerHeight - top - 60;
  };

  render() {
    const { service, paneTab, systemOptions, methods } = this.props;
    const loaded: boolean = service && service.created;

    return (
      <DetailPane
        width={this.props.width || 600}
        onClose={this.handlePaneClose}
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
          ],
          queryIdentifier: 'paneTab',
        }}
      >
        {loaded && (
          <Box top>
            <Container fill>
              <SimpleTabs activeTab={paneTab}>
                <SimpleTab name="detail">
                  <DetailTab
                    key={service.name}
                    service={service}
                    systemOptions={systemOptions}
                  />
                </SimpleTab>
                <SimpleTab name="code">
                  <Code
                    data={this.props.data}
                    heightUpdater={this.getHeight}
                    location={this.props.location}
                  />
                </SimpleTab>
                <SimpleTab name="methods">
                  <MethodsTab service={service} methods={this.props.methods} />
                </SimpleTab>
                <SimpleTab name="log">
                  <LogTab
                    resource={`services/${service.id}`}
                    location={this.props.location}
                  />
                </SimpleTab>
                <SimpleTab name="mappers">
                  <MappersTable mappers={service.mappers} />
                </SimpleTab>
                <SimpleTab name="value maps">
                  <Valuemaps vmaps={service.vmaps} />
                </SimpleTab>
                <SimpleTab name="resources">
                  <ResourceTab
                    resources={service.resources}
                    resourceFiles={service.resource_files}
                  />
                </SimpleTab>
                <SimpleTab name="releases">
                  <Releases
                    component={service.name}
                    compact
                    key={service.name}
                    location={this.props.location}
                  />
                </SimpleTab>
              </SimpleTabs>
            </Container>
          </Box>
        )}
      </DetailPane>
    );
  }
}
