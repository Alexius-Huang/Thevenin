import Graph, { Node, NodeInfo, PinInfoMap } from "./Circuit.Graph";
import { EC } from "./Electronic";

export default class CircuitSimulation {
  constructor(public graph: Graph) {}

  public supernodePropagation() {
    const { nodes } = this.graph;
    const mergedNodes = new Set<Node>();

    let traverseFromNode = (node: Node) => {
      const infos = Array.from(node.info);

      for (let { edgeID, pinName } of infos) {
        const edge = this.graph.findEdge(edgeID);
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

            if (edge.electronic.is(EC.DCSource)) {
              edge.pinsMap.set(pinName, node);
            }

            if (node.edgeMap.has(info.edgeID)) {
              const pinInfoMap = node.edgeMap.get(info.edgeID) as PinInfoMap;
              pinInfoMap.set(info.pinName, { bias: info.bias });
            } else {
              node.edgeMap.set(info.edgeID, new Map([[info.pinName, { bias: info.bias }]]));
            }
          });

          // Making sure that 'linkedNode' is the same as 'node'
          linkedNode.info = node.info;
          linkedNode.edgeMap = node.edgeMap;
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
