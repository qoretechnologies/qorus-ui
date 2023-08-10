/* @flow */
import { Tag } from '@blueprintjs/core';
import classNames from 'classnames';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import NoData from '../nodata';
import { normalizeName } from '../utils';

type Props = {
  type: string;
  item: any;
  onClick: Function;
  selected: string;
};

let Item: Function = ({
  item,
  onClick,
  selected,
  type,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const newItem = normalizeUnknownId(item);

  const handleClick: Function = (): void => {
    onClick(
      `${newItem.name}${newItem.version}`,
      newItem.body || newItem.code,
      type,
      newItem.id,
      newItem
    );
  };
  const isSelected: boolean = selected === `${newItem.name}${newItem.version}`;

  return (
    <div
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
      onClick={handleClick}
      className={classNames('code-item', { selected: isSelected })}
    >
      {newItem.type && <Tag className="bp3-minimal">{newItem.type}</Tag>}
      <p>{normalizeName(newItem)}</p>
    </div>
  );
};

Item = compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      const name = `${this.props.item.name}${this.props.item.version}`;

      return nextProps.selected === name || this.props.selected === name;
    },
  })
)(Item);

const CodeItem: Function = ({
  item,
  onClick,
  selected,
  type,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
  if (item.code || item.body || (!item.functions && !item.class)) {
    return <Item type={type} item={item} onClick={onClick} selected={selected} />;
  }

  return (
    <div>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
      <p className="code-item-header">{item.name}</p>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'functions' does not exist on type 'Objec... Remove this comment to see the full error message */}
      {item.functions ? (
        // @ts-ignore ts-migrate(2339) FIXME: Property 'functions' does not exist on type 'Objec... Remove this comment to see the full error message
        item.functions.map(
          // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
          (func: any, index: number) => (
            <Item
              type={type}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              key={`${type}_${item.name}_${index}`}
              item={func}
              onClick={onClick}
              selected={selected}
            />
          )
        )
      ) : // @ts-ignore ts-migrate(2339) FIXME: Property 'class' does not exist on type 'Object'.
      item.class ? (
        <Item
          type="Class"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          key={`$class_${item.name}`}
          // @ts-ignore ts-migrate(2339) FIXME: Property 'class' does not exist on type 'Object'.
          item={item.class}
          onClick={onClick}
          selected={selected}
        />
      ) : // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
      item.code ? (
        <Item
          type="Code"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          key={`$code_${item.name}`}
          item={item}
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
