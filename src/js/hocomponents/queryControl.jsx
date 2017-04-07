/* @flow */
import React, { PropTypes } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import capitalize from 'lodash/capitalize';

import { changeQuery } from '../helpers/router';

export default (
  queryName: ?string | ?Function,
  customFunc: ?Function,
  toggle: ?boolean,
): Function => (Component: any): ?ReactClass<*> => {
  class WrappedComponent extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
      location: PropTypes.object,
    };

    props: {
      location: Object,
      query: string,
    };

    getQueryName: Function = (qn: string | Function): string => (
      typeof qn === 'function' ? qn(this.props) : qn
    );

    getLocation: Function = (): Object => this.props.location || this.context.location;

    handleQueryChange: Function = (value: string): void => {
      const location = this.getLocation();

      if (!queryName) {
        changeQuery(
          this.context.router,
          location,
          value,
          false
        );
      } else {
        const query = this.getQueryName(queryName);
        let val = value;

        if (toggle) {
          val = location.query[query] ? '' : true;
        }

        changeQuery(
          this.context.router,
          location,
          {
            [query]: val,
          }
        );
      }
    };

    render() {
      const func: Function = customFunc || this.handleQueryChange;
      const location: Object = this.getLocation();
      const qName: string = !queryName ? 'all' : this.getQueryName(queryName);
      const query: string = !queryName ? JSON.stringify(location.query) : location.query[qName];
      const newProps = {
        ...{
          [`${qName}Query`]: query,
          [`change${capitalize(qName)}Query`]: func,
        },
        ...this.props,
      };

      return (
        <Component {...newProps} />
      );
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withQueries');

  return WrappedComponent;
};
