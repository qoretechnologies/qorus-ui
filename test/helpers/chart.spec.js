import { expect } from 'chai';
import {
  groupOrders,
  getMaxValue,
  getStepSize,
  scaleData,
  createLineDatasets,
  createDoughDatasets,
} from '../../src/js/helpers/chart';

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
    it.only('creates the data for the line chart for last 24 hours', () => {
      
    });
  });
});
