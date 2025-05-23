import includes from 'lodash/includes';
import invert from 'lodash/invert';
import startsWith from 'lodash/startsWith';
import { browserHistory } from 'react-router';
// @flow
import { createAction } from 'redux-actions';
import shortid from 'shortid';
import { INTERFACE_IDS } from '../../constants/interfaces';
import { ALERT_NOTIFICATION_TYPES } from '../../constants/notifications';
import { pipeline } from '../../helpers/apievents';
import { getLoggerIntfcType } from '../../helpers/logger';
import { getProcessObjectInterface, getProcessObjectInterfaceId } from '../../helpers/system';
import * as alerts from '../api/resources/alerts/actions';
import * as fsms from '../api/resources/fsms/actions';
import * as groups from '../api/resources/groups/actions';
import * as health from '../api/resources/health/actions';
import * as instances from '../api/resources/instances/actions';
import * as jobs from '../api/resources/jobs/actions/specials';
import * as orders from '../api/resources/orders/actions/specials';
import * as pipelines from '../api/resources/pipelines/actions';
import * as remotes from '../api/resources/remotes/actions';
import * as services from '../api/resources/services/actions/specials';
import * as system from '../api/resources/system/actions';
import * as workflows from '../api/resources/workflows/actions/specials';
import { bubbles, notifications } from '../ui/actions';

const interfaceActions: any = {
  workflows,
  services,
  jobs,
  system,
  instances,
  remotes,
  fsms,
  pipelines,
};

const handleEvent = (url, data, dispatch, state) => {
  const dt = JSON.parse(data);
  const isInterfaceLoaded: Function = (
    interfaceType: string,
    id: number | string,
    idKey: string = 'id',
    customComparator?: Function
  ): boolean =>
    state.api[interfaceType].sync &&
    state.api[interfaceType].data.find((item: any) =>
      customComparator
        ? customComparator(item)
        : // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          item[idKey] == id || item.name === id
    );
  const loggerInterfaces: string[] =
    state.api.system?.data?.loggerParams?.configurable_systems?.map((logData) => logData.logger);

  dt.forEach(async (d) => {
    const { info, eventstr, classstr, caller } = d;

    switch (eventstr) {
      case 'NODE_REMOVED': {
        if (state.api.system.sync && state.api.system.isOnDashboard) {
          pipeline(eventstr, system.removeNode, info, dispatch);
        }
        break;
      }
      case 'NODE_INFO':
        if (state.api.system.sync && state.api.system.isOnDashboard) {
          pipeline(eventstr, system.updateNodeInfo, { ...info, timestamp: d.time }, dispatch);
        }
        break;
      case 'LICENSE_CHANGED':
        if (state.api.system.sync) {
          pipeline(eventstr, system.updateLicense, info, dispatch);
        }
        break;
      case 'WORKFLOW_STATS_UPDATED':
        if (info.tag === 'global') {
          if (state.api.system.sync) {
            pipeline(eventstr, system.updateStats, info, dispatch);
          }
        } else {
          if (
            state.api.workflows.sync &&
            state.api.workflows.data.find(
              // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              (workflow: any) => workflow.id === parseInt(info.tag, 10)
            )
          ) {
            pipeline(`${eventstr}_WORKFLOW`, workflows.updateStats, info, dispatch);
          }
        }
        break;
      case 'PROCESS_MEMORY_CHANGED':
      case 'PROCESS_STARTED': {
        if (state.api.system.sync && state.api.system.isOnDashboard) {
          if (eventstr === 'PROCESS_STARTED') {
            pipeline(eventstr, system.addProcess, info, dispatch);
          } else {
            pipeline(eventstr, system.processMemoryChanged, info, dispatch);
          }
        }

        const interfaceType = getProcessObjectInterface(info);
        const interfaceIdKey = getProcessObjectInterfaceId(info);

        if (includes(['workflows', 'jobs', 'services'], interfaceType)) {
          const id = info[interfaceIdKey];

          if (isInterfaceLoaded(interfaceType, id)) {
            pipeline(
              `${eventstr}_${interfaceType}`,
              interfaceActions[interfaceType].processStarted,
              { id, info, started: eventstr === 'PROCESS_STARTED' },
              dispatch
            );
          }
        }

        break;
      }
      case 'PROCESS_STOPPED': {
        if (state.api.system.sync && state.api.system.isOnDashboard) {
          pipeline(eventstr, system.removeProcess, info, dispatch);
        }

        const interfaceType = getProcessObjectInterface(info);
        const interfaceIdKey = getProcessObjectInterfaceId(info);

        if (includes(['workflows', 'jobs', 'services'], interfaceType)) {
          const id = info[interfaceIdKey];

          if (isInterfaceLoaded(interfaceType, id)) {
            pipeline(
              `${eventstr}_${interfaceType}`,
              interfaceActions[interfaceType].processStopped,
              { id, info },
              dispatch
            );
          }
        }

        break;
      }
      case 'ALERT_ONGOING_RAISED':
        switch (info.type) {
          case 'WORKFLOW':
            if (state.api.system.sync) {
              pipeline(
                'ALERT_SYSTEM_OPERATION',
                system.incrementItems,
                { type: 'workflow_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
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
            if (state.api.system.sync) {
              pipeline(
                'ALERT_SYSTEM_OPERATION',
                system.incrementItems,
                { type: 'service_alerts', alert: true, alertType: 'ongoing' },
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
            if (state.api.system.sync) {
              pipeline(
                'ALERT_SYSTEM_OPERATION',
                system.incrementItems,
                { type: 'job_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
            break;
          case 'REMOTE':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            if (state.api.system.sync) {
              pipeline(
                'ALERT_SYSTEM_OPERATION',
                system.incrementItems,
                { type: 'remote_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
            break;
          case 'DATASOURCE':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            if (state.api.system.sync) {
              pipeline(
                'ALERT_SYSTEM_OPERATION',
                system.incrementItems,
                {
                  type: 'datasource_alerts',
                  alert: true,
                  alertType: 'ongoing',
                },
                dispatch
              );
            }
            break;
          case 'USER-CONNECTION':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.addAlert,
                { ...info, ...{ alerttype: 'ONGOING' } },
                dispatch
              );
            }
            if (state.api.system.sync) {
              pipeline(
                'ALERT_SYSTEM_OPERATION',
                system.incrementItems,
                { type: 'user_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
            break;
          default:
            break;
        }

        if (state.api.system.sync) {
          pipeline(
            'ADDING_NOTIFICATIONS',
            notifications.addNotification,
            {
              ...info,
              ...{
                when: d.time,
                alerttype: 'ONGOING',
                notificationType: ALERT_NOTIFICATION_TYPES[info.type],
                notificationId: shortid.generate(),
                read: !state.api.currentUser.data.storage.settings.notificationsEnabled,
              },
            },
            dispatch
          );
        }

        if (state.api.alerts.sync) {
          pipeline(
            'ALERT_OPERATION',
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
      case 'SYSTEM_SHUTDOWN':
      case 'SYSTEM_ALERT': {
        info.messages?.forEach((msg) => {
          dispatch(bubbles.error(msg.content));
        });
        break;
      }
      case 'ALERT_ONGOING_CLEARED':
        switch (info.type) {
          case 'WORKFLOW':
            if (state.api.system.sync) {
              pipeline(
                `${eventstr}_ITEMDECREMENT`,
                system.decrementItems,
                { type: 'workflow_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
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
            if (state.api.system.sync) {
              pipeline(
                `${eventstr}_ITEMDECREMENT`,
                system.decrementItems,
                { type: 'service_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
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
            if (state.api.system.sync) {
              pipeline(
                `${eventstr}_ITEMDECREMENT`,
                system.decrementItems,
                { type: 'job_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
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
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.clearAlert,
                {
                  id: info.id,
                  name: info.name,
                  alertid: info.alertid,
                  type: info.type,
                  conntype: info.conntype,
                },
                dispatch
              );
            }
            if (state.api.system.sync) {
              pipeline(
                `${eventstr}_ITEMDECREMENT`,
                system.decrementItems,
                { type: 'remote_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
            break;
          case 'USER-CONNECTION':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.clearAlert,
                {
                  id: info.id,
                  name: info.name,
                  alertid: info.alertid,
                  type: info.type,
                  conntype: info.conntype,
                },
                dispatch
              );
            }
            if (state.api.system.sync) {
              pipeline(
                `${eventstr}_ITEMDECREMENT`,
                system.decrementItems,
                { type: 'user_alerts', alert: true, alertType: 'ongoing' },
                dispatch
              );
            }
            break;
          case 'DATASOURCE':
            if (state.api.remotes.sync) {
              pipeline(
                `${eventstr}_REMOTE`,
                remotes.clearAlert,
                {
                  id: info.id,
                  name: info.name,
                  alertid: info.alertid,
                  type: info.type,
                  conntype: info.conntype,
                },
                dispatch
              );
            }
            if (state.api.system.sync) {
              pipeline(
                `${eventstr}_ITEMDECREMENT`,
                system.decrementItems,
                {
                  type: 'datasource_alerts',
                  alert: true,
                  alertType: 'ongoing',
                },
                dispatch
              );
            }
            break;
          default:
            break;
        }

        if (state.api.alerts.sync) {
          pipeline('ALERT_OPERATION', alerts.cleared, { id: info.alertid }, dispatch);
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
        if (state.api.system.sync) {
          pipeline(
            `${eventstr}_ITEMINCREMENT`,
            system.incrementItems,
            {
              alert: true,
              alertType: 'transient',
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
          const service = state.api.services.data.find((srv) => srv.id === info.serviceid);

          if (service) {
            pipeline(
              eventstr,
              services.setStatus,
              {
                id: info.serviceid,
                status: 'loaded',
              },
              dispatch
            );
          } else if (state.api.services.sync) {
            dispatch(services.addNew(info.serviceid));
          }
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
          const workflow = state.api.workflows.data.find((wf) => wf.id === info.workflowid);

          if (workflow) {
            pipeline(
              eventstr,
              workflows.setExecCount,
              {
                id: info.workflowid,
                value: 1,
              },
              dispatch
            );
          } else if (state.api.workflows.sync) {
            dispatch(workflows.addNew(info.workflowid));
          }
        }
        break;
      case 'WORKFLOW_DATA_LOCKED':
      case 'WORKFLOW_DATA_UNLOCKED':
        if (isInterfaceLoaded('orders', info.workflow_instanceid)) {
          pipeline(
            'LOCK_OPERATION',
            orders.lockWs,
            {
              id: info.workflow_instanceid,
              note: info.note,
              username: eventstr === 'WORKFLOW_DATA_LOCKED' ? caller.user : null,
            },
            dispatch
          );
        }
        break;
      case 'WORKFLOW_DATA_SUBMITTED': {
        if (state.api.orders.sync && info.parent_workflow_instanceid) {
          const ordersCount = state.api.orders.data.length;
          const currentOrder = state.api.orders.data[0];

          if (
            ordersCount === 1 &&
            currentOrder.HierarchyInfo &&
            currentOrder.HierarchyInfo[info.parent_workflow_instanceid]
          ) {
            dispatch(orders.updateHierarchy(currentOrder.workflow_instanceid));
          }
        }

        const workflow = state.api.workflows.data.find((wf) => wf.id === info.workflowid);

        if (state.api.orders.sync && workflow) {
          // Add new orders only if we aren't on the order page detail
          if (!startsWith(window.location.pathname, '/order')) {
            pipeline(`${eventstr}_ORDER`, orders.addOrder, { info, time: d.time }, dispatch);
          }
        }

        if (state.api.workflows.sync && workflow) {
          pipeline(
            'WORKFLOW_PROCESS_ORDERS',
            workflows.processOrderEvent,
            {
              id: info.workflowid,
              status: info.status,
            },
            dispatch
          );
        }

        break;
      }
      case 'WORKFLOW_RECOVERED': {
        const workflow = state.api.workflows.data.find((wf) => wf.id === info.workflowid);

        if (state.api.workflows.sync && workflow) {
          pipeline(
            eventstr,
            workflows.fixOrders,
            {
              id: info.workflowid,
              old: info.old_statuses,
              new: info.new_status,
            },
            dispatch
          );
        }

        break;
      }
      case 'WORKFLOW_STATUS_CHANGED': {
        const workflow = state.api.workflows.data.find((wf) => wf.id === info.workflowid);

        if (state.api.orders.sync) {
          const order = state.api.orders.data.find(
            (ord) => ord.workflow_instanceid === info.workflow_instanceid
          );
          const ordersCount = state.api.orders.data.length;
          const currentOrder = state.api.orders.data[0];

          if (
            ordersCount === 1 &&
            currentOrder.HierarchyInfo &&
            currentOrder.HierarchyInfo[info.workflow_instanceid]
          ) {
            dispatch(orders.updateHierarchy(currentOrder.workflow_instanceid));
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

            // Update diagram Step instances
            dispatch(orders.updateStepInstances(info.workflow_instanceid));

            // We are on orders/:id, we should only update the errors
            // on the detail page, not on the orders list
            if (ordersCount === 1 && info.info.new === 'ERROR') {
              dispatch(orders.updateErrors(info.workflow_instanceid));
            }
          }
        }

        if (state.api.workflows.sync && workflow) {
          pipeline(
            'WORKFLOW_PROCESS_ORDERS',
            workflows.processOrderEvent,
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
        const order = state.api.orders.data.find((ord) => ord.id === info.workflow_instanceid);

        if (order && state.api.orders.sync) {
          dispatch(orders.fetchData(info.workflow_instanceid, info.datatype));
        }

        break;
      }
      case 'WORKFLOW_STEP_DATA_UPDATED': {
        const isLoaded: boolean = isInterfaceLoaded('orders', info.workflow_instanceid);

        if (isLoaded) {
          dispatch(orders.fetchStepData(info.workflow_instanceid));
        }

        break;
      }
      case 'CONFIG_ITEM_CHANGED': {
        let isLoaded;
        let interfaceId;
        const interfaceType = info.interfaceType === 'step' ? 'workflow' : info.interfaceType;
        let interfaceName;

        if (interfaceType === 'global') {
          isLoaded = state.api.system.sync;
          interfaceName = 'system';
        } else if (interfaceType === 'fsm' || interfaceType === 'pipeline') {
          interfaceName = `${interfaceType.toLowerCase()}s`;
          interfaceId = info[INTERFACE_IDS[interfaceName]];
          isLoaded = true;
        } else {
          interfaceName = `${interfaceType.toLowerCase()}s`;
          interfaceId = info[INTERFACE_IDS[interfaceName]];
          isLoaded = isInterfaceLoaded(interfaceName, interfaceId);
        }

        if (isLoaded) {
          pipeline(
            `${eventstr}_${interfaceName}`,
            interfaceActions[interfaceName].updateConfigItemWs,
            {
              value: info.value,
              stepid: info.stepid,
              level: info.level,
              id: interfaceId,
              interfaceName,
              name: info.name,
              is_set: info.is_set,
              currentType: info.currentType,
              is_templated_string: info.is_templated_string,
            },
            dispatch
          );
        }

        break;
      }
      case 'WORKFLOW_UPDATED':
      case 'SERVICE_UPDATED':
      case 'JOB_UPDATED': {
        // Check if the interface is loaded
        const interfaceName = `${classstr.toLowerCase()}s`;
        const interfaceId: number = info[INTERFACE_IDS[interfaceName]];
        const isLoaded: boolean = isInterfaceLoaded(interfaceName, interfaceId);

        if (isLoaded) {
          pipeline(
            `${eventstr}_${interfaceName}`,
            interfaceActions[interfaceName].updateBasicData,
            { ...info, id: interfaceId },
            dispatch
          );
        }

        break;
      }
      case 'JOB_STOP': {
        const job = state.api.jobs.data.find((jb) => jb.id === parseInt(info.jobid, 10));

        if (job) {
          pipeline(eventstr, jobs.setActive, { id: info.jobid, value: false }, dispatch);
        }
        break;
      }
      case 'JOB_START': {
        const job = state.api.jobs.data.find((jb) => jb.id === parseInt(info.jobid, 10));

        if (job) {
          pipeline(
            eventstr,
            jobs.setActive,
            { id: info.jobid, value: true, next: info.info.next },
            dispatch
          );
        } else if (state.api.jobs.sync) {
          dispatch(jobs.addNew(info.jobid));
        }

        break;
      }
      case 'JOB_INSTANCE_START': {
        const isLoaded: boolean = isInterfaceLoaded('jobs', info.jobid);

        if (isLoaded) {
          pipeline(
            eventstr,
            jobs.addInstance,
            {
              data: info,
              started: d.time,
              executed: d.time,
            },
            dispatch
          );
          pipeline(
            `${eventstr}_INSTANCE`,
            instances.addInstance,
            {
              data: info,
              started: d.time,
              executed: d.time,
            },
            dispatch
          );
        }
        break;
      }
      case 'JOB_INSTANCE_STOP': {
        const isLoaded: boolean = isInterfaceLoaded('jobs', info.jobid);

        if (isLoaded) {
          pipeline(
            eventstr,
            jobs.modifyInstance,
            {
              data: info,
              modified: d.time,
              executed: d.time,
            },
            dispatch
          );
          pipeline(
            `${eventstr}_INSTANCE`,
            instances.modifyInstance,
            {
              data: info,
              modified: d.time,
              executed: d.time,
              completed: info.end,
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
              enabled: info.enabled,
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
              enabled: info.enabled,
            },
            dispatch
          );
        }
        break;
      case 'CONNECTION_DEBUG_DATA_CHANGE':
        if (state.api.remotes.sync) {
          pipeline(
            eventstr,
            remotes.debugChange,
            {
              name: info.name,
              debug_data: info.debug_data,
            },
            dispatch
          );
        }
        break;
      case 'CONNECTION_ENABLED_CHANGE':
        if (
          isInterfaceLoaded(
            'remotes',
            null,
            null,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            (item: any) => item.name === info.name && item.type === info.type
          )
        ) {
          pipeline(
            eventstr,
            remotes.enabledChange,
            {
              name: info.name,
              type: info.type,
              enabled: info.enabled,
            },
            dispatch
          );
        }
        break;
      case 'CONNECTION_CREATED':
        if (state.api.remotes.sync) {
          pipeline(eventstr, remotes.addConnection, info, dispatch);
        }
        break;
      case 'CONNECTION_UPDATED':
        if (state.api.remotes.sync) {
          pipeline(eventstr, remotes.updateConnection, info, dispatch);
        }
        break;
      case 'CONNECTION_DELETED':
        if (state.api.remotes.sync) {
          pipeline(eventstr, remotes.removeConnectionWS, info, dispatch);
        }
        break;
      case 'SYSTEM_HEALTH_CHANGED':
        if (state.api.system.sync) {
          pipeline(eventstr, system.healthChanged, info, dispatch);
        }
        break;
      case 'SYSTEM_REMOTE_HEALTH_CHANGED':
        if (state.api.system.sync) {
          pipeline(eventstr, health.remoteChanged, info, dispatch);
        }
        break;
      case 'GROUP_STATUS_CHANGED':
        if (info.synthetic) {
          switch (info.type) {
            case 'workflow': {
              const workflow = state.api.workflows.data.find(
                (wf) => wf.id === parseInt(info.id, 10)
              );

              if (workflow) {
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
            }
            case 'service': {
              const service = state.api.services.data.find(
                (srv) => srv.id === parseInt(info.id, 10)
              );

              if (service) {
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
            }
            case 'job': {
              const job = state.api.jobs.data.find((jb) => jb.id === parseInt(info.id, 10));

              if (job) {
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
            }
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
      case 'LOGGER_CREATED':
      case 'LOGGER_UPDATED': {
        const newInfo: any = { ...info };
        // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
        newInfo.interface =
          // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
          newInfo.interface === 'qdsp' ? 'remotes' : newInfo.interface;
        const reversedLevels: any = invert(state.api.system.data.loggerParams.logger_levels);

        // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
        newInfo.params.level = { [reversedLevels[info.params.level]]: true };
        // @ts-ignore ts-migrate(2339) FIXME: Property 'isNew' does not exist on type 'Object'.
        newInfo.isNew = eventstr === 'LOGGER_CREATED';

        // We are updating / adding default logger
        if (info.isDefault) {
          pipeline('LOGGER_ACTIONS', system.addUpdateDefaultLogger, newInfo, dispatch);
        } else {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          newInfo.id = newInfo.interfaceid || newInfo.interface;
          // Check if the interface we are updating is loaded
          // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
          const intfc = getLoggerIntfcType(loggerInterfaces, newInfo.interface);
          // @ts-ignore ts-migrate(2339) FIXME: Property 'interfaceid' does not exist on type 'Obj... Remove this comment to see the full error message
          const isLoaded = newInfo.interfaceid
            ? // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
              isInterfaceLoaded(newInfo.interface, newInfo.interfaceid)
            : state.api.system.sync &&
              state.api.system.logs.find(
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                (item: any) => item.id === newInfo.interface
              );

          if (isLoaded) {
            pipeline('LOGGER_ACTIONS', interfaceActions[intfc].addUpdateLogger, newInfo, dispatch);
          }
        }
        break;
      }
      case 'LOGGER_DELETED': {
        // Modify the levels
        const newInfo: any = { ...info };
        // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
        newInfo.interface =
          // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
          newInfo.interface === 'qdsp' ? 'remotes' : newInfo.interface;
        // Check if default logger was deleted
        // @ts-ignore ts-migrate(2339) FIXME: Property 'isDefault' does not exist on type 'Objec... Remove this comment to see the full error message
        if (newInfo.isDefault) {
          pipeline('LOGGER_ACTIONS', system.deleteDefaultLogger, newInfo, dispatch);
        } else {
          // We are deleting concrete logger
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          newInfo.id = newInfo.interfaceid || newInfo.interface;
          // Check if this interface is loaded
          // @ts-ignore ts-migrate(2339) FIXME: Property 'interfaceid' does not exist on type 'Obj... Remove this comment to see the full error message
          const isLoaded = newInfo.interfaceid
            ? // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
              isInterfaceLoaded(newInfo.interface, newInfo.interfaceid)
            : state.api.system.sync &&
              state.api.system.logs.find(
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                (item: any) => item.id === newInfo.interface
              );
          // If the interface is loaded
          if (isLoaded) {
            // If the interface is one of the system logs
            // set the interface to system
            const intfc = getLoggerIntfcType(
              loggerInterfaces,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'interface' does not exist on type 'Objec... Remove this comment to see the full error message
              newInfo.interface
            );
            // Delete the log
            pipeline('LOGGER_ACTIONS', interfaceActions[intfc].deleteLogger, newInfo, dispatch);
          }
        }
        break;
      }
      case 'APPENDER_CREATED': {
        const newInfo = { ...info };
        newInfo.interface = newInfo.interface === 'qdsp' ? 'remotes' : newInfo.interface;
        // Create default appender
        if (info.isDefault) {
          pipeline('APPENDER_ACTIONS', system.addDefaultAppender, newInfo, dispatch);
        } else {
          newInfo.id = newInfo.interfaceid || newInfo.interface;
          // Check if this interface is loaded
          const isLoaded = info.interfaceid
            ? isInterfaceLoaded(newInfo.interface, newInfo.interfaceid)
            : state.api.system.sync &&
              state.api.system.logs.find(
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                (item: any) => item.id === newInfo.interface
              );

          if (isLoaded) {
            const intfc: string = getLoggerIntfcType(loggerInterfaces, newInfo.interface);
            pipeline('APPENDER_ACTIONS', interfaceActions[intfc].addAppender, newInfo, dispatch);
          }
        }
        break;
      }
      case 'APPENDER_UPDATED': {
        const newInfo = { ...info };
        newInfo.interface = newInfo.interface === 'qdsp' ? 'remotes' : newInfo.interface;
        // Create default appender
        if (info.isDefault) {
          pipeline('APPENDER_ACTIONS', system.editDefaultAppender, newInfo, dispatch);
        } else {
          newInfo.id = newInfo.interfaceid || newInfo.interface;
          // Check if this interface is loaded
          const isLoaded = newInfo.interfaceid
            ? isInterfaceLoaded(newInfo.interface, newInfo.interfaceid)
            : state.api.system.sync &&
              state.api.system.logs.find(
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                (item: any) => item.id === newInfo.interface
              );

          if (isLoaded) {
            const intfc: string = getLoggerIntfcType(loggerInterfaces, newInfo.interface);
            pipeline('APPENDER_ACTIONS', interfaceActions[intfc].editAppender, newInfo, dispatch);
          }
        }
        break;
      }
      case 'APPENDER_DELETED': {
        const newInfo = { ...info };
        newInfo.interface = newInfo.interface === 'qdsp' ? 'remotes' : newInfo.interface;

        // Create default appender
        if (newInfo.isDefault) {
          pipeline('APPENDER_ACTIONS', system.deleteDefaultAppender, newInfo, dispatch);
        } else {
          newInfo.id = newInfo.interfaceid || newInfo.interface;
          // Check if this interface is loaded
          const isLoaded = newInfo.interfaceid
            ? isInterfaceLoaded(newInfo.interface, newInfo.interfaceid)
            : state.api.system.sync &&
              state.api.system.logs.find(
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                (item: any) => item.id === newInfo.interface
              );

          if (isLoaded) {
            // Get the interface
            const intfc = getLoggerIntfcType(loggerInterfaces, newInfo.interface);
            // Send the action to the pipeline
            pipeline('APPENDER_ACTIONS', interfaceActions[intfc].deleteAppender, newInfo, dispatch);
          }
        }
        break;
      }
      default:
        break;
    }
  });
};

const messageAction = createAction('APIEVENTS_MESSAGE', handleEvent);

const message = (url: string, data: any) => (dispatch: Function, getState: Function) => {
  if (data !== 'pong') {
    dispatch(messageAction(url, data, dispatch, getState()));
  }
};

const disconnect = () => () => {
  const { pathname, search } = window.location;

  if (process.env.NODE_ENV !== 'development') {
    browserHistory.push(`/error?next=${pathname}${encodeURIComponent(search)}`);
  }
};

export { disconnect, message };
