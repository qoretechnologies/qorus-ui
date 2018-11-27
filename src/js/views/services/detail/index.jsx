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
            <SimpleTabs activeTab={paneTab}>
              <SimpleTab name="detail">
                <DetailTab
                  key={service.name}
                  service={service}
                  systemOptions={systemOptions}
                />
              </SimpleTab>
              <SimpleTab name="code">
                <Container fill>
                  <Code
                    data={this.props.data}
                    heightUpdater={this.getHeight}
                    location={this.props.location}
                  />
                </Container>
              </SimpleTab>
              <SimpleTab name="methods">
                <Container fill>
                  <MethodsTab service={service} methods={this.props.methods} />
                </Container>
              </SimpleTab>
              <SimpleTab name="log">
                <Container fill>
                  <LogTab
                    resource={`services/${service.id}`}
                    location={this.props.location}
                  />
                </Container>
              </SimpleTab>
              <SimpleTab name="mappers">
                <Container fill>
                  <MappersTable mappers={service.mappers} />
                </Container>
              </SimpleTab>
              <SimpleTab name="value maps">
                <Container fill>
                  <Valuemaps vmaps={service.vmaps} />
                </Container>
              </SimpleTab>
              <SimpleTab name="resources">
                <Container fill>
                  <ResourceTab
                    resources={service.resources}
                    resourceFiles={service.resource_files}
                  />
                </Container>
              </SimpleTab>
              <SimpleTab name="releases">
                <Container fill>
                  <Releases
                    component={service.name}
                    compact
                    key={service.name}
                    location={this.props.location}
                  />
                </Container>
              </SimpleTab>
            </SimpleTabs>
          </Box>
        )}
      </DetailPane>
    );
  }
}
