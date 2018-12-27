// @flow
import { CONN_MAP } from '../constants/remotes';

const buildRemoteHash: Function = (
  remoteType: string,
  data: Object,
  name: string
): Object => {
  let desc;
  let options;
  let optsKey;

  if (remoteType === 'user') {
    desc = data.desc;
    optsKey = 'opts';
    options = data.opts || data.options;
  } else {
    optsKey = 'options';
    options =
      !data.options || data.options === '' ? { max: 0, min: 0 } : data.options;
    desc = `${data.type}:${data.user}@${data.db}`;
    desc += data.charset ? `(${data.charset})` : '';
    desc += data.host ? `%${data.host}` : '';
    desc += data.port ? `:${data.port}` : '';
    desc += JSON.stringify(options)
      .replace(/"/g, '')
      .replace(/:/g, '=');
  }

  if (name) {
    return { ...data, ...{ [optsKey]: options, desc } };
  }

  return {
    ...data,
    ...{
      conntype: CONN_MAP[remoteType],
      alerts: [],
      up: false,
      desc,
      [optsKey]: options,
    },
  };
};

const attrsSelector = (state, props) => {
  const { remoteType } = props;
  let attrs;
  let editable = [];

  switch (remoteType) {
    case 'datasources': {
      attrs = [
        'conntype',
        'locked',
        'up',
        'monitor',
        'status',
        'last_check',
        'type',
        'user',
        'pass',
        'db',
        'charset',
        'port',
        'host',
        'options',
      ];

      editable = [
        'type',
        'user',
        'pass',
        'db',
        'charset',
        'port',
        'host',
        'options',
      ];

      break;
    }
    case 'qorus': {
      attrs = ['conntype', 'up', 'monitor', 'status', 'last_check', 'locked'];

      break;
    }
    default: {
      attrs = [
        'conntype',
        'up',
        'monitor',
        'status',
        'last_check',
        'type',
        'opts',
        'desc',
        'url',
      ];

      editable = ['desc', 'url', 'opts'];

      break;
    }
  }

  return {
    attrs,
    editable,
  };
};

export { buildRemoteHash, attrsSelector };
