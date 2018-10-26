// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';

type Props = {
  title: string,
  active: boolean,
  onClick: Function,
  handleClick: Function,
  compact: boolean,
};

const CrumbTab: Function = ({
  title,
  active,
  handleClick,
  compact,
}: Props): React.Element<any> => (
  <div
    className={classnames('breadcrumb-tab', { active, compact })}
    onClick={handleClick}
  >
    {title} {compact && <Icon iconName="caret-down" />}
  </div>
);

export default compose(
  withHandlers({
    handleClick: ({ title, active, onClick }): Function => (): any =>
      active ? null : onClick(title.toLowerCase()),
  }),
  onlyUpdateForKeys(['title', 'active'])
)(CrumbTab);
