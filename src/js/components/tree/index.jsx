// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { Intent, Icon } from '@blueprintjs/core';
import size from 'lodash/size';

import Alert from '../alert';
import NoData from '../nodata';
import Pull from '../Pull';
import withModal from '../../hocomponents/modal';
import EditModal from './modal';
import { Controls as ButtonGroup, Control as Button } from '../controls';
import Toolbar from '../toolbar';
import Flex from '../Flex';
import ContentByType from '../ContentByType';
import { getType } from '../../helpers/functions';
import { getLineCount } from '../../helpers/system';
import connect from 'react-redux/lib/connect/connect';

const qorusTypeMapper = {
  array: 'list',
  object: 'hash',
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  null: 'null',
};

@withModal()
@connect(state => ({
  settings: state.api.currentUser.data.storage.settings,
}))
export default class Tree extends Component {
  props: {
    data: Object | Array<any>,
    withEdit: boolean,
    onUpdateClick: Function,
    noControls: boolean,
    forceEdit: boolean,
    customEditData: string,
    customEdit: boolean,
    onEditClick: Function,
    onKeyEditClick: Function,
    openModal: Function,
    closeModal: Function,
    id: number,
    editableKeys: boolean,
    expanded: boolean,
    compact: boolean,
    caseSensitive: boolean,
  } = this.props;

  state = {
    mode: 'normal',
    items: {},
    allExpanded: this.props.settings.treeDefaultExpanded || this.props.expanded,
    showTypes: this.props.settings.treeDefaultDataTypes || false,
  };

  componentWillReceiveProps (nextProps: Object) {
    if (nextProps.forceEdit) {
      this.setState({
        mode: 'edit',
      });
    }
  }

  componentDidUpdate () {
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

  renderTree (data, top, k, topKey, level = 1) {
    return Object.keys(data).map((key, index) => {
      const wrapperClass = classNames({
        'tree-component': true,
        'tree-top': top,
        last: typeof data[key] !== 'object' || data[key] === null,
        nopad: !this.isDeep(),
        [`level-${level}`]: true,
      });

      const dataType: string = getType(data[key]);
      const displayKey: string = key;
      const stateKey = k ? `${k}_${key}` : key;
      let isObject = typeof data[key] === 'object' && data[key] !== null;
      let isExpandable =
        typeof data[key] !== 'object' ||
        this.state.items[stateKey] ||
        (this.state.allExpanded && this.state.items[stateKey] !== false);

      if (isObject && size(data[key]) === 0) {
        isObject = false;
        isExpandable = false;
      }

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
        if (this.props.onKeyEditClick) {
          this.props.onKeyEditClick(topKey, key, this.props.id);
        } else {
          this.props.openModal(
            <EditModal
              onClose={handleEditDone}
              skey={topKey}
              svalue={key}
              id={this.props.id}
            />
          );
        }
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
              {isObject ? displayKey : `${displayKey}:`}{' '}
              {this.state.showTypes && <code>{qorusTypeMapper[dataType]}</code>}
            </span>
          </div>
          {this.props.editableKeys && topKey && (
            <ButtonGroup>
              <Button
                onClick={handleEditClick}
                className={classNames(
                  { [`level-${level}`]: true },
                  'pt-minimal'
                )}
                icon="edit"
              />
            </ButtonGroup>
          )}{' '}
          {isExpandable && isObject
            ? this.renderTree(
              data[key],
              false,
              stateKey,
              top ? key : null,
              level + 1
            )
            : null}
          {!isObject && <ContentByType content={data[key]} />}
        </div>
      );
    });
  }

  renderText (data, tabs = '') {
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

  renderEdit (data) {
    if (this.props.customEdit) {
      if (this.props.customEditData) {
        return JSON.parse(this.props.customEditData);
      }

      return 'Loading data...';
    }

    return JSON.stringify(data, null, 20);
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

  render () {
    const { data, withEdit, compact } = this.props;
    const { mode, showTypes, allExpanded, items } = this.state;

    if (!data || !Object.keys(data).length) {
      return compact ? <span>-</span> : <NoData />;
    }

    const textData: string = this.renderText(data);
    const lineCount: number = getLineCount(textData);

    return (
      <Flex>
        <Toolbar mb>
          <Pull>
            <ButtonGroup>
              {this.isDeep() && [
                <Button
                  iconName="expand-all"
                  text={!compact && 'Expand all'}
                  onClick={this.handleExpandClick}
                  key="expand-button"
                />,
                allExpanded || size(items) > 0 ? (
                  <Button
                    iconName="collapse-all"
                    text={!compact && 'Collapse all'}
                    onClick={this.handleCollapseClick}
                    key="collapse-button"
                  />
                ) : null,
              ]}
              {!this.props.noControls && (
                <Button
                  iconName="code"
                  text={!compact && 'Show types'}
                  btnStyle={showTypes && 'primary'}
                  onClick={this.handleTypesClick}
                />
              )}
            </ButtonGroup>
          </Pull>
          {!this.props.noControls && (
            <div className="pull-right">
              <ButtonGroup>
                <Button
                  text={!compact && 'Tree view'}
                  btnStyle={mode === 'normal' && 'primary'}
                  onClick={this.handleTreeClick}
                  iconName="diagram-tree"
                />
                <Button
                  text={!compact && 'Copy view'}
                  btnStyle={mode === 'copy' && 'primary'}
                  onClick={this.handleCopyClick}
                  iconName="clipboard"
                />
                {withEdit && (
                  <Button
                    text={!compact && 'Edit mode'}
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
          <Flex scrollY className="tree-wrapper">
            {this.renderTree(this.props.data, true)}
          </Flex>
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
