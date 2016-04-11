import { expect } from 'chai';

import { selectors, findTableRow, findTableRowId } from './common_steps';


const wflwRowControls = 'td:nth-child(2) > .btn-controls > button.btn';


/**
 * Finds control buttons for worflow of given name in workflow table.
 *
 * The first returned button is enable/disable button and the second
 * is reset button.
 *
 * @param {!module:zombie/Browser} browser
 * @param {string} name
 * @return {!Array<HTMLButtonElement>}
 */
function findRowControlButtons(browser, name) {
  const row = findTableRow(browser, name);
  if (!row) return [null, null];

  const buttons = browser.queryAll(wflwRowControls, row);

  if (buttons.length <= 0) return [null, null];
  if (buttons.length != 2) {
    throw new Error(
      `Exactly two control button expected, but ${buttons.length} found.`
    );
  }

  return buttons;
}


module.exports = function workflowsControlsSteps() {
  this.When(/^I disable "([^"]*)" workflow$/, async function(name) {
    await this.waitForElement(selectors.cmpTable);

    const btn = findRowControlButtons(this.browser, name)[0];
    this.browser.assert.attribute(btn, 'title', 'Disable');
    await this.browser.pressButton(btn);

    this.detail = {
      id: findTableRowId(this.browser, name),
      name,
    };
  });

  this.Then(/^workflow should be disabled$/, async function() {
    const res = await this.fetch(`/api/workflows/${this.detail.id}`);
    const wflw = await res.json();

    expect(wflw.enabled).to.eq(false);
  });

  this.Given(/^"([^"]*)" workflow is disabled$/, async function(name) {
    return this.fetch(`/api/workflows/${findTableRowId(this.browser, name)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: false })
    });
  });

  this.When(/^I enable "([^"]*)" workflow$/, async function(name) {
    await this.waitForElement(selectors.cmpTable);

    const btn = findRowControlButtons(this.browser, name)[0];
    this.browser.assert.attribute(btn, 'title', 'Enable');
    await this.browser.pressButton(btn);

    this.detail = {
      id: findTableRowId(this.browser, name),
      name,
    };
  });

  this.Then(/^workflow should be enabled$/, async function() {
    const res = await this.fetch(`/api/workflows/${this.detail.id}`);
    const wflw = await res.json();

    expect(wflw.enabled).to.eq(true);
  });
};
