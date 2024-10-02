// @flow
import size from 'lodash/size';
import { Component } from 'react';
import { Breadcrumbs, CollapsedCrumb, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import { normalizeName } from '../../components/utils';
import { ALL_ORDER_STATES } from '../../constants/orders';
import { rebuildConfigHash } from '../../helpers/interfaces';
import queryControl from '../../hocomponents/queryControl';
import { countConfigItems } from '../../utils';
import OrderControls from '../workflows/tabs/list/controls';
import Lock from '../workflows/tabs/list/lock';
import { StatusLabel } from '../workflows/tabs/list/row';

// @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
@queryControl('target')
// @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
@queryControl('prevQuery')
export default class OrderHeader extends Component {
  props: {
    data: any;
    workflow: any;
    username: string;
    linkDate: string;
    targetQuery: string;
    prevQueryQuery: string;
  } = this.props;

  render() {
    const { prevQueryQuery, targetQuery, workflow, data } = this.props;

    const target = targetQuery
      ? `${targetQuery}?`
      : // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        `/workflow/${workflow.id}?tab=orders`;

    const backQueriesObj = prevQueryQuery
      ? JSON.parse(JSON.parse(this.props.prevQueryQuery))
      : null;

    let backQueriesStr = target;

    if (backQueriesObj) {
      backQueriesStr = Object.keys(backQueriesObj).reduce((cur, next, index) => {
        const last = index === Object.keys(backQueriesObj).length - 1;

        return `${cur}${next}=${backQueriesObj[next]}${last ? '' : '&'}`;
      }, target);
    }

    const workflowName: string = normalizeName(this.props.workflow);
    const label = ALL_ORDER_STATES.find(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      (state: any): boolean => state.name === this.props.data.workflowstatus
    ).label;

    return (
      <Headbar>
        <Breadcrumbs>
          <CollapsedCrumb links={{ Workflows: '/workflows' }} />
          <Crumb link={encodeURI(backQueriesStr)}>
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'. */}
            {workflowName} <strong>#{this.props.data.id}</strong>{' '}
            <StatusLabel text={this.props.data.workflowstatus} label={label} />
          </Crumb>
          <CrumbTabs
            tabs={[
              'Overview',
              {
                title: 'Config',
                suffix: `(${countConfigItems({
                  ...rebuildConfigHash(this.props.workflow, true),
                })})`,
              },
              // @ts-ignore ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
              { title: 'Steps', suffix: `(${size(data.StepInstances)})` },
              'Data',
              // @ts-ignore ts-migrate(2339) FIXME: Property 'ErrorInstances' does not exist on type '... Remove this comment to see the full error message
              { title: 'Errors', suffix: `(${size(data.ErrorInstances)})` },
              // @ts-ignore ts-migrate(2339) FIXME: Property 'HierarchyInfo' does not exist on type 'O... Remove this comment to see the full error message
              { title: 'Hierarchy', suffix: `(${size(data.HierarchyInfo)})` },
              // @ts-ignore ts-migrate(2339) FIXME: Property 'AuditEvents' does not exist on type 'Obj... Remove this comment to see the full error message
              { title: 'Audit', suffix: `(${size(data.AuditEvents)})` },
              {
                title: 'Mappers',
                // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
                suffix: `(${size(this.props.workflow.mappers)})`,
              },
              'Info',
              // @ts-ignore ts-migrate(2339) FIXME: Property 'notes' does not exist on type 'Object'.
              { title: 'Notes', suffix: `(${size(data.notes)})` },
              'Log',
              'Code',
            ]}
          />
        </Breadcrumbs>
        <Pull right>
          <OrderControls
            // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
            id={this.props.data.id}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'workflowstatus' does not exist on type '... Remove this comment to see the full error message
            workflowstatus={this.props.data.workflowstatus}
          />
          <Lock
            // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
            id={this.props.data.id}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'operator_lock' does not exist on type 'O... Remove this comment to see the full error message
            lock={this.props.data.operator_lock}
            big
          />
        </Pull>
      </Headbar>
    );
  }
}
