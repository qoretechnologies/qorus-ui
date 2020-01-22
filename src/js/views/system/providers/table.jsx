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
              console.log(collection) || (
                <Tbody {...props}>
                  {collection.map(
                    (provider: Object, index: number): React.Element<any> => (
                      <Tr first={index === 0}>
                        <NameColumn
                          name={`${[...Array(provider.level * 4)]
                            .map((_, index) => (index === 0 ? '-' : '-'))
                            .join('')} ${provider.name}`}
                        />
                        <DescriptionColumn>{provider.desc}</DescriptionColumn>
                        <NameColumn
                          className="text"
                          name={provider.type.name}
                        />
                        <Td className="narrow">
                          <ContentByType content={provider.type.mandatory} />
                        </Td>
                        <Td className="text">
                          {provider.type.types_accepted?.join()}
                        </Td>
                        <Td className="text medium">
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
