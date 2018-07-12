import { Intent } from '@blueprintjs/core';

import {
  ORDER_ACTIONS,
  ORDER_STATES,
  CUSTOM_ORDER_STATES,
  STATUS_PRIORITY,
} from '../constants/orders';
import { indexOf } from 'lodash';

const getActionData = (action, prop) => {
  const actionData = ORDER_ACTIONS.ALL.find(a => a.action === action);

  return prop ? actionData[prop] : actionData;
};

const getStatusLabel = status => {
  const states = ORDER_STATES.concat(CUSTOM_ORDER_STATES);

  return states.find(o => o.name === status).label || null;
};

const groupInstances = steps => {
  const stepGroups = [];

  steps.forEach(step => {
    const name = step.stepname;
    const group = (stepGroups[name] = stepGroups[name] || {
      steps: [],
      name,
      status: null,
    });
    const max = Math.max(
      indexOf(STATUS_PRIORITY, group.status),
      indexOf(STATUS_PRIORITY, step.stepstatus)
    );

    group.status = STATUS_PRIORITY[max];
    group.steps.push(step);
  });

  return stepGroups;
};

const canSkip = step => {
  const { skip, stepstatus, steptype } = step;

  return (
    (stepstatus === 'RETRY' ||
      stepstatus === 'ERROR' ||
      stepstatus === 'EVENT-WAITING' ||
      stepstatus === 'ASYNC-WAITING') &&
    !skip &&
    steptype !== 'SUBWORKFLOW'
  );
};

const formatCount = num => {
  if (!num) return 0;

  return num < 1000 ? num : `${Math.round(num / 1000)}k`;
};

const orderStatsPctColor = (val: number): string => {
  if (val < 50) {
    return Intent.DANGER;
  } else if (val >= 50 && val < 100) {
    return Intent.WARNING;
  }

  return Intent.SUCCESS;
};

export {
  getActionData,
  getStatusLabel,
  groupInstances,
  canSkip,
  formatCount,
  orderStatsPctColor,
};
