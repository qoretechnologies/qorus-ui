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
import compose from 'recompose/compose';
import modal from '../../../hocomponents/modal';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import ResourceFileModal from './modals/resourceFile';
import { FormattedMessage, injectIntl } from 'react-intl';

type Props = {
  resources: Object,
  resourceFiles: Array<Object>,
  openModal: Function,
  closeModal: Function,
  id: number,
};

const ResourceTable: Function = ({
  resources,
  resourceFiles,
  openModal,
  closeModal,
  id,
  intl,
}: Props): React.Element<any> => (
  <Tabs active="resources">
    <Pane name="Resources" suffix={size(resources)}>
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
          loadMoreCurrent,
          loadMoreTotal,
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
                      currentCount={loadMoreCurrent}
                      total={loadMoreTotal}
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
                <Th className="text" icon="info-sign" name="type">
                  <FormattedMessage id="table.type" />
                </Th>
                <Th className="text" icon="info-sign">
                  <FormattedMessage id="table.info" />
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
                      <Tr key={key} first={key === 0}>
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
    <Pane name="Resource files" suffix={size(resourceFiles)}>
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
          loadMoreCurrent,
          loadMoreTotal,
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
                      currentCount={loadMoreCurrent}
                      total={loadMoreTotal}
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
                  <FormattedMessage id="table.type" />
                </Th>
                <Th>
                  <FormattedMessage id="table.content" />
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
                      <Tr key={key} first={key === 0}>
                        <NameColumn name={name} />
                        <Td className="narrow">{type}</Td>
                        <Td className="medium">
                          <ButtonGroup>
                            <Button
                              text={intl.formatMessage({
                                id: 'button.view-contents',
                              })}
                              onClick={() => {
                                openModal(
                                  <ResourceFileModal
                                    id={id}
                                    name={name}
                                    onClose={closeModal}
                                  />
                                );
                              }}
                            />
                          </ButtonGroup>
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
  </Tabs>
);

export default compose(
  modal(),
  pure(['resources', 'resourceFiles']),
  injectIntl
)(ResourceTable);
