// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import Alert from '../../../components/alert';
import Box from '../../../components/box';
import Pane from '../../../components/pane';
import PaneItem from '../../../components/pane_item';
import Tree from '../../../components/tree';
import titleManager from '../../../hocomponents/TitleManager';

type Props = {
  onClose: Function;
  processes: any;
  paneId: string;
  process?: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  urls: Array<string>;
};

const ClusterPane: Function = ({
  onClose,
  urls,
  process,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Pane onClose={onClose} width={600} title="Node item detail">
    <Box top>
      {process ? (
        <PaneItem title={process}>
          {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
          <Tree data={urls} />
        </PaneItem>
      ) : (
        <Alert bsStyle="danger"> Process not found! </Alert>
      )}
    </Box>
  </Pane>
);

export default compose(
  mapProps(
    ({ processes, paneId, ...rest }: Props): Props => ({
      process: Object.keys(processes).find(
        (process: string): boolean => processes[process].id === paneId
      ),
      processes,
      paneId,
      ...rest,
    })
  ),
  mapProps(
    ({ process, processes, ...rest }: Props): Props => ({
      urls: process ? processes[process].urls : null,
      processes,
      process,
      ...rest,
    })
  ),
  // @ts-ignore ts-migrate(2345) FIXME: Argument of type '({ process }: Props) => string' ... Remove this comment to see the full error message
  titleManager(({ process }: Props): string => process, 'Cluster', 'prefix'),
  pure(['processes', 'paneId'])
)(ClusterPane);
