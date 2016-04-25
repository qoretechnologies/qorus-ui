import React, { Component, PropTypes } from 'react';
import Tabs, { Pane } from 'components/tabs';
import { default as Header } from './header';
// import { DetailTab, LibraryTab, LogTab } from './tabs';
import { DetailTab } from './tabs';
import LibraryTab from 'components/library';
import LogTab from 'components/log';

import { pureRender } from 'components/utils';


import { goTo } from '../../../helpers/router';
import actions from 'store/api/actions';

@pureRender
export default class Detail extends Component {
  /* TODO: get if errors are applicable for Jobs */
  static propTypes = {
    model: PropTypes.object.isRequired,
    // errors: PropTypes.array.isRequired,
    systemOptions: PropTypes.array.isRequired,
    // globalErrors: PropTypes.array.isRequired,
    tabId: PropTypes.string,
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
    if (this.state && this.state.lastModelId === props.model.id) {
      return;
    }

    this.setState({ lastModelId: props.model.id });

    // this.context.dispatch(
    //   actions.errors.fetch(`service/${props.service.id}`)
    // );

    this.context.dispatch(
      actions.jobs.fetchLibSources(props.model)
    );
  }


  changeTab(tabId) {
    goTo(
      this.context.router,
      'jobs',
      this.context.route.path,
      this.context.params,
      { tabId }
    );
  }


  render() {
    const { model, tabId, systemOptions } = this.props;

    if (!model) return null;

    return (
      <article>
        <Header model={model} />
        <Tabs
          className="pane__tabs"
          active={tabId}
          tabChange={::this.changeTab}
        >
          <Pane name="Detail">
            <DetailTab model={model} systemOptions={systemOptions} />
          </Pane>
          <Pane name="Library">
            <LibraryTab library={model.lib || {}} />
          </Pane>
          <Pane name="Log">
            <LogTab model={model} resource="jobs" />
          </Pane>
          <Pane name="Mappers">
            <p>Not implemented yet</p>
          </Pane>
        </Tabs>
      </article>
    );
  }
}
