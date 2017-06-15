// @flow
import React from 'react';
import capitalize from 'lodash/capitalize';
import pure from 'recompose/onlyUpdateForKeys';

import SourceCode from '../../components/source_code';
import InfoTable from '../../components/info_table';
import Loader from '../../components/loader';

type Props = {
  selected: Object,
  height: any,
};

const CodeTab: Function = ({
  selected,
  height,
}: Props): React.Element<any> => (
  <div>
    {selected.item ? (
      <h5>
        {`${capitalize(selected.name)}
        ${selected.item.version ? `v${selected.item.version}` : ''}
        ${selected.item.id ? `(${selected.item.id})` : ''}`}
      </h5>
    ) : (
      <h5>{capitalize(selected.name)}</h5>
    )}
    {(selected.item && (selected.type !== 'code')) && (
      <InfoTable
        object={{
          author: selected.item.author,
          source: `${selected.item.source}:${selected.item.offset || ''}`,
          description: selected.item.description,
          tags: selected.item.tags && Object.keys(selected.item.tags).length,
        }}
      />
    )}
    { selected.loading ? (
      <Loader />
    ) : (
      <SourceCode height={typeof height === 'number' ? height - 35 : height}>
        { selected.code }
      </SourceCode>
    )}
  </div>
);

export default pure(['selected', 'height'])(CodeTab);
