import { expect } from 'chai';
import {
  groupOrders,
  getMaxValue,
  getStepSize,
  scaleData,
  createLineDatasets,
  createDoughDatasets,
} from '../../src/js/helpers/chart';
import moment from 'moment';

describe('Helpers from helpers/table', () => {
  describe('groupOrders', () => {
    it('groups order states', () => {
      const data = {
        READY: 1,
        COMPLETED: 2,
        ERROR: 5,
        BLOCKED: 3,
        INCOMPLETE: 1,
        WAITING: 2,
        'ASYNC-WAITING': 3,
        'EVENT-WAITING': 9,
        RETRY: 4,
        SCHEDULED: 7,
        CANCELED: 0,
      };

      const grouped = groupOrders(data);

      expect(grouped).to.be.an('array');
      expect(grouped).to.be.have.length(5);
      expect(grouped[0]).to.equal(8);
      expect(grouped[1]).to.equal(19);
      expect(grouped[2]).to.equal(8);
      expect(grouped[3]).to.equal(0);
      expect(grouped[4]).to.equal(2);
    });
  });

  describe('getMaxValue', () => {
    it('gets the max value from deep arrays', () => {
      const data = [
        {
          data: [0, 21, 39, 2998],
        },
        {
          data: [30, 2, 9, 10000],
        },
      ];

      const maxValue = getMaxValue(data);

      expect(maxValue).to.equal(10000);
    });
  });

  describe('getStepSize', () => {
    it('gets the unit of the step based on biggest number of seconds', () => {
      const data = [
        {
          data: [0, 21, 39, 2998],
        },
        {
          data: [30, 2, 9, 10000],
        },
      ];

      const stepSize = getStepSize(data);

      expect(stepSize).to.equal(1);
    });
  });

  describe('getStepSize', () => {
    it.only('gets the scaled data in minutes based on the max value', () => {
      const data = [
        {
          data: [0, 21, 39, 3000],
        },
      ];

      const scaled = scaleData(data);

      expect(scaled[0].data[0]).to.equal(0);
      expect(scaled[0].data[1]).to.equal(0.35);
      expect(scaled[0].data[2]).to.equal(0.65);
      expect(scaled[0].data[3]).to.equal(50);
    });

    it('gets the scaled data in hours based on the max value', () => {
      const data = [
        {
          data: [0, 360, 720, 7200],
        },
      ];

      const scaled = scaleData(data);

      expect(scaled[0].data[0]).to.equal(0);
      expect(scaled[0].data[1]).to.equal(0.1);
      expect(scaled[0].data[2]).to.equal(0.2);
      expect(scaled[0].data[3]).to.equal(2);
    });

    it('gets the scaled data in seconds based on the max value', () => {
      const data = [
        {
          data: [0, 3, 19, 55],
        },
      ];

      const scaled = scaleData(data);

      expect(scaled[0].data[0]).to.equal(0);
      expect(scaled[0].data[1]).to.equal(3);
      expect(scaled[0].data[2]).to.equal(19);
      expect(scaled[0].data[3]).to.equal(55);
    });
  });

  describe('createLineDatasets', () => {
    it('creates the data and labels for the line chart for last 24 hours', () => {
      const data = [
        {
          maxduration: 5,
          minduration: 3,
          avgduration: 4,
          maxprocessing: 7,
          minprocessing: 0,
          avgprocessing: 3,
          grouping: moment().add(-1, 'hours').format('YYYY-MM-DD HH'),
        },
        {
          maxduration: 2,
          minduration: 6,
          avgduration: 7,
          maxprocessing: 1,
          minprocessing: 4,
          avgprocessing: 2,
          grouping: moment().add(-3, 'hours').format('YYYY-MM-DD HH'),
        },
      ];
      const transformed = createLineDatasets(data, 1);
      const first = moment().add(-23, 'hours').format('HH');
      const last = moment().format('HH');

      expect(transformed).to.be.an('object');
      expect(transformed.labels).to.have.length(24);
      expect(transformed.labels[0]).to.equal(first);
      expect(transformed.labels[23]).to.equal(last);
      expect(transformed.data).to.have.length(6);
      expect(transformed.data[0].label).to.equal('avgduration');
      expect(transformed.data[0].data[1]).to.equal(4);
      expect(transformed.data[0].data[3]).to.equal(7);
      expect(transformed.data[1].label).to.equal('avgprocessing');
      expect(transformed.data[1].data[1]).to.equal(3);
      expect(transformed.data[1].data[3]).to.equal(2);
      expect(transformed.data[2].label).to.equal('maxduration');
      expect(transformed.data[2].data[1]).to.equal(5);
      expect(transformed.data[2].data[3]).to.equal(2);
      expect(transformed.data[3].label).to.equal('maxprocessing');
      expect(transformed.data[3].data[1]).to.equal(7);
      expect(transformed.data[3].data[3]).to.equal(1);
      expect(transformed.data[4].label).to.equal('minduration');
      expect(transformed.data[4].data[1]).to.equal(3);
      expect(transformed.data[4].data[3]).to.equal(6);
      expect(transformed.data[5].label).to.equal('minprocessing');
      expect(transformed.data[5].data[1]).to.equal(0);
      expect(transformed.data[5].data[3]).to.equal(4);
    });

    it('creates the data and labels for the line chart for last 3 days', () => {
      const data = [
        {
          maxduration: 5,
          minduration: 3,
          avgduration: 4,
          maxprocessing: 7,
          minprocessing: 0,
          avgprocessing: 3,
          grouping: moment().add(-1, 'days').format('YYYY-MM-DD'),
        },
        {
          maxduration: 2,
          minduration: 6,
          avgduration: 7,
          maxprocessing: 1,
          minprocessing: 4,
          avgprocessing: 2,
          grouping: moment().add(-2, 'days').format('YYYY-MM-DD'),
        },
      ];
      const transformed = createLineDatasets(data, 3);
      const first = moment().add(-2, 'days').format('DD');
      const last = moment().format('DD');

      expect(transformed).to.be.an('object');
      expect(transformed.labels).to.have.length(3);
      expect(transformed.labels[0]).to.equal(first);
      expect(transformed.labels[2]).to.equal(last);
      expect(transformed.data).to.have.length(6);
      expect(transformed.data[0].label).to.equal('avgduration');
      expect(transformed.data[0].data[1]).to.equal(4);
      expect(transformed.data[0].data[2]).to.equal(7);
      expect(transformed.data[1].label).to.equal('avgprocessing');
      expect(transformed.data[1].data[1]).to.equal(3);
      expect(transformed.data[1].data[2]).to.equal(2);
      expect(transformed.data[2].label).to.equal('maxduration');
      expect(transformed.data[2].data[1]).to.equal(5);
      expect(transformed.data[2].data[2]).to.equal(2);
      expect(transformed.data[3].label).to.equal('maxprocessing');
      expect(transformed.data[3].data[1]).to.equal(7);
      expect(transformed.data[3].data[2]).to.equal(1);
      expect(transformed.data[4].label).to.equal('minduration');
      expect(transformed.data[4].data[1]).to.equal(3);
      expect(transformed.data[4].data[2]).to.equal(6);
      expect(transformed.data[5].label).to.equal('minprocessing');
      expect(transformed.data[5].data[1]).to.equal(0);
      expect(transformed.data[5].data[2]).to.equal(4);
    });
  });

  describe('createLineDatasets', () => {
    it.only('creates the data for the dough chart', () => {
      const data = {
        READY: 1,
        COMPLETED: 2,
        ERROR: 5,
        BLOCKED: 3,
        INCOMPLETE: 1,
        WAITING: 2,
        'ASYNC-WAITING': 3,
        'EVENT-WAITING': 9,
        RETRY: 4,
        SCHEDULED: 7,
        CANCELED: 0,
      };

      const transformed = createDoughDatasets(data);

      expect(transformed.labels).to.have.length(5);
      expect(transformed.data[0].data[0]).to.equal(8);
      expect(transformed.data[0].data[1]).to.equal(19);
      expect(transformed.data[0].data[2]).to.equal(8);
      expect(transformed.data[0].data[3]).to.equal(0);
      expect(transformed.data[0].data[4]).to.equal(2);
    });
  });
});
