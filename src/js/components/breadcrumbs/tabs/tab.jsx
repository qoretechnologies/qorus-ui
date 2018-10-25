// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  title: string,
  active: boolean,
  onClick: Function,
  handleClick: Function,
};

const CrumbTab: Function = ({
  title,
  active,
  handleClick,
}: Props): React.Element<any> => (
  <div
    className={classnames('breadcrumb-tab', { active })}
    onClick={handleClick}
  >
    {title}
  </div>
);

export default compose(
  withHandlers({
    handleClick: ({ title, active, onClick }): Function => (): any =>
      active ? null : onClick(title.toLowerCase()),
  }),
  onlyUpdateForKeys(['title', 'active'])
)(CrumbTab);
