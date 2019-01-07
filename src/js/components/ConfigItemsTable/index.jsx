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
import { Icon, Intent } from '@blueprintjs/core';
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
  function saveValue(newValue, id, name) {
    dispatchAction(actions[intrf].updateConfigItem, id, name, newValue);
  }

  function renderValueContent(item) {
    switch (item.type) {
      case 'bool':
        return (
          <Td className="text large">
            <Dropdown>
              <Control small>{item.value ? 'True' : 'False'}</Control>
              <Item
                title="True"
                onClick={() => {
                  saveValue(true, item.id, item.name);
                }}
              />
              <Item
                title="False"
                onClick={() => {
                  saveValue(false, item.id, item.name);
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
                saveValue(newValue, item.id, item.name);
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
              saveValue(newValue, item.id, item.name);
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
                          <Th className="text" icon="info-sign" name="value">
                            Value
                          </Th>
                          <Th icon="code" name="type">
                            Type
                          </Th>
                          <Th icon="asterisk">Req.</Th>
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
                              <Tr
                                key={index}
                                first={index === 0}
                                observeElement={
                                  index === 0 ? '.pane' : undefined
                                }
                              >
                                <NameColumn name={item.name} />
                                <Td className="text">{item.default_value}</Td>
                                {renderValueContent(item)}
                                <Td className="narrow">{item.type}</Td>
                                <Td className="narrow">
                                  <Icon
                                    iconName={
                                      item.mandatory ? 'small-tick' : 'cross'
                                    }
                                    intent={item.mandatory && Intent.SUCCESS}
                                  />
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
  withDispatch(),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
