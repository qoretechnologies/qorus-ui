import { findElementByText } from './common_steps';
import { sortTable } from '../../src/js/helpers/table';

const orders = [
  {
    name: 'ARRAYTEST',
    id: 3658,
    workflowstatus: 'BLOCKED',
    started: '2016-05-05 09:31:20',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3659,
    workflowstatus: 'RETRY',
    started: '2015-01-01 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3660,
    workflowstatus: 'COMPLETE',
    started: '2016-05-12 09:51:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3661,
    workflowstatus: 'CANCELED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3662,
    workflowstatus: 'BLOCKED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3663,
    workflowstatus: 'SCHEDULED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3664,
    workflowstatus: 'CANCELED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3665,
    workflowstatus: 'CANCELED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3666,
    workflowstatus: 'CANCELED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 3667,
    workflowstatus: 'CANCELED',
    started: '2016-05-12 09:31:28',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 4000,
    workflowstatus: 'ERROR',
    started: '2016-06-06 10:30:00',
    error: 0,
    warnings: 0,
    notes: 0,
  },
  {
    name: 'ARRAYTEST',
    id: 31380,
    workflowstatus: 'ERROR',
    started: '2016-05-31 17:15:02',
    error: 0,
    warnings: 0,
    notes: 0,
  },
];

const actions = {
  block: 0,
  unblock: 0,
  cancel: 1,
  uncancel: 1,
  retry: 2,
  schedule: 3,
};

const transformHeader = (header) => {
  const props = {
    Status: 'workflowstatus',
    Order: 'name',
    'Bus. Err.': 'business_error',
    Errors: 'error_count',
    Warning: 'warning_count',
    Notes: 'note_count',
  };

  return props[header] || header.toLowerCase();
};

module.exports = function orderTableSteps() {
  let historySortBy = 'workflowstatus';
  let historySortByKey = { ignoreCase: true, direction: 1 };

  this.Then(/^orders are sorted by "([^"]*)" "([^"]*)"$/, async function(header, dir) {
    const direction = dir === 'asc' ? 1 : -1;
    const tableData = this.browser.queryAll('tbody > tr');
    const th = findElementByText(this.browser, `thead th.sort.sort-${dir}`, header);
    const sortData = {
      sortBy: transformHeader(header),
      sortByKey: { ignoreCase: true, direction },
      historySortBy,
      historySortByKey,
    };

    const sorted = sortTable(orders, sortData);

    this.browser.assert.elements(th, 1);

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[3], sorted[index].workflowstatus);
    });

    historySortBy = historySortBy === transformHeader(header) ?
      historySortBy : transformHeader(header);
    historySortByKey = { ignoreCase: true, direction };
  });

  this.Then(/^orders are history sorted by "([^"]*)" "([^"]*)"$/, async function(header, dir) {
    const direction = dir === 'asc' ? 1 : -1;
    const sortData = {
      sortBy: transformHeader(header),
      sortByKey: { ignoreCase: true, direction },
      historySortBy,
      historySortByKey,
    };
    const sorted = sortTable(orders, sortData);
    const tableData = this.browser.queryAll('tbody > tr');

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[3], sorted[index].workflowstatus);
    });
  });

  this.When(/^I "([^"]*)" an order with "([^"]*)" status$/, async function(action, state) {
    const row = this.browser.queryAll('tbody > tr').filter(r => r.cells[3].textContent === state);

    this.browser.click(row[0].cells[2].children[0].children[actions[action]]);

    this.waitForChange(1000);
  });

  this.When(/^I enter "([^"]*)" to the datepicker$/, async function(date) {
    this.browser.assert.element('.modal');

    this.browser.fill('.datepicker-group input[type="text"]', date);
    this.browser.pressButton('.datepicker-group [type="submit"]');
  });
};
