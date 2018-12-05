// @flow
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Intent, Icon } from '@blueprintjs/core';
import isArray from 'lodash/isArray';
import size from 'lodash/size';

import Alert from '../alert';
import NoData from '../nodata';
import Pull from '../Pull';
import withModal from '../../hocomponents/modal';
import EditModal from './modal';
import { Controls as ButtonGroup, Control as Button } from '../controls';
import Toolbar from '../toolbar';
import Flex from '../Flex';

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
    expanded: PropTypes.bool,
  };

  state = {
    mode: 'normal',
    items: {},
    allExpanded: this.props.expanded,
    showTypes: false,
  };

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

  handleTypesClick = () => {
    this.setState({
      showTypes: !this.state.showTypes,
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

  renderTree(data, top, k, topKey, level = 1) {
    return Object.keys(data).map((key, index) => {
      const wrapperClass = classNames({
        'tree-component': true,
        'tree-top': top,
        last: typeof data[key] !== 'object' || data[key] === null,
        nopad: !this.isDeep(),
        [`level-${level}`]: true,
      });

      let dataType: string = typeof data[key];

      if (isArray(data[key])) {
        dataType = 'array';
      }

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
          <div
            className={`${isObject ? 'object' : ''} ${
              isExpandable ? 'expanded' : ''
            } tree-key`}
            onClick={handleClick}
          >
            {isObject && (
              <Icon iconName={isExpandable ? 'small-minus' : 'small-plus'} />
            )}{' '}
            <span
              className={classNames({
                'data-control': isObject,
                expand: isObject && !isExpandable,
                clps: isObject && isExpandable,
                [`level-${level}`]: true,
              })}
            >
              {isObject ? key : `${key}:`}{' '}
              {this.state.showTypes && <code>{dataType}</code>}
            </span>
          </div>
          {this.props.editableKeys && topKey && (
            <span
              onClick={handleEditClick}
              className={classNames({ [`level-${level}`]: true })}
            >
              {' '}
              <Icon iconName="edit" tooltip="Edit data" />
            </span>
          )}{' '}
          {isExpandable &&
            (isObject
              ? this.renderTree(
                  data[key],
                  false,
                  stateKey,
                  top ? key : null,
                  level + 1
                )
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

    return JSON.stringify(data, null, 20);
  }

  getLineCount: Function = (str: string): number => {
    try {
      return str.match(/[^\n]*\n[^\n]*/gi).length;
    } catch (e) {
      return 0;
    }
  };

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
    const { mode, showTypes, allExpanded, items } = this.state;

    if (!data || !Object.keys(data).length) {
      return <NoData />;
    }

    const textData: string = this.renderText(data);
    const lineCount: number = this.getLineCount(textData);

    return (
      <Flex>
        <Toolbar mb>
          <Pull>
            <ButtonGroup>
              {this.isDeep() && [
                <Button
                  iconName="expand-all"
                  text="Expand all"
                  onClick={this.handleExpandClick}
                />,
                allExpanded || size(items) > 0 ? (
                  <Button
                    iconName="collapse-all"
                    text="Collapse all"
                    onClick={this.handleCollapseClick}
                  />
                ) : null,
              ]}
              <Button
                iconName="code"
                text="Show types"
                btnStyle={showTypes && 'primary'}
                onClick={this.handleTypesClick}
              />
            </ButtonGroup>
          </Pull>
          {!this.props.noControls && (
            <div className="pull-right">
              <ButtonGroup>
                <Button
                  text="Tree view"
                  btnStyle={mode === 'normal' && 'primary'}
                  onClick={this.handleTreeClick}
                  iconName="diagram-tree"
                />
                <Button
                  text="Copy view"
                  btnStyle={mode === 'copy' && 'primary'}
                  onClick={this.handleCopyClick}
                  iconName="clipboard"
                />
                {withEdit && (
                  <Button
                    text="Edit mode"
                    btnStyle={mode === 'edit' && 'primary'}
                    onClick={this.handleEditClick}
                    iconName="edit"
                  />
                )}
              </ButtonGroup>
            </div>
          )}
        </Toolbar>
        {this.state.mode === 'normal' && (
          <div className="tree-wrapper" ref="tree">
            {this.renderTree(this.props.data, true)}
          </div>
        )}
        {this.state.mode === 'copy' && (
          <textarea
            id="tree-content"
            className="pt-input pt-fill"
            defaultValue={textData}
            rows={lineCount > 20 ? 20 : lineCount}
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
              className="pt-input pt-fill"
              defaultValue={this.renderEdit(this.props.data)}
              rows={lineCount > 20 ? 20 : lineCount}
              cols="50"
            />
            <Alert bsStyle="warning" title="Warning!">
              Posting new staticdata replaces original content and it can be
              fatal for business processing.
            </Alert>
            <ButtonGroup>
              <Button
                text="Update data"
                intent={Intent.PRIMARY}
                onClick={this.handleUpdateClick}
              />
            </ButtonGroup>
          </div>
        )}
      </Flex>
    );
  }
}
