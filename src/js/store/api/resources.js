import settings from '../../settings';

const url = settings.REST_API_PREFIX;

export default [
  {
    name: 'workflows',
    url: `${url}/workflows`,
    transform: item => item
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
