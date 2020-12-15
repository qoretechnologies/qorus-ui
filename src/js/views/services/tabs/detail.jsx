// @flow
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AlertsTable from '../../../components/alerts_table';
import Box from '../../../components/box';
import Flex from '../../../components/Flex';
import { Group, Groups } from '../../../components/groups';
import InfoHeader from '../../../components/InfoHeader';
import Options from '../../../components/options';
import PaneItem from '../../../components/pane_item';
import ProcessSummary from '../../../components/ProcessSummary';
import actions from '../../../store/api/actions';
import ServicesControls from '../controls';

@connect(() => ({}), actions.services)
@injectIntl
export default class DetailTab extends Component {
  props: {
    service: Object,
    systemOptions: Array<Object>,
    setOptions: Function,
  } = this.props;

  setOption = (opt: any) => {
    this.props.setOptions(this.props.service, opt.name, opt.value);
  };

  deleteOption = (opt: any) => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  render() {
    const { service } = this.props;

    return (
      <Box top fill>
        <InfoHeader model={service} />
        <Flex scrollY>
          <PaneItem
            title={this.props.intl.formatMessage({ id: 'component.controls' })}
          >
            <ServicesControls
              status={service.status}
              enabled={service.enabled}
              autostart={service.autostart}
              id={service.id}
              remote={service.remote}
              type={service.type}
            />
          </PaneItem>
          <AlertsTable alerts={service.alerts} />
          <ProcessSummary model={service} type="service" />
          <Groups>
            {(service.groups || []).map((g) => (
              <Group
                key={g.name}
                name={g.name}
                url={`/groups?group=${g.name}`}
                size={g.size}
                disabled={!g.enabled}
              />
            ))}
          </Groups>
          <Options
            model={service}
            systemOptions={this.props.systemOptions}
            onSet={this.setOption}
            onDelete={this.deleteOption}
          />
        </Flex>
      </Box>
    );
  }
}
