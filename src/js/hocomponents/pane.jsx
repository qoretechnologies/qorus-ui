/* @flow */
import React, { PropTypes } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { changeQuery } from '../helpers/router';
import actions from '../store/api/actions';

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
  resource: ?string,
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
    };

    handleClose: Function = (omitQueries: Array<String> = []): void => {
      const { query, pathname }: { query: Object, pathname: string } = this.props.location;
      const newQuery: Object = omit(query, ['paneTab', 'paneId', ...omitQueries]);

      this.context.router.push({
        pathname,
        query: newQuery,
      });
    };

    handleOpen: Function = (paneId: number, openOnTab: string): void => {
      const defTab = openOnTab || defaultTab;
      const query = defTab ? { paneId, paneTab: defTab } : { paneId };

      changeQuery(
        this.context.router,
        this.props.location,
        query,
      );
    };

    handleTabChange: Function = (paneTab: number | string): void => {
      changeQuery(
        this.context.router,
        this.props.location,
        {
          paneTab,
        }
      );
    };

    handlePaneSizeChange: Function = (width: number): void => {
      if (resource) {
        const { query: { paneId } } = this.props.location;

        this.props.storePaneSize(
          resource,
          paneId,
          width,
          this.props.username
        );
      }
    };

    renderPane() {
      const { storage, location: { query }, width } = this.props;

      if (!query || !query.paneId) return undefined;

      const props: Object = propNames ? propNames.reduce((obj, cur) => (
        Object.assign(obj, { [cur]: this.props[cur] })
      ), {}) : {};

      const newWidth: ?number = storage[resource] ? storage[resource][query.paneId] : width;

      return (
        <Pane
          {...props}
          onClose={this.handleClose}
          changePaneTab={this.handleTabChange}
          paneId={query.paneId}
          paneTab={query.paneTab}
          onResize={this.handlePaneSizeChange}
          width={newWidth}
        />
      );
    }

    render() {
      const { query } = this.props.location;

      return (
        <div>
          <Component
            {...this.props}
            openPane={this.handleOpen}
            paneId={query.paneId}
            paneTab={query.paneTab}
          />
          { this.renderPane() }
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
    )
  )(ComponentWithPanel);
};
