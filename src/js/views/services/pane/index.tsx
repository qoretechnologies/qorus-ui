// @flow
import size from 'lodash/size';
import { Component } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import DetailPane from '../../../components/pane';
import { insertAtIndex } from '../../../helpers/functions';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import titleManager from '../../../hocomponents/TitleManager';
import actions from '../../../store/api/actions';
import { countConfigItems } from '../../../utils';
import ServiceTabs from '../tabs';

@connect(
  (state, props) => ({
    service: state.api.services.data.find((service) => service.id === parseInt(props.paneId, 10)),
  }),
  {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    load: actions.services.fetchLibSources,
  }
)
// @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
@mapProps(({ service, ...rest }: any): any => ({
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
}))
// @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
@mapProps(({ service, methods, ...rest }: any): any =>
  // @ts-ignore go fuck yourself pls
  ({
    data: service.lib
      ? Object.assign(service.lib, { methods, fsm_triggers: service.fsm_triggers || {} })
      : {},
    service,
    methods,
    ...rest,
  })
)
// @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
@mapProps(({ data, service, ...rest }: any): any => ({
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
  service,
  ...rest,
}))
// @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
@titleManager(({ service }): string => service.name, 'Services', 'prefix')
export default class ServicesDetail extends Component {
  props: {
    service: any;
    systemOptions: Array<Object>;
    paneTab: string;
    paneId: number;
    onClose: Function;
    location: any;
    width: number;
    onResize: Function;
    data: any;
  } = this.props;

  componentWillMount() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'load' does not exist on type '{ service:... Remove this comment to see the full error message
    this.props.load(this.props.paneId);
  }

  componentWillReceiveProps(nextProps: any) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
    if (this.props.paneId !== nextProps.paneId) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'load' does not exist on type '{ service:... Remove this comment to see the full error message
      this.props.load(nextProps.paneId);
    }
  }

  render() {
    const {
      service,
      paneTab,
      systemOptions,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'methods' does not exist on type '{ servi... Remove this comment to see the full error message
      methods,
      location,
      data,
    } = this.props;
    const loaded: boolean = service && 'lib' in service;

    if (!loaded) {
      return null;
    }

    const configItemsCount: number = countConfigItems(rebuildConfigHash(service));
    let tabs = [
      'Detail',
      {
        title: 'Config',
        suffix: `${configItemsCount}`,
      },
      'Code',
      { title: 'Methods', suffix: `${size(methods)}` },
      'Log',
      // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
      { title: 'Process', suffix: `${service.process ? 1 : 0}` },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
      { title: 'Mappers', suffix: `${size(service.mappers)}` },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
      { title: 'Valuemaps', suffix: `${size(service.vmaps)}` },
      {
        title: 'Resources',
        // @ts-ignore ts-migrate(2339) FIXME: Property 'resources' does not exist on type 'Objec... Remove this comment to see the full error message
        suffix: `${size(service.resources)} / ${size(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'resource_files' does not exist on type '... Remove this comment to see the full error message
          service.resource_files
        )}`,
      },
      'Authlabels',
      'Releases',
      'Info',
    ];

    if (service?.api_manager) {
      tabs = insertAtIndex(tabs, 3, 'API Manager');
    }

    return (
      <DetailPane
        width={this.props.width || 600}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        title={service.name}
        tabs={{
          tabs,
          queryIdentifier: 'paneTab',
        }}
      >
        <ServiceTabs
          service={service}
          activeTab={paneTab}
          methods={methods}
          location={location}
          codeData={data}
          systemOptions={systemOptions}
          isPane
        />
      </DetailPane>
    );
  }
}
