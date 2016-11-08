/* @flow */
import React from 'react';
import classNames from 'classnames';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';

type Props = {
  type: string,
  item: Object,
  onClick: Function,
  selected: string,
}

let Item: Function = ({ item, onClick, selected, type }: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(`${type} - ${item.name}`, item.body, type, item.id);
  };

  const isSelected: boolean = selected === `${type} - ${item.name}`;

  return (
    <div
      onClick={handleClick}
      className={classNames('code-item', { selected: isSelected })}
    >
      { item.type && (
        <span className="code-item-type">{ item.type }</span>
      )}
      <p>{ item.name } { item.version }</p>
    </div>
  );
};

Item = compose(
  lifecycle({
    shouldComponentUpdate(nextProps) {
      const name = `${this.props.type} - ${this.props.item.name}`;

      return nextProps.selected === name || this.props.selected === name;
    },
  })
)(Item);

const CodeItem: Function = ({ item, onClick, selected, type }: Props): React.Element<any> => {
  if (item.body || !item.functions) {
    return (
      <Item
        type={type}
        item={item}
        onClick={onClick}
        selected={selected}
      />
    );
  }

  return (
    <div>
      <p className="code-item-header">{ item.name }</p>
      { item.functions ? item.functions.map((func: Object, index: number): React.Element<any> => (
        <Item
          type={`${type} - ${item.name}`}
          key={`${type}_${item.name}_${index}`}
          item={func}
          onClick={onClick}
          selected={selected}
        />
      )) : (
        <p> No data </p>
      )}
    </div>
  );
};

export default (CodeItem);
