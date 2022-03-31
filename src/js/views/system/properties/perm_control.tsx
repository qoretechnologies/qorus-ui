/* @flow */
import React from 'react';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { CondControl as ConditionButton } from '../../../components/controls';
import { hasPermission } from '../../../helpers/user';

type Props = {
  perms: Array<string>;
  reqPerms: Array<string>;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const PermControl: Function = ({ perms, reqPerms, ...other }: Props) => (
  <ConditionButton condition={() => hasPermission(perms, reqPerms, 'or')} {...other} />
);

export default PermControl;
