// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';
import { Link } from 'react-router';

import { Tr, Td } from '../../components/new_table';
import Checkbox from '../../components/checkbox';
import Date from '../../components/date';
import JobControls from './controls';
import { Controls, Control as Button } from '../../components/controls';
import Badge from '../../components/badge';

type Props = {
  openPane: Function,
  isActive?: boolean,
  updateDone: Function,
  select: Function,
  _updated?: boolean,
  has_alerts?: boolean,
  handleHighlightEnd: Function,
  handleCheckboxClick: Function,
  handleDetailClick: Function,
  handleWarningClick: Function,
  _selected?: boolean,
  id: number,
  type?: string,
  name: string,
  version: string,
  desc: string,
  enabled: boolean,
  active: boolean,
  last_executed: string,
  next: string,
  expiry_date: string,
  COMPLETE?: number,
  ERROR?: number,
  PROGRESS?: number,
  CRASHED?: number,
  date: string,
  minute: string,
  hour: string,
  day: string,
  month: string,
  wday: string,
};

const ServiceRow: Function = ({
  _updated,
  isActive,
  has_alerts: hasAlerts,
  handleHighlightEnd,
  handleCheckboxClick,
  handleDetailClick,
  handleWarningClick,
  _selected,
  date,
  id,
  name,
  version,
  enabled,
  active,
  last_executed: executed,
  next,
  expiry_date: expiry,
  COMPLETE,
  ERROR,
  PROGRESS,
  CRASHED,
  minute,
  hour,
  day,
  month,
  wday,
}: Props): React.Element<any> => (
  <Tr
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
    className={classnames({
      info: isActive,
      'row-alert': hasAlerts,
    })}
  >
    <Td className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    <Td className="narrow">
      <Button
        label="Detail"
        btnStyle="success"
        onClick={handleDetailClick}
        title="Open detail pane"
      />
    </Td>
    <Td className="big">
      <JobControls
        enabled={enabled}
        active={active}
        id={id}
        minute={minute}
        hour={hour}
        day={day}
        month={month}
        week={wday}
      />
    </Td>
    <Td className="narrow">
      { hasAlerts && (
        <Controls>
          <Button
            icon="warning"
            btnStyle="danger"
            onClick={handleWarningClick}
            title="Show alerts"
          />
        </Controls>
      )}
    </Td>
    <Td className="narrow">{id}</Td>
    <Td className="name">
      <Link
        to={`/job/${id}?date=${date}`}
        className="resource-name-link"
        title={name}
      >
        {name}
      </Link>
    </Td>
    <Td className="normal text">{version}</Td>
    <Td className="big">
      <Date date={executed} />
    </Td>
    <Td className="big">
      <Date date={next} />
    </Td>
    <Td className="big">
      <Date date={expiry} />
    </Td>
    <Td className="normal">
      <Link
        to={`/job/${id}?date=${date}&filter=complete`}
      >
        <Badge
          className="status-complete"
          val={COMPLETE || 0}
        />
      </Link>
    </Td>
    <Td className="normal">
      <Link
        to={`/job/${id}?date=${date}&filter=error`}
      >
        <Badge
          className="status-error"
          val={ERROR || 0}
        />
      </Link>
    </Td>
    <Td className="normal">
      <Link
        to={`/job/${id}?date=${date}&filter=in-progress`}
      >
        <Badge
          className="status-in-progress"
          val={PROGRESS || 0}
        />
      </Link>
    </Td>
    <Td className="normal">
      <Link
        to={`/job/${id}?date=${date}&filter=crashed`}
      >
        <Badge
          className="status-canceled"
          val={CRASHED || 0}
        />
      </Link>
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, id }: Props): Function => (): void => {
      updateDone(id);
    },
    handleDetailClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id);
    },
    handleWarningClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id, 'detail');
    },
  }),
  pure([
    'isActive',
    'enabled',
    'active',
    'last_executed',
    'alerts',
    'has_alerts',
    '_selected',
    '_updated',
    'next',
    'expiry_date',
    'COMPLETE',
    'ERROR',
    'PROGRESS',
    'CRASHED',
  ])
)(ServiceRow);
