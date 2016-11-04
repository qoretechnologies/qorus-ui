import React, { Component, PropTypes } from 'react';

import Tabs, { Pane } from 'components/tabs';
import ServicesHeader from './header';
import { DetailTab, MethodsTab } from './tabs';
import Code from 'components/code';
import LogTab from '../../workflows/detail/log_tab';
import { pureRender } from 'components/utils';
import { goTo } from '../../../helpers/router';
import MappersTable from '../../../containers/mappers';
import actions from 'store/api/actions';

@pureRender
export default class ServicesDetail extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    tabId: PropTypes.string,
    location: PropTypes.object,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
    router: PropTypes.object,
    route: PropTypes.object,
    params: PropTypes.object,
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

    this.context.dispatch(
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

  changeTab(tabId) {
    goTo(
      this.context.router,
      'services',
      this.context.route.path,
      this.context.params,
      { tabId }
    );
  }


  render() {
    const { service, tabId, systemOptions } = this.props;

    if (!service) return null;

    return (
      <article>
        <ServicesHeader service={service} />
        <Tabs
          className="pane__tabs"
          active={tabId}
          tabChange={::this.changeTab}
        >
          <Pane name="Detail">
            <DetailTab service={service} systemOptions={systemOptions} />
          </Pane>
          <Pane name="Code">
            <Code
              data={service.lib || {}}
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
    );
  }
}
