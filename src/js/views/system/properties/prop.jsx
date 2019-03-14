// @flow
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  FixedRow,
} from '../../../components/new_table';
import { hasPermission } from '../../../helpers/user';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import Text from '../../../components/text';
import ConfirmDialog from '../../../components/confirm_dialog';
import ExpandableItem from '../../../components/ExpandableItem';
import Pull from '../../../components/Pull';
import LocalTable from '../../../components/EnhancedTable';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import Search from '../../../containers/search';

import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';

type Props = {
  data: Array<Object>,
  title: string,
  perms: Array<Object>,
  onDelete: Function,
  onEdit: Function,
  openModal: Function,
  closeModal: Function,
};

const Property: Function = ({
  data,
  title,
  perms,
  onDelete,
  onEdit,
  openModal,
  closeModal,
}: Props): React.Element<any> => {
  const handlePropDeleteClick = (): void => {
    const confirmFunc = () => {
      onDelete({ domain: title });
      closeModal();
    };

    openModal(
      <ConfirmDialog onClose={closeModal} onConfirm={confirmFunc}>
        Are you sure you want to delete the property group{' '}
        <strong>{title}</strong>
      </ConfirmDialog>
    );
  };

  const handleKeyDeleteClick = (key: string): Function => (): void => {
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

  const handleEditClick = (
    key: string,
    value: string
  ): Function => (): void => {
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
                        {hasPermission(
                          perms,
                          ['SERVER-CONTROL', 'SET-PROPERTY'],
                          'or'
                        ) && (
                          <Button
                            text="Add property"
                            iconName="add"
                            onClick={handlePropAddClick}
                            big
                          />
                        )}
                        {hasPermission(
                          perms,
                          ['SERVER-CONTROL', 'DELETE-PROPERTY'],
                          'or'
                        ) && (
                          <Button
                            text="Remove group"
                            iconName="cross"
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
                    <Search
                      resource="properties"
                      onSearchUpdate={handleSearchChange}
                    />
                  </Pull>
                </Th>
              </FixedRow>
              <FixedRow {...{ sortData, onSortChange }}>
                <NameColumnHeader iconName="application" />
                <Th className="text" name="prop" iconName="property">
                  Property data
                </Th>
                <Th iconName="build">Actions</Th>
              </FixedRow>
            </Thead>
            <Tbody>
              {collection.map((datum: Object, key: number) => (
                <Tr key={datum.name} first={key === 0}>
                  <Td className="name">{datum.name}</Td>
                  <Td className="text">
                    <Text text={datum.prop} renderTree caseSensitiveTree />
                  </Td>
                  <Td className="normal">
                    {title !== 'omq' && (
                      <ButtonGroup>
                        {hasPermission(
                          perms,
                          ['SERVER-CONTROL', 'SET-PROPERTY'],
                          'or'
                        ) && (
                          <Button
                            iconName="edit"
                            onClick={handleEditClick(datum.name, datum.prop)}
                          />
                        )}
                        {hasPermission(
                          perms,
                          ['SERVER-CONTROL', 'DELETE-PROPERTY'],
                          'or'
                        ) && (
                          <Button
                            iconName="cross"
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
