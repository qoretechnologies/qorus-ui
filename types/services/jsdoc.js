/**
 * @module types
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
 * mappers: !Array<object>,
 * vmaps: !Array<object>,
 * latest: boolean,
 * methods: !Array<object>,
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
