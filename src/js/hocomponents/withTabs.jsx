// @flow
import compose from 'recompose/compose';
import queryControl from './queryControl';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import upperFirst from 'lodash/upperFirst';
import { functionOrStringExp } from '../helpers/functions';

export default (
  defaultTab: string | Function,
  queryName: string | Function = 'tab',
  mergeQueries: boolean | Function = true
): Function => (Component: any): Function =>
  compose(
    queryControl(
      props => functionOrStringExp(queryName, props),
      null,
      false,
      mergeQueries
    ),
    mapProps(
      (props): Object => ({
        tabQuery: props[`${functionOrStringExp(queryName, props)}Query`],
        changeTabQuery:
          props[
            `change${upperFirst(functionOrStringExp(queryName, props))}Query`
          ],
        ...props,
      })
    ),
    mapProps(
      ({ tabQuery, ...rest }: Object): Object => ({
        tabQuery: tabQuery || functionOrStringExp(defaultTab, rest),
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
