// @flow
import React from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

import actions from '../../../store/api/actions';
import titleManager from '../../../hocomponents/TitleManager';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject } from '../../../utils';
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
  state.api.services.data.find(
    (service: Object) =>
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
        <Crumb>{service.normalizedName}</Crumb>
        <CrumbTabs
          tabs={[
            { title: 'Methods', suffix: `(${size(methods)})` },
            'Code',
            'Log',
            { title: 'Mappers', suffix: `(${size(service.mappers)})` },
            { title: 'Value maps', suffix: `(${size(service.vmaps)})` },
            'Resources',
            'Releases',
            {
              title: 'Config',
              suffix: `(${countArrayItemsInObject(configItems)})`,
            },
            'Info',
          ]}
        />
      </Breadcrumbs>
      <Pull right>
        <ServiceControls
          id={service.id}
          enabled={service.enabled}
          autostart={service.autostart}
          status={service.status}
          remote={service.remote}
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
  connect(
    selector,
    {
      load: actions.services.fetchLibSources,
      fetch: actions.services.fetchLibSources,
      unsync: actions.services.unsync,
    }
  ),
  patchFuncArgs('load', ['id']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { fetch, id } = this.props;

      if (id !== nextProps.id) {
        fetch(nextProps.id);
      }
    },
  }),
  mapProps(
    ({ service, ...rest }: Object): Object => ({
      methods: service.lib
        ? service.class_based
          ? service.methods.map(
              (method: Object): Object => ({
                ...method,
                ...{ body: service.class_source.class_source },
              })
            )
          : service.methods
        : {},
      service,
      ...rest,
    })
  ),
  mapProps(
    ({ service, methods, ...rest }: Object): Object => ({
      data: service.lib ? Object.assign(service.lib, { methods }) : {},
      service,
      methods,
      ...rest,
    })
  ),
  mapProps(
    ({ data, service, ...rest }: Object): Object => ({
      data: service.class_based
        ? {
            ...{
              code: [
                {
                  name: 'Service code',
                  body: service.class_source.class_source,
                },
              ],
            },
            ...data,
          }
        : data,
      configItems: rebuildConfigHash(service),
      service,
      ...rest,
    })
  ),
  titleManager(({ service }): string => service.name, 'Services', 'prefix'),
  withTabs('methods'),
  unsync()
)(ServicesDetail);
