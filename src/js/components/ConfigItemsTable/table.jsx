// @flow
import React from 'react';
import compose from 'recompose/compose';
import classnames from 'classnames';
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
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';

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
  levelType: string,
  stepId?: number,
};

const ConfigItemsTable: Function = ({
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  intrfId,
  showDescription,
  handleToggleDescription,
  dispatchAction,
  levelType,
  stepId,
}: ConfigItemsTableProps): React.Element<any> => (
  <EnhancedTable
    collection={configItems.data}
    searchBy={['name', 'default_value', 'value', 'type', 'desc']}
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
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <NameColumnHeader />
            <ActionColumnHeader icon="edit">{''}</ActionColumnHeader>
            <Th name="strictly_local">Local</Th>
            <Th name="level">Level</Th>
            <Th className="text" iconName="info-sign" name="actual_value">
              Value
            </Th>

            <Th className="text" name="default_value">
              Default val.
            </Th>
            <Th iconName="code" name="type" />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={!collection || collection.length === 0}
          cols={7}
          small
        >
          {props => (
            <Tbody {...props}>
              {collection.map((item: Object, index: number) => (
                <React.Fragment>
                  <Tr
                    key={item.name}
                    first={index === 0}
                    className={classnames({
                      'row-alert': !item.value && !item.is_set,
                    })}
                  >
                    <NameColumn
                      name={item.name}
                      hasAlerts={!item.value && !item.is_set}
                      alertTooltip="This config item's value is not set on any level"
                      minimalAlert
                    />
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
                                intrfId={configItems.id || intrfId}
                                stepId={configItems.stepId || stepId}
                                levelType={levelType}
                              />
                            );
                          }}
                        />
                        <Button
                          icon="cross"
                          title="Remove this value"
                          disabled={
                            item.level
                              ? !item.level.startsWith(levelType || '')
                              : true
                          }
                          btnStyle="warning"
                          onClick={() => {
                            dispatchAction(
                              actions[intrf].deleteConfigItem,
                              configItems.id || intrfId,
                              configItems.stepId || stepId,
                              item.name,
                              null
                            );
                          }}
                        />
                      </ButtonGroup>
                    </ActionColumn>
                    <Td className="narrow">
                      <ContentByType content={item.strictly_local} />
                    </Td>
                    <Td className="medium">{item.level}</Td>
                    <Td
                      className={`text ${item.level === 'workflow' ||
                        item.level === 'global'}`}
                    >
                      {item.type === 'hash' || item.type === 'list' ? (
                        <Tree compact data={item.value} />
                      ) : (
                        <ContentByType inTable content={item.value} />
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
                  </Tr>
                  {showDescription && (
                    <Tr>
                      <Td className="text" colspan={7}>
                        {item.desc}
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

export default compose(
  withDispatch(),
  withState('showDescription', 'toggleDescription', false),
  withHandlers({
    handleToggleDescription: ({ toggleDescription }) => () => {
      toggleDescription(value => !value);
    },
  }),
  onlyUpdateForKeys(['configItems', 'showDescription'])
)(ConfigItemsTable);
