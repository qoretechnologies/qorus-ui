import { ORDER_STATES } from '../constants/orders';

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
};

Object.keys(ORDER_STATES).forEach(key => {
  CSVheaders.workflows[ORDER_STATES[key].name] = ORDER_STATES[key].short;
});

CSVheaders.workflows.total = 'Total';

const getCSVHeaders = (view) => CSVheaders[view];

export {
  getCSVHeaders,
};
