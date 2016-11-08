/* @flow */
import React from 'react';
import omit from 'lodash/omit';

import InfoTable from '../../../components/info_table';
import SourceCode from '../../../components/source_code';

type Props = {
  data: Object,
}

const DiagramDetail: Function = ({ data: { name, data, code } }: Props): React.Element<any> => {
  const newCode = code.indexOf('code') > 0 ?
    code.substring(code.indexOf(':') + 2, code.length) : code;
  const newData = omit(data, 'code');

  return (
    <div>
      <h4> Showing detail for { name }</h4>
      <InfoTable object={newData} />
      {code && (
        <SourceCode>
          { newCode }
        </SourceCode>
      )}
    </div>
  );
};

export default DiagramDetail;
