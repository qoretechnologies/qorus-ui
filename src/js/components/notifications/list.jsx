/* @flow */
import React from 'react';
import { Link } from 'react-router';

import { getAlertObjectLink } from '../../helpers/system';
import PaneItem from '../pane_item';
import Box from '../box';
import NoDataIf from '../NoDataIf';
import Container from '../container';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import moment from 'moment';

type Props = {
  collection: Array<Object>,
  paneTab: string,
};

const NotificationList: Function = ({ collection }: Props) => (
  <NoDataIf condition={collection.length === 0}>
    {() => (
      <Container>
        {collection.map((alert: Object, index: number) => (
          <Box top={index === 0}>
            <PaneItem
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
          </Box>
        ))}
      </Container>
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
