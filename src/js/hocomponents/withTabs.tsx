// @flow
import upperFirst from 'lodash/upperFirst';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { functionOrStringExp } from '../helpers/functions';
import queryControl from './queryControl';

export default (
    defaultTab: string | Function,
    queryName: string | Function = 'tab',
    mergeQueries: boolean | Function
  ): Function =>
  (Component: any): Function =>
    compose(
      queryControl((props) => functionOrStringExp(queryName, props), null, false, mergeQueries),
      mapProps(
        (props): Object => ({
          tabQuery: props[`${functionOrStringExp(queryName, props)}Query`],
          changeTabQuery: props[`change${upperFirst(functionOrStringExp(queryName, props))}Query`],
          ...props,
        })
      ),
      mapProps(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'tabQuery' does not exist on type 'Object... Remove this comment to see the full error message
        ({ tabQuery, ...rest }: Object): Object => ({
          tabQuery: tabQuery || functionOrStringExp(defaultTab, rest),
          ...rest,
        })
      ),
      withHandlers({
        handleTabChange:
          ({ changeTabQuery }: { changeTabQuery: Function }): Function =>
          (tabId: string): void => {
            changeTabQuery(tabId);
          },
      })
    )(Component);
