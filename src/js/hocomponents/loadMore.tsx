// @flow
import isArray from 'lodash/isArray';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import setDisplayName from 'recompose/setDisplayName';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import actions from '../store/api/actions';

export default (
    collectionProp: string,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    resource: string,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    local: boolean,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    localLimit: number
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) => {
    type Props = {
      localOffset: number;
      setLocalOffset: Function;
      changeOffset: Function;
      offset: number;
      limit: number;
      offsetLimit: number;
      handleLoadMore: Function;
      handleLoadAll: Function;
      length: number;
      total: number;
    };

    // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
    const WrappedComponent: Function = (props: Props) => {
      const length = isArray(props[collectionProp])
        ? props[collectionProp].length
        : Object.keys(props[collectionProp]).length;

      return (
        <Component
          {...props}
          canLoadMore={props.offsetLimit <= length}
          handleLoadMore={props.handleLoadMore}
          handleLoadAll={props.handleLoadAll}
          loadMoreTotal={props.total}
          loadMoreCurrent={length}
        />
      );
    };

    return compose(
      connect(
        (state: any) => ({
          // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
          offset: resource ? state.api[resource].offset : null,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
          limit: resource ? state.api[resource].limit : null,
        }),
        {
          changeOffset: resource ? actions[resource].changeOffset : null,
        }
      ),
      withState('localOffset', 'setLocalOffset', 0),
      mapProps(({ localOffset, setLocalOffset, offset, limit, ...rest }: Props) => ({
        changeLocalOffset: (loadAll: boolean): Function =>
          setLocalOffset((offs: number) =>
            loadAll ? rest[collectionProp].length : offs + localLimit
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
        [collectionProp]: local ? rest[collectionProp].slice(0, offsetLimit) : rest[collectionProp],
      })),
      withHandlers({
        handleLoadMore:
          ({ changeLocalOffset, changeOffset }): Function =>
          (): void => {
            if (local) {
              changeLocalOffset();
            } else {
              changeOffset();
            }
          },
        handleLoadAll:
          ({ changeLocalOffset }): Function =>
          (): void => {
            if (local) {
              changeLocalOffset(true);
            }
          },
      }),
      setDisplayName('withLoadMore')
    )(WrappedComponent);
  };
