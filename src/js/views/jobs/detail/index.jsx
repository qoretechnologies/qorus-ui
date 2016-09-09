import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';

import Header from './header';
import { DetailTab } from './tabs';
import Tabs, { Pane } from '../../../components/tabs';
import LibraryTab from '../../../components/library';
import { pureRender } from '../../../components/utils';
import actions from '../../../store/api/actions';
import LogTab from '../../workflows/detail/log_tab';


import { goTo } from '../../../helpers/router';

@pureRender
class Detail extends Component {
  /* TODO: get if errors are applicable for Jobs */
  static propTypes = {
    model: PropTypes.object.isRequired,
    tabId: PropTypes.string,
    location: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object,
    route: PropTypes.object,
    params: PropTypes.object,
  };

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
    const { model, tabId } = this.props;

    return (
      <article>
        <Header model={model} />
        <Tabs
          className="pane__tabs"
          active={tabId}
          tabChange={::this.changeTab}
        >
          <Pane name="Detail">
            <DetailTab model={model} />
          </Pane>
          <Pane name="Library">
            <LibraryTab library={model.lib || {}} />
          </Pane>
          <Pane name="Log">
            <LogTab
              resource={`jobs/${model.id}`}
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

const fetchLibSourceOnMountAndOnChange = lifecycle({
  componentWillMount() {
    const { model, fetchLibSources } = this.props;
    fetchLibSources(model);
  },

  componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel, fetchLibSources } = nextProps;

    if (nextModel.id !== model.id) {
      fetchLibSources(nextModel);
    }
  },
});

export default compose(
  connect(
    () => ({}),
    { fetchLibSources: actions.jobs.fetchLibSources }
  ),
  fetchLibSourceOnMountAndOnChange
)(Detail);
