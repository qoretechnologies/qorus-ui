// @flow
import { ControlGroup, InputGroup } from '@blueprintjs/core';
import React, { Component, useState } from 'react';
import styled from 'styled-components';
import { Control as Button, Controls } from '../../../components/controls';
import settings from '../../../settings';
import { get } from '../../../store/api/utils';

type Props = {
  data?: Object,
  onSave: Function,
  canEdit: boolean,
  urlProtocol: string,
};

const StyledSensitive = styled.span`
  display: inline-block;
  height: 20px;
  width: 150px;
  background-color: #000;
`;

const Option: Function = ({
  objKey,
  value,
  onEdit,
  onDelete,
  canEdit,
  sensitive,
}: Object): React.Element<any> => {
  const [isShown, setIsShown] = useState(false);

  const handleEditClick: Function = (): void => {
    onEdit('key', objKey);
    onEdit('value', value);
  };

  const handleDeleteClick: Function = (): void => {
    onDelete(objKey);
  };

  const renderValue = () => {
    if (!sensitive || isShown) {
      return value.toString();
    }

    return <StyledSensitive onClick={() => setIsShown(!isShown)} />;
  };

  return (
    <div className="conn-options-item">
      "{objKey}": "{renderValue()}"{' '}
      {canEdit && (
        <div className="pull-right">
          <Controls grouped>
            <Button icon="edit" btnStyle="warning" onClick={handleEditClick} />
            <Button
              icon="cross"
              btnStyle="danger"
              onClick={handleDeleteClick}
            />
          </Controls>
        </div>
      )}
    </div>
  );
};

export default class ConnectionOptions extends Component {
  props: Props = this.props;

  state: {
    key: ?string,
    value: ?string,
    options: Object,
  } = {
    key: '',
    value: '',
    options: this.props.data || {},
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

  handleKeyChange: Function = (ev: EventHandler): void => {
    this.changeData('key', ev.target.value);
  };

  handleValueChange: Function = (ev: EventHandler): void => {
    this.changeData('value', ev.target.value);
  };

  handleOptionSave: Function = () => {
    const { options, key, value } = this.state;

    if (key !== '' && value !== '') {
      options[key] = value;

      this.setState({
        key: '',
        value: '',
        options,
      });

      this.props.onSave(JSON.stringify(options));
    }
  };

  handleDelete: Function = (key: string) => {
    const { options } = this.state;

    delete options[key];

    this.setState({ options });
    this.props.onSave(JSON.stringify(options));
  };

  changeData: Function = (item: string, value: string): void => {
    if (item && item !== '' && (value || value === '')) {
      this.setState({ [item]: value });
    }
  };

  render() {
    const opts: Array<string> = Object.keys(this.state.options);

    if (!this.state.optionsData) {
      return <p> Loading ... </p>;
    }

    return (
      <div>
        {opts.length > 0 && (
          <div className="row">
            <div className="col-sm-12">
              <pre>
                {opts.map(
                  (opt: string): React.Element<any> =>
                    console.log(
                      this.state.optionsData[this.props.urlProtocol]?.[opt],
                      opt
                    ) || (
                      <Option
                        canEdit={this.props.canEdit}
                        sensitive={
                          this.state.optionsData[this.props.urlProtocol]?.[opt]
                            ?.sensitive
                        }
                        key={opt}
                        objKey={opt}
                        value={this.state.options[opt]}
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
          <ControlGroup className="bp3-fill">
            <InputGroup
              placeholder="Key..."
              type="text"
              value={this.state.key}
              onChange={this.handleKeyChange}
            />
            <InputGroup
              placeholder="Value..."
              type="text"
              value={this.state.value}
              onChange={this.handleValueChange}
            />
            <Controls>
              <Button
                btnStyle="success"
                icon="small-tick"
                big
                className="bp3-fixed"
                onClick={this.handleOptionSave}
              />
            </Controls>
          </ControlGroup>
        )}
      </div>
    );
  }
}
