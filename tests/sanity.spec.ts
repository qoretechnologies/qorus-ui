import { expect, Page, test } from '@playwright/test';

let page: Page;

/* A configuration object for the screenshot comparison. */
const screenshotConfig: any = {
  animations: 'disabled',
  fullPage: true,
  maxDiffPixelRatio: 0.05,
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

  test('Services page is visually identical', async () => {
    await page.goto('https://localhost:3000/services');
    await page.waitForSelector('#services-view');
    await expect(page).toHaveScreenshot('services.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=detail');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-detail.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=config');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-config.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=code');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-code.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=methods');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-methods.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=process');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-process.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=mappers');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-mappers.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=valuemaps');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-valuemaps.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=resources');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-resources.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=authlabels');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-authlabels.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=releases');
    await page.waitForSelector('.reqore-drawer');
    await expect(page).toHaveScreenshot('services-pane-releases.png', screenshotConfig);

    await page.goto('https://localhost:3000/services?paneId=1&paneTab=info');
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

  test('Connections page is visually identical', async () => {
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
  });

  test('Releases page is visually identical', async () => {
    await page.goto('https://localhost:3000/releases');
    await page.waitForSelector('#releases-view');
    await expect(page).toHaveScreenshot('releases.png', screenshotConfig);
  });

  test('Errors page is visually identical', async () => {
    await page.goto('https://localhost:3000/errors');
    await page.waitForSelector('#errors-view');
    await expect(page).toHaveScreenshot('errors.png', screenshotConfig);
  });

  test('Types page is visually identical', async () => {
    await page.goto('https://localhost:3000/types');
    await page.waitForSelector('#types-view');
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
    await expect(page).toHaveScreenshot('cluster.png', {
      ...screenshotConfig,
      maxDiffPixelRatio: 0.3,
      maxDiffPixels: undefined,
    });
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
  });

  test('Properties page is visually identical', async () => {
    await page.goto('https://localhost:3000/system/props');
    await page.waitForSelector('#properties-view');
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
  });

  test('Library page is visually identical', async () => {
    await page.goto('https://localhost:3000/library');
    await page.waitForSelector('#library-view');
    await expect(page).toHaveScreenshot('library.png', screenshotConfig);
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
});
