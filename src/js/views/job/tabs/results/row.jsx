/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import { Tr, Td } from '../../../../components/new_table';
import Date from '../../../../components/date';
import actions from '../../../../store/api/actions';
import { Control } from '../../../../components/controls';

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
}: Props): React.Element<any> => (
  <Tr
    highlight={_updated}
    onHighlightEnd={handleUpdateDone}
    className={active ? 'info' : ''}
  >
    <Td className="big">{instanceId}</Td>
    <Td className="narrow">
      <Control
        label="Detail"
        btnStyle="success"
        onClick={handleDetailClick}
        title="Open detail"
      />
    </Td>
    <Td className="medium">
      <span className={`label status-${jobstatus.toLowerCase()}`}>
        {jobstatus}
      </span>
    </Td>
    <Td className="big"><Date date={started} /></Td>
    <Td className="big"><Date date={modified} /></Td>
    <Td className="big"><Date date={completed} /></Td>
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
    handleDetailClick: ({ changeJobQuery, job_instanceid }: Props): Function => (): void => {
      changeJobQuery(job_instanceid);
    },
    handleUpdateDone: ({ updateDone, id, job_instanceid }: Props): Function => (): void => {
      updateDone(id, job_instanceid);
    },
  }),
  pure([
    '_updated',
    'jobstatus',
    'modified',
    'completed',
    'active',
  ])
)(JobInstanceRow);
