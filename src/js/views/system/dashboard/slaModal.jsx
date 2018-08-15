// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router';

import Modal from '../../../components/modal';
import { Table, Thead, Tbody, Th, Tr, Td } from '../../../components/new_table';
import { connect } from '../../../../../node_modules/react-redux';
import actions from '../../../store/api/actions';
import sync from '../../../hocomponents/sync';
import mapProps from '../../../../../node_modules/recompose/mapProps';
import { ProgressBar } from '../../../../../node_modules/@blueprintjs/core';
import { orderStatsPctColor } from '../../../helpers/orders';
import Box from '../../../components/box';

type Props = {
  onClose: Function,
  text: string,
  band: string,
  in_sla: string,
  workflows: Array<Object>,
};

const StatsModal: Function = ({
  onClose,
  text,
  band,
  workflows,
  in_sla,
}: Props) => (
  <Modal width={700}>
    <Modal.Header titleId="slamodal" onClose={onClose}>
      {text} for {band}
    </Modal.Header>
    <Modal.Body>
      <Box noPadding top>
        <Table condensed striped height={400}>
          <Thead>
            <Tr>
              <Th className="name">Name</Th>
              <Th className="text">In SLA</Th>
              <Th className="normal">Count</Th>
              <Th className="big">Percentage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {workflows.map((workflow: Object) => {
              const { count, pct } = workflow.order_stats
                .find(stat => stat.label === band.replace(/ /g, '_'))
                .sla.find(slaData => slaData.in_sla === in_sla);

              return (
                <Tr key={workflow.id}>
                  <Td className="name">
                    <Link
                      to={`/workflows?paneId=${
                        workflow.id
                      }&paneTab=order+stats`}
                      onClick={onClose}
                    >
                      {workflow.normalizedName}
                    </Link>
                  </Td>
                  <Td className="text">{text}</Td>
                  <Td className="normal">{count}</Td>
                  <Td className="big">
                    {Math.round(pct)}%{' '}
                    <ProgressBar
                      intent={orderStatsPctColor(pct)}
                      value={Math.round(pct) / 100}
                      className="pt-no-animation"
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
      load: actions.workflows.fetch,
      fetch: actions.workflows.fetch,
      unsync: actions.workflows.unsync,
    }
  ),
  sync('meta'),
  mapProps(
    ({ workflows, ...rest }: Props): Props => ({
      workflows: workflows.filter((workflow: Object) => workflow.order_stats),
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, in_sla, band, ...rest }: Props): Props => ({
      workflows: workflows.filter(({ order_stats }) => {
        const currentBand: ?Object = order_stats.find(
          (stat: Object): boolean => stat.label === band.replace(/ /g, '_')
        );

        if (!currentBand) {
          return false;
        }

        const sla: ?Object = currentBand.sla.find(
          (slaData: Object): boolean => slaData.in_sla === in_sla
        );

        if (sla && sla.count !== 0) {
          return true;
        }

        return false;
      }),
      in_sla,
      band,
      ...rest,
    })
  )
)(StatsModal);
