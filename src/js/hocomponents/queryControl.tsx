/* @flow */
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { changeQuery } from '../helpers/router';

export default (
    queryName: any,
    customFunc: Function,
    toggle: boolean,
    merge?: boolean | Function
  ): Function =>
  (Component: any) => {
    @withRouter
    class WrappedComponent extends React.Component {
      static contextTypes = {
        router: PropTypes.object,
        location: PropTypes.object,
      };

      props: {
        location: any;
        query: string;
      } = this.props;

      getQueryName: Function = (qn: string | Function): string =>
        typeof qn === 'function' ? qn(this.props) : qn;

      getLocation: Function = (): any => this.props.location || this.context.location;

      handleQueryChange: Function = (value: string): void => {
        const location = this.getLocation();

        if (!queryName) {
          changeQuery(this.context.router, location, value, false);
        } else {
          const query = this.getQueryName(queryName);
          let val = value;

          if (toggle) {
            // @ts-ignore ts-migrate(2322) FIXME: Type 'string | boolean' is not assignable to type ... Remove this comment to see the full error message
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

      render() {
        const func: Function = customFunc || this.handleQueryChange;
        const location: any = this.getLocation();
        const qName: string = !queryName ? 'all' : this.getQueryName(queryName);
        const query: string = !queryName
          ? // @ts-ignore ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
            JSON.stringify(location.query)
          : // @ts-ignore ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
            location.query[qName];
        const newProps = {
          ...{
            [`${qName}Query`]: query,
            [`change${upperFirst(qName)}Query`]: func,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
            allQueryObj: location.query,
          },
          ...this.props,
        };

        return <Component {...newProps} />;
      }
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
    WrappedComponent.displayName = wrapDisplayName(Component, 'withQueries');

    return WrappedComponent;
  };
