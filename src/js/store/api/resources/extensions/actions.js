import { createAction } from 'redux-actions';

import { fetchText } from '../../utils';


const loadExtensionData = createAction(
  'EXTENSIONS_LOADEXTENSIONDATA',
  (name, url) => fetchText('GET', url),
  name => ({ name })
);

export { loadExtensionData };
