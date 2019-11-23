import Circuit from '../lib/Circuit';
import { createElectronic, EC } from '../lib/Electronic';
import { CurrentFlow } from '../lib/Circuit.Graph';

/*
 *  Circuit Layout:
 *  [ a  a  a  a  a  a  a ] R: resistor
 *  [ a +n  w  n  w  n  a ] S: DC Source
 *  [ a  S  a  R  a  R  a ] G: Ground
 *  [ a -n  w  n  w  n  a ]
 *  [ a  a  a  a  a  G  a ]
 */


/* Circuit Implementation */
const circuit = new Circuit(7, 5);
const resistor1 = createElectronic(EC.Resistor, { coordinate: [3, 2] });
resistor1.rotate();
const resistor2 = createElectronic(EC.Resistor, { coordinate: [5, 2] })
resistor2.rotate();
const source = createElectronic(EC.DCSource, { coordinate : [1, 2]});
source.rotate();
const ground = createElectronic(EC.Ground, { coordinate: [5, 4] });

circuit.appendElectronics(resistor1);
circuit.appendElectronics(resistor2);
circuit.appendElectronics(source);
circuit.appendElectronics(ground);

circuit.addJoint([1, 1], [2, 1]);
circuit.addJoint([2, 1], [3, 1]);
circuit.addJoint([3, 1], [4, 1]);
circuit.addJoint([4, 1], [5, 1]);

circuit.addJoint([1, 3], [2, 3]);
circuit.addJoint([2, 3], [3, 3]);
circuit.addJoint([3, 3], [4, 3]);
circuit.addJoint([4, 3], [5, 3]);

/* Expectations */
// Phase 1. Graph Creation
const graph = new Circuit.Graph();
const e1 = graph.createEdge(resistor1);
const e2 = graph.createEdge(resistor2);
const e3 = graph.createEdge(source);
const e4 = graph.createEdge(ground);

const n1 = graph.createNode();
e1.connect(n1, '1');
e2.connect(n1, '1');
e3.connect(n1, 'POSITIVE');

const n2 = graph.createNode();
e1.connect(n2, '2');
e2.connect(n2, '2');
e3.connect(n2, 'NEGATIVE');
e4.connect(n2);

// Phase 2. Simulation - Supernode Propagation
const supernodePropagatedGraph = new Circuit.Graph();
const supe1 = supernodePropagatedGraph.createEdge(resistor1);
const supe2 = supernodePropagatedGraph.createEdge(resistor2);
const supe3 = supernodePropagatedGraph.createEdge(source);
const supe4 = supernodePropagatedGraph.createEdge(ground);

const supn1 = supernodePropagatedGraph.createNode();
supn1.isSupernode = true;
supe1.connect(supn1, '1', +10);
supe1.connect(supn1, '2');
supe2.connect(supn1, '1', +10);
supe2.connect(supn1, '2');
supe3.connect(supn1, 'POSITIVE', +10);
supe3.connect(supn1, 'NEGATIVE');
supe4.connect(supn1);

// Phase 3. Simulation - DC Propagation
const DCPropagatedGraph = new Circuit.Graph();
const dcpe1 = DCPropagatedGraph.createEdge(resistor1);
const dcpe2 = DCPropagatedGraph.createEdge(resistor2);
const dcpe3 = DCPropagatedGraph.createEdge(source);
const dcpe4 = DCPropagatedGraph.createEdge(ground);
dcpe1.current = dcpe2.current = 0.01;
dcpe3.current = 0.02;
dcpe4.current = 0;

const dcpn1 = DCPropagatedGraph.createNode();
dcpn1.voltage = 0;
dcpn1.isSupernode = true;

dcpe1.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpe1.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpe2.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpe3.connect(dcpn1, 'POSITIVE', +10, CurrentFlow.OUTWARD);
dcpe3.connect(dcpn1, 'NEGATIVE', 0, CurrentFlow.INWARD);
dcpe4.connect(dcpn1);

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
    DCPropagatedGraph,
  },
};
