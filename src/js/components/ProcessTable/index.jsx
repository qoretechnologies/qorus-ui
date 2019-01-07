// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import NoDataIf from '../NoDataIf';
import Tree from '../tree';
import PaneItem from '../pane_item';
import { Controls as ButtonGroup, Control as Button } from '../controls';
import withProcessKill from '../../hocomponents/withProcessKill';

type ProcessTableProps = {
  model: Object,
  handleKillClick: Function,
};

const ProcessTable: Function = ({
  model,
  handleKillClick,
}: ProcessTableProps): React.Element<any> => (
  <NoDataIf
    condition={!model || !model.process}
    big
    content="This interface is not running under a process"
  >
    {() => (
      <PaneItem
        title="Process Info"
        label={
          <ButtonGroup>
            <Button
              btnStyle="danger"
              icon="cross"
              onClick={() => {
                handleKillClick(model.process.id);
              }}
            >
              Kill
            </Button>
          </ButtonGroup>
        }
      >
        <Tree
          data={{
            ...model.process,
            ...{ memory: model.process.priv_str },
          }}
        />
      </PaneItem>
    )}
  </NoDataIf>
);

export default compose(
  withProcessKill,
  onlyUpdateForKeys(['model'])
)(ProcessTable);
