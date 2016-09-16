'use strict';

/**
 * Services data.
 *
 * Based on `NODE_ENV` exports either fixtures or generated data.
 *
 * @module api/services/data
 * @see module:api/data.getData
 */

/**
 * @return {!Array<!module:types.Workflow>}
 */
export default () => require('../data').getData('jobs');
export const jobResults = () => require('../data').getData('job_results');
export const getSystemData = () => require('../system/data')();
export const getJobsCode = () => require('../data').getData('jobs_code')
export const getOptionErrorData = () => ({
  type: 'User',
  file: 'JobManager.qc',
  line: 131,
  endline: 131,
  source: '',
  offset: 0,
  callstack: [{
    function: 'JobManager::setOptions',
    line: 708,
    endline: 708,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 3,
    type: 'rethrow',
  }, {
    function: 'JobManager::setOptions',
    line: 3922,
    endline: 3922,
    file: 'QorusSystemAPI.qc',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: '<anonymous closure>',
    line: 359,
    endline: 359,
    file: 'qorus-system.ql',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'call_function_args',
    line: 359,
    endline: 359,
    file: 'qorus-system.ql',
    source: null,
    offset: 0,
    typecode: 1,
    type: 'builtin',
  }, {
    function: 'call_system_api_as_user',
    line: 140,
    endline: 140,
    file: 'qorus-system.ql',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'SystemApiHelper::methodGate',
    line: 7386,
    endline: 7386,
    file: 'QorusRestApiHandler.qc',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'JobDefinitionRestClass::putSetOptions',
    line: 670,
    endline: 670,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'call_object_method_args',
    line: 670,
    endline: 670,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 1,
    type: 'builtin',
  }, {
    function: 'AbstractRestClass::dispatch',
    line: 1028,
    endline: 1028,
    file: 'QorusRestApiHandler.qc',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'QorusRestClass::dispatch',
    line: 630,
    endline: 630,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'AbstractRestClass::dispatchStream',
    line: 614,
    endline: 614,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'AbstractRestClass::handleRequest',
    line: 607,
    endline: 607,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }, {
    function: 'AbstractRestClass::handleRequest',
    line: 949,
    endline: 949,
    file: '/export/home/dnichols/src/xbox/Qorus/test/qlib/RestHandler.qm',
    source: null,
    offset: 0,
    typecode: 0,
    type: 'user',
  }],
  err: 'JOB-ERROR',
  desc: 'no job \"00-line_status_usage-out\" is currently active',
});
