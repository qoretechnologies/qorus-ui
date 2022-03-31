// @flow
import { Icon } from '@blueprintjs/core';
import classnames from 'classnames';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import { ActionColumn, ActionColumnHeader } from '../ActionColumn';
import ContentByType from '../ContentByType';
import DataOrEmptyTable from '../DataOrEmptyTable';
import type { EnhancedTableProps } from '../EnhancedTable';
import EnhancedTable from '../EnhancedTable';
import { getTypeFromValue, maybeParseYaml } from '../Field/validations';
import LoadMore from '../LoadMore';
import NameColumn, { NameColumnHeader } from '../NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../new_table';
import Pull from '../Pull';
import Tree from '../tree';
import ConfigItemsModal from './modal';

type ConfigItemsTableProps = {
  items: Object,
  dispatchAction: Function,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string,
  openModal: Function,
  closeModal: Function,
  saveValue: Function,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string,
  belongsTo: string,
  showDescription: boolean,
  levelType: string,
  stepId?: number,
};

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ConfigItemsTable: Function = (props: ConfigItemsTableProps): React.Element<any> => (
  <React.Fragment>
    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'isGrouped' does not exist on type 'Confi... Remove this comment to see the full error message */ }
    {props.isGrouped && size(props.data) ? (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'ConfigItem... Remove this comment to see the full error message
      map(props.data, (configItemsData, groupName) => (
        <>
          <br />
          <ItemsTable
            {...props}
            groupName={groupName}
            configItemsData={configItemsData}
            title={groupName}
          />
          <br />
        </>
      ))
    ) : (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
      <ItemsTable {...props} configItemsData={props.configItems.data} />
    )}
  </React.Fragment>
);

export const getItemType = (type, value) => {
  if (type === 'any' || type === 'auto') {
    return getTypeFromValue(maybeParseYaml(value));
  }

  return type.replace('*', '');
};

export const Value = ({ item, useDefault }) => {
  const [showValue, setShowValue] = useState(!item.sensitive);
  const [hideTimer, setHideTimer] = useState(null);

  useEffect(() => {
    setShowValue(!item.sensitive);
  }, [item.sensitive]);

  useEffect(() => {
    return () => {
      clearTimeout(hideTimer);
    };
  }, [hideTimer]);

  const value = useDefault ? item.default_value : item.value;
  const yamlValue = useDefault ? item.yamlData?.default_value : item.yamlData?.value;

  if (!showValue) {
    return (
      <div
        onClick={() => {
          setHideTimer(() => {
            return setTimeout(() => {
              setShowValue(false);
            }, 30000);
          });
          setShowValue(true);
        }}
        style={{
          position: 'absolute',
          width: '70%',
          top: '5px',
          bottom: '5px',
          left: '5px',
          backgroundColor: '#000',
          cursor: 'pointer',
          color: '#fff',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        {' '}
        Click to reveal{' '}
      </div>
    );
  }

  if (isUndefined(value)) {
    return <span> - </span>;
  }
  if (isNull(value)) {
    return <span> null </span>;
  }
  if (item.isTemplatedString) {
    return <ContentByType inTable content={value} />;
  }

  const type =
    item.type === 'auto' || item.type === 'any'
      ? item.value_true_type || getItemType(item.type, yamlValue)
      : item.type;

  if (isObject(item.value) || isArray(item.value) || type === 'hash' || type === 'list') {
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    return <Tree compact data={item.value} conentInline noMarkdown />;
  }

  return <ContentByType inTable content={item.value} noMarkdown baseType={type} />;
};

let ItemsTable: Function = ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intrfId' does not exist on type 'ConfigI... Remove this comment to see the full error message
  intrfId,
  showDescription,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleToggleDescription' does not exist ... Remove this comment to see the full error message
  handleToggleDescription,
  dispatchAction,
  levelType,
  stepId,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'configItemsData' does not exist on type ... Remove this comment to see the full error message
  configItemsData,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'title' does not exist on type 'ConfigIte... Remove this comment to see the full error message
  title,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'groupName' does not exist on type 'Confi... Remove this comment to see the full error message
  groupName,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'ConfigItem... Remove this comment to see the full error message
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: ConfigItemsTableProps): React.Element<any> => (
  <React.Fragment>
    <EnhancedTable
      collection={configItemsData}
      searchBy={['name', 'default_value', 'value', 'type', 'desc']}
      tableId={belongsTo}
      sortDefault={sortDefaults.configItems}
    >
      {({
        collection,
        canLoadMore,
        handleLoadMore,
        handleLoadAll,
        loadMoreTotal,
        loadMoreCurrent,
        limit,
        sortData,
        onSortChange,
        handleSearchChange,
      }: EnhancedTableProps) => (
        <Table striped condensed fixed hover>
          <Thead>
            <FixedRow className="toolbar-row">
              <Th>
                {groupName && (
                  <Pull>
                    <h5 style={{ lineHeight: '30px' }}>
                      <Icon icon="group-objects" /> <FormattedMessage id="table.group" />:{' '}
                      {groupName}
                    </h5>
                  </Pull>
                )}
                <Pull right>
                  <ButtonGroup>
                    <Button
                      label={intl.formatMessage({
                        id: 'button.show-descriptions',
                      })}
                      icon="align-left"
                      btnStyle={showDescription ? 'primary' : ''}
                      onClick={handleToggleDescription}
                    />

                    <LoadMore
                      canLoadMore={canLoadMore}
                      onLoadMore={handleLoadMore}
                      onLoadAll={handleLoadAll}
                      currentCount={loadMoreCurrent}
                      total={loadMoreTotal}
                      limit={limit}
                    />
                    <Search onSearchUpdate={handleSearchChange} resource="configItems" />
                  </ButtonGroup>
                </Pull>
              </Th>
            </FixedRow>
            <FixedRow {...{ sortData, onSortChange }}>
              <NameColumnHeader />
              <ActionColumnHeader icon="edit" />
              <Th className="text" icon="info-sign" name="actual_value">
                <FormattedMessage id="table.value" />
              </Th>
              <Th name="strictly_local">
                <FormattedMessage id="table.local" />
              </Th>
              <Th name="level">
                <FormattedMessage id="table.level" />
              </Th>
              {!title && (
                <Th name="config_group">
                  <FormattedMessage id="table.group" />
                </Th>
              )}
              <Th icon="code" name="type" />
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={!collection || collection.length === 0} cols={7} small>
            {(props) => (
              <Tbody {...props}>
                {collection.map((item: Object, index: number) => (
                  <React.Fragment>
                    <Tr
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                      key={item.name}
                      first={index === 0}
                      className={classnames({
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
                        'row-alert': !item.value && !item.is_set,
                      })}
                    >
                      <NameColumn
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        name={item.name}
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
                        hasAlerts={!item.value && !item.is_set}
                        alertTooltip={intl.formatMessage({
                          id: 'table.cfg-item-val-no-level-set',
                        })}
                        minimalAlert
                      />
                      <ActionColumn>
                        <ButtonGroup>
                          <Button
                            icon="edit"
                            title={intl.formatMessage({
                              id: 'button.edit-this-value',
                            })}
                            onClick={() => {
                              openModal(
                                <ConfigItemsModal
                                  onClose={closeModal}
                                  item={{ ...item }}
                                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                                  belongsTo={belongsTo}
                                  onSubmit={saveValue}
                                  intrf={intrf}
                                  intrfId={configItems.id || intrfId}
                                  stepId={configItems.stepId || stepId}
                                  levelType={levelType}
                                />
                              );
                            }}
                          />
                          <Button
                            icon="cross"
                            title={intl.formatMessage({
                              id: 'button.remove-this-value',
                            })}
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                            disabled={item.level ? !item.level.startsWith(levelType || '') : true}
                            btnStyle="warning"
                            onClick={() => {
                              dispatchAction(
                                actions[intrf].deleteConfigItem,
                                configItems.id || intrfId,
                                configItems.stepId || stepId,
                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                                item.name,
                                null
                              );
                            }}
                          />
                        </ButtonGroup>
                      </ActionColumn>
                      <Td
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                        className={`text ${item.level === 'workflow' || item.level === 'global'}`}
                      >
                        { /* @ts-expect-error ts-migrate(2741) FIXME: Property 'useDefault' is missing in type '{ item: ... Remove this comment to see the full error message */ }
                        <Value item={item} />
                      </Td>
                      <Td className="narrow">
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'strictly_local' does not exist on type '... Remove this comment to see the full error message */ }
                        <ContentByType content={item.strictly_local} />
                      </Td>
                      { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'. */ }
                      <Td className="medium">{item.level}</Td>
                      { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'config_group' does not exist on type 'Ob... Remove this comment to see the full error message */ }
                      {!title && <Td className="medium">{item.config_group}</Td>}
                      <Td className="narrow">
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */ }
                        <code>{item.type}</code>
                      </Td>
                    </Tr>
                    {showDescription && (
                      <Tr>
                        <Td className="text" colspan={groupName ? 6 : 7}>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */ }
                          <ContentByType inTable content={item.desc} />
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                ))}
              </Tbody>
            )}
          </DataOrEmptyTable>
        </Table>
      )}
    </EnhancedTable>
  </React.Fragment>
);

ItemsTable = compose(
  withState('showDescription', 'toggleDescription', false),
  withHandlers({
    handleToggleDescription:
      ({ toggleDescription }) =>
      () => {
        toggleDescription((value) => !value);
      },
  }),
  injectIntl
)(ItemsTable);

export default compose(
  withDispatch(),
  mapProps(({ configItems, ...rest }) => ({
    data: reduce(
      configItems.data,
      (newItems, item, itemName) => {
        // Check if this group exists
        if (!newItems[item.config_group]) {
          newItems[item.config_group] = [];
        }
        // Push the item
        newItems[item.config_group].push(item);
        return newItems;
      },
      {}
    ),
    configItems,
    ...rest,
  })),
  onlyUpdateForKeys(['configItems', 'showDescription', 'isGrouped'])
)(ConfigItemsTable);
