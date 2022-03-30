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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Tabs active="resources">
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; suffix: a... Remove this comment to see the full error message
    <Pane name="Resources" suffix={size(resources)}>
      <EnhancedTable
        collection={objectCollectionToArray(resources)}
        searchBy={['name', 'desc', 'type', 'info']}
        tableId="resources"
        sortDefault={sortDefaults.resources}
      >
        {({
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'collection' does not exist on type 'Obje... Remove this comment to see the full error message
          collection,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleSearchChange' does not exist on ty... Remove this comment to see the full error message
          handleSearchChange,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'sortData' does not exist on type 'Object... Remove this comment to see the full error message
          sortData,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSortChange' does not exist on type 'Ob... Remove this comment to see the full error message
          onSortChange,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleLoadMore' does not exist on type '... Remove this comment to see the full error message
          handleLoadMore,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleLoadAll' does not exist on type 'O... Remove this comment to see the full error message
          handleLoadAll,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'loadMoreCurrent' does not exist on type ... Remove this comment to see the full error message
          loadMoreCurrent,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'loadMoreTotal' does not exist on type 'O... Remove this comment to see the full error message
          loadMoreTotal,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'canLoadMore' does not exist on type 'Obj... Remove this comment to see the full error message
          canLoadMore,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'limit' does not exist on type 'Object'.
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
                    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (item: Object, key: number): React.Element<any> => (
                      <Tr key={key} first={key === 0}>
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        <NameColumn name={item.name} />
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
                        <DescriptionColumn>{item.desc}</DescriptionColumn>
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                          <Text text={item.type} />
                        </Td>
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; suffix: a... Remove this comment to see the full error message
    <Pane name="Resource files" suffix={size(resourceFiles)}>
      <EnhancedTable
        collection={resourceFiles}
        searchBy={['name', 'type']}
        tableId="resourceFiles"
        sortDefault={sortDefaults.resourceFiles}
      >
        {({
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'collection' does not exist on type 'Obje... Remove this comment to see the full error message
          collection,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleSearchChange' does not exist on ty... Remove this comment to see the full error message
          handleSearchChange,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'sortData' does not exist on type 'Object... Remove this comment to see the full error message
          sortData,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSortChange' does not exist on type 'Ob... Remove this comment to see the full error message
          onSortChange,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleLoadMore' does not exist on type '... Remove this comment to see the full error message
          handleLoadMore,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleLoadAll' does not exist on type 'O... Remove this comment to see the full error message
          handleLoadAll,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'canLoadMore' does not exist on type 'Obj... Remove this comment to see the full error message
          canLoadMore,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'loadMoreCurrent' does not exist on type ... Remove this comment to see the full error message
          loadMoreCurrent,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'loadMoreTotal' does not exist on type 'O... Remove this comment to see the full error message
          loadMoreTotal,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'limit' does not exist on type 'Object'.
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
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                      { name, type }: Object,
                      key: number
                    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
