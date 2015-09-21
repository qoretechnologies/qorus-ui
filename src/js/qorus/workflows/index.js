import { REST_API_PREFIX } from '../../settings';
import { ORDER_STATES } from '../../constants/orders';

let DEFAULTS = {
  TOTAL: 0
};

ORDER_STATES.forEach((val) => { DEFAULTS[val.name] = 0; });

const workflowsUrl = `${url}/workflows/:id`;
const workflowUrl = `${url}/workflows/:id`;

const workflowsApi = {
  // simple edpoint description
  workflows: {
    url: `${url}/workflows`,
    transformer: (data) => {
      if (!data) return [];

      const resp = data.map((item) => {
        if (!item.id) {
          item.id = item.workflowid;
          delete item.workflowid;
        }
        return Object.assign({}, DEFAULTS, item);
      });
      return resp;
    }
  },
  workflow: {
    url: workflowUrl
  },
  workflowDoAction: {
    resourceName: 'workflow',
    url: `${workflowUrl}?doAction=${action}`,
    options: {
      method: 'post'

    }
  }
};

export default workflowsApi;
