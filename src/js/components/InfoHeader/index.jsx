import React from 'react';
import { normalizeName } from '../utils';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import { Icon } from '@blueprintjs/core';
import PaneItem from '../pane_item';
import ContentByType from '../ContentByType';

type Props = {
  model: Object,
};

const InfoHeader: Function = ({ model }: Props): React.Element<any> => (
  <PaneItem
    title={normalizeName(normalizeUnknownId(model))}
    label={
      model.author ? (
        <h5>
          <Icon icon="person" /> {model.author}
        </h5>
      ) : null
    }
  >
    {model.description && <ContentByType content={model.description} />}
  </PaneItem>
);

export default InfoHeader;
