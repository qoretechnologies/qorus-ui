// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Intent } from '@blueprintjs/core';

import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import { injectIntl } from 'react-intl';

type Props = {
  enabled: boolean,
  name: string,
  dispatchAction: Function,
  handleEnableClick: Function,
  big?: boolean,
};

const GroupsControls: Function = ({
  enabled,
  handleEnableClick,
  big,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Button
      title={intl.formatMessage({ id: (enabled ? 'button.disable' : 'button.enable') })}
      icon="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleEnableClick}
      big={big}
    />
  </ButtonGroup>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleEnableClick: ({
      enabled,
      name,
      dispatchAction,
    }: Props): Function => (): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
      dispatchAction(actions.groups.groupAction, name, !enabled);
    },
  }),
  pure(['enabled']),
  injectIntl
)(GroupsControls);
