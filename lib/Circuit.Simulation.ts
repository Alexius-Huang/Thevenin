import Graph, { Node, Edge, NodeInfo } from "./Circuit.Graph";
import { EC } from "./Electronic";

export default class CircuitSimulation {
  constructor(public graph: Graph) {}

  public supernodePropagation() {
    const { nodes } = this.graph;
    const mergedNodes = new Set<Node>();

    let traverseFromNode = (node: Node) => {
      const infos = Array.from(node.info);

      for (let { edge, pinName } of infos) {
        const { electronic, pinsMap } = edge;

        if (electronic.is(EC.DCSource)) {
          const positivelyPinned = pinName === 'POSITIVE';
          const negativePinName = positivelyPinned ? 'NEGATIVE' : 'POSITIVE';
          const bias = positivelyPinned ? electronic.value : -electronic.value;
          const linkedNode = pinsMap.get(negativePinName);
          if (!linkedNode) throw new Error(`DC Source isn't connected correctly!`);

          const biasedNodeInfo = infos.map(info => ({ ...info, bias: info.bias + bias }));
          const supernodeInfo = new Set(biasedNodeInfo);
          const linkedNodeInfo = Array.from(linkedNode.info);
          linkedNodeInfo.forEach(info => {
            supernodeInfo.add({ ...info });

            if (info.edge.electronic.is(EC.DCSource)) {
              info.edge.pinsMap.set(pinName, node);
            }
          });

          node.info = supernodeInfo;
          linkedNode.info = supernodeInfo;

          mergedNodes.add(linkedNode);
        }
      }
    };

    const nodesIter = nodes.values();
    let pulled = nodesIter.next();

    while (!pulled.done) {
      const node = pulled.value as Node;
      if (!mergedNodes.has(node)) traverseFromNode(node);

      pulled = nodesIter.next();
    }

    this.graph.nodes = this.graph.nodes.filter(node => !mergedNodes.has(node));
  }
}
