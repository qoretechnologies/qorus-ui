// @flow
import React, { Component } from 'react';

import Modal from '../modal';
import Box from '../box';
import ContentByType from '../ContentByType';
import {
  Icon,
  TextArea,
  Popover,
  Button as Btn,
  ButtonGroup as BtnGrp,
  Intent,
  Position,
  Tooltip,
  ControlGroup,
  InputGroup,
} from '@blueprintjs/core';
import DatePicker from '../datepicker';
import Dropdown, { Item, Control as DControl } from '../../components/dropdown';
import { getLineCount } from '../../helpers/system';
import Alert from '../alert';
import Tree from '../tree';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import Loader from '../loader';
import jsyaml from 'js-yaml';
import moment from 'moment';
import { DATE_FORMATS } from '../../constants/dates';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import Pull from '../Pull';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import isNull from 'lodash/isNull';
import Tabs, { Pane } from '../tabs';

type Props = {
  onClose: Function,
  item: Object,
  onSubmit: Function,
  levelType: string,
  intrf: string,
  intrfId: number,
  stepId: number,
  isGlobal: Boolean,
};

export default class ConfigItemsModal extends Component {
  props: Props = this.props;

  getTemplateType = value => {
    if (value && value.toString().startsWith('$')) {
      const [type] = value.split(':');

      return type.replace('$', '');
    }

    return null;
  };

  getTemplateKey = value => {
    if (value && value.toString().startsWith('$')) {
      const [_type, key] = value.split(':');

      return key;
    }

    return null;
  };

  state: {
    value: any,
    item: Object,
    error: boolean,
    yamlData?: string,
    type: string,
    selectedConfigItem?: string,
    useTemplate?: boolean,
    templateType?: string,
    templateKey?: string,
  } = {
    value: this.props.item?.value,
    item: this.props.item,
    error: false,
    yamlData: null,
    type:
      this.props.item?.type === 'any'
        ? this.props.item?.currentType || null
        : this.props.item?.type,
    useTemplate:
      typeof this.props.item?.value === 'string' &&
      this.props.item?.value?.startsWith('$'),
    templateType: this.getTemplateType(this.props.item?.value),
    templateKey: this.getTemplateKey(this.props.item?.value),
  };

  async componentDidMount () {
    if (this.props.item) {
      const { intrf, stepId, levelType, intrfId, item } = this.props;

      const stepPath: string = stepId ? `/stepinfo/${stepId}` : '';

      const interfacePath: string = intrfId
        ? `${intrf}/${intrfId}${stepPath}`
        : 'system';

      const yamlData: Object = await get(
        `${settings.REST_BASE_URL}/${interfacePath}/config/${
          item.name
        }?action=yaml`
      );

      if (item.level && item.level.startsWith(levelType)) {
        this.setState({
          yamlData,
          value: yamlData.value,
        });
      } else {
        this.setState({
          yamlData,
          value: '',
        });
      }
    }
  }

  handleValueChange: Function = (value): void => {
    this.setState({ value });
  };

  handleDateChange: Function = (value): void => {
    let newValue: any = moment(value, DATE_FORMATS.URL_FORMAT);
    newValue = newValue.format(DATE_FORMATS.DISPLAY);

    this.setState({ value: newValue });
  };

  handleObjectChange: Function = (value): void => {
    this.setState({ value, error: false });

    try {
      jsyaml.safeDump(value);
    } catch (e) {
      this.setState({ error: true });
    }
  };

  handleDefaultClick = () => {
    this.setState({
      value: this.state.yamlData.default_value,
    });
  };

  handleSaveClick: Function = (): void => {
    const value: any = this.state.value;

    let newValue = value;

    if (this.state.type === 'string' && value === '') {
      newValue = jsyaml.safeDump(value);
    }

    this.props.onSubmit(
      this.state.item,
      newValue,
      () => {
        this.props.onClose();
      },
      this.props.stepId
    );
  };

  renderAllowedItems: Function = () => {
    const { item } = this.props;

    if (this.state.type === 'hash' || this.state.type === '*hash') {
      return (
        <React.Fragment>
          {item.allowed_values.map(value => (
            <Tree data={value} compact noControls expanded />
          ))}
        </React.Fragment>
      );
    }

    return (
      <Dropdown>
        <DControl icon="list" small>
          Please select from predefined values
        </DControl>
        {item.allowed_values.map(value => (
          <Item
            title={value}
            onClick={() => {
              this.handleValueChange(value);
            }}
          />
        ))}
      </Dropdown>
    );
  };

  renderTypeSelector: Function = () => {
    return (
      <Dropdown>
        <DControl icon="list" small>
          {this.state.type || 'Please select the type of this config item'}
        </DControl>
        <Item
          title="Integer"
          onClick={() => {
            this.setState({ type: '*int', value: null });
          }}
        />
        <Item
          title="Float"
          onClick={() => {
            this.setState({ type: '*float', value: null });
          }}
        />

        <Item
          title="Boolean"
          onClick={() => {
            this.setState({ type: 'bool', value: null });
          }}
        />
        <Item
          title="String"
          onClick={() => {
            this.setState({ type: '*string', value: null });
          }}
        />
        <Item
          title="Date"
          onClick={() => {
            this.setState({ type: '*date', value: null });
          }}
        />
        <Item
          title="Other"
          onClick={() => {
            this.setState({ type: 'Other', value: null });
          }}
        />
      </Dropdown>
    );
  };

  renderValueContent: Function = (): React.Element<any> => {
    const { item } = this.state;

    if (item.allowed_values) {
      return (
        <TextArea
          className="pt-fill"
          rows={getLineCount(this.state.value, null, 4)}
          value={this.state.value}
          readOnly
          style={{ marginTop: '5px' }}
          title="This area can only be filled from predefined values"
          onChange={(event: any) => {
            this.handleObjectChange(event.target.value);
          }}
        />
      );
    }

    if (this.state.type) {
      switch (this.state.type) {
        case 'bool':
        case '*bool':
          return (
            <Dropdown>
              <DControl small>
                {this.state.value === 'true' ? 'True' : 'False'}
              </DControl>
              <Item
                title="True"
                onClick={() => {
                  this.handleValueChange('true');
                }}
              />
              <Item
                title="False"
                onClick={() => {
                  this.handleValueChange('false');
                }}
              />
            </Dropdown>
          );
        case 'date':
        case '*date':
          return (
            <DatePicker
              date={this.state.value}
              onApplyDate={(newValue: any) => {
                this.handleDateChange(newValue);
              }}
              className="pt-fill"
              noButtons
              small
            />
          );
        case 'hash':
        case '*hash':
        case 'list':
        case '*list':
          return (
            <TextArea
              className="pt-fill"
              rows={getLineCount(this.state.value, null, 4)}
              value={this.state.value}
              onChange={(event: any) => {
                this.handleObjectChange(event.target.value);
              }}
            />
          );
        case 'int':
        case '*int':
        case 'float':
        case '*float':
          return (
            <InputGroup
              type="number"
              onChange={(event: any) => {
                this.handleObjectChange(event.target.value);
              }}
              value={this.state.value}
            />
          );
        default:
          return (
            <TextArea
              className="pt-fill"
              rows={getLineCount(this.state.value, null, 4)}
              value={this.state.value}
              onChange={(event: any) => {
                this.handleObjectChange(event.target.value);
              }}
            />
          );
      }
    }

    return null;
  };

  render () {
    const { onClose, isGlobal, globalConfig } = this.props;
    const { error, yamlData, value, item, useTemplate } = this.state;
    const globalConfigItems = pickBy(globalConfig, (data, name) =>
      isNull(data.value)
    );

    return (
      <Modal hasFooter>
        <Modal.Header onClose={onClose} titleId="yamlEdit">
          {!item
            ? 'Assign new config item value'
            : `Editing ${item.name} config item`}
        </Modal.Header>
        <Modal.Body>
          <Box top fill scrollY>
            {item?.desc && <Alert iconName="info-sign">{item.desc}</Alert>}
            {isGlobal && (
              <>
                <Alert bsStyle="warning">
                  Creating new global config value will affect all interfaces
                  using this item.
                </Alert>
                <Dropdown>
                  <DControl>{item?.name || 'Please select'}</DControl>
                  {map(globalConfigItems, data => (
                    <Item
                      title={data.name}
                      onClick={(event, name) =>
                        this.setState({
                          value: null,
                          item: { ...data, name },
                          type: data.type === 'any' ? null : data.type,
                        })
                      }
                    />
                  ))}
                </Dropdown>
                <br />
              </>
            )}

            {!isGlobal && !yamlData && <Loader />}
            {(!isGlobal && yamlData) || (isGlobal && item) ? (
              <Tabs
                active={useTemplate ? 'template' : 'custom'}
                onChangeEnd={() => {
                  this.setState({ value: null });
                }}
              >
                <Pane name="custom">
                  <React.Fragment>
                    <div className="configItemsEditor">
                      <div className="header">
                        {item.allowed_values
                          ? this.renderAllowedItems()
                          : isGlobal
                            ? 'Set item value'
                            : 'Set custom value or'}
                        {!isGlobal && (
                          <Pull right>
                            <ButtonGroup>
                              <Tooltip
                                content={
                                  this.state.type === 'hash' ||
                                  this.state.type === 'list' ? (
                                      <Tree
                                        data={item.default_value}
                                        noButtons
                                        expanded
                                        compact
                                      />
                                    ) : (
                                      <ContentByType
                                        inTable
                                        noControls
                                        content={item.default_value}
                                      />
                                    )
                                }
                              >
                                <Button
                                  label="Set default value"
                                  disabled={!item.default_value}
                                  onClick={this.handleDefaultClick}
                                />
                              </Tooltip>
                            </ButtonGroup>
                          </Pull>
                        )}
                      </div>
                      <div className="body">
                        {item?.allowed_values && (
                          <Alert bsStyle="warning" iconName="warning-sign">
                            This config item can only be set using predefined
                            values
                          </Alert>
                        )}
                        {item.type === 'any' && (
                          <>
                            <Alert bsStyle="info">
                              This config item can be set to any type
                            </Alert>
                            {this.renderTypeSelector()}
                            <br />
                            <br />
                          </>
                        )}
                        {error && (
                          <Alert bsStyle="danger">
                            The provided value is not in correct format
                          </Alert>
                        )}
                        {this.renderValueContent()}
                      </div>
                    </div>
                  </React.Fragment>
                </Pane>
                <Pane name="template">
                  <div className="configItemsEditor">
                    <div className="header">Set custom template</div>
                    <div className="body">
                      <Alert bsStyle="info" iconName="info-sign">
                        {'Template items are in the format: $<type>:<key>'}
                      </Alert>
                      <ControlGroup className="pt-fill">
                        <Dropdown className="pt-fixed">
                          <DControl icon="dollar">
                            {this.state.templateType || 'Please select'}
                          </DControl>
                          <Item
                            title="config"
                            onClick={() => {
                              this.setState({ templateType: 'config' });
                            }}
                          />
                          <Item
                            title="local"
                            onClick={() => {
                              this.setState({ templateType: 'local' });
                            }}
                          />
                          <Item
                            title="dynamic"
                            onClick={() => {
                              this.setState({ templateType: 'dynamic' });
                            }}
                          />
                          <Item
                            title="keys"
                            onClick={() => {
                              this.setState({ templateType: 'keys' });
                            }}
                          />
                          <Item
                            title="sensitive"
                            onClick={() => {
                              this.setState({ templateType: 'sensitive' });
                            }}
                          />
                          <Item
                            title="sensitive-alias"
                            onClick={() => {
                              this.setState({
                                templateType: 'sensitive-alias',
                              });
                            }}
                          />
                          <Item
                            title="static"
                            onClick={() => {
                              this.setState({ templateType: 'static' });
                            }}
                          />
                          <Item
                            title="step"
                            onClick={() => {
                              this.setState({ templateType: 'step' });
                            }}
                          />
                        </Dropdown>
                        <Button text=":" big className="pt-fixed" />
                        <InputGroup
                          value={this.state.templateKey}
                          onChange={(event: any) => {
                            this.setState({
                              templateKey: event.target.value,
                              value: `$${this.state.templateType}:${
                                event.target.value
                              }`,
                            });
                          }}
                        />
                      </ControlGroup>
                    </div>
                  </div>
                </Pane>
              </Tabs>
            ) : null}
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-right">
            <ButtonGroup>
              <Button label="Cancel" btnStyle="default" action={onClose} big />
              {!isGlobal && value === yamlData?.default_value ? (
                <Popover
                  position={Position.TOP}
                  content={
                    <Box fill top style={{ width: '300px' }}>
                      <p>
                        The value submitted is same as default value, but will
                        not change when default value is changed in the future.
                      </p>
                      <BtnGrp>
                        <Btn
                          className="pt-fill"
                          text="Submit anyway"
                          intent={Intent.SUCCESS}
                          onClick={this.handleSaveClick}
                        />
                      </BtnGrp>
                    </Box>
                  }
                >
                  <Btn
                    text="Save"
                    iconName="warning-sign"
                    intent={Intent.WARNING}
                  />
                </Popover>
              ) : (
                <Button
                  label="Save"
                  btnStyle="success"
                  disabled={error}
                  action={this.handleSaveClick}
                  big
                />
              )}
            </ButtonGroup>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
