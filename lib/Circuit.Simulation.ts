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

          node.boostVoltageBias(bias);

          linkedNode.info.forEach(info => {
            node.info.add({ ...info });

            if (info.edge.electronic.is(EC.DCSource)) {
              info.edge.pinsMap.set(pinName, node);
            }
          });

          linkedNode.info = node.info;

          mergedNodes.add(linkedNode);
        }
      }
    };

    nodes.forEach(node => {
      if (mergedNodes.has(node)) return;
      traverseFromNode(node);
    });

    mergedNodes.forEach(node => {
      this.graph.nodes.delete(node);
    });
  }
}
