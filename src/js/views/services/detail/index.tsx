// @flow
import React from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

import actions from '../../../store/api/actions';
import titleManager from '../../../hocomponents/TitleManager';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject, countConfigItems } from '../../../utils';
import ServiceTabs from '../tabs';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import patchFuncArgs from '../../../hocomponents/patchFuncArgs';
import sync from '../../../hocomponents/sync';
import { createSelector } from 'reselect';
import { resourceSelector, paramSelector } from '../../../selectors';
import lifecycle from 'recompose/lifecycle';
import withTabs from '../../../hocomponents/withTabs';
import compose from 'recompose/compose';
import unsync from '../../../hocomponents/unsync';
import Pull from '../../../components/Pull';
import ServiceControls from '../controls';

const serviceSelector: Function = (state: Object, props: Object): Object =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.services.data.find(
    (service: Object) =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
      parseInt(props.params.id, 10) === parseInt(service.id, 10)
  );

const selector: Object = createSelector(
  [resourceSelector('services'), serviceSelector, paramSelector('id')],
  (meta, service, id) => ({
    meta,
    service,
    id: parseInt(id, 10),
  })
);

type Props = {
  service: Object,
  tabQuery: string,
  methods: Array<Object>,
  location: Object,
  data: Object,
  configItems: Object,
};

const ServicesDetail: Function = ({
  service,
  methods,
  location,
  data,
  tabQuery,
  configItems,
}: Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb link="/services"> Services </Crumb>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message
        <Crumb>{service.normalizedName}</Crumb>
        <CrumbTabs
          tabs={[
            { title: 'Methods', suffix: `(${size(methods)})` },
            {
              title: 'Config',
              suffix: `(${countConfigItems(configItems)})`,
            },
            'Code',
            'Log',
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
            { title: 'Process', suffix: `(${service.process ? 1 : 0})` },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
            { title: 'Mappers', suffix: `(${size(service.mappers)})` },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
            { title: 'Valuemaps', suffix: `(${size(service.vmaps)})` },
            'Resources',
            'Authlabels',
            'Releases',
            'Info',
          ]}
        />
      </Breadcrumbs>
      <Pull right>
        <ServiceControls
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={service.id}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
          enabled={service.enabled}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'autostart' does not exist on type 'Objec... Remove this comment to see the full error message
          autostart={service.autostart}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Object'.
          status={service.status}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
          remote={service.remote}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
          type={service.type}
          big
        />
      </Pull>
    </Headbar>
    <ServiceTabs
      service={service}
      configItems={configItems}
      methods={methods}
      location={location}
      codeData={data}
      activeTab={tabQuery}
    />
  </Flex>
);

export default compose(
  connect(selector, {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    load: actions.services.fetchLibSources,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    fetch: actions.services.fetchLibSources,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    unsync: actions.services.unsync,
  }),
  patchFuncArgs('load', ['id']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps (nextProps) {
      const { fetch, id } = this.props;

      if (id !== nextProps.id) {
        fetch(nextProps.id);
      }
    },
  }),
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
  mapProps(({ service, ...rest }: Object): Object => ({
    methods: service.lib
      ? service.class_based
        ? service.methods.map((method: Object): Object => ({
          ...method,
          ...{ body: service.class_source },
        }))
        : service.methods
      : [],
    service,
    ...rest,
  })),
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
  mapProps(({ service, methods, ...rest }: Object): Object => ({
    data: service.lib ? Object.assign(service.lib, { methods }) : {},
    service,
    methods,
    ...rest,
  })),
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  mapProps(({ data, service, ...rest }: Object): Object => ({
    data: service.class_based
      ? {
        ...{
          code: [
            {
              name: 'Service code',
              body: service.class_source,
            },
          ],
        },
        ...data,
      }
      : data,
    configItems: rebuildConfigHash(service),
    service,
    ...rest,
  })),
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
  titleManager(({ service }): string => service.name, 'Services', 'prefix'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('methods'),
  unsync()
)(ServicesDetail);
