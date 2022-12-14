// @flow
import { ProgressBar } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import Box from '../../../components/box';
import Modal from '../../../components/modal';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import { orderStatsPctColorDisp } from '../../../helpers/orders';
import sync from '../../../hocomponents/sync';
import actions from '../../../store/api/actions';

type Props = {
  onClose: Function;
  text: string;
  band: string;
  disposition: string;
  workflows: Array<Object>;
};

const StatsModal: Function = ({ onClose, text, band, workflows, disposition }: Props) => (
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
            {workflows.map((workflow: any) => {
              // @ts-ignore ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
              const { count, pct } = workflow.order_stats
                .find((stat) => stat.label === band.replace(/ /g, '_'))
                .l.find((bandData) => bandData.disposition === disposition);

              return (
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                <Tr key={workflow.id}>
                  <Td className="name">
                    <Link
                      to={`/workflows?paneId=${
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                        workflow.id
                      }&paneTab=order+stats`}
                      onClick={onClose}
                    >
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message */}
                      {workflow.normalizedName}
                    </Link>
                  </Td>
                  <Td className="text">{text}</Td>
                  <Td className="normal">{count}</Td>
                  <Td className="big">
                    {Math.round(pct)}%{' '}
                    <ProgressBar
                      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
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
    (state) => ({
      meta: state.api.workflows,
      workflows: state.api.workflows.data,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      load: actions.workflows.fetch,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      fetch: actions.workflows.fetch,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      unsync: actions.workflows.unsync,
    }
  ),
  sync('meta'),
  mapProps(
    ({ workflows, band, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
      workflows: workflows.filter((workflow: any) => workflow.order_stats),
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, disposition, band, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
      workflows: workflows.filter(({ order_stats }) => {
        // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
        const currentBand: any = order_stats.find(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
          (stat: any): boolean => stat.label === band.replace(/ /g, '_')
        );

        if (!currentBand) {
          return false;
        }

        // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
        const dispo: any = currentBand.l.find(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'disposition' does not exist on type 'Obj... Remove this comment to see the full error message
          (bandData: any): boolean => bandData.disposition === disposition
        );

        // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'Object'.
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
