import { flatten, max, range, round, takeRight, values } from 'lodash';
import moment from 'moment';
import { DATASETS, DOUGH_LABELS, ORDER_GROUPS, SLADATASETS } from '../constants/orders';

const groupOrders = (data) => {
  let result = Object.keys(ORDER_GROUPS);

  result = result.map((o) =>
    ORDER_GROUPS[o].reduce((total, g) => {
      const v = data[g] || 0;
      return total + v;
    }, 0)
  );

  return result;
};

const getMaxValue = (data) => {
  const dataset = data.map((d) => d.data);

  return max(flatten(dataset), (set) => set);
};

const getStepSize = (data, isNotTime) => {
  let maxValue = getMaxValue(data);

  if (!isNotTime && maxValue > 60) {
    maxValue /= 60;
  }

  return maxValue === 0 ? 1 : Math.round(maxValue / 4);
};

const scaleData = (data, isNotTime) => {
  if (isNotTime) return data;

  const maxValue = getMaxValue(data);

  return data.map((dataset) => {
    const set = dataset;

    set.data = set.data.map((value) => {
      let val = value;

      if (maxValue >= 3600) {
        val /= 3600;
      } else if (maxValue >= 60) {
        val /= 60;
      }

      return val;
    });

    return set;
  });
};

const createLineDatasets = (data, days) => {
  const rng = days > 1 ? range(days) : range(24);
  const type = days > 1 ? 'days' : 'hours';
  const format = days > 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH';

  let labels = rng.map((r) => moment().add(-r, type).format(format));
  const dt = [];

  labels.forEach((l) => {
    const m = data.find((d) => d.grouping === l);

    Object.keys(DATASETS).forEach((ds) => {
      dt[ds] = dt[ds] || {
        data: [],
        label: ds,
        backgroundColor: DATASETS[ds],
        borderColor: DATASETS[ds],
        fill: false,
      };

      if (m) {
        dt[ds].data.push(m[ds]);
      } else {
        dt[ds].data.push(0);
      }
    });
  });

  labels = labels.map((lb) => lb.slice(-2)).reverse();

  return {
    labels,
    data: values(dt),
  };
};

const createPerfLineDatasets = (data, type, chartType) => {
  const labels = data.map((datum) => datum.grouping);
  const dt = [];

  labels.forEach((l) => {
    const m = data.find((d) => d.grouping === l);

    if (chartType === 'count') {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'any[]'.
      dt.count = dt.count || {
        data: [],
        label: 'Count',
        backgroundColor: 'rgba(244, 66, 113, 1)',
        borderColor: 'rgba(244, 66, 113, 1)',
        fill: false,
      };

      if (m) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'any[]'.
        dt.count.data.push(m.count);
      } else {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'any[]'.
        dt.count.data.push(0);
      }
    } else if (chartType === 'success') {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'success' does not exist on type 'any[]'.
      dt.success = dt.success || {
        data: [],
        label: 'Success rate',
        backgroundColor: 'rgb(74, 186, 214)',
        borderColor: 'rgb(74, 186, 214)',
        fill: false,
      };

      if (m) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'success' does not exist on type 'any[]'.
        dt.success.data.push(m.successratio * 100);
      } else {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'success' does not exist on type 'any[]'.
        dt.success.data.push(0);
      }
    } else {
      Object.keys(SLADATASETS).forEach((ds) => {
        dt[ds] = dt[ds] || {
          data: [],
          label: SLADATASETS[ds].label,
          backgroundColor: SLADATASETS[ds].background,
          borderColor: SLADATASETS[ds].background,
          fill: false,
        };

        if (m) {
          const val = m[ds];

          dt[ds].data.push(val);
        } else {
          dt[ds].data.push(0);
        }
      });
    }
  });

  return {
    labels,
    data: values(dt),
  };
};

const createDoughDatasets = (data) => {
  const labels = Object.keys(DOUGH_LABELS);
  const dt = [
    {
      data: groupOrders(data),
      backgroundColor: values(DOUGH_LABELS),
    },
  ];

  return {
    labels,
    data: dt,
  };
};

const getUnit = (val) => {
  if (val >= 3600) {
    return 'h';
  } else if (val >= 60) {
    return 'm';
  } else if (val < 1) {
    return 'ms';
  }

  return 's';
};

const getFormattedValue: Function = (val: number, data) => {
  let value: number = val;
  const maxValue: number = getMaxValue(data);

  if (maxValue < 1) {
    value *= 1000;
  }

  return round(value, 2);
};

const getStatsCount: Function = (inSla: boolean, data: any): any => {
  if (inSla) {
    const val = data.sla.find((datum) => datum.in_sla);

    return val ? val.count : 0;
  } else {
    const val = data.sla.find((datum) => datum.in_sla === false);

    return val ? val.count : 0;
  }
};

const getStatsPct: Function = (inSla: boolean, data: any): any => {
  if (inSla) {
    const val = data.sla.find((datum) => datum.in_sla);

    return val ? val.pct : 0;
  } else {
    const val = data.sla.find((datum) => datum.in_sla === false);

    return val ? val.pct : 0;
  }
};

const prepareHistory: Function = (history: Array<Object>): Array<Object> => {
  let newHistory = takeRight([...history], 15);

  newHistory = newHistory.map((hist: any, idx: number): any => {
    const newHist = { ...hist };

    if (idx === 0) {
      return newHist;
    }

    if (idx % 3 !== 0) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'timestamp' does not exist on type '{ con... Remove this comment to see the full error message
      newHist.timestamp = null;
    }

    return newHist;
  });

  if (newHistory.length < 15) {
    const sub = 15 - newHistory.length;

    newHistory = [...Array(sub)]
      .map(() => ({
        node_priv: undefined,
        node_ram_in_use: undefined,
        node_load_pct: undefined,
        timestamp: null,
      }))
      .concat(newHistory);
  }

  return newHistory;
};

const formatChartTime: Function = (timestamp: string): string => {
  if (timestamp) {
    // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string'.
    const seconds: string = moment(timestamp).diff(moment(), 's');

    return `${seconds.toString().replace('-', '')}s`;
  }

  return '';
};

export {
  groupOrders,
  getMaxValue,
  getStepSize,
  scaleData,
  createLineDatasets,
  createPerfLineDatasets,
  createDoughDatasets,
  getUnit,
  getFormattedValue,
  getStatsCount,
  getStatsPct,
  prepareHistory,
  formatChartTime,
};
