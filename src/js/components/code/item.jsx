/* @flow */
import React from 'react';
import classNames from 'classnames';

type Props = {
  type: string,
  item: Object,
  onClick: Function,
  selected: boolean,
}

const Item: Function = ({ item, onClick, selected, type }: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(`${type} - ${item.name}`, item.body);
  };

  const isSelected: boolean = selected && selected.name === `${type} - ${item.name}`;

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

const CodeItem: Function = ({ item, onClick, selected, type }: Props): React.Element<any> => {
  if (item.body) {
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
          key={index}
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

export default CodeItem;
