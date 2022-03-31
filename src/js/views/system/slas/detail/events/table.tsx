// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Autocomponent from '../../../../../components/autocomponent';
import Date from '../../../../../components/date';
import Icon from '../../../../../components/icon';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../../../components/new_table';
import actions from '../../../../../store/api/actions';

type Props = {
  collection: Array<Object>;
  sortData: any;
  onSortChange: Function;
  sort: Function;
  handleHeaderClick: Function;
  canLoadMore: boolean;
};

const SLAEventsTable: Function = ({
  collection,
  sortData,
  onSortChange,
  handleHeaderClick,
  canLoadMore,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Table fixed striped condensed key={collection.length} marginBottom={canLoadMore ? 20 : 0}>
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
          <Icon icon="check" />
        </Th>
        <Th className="text" name="value" onClick={handleHeaderClick}>
          <FormattedMessage id="table.value" />
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {/* @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message */}
      {collection.map((event: any, idx: number) => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
        const producerSplit = event.producer.split(' ');
        const producerType = producerSplit[0] === 'job' ? 'job' : 'services';
        const producerId = producerSplit[producerSplit.length - 1];
        const producerResourceId = producerSplit[3].replace('(', '').replace(')', '');
        const producerUrl =
          producerType === 'job'
            ? `/job/${producerResourceId}/results?job=${producerId}`
            : `/services?paneId=${producerResourceId}`;

        return (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sla_eventid' does not exist on type 'Obj... Remove this comment to see the full error message
          <Tr key={event.sla_eventid} first={idx === 0}>
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'sla_eventid' does not exist on type 'Obj... Remove this comment to see the full error message */}
            <Td className="narrow">{event.sla_eventid}</Td>
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'. */}
            <Td className="text">{event.err}</Td>
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'errdesc' does not exist on type 'Object'... Remove this comment to see the full error message */}
            <Td className="text">{event.errdesc}</Td>
            <Td className="text">
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message */}
              <Link to={producerUrl}>{event.producer}</Link>
            </Td>
            <Td className="big">
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message */}
              <Date date={event.created} />
            </Td>
            <Td className="tiny">
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'success' does not exist on type 'Object'... Remove this comment to see the full error message */}
              <Autocomponent>{event.success}</Autocomponent>
            </Td>
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'. */}
            <Td className="text">{event.value}</Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaevents' does not exist on type '{}'.
    sort: actions.slaevents.changeServerSort,
  }),
  withHandlers({
    handleHeaderClick:
      ({ sort }: Props): Function =>
      (name: string): void => {
        sort(name);
      },
  }),
  pure(['collection', 'sortData'])
)(SLAEventsTable);
