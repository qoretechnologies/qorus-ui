// @flow
import { Icon } from '@blueprintjs/core';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { buildPageLinkWithQueries } from '../../../helpers/router';

type Props = {
  title: string;
  tabId: string;
  active: boolean;
  onClick: Function;
  handleClick: Function;
  compact: boolean;
  fontSize: number;
  local?: boolean;
  queryIdentifier: string;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <div
    className={classnames('breadcrumb-tab', { active, compact })}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
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
    handleClick:
      ({ tabId, active, onClick, local }): Function =>
      (): any => {
        if (!active && local && onClick) {
          onClick(tabId.toLowerCase());
        }
      },
  }),
  mapProps(
    // @ts-ignore ts-migrate(2740) FIXME: Type '{ fontSize: number; title: any; }' is missin... Remove this comment to see the full error message
    ({ title, ...rest }): Props => ({
      fontSize: TITLE_BASE_SIZE,
      title,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['title', 'active'])
)(CrumbTab);
