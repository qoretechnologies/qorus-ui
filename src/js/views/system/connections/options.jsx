// @flow
import React, { Component } from 'react';
import { ControlGroup, InputGroup } from '@blueprintjs/core';

import { Controls, Control as Button } from '../../../components/controls';

type Props = {
  data?: Object,
  onSave: Function,
  canEdit: boolean,
};

const Option: Function = ({
  objKey,
  value,
  onEdit,
  onDelete,
  canEdit,
}: Object): React.Element<any> => {
  const handleEditClick: Function = (): void => {
    onEdit('key', objKey);
    onEdit('value', value);
  };

  const handleDeleteClick: Function = (): void => {
    onDelete(objKey);
  };

  return (
    <div className="conn-options-item">
      "{objKey}": "{value.toString()}"{' '}
      {canEdit && (
        <div className="pull-right">
          <Controls grouped>
            <Button
              iconName="edit"
              btnStyle="warning"
              onClick={handleEditClick}
            />
            <Button
              iconName="cross"
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
  props: Props;

  state: {
    key: ?string,
    value: ?string,
    options: Object,
  } = {
    key: '',
    value: '',
    options: this.props.data || {},
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        key: '',
        value: '',
        options: nextProps.data || {},
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
    if (item && item !== '' && (value && value !== '')) {
      this.setState({ [item]: value });
    }
  };

  render() {
    const opts: Array<string> = Object.keys(this.state.options);

    return (
      <div>
        {opts.length > 0 && (
          <div className="row">
            <div className="col-sm-12">
              <pre>
                {opts.map(
                  (opt: string): React.Element<any> => (
                    <Option
                      canEdit={this.props.canEdit}
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
          <ControlGroup className="pt-fill">
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
                iconName="small-tick"
                big
                className="pt-fixed"
                onClick={this.handleOptionSave}
              />
            </Controls>
          </ControlGroup>
        )}
      </div>
    );
  }
}
