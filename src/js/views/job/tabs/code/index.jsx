/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import Code from '../../../../components/code';
import Box from '../../../../components/box';

type Props = {
  job: Object,
  lib: Object,
  heightUpdater: Function,
  location: Object,
};

const JobCode: Function = ({
  lib,
  heightUpdater,
  location,
}: Props): React.Element<any> => (
  <Box top>
    <Code
      selected={{
        name: `code - ${lib.code[0].name}`,
        code: lib.code[0].body,
      }}
      data={lib || {}}
      heightUpdater={heightUpdater}
      location={location}
    />
  </Box>
);

export default compose(
  withHandlers({
    heightUpdater: (): Function => (): number => {
      const { top } = document
        .querySelector('.code-list')
        .getBoundingClientRect();

      return window.innerHeight - top - 60;
    },
  }),
  mapProps(
    (props: Object): Object => ({
      ...props,
      lib: {
        ...{
          code: [
            {
              name: 'Job code',
              body: props.job.code,
            },
          ],
        },
        ...props.job.lib,
      },
    })
  )
)(JobCode);
