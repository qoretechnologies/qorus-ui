// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import classnames from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';
import { Link } from 'react-router';
import { buildPageLinkWithQueries } from '../../../helpers/router';

type Props = {
  title: string,
  tabId: string,
  active: boolean,
  onClick: Function,
  handleClick: Function,
  compact: boolean,
  fontSize: number,
  local?: boolean,
  queryIdentifier: string,
};

const TITLE_BASE_SIZE: number = 16;

const CrumbTab: Function = ({
  title,
  active,
  handleClick,
  compact,
  fontSize,
  local,
  queryIdentifier,
  tabId,
}: Props): React.Element<any> => (
  <div
    className={classnames('breadcrumb-tab', { active, compact })}
    onClick={handleClick}
    style={{ fontSize }}
  >
    {compact ? (
      <React.Fragment>
        <a className="breadcrumbs-link non-decorated-link">
          {title} <Icon icon="caret-down" />
        </a>
      </React.Fragment>
    ) : (
      <React.Fragment>
        {local ? (
          title
        ) : (
          <Link
            to={buildPageLinkWithQueries(queryIdentifier, tabId)}
            className="non-decorated-link"
          >
            {title}
          </Link>
        )}
      </React.Fragment>
    )}
  </div>
);

export default compose(
  withHandlers({
    handleClick: ({ tabId, active, onClick, local }): Function => (): any => {
      if (!active && local && onClick) {
        onClick(tabId.toLowerCase());
      }
    },
  }),
  mapProps(
    ({ title, ...rest }): Props => ({
      fontSize: TITLE_BASE_SIZE,
      title,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['title', 'active'])
)(CrumbTab);
