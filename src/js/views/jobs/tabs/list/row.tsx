/* @flow */
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { DateColumn } from '../../../../components/DateColumn';
import NameColumn from '../../../../components/NameColumn';
import { Td, Tr } from '../../../../components/new_table';
import actions from '../../../../store/api/actions';
import { StatusLabel } from '../../../workflows/tabs/list/row';

type Props = {
  id: number;
  job_instanceid: number;
  _updated: boolean;
  jobstatus: string;
  started: string;
  modified: string;
  completed: string;
  handleUpdateDone: Function;
  handleDetailClick: Function;
  updateDone: Function;
  changeJobQuery: Function;
  active: boolean;
  first: boolean;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr
    first={first}
    highlight={_updated}
    onHighlightEnd={handleUpdateDone}
    className={active ? 'row-active' : ''}
  >
    <NameColumn name={instanceId} isActive={active} onDetailClick={handleDetailClick} type="job" />
    <Td className="medium">
      <StatusLabel text={jobstatus} label={jobstatus.toLowerCase()} />
    </Td>
    <DateColumn>{started}</DateColumn>
    <DateColumn>{modified}</DateColumn>
    <DateColumn>{completed}</DateColumn>
  </Tr>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    updateDone: actions.jobs.instanceUpdateDone,
  }),
  withHandlers({
    handleDetailClick:
      ({ changeJobQuery, job_instanceid, active }: Props): Function =>
      (): void => {
        if (active) {
          changeJobQuery();
        } else {
          changeJobQuery(job_instanceid);
        }
      },
    handleUpdateDone:
      ({ updateDone, id, job_instanceid }: Props): Function =>
      (): void => {
        updateDone(id, job_instanceid);
      },
  }),
  pure(['_updated', 'jobstatus', 'modified', 'completed', 'active'])
)(JobInstanceRow);
