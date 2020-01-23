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
import Tree from '../tree';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import AddConfigItemModal from '../ConfigItemsTable/modal';
import size from 'lodash/size';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Value } from '../ConfigItemsTable/table';

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
  globalItems: any,
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
  dispatchAction,
  globalItems,
  intl,
}: ConfigItemsTableProps): React.Element<any> => (
  <>
    {configItems.data && configItems.data.length ? (
      <EnhancedTable
        collection={configItems.data}
        searchBy={[
          'name',
          'default_value',
          'value',
          'type',
          'mandatory',
          'desc',
        ]}
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
          <Table striped condensed fixed hover>
            <Thead>
              <FixedRow className="toolbar-row">
                <Th>
                  <Pull>
                    <ButtonGroup>
                      <Button
                        disabled={!size(globalItems)}
                        icon="add"
                        label={intl.formatMessage({ id: 'button.add-new' })}
                        title={intl.formatMessage({ id: 'button.add-new' })}
                        onClick={() => {
                          openModal(
                            <AddConfigItemModal
                              isGlobal
                              onClose={closeModal}
                              onSubmit={saveValue}
                              globalConfig={globalItems}
                            />
                          );
                        }}
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
                </Th>
              </FixedRow>
              <FixedRow {...{ sortData, onSortChange }}>
                <NameColumnHeader />
                <ActionColumnHeader>{''}</ActionColumnHeader>
                <Th className="text" icon="info-sign" name="value">
                  Value
                </Th>
                <Th icon="code" name="type" />
              </FixedRow>
            </Thead>
            <DataOrEmptyTable
              condition={!collection || collection.length === 0}
              cols={4}
              small
            >
              {props => (
                <Tbody {...props}>
                  {collection.map((item: Object, index: number) => (
                    <React.Fragment>
                      <Tr key={item.name} first={index === 0}>
                        <NameColumn name={item.name} />
                        <ActionColumn>
                          <ButtonGroup>
                            <Button
                              icon="edit"
                              title={intl.formatMessage({ id: 'button.edit-this-value' })}
                              onClick={() => {
                                openModal(
                                  <AddConfigItemModal
                                    onClose={closeModal}
                                    item={item}
                                    onSubmit={saveValue}
                                    intrf={intrf}
                                    isGlobal
                                  />
                                );
                              }}
                            />
                            <Button
                              icon="cross"
                              title={intl.formatMessage({ id: 'button.remove-this-value' })}
                              btnStyle="danger"
                              onClick={() => {
                                dispatchAction(
                                  actions.system.deleteConfigItem,
                                  null,
                                  null,
                                  item.name,
                                  null
                                );
                              }}
                            />
                          </ButtonGroup>
                        </ActionColumn>
                        <Td
                          className={`text ${item.level === 'workflow' ||
                            item.level === 'global'}`}
                        >
                          <Value item={item} />
                        </Td>
                        <Td className="narrow">
                          <code>{item.type}</code>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  ))}
                </Tbody>
              )}
            </DataOrEmptyTable>
          </Table>
        )}
      </EnhancedTable>
    ) : null}
  </>
);

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['configItems', 'showDescription', 'globalConfig']),
  injectIntl
)(ConfigItemsTable);
