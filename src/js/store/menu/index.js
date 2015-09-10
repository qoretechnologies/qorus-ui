// import actions from './actions';

const initialState = {
  mainItems: [
    {
      name: 'System',
      url: '/system',
      icon: 'fa-cog'
    },
    {
      name: 'Workflows',
      url: '/workflows',
      icon: 'fa-sitemap'
    },
    {
      name: 'Services',
      url: '/services',
      icon: 'fa-th-list'
    },
    {
      name: 'Jobs',
      url: '/jobs',
      icon: 'fa-calendar'
    },
    {
      name: 'Search',
      url: '/search',
      icon: 'fa-search'
    },
    {
      name: 'Groups',
      url: '/groups',
      icon: 'fa-tags'
    },
    {
      name: 'Ocmd',
      url: '/ocmd',
      icon: 'fa-terminal'
    },
    {
      name: 'Library',
      url: '/library',
      icon: 'fa-book'
    },
    {
      name: 'Extensions',
      url: '/extensions',
      icon: 'fa-beer'
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
