/* @flow */
import React from 'react';
import { CondControl as ConditionButton } from '../../../components/controls';
import { hasPermission } from '../../../helpers/user';

type Props = {
  perms: Array<string>,
  reqPerms: Array<string>,
}

const PermControl: Function = ({ perms, reqPerms, ...other }: Props): React.Element<any> => (
  <ConditionButton condition={ () => hasPermission(perms, reqPerms, 'or') } {...other} />
);

export default PermControl;
