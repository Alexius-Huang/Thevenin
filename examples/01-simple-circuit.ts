import Circuit from '../lib/Circuit';
import Unit from '../lib/Circuit.Unit';
import { CurrentFlow } from '../lib/Circuit.Graph';
import * as helper from './helper';

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
const components = helper.setElectronics(circuit, [
  ['resistor', 'R', [2, 1]],
  ['source', 'DCV', [1, 2], , 1],
  ['ground', 'GND', [2, 4]]
]);
helper.setPath(circuit, [
  [3, 1], [3, 2], [3, 3], [2, 3], [1, 3]
]);

const { resistor, source, ground } = components;

/* Expectations */
// Phase 0. Circuit Layout
const layout = Array.from(Array(5)).map(() =>
  Array.from(Array(5)).map(() => new Unit())
);
layout[1][1].connect('right', { electronic: resistor, pinName: '1' });
layout[1][1].connect('bottom', { electronic: source, pinName: 'POSITIVE' });
layout[1][2].setElectronic(resistor.id);
layout[1][3].connect('left', { electronic: resistor, pinName: '2' });
layout[1][3].connect('bottom', layout[2][3]);
layout[2][3].connect('bottom', layout[3][3]);
layout[3][3].connect('left', layout[3][2]);
layout[3][2].connect('left', layout[3][1]);
layout[3][2].connect('bottom', { electronic: ground, pinName: '' });
layout[3][1].connect('top', { electronic: source, pinName: 'NEGATIVE' });
layout[2][1].setElectronic(source.id);
layout[4][2].setElectronic(ground.id);

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

// Phase 3. Simulation - Nodal Analysis [SKIPPABLE]

// Phase 4. Simulation - DC Propagation
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
  components,
  expected: {
    layout,
    graph,
    supernodePropagatedGraph,
    DCPropagatedGraph,
  },
};
