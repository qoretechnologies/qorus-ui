import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import Alert from '../alert';
import NoData from '../nodata';
import Icon from '../icon';
import withModal from '../../hocomponents/modal';
import EditModal from './modal';

@withModal()
export default class Tree extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    withEdit: PropTypes.bool,
    onUpdateClick: PropTypes.func,
    noControls: PropTypes.bool,
    forceEdit: PropTypes.bool,
    customEditData: PropTypes.string,
    customEdit: PropTypes.bool,
    onEditClick: PropTypes.func,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    id: PropTypes.number,
    editableKeys: PropTypes.bool,
  };

  componentWillMount() {
    this.setState({
      mode: 'normal',
      items: {},
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forceEdit) {
      this.setState({
        mode: 'edit',
      });
    }
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
    if (this.props.onEditClick) {
      this.props.onEditClick();
    }

    this.setState({
      mode: 'edit',
    });
  };

  handleTreeClick = () => {
    this.setState({
      mode: 'normal',
    });
  };

  handleExpandClick = () => {
    this.setState({ items: {}, allExpanded: true });
  };

  handleCollapseClick = () => {
    this.setState({ items: {}, allExpanded: false });
  };

  renderTree(data, top, k, topKey) {
    return Object.keys(data).map((key, index) => {
      const wrapperClass = classNames({
        'tree-top': top,
        last: typeof data[key] !== 'object' || data[key] === null,
        nopad: !this.isDeep(),
      });

      const stateKey = k ? `${k}_${key}` : key;
      const isObject = typeof data[key] === 'object' && data[key] !== null;
      const isExpandable =
        typeof data[key] !== 'object' ||
        this.state.items[stateKey] ||
        (this.state.allExpanded && this.state.items[stateKey] !== false);

      const handleClick = () => {
        const { items } = this.state;

        items[stateKey] = !isExpandable;

        this.setState({
          items,
        });
      };

      const handleEditDone = () => {
        const { items } = this.state;

        items[stateKey] = false;

        this.setState({
          items,
        });

        this.props.closeModal();
      };

      const handleEditClick = () => {
        this.props.openModal(
          <EditModal
            onClose={handleEditDone}
            skey={topKey}
            svalue={key}
            id={this.props.id}
          />
        );
      };

      return (
        <div key={index} className={wrapperClass}>
          <span
            onClick={handleClick}
            className={classNames({
              'data-control': isObject,
              expand: isObject && !isExpandable,
              clps: isObject && isExpandable,
            })}
          >
            {isObject ? key : `${key}:`}
          </span>
          {this.props.editableKeys && topKey && (
            <span onClick={handleEditClick}>
              {' '}
              <Icon iconName="pencil" tooltip="Edit data" />
            </span>
          )}{' '}
          {isExpandable &&
            (isObject
              ? this.renderTree(data[key], false, stateKey, top ? key : null)
              : data[key] && data[key].toString())}
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
    if (this.props.customEdit) {
      if (this.props.customEditData) {
        return JSON.parse(this.props.customEditData);
      }

      return 'Loading data...';
    }

    return JSON.stringify(data, null, 4);
  }

  handleUpdateClick = () => {
    this.props.onUpdateClick(this.refs.editedData.value);
    this.setState({
      mode: 'normal',
    });
  };

  isDeep = () =>
    Object.keys(this.props.data).some(
      (key: string): boolean => typeof this.props.data[key] === 'object'
    );

  render() {
    const { data, withEdit } = this.props;

    if (!data || !Object.keys(data).length) {
      return <NoData />;
    }

    return (
      <div className="tree-component">
        <div className="row">
          <div className="col-lg-12">
            {this.isDeep() && (
              <div className="pull-left">
                <ButtonGroup>
                  <Button
                    className="button--expand pt-small"
                    text="Expand all"
                    onClick={this.handleExpandClick}
                  />
                  <Button
                    className="button--collapse pt-small"
                    text="Collapse all"
                    onClick={this.handleCollapseClick}
                  />
                </ButtonGroup>
              </div>
            )}
            {!this.props.noControls && (
              <div className="pull-right">
                <ButtonGroup>
                  <Button
                    className="button--copy pt-small"
                    text="Tree view"
                    disabled={this.state.mode === 'normal'}
                    onClick={this.handleTreeClick}
                  />
                  <Button
                    className="button--copy pt-small"
                    text="Copy view"
                    disabled={this.state.mode === 'copy'}
                    onClick={this.handleCopyClick}
                  />
                  {withEdit && (
                    <Button
                      className="button--copy pt-small"
                      text="Edit mode"
                      disabled={this.state.mode === 'edit'}
                      onClick={this.handleEditClick}
                    />
                  )}
                </ButtonGroup>
              </div>
            )}
          </div>
        </div>
        {this.state.mode === 'normal' && (
          <div className="tree-wrapper" ref="tree">
            {this.renderTree(this.props.data, true)}
          </div>
        )}
        {this.state.mode === 'copy' && (
          <textarea
            id="tree-content"
            className="form-control"
            defaultValue={this.renderText(this.props.data)}
            rows="20"
            cols="50"
            readOnly
          />
        )}
        {this.state.mode === 'edit' && (
          <div>
            <textarea
              key={this.props.customEditData}
              ref="editedData"
              id="tree-content"
              className="form-control"
              defaultValue={this.renderEdit(this.props.data)}
              rows="20"
              cols="50"
            />
            <Alert bsStyle="warning" title="Warning!">
              Posting new staticdata replaces original content and it can be
              fatal for business processing.
            </Alert>
            <Button
              text="Update data"
              intent={Intent.PRIMARY}
              onClick={this.handleUpdateClick}
            />
          </div>
        )}
      </div>
    );
  }
}
