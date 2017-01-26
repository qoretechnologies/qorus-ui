import union from 'lodash/union';

export const ORDER_STATES = [
  { name: 'COMPLETE', short: 'C', label: 'complete', title: 'Complete' },
  { name: 'READY', short: 'Y', label: 'ready', title: 'Ready' },
  { name: 'SCHEDULED', short: 'S', label: 'scheduled', title: 'Scheduled' },
  { name: 'INCOMPLETE', short: 'N', label: 'incomplete', title: 'Incomplete' },
  { name: 'EVENT-WAITING', short: 'V', label: 'waiting', title: 'Event-Waiting' },
  { name: 'ASYNC-WAITING', short: 'A', label: 'waiting', title: 'Async-Waiting' },
  { name: 'WAITING', short: 'W', label: 'waiting', title: 'Waiting' },
  { name: 'RETRY', short: 'R', label: 'retry', title: 'Retry' },
  { name: 'ERROR', short: 'E', label: 'error', title: 'Error' },
  { name: 'IN-PROGRESS', short: 'I', label: 'in-progress', title: 'In-Progress' },
  { name: 'CANCELED', short: 'X', label: 'canceled', title: 'Canceled' },
  { name: 'BLOCKED', short: 'B', label: 'blocked', title: 'Blocked' },
];

export const ORDER_STATES_ARRAY = ORDER_STATES.map((order) => order.name);

export const GROUPED_ORDER_STATES = [
  { name: 'READY/SCHD', short: 'READY/SCHD', label: 'ready', title: 'Ready / Scheduled' },
  { name: 'RUN/WAIT', short: 'RUN/WAIT', label: 'waiting', title: 'Run / Wait' },
  { name: 'ERR/BLOCK', short: 'ERR/BLOCK', label: 'error', title: 'Error / Blocked' },
  { name: 'CANCELED', short: 'CANCELED', label: 'canceled', title: 'Canceled' },
  { name: 'COMPLETE', short: 'COMPLETE', label: 'complete', title: 'Complete' },
];

export const CUSTOM_ORDER_STATES = [
  { name: 'UNBLOCKING', label: 'blocked', title: 'Unblocking' },
  { name: 'BLOCKING', label: 'blocked', title: 'Blocking' },
  { name: 'CANCELING', label: 'blocked', title: 'Canceling' },
  { name: 'UNCANCELING', label: 'blocked', title: 'Uncanceling' },
  { name: 'RETRYING', label: 'blocked', title: 'Retrying' },
];

export const ALL_ORDER_STATES = union(ORDER_STATES, CUSTOM_ORDER_STATES);

export const ORDER_ACTIONS = {
  ALL: [
    { name: 'Block', action: 'block', icon: 'minus-circle', style: 'black' },
    { name: 'Unblock', action: 'unblock', icon: 'check-circle', style: 'gray' },
    { name: 'Cancel', action: 'cancel', icon: 'times-circle', style: 'danger' },
    { name: 'Uncancel', action: 'uncancel', icon: 'times-circle', style: 'warning' },
    { name: 'Retry', action: 'retry', icon: 'refresh', style: 'success' },
    { name: 'Schedule', action: 'schedule', icon: 'clock-o', style: 'info' },
  ],
  BLOCKED: ['unblock'],
  CANCELED: ['uncancel'],
  SCHEDULED: ['block', 'cancel', 'schedule'],
  READY: ['block', 'cancel', 'schedule'],
  RETRY: ['block', 'cancel', 'retry'],
  'EVENT-WAITING': ['block', 'cancel', 'retry'],
  'ASYNC-WAITING': ['block', 'cancel', 'retry'],
  WAITING: ['block', 'cancel', 'retry'],
  ERROR: ['block', 'cancel', 'retry'],
  COMPLETE: [],
  INCOMPLETE: [],
  UNBLOCKING: [],
  BLOCKING: [],
  CANCELING: [],
  UNCANCELING: [],
  RETRYING: [],
};

export const DATASETS = {
  avgduration: 'rgba(250,225,107,1)',
  avgprocessing: 'rgba(169,204,143,1)',
  maxduration: 'rgba(178,200,217,1)',
  maxprocessing: 'rgba(190,163,122,1)',
  minduration: 'rgba(243,170,121,1)',
  minprocessing: 'rgba(181,181,169,1)',
};

export const DOUGH_LABELS = {
  'READY/SCHD': '#8ddc6d',
  'RUN/WAIT': '#e5d957',
  'ERR/BLOCK': '#d11f1f',
  CANCELED: '#f09999',
  COMPLETE: '#418e22',
};

export const ORDER_GROUPS = {
  'READY/SCHD': [
    'READY',
    'SCHEDULED',
  ],
  'RUN/WAIT': [
    'IN-PROGRESS',
    'ASYNC-WAITING',
    'WAITING',
    'EVENT-WAITING',
    'RETRY',
    'INCOMPLETE',
  ],
  'ERR/BLOCK': [
    'ERROR',
    'BLOCKED',
  ],
  CANCELED: ['CANCELED'],
  COMPLETE: ['COMPLETE'],
};

export const STATUS_PRIORITY = [
  'COMPLETE',
  'RETRY',
  'EVENT-WAITING',
  'WAITING',
  'ASYNC-WAITING',
  'IN-PROGRESS',
  'ERROR',
];
