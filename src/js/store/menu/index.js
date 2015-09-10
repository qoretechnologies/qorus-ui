// import actions from './actions';

const initialState = {
  mainItems: [
    {
      name: 'System',
      url: '/system',
      icon: 'icon-cog'
    },
    {
      name: 'Workflows',
      url: '/workflows',
      icon: 'icon-sitemap'
    },
    {
      name: 'Services',
      url: '/services',
      icon: 'icon-th-list'
    },
    {
      name: 'Jobs',
      url: '/jobs',
      icon: 'icon-calendar'
    },
    {
      name: 'Search',
      url: '/search',
      icon: 'icon-search'
    },
    {
      name: 'Groups',
      url: '/groups',
      icon: 'icon-tags'
    },
    {
      name: 'Ocmd',
      url: '/ocmd',
      icon: 'icon-terminal'
    },
    {
      name: 'Library',
      url: '/library',
      icon: 'icon-book'
    },
    {
      name: 'Extensions',
      url: '/extensions',
      icon: 'icon-beer'
    }
  ],
  extraItems: []
};


export default function reducer(state = initialState, action) {
  switch (action.type) {
  default:
    return state;
  }

  return state;
}
