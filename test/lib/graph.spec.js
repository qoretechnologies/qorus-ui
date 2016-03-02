import { expect } from 'chai';
import { graph, descendants } from '../../src/js/lib/graph';


describe("{ graph, descendants } from 'lib/graph'", () => {
  describe('graph', () => {
    it('returns root node of graph constructed from given dependency map',
    () => {
      const node = graph({
        0: [],
        1: [0],
      });

      expect(node.id).to.equal(0);

      expect(node.above).to.have.length(0);

      expect(node.below).to.have.length(1);
      expect(node.below[0].id).to.equal(1);
    });


    it("sets node's weight to its number of descendants (including self) " +
       'ignoring those already accounted for elsewhere',
    () => {
      const node = graph({
        0: [],
        1: [0],
        2: [0],
        3: [2],
      });

      expect(node.weight).to.equal(4);

      expect(node.below[0].weight).to.equal(1);

      expect(node.below[1].weight).to.equal(2);
      expect(node.below[1].below[0].weight).to.equal(1);
    });


    it('centers nodes based on their weight', () => {
      const node = graph({
        0: [],
        1: [0],
        2: [0],
        3: [0],
        4: [1],
        5: [1],
        6: [3],
      });

      expect(node.below[0].id).to.equal(2);
      expect(node.below[1].id).to.equal(1);
      expect(node.below[2].id).to.equal(3);

      expect(node.below[1].below[0].id).to.equal(4);
      expect(node.below[1].below[1].id).to.equal(5);

      expect(node.below[2].below[0].id).to.equal(6);
    });


    it("sets node's depth right below its deepest parent", () => {
      const node = graph({
        0: [],
        1: [0],
        2: [1],
        3: [0],
        4: [2, 3],
      });

      expect(node.depth).to.equal(0);

      expect(node.below[0].depth).to.equal(1);
      expect(node.below[0].below[0].depth).to.equal(3);

      expect(node.below[1].id).to.equal(1);
      expect(node.below[1].below[0].depth).to.equal(2);
    });


    it("sets node's width to the number of nodes below in the simplest case",
    () => {
      const node = graph({
        0: [],
        1: [0],
        2: [0],
      });

      expect(node.width).to.equal(2);
    });


    it('propagates highest width upwards always summing the width of nodes ' +
       'below',
    () => {
      const node = graph({
        0: [],
        1: [0],
        2: [1],
        3: [1],
      });

      expect(node.width).to.equal(2);
      expect(node.below[0].width).to.equal(2);
      expect(node.below[0].below[0].width).to.equal(1);
      expect(node.below[0].below[1].width).to.equal(1);
    });


    it('sets width of nodes in the same row to maximum width in that row',
    () => {
      const node = graph({
        0: [],
        1: [0],
        2: [1],
        3: [1],
        4: [0],
        5: [4],
      });

      expect(node.width).to.equal(4);

      expect(node.below[0].width).to.equal(2);
      expect(node.below[1].width).to.equal(2);

      expect(node.below[0].below[0].width).to.equal(1);
      expect(node.below[1].below[0].width).to.equal(1);
      expect(node.below[1].below[1].width).to.equal(1);
    });
  });


  describe('descendants', () => {
    it('yields every node in the graph starting with given node itself',
    () => {
      const nodes = [...descendants(graph({
        0: [],
        1: [0],
        2: [1],
        3: [2],
        4: [0],
        5: [4],
      }))];

      expect(nodes.map(n => n.id)).to.eql([0, 4, 5, 1, 2, 3]);
    });
  });
});
