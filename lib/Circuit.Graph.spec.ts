import CircuitGraph, { Node, EdgeID, PinInfo, PinInfoMap, CurrentFlow } from './Circuit.Graph';
import { EC, createElectronic } from './Electronic';
import { PinName } from './Electronic.Info';

describe('Lib: Circuit.Graph', () => {
  describe('Initialization', () => {
    it('generates simple graph of circuit', () => {
      // [ a  a  a  a  a ] R: resistor
      // [ a +n  R  n  a ] S: DC Source
      // [ a  S  a  w  a ] G: Ground
      // [ a -n  n  w  a ]
      // [ a  a  G  a  a ]
      const resistor = createElectronic(EC.Resistor, { coordinate: [2, 1] });
      const source = createElectronic(EC.DCSource, { coordinate : [1, 2]});
      source.rotate();
      const ground = createElectronic(EC.Ground, { coordinate: [2, 4] });

      const graph = new CircuitGraph();
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

      expect(graph.edges.size).toBe(3);
      expect(graph.nodes.size).toBe(2);

      expect(e1.nodesMap).toMatchObject(new Map<PinName, Node | null>([
        ['1', n1],
        ['2', n2],
      ]));
      expect(e2.nodesMap).toMatchObject(new Map<PinName, Node | null>([
        ['POSITIVE', n1],
        ['NEGATIVE', n2],
      ]));
      expect(e3.nodesMap).toMatchObject(new Map<PinName, Node | null>([
        ['', n2],
      ]));

      const pinInfo11 = { edgeID: e1.id, pinName: '1', bias: 0, currentFlow: CurrentFlow.NEUTRAL };
      const pinInfo2Positive = { edgeID: e2.id, pinName: 'POSITIVE', bias: 0, currentFlow: CurrentFlow.NEUTRAL };
      expect(n1.info).toMatchObject(new Set<PinInfo>([
        pinInfo11,
        pinInfo2Positive,
      ]));

      const pinInfo12 = { edgeID: e1.id, pinName: '2', bias: 0, currentFlow: CurrentFlow.NEUTRAL };
      const pinInfo2Negative = { edgeID: e2.id, pinName: 'NEGATIVE', bias: 0, currentFlow: CurrentFlow.NEUTRAL };
      const pinInfo3 = { edgeID: e3.id, pinName: '', bias: 0, currentFlow: CurrentFlow.NEUTRAL };
      expect(n2.info).toMatchObject(new Set<PinInfo>([
        pinInfo12,
        pinInfo2Negative,
        pinInfo3,
      ]));

      expect(e1.pinsMap).toMatchObject(new Map<PinName, PinInfo>([
        ['1', pinInfo11],
        ['2', pinInfo12],
      ]));
      expect(e2.pinsMap).toMatchObject(new Map<PinName, PinInfo>([
        ['POSITIVE', pinInfo2Positive],
        ['NEGATIVE', pinInfo2Negative],
      ]));
      expect(e3.pinsMap).toMatchObject(new Map<PinName, PinInfo>([
        ['', pinInfo3],
      ]));

      expect(n1.edgePinInfoMap).toMatchObject(new Map<EdgeID, PinInfoMap>([
        [e1.id, new Map([['1', pinInfo11]])],
        [e2.id, new Map([['POSITIVE', pinInfo2Positive]])],
      ]));
      expect(n2.edgePinInfoMap).toMatchObject(new Map<EdgeID, PinInfoMap>([
        [e1.id, new Map([['2', pinInfo12]])],
        [e2.id, new Map([['NEGATIVE', pinInfo2Negative]])],
        [e3.id, new Map([['', pinInfo3]])],
      ]));
    });
  });
});
