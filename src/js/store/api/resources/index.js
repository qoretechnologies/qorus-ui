import settings from 'settings';
import { extend } from 'lodash';
import { DEFAULTS as workflowDefaults } from './workflows';

const url = settings.REST_API_PREFIX;

console.log(workflowDefaults);

export default [
  {
    name: 'workflows',
    url: `${url}/workflows`,
    transform: (data) => {
      if (!data) return [];
      const resp = data.map((item) => {
        if (!item.id) {
          item.id = item.workflowid;
          delete item.workflowid;
        }
        return extend({}, workflowDefaults, item);
      });
      return resp;
    }
  },
  {
    name: 'system',
    url: `${url}/system`,
    transform: item => item
  },
  {
    name: 'currentUser',
    url: `${url}/users?action=current`,
    transform: item => item
  }
];
