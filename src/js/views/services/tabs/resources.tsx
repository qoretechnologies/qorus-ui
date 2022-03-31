// @flow
import size from 'lodash/size';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DescriptionColumn, DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import EnhancedTable from '../../../components/EnhancedTable';
import LoadMore from '../../../components/LoadMore';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import Tabs, { Pane } from '../../../components/tabs';
import Text from '../../../components/text';
import Tree from '../../../components/tree';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import { objectCollectionToArray } from '../../../helpers/interfaces';
import modal from '../../../hocomponents/modal';
import ResourceFileModal from './modals/resourceFile';

type Props = {
  resources: any;
  resourceFiles: Array<Object>;
  openModal: Function;
  closeModal: Function;
  id: number;
};

const ResourceTable: Function = ({
  resources,
  resourceFiles,
  openModal,
  closeModal,
  id,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Tabs active="resources">
    {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; suffix: a... Remove this comment to see the full error message */}
    <Pane name="Resources" suffix={size(resources)}>
      <EnhancedTable
        collection={objectCollectionToArray(resources)}
        searchBy={['name', 'desc', 'type', 'info']}
        tableId="resources"
        sortDefault={sortDefaults.resources}
      >
        {({
          // @ts-ignore ts-migrate(2339) FIXME: Property 'collection' does not exist on type 'Obje... Remove this comment to see the full error message
          collection,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'handleSearchChange' does not exist on ty... Remove this comment to see the full error message
          handleSearchChange,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sortData' does not exist on type 'Object... Remove this comment to see the full error message
          sortData,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'onSortChange' does not exist on type 'Ob... Remove this comment to see the full error message
          onSortChange,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'handleLoadMore' does not exist on type '... Remove this comment to see the full error message
          handleLoadMore,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'handleLoadAll' does not exist on type 'O... Remove this comment to see the full error message
          handleLoadAll,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'loadMoreCurrent' does not exist on type ... Remove this comment to see the full error message
          loadMoreCurrent,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'loadMoreTotal' does not exist on type 'O... Remove this comment to see the full error message
          loadMoreTotal,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'canLoadMore' does not exist on type 'Obj... Remove this comment to see the full error message
          canLoadMore,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'limit' does not exist on type 'Object'.
          limit,
        }: any) => (
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
                    <Search onSearchUpdate={handleSearchChange} resource="resources" />
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
            <DataOrEmptyTable condition={!collection || size(collection) === 0} cols={4}>
              {(props) => (
                <Tbody {...props}>
                  {collection.map(
                    // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (item: any, key: number) => (
                      <Tr key={key} first={key === 0}>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                        <NameColumn name={item.name} />
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */}
                        <DescriptionColumn>{item.desc}</DescriptionColumn>
                        <Td className="text">
                          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
                          <Text text={item.type} />
                        </Td>
                        <Td className="text">
                          {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
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
    {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; suffix: a... Remove this comment to see the full error message */}
    <Pane name="Resource files" suffix={size(resourceFiles)}>
      <EnhancedTable
        collection={resourceFiles}
        searchBy={['name', 'type']}
        tableId="resourceFiles"
        sortDefault={sortDefaults.resourceFiles}
      >
        {({
          // @ts-ignore ts-migrate(2339) FIXME: Property 'collection' does not exist on type 'Obje... Remove this comment to see the full error message
          collection,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'handleSearchChange' does not exist on ty... Remove this comment to see the full error message
          handleSearchChange,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sortData' does not exist on type 'Object... Remove this comment to see the full error message
          sortData,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'onSortChange' does not exist on type 'Ob... Remove this comment to see the full error message
          onSortChange,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'handleLoadMore' does not exist on type '... Remove this comment to see the full error message
          handleLoadMore,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'handleLoadAll' does not exist on type 'O... Remove this comment to see the full error message
          handleLoadAll,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'canLoadMore' does not exist on type 'Obj... Remove this comment to see the full error message
          canLoadMore,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'loadMoreCurrent' does not exist on type ... Remove this comment to see the full error message
          loadMoreCurrent,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'loadMoreTotal' does not exist on type 'O... Remove this comment to see the full error message
          loadMoreTotal,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'limit' does not exist on type 'Object'.
          limit,
        }: any) => (
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
                    <Search onSearchUpdate={handleSearchChange} resource="resourceFiles" />
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
            <DataOrEmptyTable condition={!collection || size(collection) === 0} cols={2}>
              {(props) => (
                <Tbody {...props}>
                  {collection.map(
                    (
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                      { name, type }: any,
                      key: number
                      // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    ) => (
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
                                  <ResourceFileModal id={id} name={name} onClose={closeModal} />
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

export default compose(modal(), pure(['resources', 'resourceFiles']), injectIntl)(ResourceTable);
