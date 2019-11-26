import Circuit from '../lib/Circuit';
import Unit from '../lib/Circuit.Unit';
import { Connection } from '../lib/Circuit.Connection';
import { CurrentFlow } from '../lib/Circuit.Graph';
import * as helper from './helper';

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

const components = helper.setElectronics(circuit, [
  ['resistor1', 'R', [2, 1]],
  ['resistor2', 'R', [4, 1]],
  ['source', 'DCV', [1, 2], , 1],
  ['ground', 'GND', [3, 4]],
]);

const { resistor1, resistor2, source, ground } = components;

helper.setPath(circuit, [
  [5, 1], [5, 2], [5, 3], [4, 3], [3, 3], [2, 3], [1, 3],
]);

/* Expectations */
// Phase 0. Circuit Layout
const layout = helper.createLayout([7, 5])
  .withElectronics([resistor1, resistor2, source, ground])
  .unit([1, 1])
    .right.is(resistor1, '1')
    .bottom.is(source, 'POSITIVE')
  .unit([3, 1])
    .left.is(resistor1, '2')
    .right.is(resistor2, '1')
  .unit([5, 1])
    .left.is(resistor2, '2')
  .wire([[5, 2], [5, 3], [4, 3]]).to([3, 3])
    .bottom.is(ground, '')
  .wire([[2, 3]]).to([1, 3])
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

// Phase 3. Simulation - Nodal Analysis (== 2 node case)
const nodalAnalyzedGraph = new Circuit.Graph();
const nae1 = nodalAnalyzedGraph.createEdge(resistor1);
const nae2 = nodalAnalyzedGraph.createEdge(resistor2);
const nae3 = nodalAnalyzedGraph.createEdge(source);
const nae4 = nodalAnalyzedGraph.createEdge(ground);

const nan1 = nodalAnalyzedGraph.createNode();
nan1.isSupernode = true;
nan1.voltage = 0;
nae1.connect(nan1, '1', +10);
nae2.connect(nan1, '2');
nae3.connect(nan1, 'POSITIVE', +10);
nae3.connect(nan1, 'NEGATIVE');
nae4.connect(nan1);

const nan2 = nodalAnalyzedGraph.createNode();
nan2.voltage = 5;
nae1.connect(nan2, '2');
nae2.connect(nan2, '1');

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
dcpn1.voltage = 0;
dcpe1.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpe2.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpe3.connect(dcpn1, 'POSITIVE', +10, CurrentFlow.OUTWARD);
dcpe3.connect(dcpn1, 'NEGATIVE', 0, CurrentFlow.INWARD);
dcpe4.connect(dcpn1);

const dcpn2 = DCPropagatedGraph.createNode();
dcpn2.voltage = 5;
dcpe1.connect(dcpn2, '2', 0, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn2, '1', 0, CurrentFlow.INWARD);

// Phase 5. Map Propagated Graph to Circuit Layout
const mappedLayout = helper.createLayout([7, 5])
  .withElectronics([resistor1, resistor2, source, ground])
  .unit([1, 1]).voltage(10)
    .right.is(resistor1, '1')
    .bottom.is(source, 'POSITIVE')
  .unit([3, 1]).voltage(5)
    .left.is(resistor1, '2')
    .right.is(resistor2, '1')
  .unit([5, 1]).voltage(0)
    .left.is(resistor2, '2')
  .wire([[5, 2], [5, 3], [4, 3]]).to([3, 3])
    .bottom.is(ground, '')
  .wire([[2, 3]]).to([1, 3])
    .top.is(source, 'NEGATIVE')
  .result;

// TODO: Refactor current setup test
((mappedLayout[1][1] as Unit).bottom as Connection).current = 0.005;
((mappedLayout[1][1] as Unit).bottom as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][1] as Unit).right as Connection).current = 0.005;
((mappedLayout[1][1] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[1][3] as Unit).left as Connection).current = 0.005;
((mappedLayout[1][3] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][3] as Unit).right as Connection).current = 0.005;
((mappedLayout[1][3] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[1][5] as Unit).left as Connection).current = 0.005;
((mappedLayout[1][5] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][5] as Unit).bottom as Connection).current = 0.005;
((mappedLayout[1][5] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[2][5] as Unit).top as Connection).current = 0.005;
((mappedLayout[2][5] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[2][5] as Unit).bottom as Connection).current = 0.005;
((mappedLayout[2][5] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[3][5] as Unit).top as Connection).current = 0.005;
((mappedLayout[3][5] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][5] as Unit).left as Connection).current = 0.005;
((mappedLayout[3][5] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[3][4] as Unit).right as Connection).current = 0.005;
((mappedLayout[3][4] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][4] as Unit).left as Connection).current = 0.005;
((mappedLayout[3][4] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[3][3] as Unit).right as Connection).current = 0.005;
((mappedLayout[3][3] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][3] as Unit).left as Connection).current = 0.005;
((mappedLayout[3][3] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;
((mappedLayout[3][3] as Unit).bottom as Connection).current = 0;
((mappedLayout[3][3] as Unit).bottom as Connection).currentFlow = CurrentFlow.NEUTRAL;

((mappedLayout[3][2] as Unit).right as Connection).current = 0.005;
((mappedLayout[3][2] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][2] as Unit).left as Connection).current = 0.005;
((mappedLayout[3][2] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[3][1] as Unit).right as Connection).current = 0.005;
((mappedLayout[3][1] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][1] as Unit).top as Connection).current = 0.005;
((mappedLayout[3][1] as Unit).top as Connection).currentFlow = CurrentFlow.OUTWARD;

export default {
  circuit,
  components,
  expected: {
    layout,
    graph,
    supernodePropagatedGraph,
    nodalAnalyzedGraph,
    DCPropagatedGraph,
    mappedLayout,
  },
};
