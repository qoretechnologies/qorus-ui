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
import DatePicker from '../datepicker';
import NoDataIf from '../NoDataIf';
import LoadMore from '../LoadMore';
import Search from '../../containers/search';
import EnhancedTable from '../EnhancedTable';
import {
  DescriptionColumn,
  DescriptionColumnHeader,
} from '../DescriptionColumn';
import type { EnhancedTableProps } from '../EnhancedTable';
import { sortDefaults } from '../../constants/sort';
import Pull from '../Pull';
import Dropdown, { Item, Control } from '../../components/dropdown';
import ContentByType from '../ContentByType';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import includes from 'lodash/includes';

type ConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
};

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
}: ConfigItemsContainerProps): React.Element<any> => {
  function renderValueContent (item: Object, belongsTo: string) {
    const saveValue = newValue => {
      dispatchAction(
        actions[intrf].updateConfigItem,
        item.id,
        item.name,
        newValue,
        belongsTo
      );
    };

    switch (item.type) {
      case 'bool':
        return (
          <Td className="text large">
            <Dropdown>
              <Control small>{item.value ? 'True' : 'False'}</Control>
              <Item
                title="True"
                onClick={() => {
                  saveValue(true);
                }}
              />
              <Item
                title="False"
                onClick={() => {
                  saveValue(false);
                }}
              />
            </Dropdown>
          </Td>
        );
      case 'date':
        return (
          <Td className="text large">
            <DatePicker
              date={item.value}
              onApplyDate={(newValue: any) => {
                saveValue(newValue);
              }}
              noButtons
              small
            />
          </Td>
        );
      default:
        return (
          <EditableCell
            className="text large"
            value={item.value}
            onSave={(newValue: any) => {
              saveValue(newValue);
            }}
          />
        );
    }
  }

  return (
    <NoDataIf condition={size(items) === 0} big>
      {() => (
        <div>
          {map(items, (configItems: Array<Object>, belongsTo: string) => (
            <ExpandableItem title={belongsTo} key={belongsTo} show>
              {() => (
                <EnhancedTable
                  collection={configItems}
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
                          <Th className="text" name="default_value">
                            Default
                          </Th>
                          <Th
                            className="text"
                            iconName="info-sign"
                            name="value"
                          >
                            Value
                          </Th>
                          <Th iconName="code" name="type">
                            Type
                          </Th>
                          <Th iconName="asterisk">Req.</Th>
                          <DescriptionColumnHeader />
                        </FixedRow>
                      </Thead>
                      <DataOrEmptyTable
                        condition={!collection || collection.length === 0}
                        cols={6}
                      >
                        {props => (
                          <Tbody {...props}>
                            {collection.map((item: Object, index: number) => (
                              <Tr key={item.name} first={index === 0}>
                                <NameColumn name={item.name} />
                                <Td className="text">
                                  <ContentByType content={item.default_value} />
                                </Td>
                                {renderValueContent(item, belongsTo)}
                                <Td className="narrow">
                                  <code>{item.type}</code>
                                </Td>
                                <Td className="narrow">
                                  <ContentByType content={item.mandatory} />
                                </Td>
                                <DescriptionColumn>
                                  {item.desc}
                                </DescriptionColumn>
                              </Tr>
                            ))}
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
  withDispatch(),
  mapProps(({ globalConfig, globalItems, ...rest }) => ({
    globalConfig: globalConfig.filter(configItem =>
      includes(globalItems ? Object.keys(globalItems) : [], configItem.name)
    ),
    ...rest,
  })),
  mapProps(({ items, globalConfig, ...rest }) => ({
    items: { 'Global Config': globalConfig, ...items },
    ...rest,
  })),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
