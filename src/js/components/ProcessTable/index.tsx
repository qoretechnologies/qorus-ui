// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withProcessKill from '../../hocomponents/withProcessKill';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import Flex from '../Flex';
import NoDataIf from '../NoDataIf';
import PaneItem from '../pane_item';
import Tree from '../tree';

type ProcessTableProps = {
  model: any;
  handleKillClick: Function;
};

const ProcessTable: Function = ({
  model,
  handleKillClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ProcessTableProps) => (
  <NoDataIf
    // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
    condition={!model || !model.process}
    big
    content="This interface is not running under a process"
  >
    {() => (
      <Flex>
        <PaneItem
          title="Process Info"
          label={
            <ButtonGroup>
              <Button
                btnStyle="danger"
                icon="cross"
                onClick={() => {
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
                  handleKillClick(model.process.id);
                }}
              >
                Kill
              </Button>
            </ButtonGroup>
          }
        />
        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
        <Tree
          data={{
            // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
            ...model.process,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
            ...{ memory: model.process.priv_str },
          }}
        />
      </Flex>
    )}
  </NoDataIf>
);

export default compose(withProcessKill, onlyUpdateForKeys(['model']))(ProcessTable);
