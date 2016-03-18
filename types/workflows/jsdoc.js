/**
 * @module types
 */


/**
 * @typedef {{
 *   steplist: !Array<number>,
 *   steps: !Object<number, !Array<number>>,
 * }} WorkflowSegment
 */


/**
 * @typedef {{
 *   name: string,
 *   enabled: boolean,
 *   size: number,
 * }} WorkflowGroup
 */


/**
 * @typedef {{
 *   workflowid: number,
 *   name: string,
 *   version: string,
 *   description: string,
 *   author: string,
 *   autostart: string,
 *   manual_autostart: boolean,
 *   enabled: boolean,
 *   onetimeinit_func_instanceid: number,
 *   deprecated: boolean,
 *   created: string,
 *   modified: string,
 *   keylist: !Array<string>,
 *   stepmap: !Object<number, string>,
 *   steps: !Array<number, !Array<number>>,
 *   segment: !Array<!WorkflowSegment>,
 *   options: !Array<!Option>,
 *   exec_count: number,
 *   groups: !Array<!WorkflowGroup>,
 *   COMPLETE: number,
 *   READY: number,
 *   SCHEDULED: number,
 *   INCOMPLETE: number,
 *   EVENT-WAITING: number,
 *   ASYNC-WAITING: number,
 *   WAITING: number,
 *   RETRY: number,
 *   ERROR: number,
 *   IN-PROGRESS: number,
 *   CANCELED: number,
 *   BLOCKED: number,
 *   TOTAL: number,
 * }} Workflow
 */
