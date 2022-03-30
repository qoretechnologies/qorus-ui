// @flow
import setDisplayName from 'recompose/setDisplayName';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

export default (
  collectionProp: string,
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
): Function => (Component: ReactClass<*>): ReactClass<*> => (
  compose(
    mapProps((props: Object): Object => ({
      infoTotalCount: props[collectionProp].length,
      infoWithAlerts: props[collectionProp].filter((itm: Object) => (
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'has_alerts' does not exist on type 'Obje... Remove this comment to see the full error message
        itm.has_alerts
      )).length,
      infoEnabled: props[collectionProp].filter((itm: Object) => (
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
        itm.enabled
      )).length,
      ...props,
    })),
    setDisplayName('withInfoBar'),
  )(Component)
);
