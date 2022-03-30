// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import { Tr, Td } from '../../../components/new_table';
import Text from '../../../components/text';
import Date from '../../../components/date';
import { getAlertObjectLink } from '../../../helpers/system';
import actions from '../../../store/api/actions';
import NameColumn from '../../../components/NameColumn';

type Props = {
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'alertid'.
  alertid: number,
  updateDone: Function,
  openPane: Function,
  handleDetailClick: Function,
  handleHighlightEnd: Function,
  isActive?: boolean,
  _updated: boolean,
  type: string,
  id: string | number,
  alert: string,
  object: string,
  when: string,
  name: string,
  first: boolean,
  closePane: Function,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'alertid'.
  alertid: number,
};

const AlertRow: Function = ({
  handleDetailClick,
  handleHighlightEnd,
  type,
  alert,
  alertid,
  id,
  when,
  name,
  _updated,
  isActive,
  first,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Tr
    first={first}
    className={isActive ? 'row-active' : ''}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
  >
    <Td className="narrow">{alertid}</Td>
    <NameColumn
      link={getAlertObjectLink(type, { name, id })}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      name={name}
      type={type}
    />
    <Td className="big text">
      <Text text={type} />
    </Td>
    <Td className="alerts-large text">
      <Text text={alert} />
    </Td>

    <Td className="big">
      <Date date={when} />
    </Td>
  </Tr>
);

export default compose(
  connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
      updateDone: actions.alerts.updateDone,
    }
  ),
  withHandlers({
    handleHighlightEnd: ({
      alertid,
      updateDone,
    }: Props): Function => (): void => {
      updateDone(alertid);
    },
    handleDetailClick: ({
      alertid,
      openPane,
      closePane,
      isActive,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(alertid);
      }
    },
  }),
  pure(['isActive', '_updated'])
)(AlertRow);
