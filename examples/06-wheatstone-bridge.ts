import Circuit from '../lib/Circuit';
import Unit from '../lib/Circuit.Unit';
import { Connection } from '../lib/Circuit.Connection';
import { CurrentFlow } from '../lib/Circuit.Graph';
import * as helper from './helper';

/*
 *  Circuit Layout:
 *  [ a  a  a  a  a  a  a ] R: resistor
 *  [ a  w  w  n  w  n  a ] S: DC Source
 *  [ a  n  a  R  a  R  a ] G: Ground
 *  [ a  S  a  n  R  n  a ]
 *  [ a  n  a  R  a  R  a ]
 *  [ a  w  w  n  w  n  a ]
 *  [ a  a  a  G  a  a  a ]
 */

/* Circuit Implementation */
const circuit = new Circuit(7, 7);
const components = helper.setElectronics(circuit, [
  ['resistor1', 'R', [3, 2], , 1],
  ['resistor2', 'R', [3, 4], 3000, 1],
  ['resistor3', 'R', [5, 2], 2000, 1],
  ['resistor4', 'R', [5, 4], 6000, 1],
  ['resistorG', 'R', [4, 3]],
  ['source', 'DCV', [1, 3], , 1],
  ['ground', 'GND', [3, 6]]
]);
const { resistor1, resistor2, resistor3, resistor4, resistorG, source, ground } = components;

helper.setPaths(circuit, [
  [[1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]],
  [[1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]
]);

/* Expectations */
// Phase 0. Circuit Layout
const layout = helper.createLayout([7, 7])
  .withElectronics([resistor1, resistor2, resistor3, resistor4, resistorG, source, ground])
  .unit([1, 2])
    .bottom.is(source, 'POSITIVE')
  .wire([[1, 1], [2, 1]]).to([3, 1])
    .bottom.is(resistor1, '1')
  .wire([[4, 1]]).to([5, 1])
    .bottom.is(resistor3, '1')
  .unit([3, 3])
    .top.is(resistor1, '2')
    .right.is(resistorG, '1')
    .bottom.is(resistor2, '1')
  .unit([5, 3])
    .top.is(resistor3, '2')
    .left.is(resistorG, '2')
    .bottom.is(resistor4, '1')
  .unit([5, 5])
    .top.is(resistor4, '2')
  .wire([[4, 5]]).to([3, 5])
    .top.is(resistor2, '2')
    .bottom.is(ground, '')
  .wire([[2, 5], [1, 5]]).to([1, 4])
    .top.is(source, 'NEGATIVE')
  .result;

// Phase 1. Graph Creation
const graph = new Circuit.Graph();
const e1 = graph.createEdge(resistor1);
const e2 = graph.createEdge(resistor2);
const e3 = graph.createEdge(resistor3);
const e4 = graph.createEdge(resistor4);
const eg = graph.createEdge(resistorG);
const es = graph.createEdge(source);
const egnd = graph.createEdge(ground);

const n1 = graph.createNode();
e1.connect(n1, '1');
e3.connect(n1, '1');
es.connect(n1, 'POSITIVE');

const n2 = graph.createNode();
e1.connect(n2, '2');
e2.connect(n2, '1');
eg.connect(n2, '1');

const n3 = graph.createNode();
e3.connect(n3, '2');
eg.connect(n3, '2');
e4.connect(n3, '1');

const n4 = graph.createNode();
e2.connect(n4, '2');
e4.connect(n4, '2');
es.connect(n4, 'NEGATIVE');
egnd.connect(n4);

// Phase 2. Simulation - Supernode Propagation
const supernodePropagatedGraph = new Circuit.Graph();
const supe1 = supernodePropagatedGraph.createEdge(resistor1);
const supe2 = supernodePropagatedGraph.createEdge(resistor2);
const supe3 = supernodePropagatedGraph.createEdge(resistor3);
const supe4 = supernodePropagatedGraph.createEdge(resistor4);
const supeg = supernodePropagatedGraph.createEdge(resistorG);
const supes = supernodePropagatedGraph.createEdge(source);
const supegnd = supernodePropagatedGraph.createEdge(ground);

const supn1 = supernodePropagatedGraph.createNode();
supn1.isSupernode = true;
supe1.connect(supn1, '1', +10);
supe3.connect(supn1, '1', +10);
supes.connect(supn1, 'POSITIVE', +10);
supe2.connect(supn1, '2');
supe4.connect(supn1, '2');
supes.connect(supn1, 'NEGATIVE');
supegnd.connect(supn1);

const supn2 = supernodePropagatedGraph.createNode();
supe1.connect(supn2, '2');
supe2.connect(supn2, '1');
supeg.connect(supn2, '1');

const supn3 = supernodePropagatedGraph.createNode();
supe3.connect(supn3, '2');
supeg.connect(supn3, '2');
supe4.connect(supn3, '1');

// Phase 3. Simulation - Nodal Analysis
const nodalAnalyzedGraph = new Circuit.Graph();
const nae1 = nodalAnalyzedGraph.createEdge(resistor1);
const nae2 = nodalAnalyzedGraph.createEdge(resistor2);
const nae3 = nodalAnalyzedGraph.createEdge(resistor3);
const nae4 = nodalAnalyzedGraph.createEdge(resistor4);
const naeg = nodalAnalyzedGraph.createEdge(resistorG);
const naes = nodalAnalyzedGraph.createEdge(source);
const naegnd = nodalAnalyzedGraph.createEdge(ground);

const nan1 = nodalAnalyzedGraph.createNode();
nan1.isSupernode = true;
nan1.voltage = 0;
nae1.connect(nan1, '1', +10);
nae3.connect(nan1, '1', +10);
naes.connect(nan1, 'POSITIVE', +10);
nae2.connect(nan1, '2');
nae4.connect(nan1, '2');
naes.connect(nan1, 'NEGATIVE');
naegnd.connect(nan1);

const nan2 = nodalAnalyzedGraph.createNode();
nan2.voltage = 7.5;
nae1.connect(nan2, '2');
nae2.connect(nan2, '1');
naeg.connect(nan2, '1');

const nan3 = nodalAnalyzedGraph.createNode();
nan3.voltage = 7.5;
nae3.connect(nan3, '2');
naeg.connect(nan3, '2');
nae4.connect(nan3, '1');

// Phase 4. Simulation - DC Propagation

const DCPropagatedGraph = new Circuit.Graph();
const dcpe1 = DCPropagatedGraph.createEdge(resistor1);
const dcpe2 = DCPropagatedGraph.createEdge(resistor2);
const dcpe3 = DCPropagatedGraph.createEdge(resistor3);
const dcpe4 = DCPropagatedGraph.createEdge(resistor4);
const dcpeg = DCPropagatedGraph.createEdge(resistorG);
const dcpes = DCPropagatedGraph.createEdge(source);
const dcpegnd = DCPropagatedGraph.createEdge(ground);
dcpe1.current = dcpe2.current = 0.0025;
dcpe3.current = dcpe4.current = 0.00125;
dcpeg.current = dcpegnd.current = 0;
dcpes.current = 0.00375;

const dcpn1 = DCPropagatedGraph.createNode();
dcpn1.isSupernode = true;
dcpn1.voltage = 0;
dcpe1.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpe3.connect(dcpn1, '1', +10, CurrentFlow.INWARD);
dcpes.connect(dcpn1, 'POSITIVE', +10, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpe4.connect(dcpn1, '2', 0, CurrentFlow.OUTWARD);
dcpes.connect(dcpn1, 'NEGATIVE', 0, CurrentFlow.INWARD);
dcpegnd.connect(dcpn1);

const dcpn2 = DCPropagatedGraph.createNode();
dcpn2.voltage = 7.5;
dcpe1.connect(dcpn2, '2', 0, CurrentFlow.OUTWARD);
dcpe2.connect(dcpn2, '1', 0, CurrentFlow.INWARD);
dcpeg.connect(dcpn2, '1');

const dcpn3 = DCPropagatedGraph.createNode();
dcpn3.voltage = 7.5;
dcpe3.connect(dcpn3, '2', 0, CurrentFlow.OUTWARD);
dcpe4.connect(dcpn3, '1', 0, CurrentFlow.INWARD);
dcpeg.connect(dcpn3, '2');

// Phase 5. Map Propagated Graph to Circuit Layout
const mappedLayout = helper.createLayout([7, 7])
  .withElectronics([resistor1, resistor2, resistor3, resistor4, resistorG, source, ground])
  .unit([1, 2]).voltage(10)
    .bottom.is(source, 'POSITIVE')
  .wire([[1, 1], [2, 1]]).to([3, 1])
    .bottom.is(resistor1, '1')
  .wire([[4, 1]]).to([5, 1])
    .bottom.is(resistor3, '1')
  .unit([3, 3]).voltage(7.5)
    .top.is(resistor1, '2')
    .right.is(resistorG, '1')
    .bottom.is(resistor2, '1')
  .unit([5, 3]).voltage(7.5)
    .top.is(resistor3, '2')
    .left.is(resistorG, '2')
    .bottom.is(resistor4, '1')
  .unit([5, 5]).voltage(0)
    .top.is(resistor4, '2')
  .wire([[4, 5]]).to([3, 5])
    .top.is(resistor2, '2')
    .bottom.is(ground, '')
  .wire([[2, 5], [1, 5]]).to([1, 4])
    .top.is(source, 'NEGATIVE')
  .result;

((mappedLayout[2][1] as Unit).bottom as Connection).current = 0.00375;
((mappedLayout[2][1] as Unit).bottom as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[2][1] as Unit).top as Connection).current = 0.00375;
((mappedLayout[2][1] as Unit).top as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[1][1] as Unit).bottom as Connection).current = 0.00375;
((mappedLayout[1][1] as Unit).bottom as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][1] as Unit).right as Connection).current = 0.00375;
((mappedLayout[1][1] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[1][2] as Unit).left as Connection).current = 0.00375;
((mappedLayout[1][2] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][2] as Unit).right as Connection).current = 0.00375;
((mappedLayout[1][2] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[1][3] as Unit).left as Connection).current = 0.00375;
((mappedLayout[1][3] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][3] as Unit).right as Connection).current = 0.00125;
((mappedLayout[1][3] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;  
((mappedLayout[1][3] as Unit).bottom as Connection).current = 0.0025;
((mappedLayout[1][3] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[1][4] as Unit).left as Connection).current = 0.00125;
((mappedLayout[1][4] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][4] as Unit).right as Connection).current = 0.00125;
((mappedLayout[1][4] as Unit).right as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[1][5] as Unit).left as Connection).current = 0.00125;
((mappedLayout[1][5] as Unit).left as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[1][5] as Unit).bottom as Connection).current = 0.00125;
((mappedLayout[1][5] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[3][3] as Unit).top as Connection).current = 0.0025;
((mappedLayout[3][3] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][3] as Unit).bottom as Connection).current = 0.0025;
((mappedLayout[3][3] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;  
((mappedLayout[3][3] as Unit).right as Connection).current = 0;
((mappedLayout[3][3] as Unit).right as Connection).currentFlow = CurrentFlow.NEUTRAL;

((mappedLayout[3][5] as Unit).top as Connection).current = 0.00125;
((mappedLayout[3][5] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[3][5] as Unit).bottom as Connection).current = 0.00125;
((mappedLayout[3][5] as Unit).bottom as Connection).currentFlow = CurrentFlow.OUTWARD;  
((mappedLayout[3][5] as Unit).left as Connection).current = 0;
((mappedLayout[3][5] as Unit).left as Connection).currentFlow = CurrentFlow.NEUTRAL;

((mappedLayout[5][5] as Unit).top as Connection).current = 0.00125;
((mappedLayout[5][5] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[5][5] as Unit).left as Connection).current = 0.00125;
((mappedLayout[5][5] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[5][4] as Unit).right as Connection).current = 0.00125;
((mappedLayout[5][4] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[5][4] as Unit).left as Connection).current = 0.00125;
((mappedLayout[5][4] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;  

((mappedLayout[5][3] as Unit).right as Connection).current = 0.00125;
((mappedLayout[5][3] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[5][3] as Unit).top as Connection).current = 0.0025;
((mappedLayout[5][3] as Unit).top as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[5][3] as Unit).left as Connection).current = 0.00375;
((mappedLayout[5][3] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;
((mappedLayout[5][3] as Unit).bottom as Connection).current = 0;
((mappedLayout[5][3] as Unit).bottom as Connection).currentFlow = CurrentFlow.NEUTRAL;

((mappedLayout[5][2] as Unit).right as Connection).current = 0.00375;
((mappedLayout[5][2] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[5][2] as Unit).left as Connection).current = 0.00375;
((mappedLayout[5][2] as Unit).left as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[5][1] as Unit).right as Connection).current = 0.00375;
((mappedLayout[5][1] as Unit).right as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[5][1] as Unit).top as Connection).current = 0.00375;
((mappedLayout[5][1] as Unit).top as Connection).currentFlow = CurrentFlow.OUTWARD;

((mappedLayout[4][1] as Unit).bottom as Connection).current = 0.00375;
((mappedLayout[4][1] as Unit).bottom as Connection).currentFlow = CurrentFlow.INWARD;
((mappedLayout[4][1] as Unit).top as Connection).current = 0.00375;
((mappedLayout[4][1] as Unit).top as Connection).currentFlow = CurrentFlow.OUTWARD;

export default {
  circuit,
  components,
  expected: {
    graph,
    layout,
    supernodePropagatedGraph,
    nodalAnalyzedGraph,
    DCPropagatedGraph,
    mappedLayout,
  },
};

