// @flow
import { CONN_MAP } from '../constants/remotes';

const buildRemoteHash: Function = (remoteType: string, data: any): any => ({
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

const attrsMapper: Function = (attr: string) => {
  const attrs = {
    opts: 'Options',
    desc: 'Description',
    url: 'URL',
  };

  if (attr in attrs) {
    return attrs[attr];
  }

  return attr;
};

export { buildRemoteHash, attrsSelector, attrsMapper };
