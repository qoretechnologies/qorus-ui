// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  EditableCell,
  Td,
  FixedRow,
} from '../new_table';
import map from 'lodash/map';
import size from 'lodash/size';

import NameColumn, { NameColumnHeader } from '../NameColumn';
import DataOrEmptyTable from '../DataOrEmptyTable';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import ExpandableItem from '../ExpandableItem';

import NoDataIf from '../NoDataIf';
import LoadMore from '../LoadMore';
import Search from '../../containers/search';
import EnhancedTable from '../EnhancedTable';
import { ActionColumnHeader, ActionColumn } from '../ActionColumn';
import type { EnhancedTableProps } from '../EnhancedTable';
import { sortDefaults } from '../../constants/sort';
import Pull from '../Pull';

import ContentByType from '../ContentByType';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import modal from '../../hocomponents/modal';
import ConfigItemsModal from './modal';
import Tree from '../tree';

type ConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
  openModal: Function,
};

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
  showDescription,
  openModal,
  closeModal,
  intrfId,
}: ConfigItemsContainerProps): React.Element<any> => {
  const saveValue = (
    item,
    belongsTo,
    newValue,
    isOverride: boolean,
    onSuccess,
    stepId?
  ) => {
    dispatchAction(
      actions[intrf].updateConfigItem,
      item.id,
      stepId,
      item.name,
      newValue,
      belongsTo,
      isOverride,
      onSuccess
    );
  };

  return (
    <NoDataIf condition={size(items) === 0} big>
      {() => (
        <div>
          {map(items, (configItems: Array<Object>, belongsTo: string) => (
            <ExpandableItem title={belongsTo} key={belongsTo} show>
              {() => (
                <EnhancedTable
                  collection={configItems.data}
                  searchBy={[
                    'name',
                    'default_value',
                    'value',
                    'type',
                    'mandatory',
                    'desc',
                  ]}
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
                    <Table striped condensed fixed>
                      <Thead>
                        <FixedRow className="toolbar-row">
                          <Pull right>
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
                          </Pull>
                        </FixedRow>
                        <FixedRow {...{ sortData, onSortChange }}>
                          <NameColumnHeader />
                          <ActionColumnHeader icon="edit">
                            {''}
                          </ActionColumnHeader>
                          <Th
                            className="text"
                            iconName="info-sign"
                            name="actual_value"
                          >
                            Value
                          </Th>

                          <Th className="text" name="default_value">
                            Default val.
                          </Th>
                          <Th iconName="code" name="type" />
                          <Th name="level">Level</Th>
                          <Th iconName="asterisk" />
                        </FixedRow>
                      </Thead>
                      <DataOrEmptyTable
                        condition={!collection || collection.length === 0}
                        cols={7}
                        small
                      >
                        {props => (
                          <Tbody {...props}>
                            {collection.map((item: Object, index: number) => {
                              const value =
                                belongsTo === 'Global Config'
                                  ? item.value
                                  : item.actual_value;
                              return (
                                <React.Fragment>
                                  <Tr key={item.name} first={index === 0}>
                                    <NameColumn name={item.name} />
                                    <ActionColumn>
                                      <ButtonGroup>
                                        <Button
                                          icon="edit"
                                          title="Edit this value"
                                          onClick={() => {
                                            openModal(
                                              <ConfigItemsModal
                                                onClose={closeModal}
                                                item={item}
                                                belongsTo={belongsTo}
                                                onSubmit={saveValue}
                                                intrf={intrf}
                                                intrfId={configItems.id}
                                                stepId={configItems.stepId}
                                              />
                                            );
                                          }}
                                        />
                                      </ButtonGroup>
                                    </ActionColumn>
                                    <Td className="text">
                                      {item.type === 'hash' ||
                                      item.type === 'list' ? (
                                          <Tree compact data={value} />
                                        ) : (
                                          <ContentByType
                                            inTable
                                            content={value}
                                          />
                                        )}
                                    </Td>
                                    <Td className="text">
                                      {item.type === 'hash' ||
                                      item.type === 'list' ? (
                                          <Tree
                                            compact
                                            data={item.default_value}
                                          />
                                        ) : (
                                          <ContentByType
                                            inTable
                                            content={item.default_value}
                                          />
                                        )}
                                    </Td>
                                    <Td className="narrow">
                                      <code>{item.type}</code>
                                    </Td>
                                    <Td className="narrow">{item.level}</Td>
                                    <Td className="tiny">
                                      <ContentByType content={item.mandatory} />
                                    </Td>
                                  </Tr>
                                  {showDescription && (
                                    <Tr>
                                      <Td className="text" colspan={5}>
                                        {item.desc}
                                      </Td>
                                    </Tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </Tbody>
                        )}
                      </DataOrEmptyTable>
                    </Table>
                  )}
                </EnhancedTable>
              )}
            </ExpandableItem>
          ))}
        </div>
      )}
    </NoDataIf>
  );
};

export default compose(
  connect((state: Object) => ({
    globalConfig: state.api.system.globalConfig,
  })),
  modal(),
  withDispatch(),
  mapProps(({ globalConfig, globalItems, ...rest }) => ({
    globalConfig: globalConfig.filter(configItem =>
      includes(
        globalItems ? Object.keys(globalItems) : [],
        configItem.name || configItem.item
      )
    ),
    ...rest,
  })),
  mapProps(({ items, globalConfig, ...rest }) => ({
    items: { 'Global Config': { data: globalConfig }, ...items },
    ...rest,
  })),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
