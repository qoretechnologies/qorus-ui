import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';

import Tabs, { Pane } from 'components/tabs';
import DetailPane from 'components/pane';
import ServicesHeader from './header';
import { DetailTab, MethodsTab, ResourceTab } from './tabs';
import Code from 'components/code';
import LogTab from '../../workflows/detail/log_tab';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import actions from 'store/api/actions';

@connect(
  (state, props) => ({
    service: state.api.services.data.find((service) => service.id === parseInt(props.paneId, 10)),
  }), {
    load: actions.services.fetchLibSources,
  }
)
@mapProps(({ service, ...rest }: Object): Object => ({
  data: service.lib ? Object.assign(service.lib, { methods: service.methods }) : {},
  service,
  ...rest,
}))
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
  }

  getHeight: Function = (): number => {
    const navbar = document.querySelector('.navbar').clientHeight;
    const paneHeader = document.querySelector('.pane__content .pane__header').clientHeight;
    const panetabs = document.querySelector('.pane__content .nav-tabs').clientHeight;
    const top = navbar + paneHeader + panetabs + 20;

    return window.innerHeight - top;
  };

  render() {
    const { service, paneTab, systemOptions } = this.props;

    if (!service) return null;

    return (
      <DetailPane
        width={this.props.width || 550}
        onClose={this.handlePaneClose}
        onResize={this.props.onResize}
      >
        <article>
          <ServicesHeader service={service} />
          <Tabs
            className="pane__tabs"
            active={paneTab}
            tabChange={this.props.changePaneTab}
          >
            <Pane name="Detail">
              <DetailTab service={service} systemOptions={systemOptions} />
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
          </Tabs>
        </article>
      </DetailPane>
    );
  }
}
