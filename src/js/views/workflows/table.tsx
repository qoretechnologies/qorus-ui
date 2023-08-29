import { ReqoreButton, ReqoreControlGroup, ReqoreTable } from '@qoretechnologies/reqore';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Datepicker from '../../components/datepicker';
import InstancesBar from '../../components/instances_bar';
import withModal from '../../hocomponents/modal';
import queryControl from '../../hocomponents/queryControl';
import actions from '../../store/api/actions';
import Controls from './controls';
import SortModal from './modals/sort_modal';

type Props = {
  sortData: any;
  onSortChange: Function;
  states: any;
  deprecated?: boolean;
  collection: { [key: string]: any }[];
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
  closePane,
  date,
  select,
  updateDone,
  expanded,
  canLoadMore,
  isTablet,
  setRemote,
  handleInstancesClick,
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
  return (
    <>
      <ReqoreTable
        icon="GitBranchLine"
        label="Workflows"
        breadcrumbs={{
          items: [
            {
              label: 'Home',
              icon: 'Home3Line',
              as: Link,
              props: {
                to: '/',
              },
            },
            {
              label: 'Workflows',
              active: true,
            },
          ],
        }}
        striped
        flat
        fill
        selectable
        exportable
        filterable
        paging={{
          itemsPerPage: 200,
          infinite: true,
        }}
        selected={collection.filter((item) => item._selected).map((item) => item.id)}
        sort={{
          by: 'id',
          direction: 'desc',
        }}
        columns={[
          {
            dataId: 'id',
            align: 'center',
            sortable: true,
            width: 90,
            resizable: false,
            hideable: false,
            header: {
              icon: 'ListOrdered',
              tooltip: 'ID',
            },
          },
          {
            dataId: 'actions',
            align: 'center',
            pin: 'right',
            width: 130,
            header: {
              label: 'Actions',
              icon: 'Settings4Fill',
              tooltip: 'Actions',
            },
            cell: {
              content: ({ _size, id, enabled, remote, ...rest }) => (
                <Controls id={id} enabled={enabled} remote={remote} size={_size} />
              ),
            },
          },
          {
            dataId: 'name',
            align: 'left',
            sortable: true,
            width: 300,
            grow: 3,
            header: {
              label: 'Name',
              icon: 'PriceTagLine',
              tooltip: 'Name',
            },
            cell: {
              padded: 'none',
              content: ({ name, id, _size }) => (
                <ReqoreButton
                  onClick={(e) => e.stopPropagation()}
                  icon="GitBranchLine"
                  size={_size}
                >
                  <Link to={`workflow/${id}?date=${date}`}>{name}</Link>
                </ReqoreButton>
              ),
            },
          },
          {
            dataId: 'date-picker',

            header: {
              content: (
                <Datepicker
                  key="datepicker"
                  date={dateQuery || '24h'}
                  onApplyDate={changeDateQuery}
                />
              ),
              columns: [
                {
                  dataId: 'instances',
                  align: 'center',
                  width: 150,
                  resizable: true,
                  filterable: true,
                  sortable: true,
                  header: {
                    label: 'Instances',
                    icon: 'GridLine',
                    tooltip: 'Instances',
                  },
                  cell: {
                    content: ({ TOTAL, id, ...rest }) => (
                      <InstancesBar
                        states={states}
                        instances={rest}
                        totalInstances={TOTAL}
                        id={id}
                        date={date}
                      />
                    ),
                  },
                },
                {
                  dataId: 'TOTAL',
                  align: 'center',
                  width: 50,
                  resizable: true,
                  filterable: true,
                  sortable: true,
                  header: {
                    label: 'All',
                    icon: 'GridFill',
                    tooltip: 'Total number of instances',
                  },
                  cell: {
                    content: ({ TOTAL, id }) => (
                      <ReqoreControlGroup fluid>
                        <ReqoreButton
                          textAlign="center"
                          disabled={TOTAL === 0}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            to={`workflow/${id}?date=${date}`}
                            style={{ width: '100%', display: 'inline-block' }}
                          >
                            {TOTAL.toString()}
                          </Link>
                        </ReqoreButton>
                      </ReqoreControlGroup>
                    ),
                  },
                },
              ],
            },
          },
        ]}
        data={collection.map((item) => ({
          ...item,
          _selectId: item.id,
          _intent: paneId == item.id ? 'info' : undefined,
        }))}
        onRowClick={({ id }) => openPane(id)}
      />
    </>
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
    handleInstancesClick:
      ({ sortData, onSortChange, openModal, closeModal }: Props): Function =>
      (): void => {
        openModal(
          <SortModal sortData={sortData} onSortChange={onSortChange} closeModal={closeModal} />
        );
      },
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
