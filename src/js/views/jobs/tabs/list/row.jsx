/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import { Tr, Td } from '../../../../components/new_table';
import Date from '../../../../components/date';
import actions from '../../../../store/api/actions';
import NameColumn from '../../../../components/NameColumn';
import { DateColumn } from '../../../../components/DateColumn';

type Props = {
  id: number,
  job_instanceid: number,
  _updated: boolean,
  jobstatus: string,
  started: string,
  modified: string,
  completed: string,
  handleUpdateDone: Function,
  handleDetailClick: Function,
  updateDone: Function,
  changeJobQuery: Function,
  active: boolean,
  first: boolean,
};

const JobInstanceRow: Function = ({
  handleDetailClick,
  handleUpdateDone,
  job_instanceid: instanceId,
  _updated,
  jobstatus,
  started,
  modified,
  completed,
  active,
  first,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    highlight={_updated}
    onHighlightEnd={handleUpdateDone}
    className={active ? 'row-active' : ''}
  >
    <NameColumn
      name={instanceId}
      isActive={active}
      onDetailClick={handleDetailClick}
      type="job"
    />
    <Td className="medium">
      <span className={`label status-${jobstatus.toLowerCase()}`}>
        {jobstatus}
      </span>
    </Td>
    <DateColumn>{started}</DateColumn>
    <DateColumn>{modified}</DateColumn>
    <DateColumn>{completed}</DateColumn>
  </Tr>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.jobs.instanceUpdateDone,
    }
  ),
  withHandlers({
    handleDetailClick: ({
      changeJobQuery,
      job_instanceid,
      active,
    }: Props): Function => (): void => {
      if (active) {
        changeJobQuery();
      } else {
        changeJobQuery(job_instanceid);
      }
    },
    handleUpdateDone: ({
      updateDone,
      id,
      job_instanceid,
    }: Props): Function => (): void => {
      updateDone(id, job_instanceid);
    },
  }),
  pure(['_updated', 'jobstatus', 'modified', 'completed', 'active'])
)(JobInstanceRow);
