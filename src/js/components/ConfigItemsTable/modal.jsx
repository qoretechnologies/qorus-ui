// @flow
import React, { Component } from 'react';

import jsyaml from 'js-yaml';
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

import {
  Button as Btn, ButtonGroup as BtnGrp, ControlGroup, InputGroup, Intent,
  Popover, Position, TextArea, Tooltip
} from '@blueprintjs/core';

import {
  Control as Button, Controls as ButtonGroup
} from '../../components/controls';
import Dropdown, {
  Control as DControl, Item
} from '../../components/dropdown';
import { DATE_FORMATS } from '../../constants/dates';
import { getLineCount } from '../../helpers/system';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import Alert from '../alert';
import Box from '../box';
import ContentByType from '../ContentByType';
import AutoField from '../Field/auto';
import { validateField } from '../Field/validations';
import Loader from '../loader';
import Modal from '../modal';
import Pull from '../Pull';
import Tabs, { Pane } from '../tabs';
import Tree from '../tree';

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

  getTemplateType = (value) => {
    if (value && value.toString().startsWith('$')) {
      const [type] = value.split(':');

      return type.replace('$', '');
    }

    return 'config';
  };

  getTemplateKey = (value) => {
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
    currentType: this.props.item?.type,
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

  async componentDidMount() {
    if (this.props.item) {
      const { intrf, stepId, levelType, intrfId, item } = this.props;

      const stepPath: string = stepId ? `/stepinfo/${stepId}` : '';

      const interfacePath: string = intrfId
        ? `${intrf}/${intrfId}${stepPath}`
        : 'system';

      const yamlData: Object = await get(
        `${settings.REST_BASE_URL}/${interfacePath}/config/${item.name}?action=yaml`
      );

      this.setState({
        yamlData,
        value: yamlData.value,
      });
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

  handleObjectChange: Function = (value, type, canBeNull): void => {
    this.setState({
      value,
      yamlData: {
        ...this.state.yamlData,
        value,
      },
      currentType: type,
      error: false,
    });
    // Validate the value
    const isValid = validateField(type, value, null, canBeNull);

    this.setState({ error: !isValid });
  };

  handleDefaultClick = () => {
    this.setState({
      value: this.state.yamlData.default_value,
    });
  };

  handleSaveClick: Function = (): void => {
    let { value, currentType } = this.state;

    if (currentType !== 'hash' && currentType !== 'list') {
      value = jsyaml.safeDump(value);
    }

    this.props.onSubmit(
      this.state.item,
      value,
      () => {
        this.props.onClose();
      },
      this.props.stepId
    );
  };

  renderAllowedItems: Function = (item) => {
    if (this.state.type === 'hash' || this.state.type === '*hash') {
      return (
        <React.Fragment>
          {item.allowed_values.map((value) => (
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
        {item.allowed_values
          .filter((item) => item)
          .map((value) => (
            <Item
              title={jsyaml.safeLoad(value)}
              onClick={(event, title) => {
                this.handleObjectChange(
                  title,
                  item.type.replace('*', ''),
                  item.type.startsWith('*')
                );
              }}
            />
          ))}
      </Dropdown>
    );
  };

  removeQuotes: (s: string) => string = (s) => {
    if (s[0] === '"' && s[s.length - 1] === '"') {
      return s && typeof s === 'string' ? s.slice(1, -1) : s;
    }

    return s;
  };

  renderValueContent = (): React.Element<any> => {
    const { item } = this.state;

    if (item.allowed_values) {
      return (
        <TextArea
          className="bp3-fill"
          rows={getLineCount(this.state.value, null, 4)}
          value={this.removeQuotes(this.state.value)}
          readOnly
          style={{ marginTop: '5px' }}
          title="This area can only be filled from predefined values"
          onChange={(event: any) => {
            this.handleObjectChange(
              event.target.value,
              item.type.replace('*', ''),
              item.type.startsWith('*')
            );
          }}
        />
      );
    }

    return (
      <AutoField
        name="configItem"
        {...{ 'type-depends-on': true }}
        value={this.removeQuotes(this.state.value)}
        t={(s) => s}
        type="auto"
        disabled={!!item.allowed_values}
        requestFieldData={(field) =>
          field === 'can_be_undefined'
            ? item.type.startsWith('*')
            : item.type.replace('*', '')
        }
        onChange={(name, value, type, canBeNull) => {
          this.handleObjectChange(value, type, canBeNull);
        }}
      />
    );
  };

  render() {
    const { onClose, isGlobal, globalConfig } = this.props;
    const { error, yamlData, value, item, useTemplate } = this.state;
    const globalConfigItems = pickBy(globalConfig, (data, name) =>
      isNull(data.value)
    );

    return (
      <Modal
        hasFooter
        onEnterPress={(event) => {
          if (event.srcElement.tagName !== 'TEXTAREA') {
            this.handleSaveClick();
          }
        }}
      >
        <Modal.Header onClose={onClose} titleId="yamlEdit">
          {!item
            ? 'Assign new config item value'
            : `Editing ${item.name} config item`}
        </Modal.Header>
        <Modal.Body>
          <Box top fill scrollY>
            {item?.desc && (
              <Alert icon="info-sign">
                <ReactMarkdown>{item.desc}</ReactMarkdown>
              </Alert>
            )}
            {isGlobal && (
              <>
                <Alert bsStyle="warning">
                  {!item ? 'Creating new ' : 'Editing'} global config value will
                  affect all interfaces using this item.
                </Alert>
                {!item && (
                  <>
                    <Dropdown>
                      <DControl>{item?.name || 'Please select'}</DControl>
                      {map(globalConfigItems, (data) => (
                        <Item
                          title={data.name}
                          onClick={async (event, name) => {
                            const { intrf, intrfId } = this.props;

                            const interfacePath: string = intrfId
                              ? `${intrf}/${intrfId}`
                              : 'system';

                            const yamlData: Object = await get(
                              `${settings.REST_BASE_URL}/${interfacePath}/config/${name}?action=yaml`
                            );

                            this.setState({
                              value: null,
                              item: { ...data, name },
                              type: data.type === 'any' ? null : data.type,
                              yamlData,
                            });
                          }}
                        />
                      ))}
                    </Dropdown>
                    <br />
                  </>
                )}
              </>
            )}

            {!yamlData && <Loader />}
            {yamlData ? (
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
                        {yamlData.allowed_values
                          ? this.renderAllowedItems(yamlData)
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
                          <Alert bsStyle="warning" icon="warning-sign">
                            This config item can only be set using predefined
                            values
                          </Alert>
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
                {!item?.allowed_values && (
                  <Pane name="template">
                    <div className="configItemsEditor">
                      <div className="header">Set custom template</div>
                      <div className="body">
                        <Alert bsStyle="info" icon="info-sign">
                          {'Template items are in the format: $<type>:<key>'}
                        </Alert>
                        <ControlGroup className="bp3-fill">
                          <Dropdown className="bp3-fixed">
                            <DControl icon="dollar">
                              {this.state.templateType}
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
                            <Item
                              title="parse-value"
                              onClick={() => {
                                this.setState({ templateType: 'parse-value' });
                              }}
                            />
                          </Dropdown>
                          <Button text=":" big className="bp3-fixed" />
                          <InputGroup
                            value={this.state.templateKey}
                            onChange={(event: any) => {
                              this.setState({
                                templateKey: event.target.value,
                                value: `$${this.state.templateType}:${event.target.value}`,
                              });
                            }}
                          />
                        </ControlGroup>
                      </div>
                    </div>
                  </Pane>
                )}
              </Tabs>
            ) : null}
          </Box>
        </Modal.Body>
        <Modal.Footer>
          {yamlData ? (
            <div className="pull-right">
              <ButtonGroup>
                <Button
                  label="Cancel"
                  btnStyle="default"
                  action={onClose}
                  big
                />
                {!isGlobal && value === yamlData?.default_value ? (
                  <Popover
                    position={Position.TOP}
                    content={
                      <Box fill top style={{ width: '300px' }}>
                        <p>
                          The value submitted is same as default value, but will
                          not change when default value is changed in the
                          future.
                        </p>
                        <BtnGrp>
                          <Btn
                            className="bp3-fill"
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
                      icon="warning-sign"
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
          ) : null}
        </Modal.Footer>
      </Modal>
    );
  }
}
