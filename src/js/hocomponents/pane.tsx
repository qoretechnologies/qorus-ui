/* @flow */
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { functionOrStringExp } from '../helpers/functions';
import actions from '../store/api/actions';
import queryControl from './queryControl';
import withTabs from './withTabs';

/**
 * A high-order component that provides a side panel
 * if a "paneId" URL query is present.
 * @param Pane - The Pane component
 * @param propNames - Props that the Pane component receives
 * @param defaultTab - If the panel has tab, which one is displayed by default
 */
export default (
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
    Pane,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    propNames: Array<string>,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    defaultTab: string,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    resource: string,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    paneQuery?: string
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) => {
    const paneTabQueryName = paneQuery ? `${paneQuery}Tab` : 'paneTab';
    const paneQueryName = paneQuery || 'paneId';

    class ComponentWithPanel extends React.Component {
      static contextTypes = {
        router: PropTypes.object,
        location: PropTypes.object,
      };

      props: {
        storage: any;
        storePaneSize: Function;
        location: any;
        username: string;
        width?: number;
        tabQuery?: string;
        changeTabQuery: Function;
      } = this.props;

      state = {
        customProps: undefined,
      };

      handleClose: Function = (omitQueries: Array<String> | Object = []): void => {
        const { query, pathname }: { query: any; pathname: string } =
          this.props.location || this.context.location;

        // Event object can be received as the first parameter
        const omitQueriesArray = omitQueries && isArray(omitQueries) ? omitQueries : [];

        const newQuery: any = omit(query, [
          paneTabQueryName,
          paneQueryName,
          // @ts-ignore ts-migrate(2461) FIXME: Type 'Object' is not an array type.
          ...omitQueriesArray,
        ]);

        if (this.state.customProps) {
          this.setState({ customProps: undefined });
        }

        this.context.router.push({
          pathname,
          query: newQuery,
        });
      };

      handleOpen: Function = (
        paneId: number | string = 'open',
        openOnTab: string,
        customProps?: any
      ): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'handleTabChange' does not exist on type ... Remove this comment to see the full error message
        const { tabQuery, handleTabChange, changePaneIdQuery } = this.props;
        // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
        const openOn: string = openOnTab || tabQuery;

        changePaneIdQuery(paneId);

        if (customProps) {
          this.setState({ customProps });
        }

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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'paneIdQuery' does not exist on type '{ s... Remove this comment to see the full error message
        const { storage, paneIdQuery, tabQuery, width } = this.props;

        if (!paneIdQuery || paneIdQuery === '') return undefined;

        const props: any = propNames
          ? propNames.reduce((obj, cur) => Object.assign(obj, { [cur]: this.props[cur] }), {})
          : {};

        // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
        const newWidth: number = storage[resource] ? storage[resource].paneSize : width;

        return (
          <Pane
            {...props}
            {...(this.state.customProps || {})}
            onClose={this.handleClose}
            paneId={paneIdQuery}
            paneTab={tabQuery}
            onResize={this.handlePaneSizeChange}
            width={newWidth}
          />
        );
      }

      render() {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'paneIdQuery' does not exist on type '{ s... Remove this comment to see the full error message
        const { paneIdQuery, tabQuery } = this.props;

        return (
          <>
            <Component
              {...this.props}
              openPane={this.handleOpen}
              closePane={this.handleClose}
              paneId={paneIdQuery}
              paneTab={tabQuery}
            />
            {this.renderPane()}
          </>
        );
      }
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
    ComponentWithPanel.displayName = wrapDisplayName(Component, 'hasPane');

    return compose(
      connect(
        (state: any) => ({
          // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
          username: state.api.currentUser.data.username,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
          storage: state.api.currentUser.data.storage || {},
        }),
        {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
          storePaneSize: actions.currentUser.storePaneSize,
        }
      ),
      // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      withTabs(defaultTab, paneTabQueryName),
      // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
      queryControl(paneQueryName),
      mapProps((props): any => ({
        paneIdQuery: props[`${functionOrStringExp(paneQuery, props)}Query`],
        changePaneIdQuery: props[`change${upperFirst(functionOrStringExp(paneQuery, props))}Query`],
        ...props,
      }))
    )(ComponentWithPanel);
  };
