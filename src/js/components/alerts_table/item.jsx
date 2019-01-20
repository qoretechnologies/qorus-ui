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
} from '../../components/controls';

type AlertsTableItemProps = {
  item: Object,
  handleExpandClick: () => void,
  expanded: boolean,
};

const AlertsTableItem: Function = ({
  item,
  expanded,
  isExpandable,
  handleExpandClick,
}: AlertsTableItemProps): React.Element<any> =>
  console.log(expanded) || (
    <div className="alerts-table-item">
      <InterfaceTag
        title={item.alert}
        link={`/system/alerts?tab=${item.alerttype.toLowerCase()}&paneId=${
          item.type
        }:${item.id}`}
        type="alert"
      />
      <div
        className={classnames('alerts-table-reason', {
          expanded,
          isExpandable,
        })}
      >
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
