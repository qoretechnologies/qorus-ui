import { expect } from 'chai';

import {
  selectedType,
  select,
  selectAll,
  selectNone,
  selectInvert,
} from '../../src/js/helpers/resources';

describe('helpers for selecting resources from helpers/resources', () => {
  describe('selectedType', () => {
    it('returns none', () => {
      const collection = [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ];

      expect(selectedType(collection)).to.eql('none');
    });

    it('returns some', () => {
      const collection = [
        {
          id: 1,
          _selected: true,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ];

      expect(selectedType(collection)).to.eql('some');
    });

    it('returns all', () => {
      const collection = [
        {
          id: 1,
          _selected: true,
        },
        {
          id: 2,
          _selected: true,
        },
        {
          id: 3,
          _selected: true,
        },
      ];

      expect(selectedType(collection)).to.eql('all');
    });
  });

  describe('select', () => {
    it('should select a resource and add _selected', () => {
      let state = {
        data: [{
          id: 1,
        }],
      };

      state = select(state, 1);

      const item = state.data.find(itm => itm.id === 1);

      expect(item._selected).to.eql(true);
    });

    it('should deselect a resource and remove _selected', () => {
      let state = {
        data: [{
          id: 1,
          _selected: true,
        }],
      };

      state = select(state, 1);

      const item = state.data.find(itm => itm.id === 1);

      expect(item._selected).to.eql(false);
    });
  });

  describe('selectAll', () => {
    it('should select all ', () => {
      let state = {
        data: [
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
        ],
      };

      state = selectAll(state);

      expect(state.data.every(itm => itm._selected === true)).to.eql(true);
    });
  });

  describe('selectNone', () => {
    it('should deselect all, and not add _selected to those that have not had it', () => {
      let state = {
        data: [
          {
            id: 1,
            _selected: true,
          },
          {
            id: 2,
          },
          {
            id: 3,
            _selected: true,
          },
        ],
      };

      state = selectNone(state);

      expect(state.data.find(itm => itm.id === 1)._selected).to.eql(false);
      expect(state.data.find(itm => itm.id === 2)._selected).to.eql(undefined);
      expect(state.data.find(itm => itm.id === 3)._selected).to.eql(false);
    });
  });

  describe('selectNone', () => {
    it('inverts the selection', () => {
      let state = {
        data: [
          {
            id: 1,
            _selected: true,
          },
          {
            id: 2,
          },
          {
            id: 3,
            _selected: true,
          },
        ],
      };

      state = selectInvert(state);

      expect(state.data.find(itm => itm.id === 1)._selected).to.eql(false);
      expect(state.data.find(itm => itm.id === 2)._selected).to.eql(true);
      expect(state.data.find(itm => itm.id === 3)._selected).to.eql(false);
    });
  });
});
