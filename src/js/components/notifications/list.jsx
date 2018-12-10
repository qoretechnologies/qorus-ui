/* @flow */
import React from 'react';
import { Link } from 'react-router';

import { getAlertObjectLink } from '../../helpers/system';
import PaneItem from '../pane_item';
import Box from '../box';
import NoDataIf from '../NoDataIf';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import moment from 'moment';
import Flex from '../Flex';

type Props = {
  collection: Array<Object>,
  paneTab: string,
};

const NotificationList: Function = ({ collection }: Props) => (
  <NoDataIf condition={collection.length === 0} big inBox>
    {() => (
      <Box top scrollY>
        {collection.map((alert: Object, index: number) => (
          <PaneItem
            key={alert.notificationId}
            title={alert.alert}
            label={
              <div className="text-muted">
                {moment(alert.when)
                  .startOf('second')
                  .fromNow()}
              </div>
            }
          >
            <Link to={getAlertObjectLink(alert.type, alert)}>
              {alert.object}
            </Link>
            <div>
              <small>{alert.reason}</small>
            </div>
          </PaneItem>
        ))}
      </Box>
    )}
  </NoDataIf>
);

export default compose(
  mapProps(
    ({ collection, paneTab, ...rest }: Props): Props => ({
      collection:
        paneTab !== 'all'
          ? collection.filter(
              (alert: Object) => alert.notificationType === paneTab
            )
          : collection,
      paneTab,
      ...rest,
    })
  )
)(NotificationList);
