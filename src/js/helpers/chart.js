import { ORDER_GROUPS } from 'constants/orders';
import { max, flatten, range, values } from 'lodash';
import { DATASETS, DOUGH_LABELS } from 'constants/orders';
import moment from 'moment';

const groupOrders = (data) => {
  let result = Object.keys(ORDER_GROUPS);

  result = result.map(o => ORDER_GROUPS[o].reduce((total, g) => {
    const v = data[g] || 0;
    return total + v;
  }, 0));

  return result;
};

const getMaxValue = (data) => {
  const dataset = data.map(d => d.data);

  return max(flatten(dataset), (set) => set);
};

const getStepSize = (data) => {
  let maxValue = getMaxValue(data);

  if (maxValue > 60) {
    maxValue /= 60;
  }

  return maxValue === 0 ? 1 : Math.round(maxValue / 4);
};

const scaleData = (data) => {
  const maxValue = getMaxValue(data);

  return data.map(dataset => {
    const set = dataset;

    set.data = set.data.map(value => (
      maxValue > 60 ? value / 60 : value
    ));

    return set;
  });
};

const createLineDatasets = (data, days) => {
  const rng = days > 1 ? range(days) : range(24);
  const type = days > 1 ? 'days' : 'hours';
  const format = days > 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH';

  let labels = rng.map(r => moment().add(-r, type).format(format));
  const dt = [];

  labels.forEach(l => {
    const m = data.find(d => d.grouping === l);

    Object.keys(DATASETS).forEach(ds => {
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

  labels = labels.map(lb => lb.slice(-2)).reverse();

  return {
    labels,
    data: values(dt),
  };
};

const createDoughDatasets = (data) => {
  const labels = Object.keys(DOUGH_LABELS);
  const dt = [{
    data: groupOrders(data),
    backgroundColor: values(DOUGH_LABELS),
  }];

  return {
    labels,
    data: dt,
  };
};

export {
  groupOrders,
  getMaxValue,
  getStepSize,
  scaleData,
  createLineDatasets,
  createDoughDatasets,
};
