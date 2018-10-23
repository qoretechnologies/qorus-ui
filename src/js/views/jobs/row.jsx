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
import DetailButton from '../../components/detail_button';
import { formatCount } from '../../helpers/orders';
import InstancesBar from '../../components/instances_bar';

type Props = {
  openPane: Function,
  closePane: Function,
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
  isTablet: boolean,
  first: boolean,
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
  COMPLETE: COMPLETE = 0,
  ERROR: ERROR = 0,
  PROGRESS: PROGRESS = 0,
  CRASHED: CRASHED = 0,
  minute,
  hour,
  day,
  month,
  wday,
  isTablet,
  first,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
    className={classnames({
      'row-alert': hasAlerts,
      'row-selected': _selected,
      'row-active': isActive,
    })}
    onClick={handleCheckboxClick}
  >
    <Td className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    <Td className="narrow">
      <DetailButton active={isActive} onClick={handleDetailClick} />
    </Td>
    {!isTablet && (
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
    )}
    <Td className="narrow">
      {hasAlerts && (
        <Controls>
          <Button
            iconName="warning-sign"
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
    <Td className="huge separated-cell">
      <InstancesBar
        states={[
          { name: 'COMPLETE', label: 'complete', title: 'complete' },
          { name: 'ERROR', label: 'error', title: 'error' },
          { name: 'PROGRESS', label: 'waiting', title: 'in-progress' },
          { name: 'CRASHED', label: 'blocked', title: 'crashed' },
        ]}
        instances={{
          COMPLETE,
          ERROR,
          PROGRESS,
          CRASHED,
        }}
        type="job"
        totalInstances={COMPLETE + ERROR + PROGRESS + CRASHED}
        id={id}
        date={date}
      />
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
    handleDetailClick: ({
      openPane,
      id,
      closePane,
      isActive,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane();
      } else {
        openPane(id);
      }
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
    'isTablet',
  ])
)(ServiceRow);
