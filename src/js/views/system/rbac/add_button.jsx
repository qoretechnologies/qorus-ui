/* @flow */
import React from 'react';

import { Control as Button } from '../../../components/controls';
import showIfPassed from '../../../hocomponents/show-if-passed';
import { hasPermission } from '../../../helpers/user';

type Props = {
  onClick: Function,
  perms: Array<string>,
  reqPerms: Array<string>,
  title: string,
}

const AddButton: Function = ({ onClick, title }: Props): React.Element<any> => (
  <Button
    big
    action={onClick}
    btnStyle="success"
    label={title}
    iconName="plus"
  />
);

export default showIfPassed(props => hasPermission(props.perms, props.reqPerms, 'or'))(AddButton);
