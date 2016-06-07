import { expect } from 'chai';
import { getCSVHeaders, generateCSV, sortTable } from '../../src/js/helpers/table';

describe('{ getCSVHeaders, generateCSV, sortTable } from helpers/table', () => {
  describe('getCSVHeader', () => {
    it('returns the workflows headers used for CSV export', () => {
      const headers = getCSVHeaders('workflows');

      expect(Object.keys(headers)).to.have.length(18);
      expect(Object.keys(headers)[0]).to.equal('exec_count');
      expect(Object.keys(headers)[17]).to.equal('total');
    });

    it('returns the services headers used for CSV export', () => {
      const headers = getCSVHeaders('services');

      expect(Object.keys(headers)).to.have.length(5);
      expect(Object.keys(headers)[0]).to.equal('type');
      expect(Object.keys(headers)[4]).to.equal('desc');
    });

    it('returns the jobs headers used for CSV export', () => {
      const headers = getCSVHeaders('jobs');

      expect(Object.keys(headers)).to.have.length(9);
      expect(Object.keys(headers)[0]).to.equal('name');
      expect(Object.keys(headers)[8]).to.equal('CRASHED');
    });
  });

  describe('generateCSV', () => {
    it('generates a CSV string', () => {
      const data = [
        {
          severity: 'MAJOR',
          error: 'HTTP',
          description: 'AWESOME',
          step_name: 'step_1',
          ind: 1,
          created: 'Yesterday',
          error_type: 'Other',
          info: 'No',
          retry: 1,
        },
        {
          severity: 'MAJOR',
          error: 'DNS',
          description: 'AWESOME',
          step_name: 'step_1',
          ind: 2,
          created: 'Today',
          error_type: 'Other',
          info: 'No',
          retry: 4,
        },
      ];

      const csv = generateCSV(data, 'order_errors');
      const exp = 'Severity;Error Code;Description;Step name;Ind;Created;Error Type;Info;Retry\n' +
        'MAJOR;HTTP;AWESOME;step_1;1;Yesterday;Other;No;1\n' +
        'MAJOR;DNS;AWESOME;step_1;2;Today;Other;No;4';

      expect(csv).to.equal(exp);
    });
  });

  describe('sortTable', () => {
    const data = [
      {
        name: 'batman',
        dob: '1970-05-06 00:00:00',
        occupation: 'DC',
      },
      {
        name: 'Arrow',
        dob: '1985-01-12',
        occupation: 'DC',
      },
      {
        name: 'Flash',
        dob: '1990',
        occupation: 'DC',
      },
      {
        name: 'Joker',
        dob: null,
        occupation: 'DC',
      },
    ];

    it('sorts the provided array by name ascending', () => {
      const sorted = sortTable(data, {
        sortBy: 'name',
      });

      expect(sorted[0].name).to.equal('Arrow');
      expect(sorted[1].name).to.equal('batman');
      expect(sorted[2].name).to.equal('Flash');
      expect(sorted[3].name).to.equal('Joker');
    });

    it('sorts the provided array by date of birth descending', () => {
      const sorted = sortTable(data, {
        sortBy: 'dob',
        sortByKey: {
          direction: -1,
        },
      });

      expect(sorted[0].name).to.equal('Flash');
      expect(sorted[1].name).to.equal('Arrow');
      expect(sorted[2].name).to.equal('batman');
      expect(sorted[3].name).to.equal('Joker');
    });

    it('sorts the provided array by occupation, but actually by name descending', () => {
      const sorted = sortTable(data, {
        sortBy: 'occupation',
        historySortBy: 'name',
        historySortByKey: {
          direction: -1,
        },
      });

      expect(sorted[0].name).to.equal('Joker');
      expect(sorted[1].name).to.equal('Flash');
      expect(sorted[2].name).to.equal('batman');
      expect(sorted[3].name).to.equal('Arrow');
    });
  });
});
