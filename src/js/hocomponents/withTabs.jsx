// @flow
import compose from 'recompose/compose';
import queryControl from './queryControl';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';

export default (defaultTab: string | Function): Function => (
  Component: any
): Function =>
  compose(
    queryControl('tab'),
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
