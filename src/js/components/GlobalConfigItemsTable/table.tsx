// @flow
import size from 'lodash/size';
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import { ActionColumn, ActionColumnHeader } from '../ActionColumn';
import AddConfigItemModal from '../ConfigItemsTable/modal';
import { Value } from '../ConfigItemsTable/table';
import DataOrEmptyTable from '../DataOrEmptyTable';
import type { EnhancedTableProps } from '../EnhancedTable';
import EnhancedTable from '../EnhancedTable';
import LoadMore from '../LoadMore';
import NameColumn, { NameColumnHeader } from '../NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../new_table';
import Pull from '../Pull';

type ConfigItemsTableProps = {
  items: any;
  dispatchAction: Function;
  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string;
  openModal: Function;
  closeModal: Function;
  saveValue: Function;
  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string;
  belongsTo: string;
  showDescription: boolean;
  globalItems: any;
};

const ConfigItemsTable: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  showDescription,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleToggleDescription' does not exist ... Remove this comment to see the full error message
  handleToggleDescription,
  dispatchAction,
  globalItems,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'ConfigItem... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ConfigItemsTableProps) => (
  <>
    {configItems.data && configItems.data.length ? (
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
                              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
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
                    <Search onSearchUpdate={handleSearchChange} resource="configItems" />
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
            <DataOrEmptyTable condition={!collection || collection.length === 0} cols={4} small>
              {(props) => (
                <Tbody {...props}>
                  {collection.map((item: any, index: number) => (
                    <React.Fragment>
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                      <Tr key={item.name} first={index === 0}>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                        <NameColumn name={item.name} />
                        <ActionColumn>
                          <ButtonGroup>
                            <Button
                              icon="edit"
                              title={intl.formatMessage({ id: 'button.edit-this-value' })}
                              onClick={() => {
                                openModal(
                                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
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
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
                                  actions.system.deleteConfigItem,
                                  null,
                                  null,
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                                  item.name,
                                  null
                                );
                              }}
                            />
                          </ButtonGroup>
                        </ActionColumn>
                        <Td
                          // @ts-ignore ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                          className={`text ${
                            item.level === 'workflow' ||
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                            item.level === 'global'
                          }`}
                        >
                          {/* @ts-ignore ts-migrate(2741) FIXME: Property 'useDefault' is missing in type '{ item: ... Remove this comment to see the full error message */}
                          <Value item={item} />
                        </Td>
                        <Td className="narrow">
                          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
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
