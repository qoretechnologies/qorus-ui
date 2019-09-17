// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Link } from 'react-router';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../../../components/new_table';
import Autocomponent from '../../../../../components/autocomponent';
import Icon from '../../../../../components/icon';
import Date from '../../../../../components/date';
import actions from '../../../../../store/api/actions';
import { FormattedMessage } from 'react-intl';

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
      <FixedRow {...{ sortData, onSortChange }}>
        <Th className="narrow" name="sla_eventid" onClick={handleHeaderClick}>
          <FormattedMessage id="table.id" />
        </Th>
        <Th className="text" name="err" onClick={handleHeaderClick}>
          <FormattedMessage id="table.error" />
        </Th>
        <Th className="text" name="errdesc" onClick={handleHeaderClick}>
          <FormattedMessage id="table.error-description" />
        </Th>
        <Th className="text" name="producer" onClick={handleHeaderClick}>
          <FormattedMessage id="table.producer" />
        </Th>
        <Th className="big" name="created" onClick={handleHeaderClick}>
          <FormattedMessage id="table.created" />
        </Th>
        <Th className="tiny" name="success" onClick={handleHeaderClick}>
          <Icon iconName="check" />
        </Th>
        <Th className="text" name="value" onClick={handleHeaderClick}>
          <FormattedMessage id="table.value" />
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map((event: Object, idx: number): React.Element<any> => {
        const producerSplit = event.producer.split(' ');
        const producerType = producerSplit[0] === 'job' ? 'job' : 'services';
        const producerId = producerSplit[producerSplit.length - 1];
        const producerResourceId = producerSplit[3]
          .replace('(', '')
          .replace(')', '');
        const producerUrl =
          producerType === 'job'
            ? `/job/${producerResourceId}/results?job=${producerId}`
            : `/services?paneId=${producerResourceId}`;

        return (
          <Tr key={event.sla_eventid} first={idx === 0}>
            <Td className="narrow">{event.sla_eventid}</Td>
            <Td className="text">{event.err}</Td>
            <Td className="text">{event.errdesc}</Td>
            <Td className="text">
              <Link to={producerUrl}>{event.producer}</Link>
            </Td>
            <Td className="big">
              <Date date={event.created} />
            </Td>
            <Td className="tiny">
              <Autocomponent>{event.success}</Autocomponent>
            </Td>
            <Td className="text">{event.value}</Td>
          </Tr>
        );
      })}
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
  pure(['collection', 'sortData'])
)(SLAEventsTable);
