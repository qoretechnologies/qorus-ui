// @flow
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import InterfaceTag from '../InterfaceTag';
import mapProps from 'recompose/mapProps';
import { getLineCount } from '../../helpers/system';
import classnames from 'classnames';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';

type AlertsTableItemProps = {
  item: Object,
  handleExpandClick: () => void,
  expanded: boolean,
  noTag?: boolean,
  isExpandable: boolean,
};

const AlertsTableItem: Function = ({
  item,
  expanded,
  isExpandable,
  handleExpandClick,
  noTag,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: AlertsTableItemProps): React.Element<any> => (
  <div className="alerts-table-item">
    {!noTag && (
      <InterfaceTag
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
        title={item.alert}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerttype' does not exist on type 'Objec... Remove this comment to see the full error message
        link={`/system/alerts?tab=${item.alerttype.toLowerCase()}&paneId=${
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'alertid' does not exist on type 'Object'... Remove this comment to see the full error message
          item.alertid
        }`}
        type="alert"
      />
    )}
    <div
      className={classnames('alerts-table-reason', {
        expanded,
        isExpandable,
      })}
    >
      { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'Object'. */ }
      {item.reason}
    </div>
    {isExpandable && (
      <ButtonGroup className="alerts-table-expander">
        <Button
          icon={expanded ? 'collapse-all' : 'expand-all'}
          label={expanded ? 'Collapse' : 'Expand'}
          onClick={handleExpandClick}
        />
      </ButtonGroup>
    )}
  </div>
);

export default compose(
  // @ts-expect-error ts-migrate(2749) FIXME: 'AlertsTableItem' refers to a value, but is being ... Remove this comment to see the full error message
  mapProps(({ item, ...rest }: AlertsTableItem) => ({
    isExpandable: getLineCount(item.reason) > 3,
    item,
    ...rest,
  })),
  withState('expanded', 'changeExpanded', ({ isExpandable }) => !isExpandable),
  withHandlers({
    handleExpandClick: ({ changeExpanded }): Function => (): void => {
      changeExpanded(expanded => !expanded);
    },
  }),
  onlyUpdateForKeys(['item', 'expanded'])
)(AlertsTableItem);
