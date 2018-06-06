// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Tr, Td } from '../../../components/new_table';
import Text from '../../../components/text';
import Date from '../../../components/date';
import Icon from '../../../components/icon';
import { Control as Button } from '../../../components/controls';
import { getAlertObjectLink } from '../../../helpers/system';
import actions from '../../../store/api/actions';

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
    className={isActive ? 'info' : ''}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
  >
    <Td className="tiny">
      <Icon icon="warning" />
    </Td>
    <Td className="narrow">
      <Button label="Detail" btnStyle="success" onClick={handleDetailClick} />
    </Td>
    <Td className="big text">
      <Text text={type} />
    </Td>
    <Td className="alerts-large text">
      <Text text={alert} />
    </Td>
    <Td className="name">
      <Link
        className="resource-name-link"
        to={getAlertObjectLink(type, { name, id })}
        title={object}
      >
        {object}
      </Link>
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
    }: Props): Function => (): void => {
      openPane(`${type}:${id}`);
    },
  }),
  pure(['isActive', '_updated'])
)(AlertRow);
