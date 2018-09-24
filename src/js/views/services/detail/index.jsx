import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';

import Tabs, { Pane } from 'components/tabs';
import DetailPane from 'components/pane';
import Box from 'components/box';
import { DetailTab, MethodsTab, ResourceTab } from './tabs';
import Code from 'components/code';
import LogTab from '../../workflows/detail/log_tab';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';
import actions from 'store/api/actions';
import titleManager from '../../../hocomponents/TitleManager';

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
    data: service.lib
      ? Object.assign(service.lib, { methods: service.methods })
      : {},
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
    const { service, paneTab, systemOptions } = this.props;

    if (!service) return null;

    return (
      <DetailPane
        width={this.props.width || 550}
        onClose={this.handlePaneClose}
        onResize={this.props.onResize}
        title={this.props.service.normalizedName}
      >
        <Box top>
          <Tabs
            id="servicePane"
            active={paneTab}
            onChange={this.props.changePaneTab}
          >
            <Pane name="Detail">
              <DetailTab
                key={service.name}
                service={service}
                systemOptions={systemOptions}
              />
            </Pane>
            <Pane name="Code">
              <Code
                data={this.props.data}
                heightUpdater={this.getHeight}
                location={this.props.location}
              />
            </Pane>
            <Pane name="Methods">
              <MethodsTab service={service} />
            </Pane>
            <Pane name="Log">
              <LogTab
                resource={`services/${service.id}`}
                location={this.props.location}
              />
            </Pane>
            <Pane name="Mappers">
              <MappersTable mappers={service.mappers} />
            </Pane>
            <Pane name="Valuemaps">
              <Valuemaps vmaps={service.vmaps} />
            </Pane>
            <Pane name="Resources">
              <ResourceTab
                resources={service.resources}
                resourceFiles={service.resource_files}
              />
            </Pane>
            <Pane name="Releases">
              <Releases
                component={service.name}
                compact
                key={service.name}
                location={this.props.location}
              />
            </Pane>
          </Tabs>
        </Box>
      </DetailPane>
    );
  }
}
