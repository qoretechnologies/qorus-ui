import ConfirmDialog from '../../../components/confirm_dialog';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import LocalTable from '../../../components/EnhancedTable';
import ExpandableItem from '../../../components/ExpandableItem';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import Text from '../../../components/text';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import { hasPermission } from '../../../helpers/user';

type Props = {
  data: Array<Object>;
  title: string;
  perms: Array<Object>;
  onDelete: Function;
  onEdit: Function;
  openModal: Function;
  closeModal: Function;
};

const Property: Function = ({
  data,
  title,
  perms,
  onDelete,
  onEdit,
  openModal,
  closeModal,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const handlePropDeleteClick = (): void => {
    const confirmFunc = () => {
      onDelete({ domain: title });
      closeModal();
    };

    openModal(
      <ConfirmDialog onClose={closeModal} onConfirm={confirmFunc}>
        Are you sure you want to delete the property group <strong>{title}</strong>
      </ConfirmDialog>
    );
  };

  const handleKeyDeleteClick =
    (key: string): Function =>
    (): void => {
      const confirmFunc = () => {
        onDelete({ domain: title, key });
        closeModal();
      };

      openModal(
        <ConfirmDialog onClose={closeModal} onConfirm={confirmFunc}>
          Are you sure you want to delete the property key <strong>{key}</strong>
        </ConfirmDialog>
      );
    };

  const handleEditClick =
    (key: string, value: string): Function =>
    (): void => {
      onEdit(null, { domain: title, key, value });
    };

  const handlePropAddClick = (): void => {
    onEdit(null, { domain: title });
  };

  return (
    <ExpandableItem title={title} show>
      <LocalTable
        collection={data}
        searchBy={['name', 'prop']}
        tableId={title}
        sortDefault={sortDefaults.properties}
      >
        {({
          handleSearchChange,
          handleLoadAll,
          handleLoadMore,
          loadMoreCurrent,
          loadMoreTotal,
          limit,
          collection,
          canLoadMore,
          sortData,
          onSortChange,
        }: EnhancedTableProps) => (
          <Table condensed fixed striped>
            <Thead>
              <FixedRow className="toolbar-row">
                <Th>
                  {title !== 'omq' && (
                    <Pull>
                      <ButtonGroup>
                        {hasPermission(perms, ['SERVER-CONTROL', 'SET-PROPERTY'], 'or') && (
                          <Button text="Add property" icon="add" onClick={handlePropAddClick} big />
                        )}
                        {hasPermission(perms, ['SERVER-CONTROL', 'DELETE-PROPERTY'], 'or') && (
                          <Button
                            text="Remove group"
                            icon="cross"
                            onClick={handlePropDeleteClick}
                            btnStyle="danger"
                            big
                          />
                        )}
                      </ButtonGroup>
                    </Pull>
                  )}
                  <Pull right>
                    <LoadMore
                      handleLoadAll={handleLoadAll}
                      handleLoadMore={handleLoadMore}
                      currentCount={loadMoreCurrent}
                      total={loadMoreTotal}
                      limit={limit}
                      canLoadMore={canLoadMore}
                    />
                    <Search resource="properties" onSearchUpdate={handleSearchChange} />
                  </Pull>
                </Th>
              </FixedRow>
              <FixedRow {...{ sortData, onSortChange }}>
                <NameColumnHeader icon="application" />
                <Th className="text" name="prop" icon="property">
                  Property data
                </Th>
                <Th icon="build">Actions</Th>
              </FixedRow>
            </Thead>
            <Tbody>
              {collection.map((datum: any, key: number) => (
                // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                <Tr key={datum.name} first={key === 0}>
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                  <Td className="name">{datum.name}</Td>
                  <Td className="text">
                    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'prop' does not exist on type 'Object'. */}
                    <Text text={datum.prop} renderTree caseSensitiveTree />
                  </Td>
                  <Td className="normal">
                    {title !== 'omq' && (
                      <ButtonGroup>
                        {hasPermission(perms, ['SERVER-CONTROL', 'SET-PROPERTY'], 'or') && (
                          <Button
                            icon="edit"
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                            onClick={handleEditClick(datum.name, datum.prop)}
                          />
                        )}
                        {hasPermission(perms, ['SERVER-CONTROL', 'DELETE-PROPERTY'], 'or') && (
                          <Button
                            icon="cross"
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                            onClick={handleKeyDeleteClick(datum.name)}
                            btnStyle="danger"
                          />
                        )}
                      </ButtonGroup>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </LocalTable>
    </ExpandableItem>
  );
};

export default Property;
