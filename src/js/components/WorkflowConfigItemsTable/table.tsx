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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string,
  openModal: Function,
  closeModal: Function,
  saveValue: Function,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string,
  belongsTo: string,
  showDescription: boolean,
  globalItems: any,
  intrfId: number,
};

const WorkflowConfigItemsTable: Function = ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  showDescription,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleToggleDescription' does not exist ... Remove this comment to see the full error message
  handleToggleDescription,
  dispatchAction,
  globalItems,
  intrfId,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'ConfigItem... Remove this comment to see the full error message
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: ConfigItemsTableProps): React.Element<any> =>
  (configItems && configItems.data?.length) ? (
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
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    <Tr key={item.name} first={index === 0}>
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
                                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                                  belongsTo={belongsTo}
                                  onSubmit={saveValue}
                                  intrf={intrf}
                                  intrfId={intrfId}
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
                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
                                actions.workflows.deleteConfigItem,
                                intrfId,
                                null,
                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                                item.name,
                                null
                              );
                            }}
                          />
                        </ButtonGroup>
                      </ActionColumn>
                      <Td
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                        className={`text ${item.level === 'workflow' ||
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                          item.level === 'global'}`}
                      >
                        // @ts-expect-error ts-migrate(2741) FIXME: Property 'useDefault' is missing in type '{ item: ... Remove this comment to see the full error message
                        <Value item={item} />
                      </Td>
                      <Td className="narrow">
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
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
  ) : null;

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['configItems', 'showDescription', 'globalConfig']),
  injectIntl
)(WorkflowConfigItemsTable);
