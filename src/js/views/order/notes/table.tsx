/* @flow */
import size from 'lodash/size';
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { AuthorColumn, AuthorColumnHeader } from '../../../components/AuthorColumn';
import ContentByType from '../../../components/ContentByType';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DateColumn, DateColumnHeader } from '../../../components/DateColumn';
import { DescriptionColumn, DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import EnhancedTable from '../../../components/EnhancedTable';
import LoadMore from '../../../components/LoadMore';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';

type Props = {
  notes: Array<Object>;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const NotesList: Function = ({ notes }: Props) => (
  <EnhancedTable
    searchBy={['created', 'modified', 'username', 'note']}
    collection={notes}
    sortDefault={sortDefaults.notes}
    tableId="notes"
  >
    {({
      collection,
      handleSearchChange,
      handleLoadMore,
      handleLoadAll,
      loadMoreCurrent,
      loadMoreTotal,
      limit,
      sortData,
      onSortChange,
      canLoadMore,
    }) => (
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
              <Search onSearchUpdate={handleSearchChange} resource="notes" />
            </Pull>
          </FixedRow>
          <FixedRow {...{ onSortChange, sortData }}>
            <DescriptionColumnHeader name="note">Note</DescriptionColumnHeader>
            <AuthorColumnHeader name="username" />
            <Th icon="saved" name="saved" />
            <DateColumnHeader />
            <DateColumnHeader name="modified">Modified</DateColumnHeader>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={5}>
          {(props) => (
            <Tbody {...props}>
              {collection.map((note: any, index: number) => (
                <Tr first={index === 0} key={index}>
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'note' does not exist on type 'Object'. */}
                  <DescriptionColumn>{note.note}</DescriptionColumn>
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message */}
                  <AuthorColumn>{note.username}</AuthorColumn>
                  <Td className="tiny">
                    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'saved' does not exist on type 'Object'. */}
                    <ContentByType content={note.saved} />
                  </Td>
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message */}
                  <DateColumn>{note.created}</DateColumn>
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'modified' does not exist on type 'Object... Remove this comment to see the full error message */}
                  <DateColumn>{note.modified}</DateColumn>
                </Tr>
              ))}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

export default onlyUpdateForKeys(['notes'])(NotesList);
