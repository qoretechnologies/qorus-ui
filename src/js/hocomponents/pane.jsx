/* @flow */
import React, { PropTypes } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import omit from 'lodash/omit';

import { changeQuery } from '../helpers/router';

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
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class ComponentWithPanel extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
    };

    props: {
      location: Object,
    };

    handleClose: Function = (): void => {
      const { query, pathname }: { query: Object, pathname: string } = this.props.location;
      const newQuery: Object = omit(query, 'paneId', 'paneTab');

      this.context.router.push({
        pathname,
        query: newQuery,
      });
    };

    handleOpen: Function = (paneId: number): void => {
      const query = defaultTab ? { paneId, paneTab: defaultTab } : { paneId };

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

    renderPane() {
      const { query } = this.props.location;

      if (!query || !query.paneId) return undefined;

      const props: Object = propNames ? propNames.reduce((obj, cur) => (
        Object.assign(obj, { [cur]: this.props[cur] })
      ), {}) : {};

      return (
        <Pane
          {...props}
          onClose={this.handleClose}
          changePaneTab={this.handleTabChange}
          paneId={query.paneId}
          paneTab={query.paneTab}
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

  return ComponentWithPanel;
};

