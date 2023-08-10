import size from 'lodash/size';
import { injectIntl } from 'react-intl';
import ContentByType from '../../../components/ContentByType';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DescriptionColumn, DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import EnhancedTable from '../../../components/EnhancedTable';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import Pull from '../../../components/Pull';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Search from '../../../containers/search';

const ProvidersTable = ({ fields, intl }) => {
  return (
    <EnhancedTable collection={fields} searchBy={['name', 'desc', 'type.name']} tableId="fields">
      {({ handleSearchChange, collection }) => (
        <Table fixed condensed striped>
          <Thead>
            <FixedRow className="toolbar-row">
              <Th>
                <Pull right>
                  <Search onSearchUpdate={handleSearchChange} resource="providers" />
                </Pull>
              </Th>
            </FixedRow>
            <FixedRow>
              <NameColumnHeader />
              <DescriptionColumnHeader />
              <NameColumnHeader title={intl.formatMessage({ id: 'table.type' })} />
              <Th icon="asterisk" />
              <Th>{intl.formatMessage({ id: 'table.accepted_types' })}</Th>
              <Th>{intl.formatMessage({ id: 'table.returned_types' })}</Th>
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={size(collection) === 0} cols={1}>
            {(props) => (
              // @ts-ignore ts-migrate(1345) FIXME: An expression of type 'void' cannot be tested for ... Remove this comment to see the full error message
              <Tbody {...props}>
                {collection.map(
                  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                  (provider: any, index: number) => (
                    <Tr first={index === 0}>
                      <NameColumn
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                        name={`${[...Array(provider.level * 4)]
                          .map((_, index) => (index === 0 ? '-' : '-'))
                          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                          .join('')} ${provider.name}`}
                      />
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */}
                      <DescriptionColumn>{provider.desc}</DescriptionColumn>
                      <NameColumn
                        className="text"
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                        name={provider.type.name}
                      />
                      <Td className="narrow">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
                        <ContentByType content={provider.type.mandatory} />
                      </Td>
                      <Td className="text">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
                        {provider.type.types_accepted?.join()}
                      </Td>
                      <Td className="text medium">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
                        {provider.type.types_returned?.join()}
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
  );
};

export default injectIntl(ProvidersTable);
