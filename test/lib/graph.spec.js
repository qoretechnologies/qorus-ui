import { expect } from 'chai';
import { graph } from '../../src/js/lib/graph';


describe("{ graph } from 'lib/graph'", () => {
  describe('graph', () => {
    it('returns nodes mapped to their identifiers from graph constructed ' +
       'from given dependency map',
    () => {
      const nodes = graph({
        0: [],
        1: [0],
      });

      expect(nodes.get(0).id).to.equal(0);
      expect(nodes.get(1).id).to.equal(1);

      expect(nodes.get(0).above).to.have.length(0);

      expect(nodes.get(1).above).to.have.length(1);
      expect(nodes.get(1).above[0]).to.equal(nodes.get(0));

      expect(nodes.get(0).below).to.have.length(1);
      expect(nodes.get(0).below[0]).to.have.length(1);
      expect(nodes.get(0).below[0][0]).to.equal(nodes.get(1));
    });


    it("sets node's depth below its nodes above starting from zero", () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [1],
        3: [0],
        4: [2, 3],
      });

      expect(nodes.get(0).depth).to.equal(0);

      expect(nodes.get(1).depth).to.equal(1);
      expect(nodes.get(3).depth).to.equal(1);

      expect(nodes.get(2).depth).to.equal(2);

      expect(nodes.get(4).depth).to.equal(3);
    });


    it("sets node's weight as a sum of weight of its nodes below divided " +
       "by number of nodes above sharing the node's weight",
    () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [0],
        3: [2],
        4: [1, 3],
      });

      expect(nodes.get(0).weight).to.equal(5);
      expect(nodes.get(1).weight).to.equal(1.5);
      expect(nodes.get(2).weight).to.equal(2.5);
      expect(nodes.get(3).weight).to.equal(1.5);
      expect(nodes.get(4).weight).to.equal(1);
    });


    it("sets node's width to the number of nodes below in the simplest case",
    () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [0],
      });

      expect(nodes.get(0).width).to.equal(2);
    });


    it('propagates highest width upwards always summing the width of nodes ' +
       'below',
    () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [1],
        3: [1],
      });

      expect(nodes.get(0).width).to.equal(2);
      expect(nodes.get(1).width).to.equal(2);
      expect(nodes.get(2).width).to.equal(1);
      expect(nodes.get(3).width).to.equal(1);
    });


    it('orders nodes above so that the heaviest and deepest nodes are in ' +
       'the center',
    () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [0],
        3: [0],
        4: [1],
        5: [1, 2, 3],
      });

      expect(nodes.get(5).above).to.have.length(3);
      expect(nodes.get(5).above[0]).to.equal(nodes.get(2));
      expect(nodes.get(5).above[1]).to.equal(nodes.get(1));
      expect(nodes.get(5).above[2]).to.equal(nodes.get(3));
    });


    it('divides nodes below based on their depth', () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [0],
        3: [1],
        4: [1, 2],
      });

      expect(nodes.get(1).below).to.have.length(2);

      expect(nodes.get(1).below[0]).to.eql([nodes.get(3)]);
      expect(nodes.get(3).depth).to.equal(nodes.get(1).depth + 1);

      expect(nodes.get(1).below[1]).to.eql([nodes.get(4)]);
      expect(nodes.get(4).depth).to.equal(nodes.get(1).depth + 2);
    });


    it('orders nodes below so that the heaviest and deepest nodes are in ' +
       'the center',
    () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [0],
        3: [0],
        4: [1],
        5: [1, 2],
      });

      expect(nodes.get(0).below).to.have.length(1);
      expect(nodes.get(0).below[0]).to.eql([
        nodes.get(3),
        nodes.get(1),
        nodes.get(2),
      ]);
    });


    it("sets node's position relative to its reference node above", () => {
      const nodes = graph({
        0: [],
        1: [0],
        2: [1],
        3: [1],
      });

      expect(nodes.get(0).position).to.equal(0);
      expect(nodes.get(1).position).to.equal(0);
      expect(nodes.get(2).position).to.equal(-0.5);
      expect(nodes.get(3).position).to.equal(+0.5);
    });


    it('can handle unordered dependency maps', () => {
      const nodes = graph({
        0: [],
        1: [2],
        2: [0],
      });

      expect(nodes.get(1).above).to.have.length(1);
      expect(nodes.get(1).above[0]).to.equal(nodes.get(2));
    });
  });
});
