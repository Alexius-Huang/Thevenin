import Graph, { Node, Edge, PinInfoMap, PinInfo, CurrentFlow } from './Circuit.Graph';
import { EC } from './Electronic';
import * as E from './electronics';

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
          node.isSupernode = true;

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

      if (edge.electronic.is(EC.Ground)) {
        const node = edge.pinsMap.get('') as Node;
        E.Ground.deriveCurrent(edge, { '': node });
      }

      else if (edge.electronic.is(EC.Resistor)) {
        const node1 = edge.pinsMap.get('1') as Node;
        const node2 = edge.pinsMap.get('2') as Node;
        if (Number.isNaN(node1.voltage) || Number.isNaN(node2.voltage)) {
          isConverged = false;
          return;
        }

        E.Resistor.deriveCurrent(edge, { '1': node1, '2': node2 });
      }

      else if (edge.electronic.is(EC.DCSource)) {
        isConverged = false;
        const node = edge.pinsMap.get('POSITIVE') as Node;
        if (Number.isNaN(node.voltage)) {
          isConverged = false;
          return;
        }

        const targetBiasValue = (
          (node.edgeMap.get(edge.id) as PinInfoMap).get('POSITIVE') as PinInfo
        ).bias;

        let positivePin: PinInfo, negativePin: PinInfo;
        positivePin = negativePin = { edgeID: '', pinName: '', bias: NaN, currentFlow: CurrentFlow.NEUTRAL };

        const equipotentialPins = Array.from(node.info)
          .filter(pinInfo => {
            /* Find the pins of the DC source */
            if (pinInfo.edgeID === edge.id) {
              if (pinInfo.pinName === 'POSITIVE') {
                positivePin = pinInfo;
              } else {
                negativePin = pinInfo;
              }
              return false;
            }

            return pinInfo.bias === targetBiasValue;
          });

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
    };

    while (!isConverged) {
      isConverged = true;
      this.graph.edges.forEach(traverseFromEdge);
    }
  }
}
