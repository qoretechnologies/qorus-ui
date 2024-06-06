/* @flow */
import { useReqoreProperty } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumnHeader } from '../../components/ActionColumn';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { IdColumnHeader } from '../../components/IdColumn';
import LoadMore from '../../components/LoadMore';
import { NameColumnHeader } from '../../components/NameColumn';
import Pull from '../../components/Pull';
import { SelectColumnHeader } from '../../components/SelectColumn';
import SortingDropdown from '../../components/SortingDropdown';
import DatePicker from '../../components/datepicker';
import { FixedRow, Table, Tbody, Th, Thead } from '../../components/new_table';
import withModal from '../../hocomponents/modal';
import queryControl from '../../hocomponents/queryControl';
import actions from '../../store/api/actions';
import SortModal from './modals/sort_modal';
import Row from './row';
import Actions from './toolbar/actions';
import Band from './toolbar/band';
import Filters from './toolbar/filters';
import Selector from './toolbar/selector';

type Props = {
  sortData: any;
  onSortChange: Function;
  states: any;
  deprecated?: boolean;
  collection: Array<Object>;
  paneId?: number;
  openPane: Function;
  closePane: Function;
  date: string;
  select: Function;
  updateDone: Function;
  expanded: boolean;
  canLoadMore: boolean;
  isTablet: boolean;
  totalInstances: any;
  setRemote: Function;
  openModal: Function;
  closeModal: Function;
  handleInstancesClick: Function;
  dateQuery: string;
  changeDateQuery: Function;
  dispositionQuery: string;
  changeDispositionQuery: Function;
  handleDispositionChange: Function;
  selected: string;
  selectedIds: Array<number>;
  location: any;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
  sortKeysObj: any;
  band: string;
};

const WorkflowsTable: Function = ({
  sortData,
  onSortChange,
  states,
  deprecated,
  collection,
  paneId,
  openPane,
  openModal,
  closeModal,
  closePane,
  date,
  select,
  updateDone,
  expanded,
  canLoadMore,
  isTablet,
  setRemote,
  dateQuery,
  changeDateQuery,
  selected,
  selectedIds,
  location,
  band,
  handleDispositionChange,
  limit,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  sortKeysObj,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
    const addModal = useReqoreProperty('addModal');
    const removeModal = useReqoreProperty('removeModal');

    const handleInstancesClick = () => {
      addModal(
        <SortModal sortData={sortData} onSortChange={onSortChange} closeModal={() => removeModal('instances-sort-modal')} />,
        'instances-sort-modal'
      );
    }

    return (
      <Table striped hover condensed fixed id="workflows-view">
        <Thead>
          <FixedRow className="toolbar-row">
            <Th colspan={5}>
              <Pull>
                <Selector
                  selected={selected}
                  selectedCount={selectedIds.length}
                  disabled={size(collection) === 0} />
                <Actions selectedIds={selectedIds} show={selected !== 'none'} isTablet={isTablet} />
                <Filters location={location} isTablet={isTablet} />
                <SortingDropdown
                  onSortChange={onSortChange}
                  sortData={sortData}
                  sortKeys={sortKeysObj} />
              </Pull>
              <Pull right>
                <LoadMore
                  limit={limit}
                  canLoadMore={canLoadMore}
                  handleLoadAll={handleLoadAll}
                  handleLoadMore={handleLoadMore}
                  total={loadMoreTotal}
                  currentCount={loadMoreCurrent} />
              </Pull>
            </Th>
            <Th className="separated-cell" colspan={2}>
              <DatePicker
                date={dateQuery || '24h'}
                // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                onApplyDate={changeDateQuery}
                className="toolbar-item" />
            </Th>
            <Th className="separated-cell" colspan={2}>
              <Band band={band} onChange={handleDispositionChange} />
            </Th>
          </FixedRow>
          <FixedRow sortData={sortData} onSortChange={onSortChange}>
            <SelectColumnHeader />
            <IdColumnHeader />
            <NameColumnHeader />
            <ActionColumnHeader />
            <Th name="autostart" icon="automatic-updates">
              <FormattedMessage id="table.auto-execs" />
            </Th>
            {deprecated && (
              <Th name="deprecated" icon="flag">
                <FormattedMessage id="table.deprecated" />
              </Th>
            )}
            <Th className="separated-cell" onClick={handleInstancesClick} icon="layout-grid">
              <FormattedMessage id="table.instances" />
            </Th>
            <Th name="TOTAL" icon="grid">
              <FormattedMessage id="table.all" />
            </Th>
            <Th className="separated-cell" icon="pie-chart">
              <FormattedMessage id="table.disposition" /> (%)
            </Th>
            <Th className="normal" icon="time">
              <FormattedMessage id="table.sla" /> (%)
            </Th>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={collection.length === 0} cols={deprecated ? 10 : 9}>
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (workflow: any, index: number) => (
                  <Row
                    first={index === 0}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                    key={workflow.id}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                    isActive={workflow.id === parseInt(paneId, 10)}
                    openPane={openPane}
                    closePane={closePane}
                    date={date}
                    select={select}
                    updateDone={updateDone}
                    states={states}
                    showDeprecated={deprecated}
                    expanded={expanded}
                    isTablet={isTablet}
                    setRemote={setRemote}
                    band={band.replace(/ /g, '_')}
                    {...workflow} />
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    );
  };

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    updateDone: actions.workflows.updateDone,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    select: actions.workflows.select,
  }),
  withModal(),
  withHandlers({
    handleDispositionChange:
      ({ changeDispositionQuery }: Props): Function =>
      (
        // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
        event: EventHandler,
        title: string
      ): void => {
        changeDispositionQuery(title);
      },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('date'),
  pure([
    'sortData',
    'expanded',
    'collection',
    'deprecated',
    'paneId',
    'date',
    'isTablet',
    'totalInstances',
    'dateQuery',
    'band',
  ]),
  injectIntl
)(WorkflowsTable);
