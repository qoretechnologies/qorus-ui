/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import CodeItem from './item';
import NoData from '../nodata';
import ExpandableItem from '../ExpandableItem';

type Props = {
  name: string,
  onToggleClick: Function,
  open: boolean,
  items: Array<Object>,
  onItemClick: Function,
  selected: Object,
};

const CodeSection: Function = ({
  name,
  items,
  onItemClick,
  selected,
}: Props): React.Element<any> => (
  <ExpandableItem title={name.toUpperCase()} show={items.length > 0}>
    {() => (
      <div className="code-section__list">
        <div className="code-section__inner">
          {items.length ? (
            items.map(
              (item: Object, index: number): React.Element<any> => (
                <CodeItem
                  type={name}
                  key={`${index}_${name}_${item.name}`}
                  item={item}
                  onClick={onItemClick}
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
