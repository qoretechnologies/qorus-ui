/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import NoData from '../nodata';
import { normalizeName } from '../utils';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import { Tag } from '@blueprintjs/core';

type Props = {
  type: string,
  item: Object,
  onClick: Function,
  selected: string,
};

let Item: Function = ({
  item,
  onClick,
  selected,
  type,
}: Props): React.Element<any> => {
  const newItem = normalizeUnknownId(item);

  const handleClick: Function = (): void => {
    onClick(newItem.name, newItem.body, type, newItem.id, newItem);
  };

  const isSelected: boolean = selected === newItem.name;

  return (
    <div
      onClick={handleClick}
      className={classNames('code-item', { selected: isSelected })}
    >
      {newItem.type && <Tag className="pt-minimal">{newItem.type}</Tag>}
      <p>{normalizeName(newItem)}</p>
    </div>
  );
};

Item = compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      const name = this.props.item.name;

      return nextProps.selected === name || this.props.selected === name;
    },
  })
)(Item);

const CodeItem: Function = ({
  item,
  onClick,
  selected,
  type,
}: Props): React.Element<any> => {
  if (item.body || (!item.functions && !item.class)) {
    return (
      <Item type={type} item={item} onClick={onClick} selected={selected} />
    );
  }

  return (
    <div>
      <p className="code-item-header">{item.name}</p>
      {item.functions ? (
        item.functions.map(
          (func: Object, index: number): React.Element<any> => (
            <Item
              type={type}
              key={`${type}_${item.name}_${index}`}
              item={func}
              onClick={onClick}
              selected={selected}
            />
          )
        )
      ) : item.class ? (
        <Item
          type="Class"
          key={`$class_${item.name}`}
          item={item.class}
          onClick={onClick}
          selected={selected}
        />
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default pure(['type', 'item', 'selected'])(CodeItem);
