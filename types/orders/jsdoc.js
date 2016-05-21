/**
 * @module types
 */

/**
 * @typedef {{
 * name: string,
 * version: string,
 * author: string,
 * workflow_instanceid: number,
 * workflowid: number,
 * workflowstatus: string,
 * status_sessionid: number,
 * parent_workflow_instanceid: number
 * subworkflow: number
 * synchronous: number,
 * errors: !Array<object>,
 * note_count: number,
 * business_error: boolean,
 * workflowstatus_orig: string,
 * custom_status: string,
 * scheduled: string,
 * priority: number,
 * started: !string,
 * completed: !string,
 * modified: !string,
 * operator_lock: !string,
 * custom_status_desc: string,
 * deprecated: boolean,
 * autostart: !string,
 * manual_autostart: boolean,
 * max_instances: number,
 * external_order_instanceid: number,
 * staticdata: !Object<object>,
 * dynamicdata: !Object<object>,
 * keys: !string,
 * warning_count: number,
 * error_count: number,
 * StepInstances: !Array<object>,
 * ErrorInstances: !Array<object>,
 * HierarchyInfo: !Object<object>,
 * AuditEvents: !Array<object>,
 * LastModified: string,
 * actions: !Array<string>,
 * notes: !Array<object>,
 * }} Order
 */
