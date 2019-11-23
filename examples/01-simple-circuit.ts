import Circuit from '../lib/Circuit';
import { createElectronic, EC } from '../lib/Electronic';
import { CurrentFlow } from '../lib/Circuit.Graph';

/*
 *  Circuit Layout:
 *  [ a  a  a  a  a ] R: resistor
 *  [ a +n  R  n  a ] S: DC Source
 *  [ a  S  a  w  a ] G: Ground
 *  [ a -n  n  w  a ]
 *  [ a  a  G  a  a ]
 */

/* Circuit Implementation */
const circuit = new Circuit(5, 5);
const resistor = createElectronic(EC.Resistor, { coordinate: [2, 1] });
const source = createElectronic(EC.DCSource, { coordinate : [1, 2]});
source.rotate();
const ground = createElectronic(EC.Ground, { coordinate: [2, 4] });

circuit.appendElectronics(resistor);
circuit.appendElectronics(source);
circuit.appendElectronics(ground);

circuit.addJoint([3, 1], [3, 2]);
circuit.addJoint([3, 2], [3, 3]);
circuit.addJoint([3, 3], [2, 3]);
circuit.addJoint([2, 3], [1, 3]);

/* Expectations */
// Phase 1. Graph Creation
const graph = new Circuit.Graph();
const e1 = graph.createEdge(resistor);
const e2 = graph.createEdge(source);
const e3 = graph.createEdge(ground);

const n1 = graph.createNode();
e1.connect(n1, '1');
e2.connect(n1, 'POSITIVE');

const n2 = graph.createNode();
e1.connect(n2, '2');
e2.connect(n2, 'NEGATIVE');
e3.connect(n2);

// Phase 2. Simulation - Supernode Propagation
const supernodePropagatedGraph = new Circuit.Graph();
const supe1 = supernodePropagatedGraph.createEdge(resistor);
const supe2 = supernodePropagatedGraph.createEdge(source);
const supe3 = supernodePropagatedGraph.createEdge(ground);

const supn1 = supernodePropagatedGraph.createNode();
supn1.isSupernode = true;

supe1.connect(supn1, '1', +10);
supe1.connect(supn1, '2');
supe2.connect(supn1, 'POSITIVE', +10);
supe2.connect(supn1, 'NEGATIVE');
supe3.connect(supn1);

// Phase 3. Simulation - DC Propagation
const DCPropagatedGraph = new Circuit.Graph();
const dcpe1 = DCPropagatedGraph.createEdge(resistor);
const dcpe2 = DCPropagatedGraph.createEdge(source);
const dcpe3 = DCPropagatedGraph.createEdge(ground);
dcpe1.current = dcpe2.current = 0.01;
dcpe3.current = 0;

const dcpn1 = DCPropagatedGraph.createNode();
dcpn1.voltage = 0;
dcpn1.isSupernode = true;

dcpe1.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpe1.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn1, 'POSITIVE', +10, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn1, 'NEGATIVE', 0, CurrentFlow.INWARD);
dcpe3.connect(dcpn1);

export default {
  circuit,
  components: {
    resistor,
    source,
    ground,
  },
  expected: {
    graph,
    supernodePropagatedGraph,
    DCPropagatedGraph,
  },
};
