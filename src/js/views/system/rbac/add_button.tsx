/* @flow */
import React from 'react';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button } from '../../../components/controls';
import showIfPassed from '../../../hocomponents/show-if-passed';
import { hasPermission } from '../../../helpers/user';

type Props = {
  onClick: Function,
  perms: Array<string>,
  reqPerms: Array<string>,
  title: string,
}

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const AddButton: Function = ({ onClick, title }: Props): React.Element<any> => (
  <Button
    big
    action={onClick}
    btnStyle="success"
    label={title}
    icon="plus"
  />
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default showIfPassed(props => hasPermission(props.perms, props.reqPerms, 'or'))(AddButton);
