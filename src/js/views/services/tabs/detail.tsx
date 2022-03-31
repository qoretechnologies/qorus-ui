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
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/gr... Remove this comment to see the full error message
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
  return parseInt(num, 10);
}

function retstr(str) {
  if (!str) {
    return '';
  }
  return str.replace(/[^A-Z]/g, '');
}

@withDispatch()
@connect(
  (state) => ({
    system: state.api.system.data,
  }),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
  actions.services
)
@injectIntl
export default class DetailTab extends Component {
  props: {
    service: Object;
    systemOptions: Array<Object>;
    setOptions: Function;
  } = this.props;

  state = {
    minReplicas: this.props.service['scaling_min_replicas'] || 0,
    maxReplicas: this.props.service['scaling_max_replicas'] || 0,
    cpu: this.props.service['scaling_cpu'] || 0,
    memory: {
      val: retnum(this.props.service['scaling_memory']) || 0,
      unit: retstr(this.props.service['scaling_memory']) || '',
    },
    // @ts-ignore ts-migrate(2339) FIXME: Property 'container_cpu_limit' does not exist on t... Remove this comment to see the full error message
    cpuLimit: this.props.service.container_cpu_limit || 0,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'container_cpu_request' does not exist on... Remove this comment to see the full error message
    cpuRequest: this.props.service.container_cpu_request || 0,
    memoryLimit: {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'container_memory_limit' does not exist o... Remove this comment to see the full error message
      val: retnum(this.props.service.container_memory_limit) || 0,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'container_memory_limit' does not exist o... Remove this comment to see the full error message
      unit: retstr(this.props.service.container_memory_limit) || '',
    },
    memoryRequest: {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'container_memory_request' does not exist... Remove this comment to see the full error message
      val: retnum(this.props.service.container_memory_request) || 0,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'container_memory_request' does not exist... Remove this comment to see the full error message
      unit: retstr(this.props.service.container_memory_request) || '',
    },
  };

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
        cpuLimit: nextProps.service.container_cpu_limit || 0,
        cpuRequest: nextProps.service.container_cpu_request || 0,
        memoryLimit: {
          val: retnum(nextProps.service.container_memory_limit) || 0,
          unit: retstr(nextProps.service.container_memory_limit) || '',
        },
        memoryRequest: {
          val: retnum(nextProps.service.container_memory_request) || 0,
          unit: retstr(nextProps.service.container_memory_request) || '',
        },
      });
    }
  }

  handleScalingChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  setOption = (opt: any) => {
    this.props.setOptions(this.props.service, opt.name, opt.value);
  };

  deleteOption = (opt: any) => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  isNumberIncorrect = (num: number) => {
    return !isNumber(num) || isNaN(num) || num < 0;
  };

  isContainerValid = () => {
    let isValid = true;

    if (
      this.isNumberIncorrect(this.state.cpuLimit) ||
      this.state.cpuLimit < this.state.cpuRequest
    ) {
      isValid = false;
    }

    if (
      this.isNumberIncorrect(this.state.cpuRequest) ||
      this.state.cpuRequest > this.state.cpuLimit
    ) {
      isValid = false;
    }

    if (
      this.isNumberIncorrect(this.state.memoryLimit?.val) ||
      // @ts-ignore ts-migrate(2365) FIXME: Operator '<' cannot be applied to types '{ val: nu... Remove this comment to see the full error message
      this.state.memoryLimit < this.state.memoryRequest?.val
    ) {
      isValid = false;
    }

    if (
      this.isNumberIncorrect(this.state.memoryRequest?.val) ||
      // @ts-ignore ts-migrate(2365) FIXME: Operator '>' cannot be applied to types '{ val: nu... Remove this comment to see the full error message
      this.state.memoryRequest > this.state.memoryLimit?.val
    ) {
      isValid = false;
    }

    return isValid;
  };

  isScalingValid = () => {
    let isValid = true;

    if (
      this.isNumberIncorrect(this.state.minReplicas) ||
      this.state.minReplicas > this.state.maxReplicas
    ) {
      isValid = false;
    }

    if (
      this.isNumberIncorrect(this.state.maxReplicas) ||
      this.state.maxReplicas < this.state.minReplicas
    ) {
      isValid = false;
    }

    if (this.isNumberIncorrect(this.state.cpu)) {
      isValid = false;
    }

    if (this.isNumberIncorrect(this.state.memory?.val)) {
      isValid = false;
    }

    return isValid;
  };

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ service:... Remove this comment to see the full error message
    const { service, intl, system } = this.props;
    const { minReplicas, maxReplicas, cpuLimit, cpuRequest, memoryLimit, memoryRequest } =
      this.state;

    return (
      <Box top fill>
        <InfoHeader model={service} />
        <Flex scrollY>
          <PaneItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ service:... Remove this comment to see the full error message
            title={this.props.intl.formatMessage({ id: 'component.controls' })}
          >
            <ServicesControls
              // @ts-ignore ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Object'.
              status={service.status}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
              enabled={service.enabled}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'autostart' does not exist on type 'Objec... Remove this comment to see the full error message
              autostart={service.autostart}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              id={service.id}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
              remote={service.remote}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
              type={service.type}
            />
          </PaneItem>
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'stateless' does not exist on type 'Objec... Remove this comment to see the full error message */}
          {service.stateless && system.is_kubernetes ? (
            <PaneItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ service:... Remove this comment to see the full error message
              title={this.props.intl.formatMessage({
                id: 'service.resource-limits',
              })}
            >
              <Table>
                <Thead>
                  <Th className="text">{intl.formatMessage({ id: 'service.cpu-request' })}</Th>
                  <Th className="text">{intl.formatMessage({ id: 'service.cpu-limit' })}</Th>
                  <Th className="text">{intl.formatMessage({ id: 'service.memory-request' })}</Th>
                  <Th className="text">{intl.formatMessage({ id: 'service.memory-limit' })}</Th>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td className="text">
                      <InputGroup
                        step={0.1}
                        style={{ width: '70px' }}
                        intent={cpuLimit < cpuRequest ? 'danger' : undefined}
                        onChange={(event) =>
                          this.handleScalingChange('cpuRequest', parseFloat(event.target.value))
                        }
                        value={this.state.cpuRequest}
                        // @ts-ignore ts-migrate(2322) FIXME: Type '{ step: number; style: { width: string; }; i... Remove this comment to see the full error message
                        fixed
                        type="number"
                      />
                    </Td>
                    <Td className="text">
                      <InputGroup
                        step={0.1}
                        style={{ width: '70px' }}
                        intent={cpuRequest > cpuLimit ? 'danger' : undefined}
                        onChange={(event) =>
                          this.handleScalingChange('cpuLimit', parseFloat(event.target.value))
                        }
                        value={this.state.cpuLimit}
                        // @ts-ignore ts-migrate(2322) FIXME: Type '{ step: number; style: { width: string; }; i... Remove this comment to see the full error message
                        fixed
                        type="number"
                      />
                    </Td>
                    <Td className="text">
                      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; fluid: true; }' is no... Remove this comment to see the full error message */}
                      <ControlGroup fluid>
                        <InputGroup
                          intent={memoryRequest > memoryLimit ? 'danger' : undefined}
                          style={{ width: '70px' }}
                          onChange={(event) =>
                            this.handleScalingChange('memoryRequest', {
                              val: parseInt(event.target.value),
                              unit: this.state.memoryRequest.unit,
                            })
                          }
                          // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string & ... Remove this comment to see the full error message
                          value={this.state.memoryRequest.val}
                          type="number"
                        />
                        {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Dropdown>
                          {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
                          <Control>{this.state.memoryRequest.unit || 'Select unit'}</Control>
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memoryRequest', {
                                val: this.state.memoryRequest.val,
                                unit: 'K',
                              })
                            }
                            title="KiB"
                          />
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memoryRequest', {
                                val: this.state.memoryRequest.val,
                                unit: 'M',
                              })
                            }
                            title="MiB"
                          />
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memoryRequest', {
                                val: this.state.memoryRequest.val,
                                unit: 'G',
                              })
                            }
                            title="GiB"
                          />
                        </Dropdown>
                      </ControlGroup>
                    </Td>
                    <Td className="text">
                      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; fluid: true; }' is no... Remove this comment to see the full error message */}
                      <ControlGroup fluid>
                        <InputGroup
                          style={{ width: '70px' }}
                          onChange={(event) =>
                            this.handleScalingChange('memoryLimit', {
                              val: parseInt(event.target.value),
                              unit: this.state.memoryLimit.unit,
                            })
                          }
                          // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string & ... Remove this comment to see the full error message
                          value={this.state.memoryLimit.val}
                          type="number"
                        />
                        {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Dropdown>
                          {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
                          <Control>{this.state.memoryLimit.unit || 'Select unit'}</Control>
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memoryLimit', {
                                val: this.state.memoryLimit.val,
                                unit: 'K',
                              })
                            }
                            title="KiB"
                          />
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memoryLimit', {
                                val: this.state.memoryLimit.val,
                                unit: 'M',
                              })
                            }
                            title="MiB"
                          />
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memoryLimit', {
                                val: this.state.memoryLimit.val,
                                unit: 'G',
                              })
                            }
                            title="GiB"
                          />
                        </Dropdown>
                      </ControlGroup>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <Button
                disabled={!this.isContainerValid()}
                intent="success"
                onClick={() => {
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
                  this.props.dispatchAction(
                    fetchWithNotifications,
                    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
                    async (): Promise<*> => {
                      await put(
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        `${settings.REST_BASE_URL}/services/${service.name}/resourceLimits`,
                        {
                          body: JSON.stringify({
                            'container-cpu-limit': this.state.cpuLimit,
                            'container-cpu-request': this.state.cpuRequest,
                            'container-memory-limit': `${this.state.memoryLimit.val}${this.state.memoryLimit.unit}`,
                            'container-memory-request': `${this.state.memoryRequest.val}${this.state.memoryRequest.unit}`,
                          }),
                        }
                      );
                    },
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    `Updating resource limits for ${service.name}...`,
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    `${service.name} resource limits updated successfuly`
                  );
                }}
              >
                Save
              </Button>
            </PaneItem>
          ) : null}
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'stateless' does not exist on type 'Objec... Remove this comment to see the full error message */}
          {service.stateless && system.is_kubernetes ? (
            <PaneItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ service:... Remove this comment to see the full error message
              title={this.props.intl.formatMessage({ id: 'service.scaling' })}
            >
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
                      <InputGroup
                        style={{ width: '70px' }}
                        intent={minReplicas > maxReplicas ? 'danger' : undefined}
                        onChange={(event) =>
                          this.handleScalingChange('minReplicas', parseInt(event.target.value))
                        }
                        value={this.state.minReplicas}
                        // @ts-ignore ts-migrate(2322) FIXME: Type '{ style: { width: string; }; intent: "danger... Remove this comment to see the full error message
                        fixed
                        type="number"
                      />
                    </Td>
                    <Td className="text">
                      <InputGroup
                        style={{ width: '70px' }}
                        intent={maxReplicas < minReplicas ? 'danger' : undefined}
                        onChange={(event) =>
                          this.handleScalingChange('maxReplicas', parseInt(event.target.value))
                        }
                        value={this.state.maxReplicas}
                        // @ts-ignore ts-migrate(2322) FIXME: Type '{ style: { width: string; }; intent: "danger... Remove this comment to see the full error message
                        fixed
                        type="number"
                      />
                    </Td>
                    <Td className="text">
                      <InputGroup
                        style={{ width: '70px' }}
                        onChange={(event) =>
                          this.handleScalingChange('cpu', parseInt(event.target.value))
                        }
                        value={this.state.cpu}
                        // @ts-ignore ts-migrate(2322) FIXME: Type '{ style: { width: string; }; onChange: (even... Remove this comment to see the full error message
                        fixed
                        type="number"
                        max={100}
                        min={0}
                      />
                    </Td>
                    <Td className="text">
                      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; fluid: true; }' is no... Remove this comment to see the full error message */}
                      <ControlGroup fluid>
                        <InputGroup
                          style={{ width: '70px' }}
                          onChange={(event) =>
                            this.handleScalingChange('memory', {
                              val: parseInt(event.target.value),
                              unit: this.state.memory.unit,
                            })
                          }
                          // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string & ... Remove this comment to see the full error message
                          value={this.state.memory.val}
                          type="number"
                        />
                        {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Dropdown>
                          {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
                          <Control>{this.state.memory.unit || 'Select unit'}</Control>
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memory', {
                                val: this.state.memory.val,
                                unit: 'K',
                              })
                            }
                            title="KiB"
                          />
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memory', {
                                val: this.state.memory.val,
                                unit: 'M',
                              })
                            }
                            title="MiB"
                          />
                          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
                          <Item
                            action={() =>
                              this.handleScalingChange('memory', {
                                val: this.state.memory.val,
                                unit: 'G',
                              })
                            }
                            title="GiB"
                          />
                        </Dropdown>
                      </ControlGroup>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <Button
                disabled={!this.isScalingValid()}
                intent="success"
                onClick={() => {
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
                  this.props.dispatchAction(
                    fetchWithNotifications,
                    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
                    async (): Promise<*> => {
                      await put(
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        `${settings.REST_BASE_URL}/services/${service.name}/scaling`,
                        {
                          body: JSON.stringify({
                            'scaling-min-replicas': this.state.minReplicas,
                            'scaling-max-replicas': this.state.maxReplicas,
                            'scaling-cpu': this.state.cpu,
                            'scaling-memory': `${this.state.memory.val}${this.state.memory.unit}`,
                          }),
                        }
                      );
                    },
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    `Updating scaling for ${service.name}...`,
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    `${service.name} scaling updated successfuly`
                  );
                }}
              >
                Save
              </Button>
            </PaneItem>
          ) : null}
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type 'Object'. */}
          <AlertsTable alerts={service.alerts} />
          <ProcessSummary model={service} type="service" />
          <Groups>
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type 'Object'. */}
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
