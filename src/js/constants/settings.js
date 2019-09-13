import keyMirror from 'keymirror';

const ACTIONS = keyMirror({
  SETTINGS_SAVEDIMENSIONS: null,
  MAXIMIZE: null,
});

const Modules = {
  'settings.global-order-stats': 'orderStats',
  'settings.interfaces': 'interfaces',
  'settings.connections': 'connections',
  'settings.cluster-info': 'cluster',
  'settings.system-overview': 'overview',
  'settings.remote-connections': 'remotes',
  'settings.node-data': 'nodeData',
};

export { ACTIONS, Modules };
