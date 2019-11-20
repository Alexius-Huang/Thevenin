import CircuitGraph, { Node, Edge } from './Circuit.Graph';
import { EC, createElectronic } from './Electronic';

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

      expect(graph.edges.length).toBe(3);
      expect(graph.nodes.length).toBe(2);

      expect(e1.pinsMap).toMatchObject(new Map<string, Node | null>([
        ['1', n1],
        ['2', n2],
      ]));
      expect(e2.pinsMap).toMatchObject(new Map<string, Node | null>([
        ['POSITIVE', n1],
        ['NEGATIVE', n2],
      ]));
      expect(e3.pinsMap).toMatchObject(new Map<string, Node | null>([
        ['', n2],
      ]));

      expect(n1.edges).toMatchObject(new Set<{ edge: Edge, pinMeta: string }>([
        { edge: e1, pinMeta: '1' },
        { edge: e2, pinMeta: 'POSITIVE' },
      ]));
      expect(n2.edges).toMatchObject(new Set<{ edge: Edge, pinMeta: string }>([
        { edge: e1, pinMeta: '2' },
        { edge: e2, pinMeta: 'NEGATIVE' },
        { edge: e3, pinMeta: '' },
      ]));
    });
  });
});
