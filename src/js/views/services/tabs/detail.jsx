// @flow
import { Button, ControlGroup, InputGroup } from '@blueprintjs/core';
import { isNumber } from 'lodash';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AlertsTable from '../../../components/alerts_table';
import Box from '../../../components/box';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import Flex from '../../../components/Flex';
import { Group, Groups } from '../../../components/groups';
import InfoHeader from '../../../components/InfoHeader';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Options from '../../../components/options';
import PaneItem from '../../../components/pane_item';
import ProcessSummary from '../../../components/ProcessSummary';
import withDispatch from '../../../hocomponents/withDispatch';
import settings from '../../../settings';
import actions from '../../../store/api/actions';
import { fetchWithNotifications, put } from '../../../store/api/utils';
import ServicesControls from '../controls';

function retnum(str) { 
  if (!str) {
    return 0;
  }
  var num = str.replace(/[^0-9]/g, ''); 
  return parseInt(num,10); 
}

function retstr(str) { 
  if (!str) {
    return '';
  }
  return str.replace(/[^A-Z]/g, ''); 
}

@withDispatch()
@connect(() => ({}), actions.services)
@injectIntl
export default class DetailTab extends Component {
  props: {
    service: Object,
    systemOptions: Array<Object>,
    setOptions: Function,
  } = this.props;

  state = {
    minReplicas: this.props.service['scaling_min_replicas'] || 0,
    maxReplicas: this.props.service['scaling_max_replicas'] || 0,
    cpu: this.props.service['scaling_cpu'] || 0,
    memory: {
      val: retnum(this.props.service['scaling_memory']) || 0,
      unit: retstr(this.props.service['scaling_memory']) || '',
    },
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.service !== nextProps.service) {
      this.setState({
        minReplicas: nextProps.service['scaling_min_replicas'] || 0,
        maxReplicas: nextProps.service['scaling_max_replicas'] || 0,
        cpu: nextProps.service['scaling_cpu'] || 0,
        memory: {
          val: retnum(nextProps.service['scaling_memory']) || 0,
          unit: retstr(nextProps.service['scaling_memory']) || '',
        },
      })
    }
  }

  handleScalingChange = (name, value) => {
    this.setState({
      [name]: value,
    })
  }

  setOption = (opt: any) => {
    this.props.setOptions(this.props.service, opt.name, opt.value);
  };

  deleteOption = (opt: any) => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  isNumberIncorrect = (num: number) => {
    return !isNumber(num) || isNaN(num) || num < 0
  }

  isScalingValid = () => {
    let isValid = true;

    if (this.isNumberIncorrect(this.state.minReplicas)) {
      isValid = false;
    }

    if (this.isNumberIncorrect(this.state.maxReplicas)) {
      isValid = false;
    }

    if (this.isNumberIncorrect(this.state.cpu)) {
      isValid = false;
    }

    if (this.isNumberIncorrect(this.state.memory?.val)) {
      isValid = false;
    }
    
    return isValid;
  }

  render() {
    const { service, intl } = this.props;
    console.log(this.props);

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
          <PaneItem title={this.props.intl.formatMessage({ id: 'service.scaling' })}>
            <Table>
              <Thead>
                <Th className="text">{intl.formatMessage({ id: 'service.min-replicas' })}</Th>
                <Th className="text">{intl.formatMessage({ id: 'service.max-replicas' })}</Th>
                <Th className="text">{intl.formatMessage({ id: 'service.cpu' })}</Th>
                <Th className="text">{intl.formatMessage({ id: 'service.memory' })}</Th>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className="text">
                    <InputGroup style={{ width: '70px' }} onChange={(event) => this.handleScalingChange('minReplicas', parseInt(event.target.value))} value={this.state.minReplicas} fixed type="number"/>
                  </Td>
                  <Td className="text">
                    <InputGroup style={{ width: '70px' }} onChange={(event) => this.handleScalingChange('maxReplicas', parseInt(event.target.value))} value={this.state.maxReplicas} fixed type="number" />
                  </Td>
                  <Td className="text">
                    <InputGroup onChange={(event) => this.handleScalingChange('cpu', parseInt(event.target.value))} value={this.state.cpu} fixed type="number" max={100} min={0} />
                  </Td>
                  <Td className="text">
                    <ControlGroup fluid>
                      <InputGroup style={{ width: '70px' }} onChange={(event) => this.handleScalingChange('memory', { val: parseInt(event.target.value), unit: this.state.memory.unit})} value={this.state.memory.val} type="number" />
                      <Dropdown>
                        <Control>
                          {this.state.memory.unit || 'Select unit'}
                        </Control>
                        <Item action={() => this.handleScalingChange('memory', { val: this.state.memory.val, unit: 'K'})} title="KiB" />
                        <Item action={() => this.handleScalingChange('memory', { val: this.state.memory.val, unit: 'M'})} title="MiB" />
                        <Item action={() => this.handleScalingChange('memory', { val: this.state.memory.val, unit: 'G'})} title="GiB" />
                      </Dropdown>
                    </ControlGroup>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Button disabled={!this.isScalingValid()} intent="success" onClick={() => {
              this.props.dispatchAction(fetchWithNotifications, 
                async (): Promise<*> => {
                  await put(`${settings.REST_BASE_URL}/services/${service.name}/scaling`, {
                    body: JSON.stringify({
                      'scaling-min-replicas': this.state.minReplicas,
                      'scaling-max-replicas': this.state.maxReplicas,
                      'scaling-cpu': this.state.cpu,
                      'scaling-memory': `${this.state.memory.val}${this.state.memory.unit}`,
                    }),
                  });
                },
                `Updating scaling for ${service.name}...`,
                `${service.name} scaling updated successfuly`
              );
              // put(`${settings.REST_BASE_URL}/services/${service.name}/scaling`, {
              //   body: JSON.stringify({
              //     'scaling-min-replicas': this.state.minReplicas,
              //     'scaling-max-replicas': this.state.maxReplicas,
              //     'scaling-cpu': this.state.cpu,
              //     'scaling-memory': `${this.state.memory.val}${this.state.memory.unit}`,
              //   })
              // })
            }}>Save</Button>
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
