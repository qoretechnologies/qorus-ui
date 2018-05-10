import { ORDER_STATES } from '../constants/orders';
import firstBy from 'thenby';
import moment from 'moment';

const CSVheaders = {
  workflows: {
    exec_count: 'Execs',
    autostart: 'Autostart',
    id: 'ID',
    name: 'Name',
    version: 'Version',
  },
  services: {
    type: 'Type',
    threads: 'Threads',
    name: 'Name',
    version: 'Version',
    desc: 'Description',
  },
  jobs: {
    name: 'Name',
    version: 'Version',
    last_executed: 'Last',
    next: 'Next',
    expiry_date: 'Expiry date',
    COMPLETE: 'Complete',
    ERORR: 'Error',
    'IN-PROGRESS': 'In-progress',
    CRASHED: 'Crash',
  },
  orders: {
    status: 'Status',
    business_error: 'Bus. Err.',
    workflow_instanceid: 'ID',
    name: 'Order',
    started: 'Started',
    completed: 'Completed',
    modified: 'Modified',
    scheduled: 'Scheduled',
    error_count: 'Errors',
    warning_count: 'Warnings',
    note_count: 'Notes',
  },
  order_errors: {
    severity: 'Severity',
    error: 'Error Code',
    description: 'Description',
    step_name: 'Step name',
    ind: 'Ind',
    created: 'Created',
    error_type: 'Error Type',
    info: 'Info',
    retry: 'Retry',
  },
  order_errors_pane: {
    severity: 'Severity',
    error: 'Error Code',
    created: 'Created',
    description: 'Description',
    business_error: 'Business',
  },
  groups: {
    enabled: 'Enabled',
    name: 'Name',
    description: 'Description',
    jobs_count: 'Jobs',
    mappers_count: 'Mappers',
    services_count: 'Services',
    workflows_count: 'Workflows',
    roles_count: 'Roles',
    vmaps_count: 'Vmaps',
  },
  search: {
    status: 'Status',
    business_error: 'Bus. Err.',
    name: 'Order',
    started: 'Started',
    completed: 'Completed',
    modified: 'Modified',
    scheduled: 'Scheduled',
    error_count: 'Errors',
    warning_count: 'Warnings',
    note_count: 'Notes',
  },
  jobResults: {
    job_instanceid: 'Id',
    jobstatus: 'Status',
    name: 'Name',
    started: 'Started',
    modified: 'Modified',
  },
  orderErrors: {
    workflow_instanceid: 'ID',
    workflowstatus: 'Status',
    error: 'Error',
    retry: 'Retry',
    business_error: 'Bus.Err.',
  },
  test: {  // only test data
    a: 'A',
    b: 'B',
  },
};

Object.keys(ORDER_STATES).forEach(key => {
  CSVheaders.workflows[ORDER_STATES[key].name] = ORDER_STATES[key].short;
});

CSVheaders.workflows.total = 'Total';

const getCSVHeaders = (view) => CSVheaders[view];

/**
 * Generates the CSV string from the collection
 * @param {Array<Object>} collection
 * @param {String} type
 * @returns {String}
 */
const generateCSV = (collection, type) => {
  const headers = getCSVHeaders(type);

  let content = Object.keys(headers).reduce((str, h) => (
    str === '' ? headers[h] : `${str};${headers[h]}`
  ), '');

  for (const item of collection) {
    content += `\n${Object.keys(headers).reduce((str, h) => {
      const value = item[h] || 0;

      return str === '' ? value : `${str};${value}`;
    }, '')}`;
  }

  return content;
};

const buildSorting = (sortData, tableName, state) => {
  const option = { ...sortData };
  const currentOption = state[tableName];

  if (currentOption && currentOption.sortBy !== sortData.sortBy) {
    option.historySortBy = currentOption.sortBy;
    option.historySortByKey = currentOption.sortByKey;
  } else if (currentOption) {
    option.historySortBy = currentOption.historySortBy;
    option.historySortByKey = currentOption.historySortByKey;
  }

  return option;
};

const sortFunc = (sort, v1, v2) => {
  const val1 = v1[sort];
  const val2 = v2[sort];

  if (!val1) {
    return -1;
  }

  if (!val2) {
    return 1;
  }

  if (val1 !== true && val2 !== true &&
      moment(new Date(val1)).isValid() && moment(new Date(val2)).isValid()) {
    if (moment(val1).isBefore(val2)) {
      return -1;
    } else if (moment(val1).isAfter(val2)) {
      return 1;
    }

    return 0;
  }

  if (typeof val1 === 'string' && typeof val2 === 'string') {
    if (val1.toLowerCase() < val2.toLowerCase()) {
      return -1;
    } else if (val1.toLowerCase() === val2.toLowerCase()) {
      return 0;
    }
  }

  return 1;
};

const sortTable = (data, sort) => {
  const direction = sort.sortByKey ? sort.sortByKey.direction : 1;
  const historyDirection = sort.historySortByKey ? sort.historySortByKey.direction : 1;

  if (sort.historySortBy) {
    return data.slice().sort(
      firstBy((v1, v2) => sortFunc(sort.sortBy, v1, v2), direction)
        .thenBy((v1, v2) => sortFunc(sort.historySortBy, v1, v2), historyDirection)
    );
  }

  return data.slice().sort(
    firstBy((v1, v2) => sortFunc(sort.sortBy, v1, v2), direction)
  );
};

export {
  getCSVHeaders,
  generateCSV,
  sortTable,
  buildSorting,
};
