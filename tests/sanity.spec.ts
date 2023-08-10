import { expect, Page, test } from '@playwright/test';

let page: Page;

/* A configuration object for the screenshot comparison. */
const screenshotConfig: any = {
  animations: 'disabled',
  fullPage: true,
  maxDiffPixelRatio: 0.08,
};

/* Declaring a variable called localServerUrl and assigning it the value of 'https://localhost:3000/'. */
const localServerUrl = 'https://localhost:3000/';

/* A test suite that checks every page for visual regressions. */
test.describe('Checks every page for visual regressions', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Go to the login page
    await page.goto(localServerUrl);
    await page.waitForSelector('text=Log in');
    // Log in
    await page.fill('input[id="username"]', process.env.TEST_USER! || 'ui-test');
    await page.fill('input[id="password"]', process.env.TEST_USER_PASS! || 'sojcaf-4gitta-teGfyg');
    await page.click('id=submit');
    await page.waitForSelector('.masonry-layout');
  });

  test('Searching from top-bar works', async () => {
    await page.goto(localServerUrl);
    await page.getByRole('button', { name: 'in Orders by value in Orders by value' }).click();
    await page.getByRole('button', { name: 'Workflows Workflows' }).click();
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill('bind');
    await page.locator('button:nth-child(3)').click();
    await expect(page).toHaveScreenshot('topbar-search.png', screenshotConfig);
  });

  test('Dashboard page is visually identical', async () => {
    await page.goto(localServerUrl);
    await page.waitForSelector('.masonry-layout');
    await expect(page).toHaveScreenshot('dashboard.png', screenshotConfig);
  });

  test('Shows user profile when clicking from top-bar', async () => {
    await page.goto(localServerUrl);
    await page.waitForSelector('.masonry-layout');
    await page.getByRole('button', { name: 'user' }).click();

    await page.getByText('info-signMy profile').click();
    await expect(page).toHaveURL('https://localhost:3000/user');
    await expect(page).toHaveScreenshot('user-profile.png', screenshotConfig);

    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('https://localhost:3000/user?tab=settings');
    await expect(page).toHaveScreenshot('user-profile-settings.png', screenshotConfig);
  });

  test('Shows notifications when clicking from top-bar', async () => {
    await page.goto(localServerUrl);
    await page.waitForSelector('.masonry-layout');
    await page.getByRole('button', { name: 'notifications' }).click();
    await expect(page).toHaveScreenshot('notifications.png', screenshotConfig);
  });

  test('Workflows page is visually identical', async () => {
    await page.goto('https://localhost:3000/workflows');
    await page.waitForSelector('#workflows-view');
    await expect(page).toHaveScreenshot('workflows.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=detail');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-detail.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=config');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-config.png', screenshotConfig);

    await page.locator('div:nth-child(2) .reqore-collection-item').first().click();
    await page.waitForSelector('.reqore-modal');
    await expect(page).toHaveScreenshot('workflows-config-item-open.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=steps');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-steps.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=process');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-process.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=releases');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-releases.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=valuemaps');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-valuemaps.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=mappers');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-mappers.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=errors');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-errors.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=code');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-code.png', screenshotConfig);

    await page.goto('https://localhost:3000/workflows?paneId=1&paneTab=info');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('workflows-pane-info.png', screenshotConfig);
  });

  test('Service detail page is visually identical', async () => {
    await page.goto('https://localhost:3000/service/12');
    await page.waitForSelector('.table-body-wrapper');
    await expect(page).toHaveScreenshot('service-detail.png', screenshotConfig);
  });

  test('Jobs detail page is visually identical', async () => {
    await page.goto('https://localhost:3000/job/4');
    await page.waitForSelector('.table-body-wrapper');
    await expect(page).toHaveScreenshot('job-detail.png', screenshotConfig);
  });

  test('Workflow detail page is visually identical', async () => {
    await page.goto('https://localhost:3000/workflow/1');
    await page.waitForSelector('.table-body-wrapper');
    await expect(page).toHaveScreenshot('workflow-detail.png', screenshotConfig);

    await page.getByRole('button', { name: 'All caret-down' }).click();
    await page.getByText('circleComplete').click();
    await page.getByText('circleReady').click();
    await page.getByText('circleScheduled').click();
    await expect(page).toHaveScreenshot('workflow-detail-statuses.png', screenshotConfig);
    await page.getByRole('button', { name: 'Scheduled, Ready, Complete caret-down' }).click();
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(
      'https://localhost:3000/workflow/1?filter=Scheduled%2CReady%2CComplete'
    );

    await page.goto('https://localhost:3000/workflow/1?tab=performance');
    await page.waitForSelector('.chart-view');
    await expect(page).toHaveScreenshot('workflow-detail-performance.png', screenshotConfig);
  });

  test('Services page is visually identical', async () => {
    await page.goto('https://localhost:3000/services');
    await page.waitForSelector('#services-view');
    await expect(page).toHaveScreenshot('services.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=detail');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-detail.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=config');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-config.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=code');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-code.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=methods');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-methods.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=process');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-process.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=mappers');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-mappers.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=valuemaps');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-valuemaps.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=resources');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-resources.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=authlabels');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-authlabels.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=releases');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-releases.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=12&paneTab=info');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-info.png', screenshotConfig);
  });

  test('Jobs page is visually identical', async () => {
    await page.goto('https://localhost:3000/jobs');
    await page.waitForSelector('#jobs-view');
    await expect(page).toHaveScreenshot('jobs.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=detail');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-detail.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=config');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-config.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=process');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-process.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=mappers');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-mappers.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=valuemaps');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-valuemaps.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=releases');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-releases.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=code');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-code.png', screenshotConfig);

    await page.goto('https://localhost:3000/jobs?paneId=1&paneTab=info');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('jobs-pane-info.png', screenshotConfig);
  });

  test('Groups page is visually identical', async () => {
    await page.goto('https://localhost:3000/groups');
    await page.waitForSelector('#groups-view');
    await expect(page).toHaveScreenshot('groups.png', screenshotConfig);

    await page.goto('https://localhost:3000/groups?group=qorus-admin');
    await page.waitForSelector('.masonry-layout');
    await expect(page).toHaveScreenshot('groups-detail.png', screenshotConfig);
  });

  test.only('Connections page is visually identical', async () => {
    await page.goto('https://localhost:3000/remote');
    await page.waitForSelector('#connections-view');
    await expect(page).toHaveScreenshot('connections-datasources.png', screenshotConfig);

    await page.goto('https://localhost:3000/remote?paneId=omq&paneTab=detail');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('connections-datasources-detail.png', screenshotConfig);

    await page.goto('https://localhost:3000/remote?tab=qorus');
    await page.waitForSelector('#connections-view');
    await expect(page).toHaveScreenshot('connections-qorus.png', screenshotConfig);

    await page.goto('https://localhost:3000/remote?tab=user');
    await page.waitForSelector('#connections-view');
    await expect(page).toHaveScreenshot('connections-user.png', screenshotConfig);
  });

  test('RBAC page is visually identical', async () => {
    await page.goto('https://localhost:3000/rbac');
    await page.waitForSelector('#rbac-view');
    await expect(page).toHaveScreenshot('rbac-users.png', screenshotConfig);

    await page.goto('https://localhost:3000/rbac?tab=roles');
    await page.waitForSelector('#rbac-view');
    await expect(page).toHaveScreenshot('rbac-roles.png', screenshotConfig);

    await page.goto('https://localhost:3000/rbac?tab=permissions');
    await page.waitForSelector('#rbac-view');
    await expect(page).toHaveScreenshot('rbac-permissions.png', screenshotConfig);

    await page.goto('https://localhost:3000/rbac?tab=oauth2');
    await page.waitForSelector('.reqore-table');
    await expect(page).toHaveScreenshot('rbac-oauth2.png', screenshotConfig);
  });

  test('Value Maps page is visually identical', async () => {
    await page.goto('https://localhost:3000/valuemaps');
    await page.waitForSelector('#valuemaps-view');
    await expect(page).toHaveScreenshot('valuemaps.png', screenshotConfig);
  });

  test('SLAs page is visually identical', async () => {
    await page.goto('https://localhost:3000/slas');
    await page.waitForSelector('#slas-view');
    await expect(page).toHaveScreenshot('slas.png', screenshotConfig);

    // Creates and deletes an SLA
    await page.getByRole('button', { name: 'plus Add new' }).click();
    await page.getByLabel('Name *').click();
    await page.getByLabel('Name *').fill('Test');
    await page.getByLabel('Description *').click();
    await page.getByLabel(' Description *').fill('This is a test');
    await page.getByLabel('Seconds').check();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveScreenshot('slas-with-new.png', screenshotConfig);

    await page.getByRole('cell', { name: 'cross' }).getByRole('button', { name: 'cross' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page).toHaveScreenshot('slas.png', screenshotConfig);
  });

  test('Releases page is visually identical', async () => {
    await page.goto('https://localhost:3000/releases');
    await page.waitForSelector('#releases-view');
    await expect(page).toHaveScreenshot('releases.png', screenshotConfig);

    await page.getByRole('button', { name: 'expand-all Expand all' }).click();
    await expect(page).toHaveScreenshot('releases-expanded.png', screenshotConfig);
  });

  test('Errors page is visually identical', async () => {
    await page.goto('https://localhost:3000/errors');
    await page.waitForSelector('#errors-view');
    await expect(page).toHaveScreenshot('errors.png', screenshotConfig);

    // Adds and deletes an error
    // First we add the new error
    await page.getByRole('button', { name: 'plus Add error' }).click();
    await page.getByLabel('Error Code').click();
    await page.getByLabel('Error Code').fill('Test');
    await page.getByLabel('Error Code').press('Tab');
    await page.locator('textarea[name="description"]').fill('My test error');
    await page.getByRole('combobox', { name: 'Severity' }).selectOption('MAJOR');
    await page.getByRole('combobox', { name: 'Status' }).selectOption('CANCELED');
    await page.locator('input[name="business_flag"]').check();
    await page.getByRole('button', { name: 'Save' }).click();

    // wait for a second for the error to be added
    await page.waitForTimeout(1000);

    // Show all errors
    await page.getByRole('button', { name: 'double-chevron-down Show all' }).click();

    // Try to delete the new error, if it fails, it means that the error was not added
    await page
      .getByRole('row', { name: 'Test edit cross My test error MAJOR CANCELED -' })
      .getByRole('button', { name: 'cross' })
      .click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(3000);

    // Compare the screenshot
    await expect(page).toHaveScreenshot('errors.png', screenshotConfig);
  });

  test('Types page is visually identical', async () => {
    await page.goto('https://localhost:3000/types');
    await page.waitForSelector('#types-view');
    await expect(page).toHaveScreenshot('types.png', screenshotConfig);

    // Navigate and select a type
    await page.getByText('Global').click();
    await page.getByRole('link', { name: 'Types' }).click();
    await expect(page).toHaveURL('https://localhost:3000/types');
    await page.getByPlaceholder('Search for a type').click();
    await page
      .getByPlaceholder('Search for a type')
      .fill('/qoretechnologies/qorus-api/workflows/create-order/request');
    await page.getByRole('button', { name: 'Submit Submit' }).click();
    await page.waitForTimeout(3000);
    await expect(page).toHaveScreenshot('types-selected.png', screenshotConfig);

    // Clear
    await page.getByRole('button', { name: 'Clear Clear' }).click();
    await expect(page).toHaveScreenshot('types.png', screenshotConfig);
  });

  test('Alerts page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/alerts');
    await page.waitForSelector('#alerts-view');
    await expect(page).toHaveScreenshot('alerts-ongoing.png', screenshotConfig);

    await page.goto('https://localhost:3000/system/alerts?tab=transient');
    await page.waitForSelector('#alerts-view');
    await expect(page).toHaveScreenshot('alerts-transient.png', screenshotConfig);
  });

  test('Cluster page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/cluster');
    await page.waitForSelector('#cluster-view');
    await expect(page).toHaveScreenshot('cluster.png', screenshotConfig);
  });

  test('Order Stats page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/orderStats');
    await page.waitForSelector('#order-stats-view');
    await expect(page).toHaveScreenshot('order-stats.png', screenshotConfig);
  });

  test('Options page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/options');
    await page.waitForSelector('#options-view');
    await expect(page).toHaveScreenshot('options.png', screenshotConfig);

    // Edits a value
    // await page
    //   .getByRole('row', { name: '- alert-smtp-enable W S J false false edit' })
    //   .getByRole('button', { name: 'edit' })
    //   .click();
    // await page.getByRole('button', { name: 'null caret-down' }).click();
    // await page.locator('a:has-text("true")').click();
    // await page.getByRole('button', { name: 'Save' }).click();

    // await page.waitForTimeout(3000);

    // expect(
    //   page.getByRole('row', { name: '- alert-smtp-enable W S J false true edit' }).getByText('true')
    // ).toBeTruthy();

    // await page.screenshot({ path: 'options-edited.png', fullPage: true });

    // await page
    //   .getByRole('row', { name: '- alert-smtp-enable W S J false true edit' })
    //   .getByRole('button', { name: 'edit' })
    //   .click();
    // await page.getByRole('button', { name: 'true caret-down' }).click();
    // await page.locator('a:has-text("false")').click();
    // await page.getByRole('button', { name: 'Save' }).click();

    // await expect(page).toHaveScreenshot('options.png', screenshotConfig);
  });

  test('Properties page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/props');
    await page.waitForSelector('#properties-view');
    await expect(page).toHaveScreenshot('properties.png', screenshotConfig);

    // Creates and deletes
    await page
      .locator('#properties-view div:has-text("Properties addAdd property")')
      .getByRole('button', { name: 'add Add property' })
      .click();
    await page.getByRole('button', { name: 'Please select domain Please select domain' }).click();
    await page.getByRole('button', { name: 'arch arch' }).click();
    await page.getByRole('button', { name: 'Select caret-down' }).nth(0).click();
    await page.getByPlaceholder('...or specify new key').click();
    await page.getByPlaceholder('...or specify new key').press('CapsLock');
    await page.getByPlaceholder('...or specify new key').fill('test');
    await page.getByLabel('Value').click();
    await page.getByLabel('Value').fill('my-test');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveScreenshot('properties-with-new.png', screenshotConfig);

    await page
      .getByRole('row', { name: 'test my-test edit cross' })
      .getByRole('button', { name: 'cross' })
      .click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page).toHaveScreenshot('properties.png', screenshotConfig);
  });

  test('SQL Cache page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/sqlcache');
    await page.waitForSelector('#cache-view');
    await expect(page).toHaveScreenshot('cache.png', screenshotConfig);
  });

  test('HTTP Services page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/http');
    await page.waitForSelector('#http-services-view');
    await expect(page).toHaveScreenshot('http.png', screenshotConfig);
  });

  test('Config Items page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/config-items');
    await page.waitForSelector('#config-items-view');
    await expect(page).toHaveScreenshot('config-items.png', screenshotConfig);
  });

  test('OCMD page is visually identical', async () => {
    await page.goto('https://localhost:3000/ocmd');
    await page.waitForSelector('#ocmd-view');
    await page.waitForTimeout(5000);
    await expect(page).toHaveScreenshot('ocmd.png', screenshotConfig);

    // Try running a command and expading the output
    await page.getByPlaceholder('Type or select command...').click();
    await page.getByPlaceholder('Type or select command...').fill('omq.system.get-all');
    await page.locator('a:has-text("omq.system.get-all-errors")').click();
    await page.getByRole('button', { name: 'tick' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'expand-all Expand all' }).click();
    await expect(page).toHaveScreenshot('ocmd-command.png', screenshotConfig);
  });

  test('Library page is visually identical', async () => {
    await page.goto('https://localhost:3000/library');
    await page.waitForSelector('#library-view');
    await expect(page).toHaveScreenshot('library.png', screenshotConfig);

    // Selecting an item and expanding the details
    await page.getByText('BBM_WebSocketServiceEventSource v1.0 (69)').click();
    await expect(page).toHaveScreenshot('library-selected.png', screenshotConfig);
    await page.locator('ul:has-text("CodeInfoReleasesDependencies") div').nth(2).click();
    await expect(page).toHaveScreenshot('library-selected-info.png', screenshotConfig);
    await page.locator('ul:has-text("CodeInfoReleasesDependencies") div').nth(3).click();
    await page.waitForSelector('#releases-view');
    await expect(page).toHaveScreenshot('library-selected-releases.png', screenshotConfig);
    await page.locator('ul:has-text("CodeInfoReleasesDependencies") div').nth(4).click();
    await expect(page).toHaveScreenshot('library-selected-dependencies.png', screenshotConfig);
  });

  test('Extensions page is visually identical', async () => {
    await page.goto('https://localhost:3000/extensions');
    await page.waitForSelector('#extensions-view');
    await expect(page).toHaveScreenshot('extensions.png', screenshotConfig);
  });

  test('Logs page is visually identical', async () => {
    await page.goto('https://localhost:3000/logs');
    await page.waitForSelector('#logs-view');
    await expect(page).toHaveScreenshot('logs.png', screenshotConfig);
  });

  test('Info page is visually identical', async () => {
    await page.goto('https://localhost:3000/info');
    await page.waitForSelector('#info-view');
    await expect(page).toHaveScreenshot('info.png', screenshotConfig);
  });

  test('Logout works and is visually identical', async () => {
    await page.getByRole('button', { name: 'user' }).click();
    await page.getByText('log-outLogout').click();
    await expect(page).toHaveURL('https://localhost:3000/login?logout=true');
    await expect(page).toHaveScreenshot('logout.png', screenshotConfig);
  });
});
