/* @flow */
import PropTypes from 'prop-types';
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import upperFirst from 'lodash/upperFirst';

import { changeQuery } from '../helpers/router';
import { withRouter } from 'react-router';

export default (
  queryName: ?string | ?Function,
  customFunc: ?Function,
  toggle: ?boolean,
  merge?: boolean | Function
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
        ? JSON.stringify(location.query)
        : location.query[qName];
      const newProps = {
        ...{
          [`${qName}Query`]: query,
          [`change${upperFirst(qName)}Query`]: func,
          allQueryObj: location.query,
        },
        ...this.props,
      };

      return <Component {...newProps} />;
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withQueries');

  return WrappedComponent;
};
