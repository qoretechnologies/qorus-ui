// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';

type Props = {
  title: string,
  active: boolean,
  onClick: Function,
  handleClick: Function,
  compact: boolean,
  fontSize: number,
};

const MAX_TITLE_LEN: number = 8;
const TITLE_BASE_SIZE: number = 16;

const CrumbTab: Function = ({
  title,
  active,
  handleClick,
  compact,
  fontSize,
}: Props): React.Element<any> => (
  <div
    className={classnames('breadcrumb-tab', { active, compact })}
    onClick={handleClick}
    style={{ fontSize }}
  >
    {title} {compact && <Icon iconName="caret-down" />}
  </div>
);

export default compose(
  withHandlers({
    handleClick: ({ title, active, onClick }): Function => (): any =>
      active ? null : onClick ? onClick(title.toLowerCase()) : null,
  }),
  mapProps(
    ({ title, ...rest }): Props => ({
      fontSize:
        title.length > MAX_TITLE_LEN
          ? TITLE_BASE_SIZE - (title.length - MAX_TITLE_LEN) / 1.5
          : TITLE_BASE_SIZE,
      title,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['title', 'active'])
)(CrumbTab);
