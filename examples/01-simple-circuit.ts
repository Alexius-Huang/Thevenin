import Circuit from '../lib/Circuit';
import Unit from '../lib/Circuit.Unit';
import { Connection } from '../lib/Circuit.Connection';
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
const layout = helper.createLayout([5, 5])
  .withElectronics([source, ground, resistor])
  .unit([1, 1])
    .right.is(resistor, '1')
    .bottom.is(source, 'POSITIVE')
  .unit([3, 1])
    .left.is(resistor, '2')
  .wire([[3, 2], [3, 3]]).to([2, 3])
    .bottom.is(ground, '')
  .connectToUnit([1, 3])
    .top.is(source, 'NEGATIVE')
  .result;

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

// Phase 5. Map Propagated Graph to Circuit Layout
const mappedLayout = helper.createLayout([5, 5])
  .withElectronics([source, ground, resistor])
  .unit([1, 1]).voltage(10)
    .right.is(resistor, '1')
    .bottom.is(source, 'POSITIVE')
  .unit([3, 1]).voltage(0)
    .left.is(resistor, '2')
  .wire([[3, 2], [3, 3]]).to([2, 3])
    .bottom.is(ground, '')
  .connectToUnit([1, 3])
    .top.is(source, 'NEGATIVE')
  .result;

// TODO: Refactor current setup test
((mappedLayout[1][1] as Unit).bottom as Connection).current = 0.01;
((mappedLayout[1][1] as Unit).bottom as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][1] as Unit).right as Connection).current = 0.01;
((mappedLayout[1][1] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[1][3] as Unit).left as Connection).current = 0.01;
((mappedLayout[1][3] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][3] as Unit).bottom as Connection).current = 0.01;
((mappedLayout[1][3] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[2][3] as Unit).top as Connection).current = 0.01;
((mappedLayout[2][3] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[2][3] as Unit).bottom as Connection).current = 0.01;
((mappedLayout[2][3] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[3][3] as Unit).top as Connection).current = 0.01;
((mappedLayout[3][3] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][3] as Unit).left as Connection).current = 0.01;
((mappedLayout[3][3] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[3][2] as Unit).right as Connection).current = 0.01;
((mappedLayout[3][2] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][2] as Unit).left as Connection).current = 0.01;
((mappedLayout[3][2] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;
((mappedLayout[3][2] as Unit).bottom as Connection).current = 0;
((mappedLayout[3][2] as Unit).bottom as Connection).currentFlow = CurrentFlow.NEUTRAL;

((mappedLayout[3][1] as Unit).right as Connection).current = 0.01;
((mappedLayout[3][1] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][1] as Unit).top as Connection).current = 0.01;
((mappedLayout[3][1] as Unit).top as Connection).currentFlow = CurrentFlow.OUTWARD;

export default {
  circuit,
  components,
  expected: {
    layout,
    graph,
    supernodePropagatedGraph,
    DCPropagatedGraph,
    mappedLayout,
  },
};
