// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Groups, Group } from '../../../components/groups';
import Options from '../../../components/options';
import actions from '../../../store/api/actions';
import AlertsTable from '../../../components/alerts_table';
import PaneItem from '../../../components/pane_item';
import ServicesControls from '../controls';
import ProcessSummary from '../../../components/ProcessSummary';
import InfoHeader from '../../../components/InfoHeader';
import Flex from '../../../components/Flex';
import Box from '../../../components/box';

@connect(
  () => ({}),
  actions.services
)
export default class DetailTab extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    setOptions: PropTypes.func.isRequired,
  };

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
          <PaneItem title="Controls">
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
          <ProcessSummary model={service} />
          <Groups>
            {(service.groups || []).map(g => (
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
