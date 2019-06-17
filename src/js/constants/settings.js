import keyMirror from 'keymirror';

const ACTIONS = keyMirror({
  SETTINGS_SAVEDIMENSIONS: null,
  MAXIMIZE: null,
});

const Modules = {
  'Global Order Stats': 'orderStats',
  Interfaces: 'interfaces',
  Connections: 'connections',
  'Cluster Info': 'cluster',
  'System Overview': 'overview',
  'Remote connections': 'remotes',
  'Node data': 'nodeData',
};

export { ACTIONS, Modules };
