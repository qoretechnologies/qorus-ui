/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import showIfPassed from '../../../hocomponents/show-if-passed';
import InfoTable from '../../../components/info_table';

const FieldDetail = ({ name, fieldSource }: {name: string, fieldSource: string}) => {
  const regex = /^\(\"(\w+)\"[\ ]*\:[\ ]*\"(\w+)\"/;
  const matching: any = fieldSource.match(regex);
  const type: string = matching[1];
  const value: string = matching[2];

  const infoObject: { type: string, name: string, input?: string, value?: string } = { type, name };

  if (type === 'name') {
    infoObject.input = value;
  } else {
    infoObject.value = value;
  }

  return (
    <div className="field-detail">
      <InfoTable object={infoObject} />
    </div>
  );
};

export default compose(
  pure,
  showIfPassed(({ name }: { name: string }): boolean => !!name)
)(FieldDetail);
