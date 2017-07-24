// @flow
import setDisplayName from 'recompose/setDisplayName';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

export default (
  collectionProp: string,
): Function => (Component: ReactClass<*>): ReactClass<*> => (
  compose(
    mapProps((props: Object): Object => ({
      infoTotalCount: props[collectionProp].length,
      infoWithAlerts: props[collectionProp].filter((itm: Object) => (
        itm.has_alerts
      )).length,
      infoEnabled: props[collectionProp].filter((itm: Object) => (
        itm.enabled
      )).length,
      ...props,
    })),
    setDisplayName('withInfoBar'),
  )(Component)
);
