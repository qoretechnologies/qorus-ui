import actions from './actions';

const initialState = {
    mainItems: [
      {
        name: 'Workflows',
        url: '/workflows',
        icon: 'icon-sitemap'
      },
      {
        name: 'Services',
        url: '/services',
        icon: 'icon-sitemap'
      },
      {
        name: 'Jobs',
        url: '/jobs',
        icon: 'icon-sitemap'
      }
    ]
};


export default function reducer(state = initialState, action) {
  // switch (action.type) {
  // }

  return state
}
