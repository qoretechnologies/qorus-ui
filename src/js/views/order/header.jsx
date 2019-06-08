// @flow
import React, { Component } from 'react';
import size from 'lodash/size';

import OrderControls from '../workflows/tabs/list/controls';
import Lock from '../workflows/tabs/list/lock';
import queryControl from '../../hocomponents/queryControl';
import {
  Breadcrumbs,
  Crumb,
  CrumbTabs,
  CollapsedCrumb,
} from '../../components/breadcrumbs';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import { normalizeName } from '../../components/utils';
import { ALL_ORDER_STATES } from '../../constants/orders';
import { rebuildConfigHash } from '../../helpers/interfaces';
import { countArrayItemsInObject, countConfigItems } from '../../utils';

@queryControl('target')
@queryControl('prevQuery')
export default class OrderHeader extends Component {
  props: {
    data: Object,
    workflow: Object,
    username: string,
    linkDate: string,
    targetQuery: string,
    prevQueryQuery: string,
  } = this.props;

  render () {
    const { prevQueryQuery, targetQuery, workflow, data } = this.props;

    const target = targetQuery
      ? `${targetQuery}?`
      : `/workflow/${workflow.id}?tab=orders`;

    const backQueriesObj = prevQueryQuery
      ? JSON.parse(JSON.parse(this.props.prevQueryQuery))
      : null;

    let backQueriesStr = target;

    if (backQueriesObj) {
      backQueriesStr = Object.keys(backQueriesObj).reduce(
        (cur, next, index) => {
          const last = index === Object.keys(backQueriesObj).length - 1;

          return `${cur}${next}=${backQueriesObj[next]}${last ? '' : '&'}`;
        },
        target
      );
    }

    const workflowName: string = normalizeName(this.props.workflow);
    const label = ALL_ORDER_STATES.find(
      (state: Object): boolean => state.name === this.props.data.workflowstatus
    ).label;

    return (
      <Headbar>
        <Breadcrumbs>
          <CollapsedCrumb links={{ Workflows: '/workflows' }} />
          <Crumb link={backQueriesStr}>
            {workflowName} <strong>#{this.props.data.id}</strong>{' '}
            <span className={`label status-${label}`}>
              {this.props.data.workflowstatus}
            </span>
          </Crumb>
          <CrumbTabs
            tabs={[
              'Overview',
              { title: 'Steps', suffix: `(${size(data.StepInstances)})` },
              'Data',
              { title: 'Errors', suffix: `(${size(data.ErrorInstances)})` },
              { title: 'Hierarchy', suffix: `(${size(data.HierarchyInfo)})` },
              { title: 'Audit', suffix: `(${size(data.AuditEvents)})` },
              {
                title: 'Config',
                suffix: `(${countConfigItems({
                  ...rebuildConfigHash(this.props.workflow, true),
                })})`,
              },
              'Mappers',
              'Info',
              { title: 'Notes', suffix: `(${size(data.notes)})` },
              'Log',
              'Code',
            ]}
          />
        </Breadcrumbs>
        <Pull right>
          <OrderControls
            id={this.props.data.id}
            workflowstatus={this.props.data.workflowstatus}
          />
          <Lock
            id={this.props.data.id}
            lock={this.props.data.operator_lock}
            big
          />
        </Pull>
      </Headbar>
    );
  }
}
