
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Controls, Control as Button } from '../controls';
import Alert from '../alert';

export default class Tree extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    withEdit: PropTypes.bool,
    onUpdateClick: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      mode: 'normal',
    });
  }

  componentDidUpdate() {
    if (this.state.mode === 'copy' && document.getElementById('tree-content')) {
      document.getElementById('tree-content').select();
    }
  }

  handleCopyClick = () => {
    this.setState({
      mode: 'copy',
    });
  };

  handleEditClick = () => {
    this.setState({
      mode: 'edit',
    });
  };

  handleTreeClick = () => {
    this.setState({
      mode: 'normal',
    });
  };

  renderTree(data, top, k) {
    return Object.keys(data).map((key, index) => {
      const wrapperClass = classNames({
        'tree-top': top,
        last: typeof data[key] !== 'object' || data[key] === null,
      });

      const stateKey = k ? `${k}_${key}` : key;
      const isObject = typeof data[key] === 'object' && data[key] !== null;
      const isExpandable = typeof data[key] !== 'object' || this.state[stateKey];

      const handleClick = () => {
        this.setState({
          [stateKey]: !this.state[stateKey],
        });
      };

      return (
        <div
          key={index}
          className={wrapperClass}
        >
          <span
            onClick={handleClick}
            className={classNames({
              'data-control': isObject,
              expand: isObject && !isExpandable,
              clps: isObject && isExpandable,
            })
            }
          >
            {key}:
          </span>
          {' '}
          {isExpandable && (
             isObject ?
              this.renderTree(data[key], false, stateKey) :
              data[key]
          )}
        </div>
      );
    });
  }

  renderText(data, tabs = '') {
    let text = '';

    Object.keys(data).forEach(key => {
      if (typeof data[key] !== 'object' || !data[key]) {
        text += `${tabs}${key}: ${data[key]}\r\n`;
      } else {
        text += `${tabs}${key}:\r\n`;
        text += this.renderText(data[key], `${tabs}\t`);
      }
    });

    return text;
  }

  renderEdit(data) {
    return JSON.stringify(data, null, 4);
  }

  handleUpdateClick = () => {
    this.props.onUpdateClick(this.refs.editedData.value);
    this.setState({
      mode: 'normal',
    });
  }

  render() {
    const { data, withEdit } = this.props;

    if (!data || !Object.keys(data).length) return <p className="no-data"> No data </p>;

    return (
      <div>
        <div className="pull-right">
          <Controls noControls grouped>
            <Button
              className="button--copy"
              label="Tree view"
              btnStyle="info"
              disabled={this.state.mode === 'normal'}
              action={this.handleTreeClick}
            />
            <Button
              className="button--copy"
              label="Copy view"
              btnStyle="info"
              disabled={this.state.mode === 'copy'}
              action={this.handleCopyClick}
            />
            { withEdit && (
              <Button
                className="button--copy"
                label="Edit mode"
                btnStyle="info"
                disabled={this.state.mode === 'edit'}
                action={this.handleEditClick}
              />
            )}
          </Controls>
        </div>
        {this.state.mode === 'normal' &&
          <div className="tree-wrapper pull-left" ref="tree">
            { this.renderTree(this.props.data, true) }
          </div>
        }
        {this.state.mode === 'copy' &&
          <textarea
            id="tree-content"
            className="form-control"
            defaultValue={this.renderText(this.props.data)}
            rows="20"
            cols="50"
            readOnly
          />
        }
        {this.state.mode === 'edit' &&
          <div>
            <textarea
              ref="editedData"
              id="tree-content"
              className="form-control"
              defaultValue={this.renderEdit(this.props.data)}
              rows="20"
              cols="50"
            />
            <Alert bsStyle="warning">
              <strong>Warning!</strong>
              {' '}
              Posting new staticdata replaces original content and it can be
              fatal for business processing.
            </Alert>
            <Button
              big
              label="Update data"
              btnStyle="success"
              action={this.handleUpdateClick}
            />
          </div>
        }
      </div>
    );
  }
}
