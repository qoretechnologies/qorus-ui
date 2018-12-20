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

type Props = {
  order: Object,
  steps: Object,
};

const StepsTable: Function = ({ steps }: Props): React.Element<Table> => (
  <NoDataIf condition={size(steps) === 0} big inBox>
    {() => (
      <Box top fill>
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
                          Status
                        </Th>
                        <Th icon="info-sign" name="custom_status">
                          Custom Status
                        </Th>
                        <IdColumnHeader name="subworkflow_instanceid">
                          SubWF IID
                        </IdColumnHeader>
                        <Th icon="error" name="error_type">
                          Error Type
                        </Th>
                        <Th icon="info-sign" name="ind">
                          Ind
                        </Th>
                        <Th icon="refresh" name="retries">
                          Retries
                        </Th>
                        <Th icon="exclude-row" name="skip">
                          Skip
                        </Th>
                        <DateColumnHeader name="started">
                          Started
                        </DateColumnHeader>
                        <DateColumnHeader name="completed">
                          Completed
                        </DateColumnHeader>
                      </FixedRow>
                    </Thead>
                    <Tbody>
                      {map(collection, (step: Object, stepIndex: number) => (
                        <Tr first={stepIndex === 0} key={stepIndex}>
                          <NameColumn name={step.stepname} />
                          <Td className="normal">
                            <span
                              className={`label status-${
                                ALL_ORDER_STATES.find(
                                  o => o.name === step.stepstatus
                                ).label
                              }`}
                            >
                              {step.stepstatus}
                            </span>
                          </Td>
                          <Td className="big">{step.custom_status}</Td>
                          <IdColumn className="medium">
                            {step.subworkflow_instanceid}
                          </IdColumn>
                          <Td className="medium">{step.error_type}</Td>
                          <Td className="narrow">{step.ind}</Td>
                          <Td className="normal">{step.retries}</Td>
                          <Td className="narrow">
                            <ContentByType content={step.skip} />
                          </Td>
                          <DateColumn>{step.started}</DateColumn>
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
      steps: order.StepInstances,
      order,
      ...rest,
    })
  ),
  mapProps(
    ({ steps, ...rest }: Props): Props => ({
      steps: steps && steps.length ? groupInstances(steps) : {},
      ...rest,
    })
  )
)(StepsTable);
