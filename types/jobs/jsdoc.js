/**
 * @module types
 */

/**
  * @typedef {{
  *   jobid: integer,
  *   name: string,
  *   description: string,
  *   version: string,
  *   author: string,
  *   single_instance: boolean,
  *   sessionid: integer,
  *   run_skipped: boolean,
  *   month: string,
  *   day: string,
  *   wday: string,
  *   hour: string,
  *   minute: string,
  *   manually_updated: boolean,
  *   created: string,
  *   modified: string,
  *   enabled: boolean,
  *   source: string,
  *   line: string,
  *   mappers: !Array<!Mapper>,
  *   vmaps: Array,
  *   lib: Object,
  *   tags: Object,
  *   groups: !Array<!Group>,,
  *   offset: string,
  *   host: string,
  *   user: string,
  *   code: string,
  *   connections: Array,
  *   alerts: !Array<!Alert>,,
  *   db_active: boolean,
  *   active: string,
  *   options: !Array<!Option>,,
  *   sched_type: string,
  *   sched_txt: string,
  * }} Job
  */
