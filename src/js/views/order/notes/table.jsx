/* @flow */
import React from 'react';
import size from 'lodash/size';

import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import EnhancedTable from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import {
  Table,
  FixedRow,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from '../../../components/new_table';
import {
  DescriptionColumnHeader,
  DescriptionColumn,
} from '../../../components/DescriptionColumn';
import {
  AuthorColumnHeader,
  AuthorColumn,
} from '../../../components/AuthorColumn';
import { DateColumnHeader, DateColumn } from '../../../components/DateColumn';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import ContentByType from '../../../components/ContentByType';

type Props = {
  notes: Array<Object>,
};

const NotesList: Function = ({ notes }: Props): React.Element<any> => (
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
      limit,
      sortData,
      onSortChange,
      canLoadMore,
    }) => (
      <Table striped condensed fixed>
        <Thead>
          <FixedRow>
            <DescriptionColumnHeader name="note">Note</DescriptionColumnHeader>
            <AuthorColumnHeader name="username" />
            <Th icon="saved" />
            <DateColumnHeader />
            <DateColumnHeader name="modified">Modified</DateColumnHeader>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={5}>
          {props => (
            <Tbody {...props}>
              {collection.map((note: Object, index: number) => (
                <Tr first={index === 0} key={index}>
                  <DescriptionColumn>{note.note}</DescriptionColumn>
                  <AuthorColumn>{note.username}</AuthorColumn>
                  <Td className="tiny">
                    <ContentByType content={note.saved} />
                  </Td>
                  <DateColumn>{note.created}</DateColumn>
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
