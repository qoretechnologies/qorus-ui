/* @flow */
import PropTypes from 'prop-types';
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import upperFirst from 'lodash/upperFirst';

import { changeQuery } from '../helpers/router';
import { withRouter } from 'react-router';

export default (
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  queryName: ?string | ?Function,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  customFunc: ?Function,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  toggle: ?boolean,
  merge?: boolean | Function
// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
): Function => (Component: any): ?ReactClass<*> => {
  @withRouter
  class WrappedComponent extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
      location: PropTypes.object,
    };

    props: {
      location: Object,
      query: string,
    } = this.props;

    getQueryName: Function = (qn: string | Function): string =>
      typeof qn === 'function' ? qn(this.props) : qn;

    getLocation: Function = (): Object =>
      this.props.location || this.context.location;

    handleQueryChange: Function = (value: string): void => {
      const location = this.getLocation();

      if (!queryName) {
        changeQuery(this.context.router, location, value, false);
      } else {
        const query = this.getQueryName(queryName);
        let val = value;

        if (toggle) {
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | boolean' is not assignable to type ... Remove this comment to see the full error message
          val = location.query[query] ? '' : true;
        }

        const mergeQueries = merge
          ? typeof merge === 'function'
            ? merge(this.props)
            : merge
          : true;

        changeQuery(
          this.context.router,
          location,
          {
            [query]: val,
          },
          mergeQueries
        );
      }
    };

    render () {
      const func: Function = customFunc || this.handleQueryChange;
      const location: Object = this.getLocation();
      const qName: string = !queryName ? 'all' : this.getQueryName(queryName);
      const query: string = !queryName
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
        ? JSON.stringify(location.query)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
        : location.query[qName];
      const newProps = {
        ...{
          [`${qName}Query`]: query,
          [`change${upperFirst(qName)}Query`]: func,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
          allQueryObj: location.query,
        },
        ...this.props,
      };

      return <Component {...newProps} />;
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
  WrappedComponent.displayName = wrapDisplayName(Component, 'withQueries');

  return WrappedComponent;
};
