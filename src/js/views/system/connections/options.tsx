// @flow
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import { Component, useState } from 'react';
import styled from 'styled-components';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreDropdown,
  ReqoreInput,
  ReqoreKeyValueTable,
  ReqoreMessage,
  ReqoreP,
  ReqorePanel,
  ReqoreVerticalSpacer,
} from '@qoretechnologies/reqore';
import { ReqoreTextEffect } from '@qoretechnologies/reqore/dist/components/Effect';
import ReactMarkdown from 'react-markdown';
import settings from '../../../settings';
import { get } from '../../../store/api/utils';

type Props = {
  data?: any;
  onSave: Function;
  onChange: Function;
  canEdit: boolean;
  urlProtocol: string;
};

const StyledSensitive = styled.span`
  display: inline-block;
  height: 20px;
  width: 150px;
  background-color: #000;
`;

export const ConnectionOptionValue = ({ sensitive, DefaultComponent, value }: any) => {
  const [show, setShow] = useState(!sensitive);

  if (!show) {
    return (
      <ReqoreControlGroup fluid>
        <ReqoreTextEffect effect={{ blur: 3, noWrap: true }} onClick={() => setShow(true)}>
          abcdefghijklmnopqrstuvwxyz
        </ReqoreTextEffect>
        <ReqoreButton fixed icon="EyeLine" onClick={() => setShow(true)} />
      </ReqoreControlGroup>
    );
  }

  return (
    <>
      <DefaultComponent value={value} />
      {sensitive && <ReqoreButton icon="EyeCloseLine" onClick={() => setShow(false)} />}
    </>
  );
};

class ConnectionOptions extends Component {
  props: Props = this.props;

  state: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    key: string;
    originalKey?: string;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    value: string;
    options: any;
    optionsData: any;
  } = {
    key: '',
    originalKey: '',
    value: '',
    options: this.props.data || {},
    // @ts-ignore ts-migrate(2322) FIXME: Type '{ key: string; value: string; options: Objec... Remove this comment to see the full error message
    optionsData: null,
  };

  async componentDidMount() {
    const optionsData = await get(`${settings.REST_BASE_URL}/options/remote`);

    this.setState({
      optionsData,
    });
  }

  async componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data || this.props.urlProtocol !== nextProps.urlProtocol) {
      const optionsData = await get(`${settings.REST_BASE_URL}/options/remote`);

      this.setState({
        key: '',
        value: '',
        options: nextProps.data || {},
        optionsData,
      });
    }
  }

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleKeyChange = (label: string | number): void => {
    this.changeData('key', label);
    this.props.onChange?.();
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleValueChange = (ev: EventHandler): void => {
    this.changeData('value', ev.target.value);
    this.props.onChange?.();
  };

  handleOptionSave = () => {
    const { key, value, originalKey } = this.state;

    if (key !== '' && value !== '') {
      const newOptions = {
        ...this.props.data,
        [key]: typeof value === 'object' ? JSON.parse(value) : value,
      };

      // If the key does not match the original key, delete the original key
      if (key !== originalKey) {
        delete newOptions[originalKey];
      }

      this.setState({
        key: '',
        originalKey: '',
        value: '',
      });

      this.props.onSave(JSON.stringify(newOptions));
    }
  };

  handleDelete: Function = (key: string) => {
    const newOptions = cloneDeep(this.props.data);
    delete newOptions[key];

    this.props.onSave(JSON.stringify(newOptions));
  };

  changeData: Function = (item: string, value: string): void => {
    if (item && item !== '' && (value || value === '')) {
      this.setState({ [item]: value });
    }
  };

  render() {
    const opts: Array<string> = Object.keys(this.props.data || {});

    // @ts-ignore ts-migrate(2339) FIXME: Property 'optionsData' does not exist on type '{ k... Remove this comment to see the full error message
    if (!this.state.optionsData) {
      return <p> Loading ... </p>;
    }

    return (
      <ReqorePanel fill flat padded={false} contentStyle={{ display: 'flex', flexFlow: 'column' }}>
        {this.props.urlProtocol && this.state.optionsData[this.props.urlProtocol] ? (
          <ReqoreKeyValueTable
            data={this.props.data}
            label="Options"
            exportable
            striped
            fill
            sortable
            filterable
            zoomable
            headerSize={3}
            keyIcon="Settings4Line"
            keyAlign="right"
            keyTooltip={(key) => ({
              content: (
                <ReactMarkdown>
                  {this.state.optionsData[this.props.urlProtocol][key]?.desc}
                </ReactMarkdown>
              ),
              delay: 300,
              maxWidth: '300px',
            })}
            valueIcon="PriceTagLine"
            valueTooltip={(value) => JSON.stringify(value)}
            valueRenderer={(data, DefaultComponent) => (
              <ConnectionOptionValue
                {...data}
                sensitive={this.state.optionsData[this.props.urlProtocol][data.tableKey]?.sensitive}
                DefaultComponent={DefaultComponent}
              />
            )}
            rowActions={{
              width: 120,
              actions: (option, value) => [
                {
                  icon: 'InformationLine',
                  tooltip: {
                    title: option,
                    handler: 'click',
                    placement: 'left',

                    content: (
                      <>
                        <ReqoreP>{JSON.stringify(value)}</ReqoreP>
                        <ReqoreMessage margin="top" intent="info" opaque={false}>
                          <ReactMarkdown>
                            {this.state.optionsData[this.props.urlProtocol][option]?.desc}
                          </ReactMarkdown>
                        </ReqoreMessage>
                      </>
                    ),
                  },
                },
                {
                  icon: 'EditLine',
                  onClick: () => {
                    this.changeData('key', option);
                    this.changeData('originalKey', option);
                    this.changeData(
                      'value',
                      typeof value === 'object' ? JSON.stringify(value) : value.toString()
                    );
                  },
                },
                {
                  icon: 'DeleteBinLine',
                  intent: 'danger',
                  onClick: () => {
                    this.handleDelete(option);
                  },
                },
              ],
            }}
          />
        ) : (
          <ReqoreMessage intent="warning" margin="top">
            URL protocol for this connection not found / invalid, unable to display options
          </ReqoreMessage>
        )}
        {this.props.canEdit &&
        this.props.urlProtocol &&
        this.state.optionsData[this.props.urlProtocol] ? (
          <>
            <ReqoreVerticalSpacer height={10} />
            <ReqorePanel label="Manage options" icon="Settings4Line" size="small">
              <ReqoreControlGroup fluid stack>
                <ReqoreDropdown
                  items={map(
                    this.state.optionsData[this.props.urlProtocol],
                    (_option, optionName) => ({
                      label: optionName,
                      disabled: !!this.props.data?.[optionName],
                      selected: this.state.key === optionName,
                    })
                  )}
                  filterable
                  scrollToSelected
                  label={this.state.key || 'Select option'}
                  onItemSelect={(item) => {
                    this.handleKeyChange(item.label);
                  }}
                />
                <ReqoreInput
                  placeholder="Value..."
                  type="text"
                  value={this.state.value}
                  onChange={this.handleValueChange}
                />
                <ReqoreButton
                  intent="success"
                  icon="CheckLine"
                  fixed
                  onClick={this.handleOptionSave}
                />
              </ReqoreControlGroup>
            </ReqorePanel>
          </>
        ) : (
          <>
            {!this.props.canEdit ? null : (
              <ReqoreMessage intent="warning" margin="top">
                Either the URL protocol is invalid or there are no options available for the given
                protocol: {this.props.urlProtocol || 'No protocol found in URL'}
              </ReqoreMessage>
            )}
          </>
        )}
      </ReqorePanel>
    );
  }
}

export default ConnectionOptions;
