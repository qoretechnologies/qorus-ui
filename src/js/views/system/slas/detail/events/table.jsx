// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import { Table, Thead, Tbody, Tr, Th, Td } from '../../../../../components/new_table';
import Autocomponent from '../../../../../components/autocomponent';
import Icon from '../../../../../components/icon';
import Date from '../../../../../components/date';
import actions from '../../../../../store/api/actions';

type Props = {
  collection: Array<Object>,
  sortData: Object,
  onSortChange: Function,
  sort: Function,
  handleHeaderClick: Function,
  canLoadMore: boolean,
};

const SLAEventsTable: Function = ({
  collection,
  sortData,
  onSortChange,
  handleHeaderClick,
  canLoadMore,
}: Props): React.Element<any> => (
  <Table
    fixed
    striped
    condensed
    key={collection.length}
    marginBottom={canLoadMore ? 20 : 0}
  >
    <Thead>
      <Tr {...{ sortData, onSortChange }}>
        <Th className="narrow" name="sla_eventid" onClick={handleHeaderClick}>ID</Th>
        <Th className="text" name="err" onClick={handleHeaderClick}>Error</Th>
        <Th className="text" name="errdesc" onClick={handleHeaderClick}>Error description</Th>
        <Th className="text" name="producer" onClick={handleHeaderClick}>Producer</Th>
        <Th className="big" name="created" onClick={handleHeaderClick}>Created</Th>
        <Th className="tiny" name="success" onClick={handleHeaderClick}>
          <Icon icon="check" />
        </Th>
        <Th className="text" name="value" onClick={handleHeaderClick}>Value</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((event: Object): React.Element<any> => (
        <Tr key={event.sla_eventid}>
          <Td className="narrow">{event.sla_eventid}</Td>
          <Td className="text">{event.err}</Td>
          <Td className="text">{event.errdesc}</Td>
          <Td className="text">{event.producer}</Td>
          <Td className="big">
              <Date date={event.created} />
          </Td>
          <Td className="tiny">
            <Autocomponent>{event.success}</Autocomponent>
          </Td>
          <Td className="text">{event.value}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default compose(
  connect(
    null,
    {
      sort: actions.slaevents.changeServerSort,
    }
  ),
  withHandlers({
    handleHeaderClick: ({ sort }: Props): Function => (name: string): void => {
      sort(name);
    },
  }),
  pure([
    'collection',
    'sortData',
  ])
)(SLAEventsTable);
