// @flow
import React from 'react';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import isArray from 'lodash/isArray';

import actions from '../store/api/actions';

export default (
  collectionProp: string,
  resource: ?string,
  local: ?boolean,
  localLimit: ?number,
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  type Props = {
    localOffset: number,
    setLocalOffset: Function,
    changeOffset: Function,
    offset: number,
    limit: number,
    offsetLimit: number,
    handleLoadMore: Function,
    handleLoadAll: Function,
    length: number,
    total: number,
  };

  const WrappedComponent: Function = (props: Props): React.Element<any> => {
    const length = isArray(props[collectionProp]) ?
      props[collectionProp].length :
      Object.keys(props[collectionProp]).length;

    return (
      <div>
        <Component
          {...props}
          canLoadMore={props.offsetLimit <= length}
          handleLoadMore={props.handleLoadMore}
          handleLoadAll={props.handleLoadAll}
          loadMoreTotal={props.total}
        />
      </div>
    );
  };

  return compose(
    connect(
      (state: Object) => ({
        offset: resource ? state.api[resource].offset : null,
        limit: resource ? state.api[resource].limit : null,
      }),
      {
        changeOffset: resource ? actions[resource].changeOffset : null,
      }
    ),
    withState('localOffset', 'setLocalOffset', 0),
    mapProps(({ localOffset, setLocalOffset, offset, limit, ...rest }: Props) => ({
      changeLocalOffset: (loadAll: boolean): Function => (
        setLocalOffset((offs: number) => (
          loadAll ? rest[collectionProp].length : offs + localLimit
        ))
      ),
      offset: local ? localOffset : offset,
      limit: local ? localLimit : limit,
      localOffset,
      ...rest,
    })),
    mapProps(({ offset, limit, ...rest }: Props) => ({
      offsetLimit: offset + limit,
      offset,
      limit,
      ...rest,
    })),
    mapProps(({ offsetLimit, ...rest }: Props) => ({
      offsetLimit,
      ...rest,
      total: rest[collectionProp].length,
      [collectionProp]: local ? rest[collectionProp].slice(0, offsetLimit): rest[collectionProp],
    })),
    withHandlers({
      handleLoadMore: ({ changeLocalOffset, changeOffset }): Function => (): void => {
        if (local) {
          changeLocalOffset();
        } else {
          changeOffset();
        }
      },
      handleLoadAll: ({ changeLocalOffset }): Function => (): void => {
        if (local) {
          changeLocalOffset(true);
        }
      },
    }),
    setDisplayName('withLoadMore'),
  )(WrappedComponent);
};
