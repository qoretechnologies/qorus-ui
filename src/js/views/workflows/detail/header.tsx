// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Search from '../../../containers/search';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import showIfPassed from '../../../hocomponents/show-if-passed';
import { countConfigItems } from '../../../utils';
import WorkflowAutostart from '../autostart';
import WorkflowControls from '../controls';

type Props = {
  setAutostart: Function;
  date: string;
  onSearch: Function;
  handleAlertClick: Function;
  searchQuery?: string;
  tab: string;
  workflow: any;
};

const WorkflowHeader: Function = ({
  workflow,
  onSearch,
  searchQuery,
  tab,
  handleAlertClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Breadcrumbs>
    <Crumb link="/workflows">
      {' '}
      <FormattedMessage id="Workflows" />{' '}
    </Crumb>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message */}
    <Crumb>{workflow.normalizedName}</Crumb>
    <CrumbTabs
      tabs={[
        'Orders',
        {
          title: 'Config',
          suffix: `(${countConfigItems({
            ...rebuildConfigHash(workflow, true),
          })})`,
        },
        'Performance',
        'Steps',
        'Order Stats',
        'Process',
        'Releases',
        {
          title: 'Valuemaps',
          // @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
          suffix: `(${size(workflow.vmaps)})`,
        },
        {
          title: 'Mappers',
          // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
          suffix: `(${size(workflow.mappers)})`,
        },
        'Errors',
        'Code',
        'Log',
        'Info',
      ]}
    />
    <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'hasAlerts' does not exist on type 'Objec... Remove this comment to see the full error message */}
      {workflow.hasAlerts && (
        <ButtonGroup>
          <Button
            big
            icon="error"
            btnStyle="danger"
            onClick={handleAlertClick}
            title="This workflow has alerts raised against it which may prevent it from working properly"
          >
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'alerts' does not exist on type 'Object'. */}
            {workflow.alerts.length}
          </Button>
        </ButtonGroup>
      )}
      <WorkflowControls
        big
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        id={workflow.id}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
        enabled={workflow.enabled}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
        remote={workflow.remote}
      />
      <WorkflowAutostart
        big
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        id={workflow.id}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'autostart' does not exist on type 'Objec... Remove this comment to see the full error message
        autostart={workflow.autostart}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'exec_count' does not exist on type 'Obje... Remove this comment to see the full error message
        execCount={workflow.exec_count}
        withExec
      />
      {tab === 'orders' && (
        <Search defaultValue={searchQuery} onSearchUpdate={onSearch} resource="workflow" />
      )}
    </ReqoreControlGroup>
  </Breadcrumbs>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ workflow }) => workflow),
  withRouter,
  withHandlers({
    handleAlertClick:
      ({ router, date, workflow }): Function =>
      (): void => {
        router.push(`/workflows?date=${date}&paneTab=detail&paneId=${workflow.id}`);
      },
  }),
  pure(['workflow', '_updated', 'location', 'tab'])
)(WorkflowHeader);
