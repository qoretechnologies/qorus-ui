// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import map from 'lodash/map';
import size from 'lodash/size';

import { groupInstances } from '../../../helpers/orders';
import {
  Table,
  Thead,
  Tr,
  Th,
  FixedRow,
  Tbody,
  Td,
} from '../../../components/new_table';
import Box from '../../../components/box';
import ExpandableItem from '../../../components/ExpandableItem';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { IdColumnHeader, IdColumn } from '../../../components/IdColumn';
import { DateColumnHeader, DateColumn } from '../../../components/DateColumn';
import ContentByType from '../../../components/ContentByType';
import { ALL_ORDER_STATES } from '../../../constants/orders';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import Pull from '../../../components/Pull';
import LoadMore from '../../../components/LoadMore';
import Search from '../../../containers/search';
import NoDataIf from '../../../components/NoDataIf';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  order: Object,
  steps: Object,
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
const StepsTable: Function = ({ steps, intl }: Props): React.Element<Table> => (
  <NoDataIf condition={size(steps) === 0} big inBox>
    {() => (
      <Box top fill scrollY>
        {Object.keys(steps).map(stepName => (
          <ExpandableItem
            show
            title={`${steps[stepName].name} - ${steps[stepName].status}`}
            key={stepName}
          >
            {() => (
              <EnhancedTable
                collection={steps[stepName].steps}
                searchBy={[
                  'name',
                  'status',
                  'custom_status',
                  'subworkflow_instanceid',
                  'error_type',
                  'ind',
                  'retries',
                  'skip',
                  'started',
                  'completed',
                ]}
                tableId={stepName}
                sortDefault={sortDefaults.steps}
              >
                {({
                  handleSearchChange,
                  handleLoadAll,
                  handleLoadMore,
                  loadMoreCurrent,
                  loadMoreTotal,
                  limit,
                  collection,
                  canLoadMore,
                  sortData,
                  onSortChange,
                }: EnhancedTableProps) => (
                  <Table condensed striped fixed>
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
                              resource="steps"
                            />
                          </Pull>
                        </Th>
                      </FixedRow>
                      <FixedRow {...{ sortData, onSortChange }}>
                        <NameColumnHeader name="stepname" />
                        <Th icon="info-sign" name="stepstatus">
                          <FormattedMessage id='table.status' />
                        </Th>
                        <Th icon="info-sign" name="custom_status">
                          <FormattedMessage id='table.custom-status' />
                        </Th>
                        <IdColumnHeader name="subworkflow_instanceid">
                          <FormattedMessage id='table.subwf-iid' />
                        </IdColumnHeader>
                        <Th icon="error" name="error_type">
                          <FormattedMessage id='table.error-type' />
                        </Th>
                        <Th icon="info-sign" name="ind">
                          <FormattedMessage id='table.ind' />
                        </Th>
                        <Th icon="refresh" name="retries">
                          <FormattedMessage id='table.retries' />
                        </Th>
                        <Th icon="exclude-row" name="skip">
                          <FormattedMessage id='table.skip' />
                        </Th>
                        <DateColumnHeader name="started">
                          <FormattedMessage id='table.started' />
                        </DateColumnHeader>
                        <DateColumnHeader name="completed">
                          <FormattedMessage id='table.completed' />
                        </DateColumnHeader>
                      </FixedRow>
                    </Thead>
                    <Tbody>
                      {map(collection, (step: Object, stepIndex: number) => (
                        <Tr first={stepIndex === 0} key={stepIndex}>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'stepname' does not exist on type 'Object... Remove this comment to see the full error message */ }
                          <NameColumn name={step.stepname} />
                          <Td className="normal">
                            <span
                              className={`label status-${
                                ALL_ORDER_STATES.find(
                                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepstatus' does not exist on type 'Obje... Remove this comment to see the full error message
                                  o => o.name === step.stepstatus
                                ).label
                              }`}
                            >
                              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'stepstatus' does not exist on type 'Obje... Remove this comment to see the full error message */ }
                              {step.stepstatus}
                            </span>
                          </Td>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'custom_status' does not exist on type 'O... Remove this comment to see the full error message */ }
                          <Td className="big">{step.custom_status}</Td>
                          <IdColumn className="medium">
                            { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'subworkflow_instanceid' does not exist o... Remove this comment to see the full error message */ }
                            {step.subworkflow_instanceid}
                          </IdColumn>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'error_type' does not exist on type 'Obje... Remove this comment to see the full error message */ }
                          <Td className="medium">{step.error_type}</Td>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'ind' does not exist on type 'Object'. */ }
                          <Td className="narrow">{step.ind}</Td>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'retries' does not exist on type 'Object'... Remove this comment to see the full error message */ }
                          <Td className="normal">{step.retries}</Td>
                          <Td className="narrow">
                            { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'skip' does not exist on type 'Object'. */ }
                            <ContentByType content={step.skip} />
                          </Td>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'started' does not exist on type 'Object'... Remove this comment to see the full error message */ }
                          <DateColumn>{step.started}</DateColumn>
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message */ }
                          <DateColumn>{step.completed}</DateColumn>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </EnhancedTable>
            )}
          </ExpandableItem>
        ))}
      </Box>
    )}
  </NoDataIf>
);

export default compose(
  mapProps(
    ({ order, ...rest }: Props): Props => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
      steps: order.StepInstances,
      order,
      ...rest,
    })
  ),
  mapProps(
    ({ steps, ...rest }: Props): Props => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'Object'.
      steps: steps && steps.length ? groupInstances(steps) : {},
      ...rest,
    })
  ),
  injectIntl
)(StepsTable);
