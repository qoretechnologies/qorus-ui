// @flow
import React, { Component } from 'react';

import { Controls, Control as Button } from '../../../components/controls';

type Props = {
  data?: Object,
  onSave: Function,
};

const Option: Function = ({
  objKey,
  value,
  onEdit,
  onDelete,
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
      "{objKey}": "{value}"
      {' '}
      <div className="pull-right">
        <Controls grouped>
          <Button
            icon="edit"
            btnStyle="warning"
            onClick={handleEditClick}
          />
          <Button
            icon="times"
            btnStyle="danger"
            onClick={handleDeleteClick}
          />
        </Controls>
      </div>
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

  handleKeyChange: Function = (ev: EventHandler): void => {
    this.changeData('key', ev.target.value);
  }

  handleValueChange: Function = (ev: EventHandler): void => {
    this.changeData('value', ev.target.value);
  }

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
  }

  handleDelete: Function = (key: string) => {
    const { options } = this.state;

    delete options[key];

    this.setState({ options });
    this.props.onSave(JSON.stringify(options));
  }

  changeData: Function = (item: string, value: string): void => {
    if ((item && item !== '') && (value && value !== '')) {
      this.setState({ [item]: value });
    }
  }

  render() {
    const opts: Array<string> = Object.keys(this.state.options);

    return (
      <div>
        {opts.length > 0 && (
          <div className="row">
            <div className="col-sm-12">
              <pre>
                {'{'}
                {opts.map((opt: string): React.Element<any> => (
                  <Option
                    key={opt}
                    objKey={opt}
                    value={this.state.options[opt]}
                    onEdit={this.changeData}
                    onDelete={this.handleDelete}
                  />
                ))}
                {'}'}
              </pre>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-sm-5">
            <input
              placeholder="Key..."
              type="text"
              value={this.state.key}
              onChange={this.handleKeyChange}
              className="form-control"
            />
          </div>
          <div className="col-sm-5">
            <input
              placeholder="Value..."
              type="text"
              value={this.state.value}
              onChange={this.handleValueChange}
              className="form-control"
            />
          </div>
          <div className="col-sm-2">
            <Button
              btnStyle="success"
              icon="save"
              big
              onClick={this.handleOptionSave}
            />
          </div>
        </div>
      </div>
    );
  }
}
