/**
 * @module types
 */

/**
  * @typedef {{
  *   service_methodid: number,
  *   name: string,
  *   descripton: string,
  *   author: string,
  *   locktype: string,
  *   internal: boolean,
  *   write: boolean,
  *   created: string,
  *   modified: string,
  *   tags: object,
  *   source: string,
  *   offset: string,
  *   host: string,
  *   user: string,
  * }} Method
  */


/**
 * @typedef {{
 * serviceid: number,
 * type: string,
 * name: string,
 * version: string,
 * description: string,
 * author: string,
 * parse_options: string,
 * autostart: number
 * manual_autostart: number
 * enabled: boolean,
 * created: string,
 * modified: string,
 * mappers: !Array<!Mapper>,
 * vmaps: !Array<object>,
 * latest: boolean,
 * methods: !Array<!Method>,
 * groups: !Array<!Group>,
 * resource_files: !Array<object>,
 * status: string,
 * threads: number,
 * resources: !Array<object>,
 * log_url: string,
 * options: !Array<!Option>,
 * connections: !Array<object>,
 * alerts: !Array<object>,
 * }} Service
 */
