// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import checkData from '../../hocomponents/check-no-data';
import actions from '../../store/api/actions';
import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Icon from '../../components/icon';
import Row from './row';

type Props = {
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  paneId: string | number,
  openPane: Function,
  closePane: Function,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
  isTablet: boolean,
};

const ServicesTable: Function = ({
  sortData,
  onSortChange,
  collection,
  paneId,
  openPane,
  closePane,
  select,
  updateDone,
  canLoadMore,
  isTablet,
}: Props): React.Element<any> => (
  <Table
    fixed
    hover
    condensed
    striped
    className="resource-table"
    marginBottom={canLoadMore ? 45 : 0}
    key={collection.length}
  >
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny">-</Th>
        <Th className="narrow">-</Th>
        <Th className="narrow" name="type">
          Type
        </Th>
        {!isTablet && <Th className="medium">Actions</Th>}
        <Th className="narrow" name="threads">
          Threads
        </Th>
        <Th className="tiny" name="has_alerts">
          <Icon iconName="warning" />
        </Th>
        <Th className="narrow" name="id">
          ID
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th className="normal text" name="version">
          Version
        </Th>
        <Th name="desc">Description</Th>
        <Th className="narrow" name="remote">
          Remote
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (service: Object, index: number): React.Element<Row> => (
          <Row
            first={index === 0}
            key={`service_${service.id}`}
            isActive={service.id === parseInt(paneId, 10)}
            openPane={openPane}
            closePane={closePane}
            select={select}
            updateDone={updateDone}
            isTablet={isTablet}
            {...service}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.services.updateDone,
      select: actions.services.select,
    }
  ),
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
  ),
  pure(['collection', 'sortData', 'paneId'])
)(ServicesTable);
