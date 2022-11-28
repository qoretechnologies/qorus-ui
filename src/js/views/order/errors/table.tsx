import { Icon } from '@blueprintjs/core';
import last from 'lodash/last';
import size from 'lodash/size';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import ContentByType from '../../../components/ContentByType';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import CsvControl from '../../../components/CsvControl';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DateColumn, DateColumnHeader } from '../../../components/DateColumn';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import EnhancedTable from '../../../components/EnhancedTable';
import LoadMore from '../../../components/LoadMore';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import modal from '../../../hocomponents/modal';
import withDispatch from '../../../hocomponents/withDispatch';
import { success } from '../../../store/ui/bubbles/actions';

type Props = {
  errors: Array<Object>;
  onCSVClick: Function;
  onFilterChange: Function;
  compact: boolean;
  expanded: boolean;
  handleExpandClick: Function;
  handleCopyClick: Function;
  tableId: string;
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                  onSubmit={onFilterChange}
                >
                  {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ icon: string; }' is missing the following ... Remove this comment to see the full error message */}
                  <Control icon="filter" />
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Item title="ALL" />
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Item title="FATAL" />
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Item title="MAJOR" />
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Item title="WARNING" />
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Item title="INFO" />
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Item title="NONE" />
                </Dropdown>
                <ButtonGroup>
                  <Button
                    text={intl.formatMessage({
                      id: expanded ? 'button.hide-descriptions' : 'button.show-descriptions',
                    })}
                    title={intl.formatMessage({
                      id: expanded ? 'button.hide-descriptions' : 'button.show-descriptions',
                    })}
                    icon={expanded ? 'collapse-all' : 'expand-all'}
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
                    text={intl.formatMessage({ id: 'button.copy-last-error' })}
                    title={intl.formatMessage({ id: 'button.copy-last-error' })}
                    icon="clipboard"
                    big
                    onClick={handleCopyClick}
                  />
                </ButtonGroup>
                <CsvControl onClick={onCSVClick} disabled={size(collection) === 0} />
                <LoadMore
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                  onLoadAll={handleLoadAll}
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
                <Search onSearchUpdate={handleSearchChange} resource="orderErrors" />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <NameColumnHeader
              title={intl.formatMessage({ id: 'table.error-code' })}
              name="error"
              icon="error"
            />
            {!compact && (
              <NameColumnHeader
                title={intl.formatMessage({ id: 'table.step-name' })}
                name="step_name"
              />
            )}
            <Th icon="info-sign" name="severity">
              <FormattedMessage id="table.severity" />
            </Th>
            <Th icon="error" name="business_error">
              <FormattedMessage id="table.bus-err" />
            </Th>
            {!compact && (
              <Th icon="error" name="error_type">
                <FormattedMessage id="table.error-type" />
              </Th>
            )}
            {!compact && (
              <Th icon="refresh" name="retry">
                <FormattedMessage id="table.retry" />
              </Th>
            )}
            {!compact && (
              <Th icon="info-sign" name="ind">
                <FormattedMessage id="table.ind" />
              </Th>
            )}
            <DateColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={collection.length === 0}
          cols={compact ? 5 : 10}
          small={compact}
        >
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (error: any, index: number) => (
                  <>
                    <Tr key={error.error_instanceid} first={index === 0}>
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'. */}
                      <NameColumn name={error.error} />
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'step_name' does not exist on type 'Objec... Remove this comment to see the full error message */}
                      {!compact && <NameColumn name={error.step_name} />}
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'severity' does not exist on type 'Object... Remove this comment to see the full error message */}
                      <Td className="medium">{error.severity}</Td>
                      <Td className="medium">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'business_error' does not exist on type '... Remove this comment to see the full error message */}
                        <ContentByType content={error.business_error} />
                      </Td>
                      {!compact && (
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'error_type' does not exist on type 'Obje... Remove this comment to see the full error message
                        <Td className="medium">{error.error_type}</Td>
                      )}
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'retry' does not exist on type 'Object'. */}
                      {!compact && <Td className="medium">{error.retry}</Td>}
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'ind' does not exist on type 'Object'. */}
                      {!compact && <Td className="narrow">{error.ind}</Td>}
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message */}
                      <DateColumn>{error.created}</DateColumn>
                    </Tr>
                    {expanded && (
                      <>
                        <Tr>
                          <Td className="text" colspan={!compact ? 8 : 4}>
                            <Icon icon="info-sign" /> <strong>Error description:</strong>{' '}
                            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */}
                            {error.description || '-'}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td className="text" colspan={!compact ? 8 : 4}>
                            <Icon icon="info-sign" /> <strong>Info:</strong>{' '}
                            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'. */}
                            {error.info}
                          </Td>
                        </Tr>
                      </>
                    )}
                  </>
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
    handleExpandClick:
      ({ changeExpand }: { changeExpand: Function }): Function =>
      (): void => {
        changeExpand((expanded) => !expanded);
      },
    handleCopyClick:
      ({ errors, dispatchAction }: { errors: Array<Object>; dispatchAction: Function }): Function =>
      (): void => {
        const textField = document.createElement('textarea');
        textField.innerText = last(errors).info;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();

        dispatchAction(success, 'Successfuly copied to clipboard', 'clipboard');
      },
  }),
  pure(['errors', 'expanded']),
  injectIntl
)(ErrorsTable);
