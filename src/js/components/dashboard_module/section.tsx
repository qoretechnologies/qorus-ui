// @flow
import React from 'react';
import withHandlers from 'recompose/withHandlers';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';

import Icon from '../../components/icon';

type Props = {
  icon?: string,
  children?: string,
  link?: string,
  handleClick: Function,
  router: Object,
  title?: string,
};

const DashboardSection: Function = ({
  icon,
  children,
  link,
  handleClick,
  title,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
  <div className="subtitle" title={title} onClick={link ? handleClick : null}>
    {icon && <Icon icon={icon} />} {children}{' '}
    {link && <Icon icon="angle-right" />}
  </div>
);

export default compose(
  withRouter,
  withHandlers({
    handleClick: ({ router, link }: Props): Function => (): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type 'Object'.
      if (link) router.push(link);
    },
  })
)(DashboardSection);
