// @flow
import React from 'react';
import compose from 'recompose/compose';
import classnames from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import EnhancedTable from '../EnhancedTable';
import { ActionColumnHeader, ActionColumn } from '../ActionColumn';
import type { EnhancedTableProps } from '../EnhancedTable';
import { sortDefaults } from '../../constants/sort';
import NameColumn, { NameColumnHeader } from '../NameColumn';
import DataOrEmptyTable from '../DataOrEmptyTable';
import { Table, Thead, Tr, Th, Tbody, Td, FixedRow } from '../new_table';
import LoadMore from '../LoadMore';
import Search from '../../containers/search';
import Pull from '../Pull';
import ContentByType from '../ContentByType';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import ConfigItemsModal from './modal';
import Tree from '../tree';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import mapProps from 'recompose/mapProps';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import size from 'lodash/size';
import PaneItem from '../pane_item';
import { Icon } from '@blueprintjs/core';

type ConfigItemsTableProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
  openModal: Function,
  closeModal: Function,
  saveValue: Function,
  intrf: string,
  belongsTo: string,
  showDescription: boolean,
  levelType: string,
  stepId?: number,
};

const ConfigItemsTable: Function = (
  props: ConfigItemsTableProps
): React.Element<any> => (
  <React.Fragment>
    {props.isGrouped && size(props.data) ? (
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
      <ItemsTable {...props} configItemsData={props.configItems.data} />
    )}
  </React.Fragment>
);

let ItemsTable: Function = ({
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  intrfId,
  showDescription,
  handleToggleDescription,
  dispatchAction,
  levelType,
  stepId,
  configItemsData,
  title,
  groupName,
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
                      <Icon iconName="group-objects" /> Group: {groupName}
                    </h5>
                  </Pull>
                )}
                <Pull right>
                  <ButtonGroup>
                    <Button
                      label="Show descriptions"
                      iconName="align-left"
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
                    <Search
                      onSearchUpdate={handleSearchChange}
                      resource="configItems"
                    />
                  </ButtonGroup>
                </Pull>
              </Th>
            </FixedRow>
            <FixedRow {...{ sortData, onSortChange }}>
              <NameColumnHeader />
              <ActionColumnHeader icon="edit">{''}</ActionColumnHeader>
              <Th className="text" iconName="info-sign" name="actual_value">
                Value
              </Th>
              <Th name="strictly_local">Local</Th>
              <Th name="level">Level</Th>
              {!title && <Th name="config_group">Group</Th>}
              <Th iconName="code" name="type" />
            </FixedRow>
          </Thead>
          <DataOrEmptyTable
            condition={!collection || collection.length === 0}
            cols={7}
            small
          >
            {props => (
              <Tbody {...props}>
                {collection.map((item: Object, index: number) => (
                  <React.Fragment>
                    <Tr
                      key={item.name}
                      first={index === 0}
                      className={classnames({
                        'row-alert': !item.value && !item.is_set,
                      })}
                    >
                      <NameColumn
                        name={item.name}
                        hasAlerts={!item.value && !item.is_set}
                        alertTooltip="This config item's value is not set on any level"
                        minimalAlert
                      />
                      <ActionColumn>
                        <ButtonGroup>
                          <Button
                            icon="edit"
                            title="Edit this value"
                            onClick={() => {
                              openModal(
                                <ConfigItemsModal
                                  onClose={closeModal}
                                  item={{ ...item }}
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
                            title="Remove this value"
                            disabled={
                              item.level
                                ? !item.level.startsWith(levelType || '')
                                : true
                            }
                            btnStyle="warning"
                            onClick={() => {
                              dispatchAction(
                                actions[intrf].deleteConfigItem,
                                configItems.id || intrfId,
                                configItems.stepId || stepId,
                                item.name,
                                null
                              );
                            }}
                          />
                        </ButtonGroup>
                      </ActionColumn>
                      <Td
                        className={`text ${item.level === 'workflow' ||
                          item.level === 'global'}`}
                      >
                        {!item.isTemplatedString &&
                        (item.type === 'hash' ||
                          item.type === 'list' ||
                          item.type === '*hash' ||
                          item.type === '*list') ? (
                            <Tree compact data={item.value} />
                          ) : (
                            <ContentByType inTable content={item.value} />
                          )}
                      </Td>
                      <Td className="narrow">
                        <ContentByType content={item.strictly_local} />
                      </Td>
                      <Td className="medium">{item.level}</Td>
                      {!title && (
                        <Td className="medium">{item.config_group}</Td>
                      )}
                      <Td className="narrow">
                        <code>{item.type}</code>
                      </Td>
                    </Tr>
                    {showDescription && (
                      <Tr>
                        <Td className="text" colspan={groupName ? 6 : 7}>
                          {item.desc}
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
    handleToggleDescription: ({ toggleDescription }) => () => {
      toggleDescription(value => !value);
    },
  })
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
