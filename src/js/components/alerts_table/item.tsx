// @flow
import classnames from 'classnames';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import { getLineCount } from '../../helpers/system';
import InterfaceTag from '../InterfaceTag';

type AlertsTableItemProps = {
  item: any;
  handleExpandClick: () => void;
  expanded: boolean;
  noTag?: boolean;
  isExpandable: boolean;
};

const AlertsTableItem: Function = ({
  item,
  expanded,
  isExpandable,
  handleExpandClick,
  noTag,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
AlertsTableItemProps) => (
  <div className="alerts-table-item">
    {!noTag && (
      <InterfaceTag
        // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
        title={item.alert}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'alerttype' does not exist on type 'Objec... Remove this comment to see the full error message
        link={`/system/alerts?tab=${item.alerttype.toLowerCase()}&paneId=${
          // @ts-ignore ts-migrate(2339) FIXME: Property 'alertid' does not exist on type 'Object'... Remove this comment to see the full error message
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
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'Object'. */}
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
  // @ts-ignore ts-migrate(2749) FIXME: 'AlertsTableItem' refers to a value, but is being ... Remove this comment to see the full error message
  mapProps(({ item, ...rest }: AlertsTableItem) => ({
    isExpandable: getLineCount(item.reason) > 3,
    item,
    ...rest,
  })),
  withState('expanded', 'changeExpanded', ({ isExpandable }) => !isExpandable),
  withHandlers({
    handleExpandClick:
      ({ changeExpanded }): Function =>
      (): void => {
        changeExpanded((expanded) => !expanded);
      },
  })
)(AlertsTableItem);
