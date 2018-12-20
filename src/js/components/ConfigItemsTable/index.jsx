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
import Flex from '../Flex';
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

type ConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
};

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
}: ConfigItemsContainerProps): React.Element<any> => (
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
                        <Th name="default_value">Default</Th>
                        <Th icon="info-sign" name="value">
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
                      cols={7}
                    >
                      {props => (
                        <Tbody {...props}>
                          {collection.map((item: Object, index: number) => (
                            <Tr
                              key={index}
                              first={index === 0}
                              observeElement={index === 0 ? '.pane' : undefined}
                            >
                              <NameColumn name={item.name} />
                              <Td className="text">{item.default_value}</Td>
                              {item.type === 'date' ? (
                                <Td className="large">
                                  <DatePicker
                                    date={item.value}
                                    onApplyDate={(newValue: any) =>
                                      dispatchAction(
                                        actions[intrf].updateConfigItem,
                                        item.id,
                                        item.name,
                                        newValue
                                      )
                                    }
                                    noButtons
                                    small
                                  />
                                </Td>
                              ) : (
                                <EditableCell
                                  className="text large"
                                  value={item.value}
                                  onSave={(newValue: any) =>
                                    dispatchAction(
                                      actions[intrf].updateConfigItem,
                                      item.id,
                                      item.name,
                                      newValue
                                    )
                                  }
                                />
                              )}
                              <Td className="narrow">{item.type}</Td>
                              <Td className="narrow">
                                <Icon
                                  iconName={
                                    item.mandatory ? 'small-tick' : 'cross'
                                  }
                                  intent={item.mandatory && Intent.SUCCESS}
                                />
                              </Td>
                              <DescriptionColumn>{item.desc}</DescriptionColumn>
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

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
