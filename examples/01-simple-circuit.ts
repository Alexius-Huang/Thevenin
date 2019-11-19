import Circuit from '../lib/Circuit';
import { createElectronic, EC } from '../lib/Electronic';

// Circuit Layout:
// [ a  a  a  a  a ] R: resistor
// [ a +n  R  n  a ] S: DC Source
// [ a  S  a  w  a ] G: Ground
// [ a -n  n  w  a ]
// [ a  a  G  a  a ]

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

export default {
  circuit,
  components: {
    resistor,
    source,
    ground,
  },
};
