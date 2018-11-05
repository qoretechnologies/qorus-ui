// @flow
import compose from 'recompose/compose';
import queryControl from './queryControl';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import upperFirst from 'lodash/upperFirst';
import { functionOrStringExp } from '../helpers/functions';

export default (
  defaultTab: string | Function,
  queryName: string | Function
): Function => (Component: any): Function =>
  compose(
    queryControl(props => functionOrStringExp(queryName, props) || 'tab'),
    mapProps(
      (props): Object => ({
        tabQuery: queryName
          ? props[`${functionOrStringExp(queryName, props)}Query`]
          : props.tabQuery,
        changeTabQuery: queryName
          ? props[
              `change${upperFirst(functionOrStringExp(queryName, props))}Query`
            ]
          : props.changeTabQuery,
        ...props,
      })
    ),
    mapProps(
      ({ tabQuery, ...rest }: Object): Object => ({
        tabQuery: tabQuery ? tabQuery : functionOrStringExp(defaultTab, rest),
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
