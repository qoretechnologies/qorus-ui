import chai, { expect } from 'chai';
import spies from 'chai-spies';
import {
  createResourceActions,
  combineResourceActions,
  createApiActions,
} from '../../src/js/store/api/utils';

describe(
  '{ ' +
    'createResourceActions, ' +
    'combineResourceActions, ' +
    'createApiActions ' +
  "} from 'store/api/utils'",
() => {
  before(() => {
    chai.use(spies);
  });

  describe('createResourceActions', () => {
    it('transforms resource description to action description', () => {
      const getAction = url => id => `GET ${url}/${id}`;
      const getActionSpy = chai.spy(getAction);
      const postAction = url => (id, params) => `POST ${url}/${id}?${params}`;
      const postActionSpy = chai.spy(postAction);
      const resources = [{
        name: 'workflows',
        url: 'api/workflows',
        actions: {
          get: getActionSpy,
        },
      }, {
        name: 'services',
        url: 'api/services',
        actions: {
          post: postActionSpy,
        },
      }];

      const actions = createResourceActions(resources);

      expect(actions.workflows.get.action).to.be.a('function');
      expect(actions.workflows.get.meta).to.be.a('null');
      expect(getActionSpy).to.have.been.called.with('api/workflows');
      expect(actions.services.post.action).to.be.a('function');
      expect(actions.services.post.meta).to.be.a('null');
      expect(postActionSpy).to.have.been.called.with('api/services');
    });

    it('merges resource descriptions to one action description', () => {
      const resources = [{
        name: 'workflows',
        url: 'api/workflows',
        actions: {
          GET: url => id => `GET ${url}/${id}`,
        },
      }, {
        name: 'workflows',
        url: 'api/workflows',
        actions: {
          PUT: url => (id, params) => `PUT ${url}/${id}?${params}`,
        },
      }];

      const actions = createResourceActions(resources);

      expect(actions.workflows.get.action).to.be.a('function');
      expect(actions.workflows.put.action).to.be.a('function');
    });

    it('can override actions from resource descriptions', () => {
      const resources = [{
        name: 'workflows',
        url: 'api/workflows',
        actions: {
          GET: url => id => `GET ${url}/${id}`,
        },
      }, {
        name: 'services',
        url: 'api/services',
        actions: {
          POST: url => (id, params) => `POST ${url}/${id}?${params}`,
        },
      }];

      const actions = createResourceActions(resources, {
        PUT: url => (id, params) => `PUT ${url}/${id}?${params}`,
      });

      expect(actions.workflows.get).to.be.an('undefined');
      expect(actions.workflows.put.action).to.be.a('function');
      expect(actions.services.post).to.be.an('undefined');
      expect(actions.services.put.action).to.be.a('function');
    });

    it('can transform actions from resource descriptions', () => {
      const resources = [{
        name: 'workflows',
        url: 'api/workflows',
        actions: {
          GET: url => id => `GET ${url}/${id}`,
        },
      }];

      const transformedActions = createResourceActions(resources, actions => (
        Object.keys(actions).reduce((newActions, name) => (
          Object.assign(newActions, {
            [`SUPERB_${name}`]: actions[name],
          })
        ), {})
      ));

      expect(transformedActions.workflows.get).
        to.be.an('undefined');
      expect(transformedActions.workflows.superb_get.action).
        to.be.a('function');
    });

    it('supports complete action description in resource description or ' +
       'action override', () => {
      const getAction = url => id => `GET ${url}/${id}`;
      const getActionSpy = chai.spy(getAction);
      const metaCreator = (id) => `workflow-${id}`;
      const resources = [{
        name: 'workflows',
        url: 'api/workflows',
        actions: {
          GET: {
            action: getActionSpy,
            meta: metaCreator,
          },
        },
      }];

      const actions = createResourceActions(resources);

      expect(actions.workflows.get.action).to.be.a('function');
      expect(actions.workflows.get.meta).to.be.equal(metaCreator);
      expect(getActionSpy).to.have.been.called.with('api/workflows');


      const putAction = url => (id, params) => `PUT ${url}/${id}?${params}`;
      const putActionSpy = chai.spy(putAction);
      const overrideMetaCreator = (id, params) => params;
      const actionsWithOverride = createResourceActions(resources, {
        PUT: {
          action: putActionSpy,
          meta: overrideMetaCreator,
        },
      });

      expect(actionsWithOverride.workflows.put.action).
        to.be.a('function');
      expect(actionsWithOverride.workflows.put.meta).
        to.be.equal(overrideMetaCreator);
      expect(putActionSpy).to.have.been.called.with('api/workflows');
    });
  });

  describe('combineResourceActions', () => {
    it('combines action descriptions together', () => {
      const defaultGet = id => `GET /${id}`;
      const defaultActions = {
        workflows: {
          get: {
            action: defaultGet,
            meta: null,
          },
        },
      };

      const resourceStart = id => `GET /${id}?action=start`;
      const resourceActions = {
        workflows: {
          start: {
            action: resourceStart,
            meta: id => ({ action: 'start', id }),
          },
        },
      };

      const actions = combineResourceActions(
        defaultActions,
        resourceActions
      );

      expect(actions.workflows.get.action).to.be.equal(defaultGet);
      expect(actions.workflows.start.action).to.be.equal(resourceStart);
    });

    it('leaves later action descriptions if there is a conflict', () => {
      const defaultGet = id => `GET /${id}`;
      const defaultActions = {
        workflows: {
          get: {
            action: defaultGet,
            meta: null,
          },
        },
      };

      const resourceGet = id => `GET /${id}`;
      const resourceActions = {
        workflows: {
          get: {
            action: resourceGet,
            meta: null,
          },
        },
      };

      const actions = combineResourceActions(
        defaultActions,
        resourceActions
      );

      expect(actions.workflows.get.action).to.be.equal(resourceGet);
    });
  });

  describe('createApiActions', () => {
    it('transforms action description redux action creators', () => {
      const actions = {
        workflows: {
          get: {
            action: id => `GET /${id}`,
            meta: id => id,
          },
        },
      };

      const reduxActions = createApiActions(actions);

      expect(reduxActions.workflows.get(42)).to.eql({
        type: 'WORKFLOWS_GET',
        payload: 'GET /42',
        meta: 42,
      });
    });
  });
});
