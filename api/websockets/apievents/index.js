import express from 'express';
import bodyParser from 'body-parser';

module.exports = () => {
  const router = new express.Router();
  let websocket;

  router.use(bodyParser.json());

  router.ws('/', (ws) => {
    websocket = ws;
  });

  const send = (data) => {
    websocket.send(JSON.stringify([data]));
  };

  router.get('/:eventstr', (req, res) => {
    const { eventstr } = req.params;
    const { query } = req;

    switch (eventstr) {
      case 'CLOSE':
        websocket.close(1000);
        break;
      case 'ALERT_ONGOING_RAISED':
        send({
          eventstr,
          time: '2020-01-01 12:34:56',
          info: {
            type: 'GROUP',
            id: 1,
            alertid: 123,
            alert: 'THIS IS A TEST ALERT',
            object: 'GROUP SOMETHING HAPPENED HEHE (1)',
            name: 'SOMETHING HAPPENED HEHE',
          },
        });
        break;
      case 'ALERT_ONGOING_RAISED_WORKFLOW':
        send({
          eventstr: 'ALERT_ONGOING_RAISED',
          time: '2016-01-01 10:10:10',
          info: {
            type: 'WORKFLOW',
            id: 14,
            alertid: 999,
            alert: 'WORKFLOW-NOT-RUNNING',
            object: 'WORKFLOW ARRAYTEST (14)',
            name: 'ARRAYTEST',
            version: 2.0,
            reason: 'Testing workflow alerts from websockets',
          },
        });
        break;
      case 'ALERT_ONGOING_RAISED_JOB':
        send({
          eventstr: 'ALERT_ONGOING_RAISED',
          time: '2016-01-01 10:10:10',
          info: {
            type: 'JOB',
            id: 33,
            alertid: 2999,
            object: 'JOB ANOTHERTEST (33)',
            alert: 'JOB-NOT-RUNNING',
            name: 'anothertest',
            version: '3.0',
            reason: 'Testing job alerts from websockets',
          },
        });
        break;
      case 'ALERT_ONGOING_RAISED_SERVICE':
        send({
          eventstr: 'ALERT_ONGOING_RAISED',
          time: '2016-01-01 10:10:10',
          info: {
            type: 'SERVICE',
            id: 698,
            alertid: 1999,
            object: 'SERVICE INFO (698)',
            alert: 'SERVICE-NOT-RUNNING',
            name: 'info',
            version: '3.1.9.9',
            reason: 'Testing service alerts from websockets',
          },
        });
        break;
      case 'ALERT_ONGOING_RAISED_DATASOURCE':
        send({
          eventstr: 'ALERT_ONGOING_RAISED',
          time: '2016-01-01 10:10:10',
          info: {
            type: 'DATASOURCE',
            id: 'omquser',
            alertid: 3999,
            object: 'REMOTE OMQUSER',
            alert: 'DATASOURCE-OFFLINE',
            name: 'omquser',
            reason: 'Testing remote alerts from websockets',
          },
        });
        break;
      case 'ALERT_ONGOING_RAISED_UPDATE':
        send({
          eventstr: 'ALERT_ONGOING_RAISED',
          time: '2020-01-01 13:24:50',
          info: {
            type: 'GROUP',
            id: 1,
            alertid: 124,
            object: 'GROUP SOMETHING HAPPENED HEHE (1)',
            alert: 'THIS IS A TEST ALERT',
            name: 'SOMETHING HAPPENED HEHE',
          },
        });
        break;
      case 'ALERT_TRANSIENT_RAISED':
        send({
          eventstr,
          time: '2020-01-01 12:34:56',
          info: {
            type: 'SERVICE',
            alertid: 345,
            object: 'SERVICE SOMETHING HAPPENED',
            alert: 'THIS IS A TRANSIENT TEST ALERT',
            name: 'SOMETHING HAPPENED HOHO',
          },
        });
        break;
      case 'ALERT_ONGOING_CLEARED':
        send({
          eventstr,
          info: {
            alertid: 123,
          },
        });
        break;
      case 'ALERT_ONGOING_CLEARED_WORKFLOW':
        send({
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            type: 'WORKFLOW',
            id: 14,
            alertid: 999,
          },
        });
        break;
      case 'ALERT_ONGOING_CLEARED_SERVICE':
        send({
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            type: 'SERVICE',
            id: 698,
            alertid: 1999,
          },
        });
        break;
      case 'ALERT_ONGOING_CLEARED_JOB':
        send({
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            type: 'JOB',
            id: 33,
            alertid: 2999,
          },
        });
        break;
      case 'ALERT_ONGOING_CLEARED_DATASOURCE':
        send({
          eventstr: 'ALERT_ONGOING_CLEARED',
          info: {
            type: 'DATASOURCE',
            id: 'omquser',
            alertid: 3999,
          },
        });
        break;
      case 'SERVICE_START':
      case 'SERVICE_STOP':
        send({
          eventstr,
          info: {
            serviceid: 222,
          },
        });
        break;
      case 'SERVICE_AUTOSTART_CHANGE':
        send({
          eventstr,
          info: {
            serviceid: 222,
            autostart: true,
          },
        });
        break;
      case 'WORKFLOW_START':
      case 'WORKFLOW_STOP':
        send({
          eventstr,
          info: {
            workflowid: 14,
          },
        });
        break;
      case 'JOB_START':
      case 'JOB_STOP':
        send({
          eventstr,
          info: {
            jobid: 250,
          },
        });
        break;
      case 'JOB_INSTANCE_START':
        send({
          eventstr: 'JOB_INSTANCE_START',
          time: '2020-10-10 12:34:56',
          info: {
            job_instanceid: 1234,
            jobid: 250,
            name: 'test',
            version: '1.0',
          },
        });
        break;
      case 'JOB_INSTANCE_STOP':
        send({
          eventstr,
          time: '2020-07-03 12:34:56',
          info: {
            job_instanceid: 1234,
            jobid: 250,
            name: 'at-m1301-ran_items_spl-out',
            version: '1.0',
            status: 'ERROR',
          },
        });
        break;
      case 'CONNECTION_UP':
        send({
          eventstr,
          info: {
            name: 'account-fs',
            up: true,
          },
        });
        break;
      case 'CONNECTION_DOWN':
        send({
          eventstr,
          info: {
            name: 'account-fs',
            up: false,
          },
        });
        break;
      case 'WORKFLOW_DATA_SUBMITTED':
        send({
          eventstr,
          time: '2020-07-03 12:34:56',
          info: {
            name: 'TEST-ORDER',
            version: '1.2',
            workflowid: 14,
            workflow_instanceid: 123,
            status: 'READY',
          },
        });
        break;
      case 'WORKFLOW_STATUS_CHANGED':
        send({
          eventstr,
          time: '2020-05-12 12:34:56',
          info: {
            info: {
              old: 'READY',
              new: 'IN-PROGRESS',
            },
            workflowid: 14,
            workflow_instanceid: 123,
          },
        });
        break;
      case 'WORKFLOW_INFO_CHANGED':
        send({
          eventstr,
          time: '2020-12-12 12:34:56',
          info: {
            workflow_instanceid: 3658,
            info: {
              username: 'admin',
              saved: true,
              created: '2020-12-12 12:34:56',
              note: 'This is a test note',
            },
          },
        });
        break;
      case 'GROUP_STATUS_CHANGED':
        send({
          eventstr,
          info: {
            synthetic: query.synthetic,
            type: query.type,
            id: query.id,
            enabled: query.enabled !== 'false',
            name: 'ANOTHERTEST',
          },
        });
        break;
      default:
        break;
    }

    res.status(200).send('OK');
  });

  return router;
};
