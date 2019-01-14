// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

import DetailPane from '../../../components/pane';
import actions from '../../../store/api/actions';
import titleManager from '../../../hocomponents/TitleManager';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject } from '../../../utils';
import ServiceTabs from '../tabs';

@connect(
  (state, props) => ({
    service: state.api.services.data.find(
      service => service.id === parseInt(props.paneId, 10)
    ),
  }),
  {
    load: actions.services.fetchLibSources,
  }
)
@mapProps(
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
)
@mapProps(
  ({ service, methods, ...rest }: Object): Object => ({
    data: service.lib ? Object.assign(service.lib, { methods }) : {},
    service,
    methods,
    ...rest,
  })
)
@mapProps(
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
    service,
    ...rest,
  })
)
@titleManager(({ service }): string => service.name, 'Services', 'prefix')
export default class ServicesDetail extends Component {
  props: {
    service: Object,
    systemOptions: Array<Object>,
    paneTab: string,
    paneId: number,
    onClose: Function,
    location: Object,
    width: number,
    onResize: Function,
    data: Object,
  };

  componentWillMount() {
    this.props.load(this.props.paneId);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.paneId !== nextProps.paneId) {
      this.props.load(nextProps.paneId);
    }
  }

  render() {
    const {
      service,
      paneTab,
      systemOptions,
      methods,
      location,
      data,
    } = this.props;
    const loaded: boolean = service && 'lib' in service;

    if (!loaded) {
      return null;
    }

    const configItems: Array<Object> = rebuildConfigHash(service);

    return (
      <DetailPane
        width={this.props.width || 600}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
        title={`Service ${service.id}`}
        tabs={{
          tabs: [
            'Detail',
            'Code',
            { title: 'Methods', suffix: `(${size(methods)})` },
            'Log',
            { title: 'Process', suffix: `(${service.process ? 1 : 0})` },
            { title: 'Mappers', suffix: `(${size(service.mappers)})` },
            { title: 'Value maps', suffix: `(${size(service.vmaps)})` },
            'Resources',
            'Releases',
            {
              title: 'Config',
              suffix: `(${countArrayItemsInObject(configItems)})`,
            },
            'Info',
          ],
          queryIdentifier: 'paneTab',
        }}
      >
        <ServiceTabs
          service={service}
          configItems={configItems}
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
