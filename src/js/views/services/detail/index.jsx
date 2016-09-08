import React, { Component, PropTypes } from 'react';
import Tabs, { Pane } from 'components/tabs';
import ServicesHeader from './header';
import { DetailTab, MethodsTab } from './tabs';
import LibraryTab from 'components/library';
import LogTab from '../../workflows/detail/log_tab';

import { pureRender } from 'components/utils';


import { goTo } from '../../../helpers/router';
import actions from 'store/api/actions';

@pureRender
export default class ServicesDetail extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    tabId: PropTypes.string,
    location: PropTypes.func,
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
          <Pane name="Library">
            <LibraryTab library={service.lib || {}} />
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
            <p>Not implemented yet</p>
          </Pane>
        </Tabs>
      </article>
    );
  }
}
