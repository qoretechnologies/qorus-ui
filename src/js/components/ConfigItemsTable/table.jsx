// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import EnhancedTable from '../EnhancedTable';
import { ActionColumnHeader, ActionColumn } from '../ActionColumn';
import type { EnhancedTableProps } from '../EnhancedTable';
import { sortDefaults } from '../../constants/sort';
import NameColumn, { NameColumnHeader } from '../NameColumn';
import DataOrEmptyTable from '../DataOrEmptyTable';
import { Table, Thead, Tr, Th, Tbody, Td, FixedRow } from '../new_table';
import LoadMore from '../LoadMore';
import Search from '../../containers/search';
import Pull from '../Pull';
import ContentByType from '../ContentByType';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import ConfigItemsModal from './modal';
import Tree from '../tree';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

type ConfigItemsTableProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
  openModal: Function,
  closeModal: Function,
  saveValue: Function,
  intrf: string,
  belongsTo: string,
  showDescription: boolean,
};

const ConfigItemsTable: Function = ({
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  showDescription,
  handleToggleDescription,
}: ConfigItemsTableProps): React.Element<any> => (
  <EnhancedTable
    collection={configItems.data}
    searchBy={['name', 'default_value', 'value', 'type', 'mandatory', 'desc']}
    tableId={belongsTo}
    sortDefault={sortDefaults.configItems}
  >
    {({
      collection,
      canLoadMore,
      handleLoadMore,
      handleLoadAll,
      loadMoreTotal,
      loadMoreCurrent,
      limit,
      sortData,
      onSortChange,
      handleSearchChange,
    }: EnhancedTableProps) => (
      <Table striped condensed fixed>
        <Thead>
          <FixedRow className="toolbar-row">
            <Pull>
              <ButtonGroup>
                <Button
                  label="Show descriptions"
                  iconName="align-left"
                  btnStyle={showDescription ? 'primary' : ''}
                  onClick={handleToggleDescription}
                />
              </ButtonGroup>
            </Pull>
            <Pull right>
              <LoadMore
                canLoadMore={canLoadMore}
                onLoadMore={handleLoadMore}
                onLoadAll={handleLoadAll}
                currentCount={loadMoreCurrent}
                total={loadMoreTotal}
                limit={limit}
              />
              <Search
                onSearchUpdate={handleSearchChange}
                resource="configItems"
              />
            </Pull>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <NameColumnHeader />
            <ActionColumnHeader icon="edit">{''}</ActionColumnHeader>
            <Th className="text" iconName="info-sign" name="actual_value">
              Value
            </Th>

            <Th className="text" name="default_value">
              Default val.
            </Th>
            <Th iconName="code" name="type" />
            <Th name="level">Level</Th>
            <Th iconName="asterisk" />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={!collection || collection.length === 0}
          cols={7}
          small
        >
          {props => (
            <Tbody {...props}>
              {collection.map((item: Object, index: number) => {
                const value =
                  belongsTo === 'Global Config'
                    ? item.value
                    : item.actual_value;
                return (
                  <React.Fragment>
                    <Tr key={item.name} first={index === 0}>
                      <NameColumn name={item.name} />
                      <ActionColumn>
                        <ButtonGroup>
                          <Button
                            icon="edit"
                            title="Edit this value"
                            onClick={() => {
                              openModal(
                                <ConfigItemsModal
                                  onClose={closeModal}
                                  item={item}
                                  belongsTo={belongsTo}
                                  onSubmit={saveValue}
                                  intrf={intrf}
                                  intrfId={configItems.id}
                                  stepId={configItems.stepId}
                                />
                              );
                            }}
                          />
                        </ButtonGroup>
                      </ActionColumn>
                      <Td className="text">
                        {item.type === 'hash' || item.type === 'list' ? (
                          <Tree compact data={value} />
                        ) : (
                          <ContentByType inTable content={value} />
                        )}
                      </Td>
                      <Td className="text">
                        {item.type === 'hash' || item.type === 'list' ? (
                          <Tree compact data={item.default_value} />
                        ) : (
                          <ContentByType inTable content={item.default_value} />
                        )}
                      </Td>
                      <Td className="narrow">
                        <code>{item.type}</code>
                      </Td>
                      <Td className="narrow">{item.level}</Td>
                      <Td className="tiny">
                        <ContentByType content={item.mandatory} />
                      </Td>
                    </Tr>
                    {showDescription && (
                      <Tr>
                        <Td className="text" colspan={7}>
                          {item.desc}
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                );
              })}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

export default compose(
  withState('showDescription', 'toggleDescription', false),
  withHandlers({
    handleToggleDescription: ({ toggleDescription }) => () => {
      toggleDescription(value => !value);
    },
  }),
  onlyUpdateForKeys(['configItems', 'showDescription'])
)(ConfigItemsTable);
