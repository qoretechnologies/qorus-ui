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
import { orderStatsPctColor } from '../../../helpers/orders';
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
  totalOrderStats,
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
              const { count, pct } = workflow.order_stats
                .find(stat => stat.label === band.replace(/ /g, '_'))
                .l.find(bandData => bandData.disposition === disposition);

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
    ({ workflows, band, ...rest }: Props): Props => ({
      workflows: workflows.filter((workflow: Object) => workflow.order_stats),
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, disposition, band, ...rest }: Props): Props => ({
      workflows: workflows.filter(({ order_stats }) => {
        const currentBand: ?Object = order_stats.find(
          (stat: Object): boolean => stat.label === band.replace(/ /g, '_')
        );

        if (!currentBand) {
          return false;
        }

        const dispo: ?Object = currentBand.l.find(
          (bandData: Object): boolean => bandData.disposition === disposition
        );

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
