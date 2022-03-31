// @flow
import React from 'react';
import setDisplayName from 'recompose/setDisplayName';
import { selectedType } from '../helpers/resources';

export default (collection: string): Function =>
  (
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
    Component
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ) => {
    // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
    const withSelectable: Function = (props: Object): React.Element<any> => {
      const selected: string = selectedType(props[collection]);
      const selectedIds: Array<number> = props[collection]
        // @ts-ignore ts-migrate(2339) FIXME: Property '_selected' does not exist on type 'Objec... Remove this comment to see the full error message
        .map((item: Object) => (item._selected ? item.id : null))
        .filter((item: Object) => item || item === 0);

      return <Component selected={selected} selectedIds={selectedIds} {...props} />;
    };

    return setDisplayName('withSelectable')(withSelectable);
  };
