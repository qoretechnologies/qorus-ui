// @flow
import { Icon, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import size from 'lodash/size';
import { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import connect from 'react-redux/lib/connect/connect';
import { compose } from 'recompose';
import { getType } from '../../helpers/functions';
import { getLineCount } from '../../helpers/system';
import withModal from '../../hocomponents/modal';
import Alert from '../alert';
import ContentByType from '../ContentByType';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import Flex from '../Flex';
import NoData from '../nodata';
import Pull from '../Pull';
import Toolbar from '../toolbar';
import EditModal from './modal';

const qorusTypeMapper = {
  array: 'list',
  object: 'hash',
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  null: 'null',
};

class Tree extends Component {
  props: {
    data: any | Array<any>;
    withEdit: boolean;
    onUpdateClick: Function;
    noControls: boolean;
    noButtons: boolean;
    forceEdit: boolean;
    customEditData: string;
    customEdit: boolean;
    onEditClick: Function;
    onKeyEditClick: Function;
    openModal: Function;
    closeModal: Function;
    id: number;
    editableKeys: boolean;
    expanded: boolean;
    compact: boolean;
    caseSensitive: boolean;
    contentInline: boolean;
    noMarkdown?: boolean;
  } = this.props;

  state = {
    mode: 'normal',
    items: {},
    // @ts-ignore ts-migrate(2339) FIXME: Property 'settings' does not exist on type '{ data... Remove this comment to see the full error message
    allExpanded: this.props.settings.treeDefaultExpanded || this.props.expanded,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'settings' does not exist on type '{ data... Remove this comment to see the full error message
    showTypes: this.props.settings.treeDefaultDataTypes || false,
  };

  componentWillReceiveProps(nextProps: any) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'forceEdit' does not exist on type 'Objec... Remove this comment to see the full error message
    if (nextProps.forceEdit) {
      this.setState({
        mode: 'edit',
      });
    }
  }

  componentDidUpdate() {
    if (this.state.mode === 'copy' && document.getElementById('tree-content')) {
      // @ts-ignore ts-migrate(2551) FIXME: Property 'select' does not exist on type 'HTMLElem... Remove this comment to see the full error message
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
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            <EditModal onClose={handleEditDone} skey={topKey} svalue={key} id={this.props.id} />
          );
        }
      };

      return (
        <div key={index} className={wrapperClass}>
          <div
            className={`${isObject ? 'object' : ''} ${isExpandable ? 'expanded' : ''} tree-key`}
            onClick={handleClick}
          >
            {isObject && <Icon icon={isExpandable ? 'small-minus' : 'small-plus'} />}{' '}
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
                className={classNames({ [`level-${level}`]: true }, 'bp3-minimal')}
                icon="edit"
              />
            </ButtonGroup>
          )}{' '}
          {isExpandable && isObject
            ? this.renderTree(data[key], false, stateKey, top ? key : null, level + 1)
            : null}
          {!isObject && (
            <ContentByType content={data[key]} inline noMarkdown={this.props.noMarkdown} />
          )}
        </div>
      );
    });
  }

  renderText(data, tabs = '') {
    let text = '';

    Object.keys(data).forEach((key) => {
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

      // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
      return this.props.intl.formatMessage({ id: 'tree.loading-data' });
    }

    return JSON.stringify(data, null, 20);
  }

  handleUpdateClick = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
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
    const { data, withEdit, compact, noButtons } = this.props;
    const { mode, showTypes, allExpanded, items } = this.state;

    if (!data || !Object.keys(data).length) {
      return compact ? <span>-</span> : <NoData />;
    }

    const textData: string = this.renderText(data);
    const lineCount: number = getLineCount(textData);

    return (
      <Flex>
        {!noButtons && (
          <Toolbar mb>
            <Pull>
              <ButtonGroup>
                {this.isDeep() && [
                  <Button
                    icon="expand-all"
                    text={
                      !compact &&
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                      this.props.intl.formatMessage({ id: 'tree.expand-all' })
                    }
                    onClick={this.handleExpandClick}
                    key="expand-button"
                  />,
                  allExpanded || size(items) > 0 ? (
                    <Button
                      icon="collapse-all"
                      text={
                        !compact &&
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                        this.props.intl.formatMessage({
                          id: 'tree.collapse-all',
                        })
                      }
                      onClick={this.handleCollapseClick}
                      key="collapse-button"
                    />
                  ) : null,
                ]}
                {!this.props.noControls && (
                  <Button
                    icon="code"
                    text={
                      !compact &&
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                      this.props.intl.formatMessage({ id: 'tree.show-types' })
                    }
                    btnStyle={showTypes && 'primary'}
                    onClick={this.handleTypesClick}
                  />
                )}
              </ButtonGroup>
            </Pull>
            {!this.props.noControls && (
              <Pull right>
                <ButtonGroup>
                  <Button
                    text={
                      !compact &&
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                      this.props.intl.formatMessage({ id: 'tree.tree-view' })
                    }
                    btnStyle={mode === 'normal' && 'primary'}
                    onClick={this.handleTreeClick}
                    icon="diagram-tree"
                  />
                  <Button
                    text={
                      !compact &&
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                      this.props.intl.formatMessage({ id: 'tree.copy-view' })
                    }
                    btnStyle={mode === 'copy' && 'primary'}
                    onClick={this.handleCopyClick}
                    icon="clipboard"
                  />
                  {withEdit && (
                    <Button
                      text={
                        !compact &&
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                        this.props.intl.formatMessage({ id: 'tree.edit-mode' })
                      }
                      btnStyle={mode === 'edit' && 'primary'}
                      onClick={this.handleEditClick}
                      icon="edit"
                    />
                  )}
                </ButtonGroup>
              </Pull>
            )}
          </Toolbar>
        )}
        {this.state.mode === 'normal' && (
          <Flex scrollY className="tree-wrapper">
            {/* @ts-ignore ts-migrate(2554) FIXME: Expected 4-5 arguments, but got 2. */}
            {this.renderTree(this.props.data, true)}
          </Flex>
        )}
        {this.state.mode === 'copy' && (
          <textarea
            id="tree-content"
            className="bp3-input bp3-fill"
            defaultValue={textData}
            rows={lineCount > 20 ? 20 : lineCount}
            // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
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
              className="bp3-input bp3-fill"
              defaultValue={this.renderEdit(this.props.data)}
              rows={lineCount > 20 ? 20 : lineCount}
              // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
              cols="50"
            />
            <Alert
              bsStyle="warning"
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
              title={this.props.intl.formatMessage({ id: 'global.warning' })}
            >
              <FormattedMessage id="tree.posting-new-staticdata" />
            </Alert>
            <ButtonGroup>
              <Button
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data: Ob... Remove this comment to see the full error message
                text={this.props.intl.formatMessage({ id: 'tree.update-data' })}
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

export default compose(
  withModal(),
  connect((state) => ({
    settings: state.api.currentUser.data.storage.settings,
  })),
  injectIntl
)(Tree) as any;
