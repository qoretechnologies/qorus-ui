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
 */
export default (
  Pane: ReactClass<*>,
  propNames: Array<string>,
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
      const newQuery: Object = omit(query, 'paneId');

      this.context.router.push({
        pathname,
        query: newQuery,
      });
    };

    handleOpen: Function = (id): void => {
      changeQuery(
        this.context.router,
        this.props.location,
        'paneId',
        id
      );
    };

    renderPane() {
      const { query } = this.props.location;

      if (!query || !query.paneId) return undefined;

      const props: Object = propNames.reduce((obj, cur) => (
        Object.assign(obj, { [cur]: this.props[cur] })
      ), {});

      return (
        <Pane
          {...props}
          onClose={this.handleClose}
          paneId={query.paneId}
        />
      );
    }

    render() {
      return (
        <div>
          <Component
            {...this.props}
            openPane={this.handleOpen}
          />
          { this.renderPane() }
        </div>
      );
    }
  }

  ComponentWithPanel.displayName = wrapDisplayName(Component, 'hasPane');

  return ComponentWithPanel;
};

