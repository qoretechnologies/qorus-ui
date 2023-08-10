// @flow
import { ControlGroup, InputGroup, TextArea, Tooltip } from '@blueprintjs/core';
import {
  ReqoreDropdown,
  ReqoreMessage,
  ReqoreModal,
  ReqoreSpacer,
  ReqoreTabs,
  ReqoreTabsContent,
  ReqoreTag,
  ReqoreTagGroup,
  ReqoreVerticalSpacer,
} from '@qoretechnologies/reqore';
import jsyaml from 'js-yaml';
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import Dropdown, { Control as DControl, Item } from '../../components/dropdown';
import { DATE_FORMATS } from '../../constants/dates';
import { getLineCount } from '../../helpers/system';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import ContentByType from '../ContentByType';
import AutoField from '../Field/auto';
import { validateField } from '../Field/validations';
import Pull from '../Pull';
import Alert from '../alert';
import Loader from '../loader';
import Tree from '../tree';

type Props = {
  onClose: Function;
  item: any;
  onSubmit: Function;
  levelType: string;
  intrf: string;
  intrfId: number;
  stepId: number;
  isGlobal: Boolean;
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
    value: any;
    item: any;
    error: boolean;
    yamlData?: string;
    type: string;
    selectedConfigItem?: string;
    useTemplate?: boolean;
    templateType?: string;
    templateKey?: string;
  } = {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
    value: this.props.item?.value,
    // @ts-ignore ts-migrate(2322) FIXME: Type '{ value: any; origValue: any; item: any; ... Remove this comment to see the full error message
    origValue: this.props.item?.value,
    item: this.props.item,
    error: false,
    yamlData: null,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
    currentType: this.props.item?.type,
    type:
      // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
      this.props.item?.type === 'any'
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'currentType' does not exist on type 'Obj... Remove this comment to see the full error message
          this.props.item?.currentType || null
        : // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
          this.props.item?.type,
    useTemplate:
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
      typeof this.props.item?.value === 'string' && this.props.item?.value?.startsWith('$'),
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
    templateType: this.getTemplateType(this.props.item?.value),
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
    templateKey: this.getTemplateKey(this.props.item?.value),
  };

  async componentDidMount() {
    if (this.props.item) {
      const { intrf, stepId, levelType, intrfId, item } = this.props;

      const stepPath: string = stepId ? `/stepinfo/${stepId}` : '';

      const interfacePath: string = intrfId ? `${intrf}/${intrfId}${stepPath}` : 'system';

      const yamlData: any = await get(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        `${settings.REST_BASE_URL}/${interfacePath}/config/${item.name}?action=yaml`
      );

      let valueFromServer = yamlData.value;

      if (yamlData.type === 'int' || yamlData.type === 'float') {
        valueFromServer = parseFloat(yamlData.value);
      }

      this.setState({
        yamlData,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
        value: valueFromServer,
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
        // @ts-ignore ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'default_value' does not exist on type 's... Remove this comment to see the full error message
      value: this.state.yamlData.default_value,
    });
  };

  handleSaveClick: Function = (): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentType' does not exist on type '{ v... Remove this comment to see the full error message
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
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            <Tree data={value} compact noControls expanded />
          ))}
        </React.Fragment>
      );
    }

    return (
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      <Dropdown>
        {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string; icon: string; small: tru... Remove this comment to see the full error message */}
        <DControl icon="list" small>
          Please select from predefined values
        </DControl>
        {item.allowed_values
          .filter((item) => item)
          .map((value) => (
            <Item
              title={jsyaml.safeLoad(value)}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={(event, title) => {
                this.handleObjectChange(
                  title,
                  item?.type.replace('*', ''),
                  item?.type.startsWith('*')
                );
              }}
            />
          ))}
      </Dropdown>
    );
  };

  removeQuotes: (s: any) => any = (s) => {
    if (s && s[0] === '"' && s[s.length - 1] === '"') {
      return s && typeof s === 'string' ? s.slice(1, -1) : s;
    }

    if (this.state.type === 'bool') {
      return s === 'true' || s === true ? true : false;
    }

    return s;
  };

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderValueContent = () => {
    const { item } = this.state;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'allowed_values' does not exist on type '... Remove this comment to see the full error message
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
              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
              item?.type.replace('*', ''),
              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
              item?.type.startsWith('*')
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'origValue' does not exist on type '{ val... Remove this comment to see the full error message
        default_value={this.removeQuotes(this.state.origValue)}
        t={(s) => s}
        type="auto"
        // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
        defaultType={item.type}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value_true_type' does not exist on type ... Remove this comment to see the full error message
        defaultInternalType={item.value_true_type || item.type}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'allowed_values' does not exist on type '... Remove this comment to see the full error message
        disabled={!!item.allowed_values}
        requestFieldData={(field) =>
          // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
          field === 'can_be_undefined' ? item?.type.startsWith('*') : item?.type.replace('*', '')
        }
        onChange={(name, value, type, canBeNull) => {
          this.handleObjectChange(value, type, canBeNull);
        }}
      />
    );
  };

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'globalConfig' does not exist on type 'Pr... Remove this comment to see the full error message
    const { onClose, isGlobal, globalConfig } = this.props;
    const { error, yamlData, value, item, useTemplate } = this.state;
    const globalConfigItems = pickBy(globalConfig, (data, name) => isNull(data.value));

    return (
      <ReqoreModal
        label={item?.name || 'New config item value'}
        resizable
        onClose={() => onClose()}
        isOpen
        headerSize={2}
        blur={5}
        bottomActions={[
          {
            label: 'Cancel',
            icon: 'CloseLine',
            onClick: () => onClose(),
            position: 'left',
          },
          {
            label: 'Save',
            icon: 'CheckLine',
            onClick: () => this.handleSaveClick(),
            disabled: error,
            position: 'right',
            intent: 'success',
          },
        ]}
      >
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */}
        {item?.desc && (
          <>
            <ReqoreMessage customTheme={{ main: '#e4e8ef' }} icon="InformationLine" flat>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */}
              <ReactMarkdown>{item.desc}</ReactMarkdown>
            </ReqoreMessage>
            <ReqoreSpacer height={10} />
          </>
        )}
        {isGlobal && (
          <>
            <ReqoreMessage intent="warning">
              {!item ? 'Creating new ' : 'Editing'} global config value will affect all interfaces
              using this item.
            </ReqoreMessage>
            {!item && (
              <>
                <ReqoreDropdown
                  filterable
                  paging={{
                    infinite: true,
                    autoLoadMore: true,
                    includeBottomControls: false,
                    itemsPerPage: 20,
                    fluid: true,
                  }}
                  label={item?.name || 'Please select'}
                  items={map(globalConfigItems, (data) => ({
                    label: data.name,
                    onClick: async ({ label }) => {
                      const { intrf, intrfId } = this.props;

                      const interfacePath: string = intrfId ? `${intrf}/${intrfId}` : 'system';

                      const yamlData: any = await get(
                        `${settings.REST_BASE_URL}/${interfacePath}/config/${label}?action=yaml`
                      );

                      this.setState({
                        value: null,
                        item: { ...data, name: label },
                        type: data.type === 'any' ? null : data.type,
                        yamlData,
                      });
                    },
                  }))}
                />
                <ReqoreVerticalSpacer height={10} />
              </>
            )}
          </>
        )}

        {!yamlData && <Loader />}
        {yamlData ? (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <ReqoreTabs
            activeTab={useTemplate ? 'template' : 'custom'}
            flat={false}
            tabs={[
              {
                label: 'Custom',
                id: 'custom',
                activeIntent: 'info',
              },
              {
                label: 'Template',
                id: 'template',
                activeIntent: 'info',
              },
            ]}
          >
            {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
            <ReqoreTabsContent tabId="custom">
              <React.Fragment>
                <div className="configItemsEditor">
                  <div className="header">
                    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'allowed_values' does not exist on type '... Remove this comment to see the full error message */}
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
                              this.state.type === 'hash' || this.state.type === 'list' ? (
                                // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                                <Tree data={item.default_value} noButtons expanded compact />
                              ) : (
                                <ContentByType
                                  inTable
                                  noControls
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'default_value' does not exist on type 'O... Remove this comment to see the full error message
                                  content={item.default_value}
                                />
                              )
                            }
                          >
                            <Button
                              label="Set default value"
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'default_value' does not exist on type 'O... Remove this comment to see the full error message
                              disabled={!item.default_value}
                              onClick={this.handleDefaultClick}
                            />
                          </Tooltip>
                        </ButtonGroup>
                      </Pull>
                    )}
                  </div>
                  <div className="body">
                    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'allowed_values' does not exist on type '... Remove this comment to see the full error message */}
                    {item?.allowed_values && (
                      <Alert bsStyle="warning" icon="warning-sign">
                        This config item can only be set using predefined values
                      </Alert>
                    )}
                    {error && (
                      <Alert bsStyle="danger">The provided value is not in correct format</Alert>
                    )}
                    {this.renderValueContent()}
                  </div>
                </div>
              </React.Fragment>
            </ReqoreTabsContent>
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'allowed_values' does not exist on type '... Remove this comment to see the full error message */}
            {!item?.allowed_values && (
              // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
              <ReqoreTabsContent tabId="template">
                <div className="configItemsEditor">
                  <div className="header">Set custom template</div>
                  <div className="body">
                    <Alert bsStyle="info" icon="info-sign">
                      {'Template items are in the format: $<type>:<key>'}
                    </Alert>
                    <ControlGroup className="bp3-fill">
                      {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                      <Dropdown className="bp3-fixed">
                        {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message */}
                        <DControl icon="dollar">{this.state.templateType}</DControl>
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="config"
                          onClick={() => {
                            this.setState({ templateType: 'config' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="dynamic"
                          onClick={() => {
                            this.setState({ templateType: 'dynamic' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="jinfo"
                          onClick={() => {
                            this.setState({ templateType: 'jinfo' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="keys"
                          onClick={() => {
                            this.setState({ templateType: 'keys' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="local"
                          onClick={() => {
                            this.setState({ templateType: 'local' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="parse-value"
                          onClick={() => {
                            this.setState({ templateType: 'parse-value' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="pstate"
                          onClick={() => {
                            this.setState({ templateType: 'pstate' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="python-expr"
                          onClick={() => {
                            this.setState({ templateType: 'python-expr' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="qore-expr"
                          onClick={() => {
                            this.setState({ templateType: 'qore-expr' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="qore-expr-value"
                          onClick={() => {
                            this.setState({ templateType: 'qore-expr-value' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="rest"
                          onClick={() => {
                            this.setState({ templateType: 'rest' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="sensitive"
                          onClick={() => {
                            this.setState({ templateType: 'sensitive' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="sensitive-alias"
                          onClick={() => {
                            this.setState({
                              templateType: 'sensitive-alias',
                            });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="state"
                          onClick={() => {
                            this.setState({ templateType: 'state' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="static"
                          onClick={() => {
                            this.setState({ templateType: 'static' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="step"
                          onClick={() => {
                            this.setState({ templateType: 'step' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="sysprop"
                          onClick={() => {
                            this.setState({ templateType: 'sysprop' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="temp"
                          onClick={() => {
                            this.setState({ templateType: 'temp' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="timestamp"
                          onClick={() => {
                            this.setState({ templateType: 'timestamp' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="transient"
                          onClick={() => {
                            this.setState({ templateType: 'transient' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="value-map"
                          onClick={() => {
                            this.setState({ templateType: 'value-map' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="var"
                          onClick={() => {
                            this.setState({ templateType: 'var' });
                          }}
                        />
                        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                        <Item
                          title="xconfig"
                          onClick={() => {
                            this.setState({ templateType: 'xconfig' });
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
              </ReqoreTabsContent>
            )}
          </ReqoreTabs>
        ) : null}
        {item && (
          <ReqoreTagGroup>
            <ReqoreTag labelKey="Type" label={item.type} intent="info" />
            {item.level && <ReqoreTag labelKey="Level" label={item.level} intent="info" />}
            <ReqoreTag
              labelKey="Strictly Local"
              rightIcon={item.strictly_local ? 'CheckLine' : 'CloseLine'}
              intent="info"
            />
          </ReqoreTagGroup>
        )}
      </ReqoreModal>
    );
  }
}
