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
const graph = new Circuit.Graph();
const n1 = graph.createNode(resistor1);
const n2 = graph.createNode(resistor2);
const n3 = graph.createNode(source);
const n4 = graph.createNode(ground);

const e1 = graph.createEdge();
n1.connect(e1, '1');
n3.connect(e1, 'POSITIVE');

const e2 = graph.createEdge();
n1.connect(e2, '2');
n2.connect(e2, '1');

const e3 = graph.createEdge();
n2.connect(e3, '2');
n4.connect(e3);
n3.connect(e3, 'NEGATIVE');

export default {
  circuit,
  components: {
    resistor1,
    resistor2,
    source,
    ground,
  },
  expected: { graph },
};
