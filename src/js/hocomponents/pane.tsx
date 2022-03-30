/* @flow */
import PropTypes from 'prop-types';
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import omit from 'lodash/omit';
import upperFirst from 'lodash/upperFirst';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import isArray from 'lodash/isArray';

import actions from '../store/api/actions';
import withTabs from './withTabs';
import queryControl from './queryControl';
import { functionOrStringExp } from '../helpers/functions';
import mapProps from 'recompose/mapProps';
import Flex from '../components/Flex';

/**
 * A high-order component that provides a side panel
 * if a "paneId" URL query is present.
 * @param Pane - The Pane component
 * @param propNames - Props that the Pane component receives
 * @param defaultTab - If the panel has tab, which one is displayed by default
 */
export default (
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  Pane: ReactClass<*>,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  propNames: ?Array<string>,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  defaultTab: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  resource: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  paneQuery: ?string
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  const paneTabQueryName = paneQuery ? `${paneQuery}Tab` : 'paneTab';
  const paneQueryName = paneQuery || 'paneId';

  class ComponentWithPanel extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
      location: PropTypes.object,
    };

    props: {
      storage: Object,
      storePaneSize: Function,
      location: Object,
      username: string,
      width?: number,
      tabQuery?: string,
      changeTabQuery: Function,
    } = this.props;

    handleClose: Function = (
      omitQueries: Array<String> | Object = []
    ): void => {
      const { query, pathname }: { query: Object, pathname: string } =
        this.props.location || this.context.location;

      // Event object can be received as the first parameter
      const omitQueriesArray =
        omitQueries && isArray(omitQueries) ? omitQueries : [];

      const newQuery: Object = omit(query, [
        paneTabQueryName,
        paneQueryName,
        // @ts-expect-error ts-migrate(2461) FIXME: Type 'Object' is not an array type.
        ...omitQueriesArray,
      ]);

      this.context.router.push({
        pathname,
        query: newQuery,
      });
    };

    handleOpen: Function = (
      paneId: number | string = 'open',
      openOnTab: string
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleTabChange' does not exist on type ... Remove this comment to see the full error message
      const { tabQuery, handleTabChange, changePaneIdQuery } = this.props;
      // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'paneIdQuery' does not exist on type '{ s... Remove this comment to see the full error message
      const { storage, paneIdQuery, tabQuery, width } = this.props;

      if (!paneIdQuery || paneIdQuery === '') return undefined;

      const props: Object = propNames
        ? propNames.reduce(
            (obj, cur) => Object.assign(obj, { [cur]: this.props[cur] }),
            {}
          )
        : {};

      // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'paneIdQuery' does not exist on type '{ s... Remove this comment to see the full error message
      const { paneIdQuery, tabQuery } = this.props;

      return (
        <Flex className="floating-pane-wrapper">
          <Component
            {...this.props}
            openPane={this.handleOpen}
            closePane={this.handleClose}
            paneId={paneIdQuery}
            paneTab={tabQuery}
          />
          {this.renderPane()}
        </Flex>
      );
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
  ComponentWithPanel.displayName = wrapDisplayName(Component, 'hasPane');

  return compose(
    connect(
      (state: Object) => ({
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
        username: state.api.currentUser.data.username,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
        storage: state.api.currentUser.data.storage || {},
      }),
      {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
        storePaneSize: actions.currentUser.storePaneSize,
      }
    ),
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    withTabs(defaultTab, paneTabQueryName),
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
    queryControl(paneQueryName),
    mapProps(
      (props): Object => ({
        paneIdQuery: props[`${functionOrStringExp(paneQuery, props)}Query`],
        changePaneIdQuery:
          props[
            `change${upperFirst(functionOrStringExp(paneQuery, props))}Query`
          ],
        ...props,
      })
    )
  )(ComponentWithPanel);
};
