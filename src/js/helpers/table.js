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
    name: 'Order',
    started: 'Started',
    completed: 'Completed',
    modified: 'Modified',
    scheduled: 'Scheduled',
    error_count: 'Errors',
    warning_count: 'Warnings',
    note_count: 'Notes',
  },
};

Object.keys(ORDER_STATES).forEach(key => {
  CSVheaders.workflows[ORDER_STATES[key].name] = ORDER_STATES[key].short;
});

CSVheaders.workflows.total = 'Total';

const getCSVHeaders = (view) => CSVheaders[view];

const sortFunc = (sort, v1, v2) => {
  const val1 = v1[sort.sortBy];
  const val2 = v2[sort.sortBy];

  if (moment(val1).isValid() && moment(val2).isValid()) {
    return moment(val1).isBefore(val2) ? -1 : 1;
  }

  if (!val1) {
    return -1;
  }

  if (!val2) {
    return 1;
  }

  return val1.toLowerCase() < val2.toLowerCase() ? -1 : 1;
};

const sortTable = (data, sort) => data.slice().sort(
  firstBy((v1, v2) => sortFunc(sort, v1, v2), sort.sortByKey.direction)
    .thenBy((v1, v2) => sortFunc(sort, v1, v2), sort.historySortByKey.direction)
);

export {
  getCSVHeaders,
  sortTable,
};
