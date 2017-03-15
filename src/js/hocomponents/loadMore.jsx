// @flow
import React from 'react';
import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

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
  };

  const WrappedComponent: Function = (props: Props): React.Element<any> => (
    <div>
      <Component
        {...props}
        canLoadMore={props.offsetLimit <= props[collectionProp].length}
        handleLoadMore={props.handleLoadMore}
      />
    </div>
  );

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
      changeLocalOffset: (): Function => setLocalOffset((offs: number) => offs + localLimit),
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
    }),
    setDisplayName('withLoadMore'),
  )(WrappedComponent);
};
