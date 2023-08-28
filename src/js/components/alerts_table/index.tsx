/* @flow */
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import { ReqoreCollection } from '@qoretechnologies/reqore';
import { noop } from 'lodash';
import { injectIntl } from 'react-intl';

const AlertsTab = ({
  alerts,
  noTag,
  title,
  intl,
}: {
  alerts: Array<any>;
  noTag: boolean;
  title: string;
  intl: any;
}) => {
  return (
    <ReqoreCollection
      label={title || intl.formatMessage({ id: 'component.alerts' })}
      filterable
      zoomable
      maxItemHeight={200}
      items={alerts.map((item) => ({
        label: item.alert,
        icon: 'ErrorWarningLine',
        size: 'small',
        content: item.reason,
        flat: false,
        minimal: false,
        badge: item.alertid,
        as: noTag ? undefined : Link,
        expandable: noTag,
        onClick: noTag ? noop : undefined,
        intent: 'danger',
        iconColor: 'danger',
        to: noTag
          ? undefined
          : `/system/alerts?tab=${item.alerttype.toLowerCase()}&paneId=${item.alertid}`,
      }))}
    />
  );
};

export default compose(pure(['alerts']), injectIntl)(AlertsTab);
