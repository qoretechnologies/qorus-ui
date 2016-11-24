import { findElementByText, selectors, findTableRow } from './common_steps';
import { fixtureData } from '../../api/data';
import { sortTable } from '../../src/js/helpers/table';

const errors = fixtureData('errors');
const globalErrors = errors[0].filter(err => err.type === 'global');

module.exports = function systemErrorsSteps() {
  const transformHeader = (header) => {
    const props = {
      Error: 'error',
      Description: 'description',
      'Bus. Flag': 'business_flag',
      Retry: 'retry_flag',
    };

    return props[header] || header.toLowerCase();
  };

  const getDirection = dir => {
    return dir === 'asc' ? 1 : -1;
  };

  this.Then(/^errors are sorted by "([^"]*)" "([^"]*)" and "([^"]*)" "([^"]*)"$/, async function(
    header,
    dir,
    secondHeader,
    secondDir
  ) {
    const direction = getDirection(dir);
    const tableData = this.browser.queryAll(`${selectors.mainSection} tbody > tr`);
    const th = findElementByText(
      this.browser,
      `${selectors.mainSection} thead th.sort.sort-${dir}`,
      header
    );

    this.browser.assert.elements(th, 1);

    const sortData = {
      sortBy: transformHeader(header),
      sortByKey: { ignoreCase: true, direction },
      historySortBy: transformHeader(secondHeader),
      historySortByKey: {
        direction: getDirection(secondDir),
        ignoreCase: true,
      },
    };

    const sorted = sortTable(globalErrors, sortData);

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[0], sorted[index].error);
    });
  });

  this.When(/^I delete the "([^"]*)" error$/, async function(name) {
    const row = findTableRow(this.browser, name, 0);

    await this.browser.click(row.cells[6].childNodes[0].childNodes[1]);
  });
};
