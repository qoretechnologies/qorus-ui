import union from 'lodash/union';

export const ORDER_STATES = [
  {
    name: 'COMPLETE',
    short: 'C',
    label: 'complete',
    title: 'Complete',
    color: '#7fba27',
  },
  {
    name: 'READY',
    short: 'Y',
    label: 'ready',
    title: 'Ready',
    color: '#81358a',
  },
  {
    name: 'SCHEDULED',
    short: 'S',
    label: 'scheduled',
    title: 'Scheduled',
    color: '#923c9c',
  },
  {
    name: 'INCOMPLETE',
    short: 'N',
    label: 'incomplete',
    title: 'Incomplete',
    color: '#f3b519',
  },
  {
    name: 'EVENT-WAITING',
    short: 'V',
    label: 'waiting',
    title: 'Event-Waiting',
    color: '#d99e0b',
  },
  {
    name: 'ASYNC-WAITING',
    short: 'A',
    label: 'waiting',
    title: 'Async-Waiting',
    color: '#d99e0b',
  },
  {
    name: 'WAITING',
    short: 'W',
    label: 'waiting',
    title: 'Waiting',
    color: '#d99e0b',
  },
  {
    name: 'RETRY',
    short: 'R',
    label: 'retry',
    title: 'Retry',
    color: '#ecac0c',
  },
  {
    name: 'ERROR',
    short: 'E',
    label: 'error',
    title: 'Error',
    color: '#d13913',
  },
  {
    name: 'IN-PROGRESS',
    short: 'I',
    label: 'in-progress',
    title: 'In-Progress',
    color: '#c18c0a',
  },
  {
    name: 'CANCELED',
    short: 'X',
    label: 'canceled',
    title: 'Canceled',
    color: '#8a9ba8',
  },
  {
    name: 'BLOCKED',
    short: 'B',
    label: 'blocked',
    title: 'Blocked',
    color: '#e83f15',
  },
];

export const ORDER_STATES_ARRAY = ORDER_STATES.map(order => order.name);

export const GROUPED_ORDER_STATES = [
  {
    name: 'READY/SCHD',
    short: 'READY/SCHD',
    label: 'ready',
    title: 'Ready / Scheduled',
  },
  {
    name: 'RUN/WAIT',
    short: 'RUN/WAIT',
    label: 'waiting',
    title: 'Run / Wait',
  },
  {
    name: 'ERR/BLOCK',
    short: 'ERR/BLOCK',
    label: 'error',
    title: 'Error / Blocked',
  },
  { name: 'CANCELED', short: 'CANCELED', label: 'canceled', title: 'Canceled' },
  { name: 'COMPLETE', short: 'COMPLETE', label: 'complete', title: 'Complete' },
];

export const GROUPED_ORDER_STATES_COMPACT = [
  { name: 'R/S', short: 'R/S', label: 'ready', title: 'Ready / Scheduled' },
  { name: 'R/W', short: 'R/W', label: 'waiting', title: 'Run / Wait' },
  { name: 'E/B', short: 'E/B', label: 'error', title: 'Error / Blocked' },
  { name: 'CNC', short: 'CNC', label: 'canceled', title: 'Canceled' },
  { name: 'CMP', short: 'CMP', label: 'complete', title: 'Complete' },
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
    { name: 'Block', action: 'block', icon: 'disable' },
    { name: 'Unblock', action: 'unblock', icon: 'disable', intent: 'info' },
    { name: 'Cancel', action: 'cancel', icon: 'remove' },
    { name: 'Uncancel', action: 'uncancel', icon: 'remove', intent: 'info' },
    { name: 'Retry', action: 'retry', icon: 'repeat' },
    { name: 'Schedule', action: 'schedule', icon: 'time' },
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

export const SLADATASETS = {
  maxprocessing: {
    background: 'rgba(193, 9, 9, 1)',
    label: 'Max',
  },
  avgprocessing: {
    background: 'rgb(234, 189, 28)',
    label: 'Average',
  },
  minprocessing: {
    background: 'rgb(75, 173, 32)',
    label: 'Min',
  },
};

export const DOUGH_LABELS = {
  'READY/SCHD': '#8ddc6d',
  'RUN/WAIT': '#e5d957',
  'ERR/BLOCK': '#d11f1f',
  CANCELED: '#f09999',
  COMPLETE: '#418e22',
};

export const ORDER_GROUPS = {
  'READY/SCHD': ['READY', 'SCHEDULED'],
  'RUN/WAIT': [
    'IN-PROGRESS',
    'ASYNC-WAITING',
    'WAITING',
    'EVENT-WAITING',
    'RETRY',
    'INCOMPLETE',
  ],
  'ERR/BLOCK': ['ERROR', 'BLOCKED'],
  CANCELED: ['CANCELED'],
  COMPLETE: ['COMPLETE'],
};

export const ORDER_GROUPS_COMPACT = {
  'R/S': ['READY', 'SCHEDULED'],
  'R/W': [
    'IN-PROGRESS',
    'ASYNC-WAITING',
    'WAITING',
    'EVENT-WAITING',
    'RETRY',
    'INCOMPLETE',
  ],
  'E/B': ['ERROR', 'BLOCKED'],
  CNC: ['CANCELED'],
  CMP: ['COMPLETE'],
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

export const ORDER_STATS_LEGEND = {
  A: 'Recovered automatically',
  C: 'Completed w/o errors',
  M: 'Recovered manually',
};
