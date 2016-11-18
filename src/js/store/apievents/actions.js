import { createAction } from 'redux-actions';

import * as alerts from '../api/resources/alerts/actions';
import * as services from '../api/resources/services/actions/specials';
import * as workflows from '../api/resources/workflows/actions/specials';
import * as orders from '../api/resources/orders/actions/specials';
import * as jobs from '../api/resources/jobs/actions/specials';
import * as groups from '../api/resources/groups/actions/specials';
import * as remotes from '../api/resources/remotes/actions';

const handleEvent = (url, data, dispatch, state) => {
  const dt = JSON.parse(data);

  dt.forEach(d => {
    const { info, eventstr } = d;

    switch (eventstr) {
      case 'ALERT_ONGOING_RAISED':
        switch (info.type) {
          case 'WORKFLOW':
            dispatch(workflows.addAlert({ ...info, ...{ alerttype: 'ONGOING' } }));
            break;
          case 'SERVICE':
            dispatch(services.addAlert({ ...info, ...{ alerttype: 'ONGOING' } }));
            break;
          case 'JOB':
            dispatch(jobs.addAlert({ ...info, ...{ alerttype: 'ONGOING' } }));
            break;
          case 'REMOTE':
          case 'DATASOURCE':
          case 'USER-CONNECTION':
            dispatch(remotes.addAlert({ ...info, ...{ alerttype: 'ONGOING' } }));
            break;
          default:
            break;
        }

        dispatch(alerts.raised({ ...info, ...{ when: d.time } }, 'ONGOING'));

        break;
      case 'ALERT_ONGOING_CLEARED':
        switch (info.type) {
          case 'WORKFLOW':
            dispatch(workflows.clearAlert(info.id, info.alertid));
            break;
          case 'SERVICE':
            dispatch(services.clearAlert(info.id, info.alertid));
            break;
          case 'JOB':
            dispatch(jobs.clearAlert(info.id, info.alertid));
            break;
          case 'REMOTE':
          case 'USER-CONNECTION':
          case 'DATASOURCE':
            dispatch(remotes.clearAlert(info.id, info.type, info.alertid));
            break;
          default:
            break;
        }

        dispatch(alerts.cleared(info.alertid));
        break;
      case 'ALERT_TRANSIENT_RAISED':
        dispatch(alerts.raised({ ...info, ...{ when: d.time } }, 'TRANSIENT'));
        break;
      case 'SERVICE_STOP':
        dispatch(services.setStatus(info.serviceid, 'unloaded'));
        break;
      case 'SERVICE_START':
        dispatch(services.setStatus(info.serviceid, 'loaded'));
        break;
      case 'WORKFLOW_STOP':
        dispatch(workflows.setExecCount(info.workflowid, -1));
        break;
      case 'WORKFLOW_START':
        dispatch(workflows.setExecCount(info.workflowid, 1));
        break;
      case 'WORKFLOW_DATA_SUBMITTED':
        dispatch(workflows.addOrder(info.workflowid, info.status));
        dispatch(orders.addOrder(info, d.time));
        break;
      case 'WORKFLOW_STATUS_CHANGED':
        dispatch(workflows.modifyOrder(info.workflowid, info.info.old, info.info.new));
        dispatch(orders.modifyOrder(info.workflow_instanceid, info.info.new, d.time));
        break;
      case 'WORKFLOW_INFO_CHANGED':
        dispatch(orders.addNoteWebsocket(info.workflow_instanceid, info.info));
        break;
      case 'WORKFLOW_DATA_UPDATED': {
        const order = state.api.orders.data.find(ord => ord.id === info.workflow_instanceid);

        if (order) {
          dispatch(orders.fetchData(info.workflow_instanceid, info.datatype));
        }
        break;
      }
      case 'JOB_STOP':
        dispatch(jobs.setActive(info.jobid, false));
        break;
      case 'JOB_START':
        dispatch(jobs.setActive(info.jobid, true));
        break;
      case 'JOB_INSTANCE_START':
        dispatch(jobs.addInstance(info, d.time));
        break;
      case 'JOB_INSTANCE_STOP':
        dispatch(jobs.modifyInstance(info, d.time));
        break;
      case 'CONNECTION_UP':
        dispatch(remotes.connectionChange(info.name, true));
        break;
      case 'CONNECTION_DOWN':
        dispatch(remotes.connectionChange(info.name, false));
        break;
      case 'SYSTEM_HEALTH_CHANGE':
        break;
      case 'GROUP_STATUS_CHANGED':
        if (info.synthetic) {
          switch (info.type) {
            case 'workflow':
              dispatch(workflows.setEnabled(info.id, info.enabled));
              break;
            case 'service':
              dispatch(services.setEnabled(info.id, info.enabled));
              break;
            case 'job':
              dispatch(jobs.setEnabled(info.id, info.enabled));
              break;
            default:
              break;
          }
        } else {
          dispatch(groups.setEnabled(info.name, info.enabled));
        }

        break;
      default:
        break;
    }
  });
};

const messageAction = createAction(
  'APIEVENTS_MESSAGE',
  handleEvent,
);

const message = (url, data) => (dispatch, getState) => {
  dispatch(messageAction(url, data, dispatch, getState()));
};

export {
  message,
};
