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
  intrfId: number,
};

const WorkflowConfigItemsTable: Function = ({
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
  intrfId,
  intl,
}: ConfigItemsTableProps): React.Element<any> =>
  configItems && configItems.length ? (
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
              <Th className="text" iconName="info-sign" name="value">
                Value
              </Th>
              <Th iconName="code" name="type" />
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
                                actions.workflows.deleteConfigItem,
                                intrfId,
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
                        {item.type === 'hash' ||
                        item.type === 'list' ||
                        item.type === '*hash' ||
                        item.type === '*list' ? (
                            <Tree compact data={item.value} />
                          ) : (
                            <ContentByType inTable content={item.value} />
                          )}
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
  ) : null;

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['configItems', 'showDescription', 'globalConfig']),
  injectIntl
)(WorkflowConfigItemsTable);
