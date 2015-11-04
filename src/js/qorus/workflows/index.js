import { ORDER_STATES } from '../../constants/orders';

const DEFAULTS = {
  TOTAL: 0
};

ORDER_STATES.forEach((val) => { DEFAULTS[val.name] = 0; });
Object.freeze(DEFAULTS);

const workflowsUrl = `${url}/workflows`;
const workflowUrl = `${url}/workflows/:id`;

const workflowsApi = {
  // simple edpoint description
  workflows: {
    url: workflowsUrl,
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
