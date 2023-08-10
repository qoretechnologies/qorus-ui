// @flow
import size from 'lodash/size';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import { insertAtIndex } from '../../../helpers/functions';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import titleManager from '../../../hocomponents/TitleManager';
import patchFuncArgs from '../../../hocomponents/patchFuncArgs';
import sync from '../../../hocomponents/sync';
import unsync from '../../../hocomponents/unsync';
import withTabs from '../../../hocomponents/withTabs';
import { paramSelector, resourceSelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import { countConfigItems } from '../../../utils';
import ServiceControls from '../controls';
import ServiceTabs from '../tabs';

const serviceSelector: Function = (state: any, props: any): any =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.services.data.find(
    (service: any) =>
      // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
      parseInt(props.params.id, 10) === parseInt(service.id, 10)
  );

const selector: any = createSelector(
  [resourceSelector('services'), serviceSelector, paramSelector('id')],
  (meta, service, id) => ({
    meta,
    service,
    id: parseInt(id, 10),
  })
);

type Props = {
  service: any;
  tabQuery: string;
  methods: Array<Object>;
  location: any;
  data: any;
  configItems: any;
};

const ServicesDetail: Function = ({
  service,
  methods,
  location,
  data,
  tabQuery,
  configItems,
}: Props) => {
  let tabs = [
    { title: 'Methods', suffix: `(${size(methods)})` },
    {
      title: 'Config',
      suffix: `(${countConfigItems(configItems)})`,
    },
    'Code',
    'Log',
    // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
    { title: 'Process', suffix: `(${service.process ? 1 : 0})` },
    // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
    { title: 'Mappers', suffix: `(${size(service.mappers)})` },
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
    { title: 'Valuemaps', suffix: `(${size(service.vmaps)})` },
    'Resources',
    'Authlabels',
    'Releases',
    'Info',
  ];

  if (service?.api_manager) {
    tabs = insertAtIndex(tabs, 3, 'API Manager');
  }

  return (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb link="/services"> Services </Crumb>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message */}
          <Crumb>{service.normalizedName}</Crumb>
          <CrumbTabs tabs={tabs} />
        </Breadcrumbs>
        <Pull right>
          <ServiceControls
            // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
            id={service.id}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
            enabled={service.enabled}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'autostart' does not exist on type 'Objec... Remove this comment to see the full error message
            autostart={service.autostart}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Object'.
            status={service.status}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
            remote={service.remote}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
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
};

export default compose(
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    load: actions.services.fetchLibSources,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    fetch: actions.services.fetchLibSources,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    unsync: actions.services.unsync,
  }),
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
  mapProps(({ service, ...rest }: any): any => ({
    methods: service.lib
      ? service.class_based
        ? service.methods.map((method: any): any => ({
            ...method,
            ...{ body: service.class_source },
          }))
        : service.methods
      : [],
    service,
    ...rest,
  })),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
  mapProps(({ service, methods, ...rest }: any): any => ({
    data: service.lib
      ? Object.assign(service.lib, { methods, fsm_triggers: service.fsm_triggers || {} })
      : {},
    service,
    methods,
    ...rest,
  })),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  mapProps(({ data, service, ...rest }: any): any => ({
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
  titleManager(({ service }): string => service.name, 'Services', 'prefix'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('methods'),
  unsync()
)(ServicesDetail);
