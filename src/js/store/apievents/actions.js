import { createAction } from 'redux-actions';

import * as alerts from '../api/resources/alerts/actions';
import * as services from '../api/resources/services/actions/specials';
import * as workflows from '../api/resources/workflows/actions/specials';
import * as orders from '../api/resources/orders/actions/specials';
import * as jobs from '../api/resources/jobs/actions/specials';
import * as groups from '../api/resources/groups/actions';
import * as remotes from '../api/resources/remotes/actions';
import { pipeline } from '../../helpers/apievents';

const handleEvent = (url, data, dispatch, state) => {
  const dt = JSON.parse(data);

  dt.forEach(d => {
    const { info, eventstr } = d;

    switch (eventstr) {
      case 'ALERT_ONGOING_RAISED':
        switch (info.type) {
          case 'WORKFLOW':
            if (state.api.workflows.sync) {
              pipeline(
                `${eventstr}_WORKFLOW`,
                workflows.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            break;
          case 'SERVICE':
            if (state.api.services.sync) {
              pipeline(
                `${eventstr}_SERVICE`,
                services.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            break;
          case 'JOB':
            if (state.api.jobs.sync) {
              pipeline(
                `${eventstr}_JOB`,
                jobs.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            break;
          case 'REMOTE':
          case 'DATASOURCE':
          case 'USER-CONNECTION':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            break;
          default:
            break;
        }

        if (state.api.alerts.sync) {
          pipeline(
            eventstr,
            alerts.raised,
            {
              ...info,
              ...{
                when: d.time,
                alerttype: 'ONGOING',
              },
            },
            dispatch
          );
        }

        break;
      case 'ALERT_ONGOING_CLEARED':
        switch (info.type) {
          case 'WORKFLOW':
            if (state.api.workflows.sync) {
              pipeline(
                `${eventstr}_WORKFLOW`,
                workflows.clearAlert,
                { id: info.id, alertid: info.alertid },
                dispatch
              );
            }
            break;
          case 'SERVICE':
            if (state.api.services.sync) {
              pipeline(
                `${eventstr}_SERVICE`,
                services.clearAlert,
                { id: info.id, alertid: info.alertid },
                dispatch
              );
            }
            break;
          case 'JOB':
            if (state.api.jobs.sync) {
              pipeline(
                `${eventstr}_JOB`,
                jobs.clearAlert,
                { id: info.id, alertid: info.alertid },
                dispatch
              );
            }
            break;
          case 'REMOTE':
          case 'USER-CONNECTION':
          case 'DATASOURCE':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.clearAlert,
                { id: info.id, alertid: info.alertid, type: info.type },
                dispatch
              );
            }
            break;
          default:
            break;
        }

        if (state.api.alerts.sync) {
          pipeline(
            eventstr,
            alerts.cleared,
            { id: info.alertid },
            dispatch
          );
        }

        break;
      case 'ALERT_TRANSIENT_RAISED':
        if (state.api.alerts.sync) {
          pipeline(
            eventstr,
            alerts.raised,
            {
              ...info,
              ...{
                when: d.time,
                alerttype: 'TRANSIENT',
              },
            },
            dispatch
          );
        }
        break;
      case 'SERVICE_STOP':
        if (state.api.services.sync) {
          pipeline(
            eventstr,
            services.setStatus,
            {
              id: info.serviceid,
              status: 'unloaded',
            },
            dispatch
          );
        }
        break;
      case 'SERVICE_START':
        if (state.api.services.sync) {
          pipeline(
            eventstr,
            services.setStatus,
            {
              id: info.serviceid,
              status: 'loaded',
            },
            dispatch
          );
        }
        break;
      case 'SERVICE_AUTOSTART_CHANGE':
        if (state.api.services.sync) {
          pipeline(
            eventstr,
            services.setAutostart,
            {
              id: info.serviceid,
              autostart: info.autostart,
            },
            dispatch
          );
        }
        break;
      case 'WORKFLOW_STOP':
        if (state.api.workflows.sync) {
          pipeline(
            eventstr,
            workflows.setExecCount,
            {
              id: info.workflowid,
              value: -1,
            },
            dispatch
          );
        }
        break;
      case 'WORKFLOW_START':
        if (state.api.workflows.sync) {
          pipeline(
            eventstr,
            workflows.setExecCount,
            {
              id: info.workflowid,
              value: 1,
            },
            dispatch
          );
        }
        break;
      case 'WORKFLOW_DATA_SUBMITTED': {
        const workflow = state.api.workflows.data.find(wf => wf.id === info.workflowid);

        if (state.api.orders.sync && workflow) {
          pipeline(
            `${eventstr}_ORDER`,
            orders.addOrder,
            { info, time: d.time },
            dispatch
          );
        }

        if (state.api.workflows.sync && workflow) {
          pipeline(
            eventstr,
            workflows.addOrder,
            {
              id: info.workflowid,
              status: info.status,
            },
            dispatch
          );
        }

        break;
      }
      case 'WORKFLOW_STATUS_CHANGED': {
        const workflow = state.api.workflows.data.find(wf => wf.id === info.workflowid);

        if (state.api.orders.sync) {
          const order = state.api.orders.data.find(ord => (
            ord.workflow_instanceid === info.workflow_instanceid
          ));
          const ordersCount = state.api.orders.data.length;
          const currentOrder = state.api.orders.data[0];

          if (ordersCount === 1 && currentOrder.HierarchyInfo[info.workflow_instanceid]) {
            dispatch(orders.updateHierarchy(
              currentOrder.workflow_instanceid,
              info.workflow_instanceid,
              info.info.new
            ));
          }

          if (order) {
            pipeline(
              `${eventstr}_ORDER`,
              orders.modifyOrder,
              {
                id: info.workflow_instanceid,
                new: info.info.new,
                time: d.time,
              },
              dispatch
            );

            // We are on orders/:id, we should only update the errors
            // on the detail page, not on the orders list
            if (ordersCount === 1 && info.info.new === 'ERROR') {
              dispatch(orders.updateErrors(info.workflow_instanceid));
            }
          }
        }

        if (state.api.workflows.sync && workflow) {
          pipeline(
            eventstr,
            workflows.modifyOrder,
            {
              id: info.workflowid,
              old: info.info.old,
              new: info.info.new,
            },
            dispatch
          );
        }

        break;
      }
      case 'WORKFLOW_INFO_CHANGED':
        if (state.api.orders.sync) {
          pipeline(
            eventstr,
            orders.addNoteWebsocket,
            {
              id: info.workflow_instanceid,
              note: info.info,
            },
            dispatch
          );
        }
        break;
      case 'WORKFLOW_DATA_UPDATED': {
        const order = state.api.orders.data.find(ord => ord.id === info.workflow_instanceid);

        if (order && state.api.orders.sync) {
          dispatch(orders.fetchData(info.workflow_instanceid, info.datatype));
        }
        break;
      }
      case 'JOB_STOP':
        if (state.api.jobs.sync) {
          pipeline(
            eventstr,
            jobs.setActive,
            { id: info.jobid, value: false },
            dispatch
          );
        }
        break;
      case 'JOB_START':
        if (state.api.jobs.sync) {
          pipeline(
            eventstr,
            jobs.setActive,
            { id: info.jobid, value: true },
            dispatch
          );
        }
        break;
      case 'JOB_INSTANCE_START': {
        const job = state.api.jobs.data.find(jb => jb.id === info.jobid);

        if (job) {
          pipeline(
            eventstr,
            jobs.addInstance,
            {
              data: info,
              started: d.time,
            },
            dispatch
          );
        }
        break;
      }
      case 'JOB_INSTANCE_STOP': {
        const job = state.api.jobs.data.find(jb => jb.id === info.jobid);

        if (job) {
          pipeline(
            eventstr,
            jobs.modifyInstance,
            {
              data: info,
              modified: d.time,
            },
            dispatch
          );
        }
        break;
      }
      case 'CONNECTION_UP':
        if (state.api.remotes.sync) {
          pipeline(
            eventstr,
            remotes.connectionChange,
            {
              name: info.name,
              up: true,
            },
            dispatch
          );
        }
        break;
      case 'CONNECTION_DOWN':
        if (state.api.remotes.sync) {
          pipeline(
            eventstr,
            remotes.connectionChange,
            {
              name: info.name,
              up: false,
            },
            dispatch
          );
        }
        break;
      case 'GROUP_STATUS_CHANGED':
        if (info.synthetic) {
          switch (info.type) {
            case 'workflow':
              if (state.api.workflows.sync) {
                pipeline(
                  `${eventstr}_WORKFLOW`,
                  workflows.setEnabled,
                  {
                    id: info.id,
                    enabled: info.enabled,
                  },
                  dispatch
                );
              }
              break;
            case 'service':
              if (state.api.services.sync) {
                pipeline(
                  `${eventstr}_SERVICE`,
                  services.setEnabled,
                  {
                    id: info.id,
                    enabled: info.enabled,
                  },
                  dispatch
                );
              }
              break;
            case 'job':
              if (state.api.jobs.sync) {
                pipeline(
                  `${eventstr}_JOB`,
                  jobs.setEnabled,
                  {
                    id: info.id,
                    enabled: info.enabled,
                  },
                  dispatch
                );
              }
              break;
            default:
              break;
          }
        } else {
          if (state.api.groups.sync) {
            pipeline(
              eventstr,
              groups.setEnabled,
              {
                name: info.name,
                enabled: info.enabled,
              },
              dispatch
            );
          }
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
