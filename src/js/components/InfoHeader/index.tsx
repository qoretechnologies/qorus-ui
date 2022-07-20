import { Icon } from '@blueprintjs/core';
import React from 'react';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import ContentByType from '../ContentByType';
import PaneItem from '../pane_item';
import { normalizeName } from '../utils';

type Props = {
  model: any;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const InfoHeader: Function = ({ model }: Props) => (
  <PaneItem
    title={normalizeName(normalizeUnknownId(model))}
    label={
      // @ts-ignore ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'.
      model.author ? (
        <h5>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'. */}
          <Icon icon="person" /> {model.author}
        </h5>
      ) : null
    }
  >
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */}
    {model.description && <ContentByType content={model.description} />}
  </PaneItem>
);

export default InfoHeader;
