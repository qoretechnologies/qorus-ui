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
};

const AlertRow: Function = ({
  handleDetailClick,
  handleHighlightEnd,
  type,
  alert,
  id,
  object,
  when,
  name,
  _updated,
  isActive,
  first,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    className={isActive ? 'row-active' : ''}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
  >
    <Td className="big text">
      <Text text={type} />
    </Td>
    <Td className="alerts-large text">
      <Text text={alert} />
    </Td>
    <NameColumn
      link={getAlertObjectLink(type, { name, id })}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      name={object}
    />
    <Td className="big">
      <Date date={when} />
    </Td>
  </Tr>
);

export default compose(
  connect(
    null,
    {
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
      type,
      id,
      openPane,
      closePane,
      isActive,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(`${type}:${id}`);
      }
    },
  }),
  pure(['isActive', '_updated'])
)(AlertRow);
