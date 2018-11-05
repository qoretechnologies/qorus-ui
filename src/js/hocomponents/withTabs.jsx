// @flow
import compose from 'recompose/compose';
import queryControl from './queryControl';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import upperFirst from 'lodash/upperFirst';

export default (defaultTab: string | Function, queryName: string): Function => (
  Component: any
): Function =>
  compose(
    queryControl(queryName || 'tab'),
    mapProps(
      (props): Object => ({
        tabQuery: queryName ? props[`${queryName}Query`] : props.tabQuery,
        changeTabQuery: queryName
          ? props[`change${upperFirst(queryName)}Query`]
          : props.changeTabQuery,
        ...props,
      })
    ),
    mapProps(
      ({ tabQuery, ...rest }: Object): Object => ({
        tabQuery: tabQuery
          ? tabQuery
          : typeof defaultTab === 'function'
            ? defaultTab(rest)
            : defaultTab,
        ...rest,
      })
    ),
    withHandlers({
      handleTabChange: ({
        changeTabQuery,
      }: {
        changeTabQuery: Function,
      }): Function => (tabId: string): void => {
        changeTabQuery(tabId);
      },
    })
  )(Component);
