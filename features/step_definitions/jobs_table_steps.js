import { findElementByText, selectors } from './common_steps';
import firstBy from 'thenby';

const collection = [
  {
    name: 'test',
    version: '1.0',
    COMPLETE: 30,
    ERROR: 17,
  },
  {
    name: 'anothertest',
    version: '3.0',
    COMPLETE: 10,
    ERROR: 5,
  },
  {
    name: 'jobtest',
    version: '1.1',
    COMPLETE: 2,
    ERROR: 0,
  },
];

module.exports = function jobsTableSteps() {
  this.Then(/^jobs are sorted by "([^"]*)" "([^"]*)"$/, async function(header, dir) {
    const direction = dir === 'asc' ? 1 : -1;
    const key = header.toLowerCase();
    const sorted = collection.slice().sort(firstBy(w => w[key], { ignoreCase: true, direction }));
    const tableData = this.browser.queryAll(`${selectors.mainSection} tbody > tr`);
    const th = findElementByText(this.browser, `${selectors.mainSection} thead th.sort.sort-${dir}`, header);

    this.browser.assert.elements(th, 1);

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[3], sorted[index].name);
    });
  });
};
