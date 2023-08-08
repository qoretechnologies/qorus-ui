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
  ReqorePanel,
  ReqoreVerticalSpacer,
} from '@qoretechnologies/reqore';
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

const Option: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'objKey' does not exist on type 'Object'.
  objKey,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
  value,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onEdit' does not exist on type 'Object'.
  onEdit,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onDelete' does not exist on type 'Object... Remove this comment to see the full error message
  onDelete,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'canEdit' does not exist on type 'Object'... Remove this comment to see the full error message
  canEdit,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'sensitive' does not exist on type 'Objec... Remove this comment to see the full error message
  sensitive,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Object) => {
  const [isShown, setIsShown] = useState(false);

  const handleEditClick = (): void => {
    onEdit('key', objKey);
    onEdit('originalKey', objKey);
    onEdit('value', typeof value === 'object' ? JSON.stringify(value) : value.toString());
  };

  const handleDeleteClick = (): void => {
    onDelete(objKey);
  };

  const renderValue = () => {
    if (typeof value === 'object' || !sensitive || isShown) {
      return JSON.stringify(value);
    }

    return <StyledSensitive onClick={() => setIsShown(!isShown)} />;
  };

  return (
    <div className="conn-options-item" style={{ whiteSpace: 'break-spaces' }}>
      "{objKey}": {renderValue()}{' '}
      {canEdit && (
        <div className="pull-right">
          <ReqoreControlGroup stack size="small">
            <ReqoreButton icon="EditLine" onClick={handleEditClick} />
            <ReqoreButton icon="DeleteBinLine" intent="danger" onClick={handleDeleteClick} />
          </ReqoreControlGroup>
        </div>
      )}
    </div>
  );
};

export default class ConnectionOptions extends Component {
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
    if (this.props.data !== nextProps.data) {
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
    const opts: Array<string> = Object.keys(this.props.data);

    // @ts-ignore ts-migrate(2339) FIXME: Property 'optionsData' does not exist on type '{ k... Remove this comment to see the full error message
    if (!this.state.optionsData) {
      return <p> Loading ... </p>;
    }

    console.log(opts, this.props.data);

    return (
      <div>
        <ReqoreKeyValueTable
          data={this.props.data}
          fill
          exportable
          sortable
          keyLabel="Option"
          valueLabel="Value"
        />
        {opts.length > 0 && (
          <div className="row">
            <div className="col-sm-12">
              <pre>
                {opts.map(
                  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                  (opt: string) => (
                    <Option
                      canEdit={this.props.canEdit}
                      sensitive={
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'optionsData' does not exist on type '{ k... Remove this comment to see the full error message
                        this.state.optionsData[this.props.urlProtocol]?.[opt]?.sensitive
                      }
                      key={opt}
                      objKey={opt}
                      value={this.props.data[opt]}
                      onEdit={this.changeData}
                      onDelete={this.handleDelete}
                    />
                  )
                )}
              </pre>
            </div>
          </div>
        )}
        {this.props.canEdit && (
          <>
            <ReqoreVerticalSpacer height={10} />
            <ReqorePanel label="Manage options" icon="Settings4Line" size="small">
              <ReqoreControlGroup fluid stack>
                <ReqoreDropdown
                  items={map(
                    this.state.optionsData[this.props.urlProtocol],
                    (_option, optionName) => ({
                      label: optionName,
                      disabled: !!this.props.data[optionName],
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
        )}
      </div>
    );
  }
}
