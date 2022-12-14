/* @flow */
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
import { getAlertObjectLink } from '../../helpers/system';
import Box from '../box';
import NoDataIf from '../NoDataIf';
import PaneItem from '../pane_item';

type Props = {
  collection: Array<Object>;
  paneTab: string;
};

let NotificationTime = ({ time }) => (
  <div className="text-muted">{moment(time).startOf('second').from(moment())}</div>
);

NotificationTime = compose(
  withState('timeInt', 'setTimeInt', 0),
  lifecycle({
    componentDidMount() {
      const { setTimeInt } = this.props;
      // Create an interval and update the time state
      setInterval(() => {
        setTimeInt(() => Date.now());
      }, 60000);
    },
  })
)(NotificationTime);

const NotificationList: Function = ({ collection }: Props) => (
  <NoDataIf condition={collection.length === 0} big inBox>
    {() => (
      <Box top scrollY>
        {collection.map((alert: any, index: number) => (
          <PaneItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'notificationId' does not exist on type '... Remove this comment to see the full error message
            key={alert.notificationId}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
            title={alert.alert}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'when' does not exist on type 'Object'.
            label={<NotificationTime time={alert.when} />}
          >
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
            <Link to={getAlertObjectLink(alert.type, alert)}>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'object' does not exist on type 'Object'. */}
              {alert.object}
            </Link>
            <div>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'Object'. */}
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
              // @ts-ignore ts-migrate(2339) FIXME: Property 'notificationType' does not exist on type... Remove this comment to see the full error message
              (alert: any) => alert.notificationType === paneTab
            )
          : collection,
      paneTab,
      ...rest,
    })
  )
)(NotificationList);
