import Circuit from '../lib/Circuit';
import { createElectronic, EC } from '../lib/Electronic';

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

export default {
  circuit,
  components: {
    resistor1,
    resistor2,
    source,
    ground,
  },
  expected: { graph }
};
