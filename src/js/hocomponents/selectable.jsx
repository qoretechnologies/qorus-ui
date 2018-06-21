// @flow
import React from 'react';
import setDisplayName from 'recompose/setDisplayName';

import { selectedType } from '../helpers/resources';

export default (collection: string): Function => (
  Component: ReactClass<*>
): ReactClass<*> => {
  const withSelectable: Function = (props: Object): React.Element<any> => {
    const selected: string = selectedType(props[collection]);
    const selectedIds: Array<number> = props[collection]
      .map((item: Object) => (item._selected ? item.id : null))
      .filter((item: Object) => item || item === 0);

    return (
      <Component selected={selected} selectedIds={selectedIds} {...props} />
    );
  };

  return setDisplayName('withSelectable')(withSelectable);
};
