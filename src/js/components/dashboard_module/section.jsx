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
}: Props): React.Element<any> => (
  <div className="subtitle" title={title} onClick={link ? handleClick : null}>
    {icon && <Icon iconName={icon} />} {children}{' '}
    {link && <Icon iconName="angle-right" />}
  </div>
);

export default compose(
  withRouter,
  withHandlers({
    handleClick: ({ router, link }: Props): Function => (): void => {
      if (link) router.push(link);
    },
  })
)(DashboardSection);
