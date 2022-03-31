/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import ExpandableItem from '../ExpandableItem';
import NoData from '../nodata';
import CodeItem from './item';

type Props = {
  name: string;
  onToggleClick: Function;
  open: boolean;
  items: Array<Object>;
  onItemClick: Function;
  selected: Object;
};

const CodeSection: Function = ({
  name,
  items,
  onItemClick,
  selected,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <ExpandableItem title={name.toUpperCase()} show={items.length > 0}>
    {() => (
      <div className="code-section__list">
        <div className="code-section__inner">
          {items.length ? (
            items.map(
              // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
              (item: Object, index: number): React.Element<any> => (
                <CodeItem
                  type={name}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                  key={`${index}_${name}_${item.name}`}
                  item={item}
                  onClick={onItemClick}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                  selected={selected ? selected.name : null}
                />
              )
            )
          ) : (
            <NoData />
          )}
        </div>
      </div>
    )}
  </ExpandableItem>
);

export default compose(pure(['open', 'items', 'selected']))(CodeSection);
