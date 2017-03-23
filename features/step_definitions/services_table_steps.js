import { findElementByText, selectors } from './common_steps';
import firstBy from 'thenby';

const services = [
  {
    name: 'info v3.1.9.9 (698)',
    type: 'system',
    version: '3.1.9.9',
    threads: 0,
    description: 'status information service',
  },
  {
    name: 'test v3.1.0.0 (111)',
    type: 'system',
    version: '3.1.0.0',
    threads: 0,
    description: 'a simple test to establish the proper balance of your loud speakers',
  },
  {
    name: 'anothertest v1.1.0.0 (222)',
    type: 'user',
    version: '1.1.0.0',
    threads: 2,
    description: 'another day, another test',
  },
];

module.exports = function servicesTableSteps() {
  this.Then(/^services are sorted by "([^"]*)" "([^"]*)"$/, async function(header, dir) {
    const direction = dir === 'asc' ? 1 : -1;
    const key = header.toLowerCase();
    const sorted = services.slice().sort(firstBy(w => w[key], { ignoreCase: true, direction }));
    const tableData = this.browser.queryAll(`${selectors.mainSection} tbody > tr`);
  
    const th = findElementByText(
      this.browser,
      `thead th.sort.sort-${dir}`,
      header
    );

    this.browser.assert.elements(th, 1);

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[7], sorted[index].name);
    });
  });
};
