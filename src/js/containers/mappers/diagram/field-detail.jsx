/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import trimStart from 'lodash/trimStart';
import trimEnd from 'lodash/trimEnd';

import showIfPassed from '../../../hocomponents/show-if-passed';

type Props = {
  name: string,
  fieldSource: string,
  onShowAll: Function,
}

const FieldDetail = ({ name, fieldSource, onShowAll }: Props): ?React.Element<any> => {
  if (!fieldSource) return null;

  let newSource = fieldSource;
  newSource = trimStart(newSource, '(');
  newSource = trimEnd(newSource, ')');

  // Check if there is any code in the fieldsource
  const code = newSource.substring(
    newSource.lastIndexOf('"code"'),
    newSource.lastIndexOf('}') + 1,
  );

  // Pull it out if there is
  if (code !== '') {
    newSource = newSource.replace(code, '');
  }

  // Remove all spaces and quotes now that we removed code
  newSource = newSource.replace(/"/g, '').replace(/ /g, '');

  // Split the fieldsource by commas
  const sourceArray = newSource.split(',');

  const data = sourceArray.map((attr) => {
    if (attr === '' || attr === ' ') {
      if (code !== '') {
        return {
          key: 'code',
          value: 'Click to view code',
        };
      }

      return null;
    }

    // Split the string by key and value
    const newAttr = attr.split(':');

    // If there is no key, the key is value and key is Unknown
    if (!newAttr[1]) {
      newAttr[1] = newAttr[0];
      newAttr[0] = 'Unknown';
    }

    // Remove all quotes
    const key = newAttr[0];
    const value = newAttr[1];

    // Do not display name
    if (key === 'name') {
      return null;
    }

    return { key, value };
  }).filter(item => item);

  if (!data.length) return null;

  const detailObject = data.reduce((newData, attr) => (
    { ...newData, ...{ [attr.key]: attr.value } }
  ), {});
  const detail = data[0];
  const handleShowAllClick: Function = () => {
    onShowAll({ name, data: detailObject, code });
  };

  return (
    <div className="field-detail">
      <span>
        { detail.key }
      </span>
      {' '}
      : { detail.value }
      { data.length > 1 || code !== '' && code !== '(' ? (
        <div>
          <div className="grad" />
          <div
            className="field-detail__showall"
            onClick={handleShowAllClick}
          >
            <a href="#detail"> SHOW DETAILS </a>
          </div>
        </div>
      ) : undefined }
    </div>
  );
};

export default compose(
  pure,
  showIfPassed(({ name }: { name: string }): boolean => !!name)
)(FieldDetail);
