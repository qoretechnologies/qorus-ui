// @flow
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import setDisplayName from 'recompose/setDisplayName';

export default (
    collectionProp: string
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) =>
    compose(
      mapProps((props: any): any => ({
        infoTotalCount: props[collectionProp].length,
        infoWithAlerts: props[collectionProp].filter(
          (itm: any) =>
            // @ts-ignore ts-migrate(2339) FIXME: Property 'has_alerts' does not exist on type 'Obje... Remove this comment to see the full error message
            itm.has_alerts
        ).length,
        infoEnabled: props[collectionProp].filter(
          (itm: any) =>
            // @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
            itm.enabled
        ).length,
        ...props,
      })),
      setDisplayName('withInfoBar')
    )(Component);
