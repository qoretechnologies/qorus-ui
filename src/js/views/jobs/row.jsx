// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';

import { Tr, Td } from '../../components/new_table';
import Checkbox from '../../components/checkbox';
import Date from '../../components/date';
import JobControls from './controls';
import InstancesBar from '../../components/instances_bar';
import Box from '../../components/box';
import PaneItem from '../../components/pane_item';
import ProcessSummary from '../../components/ProcessSummary';
import NameColumn from '../../components/NameColumn';
import { SelectColumn } from '../../components/SelectColumn';
import { IdColumn } from '../../components/IdColumn';
import { ActionColumn } from '../../components/ActionColumn';
import { DateColumn } from '../../components/DateColumn';

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
  _selected?: boolean,
  id: number,
  type?: string,
  name: string,
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
  normalizedName: string,
  isTablet: boolean,
  first: boolean,
  remote: boolean,
};

const ServiceRow: Function = ({
  _updated,
  isActive,
  has_alerts: hasAlerts,
  handleHighlightEnd,
  handleCheckboxClick,
  handleDetailClick,
  _selected,
  date,
  id,
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
  first,
  normalizedName,
  remote,
  ...rest
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
    <SelectColumn onClick={handleCheckboxClick} checked={_selected} />
    <IdColumn>{id}</IdColumn>
    <NameColumn
      popoverContent={
        <Box top>
          <PaneItem title={normalizedName}>{rest.description}</PaneItem>
          <ProcessSummary model={{ enabled, remote, ...rest }} />
        </Box>
      }
      link={`/job/${id}?date=${date}`}
      name={normalizedName}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      hasAlerts={hasAlerts}
      type="job"
    />
    <ActionColumn className="big">
      <JobControls
        enabled={enabled}
        active={active}
        id={id}
        minute={minute}
        hour={hour}
        day={day}
        month={month}
        week={wday}
        remote={remote}
      />
    </ActionColumn>
    <DateColumn>{executed}</DateColumn>
    <DateColumn>
      <Date date={next} />
    </DateColumn>
    <DateColumn>
      <Date date={expiry} />
    </DateColumn>
    <Td className="huge separated-cell">
      <InstancesBar
        states={[
          { name: 'COMPLETE', label: 'complete', title: 'Complete' },
          { name: 'ERROR', label: 'error', title: 'Error' },
          { name: 'PROGRESS', label: 'waiting', title: 'In-progress' },
          { name: 'CRASHED', label: 'blocked', title: 'Crashed' },
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
    'remote',
  ])
)(ServiceRow);
