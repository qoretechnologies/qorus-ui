// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import Text from '../../../components/text';
import Tree from '../../../components/tree';
import Tabs, { Pane } from '../../../components/tabs';
import EnhancedTable from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import Pull from '../../../components/Pull';
import LoadMore from '../../../components/LoadMore';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import Search from '../../../containers/search';
import { objectCollectionToArray } from '../../../helpers/interfaces';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import {
  DescriptionColumnHeader,
  DescriptionColumn,
} from '../../../components/DescriptionColumn';

type Props = {
  resources: Object,
  resourceFiles: Array<Object>,
};

const ResourceTable: Function = ({
  resources,
  resourceFiles,
}: Props): React.Element<any> => (
  <Tabs active="resources">
    <Pane name="Resources">
      <EnhancedTable
        collection={objectCollectionToArray(resources)}
        searchBy={['name', 'desc', 'type', 'info']}
        tableId="resources"
        sortDefault={sortDefaults.resources}
      >
        {({
          collection,
          handleSearchChange,
          sortData,
          onSortChange,
          handleLoadMore,
          handleLoadAll,
          canLoadMore,
          limit,
        }: Object) => (
          <Table fixed condensed striped>
            <Thead>
              <FixedRow className="toolbar-row">
                <Th>
                  <Pull right>
                    <LoadMore
                      onLoadMore={handleLoadMore}
                      onLoadAll={handleLoadAll}
                      canLoadMore={canLoadMore}
                      limit={limit}
                    />
                    <Search
                      onSearchUpdate={handleSearchChange}
                      resource="resources"
                    />
                  </Pull>
                </Th>
              </FixedRow>
              <FixedRow {...{ sortData, onSortChange }}>
                <NameColumnHeader />
                <DescriptionColumnHeader />
                <Th className="text" iconName="info-sign" name="type">
                  Type
                </Th>
                <Th className="text" iconName="info-sign">
                  Info
                </Th>
              </FixedRow>
            </Thead>
            <DataOrEmptyTable
              condition={!collection || size(collection) === 0}
              cols={4}
            >
              {props => (
                <Tbody {...props}>
                  {collection.map(
                    (item: Object, key: number): React.Element<any> => (
                      <Tr
                        key={key}
                        first={key === 0}
                        observeElement={key === 0 ? '.pane' : undefined}
                      >
                        <NameColumn name={item.name} />
                        <DescriptionColumn>{item.desc}</DescriptionColumn>
                        <Td className="text">
                          <Text text={item.type} />
                        </Td>
                        <Td className="text">
                          <Tree compact data={item.info} />
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              )}
            </DataOrEmptyTable>
          </Table>
        )}
      </EnhancedTable>
    </Pane>
    <Pane name="Resource files">
      <EnhancedTable
        collection={resourceFiles}
        searchBy={['name', 'type']}
        tableId="resourceFiles"
        sortDefault={sortDefaults.resourceFiles}
      >
        {({
          collection,
          handleSearchChange,
          sortData,
          onSortChange,
          handleLoadMore,
          handleLoadAll,
          canLoadMore,
          limit,
        }: Object) => (
          <Table fixed condensed striped>
            <Thead>
              <FixedRow className="toolbar-row">
                <Th>
                  <Pull right>
                    <LoadMore
                      onLoadMore={handleLoadMore}
                      onLoadAll={handleLoadAll}
                      canLoadMore={canLoadMore}
                      limit={limit}
                    />
                    <Search
                      onSearchUpdate={handleSearchChange}
                      resource="resourceFiles"
                    />
                  </Pull>
                </Th>
              </FixedRow>
              <FixedRow {...{ sortData, onSortChange }}>
                <NameColumnHeader />
                <Th className="narrow" name="type">
                  Type
                </Th>
              </FixedRow>
            </Thead>
            <DataOrEmptyTable
              condition={!collection || size(collection) === 0}
              cols={2}
            >
              {props => (
                <Tbody {...props}>
                  {collection.map(
                    (
                      { name, type }: Object,
                      key: number
                    ): React.Element<any> => (
                      <Tr
                        key={key}
                        first={key === 0}
                        observeElement={key === 0 ? '.pane' : undefined}
                      >
                        <NameColumn name={name} />
                        <Td className="narrow">{type}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              )}
            </DataOrEmptyTable>
          </Table>
        )}
      </EnhancedTable>
    </Pane>
  </Tabs>
);

export default pure(['resources', 'resourceFiles'])(ResourceTable);
