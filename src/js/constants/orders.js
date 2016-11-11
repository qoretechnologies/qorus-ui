export const ORDER_STATES = [
  { name: 'COMPLETE', short: 'C', label: 'success', title: 'Complete' },
  { name: 'READY', short: 'Y', label: 'ready', title: 'Ready' },
  { name: 'SCHEDULED', short: 'S', label: 'info', title: 'Scheduled' },
  { name: 'INCOMPLETE', short: 'N', label: 'info', title: 'Incomplete' },
  { name: 'EVENT-WAITING', short: 'V', label: 'waiting', title: 'Event-Waiting' },
  { name: 'ASYNC-WAITING', short: 'A', label: 'waiting', title: 'Async-Waiting' },
  { name: 'WAITING', short: 'W', label: 'waiting', title: 'Waiting' },
  { name: 'RETRY', short: 'R', label: 'danger', title: 'Retry' },
  { name: 'ERROR', short: 'E', label: 'danger', title: 'Error' },
  { name: 'IN-PROGRESS', short: 'I', label: 'warning', title: 'In-Progress' },
  { name: 'CANCELED', short: 'X', label: 'canceled', title: 'Canceled' },
  { name: 'BLOCKED', short: 'B', label: 'gray', title: 'Blocked' },
];

export const GROUPED_ORDER_STATES = [
  { name: 'READY/SCHD', short: 'READY/SCHD', label: 'info', title: 'Ready / Scheduled' },
  { name: 'RUN/WAIT', short: 'RUN/WAIT', label: 'waiting', title: 'Run / Wait' },
  { name: 'ERR/BLOCK', short: 'ERR/BLOCK', label: 'danger', title: 'Error / Blocked' },
  { name: 'CANCELED', short: 'CANCELED', label: 'gray', title: 'Canceled' },
  { name: 'COMPLETE', short: 'COMPLETE', label: 'success', title: 'Complete' },
];

export const CUSTOM_ORDER_STATES = [
  { name: 'UNBLOCKING', label: 'gray', title: 'Unblocking' },
  { name: 'BLOCKING', label: 'gray', title: 'Blocking' },
  { name: 'CANCELING', label: 'gray', title: 'Canceling' },
  { name: 'UNCANCELING', label: 'gray', title: 'Uncanceling' },
  { name: 'RETRYING', label: 'gray', title: 'Retrying' },
];

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
  'READY/SCHD': '#aded9b',
  'RUN/WAIT': '#e5c737',
  'ERR/BLOCK': '#B94A49',
  CANCELED: '#f2dede',
  COMPLETE: '#9ccb3b',
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

