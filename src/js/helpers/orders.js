import { Intent } from '@blueprintjs/core';
import maxBy from 'lodash/maxBy';
import find from 'lodash/find';

import {
  ORDER_ACTIONS,
  ORDER_STATES,
  CUSTOM_ORDER_STATES,
  STATUS_PRIORITY,
} from '../constants/orders';
import { indexOf } from 'lodash';

const MIN_INSTANCEBAR_WIDTH = 13;

const getActionData = (action, prop) => {
  const actionData = ORDER_ACTIONS.ALL.find(a => a.action === action);

  return prop ? actionData[prop] : actionData;
};

const getStatusLabel = status => {
  const states = ORDER_STATES.concat(CUSTOM_ORDER_STATES);

  return states.find(o => o.name === status).label || null;
};

const groupInstances = steps => {
  const stepGroups = {};

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

const instancePctOfTotal: Function = (
  instanceCount: number,
  totalInstances: number
): number => (instanceCount / totalInstances) * 100;

const calculateInstanceBarWidths: Function = (
  states: Array<Object>,
  instances: Object,
  totalInstances: number,
  minWidth: number = MIN_INSTANCEBAR_WIDTH
): Object => {
  const statesWithWidths = states.map((state: Object) => ({
    ...state,
    ...{
      width: instancePctOfTotal(instances[state.name], totalInstances),
      pct: instancePctOfTotal(instances[state.name], totalInstances),
    },
  }));

  const modifiedStates = statesWithWidths.reduce(
    (cur: Array<Object>, next: Object) => {
      const newCur: Array<Object> = [...cur];
      const newNext: Object = find(newCur, state => state.name === next.name);

      if (next.width < minWidth && next.width > 0) {
        const diff: number = minWidth - next.width;
        const max: Object = maxBy(statesWithWidths, 'width');

        newNext.width = minWidth;
        max.width = max.width - diff;
      }

      return newCur;
    },
    statesWithWidths
  );

  return modifiedStates;
};

const orderStatsPctColor = (val: number): string => {
  if (val < 50) {
    return Intent.DANGER;
  } else if (val >= 50 && val < 100) {
    return Intent.WARNING;
  }

  return Intent.SUCCESS;
};

const orderStatsPctColorDisp = (disp: string): ?string => {
  if (disp === 'M') {
    return Intent.DANGER;
  } else if (disp === 'C') {
    return Intent.SUCCESS;
  }

  return null;
};

const orderStatsPct = (workflowCount: number, totalCount: number): number =>
  totalCount === 0 ? 0 : Math.round((workflowCount / totalCount) * 100);

export {
  getActionData,
  getStatusLabel,
  groupInstances,
  canSkip,
  formatCount,
  orderStatsPctColor,
  orderStatsPctColorDisp,
  orderStatsPct,
  instancePctOfTotal,
  calculateInstanceBarWidths,
};
