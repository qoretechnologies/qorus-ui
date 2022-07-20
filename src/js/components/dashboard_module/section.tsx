// @flow
import React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import Icon from '../../components/icon';

type Props = {
  icon?: string;
  children?: string;
  link?: string;
  handleClick: Function;
  router: any;
  title?: string;
};

const DashboardSection: Function = ({
  icon,
  children,
  link,
  handleClick,
  title,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
  <div className="subtitle" title={title} onClick={link ? handleClick : null}>
    {icon && <Icon icon={icon} />} {children} {link && <Icon icon="angle-right" />}
  </div>
);

export default compose(
  withRouter,
  withHandlers({
    handleClick:
      ({ router, link }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'push' does not exist on type 'Object'.
        if (link) router.push(link);
      },
  })
)(DashboardSection);
