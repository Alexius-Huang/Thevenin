import Circuit from '../lib/Circuit';
import { createElectronic, EC } from '../lib/Electronic';
import CircuitSimulation from '../lib/Circuit.Simulation';

/*
 *  Circuit Layout:
 *  [ a  a  a  a  a  a  a ] R: resistor
 *  [ a +n  R  n  R  n  a ] S: DC Source
 *  [ a  S  a  R  a  R  a ] G: Ground
 *  [ a -n  w  n  w  n  a ]
 *  [ a  a  a  a  a  G  a ]
 */


/* Circuit Implementation */
const circuit = new Circuit(7, 5);
const resistor1 = createElectronic(EC.Resistor, { coordinate: [2, 1] });
const resistor2 = createElectronic(EC.Resistor, { coordinate: [3, 2] });
resistor2.rotate();
const resistor3 = createElectronic(EC.Resistor, { coordinate: [4, 1] });
const resistor4 = createElectronic(EC.Resistor, { coordinate: [5, 2] });
resistor4.rotate();
const source = createElectronic(EC.DCSource, { coordinate: [1, 2] });
source.rotate();
const ground = createElectronic(EC.Ground, { coordinate: [5, 4] });

const components = {
  resistor1,
  resistor2,
  resistor3,
  resistor4,
  source,
  ground
};

Object.values(components).forEach(e => circuit.appendElectronics(e));

circuit.addJoint([1, 3], [2, 3]);
circuit.addJoint([2, 3], [3, 3]);
circuit.addJoint([3, 3], [4, 3]);
circuit.addJoint([4, 3], [5, 3]);

/* Expectations */
// Phase 1. Graph Creation
const graph = new Circuit.Graph();
const e1 = graph.createEdge(resistor1);
const e2 = graph.createEdge(resistor2);
const e3 = graph.createEdge(resistor3);
const e4 = graph.createEdge(resistor4);
const e5 = graph.createEdge(source);
const e6 = graph.createEdge(ground);

const n1 = graph.createNode();
e1.connect(n1, '1');
e5.connect(n1, 'POSITIVE');

const n2 = graph.createNode();
e1.connect(n2, '2');
e2.connect(n2, '1');
e3.connect(n2, '1');

const n3 = graph.createNode();
e3.connect(n3, '2');
e4.connect(n3, '1');

const n4 = graph.createNode();
e2.connect(n4, '2');
e4.connect(n4, '2');
e5.connect(n4, 'NEGATIVE');
e6.connect(n4);

// Phase 2. Simulation - Supernode Propagation
const supernodePropagatedGraph = new Circuit.Graph();
const supe1 = supernodePropagatedGraph.createEdge(resistor1);
const supe2 = supernodePropagatedGraph.createEdge(resistor2);
const supe3 = supernodePropagatedGraph.createEdge(resistor3);
const supe4 = supernodePropagatedGraph.createEdge(resistor4);
const supe5 = supernodePropagatedGraph.createEdge(source);
const supe6 = supernodePropagatedGraph.createEdge(ground);

const supn1 = supernodePropagatedGraph.createNode();
supe1.connect(supn1, '1', +10);
supe5.connect(supn1, 'POSITIVE', +10);
supe5.connect(supn1, 'NEGATIVE');
supe2.connect(supn1, '2');
supe4.connect(supn1, '2');
supe6.connect(supn1);

const supn2 = supernodePropagatedGraph.createNode();
supe1.connect(supn2, '2');
supe2.connect(supn2, '1');
supe3.connect(supn2, '1');

const supn3 = supernodePropagatedGraph.createNode();
supe3.connect(supn3, '2');
supe4.connect(supn3, '1');

export default {
  circuit,
  components,
  expected: {
    graph,
    supernodePropagatedGraph,
  },
};
