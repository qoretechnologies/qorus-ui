/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import showIfPassed from '../../../hocomponents/show-if-passed';
import { formatFieldSource } from '../../../helpers/mapper';

type Props = {
  name: string,
  fieldSource: string,
  onShowAll: Function,
};

const FieldDetail = ({
  name,
  fieldSource,
  onShowAll,
// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
}: Props): ?React.Element<any> => {
  if (!fieldSource) return null;

  const { data, code } = formatFieldSource(fieldSource);

  if (!data.length) return null;

  const detailObject = data.reduce(
    (newData, attr) => ({ ...newData, ...{ [attr.key]: attr.value } }),
    {}
  );
  const detail = data[0];
  const handleShowAllClick: Function = () => {
    onShowAll({ name, data: detailObject, code });
  };

  return (
    <div className="field-detail">
      <span>{detail.key}</span> : {detail.value}
      {data.length > 1 || (code !== '' && code !== '(') ? (
        <div>
          <div className="grad" />
          { /* @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message */ }
          <div className="field-detail__showall" onClick={handleShowAllClick}>
            <a> SHOW DETAILS </a>
          </div>
        </div>
      ) : (
        undefined
      )}
    </div>
  );
};

export default compose(
  pure,
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ name }: { name: string }): boolean => !!name)
)(FieldDetail);
