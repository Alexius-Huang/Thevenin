import Graph, { Node, Edge, PinInfoMap, PinInfo, CurrentFlow } from './Circuit.Graph';
import Equation from './Circuit.Equation';
import E from './electronics';
import { EC } from './Electronic';
import SimultaneousEquations from './Circuit.SimultaneousEquations';

export default class CircuitSimulation {
  constructor(public graph: Graph) {}

  public run() {
    this.supernodePropagation();
    this.graph.nodes.size > 1 && this.nodalAnalysis();
    this.DCPropagation();
  }

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
      this.solveSingleNodeCircuit();
    } else {
      this.solveMultiNodeCircuit();
    }
  }

  private solveSingleNodeCircuit() {
    let conductance1 = 0, conductance2 = 0, constant = 0;
    let groundNodeLabel: string = 'V1';

    const [node1, node2] = Array.from(this.graph.nodes);
    const labelNodeMap = new Map<string, Node>([
      ['V1', node1],
      ['V2', node2],
    ]);

    node1.info.forEach(info => {
      const edge = this.graph.findEdge(info.edgeID);
      const { electronic: e } = edge;

      if (e.is(EC.Resistor)) {
        const conductance = (1 / e.value);
        conductance1 += conductance;
        constant -= info.bias * conductance;
      } else if (e.is(EC.Ground)) {
        node1.voltage = 0;
        groundNodeLabel = 'V1';
      }
    });

    node2.info.forEach(info => {
      const edge = this.graph.findEdge(info.edgeID);
      const { electronic: e } = edge;

      if (e.is(EC.Resistor)) {
        const conductance = (1 / e.value);
        conductance2 += conductance;
        constant -= info.bias * conductance;
      }
      else if (e.is(EC.Ground)) {
        node1.voltage = 0;
        groundNodeLabel = 'V2';
      }
    });
    // Set node1 as 'reference node'
    conductance2 = -conductance2;

    // Create simple nodal equation
    const eq = new Equation();
    eq.unknown('V1', conductance1)
      .unknown('V2', conductance2)
      .constant(constant);

    const knownInfo = { [groundNodeLabel]: 0 };
    const solutions = Object.assign(eq.solve(knownInfo), knownInfo);
    Object.keys(solutions).forEach(label => {
      (labelNodeMap.get(label) as Node).voltage = solutions[label];
    });
  }

  private solveMultiNodeCircuit() {
    const nodesArr = Array.from(this.graph.nodes);
    const nodeIndexMap = new Map<Node, number>();
    let indexOfGround = 0;

    nodesArr.forEach((node, i) => {
      nodeIndexMap.set(node, i);
    });

    const nodesCount = nodesArr.length;
    const equationCoefficientArray: Array<Array<number>> = [];
    const constantArray = Array(nodesCount).fill(0);
    nodesArr.forEach((node, i) => {
      const conductanceArr = Array(nodesCount).fill(0);

      node.info.forEach(info => {
        const edge = this.graph.findEdge(info.edgeID);
        const e = edge.electronic;

        if (e.is(EC.Resistor)) {
          const conductance = (1 / e.value);
          conductanceArr[i] += conductance;

          const biasCausedConstant = info.bias * conductance;
          constantArray[i] -= biasCausedConstant;

          const connectedNode = edge.nodesMap.get(info.pinName === '1' ? '2' : '1') as Node;
          const connectedNodeIndex = nodeIndexMap.get(connectedNode) as number;

          conductanceArr[connectedNodeIndex] -= conductance;
          constantArray[connectedNodeIndex] += biasCausedConstant;
        } else if (e.is(EC.Ground)) {
          indexOfGround = i;
        }
      });

      equationCoefficientArray.push(conductanceArr);
    });

    /* Construct the simultaneous equations based on derived coefficient */
    const simEqs = new SimultaneousEquations();
    equationCoefficientArray.forEach((equationCoefficient, i) => {
      const eq = new Equation();

      equationCoefficient.forEach((coeff, i) => {
        eq.unknown(`V${i}`, coeff);
      });

      eq.constant(constantArray[i]);
      simEqs.addEquation(eq);
    });

    /* Assign voltage to each node */
    const solution: { [key: string]: number } = simEqs.solve();
    const referencedVoltageFromGround = solution[`V${indexOfGround}`];
    nodesArr.forEach((node, i) => {
      node.voltage = solution[`V${i}`] - referencedVoltageFromGround;
    });
  }
}
