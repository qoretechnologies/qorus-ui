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

export const CUSTOM_ORDER_STATES = [
  { name: 'UNBLOCKING', label: 'gray', title: 'Unblocking' },
  { name: 'BLOCKING', label: 'gray', title: 'Blocking' },
  { name: 'CANCELING', label: 'gray', title: 'Canceling' },
  { name: 'UNCANCELING', label: 'gray', title: 'Uncanceling' },
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
  BLOCKED: ['Unblock'],
  CANCELED: ['Uncancel'],
  RETRY: ['Block', 'Cancel', 'Retry', 'Schedule'],
  ERROR: ['Block', 'Cancel', 'Retry'],
  COMPLETE: [],
  UNBLOCKING: [],
  BLOCKING: [],
  CANCELING: [],
  UNCANCELING: [],
  RETRYING: [],
};


