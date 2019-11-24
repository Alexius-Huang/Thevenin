import Graph, { Node, Edge, PinInfoMap, PinInfo, CurrentFlow } from './Circuit.Graph';
import { EC } from './Electronic';
import E from './electronics';

export default class CircuitSimulation {
  constructor(public graph: Graph) {}

  public supernodePropagation() {
    const { nodes } = this.graph;
    const mergedNodes = new Set<Node>();

    let traverseFromNode = (node: Node) => {
      const infos = Array.from(node.info);

      for (let { edgeID, pinName } of infos) {
        const edge = this.graph.findEdge(edgeID);
        const { electronic, nodesMap } = edge;

        if (electronic.is(EC.DCSource)) {
          node.isSupernode = true;

          const positivelyPinned = pinName === 'POSITIVE';
          const negativePinName = positivelyPinned ? 'NEGATIVE' : 'POSITIVE';
          const bias = positivelyPinned ? electronic.value : -electronic.value;
          const linkedNode = nodesMap.get(negativePinName);
          if (!linkedNode) throw new Error(`DC Source isn't connected correctly!`);

          node.boostVoltageBias(bias);

          linkedNode.info.forEach(info => {
            node.info.add({ ...info });

            if (edge.electronic.is(EC.DCSource)) {
              edge.nodesMap.set(pinName, node);
            }

            if (node.edgeMap.has(info.edgeID)) {
              const pinInfoMap = node.edgeMap.get(info.edgeID) as PinInfoMap;
              pinInfoMap.set(info.pinName, info);
            } else {
              node.edgeMap.set(info.edgeID, new Map([[info.pinName, info]]));
            }
          });

          // Making sure that 'linkedNode' is the same as 'node'
          linkedNode.isSupernode = true;
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

  public DCPropagation() {
    let isConverged = false;

    let traverseFromEdge = (edge: Edge) => {
      if (!Number.isNaN(edge.current)) return;
      const { electronic: e } = edge;

      if (e.is(EC.Ground) || e.is(EC.Resistor)) {
        const ok = E[e.name].deriveCurrent(edge);
        if (!ok) isConverged = false;
        return;
      }

      else if (e.is(EC.DCSource)) {
        isConverged = false;
        const node = edge.nodesMap.get('POSITIVE') as Node;
        if (Number.isNaN(node.voltage)) {
          isConverged = false;
          return;
        }

        const positivePin = edge.pinsMap.get('POSITIVE') as PinInfo;
        const negativePin = edge.pinsMap.get('NEGATIVE') as PinInfo;

        const equipotentialPins =
          Array.from(node.info).filter(({ bias, edgeID }) =>
            bias === positivePin.bias && edgeID !== edge.id
          );

        /* Apply KCL */
        let sourceCurrent = 0;
        for (let i = 0; i < equipotentialPins.length; i += 1) {
          const pin = equipotentialPins[i];
          const edge = this.graph.findEdge(pin.edgeID);
          if (Number.isNaN(edge.current)) {
            isConverged = false;
            return;
          }

          sourceCurrent += (pin.currentFlow === CurrentFlow.INWARD) ?
            edge.current : -edge.current;
        };

        edge.current = sourceCurrent;
        if (sourceCurrent > 0) {
          positivePin.currentFlow = CurrentFlow.OUTWARD;
          negativePin.currentFlow = CurrentFlow.INWARD;
        } else {
          positivePin.currentFlow = CurrentFlow.INWARD;
          negativePin.currentFlow = CurrentFlow.OUTWARD;
        }
      }

      else throw new Error(`${e.name} isn't handled in DC Propagation!`);
    };

    while (!isConverged) {
      isConverged = true;
      this.graph.edges.forEach(traverseFromEdge);
    }
  }

  public nodalAnalysis() {
    if (this.graph.nodes.size === 2) {
      this.deriveSingleNodeEquation();
    } else {
      this.deriveNodeEquations();
    }
  }

  private deriveSingleNodeEquation() {
    // 1. Derive node equation based on one of the two node
    const node = Array.from(this.graph.nodes)[0];

    console.log(node);

    // 2. Plug in the ground value
    // 3. Construct the equation and solve it 
  }

  private deriveNodeEquations() {
    console.log('TODO: implement this!');
    // 1. Derive node equations based on each node
    // 2. Construct the equation and solve it
  }
}
