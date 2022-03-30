// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router';

import Modal from '../../../components/modal';
import {
  Table,
  Thead,
  Tbody,
  Th,
  FixedRow,
  Tr,
  Td,
} from '../../../components/new_table';
import { connect } from '../../../../../node_modules/react-redux';
import actions from '../../../store/api/actions';
import sync from '../../../hocomponents/sync';
import mapProps from '../../../../../node_modules/recompose/mapProps';
import { ProgressBar } from '../../../../../node_modules/@blueprintjs/core';
import { orderStatsPctColorDisp } from '../../../helpers/orders';
import Box from '../../../components/box';
import unsync from '../../../hocomponents/unsync';

type Props = {
  onClose: Function,
  text: string,
  band: string,
  disposition: string,
  workflows: Array<Object>,
};

const StatsModal: Function = ({
  onClose,
  text,
  band,
  workflows,
  disposition,
}: Props) => (
  <Modal width={700}>
    <Modal.Header title="statsmodal" onClose={onClose}>
      {text} for {band}
    </Modal.Header>
    <Modal.Body>
      <Box noPadding top>
        <Table condensed striped height={400}>
          <Thead>
            <Tr>
              <Th className="name">Name</Th>
              <Th className="text">Disposition</Th>
              <Th className="normal">Count</Th>
              <Th className="big">Percentage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {workflows.map((workflow: Object) => {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
              const { count, pct } = workflow.order_stats
                .find(stat => stat.label === band.replace(/ /g, '_'))
                .l.find(bandData => bandData.disposition === disposition);

              return (
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                <Tr key={workflow.id}>
                  <Td className="name">
                    <Link
                      to={`/workflows?paneId=${
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                        workflow.id
                      }&paneTab=order+stats`}
                      onClick={onClose}
                    >
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message
                      {workflow.normalizedName}
                    </Link>
                  </Td>
                  <Td className="text">{text}</Td>
                  <Td className="normal">{count}</Td>
                  <Td className="big">
                    {Math.round(pct)}%{' '}
                    <ProgressBar
                      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
                      intent={orderStatsPctColorDisp(disposition)}
                      value={Math.round(pct) / 100}
                      className={`bp3-no-animation ${
                        disposition === 'A' ? 'progress-bar-auto' : ''
                      }`}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Modal.Body>
  </Modal>
);

export default compose(
  connect(
    state => ({
      meta: state.api.workflows,
      workflows: state.api.workflows.data,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      load: actions.workflows.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      fetch: actions.workflows.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      unsync: actions.workflows.unsync,
    }
  ),
  sync('meta'),
  mapProps(
    ({ workflows, band, ...rest }: Props): Props => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
      workflows: workflows.filter((workflow: Object) => workflow.order_stats),
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, disposition, band, ...rest }: Props): Props => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
      workflows: workflows.filter(({ order_stats }) => {
        // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
        const currentBand: ?Object = order_stats.find(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
          (stat: Object): boolean => stat.label === band.replace(/ /g, '_')
        );

        if (!currentBand) {
          return false;
        }

        // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
        const dispo: ?Object = currentBand.l.find(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'disposition' does not exist on type 'Obj... Remove this comment to see the full error message
          (bandData: Object): boolean => bandData.disposition === disposition
        );

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'count' does not exist on type 'Object'.
        if (dispo && dispo.count !== 0) {
          return true;
        }

        return false;
      }),
      disposition,
      band,
      ...rest,
    })
  )
)(StatsModal);
