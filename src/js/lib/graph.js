import _ from 'lodash';


/**
 * Graph node with all its attributes and nodes above and below.
 *
 * Nodes `above` are all nodes with edges pointing to this nodes.
 *
 * Nodes `below` are nodes with edges pointing to them from this
 * node. Nodes below divided by depth below this node.
 *
 * Both nodes `above` and `below` are sorted with heaviest and deepest
 * nodes in the center.
 *
 * Attribute `depth` is a level from the beginning of the graph
 * starting from zero for the root node.
 *
 * Attribute `weight` is node's own weight (1) plus a sum of weights
 * of all nodes below divided by their number of nodes above.
 *
 * Attribute `width` represents how wide is current branch - the
 * widest number of nodes below for all descendants.
 *
 * Attribute `position` is a relative position among nodes below
 * sharing the same nodes above. Zero means the middle, negative
 * numbers are on the left and positive numbers are on the right.
 *
 * @typedef {{
 *   id: number,
 *   above: !Array<!GraphNode>,
 *   below: !Array<!Array<!GraphNode>>,
 *   depth: number,
 *   weight: number,
 *   width: number,
 *   position: number,
 * }} GraphNode
 */


/**
 * Internal structure used by this module while processing graph
 * nodes.
 *
 * @typedef {{
 *   id: number,
 *   above: !Array<number>,
 *   below: !Array<number>,
 *   depth: number,
 *   weight: number,
 * }} TempGraphNode
 */


/**
 * Direction for node comparator.
 *
 * @enum {number}
 */
const Dir = {
  ASC: +1,
  DESC: -1,
};


/**
 * Returns node comparator.
 *
 * Nodes are compared based on product of their depth and weight.
 *
 * @param {Dir} dir
 * @return {function(!GraphNode, !GraphNode): number}
 */
function createComparator(dir) {
  return function compare(a, b) {
    return dir * (a.depth * a.weight - b.depth * b.weight);
  };
}


/**
 * Initializes node structure.
 *
 * @param {number} id
 * @return {!TempGraphNode}
 */
function create(id) {
  return {
    id,
    above: [],
    below: [],
    depth: 0,
    weight: 1,
  };
}


/**
 * Adds cross-references below and above.
 *
 * @param {!TempGraphNode} above
 * @param {!TempGraphNode} below
 * @return {!Array<!TempGraphNode>} 0: above, 1: below
 */
function add(above, below) {
  const na = Object.assign({}, above, {
    below: above.below.concat(below.id),
  });
  const nb = Object.assign({}, below, {
    above: below.above.concat(above.id),
  });

  return [na, nb];
}


/**
 * Sets balanced depth on all nodes in the graph.
 *
 * Nodes on the same depth always share the same nodes above. The root
 * node which has no nodes above has depth of zero.
 *
 * @param {!Object<number, !TempGraphNode>} nodes
 * @return {!Object<number, !TempGraphNode>}
 */
function setBalancedDepth(nodes) {
  const balanced = Object.create(null);

  const nodesAboveEql = (n, tmp, bId) => (
    n.above.length === tmp[bId].above.length &&
    n.above.every((na, i) => na === tmp[bId].above[i])
  );
  const nextDepth = (bs, d, bId) => (
    Math.max(d, balanced[bId].depth + 1)
  );

  for (const id in nodes) { // eslint-disable-line guard-for-in
    const commonId = Object.keys(balanced).reverse().find(
      nodesAboveEql.bind(null, nodes[id], balanced)
    );

    const depth = balanced[commonId] ?
      balanced[commonId].depth :
      Object.keys(balanced).reduce(nextDepth.bind(null, balanced), 0);

    balanced[id] = Object.assign({}, nodes[id], { depth });
  }

  return balanced;
}


/**
 * Tries to find reference node from nodes above.
 *
 * Refence node is in the center of nodes above. However, nodes above
 * can be empty (in case of root node), so `null` can be returned.
 *
 * @param {!GraphNode} node
 * @return {GraphNode}
 */
function findRef(node) {
  const centerIdx = Math.floor(node.above.length / 2);

  return node.above[centerIdx] || null;
}


/**
 * Checks if given `node` is a reference node above for nodes `below`.
 *
 * It is enough to check the first node from nodes below, because they
 * are expected to be on the same depth level and therefore share the
 * same nodes above. If this condition is not met, the result can be
 * absolutely random.
 *
 * Given the expectation above, it best to use this function to filter
 * depth level below given `node` which are associated to it (e.g., to
 * find reference to position nodes below).
 *
 * @param {!GraphNode} node
 * @param {!Array<!GraphNode>} nodesBelow
 * @return {boolen}
 * @see findRef
 * @see setBalancedDepth
 */
function isRef(node, nodesBelow) {
  return findRef(nodesBelow[0]) === node;
}


/**
 * Computes node width from nodes below it.
 *
 * The resulting width is a sum of widths from nodes below. Only
 * widths from nodes whose reference node is given `node` are
 * counted. If there is no node below, currently set node's width is
 * returned.
 *
 * @param {!GraphNode} node
 * @return {number}
 */
function getWidth(node) {
  return Math.max(
    node.width,
    node.below.
      filter(isRef.bind(null, node)).
      reduce((ws, nbs) => (
        ws + nbs.reduce((w, nb) => w + nb.width, 0)
      ), 0)
  );
}


/**
 * Computes node's relative position to its reference node.
 *
 * Positions on the left are negative. Position on the right are
 * positive. Default position (if there is no reference node) is zero.
 *
 * @param {!GraphNode} node
 * @return {number}
 */
function getPosition(node) {
  const ref = findRef(node);
  const lvl = ref && ref.below.find(isRef.bind(null, ref));
  const pos = lvl && lvl.findIndex(nb => nb === node);

  return ref ?
    pos - (lvl.length - 1) / 2 :
    0;
}


/**
 * Sets balanced weight on all nodes in the graph.
 *
 * Weight of a node is shared among all its nodes above. Therefore,
 * nodes above has a weight of their own plus sum of weights of their
 * nodes below divided by number of those nodes' nodes above.
 *
 * @param {!Object<number, !TempGraphNode>} node
 * @return {!Object<number, !TempGraphNode>}
 */
function setBalancedWeight(nodes) {
  const balanced = Object.create(null);

  for (const id of Object.keys(nodes).reverse()) {
    balanced[id] = Object.assign({}, nodes[id]);
    for (const bId of balanced[id].below) {
      balanced[id].weight += balanced[bId].weight / balanced[bId].above.length;
    }
  }

  return balanced;
}


/**
 * Sorts nodes so that the heaviest and deepest nodes in the center.
 *
 * @param {!Array<!GraphNode>} nodes
 * @return {!Array<!GraphNode>}
 */
function centerNodes(nodes) {
  const sorted = nodes.slice().sort(createComparator(Dir.ASC));

  const even = sorted.filter((n, i) => i % 2 === 0);
  const odd = sorted.filter((n, i) => i % 2 === 1);

  return even.concat(odd.reverse());
}


/**
 * Sets balanced width and position on all nodes in the graph.
 *
 * Nodes above and below are transformed so that they comply with
 * {@link GraphNode} contract. Then, width and position is computed.
 *
 * @param {!Object<number, !TempGraphNode>} node
 * @return {!Object<number, !GraphNode>}
 * @see centerNodes
 * @see getWidth
 * @see getPosition
 */
function setBalancedWidthAndPosition(nodes) {
  const balanced = Object.create(null);

  const toExport = (exported, id) => exported[id];

  const divideByDepth = (n, tmp, b, bId) => {
    const below = b.slice();

    const relDepth = tmp[bId].depth - n.depth - 1;

    if (!below[relDepth]) below[relDepth] = [];
    below[relDepth].push(bId);

    return below;
  };

  for (const id in nodes) { // eslint-disable-line guard-for-in
    balanced[id] = Object.assign({}, nodes[id]);

    balanced[id].above = centerNodes(
      balanced[id].above.map(toExport.bind(null, balanced))
    );

    balanced[id].below = nodes[id].below.reduce(
      divideByDepth.bind(null, nodes[id], nodes),
      []
    );

    balanced[id].width = 1;
  }

  const belowToExport = (tmp, bIds) => (
    centerNodes(bIds.map(toExport.bind(null, tmp)))
  );

  for (const id in balanced) { // eslint-disable-line guard-for-in
    balanced[id].below = balanced[id].below.map(
      belowToExport.bind(null, balanced)
    );
  }

  for (const id of Object.keys(balanced).reverse()) {
    balanced[id].width = getWidth(balanced[id]);
  }

  for (const id in balanced) { // eslint-disable-line guard-for-in
    balanced[id].position = getPosition(balanced[id]);
  }

  return balanced;
}


/**
 * Makes sure graph is balanced.
 *
 * It also makes transition from temporary {@link TempGraphNode}
 * structure to {@link GraphNode}.
 *
 * @param {!Object<number, !TempGraphNode>} nodes
 * @return {!Object<number, !GraphNode>}
 * @see setBalancedDepth
 * @see setBalancedWeight
 * @see setBalancedWidthAndPosition
 */
function balance(nodes) {
  return _.flow([
    setBalancedDepth,
    setBalancedWeight,
    setBalancedWidthAndPosition,
  ])(nodes);
}


/**
 * Returns root node of balanced directional graph.
 *
 * Graph is organized with a root on the top. Each node can have many
 * node above and below. The root node has no node above.
 *
 * Dependency map assigns nodes to particular node. These nodes are
 * above that particular node. Nodes are referenced as number
 * identifiers.
 *
 * It is expected that given dependency map does not contain any
 * cycles but no attempt to detect them is made.
 *
 * The implementation also relies on the fact that Object properties
 * with string names are ordered. This is a safe bet against
 * ECMAScript spec because many popular libraries and frameworks work
 * with this assumption which is true from all key
 * ECMAScript/JavaScript implementations.
 *
 * @param {!Object<number, !Array<number>>} deps
 * @return {!Object<number, !GraphNode>}
 * @see balance
 */
export function graph(deps) {
  const nodes = Object.create(null);

  for (const id in deps) {
    if (!deps.hasOwnProperty(id)) continue;

    nodes[id] = create(parseInt(id, 10));
  }

  for (const id in deps) {
    if (!deps.hasOwnProperty(id)) continue;

    for (const depId of deps[id]) {
      const [above, below] = add(nodes[depId], nodes[id]);
      nodes[above.id] = above;
      nodes[below.id] = below;
    }
  }

  return balance(nodes);
}
