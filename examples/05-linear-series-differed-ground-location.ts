import Circuit from '../lib/Circuit';
import { CurrentFlow } from '../lib/Circuit.Graph';
import * as helper from './helper';

/*
 *  Circuit Layout:
 *  [ a  a  a  a  a  a  a ] R: resistor
 *  [ a +n  R  n  R  n  a ] S: DC Source
 *  [ a  S  a  G  a  w  a ] G: Ground
 *  [ a -n  w  w  w  w  a ]
 *  [ a  a  a  a  a  a  a ]
 */

/* Circuit Implementation */
const circuit = new Circuit(7, 5);
const components = helper.setElectronics(circuit, [
  ['resistor1', 'R', [2, 1]],
  ['resistor2', 'R', [4, 1]],
  ['source', 'DCV', [1, 2], , 1],
  ['ground', 'GND', [3, 2]]
]);

const { resistor1, resistor2, source, ground } = components;

helper.setPath(circuit, [
  [5, 1], [5, 2], [5, 3], [4, 3], [3, 3], [2, 3], [1, 3]
]);

/* Expectations */
// Phase 0. Circuit Layout
const layout = helper.createLayout([7, 5])
  .withElectronics([resistor1, resistor2, source, ground])
  .unit([1, 1])
    .bottom.is(source, 'POSITIVE')
    .right.is(resistor1, '1')
  .unit([3, 1])
    .left.is(resistor1, '2')
    .right.is(resistor2, '1')
    .bottom.is(ground, '')
  .unit([5, 1])
    .left.is(resistor2, '2')
  .wire([[5, 2], [5, 3], [4, 3], [3, 3], [2, 3]]).to([1, 3])
    .top.is(source, 'NEGATIVE')
  .result;

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
e4.connect(n2);

const n3 = graph.createNode();
e2.connect(n3, '2');
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

const supn2 = supernodePropagatedGraph.createNode();
supe1.connect(supn2, '2');
supe2.connect(supn2, '1');
supe4.connect(supn2);

// Phase 3. Simulation - Nodal Analysis (== 2 node case)
const nodalAnalyzedGraph = new Circuit.Graph();
const nae1 = nodalAnalyzedGraph.createEdge(resistor1);
const nae2 = nodalAnalyzedGraph.createEdge(resistor2);
const nae3 = nodalAnalyzedGraph.createEdge(source);
const nae4 = nodalAnalyzedGraph.createEdge(ground);

const nan1 = nodalAnalyzedGraph.createNode();
nan1.isSupernode = true;
nan1.voltage = -5;
nae1.connect(nan1, '1', +10);
nae2.connect(nan1, '2');
nae3.connect(nan1, 'POSITIVE', +10);
nae3.connect(nan1, 'NEGATIVE');

const nan2 = nodalAnalyzedGraph.createNode();
nan2.voltage = 0;
nae1.connect(nan2, '2');
nae2.connect(nan2, '1');
nae4.connect(nan2);

// Phase 4. Simulation - DC Propagation
const DCPropagatedGraph = new Circuit.Graph();
const dcpe1 = DCPropagatedGraph.createEdge(resistor1);
const dcpe2 = DCPropagatedGraph.createEdge(resistor2);
const dcpe3 = DCPropagatedGraph.createEdge(source);
const dcpe4 = DCPropagatedGraph.createEdge(ground);
dcpe1.current = dcpe2.current = dcpe3.current = 0.005;
dcpe4.current = 0;

const dcpn1 = DCPropagatedGraph.createNode();
dcpn1.isSupernode = true;
dcpn1.voltage = -5;
dcpe1.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpe2.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpe3.connect(dcpn1, 'POSITIVE', +10, CurrentFlow.OUTWARD);
dcpe3.connect(dcpn1, 'NEGATIVE', 0, CurrentFlow.INWARD);

const dcpn2 = DCPropagatedGraph.createNode();
dcpn2.voltage = 0;
dcpe1.connect(dcpn2, '2', 0, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn2, '1', 0, CurrentFlow.INWARD);
dcpe4.connect(dcpn2);

export default {
  circuit,
  components,
  expected: {
    layout,
    graph,
    supernodePropagatedGraph,
    nodalAnalyzedGraph,
    DCPropagatedGraph,
  },
};
