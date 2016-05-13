export const ORDER_STATES = [
  { name: 'COMPLETE', short: 'C', label: 'success', title: 'Complete' },
  { name: 'READY', short: 'Y', label: 'ready', title: 'Ready' },
  { name: 'SCHEDULED', short: 'S', label: 'info', title: 'Scheduled' },
  { name: 'INCOMPLETE', short: 'N', label: 'info', title: 'Incomplete' },
  { name: 'EVENT-WAITING', short: 'V', label: 'waiting', title: 'Event-Waiting' },
  { name: 'ASYNC-WAITING', short: 'A', label: 'waiting', title: 'Async-Waiting' },
  { name: 'WAITING', short: 'W', label: 'waiting', title: 'Waiting' },
  { name: 'RETRY', short: 'R', label: 'error', title: 'Retry' },
  { name: 'ERROR', short: 'E', label: 'important', title: 'Error' },
  { name: 'IN-PROGRESS', short: 'I', label: 'warning', title: 'In-Progress' },
  { name: 'CANCELED', short: 'X', label: 'canceled', title: 'Canceled' },
  { name: 'BLOCKED', short: 'B', lable: 'blocked', title: 'Blocked' },
];
