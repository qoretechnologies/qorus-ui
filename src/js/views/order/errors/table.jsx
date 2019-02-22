// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import Pull from '../../../components/Pull';
import CsvControl from '../../../components/CsvControl';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import LoadMore from '../../../components/LoadMore';
import Search from '../../../containers/search';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import {
  DescriptionColumnHeader,
  DescriptionColumn,
} from '../../../components/DescriptionColumn';
import { DateColumnHeader, DateColumn } from '../../../components/DateColumn';
import Dropdown, { Item, Control } from '../../../components/dropdown';
import ContentByType from '../../../components/ContentByType';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import modal from '../../../hocomponents/modal';
import Modal from '../../../components/modal';
import last from 'lodash/last';
import withDispatch from '../../../hocomponents/withDispatch';
import { success } from '../../../store/ui/bubbles/actions';

type Props = {
  errors: Array<Object>,
  onCSVClick: Function,
  onFilterChange: Function,
  compact: boolean,
  expanded: boolean,
  handleExpandClick: Function,
  handleCopyClick: Function,
  tableId: string,
};

const ErrorsTable: Function = ({
  errors,
  onCSVClick,
  onFilterChange,
  compact,
  expanded,
  handleExpandClick,
  tableId: tableId = 'orderErrors',
  handleCopyClick,
}: Props): React.Element<Table> => (
  <EnhancedTable
    collection={errors}
    tableId={tableId}
    searchBy={[
      'severity',
      'error',
      'step_name',
      'ind',
      'created',
      'error_type',
      'retry',
      'info',
      'description',
    ]}
    sortDefault={sortDefaults[tableId]}
  >
    {({
      handleSearchChange,
      handleLoadAll,
      handleLoadMore,
      limit,
      collection,
      canLoadMore,
      loadMoreCurrent,
      loadMoreTotal,
      sortData,
      onSortChange,
    }: EnhancedTableProps) => (
      <Table condensed striped fixed>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th colspan="full">
              <Pull>
                <Dropdown
                  multi
                  def="ALL"
                  id="errors"
                  submitOnBlur
                  onSubmit={onFilterChange}
                >
                  <Control iconName="filter" />
                  <Item title="ALL" />
                  <Item title="FATAL" />
                  <Item title="MAJOR" />
                  <Item title="WARNING" />
                  <Item title="INFO" />
                  <Item title="NONE" />
                </Dropdown>
                <ButtonGroup>
                  <Button
                    text={expanded ? 'Collapse texts' : 'Expand texts'}
                    title={expanded ? 'Collapse texts' : 'Expand texts'}
                    iconName={expanded ? 'collapse-all' : 'expand-all'}
                    btnStyle={expanded && 'primary'}
                    big
                    disabled={size(collection) === 0}
                    onClick={handleExpandClick}
                  />
                </ButtonGroup>
              </Pull>
              <Pull right>
                <ButtonGroup>
                  <Button
                    disabled={size(collection) === 0}
                    text="Copy last error"
                    title="Copy last error"
                    iconName="clipboard"
                    big
                    onClick={handleCopyClick}
                  />
                </ButtonGroup>
                <CsvControl
                  onClick={onCSVClick}
                  disabled={size(collection) === 0}
                />
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
                  resource="orderErrors"
                />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <NameColumnHeader
              title="Error code"
              name="error"
              iconName="error"
            />
            {!compact && (
              <NameColumnHeader title="Step Name" name="step_name" />
            )}
            <Th iconName="info-sign" name="severity">
              Severity
            </Th>
            <Th iconName="error" name="business_error">
              Bus.Err.
            </Th>
            {!compact && (
              <Th iconName="error" name="error_type">
                Error Type
              </Th>
            )}
            {!compact && (
              <Th iconName="refresh" name="retry">
                Retry
              </Th>
            )}
            {!compact && (
              <Th iconName="info-sign" name="ind">
                Ind
              </Th>
            )}
            <DescriptionColumnHeader name="info">Info</DescriptionColumnHeader>
            <DescriptionColumnHeader name="description" />
            {!compact && <DateColumnHeader />}
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={collection.length === 0}
          cols={compact ? 5 : 10}
          small={compact}
        >
          {props => (
            <Tbody {...props}>
              {collection.map(
                (error: Object, index: number): React.Element<any> => (
                  <Tr key={error.error_instanceid} first={index === 0}>
                    <NameColumn name={error.error} />
                    {!compact && <NameColumn name={error.step_name} />}
                    <Td className="medium">{error.severity}</Td>
                    <Td className="medium">
                      <ContentByType content={error.business_error} />
                    </Td>
                    {!compact && <Td className="medium">{error.error_type}</Td>}
                    {!compact && <Td className="medium">{error.retry}</Td>}
                    {!compact && <Td className="narrow">{error.ind}</Td>}
                    <DescriptionColumn expanded={expanded}>
                      {error.info}
                    </DescriptionColumn>

                    <DescriptionColumn expanded={expanded}>
                      {error.description}
                    </DescriptionColumn>

                    {!compact && <DateColumn>{error.created}</DateColumn>}
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

export default compose(
  withState('expanded', 'changeExpand', false),
  modal(),
  withDispatch(),
  withHandlers({
    handleExpandClick: ({
      changeExpand,
    }: {
      changeExpand: Function,
    }): Function => (): void => {
      changeExpand(expanded => !expanded);
    },
    handleCopyClick: ({
      errors,
      dispatchAction,
    }: {
      errors: Array<Object>,
      dispatchAction: Function,
    }): Function => (): void => {
      const textField = document.createElement('textarea');
      textField.innerText = last(errors).info;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();

      dispatchAction(success, 'Successfuly copied to clipboard', 'clipboard');
    },
  }),
  pure(['errors', 'expanded'])
)(ErrorsTable);
