import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Tabs, { Pane } from 'components/tabs';
import DetailPane from 'components/pane';
import ServicesHeader from './header';
import { DetailTab, MethodsTab } from './tabs';
import Code from 'components/code';
import LogTab from '../../workflows/detail/log_tab';
import MappersTable from '../../../containers/mappers';
import actions from 'store/api/actions';

@connect(
  (state, props) => ({
    service: state.api.services.data.find((service) => service.id === parseInt(props.paneId, 10)),
  })
)
export default class ServicesDetail extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    paneTab: PropTypes.string,
    paneId: PropTypes.string,
    onClose: PropTypes.func,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    changePaneTab: PropTypes.func,
  };

  componentWillMount() {
    this.setState({ lastModelId: null });
    this.loadDetailedDataIfChanged(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadDetailedDataIfChanged(nextProps);
  }

  loadDetailedDataIfChanged(props) {
    if (this.state && this.state.lastModelId === props.service.id) {
      return;
    }

    this.setState({ lastModelId: props.service.id });

    this.props.dispatch(
      actions.services.fetchLibSources(props.service)
    );
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
        width={550}
        onClose={this.props.onClose}
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
                data={{ ...service.lib, ...{ methods: service.methods } } || {}}
                heightUpdater={this.getHeight}
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
          </Tabs>
        </article>
      </DetailPane>
    );
  }
}
