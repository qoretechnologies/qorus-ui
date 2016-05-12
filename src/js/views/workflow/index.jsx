import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Header from './header';
import Tabs, { Pane } from '../../components/tabs';

import { goTo } from '../../helpers/router';

import actions from 'store/api/actions';

const workflowSelector = state => state.api.workflows.data[0];

const selector = createSelector(
  [
    workflowSelector,
  ], (workflow) => ({
    workflow,
  })
);

@connect(selector)
export default class extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    workflow: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
  };

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
    };
  }

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(actions.workflows.fetch({}, id));
  }

  handleTabChange = (tabId) => {
    goTo(
      this.context.router,
      'workflow',
      this.props.route.path,
      this.props.params,
      { tabId }
    );
  };

  render() {
    if (!this.props.workflow) {
      return <h1> Loading </h1>;
    }

    return (
      <div>
        <Header
          data={this.props.workflow}
          tabId={this.props.params.tabId}
        />
        <div className="row">
          <div className="col-xs-12">
            <Tabs
              active={this.props.params.tabId}
              tabChange={this.handleTabChange}
            >
              <Pane name="List" />
              <Pane name="Performance" />
              <Pane name="Log" />
              <Pane name="Info" />
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
