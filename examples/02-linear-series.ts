import Circuit from '../lib/Circuit';
import { createElectronic, EC } from '../lib/Electronic';

/*
 *  Circuit Layout:
 *  [ a  a  a  a  a  a  a ] R: resistor
 *  [ a +n  R  n  R  n  a ] S: DC Source
 *  [ a  S  a  a  a  w  a ] G: Ground
 *  [ a -n  w  n  w  w  a ]
 *  [ a  a  a  G  a  a  a ]
 */

/* Circuit Implementation */
const circuit = new Circuit(7, 5);
const resistor1 = createElectronic(EC.Resistor, { coordinate: [2, 1] });
const resistor2 = createElectronic(EC.Resistor, { coordinate: [4, 1] });
const source = createElectronic(EC.DCSource, { coordinate : [1, 2]});
source.rotate();
const ground = createElectronic(EC.Ground, { coordinate: [3, 4] });

circuit.appendElectronics(resistor1);
circuit.appendElectronics(resistor2);
circuit.appendElectronics(source);
circuit.appendElectronics(ground);

circuit.addJoint([5, 1], [5, 2]);
circuit.addJoint([5, 2], [5, 3]);
circuit.addJoint([5, 3], [4, 3]);
circuit.addJoint([4, 3], [3, 3]);
circuit.addJoint([3, 3], [2, 3]);
circuit.addJoint([2, 3], [1, 3]);

/* Expectations */
// Phase 1. Graph Creation
const graph = new Circuit.Graph();
const e1 = graph.createEdge(resistor1);
const e2 = graph.createEdge(resistor2);
const e3 = graph.createEdge(source);
const e4 = graph.createEdge(ground);

const n1 = graph.createNode();
e1.connect(n1, '1');
e3.connect(n1, 'POSITIVE');

const n2 = graph.createNode();
e1.connect(n2, '2');
e2.connect(n2, '1');

const n3 = graph.createNode();
e2.connect(n3, '2');
e4.connect(n3);
e3.connect(n3, 'NEGATIVE');

// Phase 2. Simulation - Supernode Propagation
const supernodePropagatedGraph = new Circuit.Graph();
const supe1 = supernodePropagatedGraph.createEdge(resistor1);
const supe2 = supernodePropagatedGraph.createEdge(resistor2);
const supe3 = supernodePropagatedGraph.createEdge(source);
const supe4 = supernodePropagatedGraph.createEdge(ground);

const supn1 = supernodePropagatedGraph.createNode();
supn1.isSupernode = true;
supe1.connect(supn1, '1', +10);
supe2.connect(supn1, '2');
supe3.connect(supn1, 'POSITIVE', +10);
supe3.connect(supn1, 'NEGATIVE');
supe4.connect(supn1);

const supn2 = supernodePropagatedGraph.createNode();
supe1.connect(supn2, '2');
supe2.connect(supn2, '1');

export default {
  circuit,
  components: {
    resistor1,
    resistor2,
    source,
    ground,
  },
  expected: {
    graph,
    supernodePropagatedGraph,
  },
};
