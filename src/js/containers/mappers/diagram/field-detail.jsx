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
  showIfPassed(({ name }: { name: string }): boolean => !!name)
)(FieldDetail);
