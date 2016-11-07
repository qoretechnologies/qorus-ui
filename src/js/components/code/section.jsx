/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';

import CodeItem from './item';

type Props = {
  name: string,
  onToggleClick: Function,
  open: boolean,
  items: Array<Object>,
  onItemClick: Function,
  selected: Object,
}

const CodeSection: Function = ({
  name,
  onToggleClick,
  open,
  items,
  onItemClick,
  selected,
}: Props): React.Element<any> => (
  <div className="code-section">
    <h5 onClick={onToggleClick}>
      <span className={`fa fa-${open ? 'minus' : 'plus'}-square-o`}></span> { name }
    </h5>
    { open && (
      <div className="code-section__list">
        <div className="code-section__inner">
          { items.length ? (
            items.map((item: Object, index: number): React.Element<any> => (
              <CodeItem
                type={name}
                key={index}
                item={item}
                onClick={onItemClick}
                selected={selected}
              />
            ))
          ) : (
            <p> No data </p>
          )}
        </div>
      </div>
    )}
  </div>
);

export default compose(
  withState('open', 'toggler', true),
  mapProps(({ toggler, ...rest }) => ({
    onToggleClick: () => toggler((open: boolean): boolean => !open),
    ...rest,
  })),
)(CodeSection);
