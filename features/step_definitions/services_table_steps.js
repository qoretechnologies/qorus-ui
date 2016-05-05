import { findElementByText } from './common_steps';
import firstBy from 'thenby';

const services = [
  {
    name: 'info',
    type: 'system',
    version: '3.1.9.9',
    threads: 0,
    description: 'status information service',
  },
  {
    name: 'test',
    type: 'system',
    version: '3.1.0.0',
    threads: 0,
    description: 'a simple test to establish the proper balance of your loud speakers',
  },
  {
    name: 'anothertest',
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
    const tableData = this.browser.queryAll('tbody > tr');
    const th = findElementByText(this.browser, `thead th.sort.sort-${dir}`, header);

    this.browser.assert.elements(th, 1);

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[5], sorted[index].name);
    });
  });
};
