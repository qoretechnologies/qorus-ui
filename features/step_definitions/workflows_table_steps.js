import { findElementByText } from './common_steps';
import firstBy from 'thenby';

let workflows = [
  {
    name: 'ARRAYTEST',
    id: 14,
    version: 2.0,
    exec_count: 3,
    autostart: 3,
  },
  {
    name: 'OLDWORKFLOWTEST',
    id: 1,
    version: 1.0,
    exec_count: 0,
    autostart: 1,
  },
  {
    name: 'SIMPLETEST',
    id: 2,
    version: 1.0,
    exec_count: 0,
    autostart: 1,
  },
  {
    name: 'VERSIONTEST',
    id: 132,
    version: 1.0,
    exec_count: 0,
    autostart: 0,
  },
  {
    name: 'VERSIONTEST',
    id: 212,
    version: 1.2,
    exec_count: 1,
    autostart: 0,
  },
];

module.exports = function workFlowTableSteps() {
  this.Then(/^workflows are sorted by "([^"]*)" "([^"]*)"$/, async function(header, dir) {
    const direction = dir === 'asc' ? 1 : -1;
    const key = header.toLowerCase();
    const sorted = workflows.slice().sort(firstBy(w => w[key], { ignoreCase: true, direction }));
    const tableData = this.browser.queryAll('tbody > tr');
    const th = findElementByText(this.browser, `thead th.sort.sort-${dir}`, header);

    this.browser.assert.elements(th, 1);

    tableData.forEach((row, index) => {
      this.browser.assert.text(row.cells[5], sorted[index].name);
    });
  });
};
