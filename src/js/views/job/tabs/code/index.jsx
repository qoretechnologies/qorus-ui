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
      const navbar = document.querySelector('.navbar').clientHeight;
      const footer = document.querySelector('footer').clientHeight;
      const header = document.querySelector('.job-header').clientHeight;
      const desc = document.querySelector('.job-description').clientHeight;
      const tabs = document.querySelector('.nav-tabs').clientHeight;
      const top = navbar + footer + header + desc + tabs + 40;

      return window.innerHeight - top;
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
