/* @flow */
import React, { PropTypes } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { changeQuery } from '../helpers/router';
import actions from '../store/api/actions';
import withTabs from './withTabs';
import queryControl from './queryControl';

/**
 * A high-order component that provides a side panel
 * if a "paneId" URL query is present.
 * @param Pane - The Pane component
 * @param propNames - Props that the Pane component receives
 * @param defaultTab - If the panel has tab, which one is displayed by default
 */
export default (
  Pane: ReactClass<*>,
  propNames: ?Array<string>,
  defaultTab: ?string,
  resource: ?string
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class ComponentWithPanel extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
    };

    props: {
      storage: Object,
      storePaneSize: Function,
      location: Object,
      username: string,
      width?: number,
      tabQuery?: string,
      changeTabQuery: Function,
    };

    handleClose: Function = (omitQueries: Array<String> = []): void => {
      const {
        query,
        pathname,
      }: { query: Object, pathname: string } = this.props.location;
      const newQuery: Object = omit(query, [
        'paneTab',
        'paneId',
        ...omitQueries,
      ]);

      this.context.router.push({
        pathname,
        query: newQuery,
      });
    };

    handleOpen: Function = (paneId: number, openOnTab: string): void => {
      const { tabQuery, handleTabChange, changePaneIdQuery } = this.props;
      const openOn: ?string = openOnTab || tabQuery;

      changePaneIdQuery(paneId);

      if (openOn) {
        handleTabChange(openOn);
      }
    };

    handlePaneSizeChange: Function = (width: number): void => {
      if (resource) {
        this.props.storePaneSize(resource, width, this.props.username);
      }
    };

    renderPane() {
      const { storage, paneIdQuery, tabQuery, width } = this.props;

      if (!paneIdQuery || paneIdQuery === '') return undefined;

      const props: Object = propNames
        ? propNames.reduce(
            (obj, cur) => Object.assign(obj, { [cur]: this.props[cur] }),
            {}
          )
        : {};

      const newWidth: ?number = storage[resource]
        ? storage[resource].paneSize
        : width;

      return (
        <Pane
          {...props}
          onClose={this.handleClose}
          paneId={paneIdQuery}
          paneTab={tabQuery}
          onResize={this.handlePaneSizeChange}
          width={newWidth}
        />
      );
    }

    render() {
      const { paneIdQuery, tabQuery } = this.props;

      return (
        <div>
          <Component
            {...this.props}
            openPane={this.handleOpen}
            closePane={this.handleClose}
            paneId={paneIdQuery}
            paneTab={tabQuery}
          />
          {this.renderPane()}
        </div>
      );
    }
  }

  ComponentWithPanel.displayName = wrapDisplayName(Component, 'hasPane');

  return compose(
    connect(
      (state: Object) => ({
        username: state.api.currentUser.data.username,
        storage: state.api.currentUser.data.storage || {},
      }),
      {
        storePaneSize: actions.currentUser.storePaneSize,
      }
    ),
    withTabs(() => defaultTab, 'paneTab'),
    queryControl('paneId')
  )(ComponentWithPanel);
};
