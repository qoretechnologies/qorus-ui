import React from 'react';
import EnhancedTable from '../../../components/EnhancedTable';
import {
  Table,
  Thead,
  Th,
  FixedRow,
  Tbody,
  Tr,
  Td,
} from '../../../components/new_table';
import Pull from '../../../components/Pull';
import Search from '../../../containers/search';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import size from 'lodash/size';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import {
  DescriptionColumnHeader,
  DescriptionColumn,
} from '../../../components/DescriptionColumn';
import { injectIntl } from 'react-intl';
import ContentByType from '../../../components/ContentByType';

const ProvidersTable = ({ fields, intl }) => {
  return (
    <EnhancedTable
      collection={fields}
      searchBy={['name', 'desc', 'type.name']}
      tableId="fields"
    >
      {({ handleSearchChange, collection }) => (
        <Table fixed condensed striped>
          <Thead>
            <FixedRow className="toolbar-row">
              <Th>
                <Pull right>
                  <Search
                    onSearchUpdate={handleSearchChange}
                    resource="providers"
                  />
                </Pull>
              </Th>
            </FixedRow>
            <FixedRow>
              <NameColumnHeader />
              <DescriptionColumnHeader />
              <NameColumnHeader
                title={intl.formatMessage({ id: 'table.type' })}
              />
              <Th icon="asterisk" />
              <Th>{intl.formatMessage({ id: 'table.accepted_types' })}</Th>
              <Th>{intl.formatMessage({ id: 'table.returned_types' })}</Th>
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={size(collection) === 0} cols={1}>
            {props =>
              // @ts-expect-error ts-migrate(1345) FIXME: An expression of type 'void' cannot be tested for ... Remove this comment to see the full error message
              console.log(collection) || (
                <Tbody {...props}>
                  {collection.map(
                    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (provider: Object, index: number): React.Element<any> => (
                      <Tr first={index === 0}>
                        <NameColumn
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                          name={`${[...Array(provider.level * 4)]
                            .map((_, index) => (index === 0 ? '-' : '-'))
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                            .join('')} ${provider.name}`}
                        />
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
                        <DescriptionColumn>{provider.desc}</DescriptionColumn>
                        <NameColumn
                          className="text"
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                          name={provider.type.name}
                        />
                        <Td className="narrow">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                          <ContentByType content={provider.type.mandatory} />
                        </Td>
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                          {provider.type.types_accepted?.join()}
                        </Td>
                        <Td className="text medium">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                          {provider.type.types_returned?.join()}
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              )
            }
          </DataOrEmptyTable>
        </Table>
      )}
    </EnhancedTable>
  );
};

export default injectIntl(ProvidersTable);
