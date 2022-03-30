import React from 'react';
import { normalizeName } from '../utils';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import { Icon } from '@blueprintjs/core';
import PaneItem from '../pane_item';
import ContentByType from '../ContentByType';

type Props = {
  model: Object,
};

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const InfoHeader: Function = ({ model }: Props): React.Element<any> => (
  <PaneItem
    title={normalizeName(normalizeUnknownId(model))}
    label={
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'.
      model.author ? (
        <h5>
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'.
          <Icon icon="person" /> {model.author}
        </h5>
      ) : null
    }
  >
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message
    {model.description && <ContentByType content={model.description} />}
  </PaneItem>
);

export default InfoHeader;
