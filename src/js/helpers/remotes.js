// @flow
import { CONN_MAP } from '../constants/remotes';

const buildRemoteHash: Function = (
  remoteType: string,
  data: Object
): Object => ({
  ...{
    conntype: CONN_MAP[remoteType],
    alerts: [],
    up: false,
  },
  ...data,
});

const attrsSelector = () => {
  const attrs = [
    'name',
    'url',
    'opts',
    'desc',
    'conntype',
    'up',
    'monitor',
    'status',
    'last_check',
    'locked',
  ];

  const editable = ['desc', 'url', 'opts'];

  return {
    attrs,
    editable,
  };
};

export { buildRemoteHash, attrsSelector };
